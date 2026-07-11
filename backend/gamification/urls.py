from django.urls import path
from .views import (
    leaderboard,
    points_tracking,
    leaderboard_settings,
    update_leaderboard_settings,
)

urlpatterns = [
    path("leaderboard/", leaderboard),
    path("points-tracking/", points_tracking),
    path("settings/", leaderboard_settings),
    path("settings/update/", update_leaderboard_settings),
]