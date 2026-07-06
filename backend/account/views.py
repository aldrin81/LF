from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    AccountSerializer,
    AccountLoginSerializer,
    AccountLogoutSerializer,
)
from .models import Account
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.mail import send_mail
from django.utils.crypto import get_random_string



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register(request):
    data = request.data.copy()

    generated_password = get_random_string(
        12,
        allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*"
    )

    data["password"] = generated_password
    data["username"] = data.get("email")
    data["must_change_password"] = True

    serializer = AccountSerializer(data=data)

    if serializer.is_valid():
        account = serializer.save()

        full_name = f"{account.first_name} {account.last_name}".strip()

        send_mail(
            subject="Your SLC Seek & Balik Account Password",
            message=(
                f"Hello {full_name},\n\n"
                f"Your account has been created.\n\n"
                f"Email: {account.email}\n"
                f"Password: {generated_password}\n\n"
                f"Please log in and change your password immediately."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[account.email],
            fail_silently=False,
        )

        return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = AccountLoginSerializer(data=request.data)

    if serializer.is_valid():
        login_id = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        account = (
            Account.objects.filter(username=login_id).first()
            or Account.objects.filter(email=login_id).first()
        )

        if account is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request,
            username=account.username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "must_change_password": user.must_change_password,
            }
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password", "")
    new_password = request.data.get("new_password", "")

    if not new_password:
        return Response({"error": "New password is required."}, status=400)

    if len(new_password) < 12 or len(new_password) > 16:
        return Response({"error": "Password must be 12 to 16 characters long."}, status=400)

    if any(char.isspace() for char in new_password):
        return Response({"error": "Password must not contain spaces."}, status=400)

    if user.check_password(new_password):
        return Response({"error": "New password must not be the same as the current password."}, status=400)

    if not user.must_change_password:
        if not current_password:
            return Response({"error": "Current password is required."}, status=400)

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=400)

    user.set_password(new_password)
    user.must_change_password = False
    user.save()

    return Response({"message": "Password changed successfully."}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    serializer = AccountLogoutSerializer(data=request.data)

    if serializer.is_valid():
        try:
            refresh_token = serializer.validated_data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    users = Account.objects.filter()
    serializer = AccountSerializer(users, many=True)
    return Response(serializer.data)


@api_view([ "GET" , "PUT", 'DELETE'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    try:
        user = Account.objects.get(pk = pk)
    except Account.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AccountSerializer(user)
        return Response(serializer.data)


    elif request.method == 'PUT':
        serializer = AccountSerializer(user, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)
