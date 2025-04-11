from django.urls import path
from . import views
from .views import (ProjectCreateAPIView, 
                    AccountRetrieveUpdateDestroyAPIView, 
                    ProjectUpdateAPIView,
                    ColumnListCreateAPIView,
                    ColumnRetrieveUpdateDestroyAPIView,
                    CardListCreateAPIView,
                    CardRetrieveUpdateDestroyAPIView
                    )
urlpatterns = [
    path('createuser/', view=views.create_account, name='create_user'),
    path('login/', view=views.login, name='login'),

    path('accounts/<int:pk>', AccountRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_account'),
    path('projects/', ProjectCreateAPIView.as_view(), name='create_project'),
    path('projects/<int:pk>', ProjectUpdateAPIView.as_view(), name='update_project'),
    path('columns/', ColumnListCreateAPIView.as_view(), name='get_create_project'),
    path('columns/<int:pk>', ColumnRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_columns'),
    path('cards/', CardListCreateAPIView.as_view(), name='get_create_cards'),
    path('cards/<int:pk>', CardRetrieveUpdateDestroyAPIView.as_view(), name='get_create_cards'),
]