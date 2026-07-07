from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import LeaderboardPlayer, PointTransaction
from .serializers import LeaderboardPlayerSerializer, PointTransactionSerializer


@api_view(["GET"])
def leaderboard(request):
    players = LeaderboardPlayer.objects.order_by("-points", "full_name")[:10]
    serializer = LeaderboardPlayerSerializer(players, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def points_tracking(request):
    transactions = PointTransaction.objects.select_related("player").order_by("-created_at")
    serializer = PointTransactionSerializer(transactions, many=True)
    return Response(serializer.data)