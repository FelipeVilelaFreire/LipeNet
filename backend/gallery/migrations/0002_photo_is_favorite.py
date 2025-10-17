# Generated manually to add is_favorite field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='is_favorite',
            field=models.BooleanField(default=False),
        ),
    ]