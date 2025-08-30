import warnings

warnings.filterwarnings("ignore", category=UserWarning, module='torch.nn.modules.module')
warnings.filterwarnings("ignore", category=FutureWarning, module='transformers.models.auto.modeling_auto')

from django.http import Http404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from transformers import pipeline
import face_recognition
import numpy as np
from collections import Counter

from .models import Photo, Tag, Person
from .serializers import PhotoSerializer, PersonSerializer

# Carregamento dos modelos IA
print("Carregando modelos de IA...")
captioner = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")
print("Modelos carregados.")

# Cache de rostos conhecidos
known_face_encodings = []
known_face_names = []
for person in Person.objects.all():
    known_face_encodings.append(person.encoding)
    known_face_names.append(person.name)
print(f"{len(known_face_names)} rostos carregados.")


def enhance_description(basic_caption, detected_objects, pil_image):
    """Enriquece a descrição básica com contexto visual"""
    enhanced_parts = [basic_caption]

    # Adiciona objetos principais
    main_objects = []
    for obj in detected_objects:
        if obj['score'] > 0.85:
            obj_name = obj['label'].replace('_', ' ').replace('-', ' ')
            main_objects.append(obj_name)

    if main_objects:
        unique_objects = list(set(main_objects))[:4]
        if len(unique_objects) > 1:
            enhanced_parts.append(f"showing {', '.join(unique_objects[:-1])} and {unique_objects[-1]}")
        else:
            enhanced_parts.append(f"featuring {unique_objects[0]}")

    # Análise de cores e iluminação
    try:
        img_sample = pil_image.resize((64, 64))
        avg_color = np.mean(np.array(img_sample), axis=(0, 1))

        # Temperatura de cor
        if avg_color[0] > avg_color[1] + 25 and avg_color[0] > avg_color[2] + 25:
            enhanced_parts.append("with warm reddish lighting")
        elif avg_color[2] > avg_color[0] + 25 and avg_color[2] > avg_color[1] + 25:
            enhanced_parts.append("with cool blue tones")
        elif avg_color[1] > avg_color[0] + 20 and avg_color[1] > avg_color[2] + 20:
            enhanced_parts.append("with natural green ambiance")

        # Nível de brilho
        brightness = np.mean(avg_color)
        if brightness > 190:
            enhanced_parts.append("in bright conditions")
        elif brightness < 80:
            enhanced_parts.append("in low-light setting")
        elif brightness > 140:
            enhanced_parts.append("in good lighting")

    except Exception:
        pass

    return " ".join(enhanced_parts)


def generate_smart_tags(detected_objects, pil_image):
    """Gera tags contextuais baseadas em objetos e cores"""
    found_tags = set()
    object_counts = Counter()

    # Tags de objetos detectados
    for obj in detected_objects:
        if obj['score'] > 0.75:
            tag_name = obj['label'].lower().replace('_', ' ').replace('-', ' ')
            object_counts[tag_name] += 1
            found_tags.add(tag_name)

    objects_list = list(object_counts.keys())

    # Tags contextuais por categoria
    context_mapping = {
        'transportation': ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
        'nature': ['tree', 'grass', 'flower', 'plant', 'leaf'],
        'architecture': ['building', 'house', 'skyscraper'],
        'furniture': ['chair', 'table', 'couch', 'bed', 'desk'],
        'food': ['food', 'cake', 'pizza', 'sandwich', 'fruit'],
        'animal': ['cat', 'dog', 'bird', 'horse'],
        'technology': ['book', 'laptop', 'phone', 'computer']
    }

    for context, keywords in context_mapping.items():
        if any(obj in objects_list for obj in keywords):
            found_tags.add(context)

    # Tags específicas para pessoas
    if any(obj in objects_list for obj in ['person', 'people']):
        if object_counts.get('person', 0) > 1:
            found_tags.update(['group', 'social'])
        else:
            found_tags.add('portrait')

    # Ambiente (indoor/outdoor)
    if any(obj in objects_list for obj in ['tree', 'grass', 'sky', 'cloud']):
        found_tags.add('outdoor')
    elif any(obj in objects_list for obj in ['chair', 'table', 'bed', 'wall']):
        found_tags.add('indoor')

    # Análise de cores
    try:
        img_small = pil_image.resize((32, 32))
        avg_color = np.mean(np.array(img_small), axis=(0, 1))

        # Dominância de cor
        if avg_color[0] > avg_color[1] + 30 and avg_color[0] > avg_color[2] + 30:
            found_tags.add('warm colors')
        elif avg_color[2] > avg_color[0] + 30 and avg_color[2] > avg_color[1] + 30:
            found_tags.add('cool colors')
        elif avg_color[1] > avg_color[0] + 25 and avg_color[1] > avg_color[2] + 25:
            found_tags.add('natural colors')

        # Brilho e saturação
        brightness = np.mean(avg_color)
        saturation = np.std(avg_color)

        if brightness > 200:
            found_tags.update(['bright', 'high contrast'])
        elif brightness < 80:
            found_tags.update(['dark', 'moody'])

        if saturation > 40:
            found_tags.update(['vibrant', 'colorful'])
        elif saturation < 15:
            found_tags.update(['monochrome', 'subtle'])

    except Exception:
        pass

    return found_tags


