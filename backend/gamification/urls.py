from django.urls import path


from .views import (
    leaderboard,
    leaderboard_settings,
    update_leaderboard_settings,
    points_tracking,
)





urlpatterns = [


    path(
        "leaderboard/",
        leaderboard,
        name="leaderboard"
    ),



    path(
        "settings/",
        leaderboard_settings,
        name="leaderboard_settings"
    ),



    path(
        "settings/update/",
        update_leaderboard_settings,
        name="update_leaderboard_settings"
    ),



    path(
        "points-tracking/",
        points_tracking,
        name="points_tracking"
    ),


]