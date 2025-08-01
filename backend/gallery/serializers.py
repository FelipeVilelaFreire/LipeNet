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
    representative_photo = serializers.SerializerMethodField()

    class Meta:
        model = Person
        # O nome do campo no JSON continua 'representative_photo' para não quebrar nosso frontend
        fields = ['id', 'name', 'encoding', 'representative_photo']
        read_only_fields = ['encoding']

    # --- LÓGICA ATUALIZADA ---
    def get_representative_photo(self, person_obj):
        # A lógica agora é muito mais simples e rápida!
        if person_obj.photo_principal:
            request = self.context.get('request')
            # Acessamos diretamente a foto principal que está linkada
            return request.build_absolute_uri(person_obj.photo_principal.image.url)
        return None