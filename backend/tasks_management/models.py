from django.contrib.auth.models import User
from django.db import models

class Project(models.Model):
    project_name = models.CharField(max_length=50)  

    def __str__(self): 
        return self.project_name

class Account(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    password = models.CharField(max_length=30)
    projects = models.ManyToManyField(
        Project, 
        through='AccountProjects',
        through_fields=('contributors', 'owner'),
        blank=True
    )

    def __str__(self):
        return self.username

class AccountProjects(models.Model):
    owner = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='owner_project')
    contributors = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='contributors_project')


class Board(models.Model):
    project_name = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.project_name.project_name

class Column(models.Model):
    column_name = models.CharField(max_length=30)
    board_name = models.ForeignKey(Board, on_delete=models.CASCADE)
    order_position = models.IntegerField(default=1)

    def __str__(self):
        return self.column_name

class Task(models.Model):
    task_name = models.CharField(max_length=50)
    description = models.TextField()
    creation_date = models.DateField(auto_created=True)
    updated_date = models.DateField(auto_now=True)
    column_name = models.ForeignKey(Column, on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name