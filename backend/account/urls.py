from django.urls import path
from .views import change_password, register, login, logout, get_user, update_user, refresh_token, current_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('refresh/', refresh_token, name='refresh_token'),
    path('current/', current_user, name='current_user'),
    path('users/', get_user, name='get_user'),
    path('users/<int:pk>/', update_user, name='update_user'),
    path('change-password/', change_password, name='change_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)