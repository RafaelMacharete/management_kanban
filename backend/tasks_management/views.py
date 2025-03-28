from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(req):
    return Response({'Message:' 'Hi'}, status=status.HTTP_200_OK)