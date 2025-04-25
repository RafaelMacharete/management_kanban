from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Project, Column, Card, Account


class AccountSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Account
        fields = ['id', 'username', 'password', 'email', 'nickname', 'profile_image', 'image_url']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Account.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email'),
            nickname=validated_data.get('nickname'),
            profile_image=validated_data.get('profile_image'),
        )
        return user
    
    
    def get_image_url(self, obj):
        request = self.context.get('request', None)
        if request is not None and obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url)
        elif obj.profile_image:
            return obj.profile_image.url
        return '/media/no_profile_image.webp'

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'username': self.user.username
        }
        return data

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