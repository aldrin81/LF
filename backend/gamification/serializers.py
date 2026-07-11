from rest_framework import serializers
from .models import (
    LeaderboardPlayer,
    PointTransaction,
    LeaderboardSettings
)


class LeaderboardPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardPlayer
        fields = [
            "id",
            "student_id",
            "full_name",
            "points",
        ]


class PointTransactionSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(
        source="player.full_name",
        read_only=True
    )

    class Meta:
        model = PointTransaction
        fields = [
            "id",
            "player_name",
            "points",
            "reason",
            "item_id",
            "created_at",
        ]


class LeaderboardSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardSettings
        fields = "__all__"