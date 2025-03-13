from django.contrib import admin
from .models import *

admin.site.register(Account)
admin.site.register(Project)
admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Task)