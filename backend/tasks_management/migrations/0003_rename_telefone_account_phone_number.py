# Generated by Django 5.1.7 on 2025-03-27 17:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks_management', '0002_column_card_projectboard_column_project_board'),
    ]

    operations = [
        migrations.RenameField(
            model_name='account',
            old_name='telefone',
            new_name='phone_number',
        ),
    ]
