# from django.contrib.auth.models import User
from django.db import models

class Account(models.Model):
    username = models.CharField(max_length=50, primary_key=True)
    password = models.CharField(max_length=40)
    email = models.EmailField(max_length=254)
    role = models.CharField(max_length=11)
 
    def __str__(self):
        return self.username

class ProjectBoard(models.Model):
    project_board_name = models.CharField(max_length=50, primary_key=True)
    projects = models.ManyToManyField(Account, through='ProjectBoardAccount')
    
    def __str__(self):
        return self.project_board_name

class ProjectBoardAccount(models.Model):
    account_username = models.ForeignKey(Account, on_delete=models.CASCADE)
    project_board_name = models.ForeignKey(ProjectBoard, on_delete=models.CASCADE)

class Column(models.Model):
    column_name = models.CharField(max_length=30, primary_key=True)
    project_name = models.ForeignKey(ProjectBoard, on_delete=models.CASCADE)
    position = models.IntegerField()
    
    def __str__(self):
        return self.column_name

class Card(models.Model):
    card_name = models.CharField(max_length=35, primary_key=True)
    column_name = models.ForeignKey(Column, on_delete=models.CASCADE) 
    card_description = models.TextField()
    card_creation_update_date = models.DateField(auto_now_add=1)
    
    def __str__(self):
        return self.card_name