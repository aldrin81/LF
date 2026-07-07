# gamification/urls.py
from django.urls import path
from .views import leaderboard, points_tracking

urlpatterns = [
    path("leaderboard/", leaderboard),
    path("points-tracking/", points_tracking),
]