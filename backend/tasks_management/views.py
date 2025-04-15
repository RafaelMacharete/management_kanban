from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from .models import Account, Project, Column, Card
from .serializers import AccountSerializer, ProjectSerializer, ColumnSerializer, CardSerializer
from rest_framework.views import APIView
from rest_framework.generics import (RetrieveUpdateDestroyAPIView, 
                                     UpdateAPIView, 
                                     ListCreateAPIView,
                                     
                                     )
from rest_framework.permissions import IsAuthenticated

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

'''CRUD Account'''
# GET PUT PATCH DELETE
class AccountRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'pk'

'''CRUD Column'''
# POST
class ColumnListCreateAPIView(ListCreateAPIView):
    serializer_class = ColumnSerializer

    def get_queryset(self):
        project_id = self.request.query_params.get('project_board')
        if project_id:
            return Column.objects.filter(project_board=project_id)
        return Column.objects.all()

class ColumnListByProjectAPIView(APIView):
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

'''CRUD Card'''
# POST
class CardListCreateAPIView(ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

class CardListByProjectAPIView(APIView):
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


@api_view(['POST'])
def create_account(req):
    username = req.data.get('username')
    password = req.data.get('password')

    if not username or not password:
        return Response({'Invalid fields'}, status=status.HTTP_400_BAD_REQUEST)

    if Account.objects.filter(username = username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    account = Account.objects.create_user(
        username=username,
        password=password,
    )

    return Response({'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(req):
    username = req.data.get('username')
    password = req.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh':str(refresh),
            }, status=status.HTTP_200_OK)
    else:
        return Response({'Username or Password invalid'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
        members_serialized = AccountSerializer(members, many=True)

        return Response({
            'projects': projects_data,
            'members': members_serialized.data
        }, status=status.HTTP_200_OK)

    else:
        return Response({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)

#
@api_view(['GET', 'PUT', 'DELETE'])
def alter_get_account(req, pk):
    try:
        account = Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if req.method == 'GET':
        serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'PUT':
        serializer = AccountSerializer(account, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        account.delete()
        return Response('Account deleted', status=status.HTTP_204_NO_CONTENT)