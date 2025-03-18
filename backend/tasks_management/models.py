# from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Account(models.Model): 
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)
    
    # groups = models.ManyToManyField(Group, related_name="custom_groups", blank=True)
    # user_permissions = models.ManyToManyField(Permission, related_name="custom_user_p", blank=True)

    def __str__(self):
        return self.username

class ProjectBoard(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.ManyToManyField(Account)
    
    def __str__(self):
        return self.name

class Column(models.Model):
    name = models.CharField(max_length=30)
    project_board = models.ForeignKey(ProjectBoard, on_delete=models.CASCADE, related_name="columns")
    position = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.project_board.name} - {self.name}"

class Card(models.Model):
    name = models.CharField(max_length=35)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    description = models.TextField()
    creation_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.name