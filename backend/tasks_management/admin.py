from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class AccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'nickname')
    fieldsets = UserAdmin.fieldsets + (
        (None,  
         {'fields' : ('nickname',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, 
         {'fields' : ('nickname',)}),
    )

admin.site.register(Account, AccountAdmin)
admin.site.register(Project)
admin.site.register(Column)
admin.site.register(Card)