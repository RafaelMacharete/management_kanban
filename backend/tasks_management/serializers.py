from rest_framework import serializers, viewsets, permissions
from .models import ProjectBoard, Column, Card, Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class ProjectBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectBoard
        fields = '__all__'

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'