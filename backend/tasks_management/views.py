from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import (RetrieveUpdateDestroyAPIView, 
                                     UpdateAPIView, 
                                     ListCreateAPIView,
                                     )
from rest_framework.permissions import IsAuthenticated
# from .permissions import IsProjectOwner

from rest_framework.parsers import MultiPartParser, FormParser

from .models import Account, Project, Column, Card, Comment, Attachment, PasswordResetToken

from .serializers import (AccountSerializer, ProjectSerializer, 
                         ColumnSerializer, CardSerializer, 
                         LoginSerializer, CommentSerializer,
                         AttachmentSerializer)

from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings

'''CRUD Project'''
# GET POST
class ProjectCreateAPIView(ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

# PUT PATCH
class ProjectUpdateAPIView(UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'pk'
    # permission_classes = [IsProjectOwner]


'''CRUD Account'''
# GET PUT PATCH DELETE
class AccountRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]
    

'''CRUD Column'''
# POST
class ColumnListCreateAPIView(ListCreateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.request.query_params.get('project_board')
        if project_id:
            return Column.objects.filter(project_board=project_id)
        return Column.objects.all()

class ColumnListByProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_board')
        if not project_id:
            return Response({'detail': 'must contain project_board.'}, status=status.HTTP_400_BAD_REQUEST)

        columns = Column.objects.filter(project_board=project_id)
        serializer = ColumnSerializer(columns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# GET PUT PATCH DELETE
class ColumnRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]


'''CRUD Card'''
# POST
class CardListCreateAPIView(ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]


class CardListByProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        all_columns_id = request.data.get('columns_id')
        if not all_columns_id:
            return Response({'detail': 'must contain column id'}, status=status.HTTP_400_BAD_REQUEST)
        
        cards = Card.objects.filter(column__in=all_columns_id)
        cards_serializer = CardSerializer(cards, many=True)
        return Response(cards_serializer.data, status=status.HTTP_200_OK)

# GET PUT PATCH DELETE
class CardRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]


class AccountCreateView(APIView):
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

@api_view(['POST'])
def get_projects_account_validated(req, qnt=None):
    jwt_authenticator = JWTAuthentication()
    qnt = req.query_params.get('qnt', None)

    user, auth = jwt_authenticator.authenticate(req)

    if user:
        projects_filtered = Project.objects.filter(members=user.id)
        if qnt:
            projects_filtered = projects_filtered[0:int(qnt)]
        projects_serialized = ProjectSerializer(projects_filtered, many=True)

        projects_data = projects_serialized.data

        all_member_ids = []
        for project in projects_data:
            for member_id in project['members']:
                if member_id not in all_member_ids:
                    all_member_ids.append(member_id)

        members = Account.objects.filter(pk__in=all_member_ids)
        members_serialized = AccountSerializer(members, many=True, context={"request": req})


        return Response({
            'projects': projects_data,
            'members': members_serialized.data
        }, status=status.HTTP_200_OK)

    else:
        return Response({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
    
class SearchAllACounts(APIView):
    def post(self, request):
        search = request.data.get('search', None)
        if search:
            accounts = Account.objects.filter(username__icontains=search)
            serializer = AccountSerializer(accounts, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)

class SearchSpecificProject(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        search_project = request.data.get('search', None)
        user = request.user

        if search_project:
            projects = Project.objects.filter(
                members=user,
                name__icontains=search_project
            )
            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)

'''CRUD Comment'''
class CommentListCreateAPIView(ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        card_id = self.request.query_params.get('card_id')
        if card_id:
            return Comment.objects.filter(card=card_id)
        return Comment.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

'''CRUD Attachment'''
class AttachmentListCreateAPIView(ListCreateAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        card_id = self.request.query_params.get('card_id')
        if card_id:
            return Attachment.objects.filter(card=card_id)
        return Attachment.objects.none()

class AttachmentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

'''Enhanced Card Views'''
class CardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            card = Card.objects.get(pk=pk)
            card_serializer = CardSerializer(card)
            
            comments = Comment.objects.filter(card=card)
            comments_serializer = CommentSerializer(comments, many=True)
            
            attachments = Attachment.objects.filter(card=card)
            attachments_serializer = AttachmentSerializer(attachments, many=True)
            
            return Response({
                'card': card_serializer.data,
                'comments': comments_serializer.data,
                'attachments': attachments_serializer.data
            }, status=status.HTTP_200_OK)
            
        except Card.DoesNotExist:
            return Response({'error': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)

class CardUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            card = Card.objects.get(pk=pk)
            serializer = CardSerializer(card, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Card.DoesNotExist:
            return Response({'error': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)

'''Project Members'''
class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id)
            members = project.members.all()
            serializer = AccountSerializer(members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)


class VerifyTokenView(APIView):
    def post(self, request):
        email = request.data.get('email')
        token = request.data.get('token')

        try:
            user = Account.objects.get(email=email)
            record = PasswordResetToken.objects.get(user=user)

            if record.token == token:
                return Response({'valid': True})
            return Response({'valid': False}, status=400)
        except (Account.DoesNotExist, PasswordResetToken.DoesNotExist):
            return Response({'valid': False}, status=404)

class SendEmailTokenView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Account.objects.get(email=email)
            token = get_random_string(6, allowed_chars='0123456789')
            PasswordResetToken.objects.update_or_create(user=user, defaults={'token': token})

            send_mail(
                'Password Reset Code',
                f'Your password reset code is: {token}',
                settings.DEFAULT_FROM_EMAIL,
                [email]
            )
            return Response({'message': 'Token sent to email'}, status=200)
        except Account.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('password')

        if not email or not new_password:
            return Response({'error': 'Missing data'}, status=400)

        try:
            user = Account.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=200)
        except Account.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)