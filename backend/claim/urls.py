from django.urls import path
from .views import get_claim, create_claim, review_claim

urlpatterns = [
    path("", get_claim),
    path("create/", create_claim),
    path("review/<int:pk>/", review_claim),
]