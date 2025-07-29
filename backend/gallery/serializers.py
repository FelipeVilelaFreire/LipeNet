from rest_framework import serializers
from .models import Photo,Tag,Person

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        tag = serializers.StringRelatedField(many=True,read_only=True)
        persons = serializers.StringRelatedField(many=True, read_only=True)
        fields = ['id', 'text', 'image', 'caption', 'created_at','tags','persons']