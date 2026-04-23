from django.urls import path
from .views import create_notification, get_notification, update_notification

urlpatterns = [
    path('notifications/', get_notification, name='get_notification'),
    path('notifications/create/', create_notification, name='create_notification'),
    path('notifications/<int:pk>/', update_notification, name='update_notification'),
]