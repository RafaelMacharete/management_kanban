from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from .models import Account, ProjectBoard, Column, Card
from .serializers import *


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


@api_view(['GET'])
def get_accounts(req):
    if req.method == 'GET':
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_projects_account_validated(req, qnt=None):
    jwt_authenticator = JWTAuthentication()
    qnt = req.query_params.get('qnt', None)

    user, auth = jwt_authenticator.authenticate(req)

    if user:
        projects_filtered = ProjectBoard.objects.filter(members=user.id)
        if qnt:
            projects_filtered = projects_filtered[0:int(qnt)]
        projects_serialized = ProjectBoardSerializer(projects_filtered, many=True)

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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_create_project_boards(req):
    if req.method == 'GET':
        project_boards = ProjectBoard.objects.all()
        serializer = ProjectBoardSerializer(project_boards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'POST':
        serializer = ProjectBoardSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def alter_get_project_board(req, pk):
    try:
        project_board = ProjectBoard.objects.get(pk=pk)
    except ProjectBoard.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = ProjectBoardSerializer(project_board)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'PUT':
        serializer = ProjectBoardSerializer(project_board, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        project_board.delete()
        return  Response('Project Board deleted', status=status.HTTP_204_NO_CONTENT)
    elif req.method == 'PATCH':
        serializer = ProjectBoardSerializer(project_board, data=req.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_create_columns(req):
    if req.method == 'GET':
        columns = Column.objects.all()
        serializer = ColumnSerializer(columns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'POST':
        serializer = ColumnSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def alter_get_column(req, pk):
    try:
        column = Column.objects.get(pk=pk)
    except Column.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = ColumnSerializer(column)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'PUT':
        serializer = ColumnSerializer(column, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        column.delete()
        return Response('Column deleted', status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_create_cards(req):
    if req.method == 'GET':
        cards = Card.objects.all()
        serializer = CardSerializer(cards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'POST':
        serializer = CardSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def alter_get_card(req, pk):
    try:
        card = Card.objects.get(pk=pk)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if req.method == 'GET':
        serializer = CardSerializer(card)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'PUT':
        serializer = CardSerializer(card, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        card.delete()
        return Response('Card deleted', status=status.HTTP_204_NO_CONTENT)