from rest_framework import serializers

from .models import (
    LeaderboardPlayer,
    PointTransaction,
    LeaderboardHistory,
    LeaderboardHistoryPlayer,
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
        read_only=True,
    )
    student_id = serializers.CharField(
        source="player.student_id",
        read_only=True,
    )

    class Meta:
        model = PointTransaction
        fields = [
            "id",
            "player",
            "player_name",
            "student_id",
            "points",
            "reason",
            "item_id",
            "created_at",
        ]


class LeaderboardHistoryPlayerSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(
        source="player.student_id",
        read_only=True,
        default=None,
    )

    class Meta:
        model = LeaderboardHistoryPlayer
        fields = [
            "id",
            "student_id",
            "rank",
            "player_name",
            "total_points",
            "surrendered_items",
        ]


class LeaderboardHistorySerializer(serializers.ModelSerializer):
    players = LeaderboardHistoryPlayerSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = LeaderboardHistory
        fields = [
            "id",
            "school_year",
            "semester",
            "start_date",
            "end_date",
            "total_players",
            "archived_at",
            "players",
        ]


class ArchiveLeaderboardSerializer(serializers.Serializer):
    school_year = serializers.CharField(max_length=20)
    semester = serializers.ChoiceField(
        choices=[
            "1st Semester",
            "2nd Semester",
            "Short Term",
        ]
    )
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def validate(self, data):
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError(
                "Start date cannot be later than end date."
            )

        return data
    
class CurrentLeaderboardSerializer(serializers.ModelSerializer):
    # Uses the calculated score for the current semester,
    # not LeaderboardPlayer.points in the database.
    points = serializers.IntegerField(
        source="leaderboard_points",
        read_only=True,
    )

    class Meta:
        model = LeaderboardPlayer
        fields = [
            "id",
            "student_id",
            "full_name",
            "points",
        ]