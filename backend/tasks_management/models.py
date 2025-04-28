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
    
    nickname = models.CharField(max_length=35, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to='profile_images/',
        default='user_default.png',
        blank=True, 
        null=True, 
        validators=[validate_image_size]
        )

    def __str__(self):
        return self.username
    
class Project(models.Model):
    # owner = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="projects")
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
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    name = models.CharField(max_length=35)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    creation_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    assigned_to = models.ForeignKey(Account, on_delete=models.SET_NULL, blank=True, null=True)
    position = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return self.name

class Comment(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.card.name}"

class Attachment(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    uploaded_by = models.ForeignKey(Account, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name if self.name else f"Attachment {self.id} for {self.card.name}"

    def save(self, *args, **kwargs):
        if not self.name and self.file:
            self.name = self.file.name
        super().save(*args, **kwargs)