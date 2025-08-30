from rest_framework import serializers
from .models import Photo, Tag, Person


class PhotoSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)
    persons = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = ['id', 'text', 'image', 'caption', 'created_at', 'tags', 'persons']


class PersonSerializer(serializers.ModelSerializer):
    representative_photo = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['id', 'name', 'encoding', 'representative_photo']
        read_only_fields = ['encoding']

    def get_representative_photo(self, person_obj):
        if person_obj.photo_principal:
            request = self.context.get('request')
            return request.build_absolute_uri(person_obj.photo_principal.image.url)
        return None