from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import AccountSerializer, AccountLoginSerializer, AccountLogoutSerializer
from .models import Account
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate



@api_view(["POST"])
@permission_classes(IsAuthenticated)
def register(request):
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        account = serializer.save()
        return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = AccountLoginSerializer(data = request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username = username, password = password)

        if user is None:
            return Response({"error": "invalid credentials"}, status = 400)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status = 200)

    return Response(serializer.errors, status = 400)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    serializer = AccountLogoutSerializer(data = request.data)

    if serializer.is_valid():
        try:
            refresh_token = serializer.validated_data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "logout successfully"}, status = 205)

        except Exception:
            return Response({"error": "invalid token"}, status = 400)

    
    return Response(serializer.errors, status = 400)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "refresh token required"}, status = 400)
        
        token = RefreshToken(refresh_token)
        return Response({
            "access": str(token.access_token)
        }, status = 200)
    
    except Exception as e:
        return Response({"error": "invalid refresh token"}, status = 400)

#para sa roles
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = AccountSerializer(request.user)
    return Response(serializer.data)

#para sa data
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = Account.objects.all()
    serializer = AccountSerializer (user, many = True)
    return Response(serializer.data)

@api_view([ "GET" , "PUT", 'DELETE'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    try:
        user = Account.objects.get(pk = pk)
    except Account.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        user_data =  AccountSerializer(user).data

        return Response( {
            "User": {
                "id": user_data["id"],
                "first_name": user_data["first_name"]
            }
        })

    elif request.method == 'PUT':
        serializer = AccountSerializer(user, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)
