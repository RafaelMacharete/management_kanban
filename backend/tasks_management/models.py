from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


def validate_image_size(image):
    max_size = 1 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError("Imagem size must be lower than 1MB.")

class Account(AbstractUser):
    nickname = models.CharField(max_length=35, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to='profile_images/',
        default='user_default.png',
        blank=True, 
        null=True, 
        validators=[validate_image_size]
        )
    role = models.CharField(max_length=50, blank=True, null=True)

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