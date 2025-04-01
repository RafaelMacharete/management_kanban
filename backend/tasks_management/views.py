from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Account, ProjectBoard, Column, Card
from .serializers import *

@api_view(['POST'])
def create_account(req):
    username = req.data.get('username')
    password = req.data.get('password')
    email = req.data.get('email')
    phone_number = req.data.get('phone_number')
    is_staff = req.data.get('staff')

    if not username or not password or not email or not phone_number:
        return Response({'Error: Invalid fields'}, status=status.HTTP_400_BAD_REQUEST)

    if Account.objects.filter(username = username).exists():
        return Response({'Error: Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if Account.objects.filter(email = email).exists():
        return Response({'Error: Email already exists'}, status=status.HTTP_400_BAD_REQUEST)    
    
    if is_staff:
        account = Account.objects.create_superuser(
            username=username,
            password=password,
            email=email,
            phone_number=phone_number,
            is_staff=is_staff,
        )
    else:
        account = Account.objects.create_user(
            username=username,
            password=password,
            email=email,
            phone_number=phone_number,
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
        return Response({'Error': 'Username or Password invalid'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
def get_create_accounts(req):
    if req.method == 'GET':
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'POST':
        serializer = AccountSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

@api_view(['GET', 'PUT', 'DELETE'])
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
        return Response('Project Board deleted', status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
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