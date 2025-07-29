from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Photo,Tag
from .serializers import PhotoSerializer
from PIL import Image
from transformers import pipeline

# --- Carregamento do Modelo de IA ---
print("Carregando o modelo de IA para geração de legendas...")
# Carregamos o modelo uma vez quando este arquivo é lido pelo servidor Django
captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")     #Image-to-text geral
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")         #Gerar tags
print("Modelos de IA carregados.")



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

    def post(self, request):
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']
            pil_image = Image.open(image_file).convert("RGB")
            generated_caption = captioner(pil_image)[0]['generated_text']

            # Primeiro, salvamos a foto com a legenda para obter um objeto com ID
            photo_instance = serializer.save(caption=generated_caption)

            detected_objects = object_detector(pil_image)

            # Criamos um conjunto para evitar tags duplicadas
            print("--- OBJETOS DETECTADOS PELA IA (ANTES DO FILTRO) ---")
            print(detected_objects)
            found_tags = set()
            for obj in detected_objects:
                tag_name = obj['label']
                # Adicionamos apenas tags com uma pontuação de confiança razoável
                if obj['score'] > 0.8:
                    found_tags.add(tag_name)

            # Para cada nome de tag encontrado, pegamos ou criamos o objeto Tag
            for tag_name in found_tags:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                photo_instance.tags.add(tag)  # Associamos a tag à foto

            # Precisamos reserializar a instância para incluir as tags na resposta
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