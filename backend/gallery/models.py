from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Person(models.Model):
    name = models.CharField(max_length=100)
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
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='photos/')
    caption = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, blank=True)
    persons = models.ManyToManyField(Person, blank=True)
