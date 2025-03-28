from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

admin.site.register(Account)
admin.site.register(ProjectBoard)
admin.site.register(Column)
admin.site.register(Card)

class AccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'username', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, 
         {'fields' : ('username')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, 
         {'fields' : ('username')}),
    )