# Generated manually
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0002_photo_is_favorite'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='is_manually_added',
            field=models.BooleanField(default=False),
        ),
    ]