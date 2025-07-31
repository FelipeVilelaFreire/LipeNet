from rest_framework import serializers
from .models import Photo,Tag,Person

class PhotoSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)
    persons = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Photo
        # Adicionamos 'tags' de volta à lista
        fields = ['id', 'text', 'image', 'caption', 'created_at', 'tags', 'persons']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'encoding']
        # Definimos o encoding como "somente leitura"
        read_only_fields = ['encoding']