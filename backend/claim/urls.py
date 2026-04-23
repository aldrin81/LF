from django.urls import path
from .views import create_claim, get_claim, update_claim

urlpatterns = [
    path('items/', get_claim, name='get_claim'),
    path('create/', create_claim, name='create_claim'),
    path('claims/<int:pk>/', update_claim, name='update_claim'),
]