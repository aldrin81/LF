from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date
from .models import LeaderboardSettings

from .models import LeaderboardPlayer, PointTransaction
from .serializers import LeaderboardPlayerSerializer, PointTransactionSerializer

def get_current_leaderboard_settings():
    settings, _ = LeaderboardSettings.objects.get_or_create(id=1)

    today = date.today()

    if settings.auto_mode and settings.open_date and settings.close_date:
        settings.is_active = settings.open_date <= today <= settings.close_date
        settings.save(update_fields=["is_active", "updated_at"])

    return settings

@api_view(["GET"])
def leaderboard(request):
    settings = get_current_leaderboard_settings()

    if not settings.is_active:
        return Response({
            "active": False,
            "leaders": [],
        })

    players = LeaderboardPlayer.objects.order_by("-points", "full_name")[:20]
    serializer = LeaderboardPlayerSerializer(players, many=True)

    return Response({
        "active": True,
        "leaders": serializer.data,
    })


@api_view(["GET"])
def points_tracking(request):
    transactions = PointTransaction.objects.select_related("player").order_by("-created_at")
    serializer = PointTransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def leaderboard_settings(request):
    settings = get_current_leaderboard_settings()

    return Response({
        "is_active": settings.is_active,
        "auto_mode": settings.auto_mode,
        "open_date": settings.open_date,
        "close_date": settings.close_date,
    })

@api_view(["PUT"])
def update_leaderboard_settings(request):
    settings, _ = LeaderboardSettings.objects.get_or_create(id=1)

    settings.auto_mode = request.data.get("auto_mode", settings.auto_mode)
    settings.open_date = request.data.get("open_date") or None
    settings.close_date = request.data.get("close_date") or None

    if not settings.auto_mode:
        settings.is_active = request.data.get("is_active", settings.is_active)

    settings.save()

    return Response({"message": "Leaderboard settings updated"})