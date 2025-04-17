from rest_framework import serializers
from .models import Project, Column, Card, Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'password', 'phone_number', 'email', 'nickname', 'profile_image', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Account.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number'),
            email=validated_data.get('email'),
            nickname=validated_data.get('nickname'),
            profile_image=validated_data.get('profile_image'),
            role=validated_data.get('role'),
        )
        return user

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'