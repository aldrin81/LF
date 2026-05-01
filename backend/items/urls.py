from django.urls import path
from .views import get_item_details, create_item_details, item_details, delete_item
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('details/', get_item_details, name='get_item_details'),
    path('report/', create_item_details, name='create_item_details'),
    path('details/update/<int:pk>/', item_details, name='item_details'),
    path('delete/<int:pk>/', delete_item, name='delete_item'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)