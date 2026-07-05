from django.urls import path
from .views import get_claim, create_claim, schedule_meeting

urlpatterns = [
    path('', get_claim),
    path('create/', create_claim),
    path('schedule/<int:pk>/', schedule_meeting),
]