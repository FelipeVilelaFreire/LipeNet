from rest_framework import serializers
from .models import Photo, Tag, Person


class PhotoSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)
    persons = serializers.StringRelatedField(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ['id', 'text', 'image', 'caption', 'caption_pt', 'created_at', 'tags', 'persons', 'is_favorite']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None


class PersonSerializer(serializers.ModelSerializer):
    representative_photo = serializers.SerializerMethodField()
    photo_count = serializers.SerializerMethodField()
    first_photo = serializers.SerializerMethodField()
    photo_principal = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['id', 'name', 'encoding', 'representative_photo', 'photo_count', 'first_photo', 'photo_principal']
        read_only_fields = ['encoding']

    def get_representative_photo(self, person_obj):
        request = self.context.get('request')
        if person_obj.photo_principal:
            if request:
                return request.build_absolute_uri(person_obj.photo_principal.image.url)
            return person_obj.photo_principal.image.url
        return self.get_first_photo(person_obj)
    
    def get_photo_principal(self, person_obj):
        request = self.context.get('request')
        if person_obj.photo_principal:
            if request:
                return request.build_absolute_uri(person_obj.photo_principal.image.url)
            return person_obj.photo_principal.image.url
        return None
    
    def get_first_photo(self, person_obj):
        request = self.context.get('request')
        first_photo = person_obj.photo_set.first()
        if first_photo:
            if request:
                return request.build_absolute_uri(first_photo.image.url)
            return first_photo.image.url
        return None
    
    def get_photo_count(self, person_obj):
        return person_obj.photo_set.count()