from django.urls import path
from . import views

urlpatterns = [
    path('createuser/', view=views.create_account, name='create_user'),
    path('login/', view=views.login, name='login'),
    path('doSomething/', view=views.protected_view, name='protected_view')
]