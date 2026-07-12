from django.urls import path
from .views import leaderboard, points_tracking, leaderboard_settings, update_leaderboard_settings, leaderboard_history, leaderboard_history_detail, archive_leaderboard_history

urlpatterns = [
    path("leaderboard/", leaderboard),
    path("points-tracking/", points_tracking),
    path("leaderboard-settings/", leaderboard_settings),
    path(
        "leaderboard-settings/update/",
        update_leaderboard_settings,
    ),

    path("leaderboard-history/", leaderboard_history),
    path(
        "leaderboard-history/<int:history_id>/",
        leaderboard_history_detail,
    ),
    path(
        "leaderboard-history/archive/",
        archive_leaderboard_history,
    ),
]