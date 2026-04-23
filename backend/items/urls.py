from django.urls import path
from .views import get_item_details, create_item_details, item_details

urlpatterns = [
    path('details/', get_item_details, name='get_item_details'),
    path('create/', create_item_details, name='create_item_details'),
    path('details/<int:pk>/', item_details, name='item_details'),
]