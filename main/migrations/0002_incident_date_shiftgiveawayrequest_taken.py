# Generated by Django 4.1.7 on 2024-01-29 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='date',
            field=models.DateField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='shiftgiveawayrequest',
            name='taken',
            field=models.BooleanField(default=1),
            preserve_default=False,
        ),
    ]
