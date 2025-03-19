from django.urls import path
from . import views

urlpatterns = [
    path('account/', views.get_all_accounts),
    path('account/alter/<int:pk>', views.alter_account_state),
    path('project/', views.get_all_projects),
    path('project/alter/<int:pk>', views.alter_project_state),
    path('column/', views.get_all_columns),
    path('column/alter/<int:pk>', views.alter_account_state),
    path('card/', views.get_all_cards),
    path('card/alter/<int:pk>', views.alter_card_state),
]