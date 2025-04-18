# Generated by Django 5.1.7 on 2025-04-18 13:43

import tasks_management.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks_management', '0009_remove_account_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='first_login',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='profile_image',
            field=models.ImageField(blank=True, default='user_default.png', null=True, upload_to='profile_images/', validators=[tasks_management.models.validate_image_size]),
        ),
    ]
