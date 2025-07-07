from django.urls import path
from . import views
from .views import (
    ProjectCreateAPIView, 
    AccountRetrieveUpdateDestroyAPIView, 
    ProjectRetrieveUpdateDestroyAPIView,
    ColumnListCreateAPIView,
    ColumnRetrieveUpdateDestroyAPIView,
    CardListCreateAPIView,
    CardRetrieveUpdateDestroyAPIView,
    ColumnListByProjectAPIView,
    CardListByProjectAPIView,
    AccountCreateView,
    LoginView,
    SearchAllACounts,
    SearchSpecificProject,
    CommentListCreateAPIView,
    CommentRetrieveUpdateDestroyAPIView,
    AttachmentListCreateAPIView,
    AttachmentRetrieveUpdateDestroyAPIView,
    CardDetailView,
    CardUpdateView,
    ProjectMembersView,
    SendEmailTokenView,
    VerifyTokenView,
    ResetPasswordView
)

urlpatterns = [
    # Autenticação
    path('register/', AccountCreateView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    # Account
    path('accounts/<int:pk>/', AccountRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_account'),
    path('accounts/', SearchAllACounts.as_view(), name='search_all_accounts'),
    
    # Project
    path('projects/', ProjectCreateAPIView.as_view(), name='create_project'),
    path('projects/<int:pk>/', ProjectRetrieveUpdateDestroyAPIView.as_view(), name='update_project'),
    path('projects/search/', SearchSpecificProject.as_view(), name='search_projects'),
    path('projects/<int:project_id>/members/', ProjectMembersView.as_view(), name='project_members'),
    
    # Column
    path('columns/', ColumnListCreateAPIView.as_view(), name='get_create_columns'),
    path('columns/<int:pk>/', ColumnRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_column'),
    path('column/', ColumnListByProjectAPIView.as_view(), name='get_columns_by_project'),
    
    # Card
    path('cards/', CardListCreateAPIView.as_view(), name='get_create_cards'),
    path('cards/<int:pk>/', CardRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_card'),
    path('card/', CardListByProjectAPIView.as_view(), name='get_cards_by_columns'),
    path('cards/<int:pk>/detail/', CardDetailView.as_view(), name='card_detail'),
    path('cards/<int:pk>/update/', CardUpdateView.as_view(), name='card_update'),
    
    # Comment
    path('comments/', CommentListCreateAPIView.as_view(), name='get_create_comments'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_comment'),
    
    # Attachment
    path('attachments/', AttachmentListCreateAPIView.as_view(), name='get_create_attachments'),
    path('attachments/<int:pk>/', AttachmentRetrieveUpdateDestroyAPIView.as_view(), name='alter_get_attachment'),
    
    # JWT
    path('jwt/', views.get_projects_account_validated, name='jwt'),

    path('send-reset-email/', SendEmailTokenView.as_view(), name='send_reset_email'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]