from django.urls import path
from . import views
from .views import (ProjectCreateAPIView, 
                    AccountRetrieveUpdateDestroyAPIView, 
                    ProjectUpdateAPIView,
                    ColumnListCreateAPIView,
                    ColumnRetrieveUpdateDestroyAPIView,
                    CardListCreateAPIView,
                    CardRetrieveUpdateDestroyAPIView,
                    ColumnListByProjectAPIView,
                    CardListByProjectAPIView,
                    AccountCreateView,
                    LoginView
                    )
urlpatterns = [
    path('register/', AccountCreateView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    path('accounts/<int:pk>', AccountRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_account'),
    path('projects/', ProjectCreateAPIView.as_view(), name='create_project'),
    path('projects/<int:pk>', ProjectUpdateAPIView.as_view(), name='update_project'),
    
    path('columns/', ColumnListCreateAPIView.as_view(), name='get_create_project'),
    path('columns/<int:pk>', ColumnRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_columns'),
    path('column/', ColumnListByProjectAPIView.as_view(), name='alter_get_columns'),

    path('cards/', CardListCreateAPIView.as_view(), name='get_create_cards'),
    path('cards/<int:pk>', CardRetrieveUpdateDestroyAPIView.as_view(), name='get_create_cards'),
    path('card/', CardListByProjectAPIView.as_view(), name='get_create_cards'),
    
    path('jwt/', views.get_projects_account_validated, name='jwt')
]