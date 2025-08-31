"""
Views da aplicação Gallery
==========================

Este módulo contém todas as views (endpoints) da API REST.
As funções de IA foram movidas para funcoes_ia.py para melhor organização.
"""

from django.http import Http404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Photo, Person
from .serializers import PhotoSerializer, PersonSerializer
from .funcoes_ia import (
    process_photo_with_ai,
    delete_photo_file,
    clear_photo_references,
    update_face_cache_after_delete
)


# ========================================================================================
# VIEWS - FOTOS
# ========================================================================================

class PhotoListAPIView(APIView):
    """
    View para listar todas as fotos e criar novas fotos.
    
    Endpoints:
        GET /api/photos/  - Lista todas as fotos ordenadas por data
        POST /api/photos/ - Faz upload de nova foto e processa com IA
    """
    
    def get(self, request):
        """Lista todas as fotos ordenadas por data de criação (mais recente primeiro)"""
        photos = Photo.objects.all().order_by('-created_at')
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """
        Faz upload de uma nova foto e processa com IA.
        
        Processo:
        1. Recebe arquivo de imagem
        2. Cria objeto Photo
        3. Processa com IA (caption, tags, reconhecimento facial)
        4. Retorna foto processada
        """
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {"error": "Nenhuma imagem foi enviada"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cria objeto Photo com a imagem
        photo = Photo(image=image_file)
        
        # Processa a foto com IA (gera caption, tags, detecta rostos)
        photo = process_photo_with_ai(photo, image_file)
        
        # Serializa e retorna a foto processada
        serializer = PhotoSerializer(photo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PhotoDetailAPIView(APIView):
    """
    View para operações em uma foto específica.
    
    Endpoints:
        GET /api/photos/{id}/    - Retorna detalhes de uma foto
        DELETE /api/photos/{id}/ - Remove uma foto e suas referências
    """
    
    def get_object(self, pk):
        """Helper para obter foto ou retornar 404"""
        try:
            return Photo.objects.get(pk=pk)
        except Photo.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        """Retorna os detalhes de uma foto específica"""
        photo = self.get_object(pk)
        serializer = PhotoSerializer(photo, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        """
        Deleta uma foto, removendo:
        - Referências como foto principal de pessoas
        - Arquivo físico do disco
        - Registro do banco de dados
        """
        photo = self.get_object(pk)
        
        # Limpa referências da foto em pessoas
        clear_photo_references(photo)
        
        # Deleta arquivo físico
        delete_photo_file(photo)
        
        # Remove do banco de dados
        photo.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


# ========================================================================================
# VIEWS - BUSCA
# ========================================================================================

class SearchView(APIView):
    """
    View para buscar fotos por texto.
    
    Endpoint:
        GET /api/search/?q=texto - Busca fotos por caption, tags ou pessoas
    """
    
    def get(self, request):
        """
        Busca fotos que contenham o texto em:
        - Caption (descrição gerada pela IA)
        - Tags (categorias)
        - Nomes de pessoas
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({"results": []})

        # Busca em múltiplos campos usando Q objects
        photos = Photo.objects.filter(
            Q(caption__icontains=query) |      # Busca na descrição
            Q(tags__name__icontains=query) |    # Busca nas tags
            Q(persons__name__icontains=query)   # Busca nos nomes das pessoas
        ).distinct()  # distinct() evita duplicatas

        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response({"results": serializer.data})


# ========================================================================================
# VIEWS - PESSOAS
# ========================================================================================

class PersonListAPIView(APIView):
    """
    View para listar todas as pessoas identificadas.
    
    Endpoint:
        GET /api/persons/ - Lista todas as pessoas do sistema
    """
    
    def get(self, request):
        """Retorna lista de todas as pessoas identificadas pelo sistema"""
        persons = Person.objects.all()
        serializer = PersonSerializer(persons, many=True, context={'request': request})
        return Response(serializer.data)


class PersonDetailAPIView(APIView):
    """
    View para operações em uma pessoa específica.
    
    Endpoints:
        GET /api/persons/{id}/    - Retorna detalhes de uma pessoa
        PATCH /api/persons/{id}/  - Atualiza dados de uma pessoa (ex: nome)
        DELETE /api/persons/{id}/ - Remove uma pessoa do sistema
    """
    
    def get_object(self, pk):
        """Helper para obter pessoa ou retornar 404"""
        try:
            return Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        """Retorna detalhes de uma pessoa específica"""
        person = self.get_object(pk)
        serializer = PersonSerializer(person, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        """
        Atualização parcial de uma pessoa.
        Geralmente usado para renomear a pessoa.
        """
        person = self.get_object(pk)
        serializer = PersonSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Remove uma pessoa do sistema:
        1. Remove a pessoa de todas as fotos
        2. Limpa referência de foto principal
        3. Deleta do banco
        4. Atualiza cache de reconhecimento facial
        """
        person = self.get_object(pk)
        person_name = person.name
        
        # Remove pessoa de todas as fotos onde aparece
        person.photo_set.clear()
        
        # Remove referência de foto principal se existir
        if person.photo_principal:
            person.photo_principal = None
            person.save()
        
        # Deleta pessoa do banco
        person.delete()
        
        # Atualiza cache de rostos conhecidos
        update_face_cache_after_delete(person_name)
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class UpdatePersonPhotoAPIView(APIView):
    """
    View específica para atualizar foto de perfil de uma pessoa.
    
    Endpoint:
        PATCH /api/persons/{id}/update-photo/ - Atualiza foto principal da pessoa
    """
    
    def patch(self, request, pk):
        """
        Atualiza a foto principal (perfil) de uma pessoa.
        Cria uma nova foto e a define como principal.
        """
        try:
            person = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return Response(
                {"error": "Pessoa não encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verifica se foi enviada uma foto
        if 'photo_principal' not in request.FILES:
            return Response(
                {"error": "Nenhuma foto foi enviada"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['photo_principal']
        
        try:
            # Cria nova foto no sistema
            new_photo = Photo.objects.create(
                image=image_file,
                caption=f"Foto de perfil de {person.name}"
            )
            
            # Associa a pessoa à foto
            new_photo.persons.add(person)
            
            # Define como foto principal
            person.photo_principal = new_photo
            person.save()
            
            # Retorna pessoa atualizada
            serializer = PersonSerializer(person, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Erro ao processar imagem: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PersonPhotoListAPIView(APIView):
    """
    View para listar todas as fotos de uma pessoa específica.
    
    Endpoint:
        GET /api/persons/{id}/photos/ - Lista todas as fotos onde a pessoa aparece
    """
    
    def get(self, request, pk):
        """Retorna todas as fotos onde uma pessoa específica foi identificada"""
        try:
            person = Person.objects.get(pk=pk)
            # photo_set é a relação reversa do ManyToMany
            photos = person.photo_set.all().order_by('-created_at')
            serializer = PhotoSerializer(photos, many=True, context={'request': request})
            return Response(serializer.data)
        except Person.DoesNotExist:
            return Response(
                {"error": "Pessoa não encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )