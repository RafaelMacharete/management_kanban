from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Project, Column, Card, Account, Comment, Attachment


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

class CommentSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'card', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = AccountSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['id', 'card', 'file', 'file_url', 'name', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

# Atualize o CardSerializer para incluir os novos campos e relacionamentos
class CardSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    assigned_to = AccountSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        source='assigned_to',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Card
        fields = [
            'id', 'name', 'column', 'description', 'creation_date', 
            'due_date', 'priority', 'assigned_to', 'assigned_to_id',
            'position', 'comments', 'attachments'
        ]
        extra_kwargs = {
            'column': {'required': True}
        }