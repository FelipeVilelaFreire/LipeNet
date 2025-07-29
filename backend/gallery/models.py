from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Photo(models.Model):
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='photos/')
    # TextField é para textos longos. blank=True e null=True significam que este campo é opcional.
    caption = models.TextField(blank=True, null=True)
    # Coluna para registrar a data e hora do upload.
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag,blank=True)

    def __str__(self):
        return self.text

# Create your models here.
