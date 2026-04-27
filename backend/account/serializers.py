from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'password', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False, 'allow_blank': True}}
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = Account.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
            
        return instance
    
class AccountLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

class AccountLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()