from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *

@api_view(['GET'])
def get_all_accounts(req):
    all_acounts = Account.objects.all()
    all_acounts_serializer = AccountSerializer(all_acounts, many=True)
    return Response(all_acounts_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_projects(req):
    all_projects = ProjectBoard.objects.all()
    all_projects_serializers = ProjectBoardSerializer(all_projects, many=True)
    return Response(all_projects_serializers.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_columns(req):
    all_columns = Column.objects.all()
    all_columns_serializers = ColumnSerializer(all_columns, many=True)
    return Response(all_columns_serializers.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_cards(req):
    all_cards = Card.objects.all()
    all_cards_serializers = CardSerializer(all_cards, many=True)
    return Response(all_cards_serializers.data, status=status.HTTP_200_OK)

@api_view(['POST', 'PUT', 'DELETE'])
def alter_account_state(req, pk):
    if req.method == 'POST':
        account_serializer = AccountSerializer(data=req.data)
        if account_serializer.is_valid():
            account_serializer.save()
            return Response(account_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(account_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif req.method == 'PUT':
        try:
            account_by_pk = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        account_by_pk_serializer = AccountSerializer(account_by_pk, data=req.data)
        if account_by_pk_serializer.is_valid():
            account_by_pk_serializer.save()
            return Response(account_by_pk_serializer.data, status=status.HTTP_200_OK)

    elif req.method == 'DELETE':
        try:
            account_by_pk = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        account_by_pk.delete()
        return Response('Account deleted', status=status.HTTP_200_OK)        

@api_view(['POST', 'PUT', 'DELETE'])
def alter_project_state(req, pk):
    if req.method == 'POST':
        project_serializer = ProjectBoardSerializer(data=req.data)
        if project_serializer.is_valid():
            project_serializer.save()
            return Response(project_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(project_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif req.method == 'PUT':
        try:
            project_by_pk = ProjectBoard.objects.get(pk=pk)        
        except ProjectBoard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        project_by_pk_serializer = ProjectBoardSerializer(project_by_pk, data=req.data)
        if project_by_pk_serializer.is_valid():
            project_by_pk_serializer.save()
            return Response(project_by_pk_serializer.data, status=status.HTTP_200_OK)

    elif req.method == 'DELETE':
        try:
            project_by_pk = ProjectBoard.objects.get(pk=pk)        
        except ProjectBoard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        project_by_pk.delete()
        return Response('Project deleted', status=status.HTTP_200_OK)
        
@api_view(['POST', 'PUT', 'DELETE'])
def alter_column_state(req, pk):
    if req.method == 'POST':
        column_serializer = ColumnSerializer(data=req.data)
        if column_serializer.is_valid():
            column_serializer.save()
            return Response(column_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(column_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif req.method == 'PUT':
        try:
            column_by_pk = Column.objects.get(pk=pk)
        except Column.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        column_by_pk_serializer = ColumnSerializer(column_by_pk, data=req.data)
        if column_by_pk_serializer.is_valid():
            column_by_pk_serializer.save()
            return Response(column_by_pk_serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        try:
            column_by_pk = Column.objects.get(pk=pk)
        except Column.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        column_by_pk.delete()
        return Response('Column deleted', status=status.HTTP_200_OK)
@api_view(['POST', 'PUT', 'DELETE'])
def alter_card_state(req, pk):
    if req.method == 'POST':
        card_serializer = CardSerializer(data=req.data)
        if card_serializer.is_valid():
            card_serializer.save()
            return Response(card_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif req.method == 'PUT':
        try:
            card_by_pk = Card.objects.get(pk=pk)
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        card_by_pk_serializer = CardSerializer(card_by_pk, data=req.data)
        if card_by_pk_serializer.is_valid():
            card_by_pk_serializer.save()
            return Response(card_by_pk_serializer.data, status=status.HTTP_200_OK)
    elif req.method == 'DELETE':
        try:
            card_by_pk = Card.objects.get(pk=pk)
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        card_by_pk.delete()
        return Response('Card Deleted', status=status.HTTP_200_OK)
    
def get_account(req, pk):
    try:
        account = Account.objects.get(pk=pk)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    account_serializer = AccountSerializer(account)
    return Response(account_serializer.data, status=status.HTTP_200_OK)