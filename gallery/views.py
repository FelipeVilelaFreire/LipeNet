from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  # Importamos o módulo de status!
from .models import Photo
from .serializers import PhotoSerializer
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
            # Se for válido, o .save() cria um novo objeto Photo no banco de dados.
            serializer.save()
            # Retornamos os dados do objeto recém-criado e um status HTTP "201 CREATED".
            return Response(serializer.data, status=status.HTTP_201_CREATED)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)