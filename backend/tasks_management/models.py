from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _   

def validate_image_size(image):
    max_size = 1 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError("Imagem size must be lower than 1MB.")

class MyValidator(UnicodeUsernameValidator):
    regex = r'^[\w.@+\- ]+$'
    
class Account(AbstractUser):
    username_validator = MyValidator()
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
            error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    role_choice = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    
    nickname = models.CharField(max_length=35, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to='profile_images/',
        default='user_default.png',
        blank=True, 
        null=True, 
        validators=[validate_image_size]
        )
    role = models.CharField(max_length=50, blank=True, null=True, choices=role_choice)

    def __str__(self):
        return self.username
    
class Project(models.Model):
    name = models.CharField(max_length=50)
    members = models.ManyToManyField(Account)
    favorite = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Column(models.Model):
    name = models.CharField(max_length=30)
    project_board = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="columns")
    position = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.project_board.name} - {self.name}"

class Card(models.Model):
    name = models.CharField(max_length=35)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    description = models.TextField()
    creation_date = models.DateField(auto_now_add=True)
    position = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return self.name