from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class AccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'phone_number')
    fieldsets = UserAdmin.fieldsets + (
        (None,  
         {'fields' : ('phone_number',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, 
         {'fields' : ('phone_number',)}),
    )

admin.site.register(Account, AccountAdmin)
admin.site.register(ProjectBoard)
admin.site.register(Column)
admin.site.register(Card)