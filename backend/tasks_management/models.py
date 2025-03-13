from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    project_name = models.CharField(max_length=50)  
    owner = models.CharField(max_length=50)
    contributors = models.CharField()


class Account(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    password = models.CharField(max_length=30)
    projects = models.ManyToManyField(Project, through=AccountInProject)

    def __str__(self):
        return self.username
    
class AccountInProject(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE) 