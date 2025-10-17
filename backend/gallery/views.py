"""Views da aplicação Gallery - Endpoints da API REST"""

import json
from PIL import Image, ImageEnhance

from django.http import Http404
from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Photo, Person
from .serializers import PhotoSerializer, PersonSerializer
from .funcoes_ia import (
    captioner,
    object_detector,
    enhance_description,
    detect_faces_for_preview,
    process_photo_with_ai,
    delete_photo_file,
    clear_photo_references,
    update_face_cache_after_delete,
    translate_caption_to_portuguese
)


# ============================================================================
# FOTOS - Upload e gerenciamento
# ============================================================================

class PhotoListAPIView(APIView):
    """GET: Lista fotos | POST: Upload com IA"""

    def get(self, request):
        photos = Photo.objects.all().order_by('-created_at')
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Upload de foto com processamento IA e seleção de pessoas"""
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "Nenhuma imagem foi enviada"}, status=status.HTTP_400_BAD_REQUEST)

        user_description = request.data.get('text', '')
        selected_person_ids = request.data.get('selected_persons', '[]')
        custom_person_names = request.data.get('custom_person_names', '{}')  # Novos nomes editados
        new_persons_data = request.data.get('new_persons', '[]')  # Novas pessoas para criar

        try:
            selected_person_ids = json.loads(selected_person_ids) if isinstance(selected_person_ids, str) else selected_person_ids
        except:
            selected_person_ids = []

        try:
            custom_person_names = json.loads(custom_person_names) if isinstance(custom_person_names, str) else custom_person_names
        except:
            custom_person_names = {}

        try:
            new_persons_data = json.loads(new_persons_data) if isinstance(new_persons_data, str) else new_persons_data
        except:
            new_persons_data = []

        photo = Photo(image=image_file)
        if user_description:
            photo.text = user_description

        photo = process_photo_with_ai(photo, image_file)

        # Substitui pessoas detectadas automaticamente pelas selecionadas pelo usuário
        if selected_person_ids is not None:
            photo.persons.clear()
            for person_id in selected_person_ids:
                if person_id:
                    try:
                        person = Person.objects.get(id=person_id)

                        # Se houver um nome customizado para esta pessoa, atualiza
                        custom_name = custom_person_names.get(str(person_id))
                        if custom_name and custom_name.strip():
                            person.name = custom_name.strip()
                            person.save()

                        photo.persons.add(person)
                    except Person.DoesNotExist:
                        pass

        # Cria novas pessoas (Pessoa Desconhecida renomeada)
        if new_persons_data:
            from .funcoes_ia import known_face_encodings, known_face_names

            for new_person_data in new_persons_data:
                person_name = new_person_data.get('name', '').strip()
                person_encoding = new_person_data.get('encoding')

                if person_name and person_encoding:
                    # Verifica se já existe pessoa com esse nome
                    existing_person = Person.objects.filter(name=person_name).first()

                    if existing_person:
                        # Se existe, apenas associa à foto
                        photo.persons.add(existing_person)
                    else:
                        # Cria nova pessoa com o encoding fornecido
                        new_person = Person.objects.create(
                            name=person_name,
                            encoding=person_encoding,
                            photo_principal=photo
                        )
                        photo.persons.add(new_person)

                        # Atualiza cache global
                        known_face_encodings.append(person_encoding)
                        known_face_names.append(person_name)

        serializer = PhotoSerializer(photo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PhotoPreviewAPIView(APIView):
    """POST: Gera preview de IA sem salvar (caption + pessoas detectadas)"""

    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "Nenhuma imagem foi enviada"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pil_image = Image.open(image_file).convert('RGB')

            # Redimensiona se necessário (max 2048px)
            if pil_image.width > 2048 or pil_image.height > 2048:
                pil_image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)

            # Ajusta contraste para melhor detecção
            enhancer = ImageEnhance.Contrast(pil_image)
            pil_image_enhanced = enhancer.enhance(1.1)

            # Gera caption
            caption_results = captioner(pil_image_enhanced, max_new_tokens=50)
            basic_caption = caption_results[0]['generated_text'] if caption_results else "Image processed"

            # Detecta objetos
            detected_objects = sorted(object_detector(pil_image_enhanced), key=lambda x: x['score'], reverse=True)

            # Detecta rostos ANTES de enriquecer a descrição
            detected_persons = detect_faces_for_preview(pil_image)

            # Extrai nomes das pessoas detectadas para personalização
            person_names = [person['name'] for person in detected_persons]

            # Enriquece descrição COM nomes das pessoas
            enhanced_caption = enhance_description(basic_caption, detected_objects, pil_image, person_names)

            # Traduz para português
            enhanced_caption_pt = translate_caption_to_portuguese(enhanced_caption)

            return Response({
                "caption": enhanced_caption,
                "caption_pt": enhanced_caption_pt,
                "detected_persons": detected_persons
            })

        except Exception as e:
            return Response({"error": "Erro ao processar imagem", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PhotoDetailAPIView(APIView):
    """GET: Detalhes da foto | DELETE: Remove foto"""

    def get_object(self, pk):
        try:
            return Photo.objects.get(pk=pk)
        except Photo.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        photo = self.get_object(pk)
        serializer = PhotoSerializer(photo, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        photo = self.get_object(pk)
        clear_photo_references(photo)
        delete_photo_file(photo)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# BUSCA
# ============================================================================

class SearchView(APIView):
    """GET: Busca fotos por texto (text, caption, tags, pessoas)"""

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"results": []})

        # Busca por palavras separadas
        query_words = query.lower().split()
        q_objects = Q()

        for word in query_words:
            q_objects |= (
                Q(text__icontains=word) |
                Q(caption__icontains=word) |
                Q(tags__name__icontains=word) |
                Q(persons__name__icontains=word)
            )

        photos = Photo.objects.filter(q_objects).distinct().order_by('-created_at')
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response({"results": serializer.data})


# ============================================================================
# PESSOAS - Gerenciamento
# ============================================================================

class PersonListAPIView(APIView):
    """GET: Lista pessoas (2+ fotos ou adicionadas manualmente)"""

    def get(self, request):
        persons = Person.objects.annotate(num_photos=Count('photo')).filter(
            Q(num_photos__gte=2) | Q(is_manually_added=True)
        )
        serializer = PersonSerializer(persons, many=True, context={'request': request})
        return Response(serializer.data)


class HiddenPersonsAPIView(APIView):
    """GET: Lista pessoas com apenas 1 foto (ocultas)"""

    def get(self, request):
        persons = Person.objects.annotate(num_photos=Count('photo')).filter(
            num_photos=1,
            is_manually_added=False
        )
        serializer = PersonSerializer(persons, many=True, context={'request': request})
        return Response(serializer.data)


class PersonDetailAPIView(APIView):
    """GET: Detalhes da pessoa | PATCH: Atualiza nome | DELETE: Remove pessoa"""

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
        serializer = PersonSerializer(person, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            full_serializer = PersonSerializer(person, context={'request': request})
            return Response(full_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        person = self.get_object(pk)
        person_name = person.name

        person.photo_set.clear()
        if person.photo_principal:
            person.photo_principal = None
            person.save()

        person.delete()
        update_face_cache_after_delete(person_name)

        return Response(status=status.HTTP_204_NO_CONTENT)


class PersonPhotoListAPIView(APIView):
    """GET: Lista todas as fotos de uma pessoa"""

    def get(self, request, pk):
        try:
            person = Person.objects.get(pk=pk)
            photos = person.photo_set.all().order_by('-created_at')
            serializer = PhotoSerializer(photos, many=True, context={'request': request})
            return Response(serializer.data)
        except Person.DoesNotExist:
            return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)


class AddPersonManuallyAPIView(APIView):
    """POST: Adiciona pessoa manualmente à lista visível"""

    def post(self, request, pk):
        try:
            person = Person.objects.get(pk=pk)
            person.is_manually_added = True
            person.save()
            serializer = PersonSerializer(person, context={'request': request})
            return Response(serializer.data)
        except Person.DoesNotExist:
            return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)


class UpdatePersonPhotoAPIView(APIView):
    """PATCH: Atualiza foto de perfil da pessoa"""

    def patch(self, request, pk):
        try:
            person = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)

        if 'photo_principal' not in request.FILES:
            return Response({"error": "Nenhuma foto foi enviada"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_file = request.FILES['photo_principal']
            new_photo = Photo.objects.create(image=image_file, caption=f"Foto de perfil de {person.name}")
            new_photo.persons.add(person)

            person.photo_principal = new_photo
            person.save()

            serializer = PersonSerializer(person, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": f"Erro ao processar imagem: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================================
# FAVORITOS
# ============================================================================

class ToggleFavoriteAPIView(APIView):
    """POST: Alterna status de favorito da foto"""

    def post(self, request, pk):
        try:
            photo = Photo.objects.get(pk=pk)
            photo.is_favorite = not photo.is_favorite
            photo.save()
            serializer = PhotoSerializer(photo, context={'request': request})
            return Response(serializer.data)
        except Photo.DoesNotExist:
            return Response({"error": "Foto não encontrada"}, status=status.HTTP_404_NOT_FOUND)


class FavoritePhotosAPIView(APIView):
    """GET: Lista todas as fotos favoritas"""

    def get(self, request):
        photos = Photo.objects.filter(is_favorite=True).order_by('-created_at')
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)