def process_facial_recognition(pil_image, photo_instance):
    """Executa reconhecimento facial e associa pessoas à foto"""
    global known_face_encodings, known_face_names

    numpy_image = np.array(pil_image)
    face_locations = face_recognition.face_locations(numpy_image)

    if not face_locations:
        print("Nenhum rosto encontrado")
        return

    print(f"Processando {len(face_locations)} rosto(s)")
    face_encodings = face_recognition.face_encodings(numpy_image, face_locations)

    for i, face_encoding in enumerate(face_encodings):
        # Busca por rostos conhecidos
        matches = face_recognition.compare_faces(
            known_face_encodings,
            face_encoding,
            tolerance=0.6
        )

        if True in matches:
            # Rosto conhecido encontrado
            match_index = matches.index(True)
            person_name = known_face_names[match_index]
            person = Person.objects.get(name=person_name)
            photo_instance.persons.add(person)
            print(f"Rosto #{i + 1}: {person_name} (reconhecido)")
        else:
            # Novo rosto - criar nova pessoa
            unknown_count = Person.objects.filter(name__startswith="Pessoa Desconhecida").count()
            new_person = Person.objects.create(
                name=f"Pessoa Desconhecida #{unknown_count + 1}",
                encoding=list(face_encoding)
            )
            photo_instance.persons.add(new_person)
            print(f"Rosto #{i + 1}: {new_person.name} (novo)")

            # Atualiza cache de rostos conhecidos
            known_face_encodings.append(list(face_encoding))
            known_face_names.append(new_person.name)


class PhotoListAPIView(APIView):
    def get(self, request):
        photos = Photo.objects.all()
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PhotoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        image_file = serializer.validated_data['image']
        pil_image = Image.open(image_file).convert("RGB")

        # 1. Geração de descrição avançada
        print("Gerando descrição...")
        basic_caption = captioner(pil_image)[0]['generated_text']
        detected_objects = object_detector(pil_image)
        enhanced_caption = enhance_description(basic_caption, detected_objects, pil_image)

        photo_instance = serializer.save(caption=enhanced_caption)
        print(f"Descrição: {enhanced_caption}")

        # 2. Sistema de tags inteligentes
        print("Gerando tags...")
        smart_tags = generate_smart_tags(detected_objects, pil_image)
        for tag_name in smart_tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            photo_instance.tags.add(tag)
        print(f"Tags ({len(smart_tags)}): {', '.join(list(smart_tags)[:8])}")

        # 3. Reconhecimento facial
        print("Reconhecimento facial...")
        process_facial_recognition(pil_image, photo_instance)

        final_serializer = PhotoSerializer(photo_instance)
        return Response(final_serializer.data, status=status.HTTP_201_CREATED)


class PhotoDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Photo.objects.get(pk=pk)
        except Photo.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        photo = self.get_object(pk)
        serializer = PhotoSerializer(photo)
        return Response(serializer.data)

    def put(self, request, pk):
        photo = self.get_object(pk)
        serializer = PhotoSerializer(photo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        photo = self.get_object(pk)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PersonListAPIView(APIView):
    def get(self, request):
        persons = Person.objects.all().order_by('name')
        serializer = PersonSerializer(persons, many=True, context={'request': request})
        return Response(serializer.data)


class PersonDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        person = self.get_object(pk)
        serializer = PersonSerializer(person, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        person = self.get_object(pk)
        serializer = PersonSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonPhotoListAPIView(APIView):
    def get(self, request, pk):
        try:
            person = Person.objects.get(pk=pk)
            photos = person.photo_set.all()
            serializer = PhotoSerializer(photos, many=True, context={'request': request})
            return Response(serializer.data)
        except Person.DoesNotExist:
            raise Http404


class SearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query', None)

        if query is None:
            return Response([], status=status.HTTP_400_BAD_REQUEST)

        search_filter = (
                Q(text__icontains=query) |
                Q(caption__icontains=query) |
                Q(tags__name__icontains=query) |
                Q(persons__name__icontains=query)
        )

        photos = Photo.objects.filter(search_filter).distinct()
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)