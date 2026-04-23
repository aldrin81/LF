from django.urls import path
from .views import get_user, create_user, update_user

urlpatterns = [
    path('users/', get_user, name='get_user'),
    path('create/', create_user, name='create_user '),
    path('users/<int:pk>/', update_user, name='update_user'),
]