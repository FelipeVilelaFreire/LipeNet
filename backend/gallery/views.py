from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Photo,Tag, Person
from .serializers import PhotoSerializer,PersonSerializer
from PIL import Image
from transformers import pipeline
import face_recognition
import numpy as np

# --- Carregamento do Modelo de IA ---
print("Carregando o modelo de IA para geração de legendas...")
# Carregamos o modelo uma vez quando este arquivo é lido pelo servidor Django
captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")     #Image-to-text geral
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")         #Gerar tags
print("Modelos de IA carregados.")

print("Carregando rostos conhecidos do banco de dados...")
known_face_encodings = []
known_face_names = []
for person in Person.objects.all():
    known_face_encodings.append(person.encoding)
    known_face_names.append(person.name)
print(f"{len(known_face_names)} rostos conhecidos carregados.")


class PhotoListAPIView(APIView):
    """
    Esta View vai listar todas as fotos do banco de dados.
    """
    def get(self, request):
        # 1. Buscar todos os objetos 'Photo' no banco de dados.
        photos = Photo.objects.all()

        # 2. Passar a lista de objetos para o nosso 'tradutor' (Serializer).
        #    'many=True' é crucial aqui. Ele diz ao serializer que estamos passando
        #    uma lista de objetos, e não apenas um.
        serializer = PhotoSerializer(photos, many=True)

        # 3. Retornar a resposta.
        #    'serializer.data' contém os dados já traduzidos para um formato
        #    que o DRF consegue facilmente converter para JSON.
        return Response(serializer.data)

    # Dentro da classe PhotoListAPIView em backend/gallery/views.py

    def post(self, request):
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']
            pil_image = Image.open(image_file).convert("RGB")

            # --- IA de Legenda (Como já estava) ---
            generated_caption = captioner(pil_image)[0]['generated_text']

            # Salvamos primeiro para ter uma instância da foto
            photo_instance = serializer.save(caption=generated_caption)

            # --- IA de Detecção de Objetos (Como já estava) ---
            detected_objects = object_detector(pil_image)
            found_tags = set()

            for obj in detected_objects:
                if obj['score'] > 0.85:
                    found_tags.add(obj['label'])
            for tag_name in found_tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                photo_instance.tags.add(tag)

            # --- NOVA LÓGICA DE RECONHECIMENTO FACIAL ---
            print("Iniciando reconhecimento facial...")
            numpy_image = np.array(pil_image)

            face_locations = face_recognition.face_locations(numpy_image)
            # LINHA DE DEPURAÇÃO 1: Vamos ver se algum rosto foi encontrado
            print(f"--- Depuração Facial: {len(face_locations)} rosto(s) encontrado(s) na imagem.")

            face_encodings = face_recognition.face_encodings(numpy_image, face_locations)
            # LINHA DE DEPURAÇÃO 2: Vamos ver se algum "encoding" foi gerado
            print(f"--- Depuração Facial: {len(face_encodings)} encoding(s) de rosto gerado(s).")

            for face_encoding in face_encodings:
                # Comparamos o rosto encontrado com nossos rostos conhecidos
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Pessoa Desconhecida"

                if True in matches:
                    first_match_index = matches.index(True)
                    name = known_face_names[first_match_index]
                    print(f"Rosto conhecido encontrado: {name}")
                    person = Person.objects.get(name=name)
                    photo_instance.persons.add(person)
                else:
                    # Se for um rosto novo, criamos um novo registro de Pessoa
                    # Nota: em um app real, teríamos uma interface para o usuário dar o nome
                    new_person = Person.objects.create(name=f"Pessoa Desconhecida #{Person.objects.count() + 1}",
                                                       encoding=list(face_encoding))
                    photo_instance.persons.add(new_person)
                    print(f"Novo rosto detectado e salvo como {new_person.name}")
                    # Adicionamos ao nosso cache em memória para reconhecê-lo na mesma sessão
                    known_face_encodings.append(list(face_encoding))
                    known_face_names.append(new_person.name)

            # -------------------------------------------

            final_serializer = PhotoSerializer(photo_instance)
            return Response(final_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhotoDetailAPIView(APIView):
        """
        View para buscar, atualizar ou deletar uma única instância de Photo.
        """
        def get_object(self, pk):
            # Função auxiliar para pegar o objeto ou retornar um erro 404
            try:
                return Photo.objects.get(pk=pk)
            except Photo.DoesNotExist:
                raise Http404

        def get(self, request, pk):
            # Usamos nossa função auxiliar para pegar a foto
            photo = self.get_object(pk)
            # Usamos o MESMO serializer, mas sem 'many=True'
            serializer = PhotoSerializer(photo)
            return Response(serializer.data)

        def put(self, request, pk):
            photo = self.get_object(pk)
            # Para atualizar, passamos a instância original E os novos dados.
            serializer = PhotoSerializer(photo, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        def delete(self, request, pk):
            photo = self.get_object(pk)
            photo.delete()
            # Para um delete bem-sucedido, retornamos uma resposta "Sem Conteúdo".
            return Response(status=status.HTTP_204_NO_CONTENT)

class PersonDetailAPIView(APIView):
    """
    View para buscar e atualizar os dados de uma única pessoa.
    """
    def get_object(self, pk):
        try:
            return Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            raise Http404

    # Método para buscar os dados de uma pessoa (GET)
    def get(self, request, pk):
        person = self.get_object(pk)
        serializer = PersonSerializer(person)
        return Response(serializer.data)

    # Método para atualizar os dados de uma pessoa (PATCH)
    def patch(self, request, pk):
        person = self.get_object(pk)
        # Usamos partial=True para permitir atualizações parciais (só o nome)
        serializer = PersonSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)