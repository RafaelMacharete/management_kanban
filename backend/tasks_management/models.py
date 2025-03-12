from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # board_contributors = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Column(models.Model):
    name = models.CharField(max_length=255)
    board = models.ForeignKey(Board, related_name='columns', on_delete=models.CASCADE)
    order_position = models.IntegerField()

    def __str__(self):
        return self.name


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    column = models.ForeignKey(Column, related_name='tasks', on_delete=models.CASCADE)
    # task_contributors = models.ForeignKey(User, on_delete=models.CASCADE)
    order_position = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

        
class Project(models.Model):
    project_name = models.CharField(max_length=70)
    # board = models.ForeignKey(Board, on_delete=models.CASCADE)
    board = models.OneToOneField(Board, on_delete=models.CASCADE)


    def __str__(self):
        return self.project_name