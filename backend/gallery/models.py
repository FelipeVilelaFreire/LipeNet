from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Person(models.Model):
    name = models.CharField(max_length=100)
    # JSONField é perfeito para armazenar a lista de 128 números do encoding.
    encoding = models.JSONField()
    photo_principal = models.ForeignKey(
        'Photo',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='main_photo_for_person'
    )

    def __str__(self):
        return self.name

class Photo(models.Model):
    owner = models.ForeignKey(User, related_name='photos', on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='photos/')
    # TextField é para textos longos. blank=True e null=True significam que este campo é opcional.
    caption = models.TextField(blank=True, null=True)
    # Coluna para registrar a data e hora do upload.
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag,blank=True)
    persons = models.ManyToManyField(Person, blank=True)

    def __str__(self):
        # É uma boa prática retornar algo que não possa ser nulo, como o ID
        return f"Photo by {self.owner.username} ({self.id})"

# Create your models here.
