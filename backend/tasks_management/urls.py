from django.urls import path
from . import views

urlpatterns = [
    path('createuser/', view=views.create_account, name='create_user'),
    path('login/', view=views.login, name='login'),
    path('accounts/<int:pk>', views.alter_get_account, name='alter_get_account'),
    path('projectboards/', views.get_create_project_boards, name='get_create_project'),
    path('projectboards/<int:pk>', views.alter_get_project_board, name='alter_get_project'),
    path('columns/', views.get_create_columns, name='get_create_columns'),
    path('columns/<int:pk>', views.alter_get_column, name='alter_get_column'),
    path('cards/', views.get_create_cards, name='get_create_card'),
    path('cards/<int:pk>', views.alter_get_card, name='alter_get_card'),
]