# gamification/models.py
from django.db import models

class LeaderboardPlayer(models.Model):
    student_id = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=100)
    points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.student_id} - {self.full_name} - {self.points}"


class PointTransaction(models.Model):
    REASONS = [
        ("SURRENDER_ITEM", "Surrendered item"),
        ("ITEM_CLAIMED", "Item claimed by owner"),
    ]

    player = models.ForeignKey(
        LeaderboardPlayer,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    points = models.PositiveIntegerField()
    reason = models.CharField(max_length=30, choices=REASONS)
    item_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            ("player", "reason", "item_id"),
        ]

class LeaderboardSettings(models.Model):
    is_active = models.BooleanField(default=True)
    auto_mode = models.BooleanField(default=False)
    open_date = models.DateField(null=True, blank=True)
    close_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Active" if self.is_active else "Inactive"


class LeaderboardHistory(models.Model):
    school_year = models.CharField(max_length=20)
    semester = models.CharField(max_length=30)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    archived_at = models.DateTimeField(auto_now_add=True)
    total_players = models.PositiveIntegerField(default=0)

    # keep the rest of your Meta class unchanged

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["school_year", "semester"],
                name="unique_leaderboard_history_period",
            )
        ]
        ordering = ["-archived_at"]

    def __str__(self):
        return f"{self.school_year} — {self.semester}"


class LeaderboardHistoryPlayer(models.Model):
    history = models.ForeignKey(
        LeaderboardHistory,
        on_delete=models.CASCADE,
        related_name="players",
    )
    player = models.ForeignKey(
        LeaderboardPlayer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="history_entries",
    )
    player_name = models.CharField(max_length=255)
    rank = models.PositiveIntegerField()
    total_points = models.IntegerField(default=0)
    surrendered_items = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["rank"]
        constraints = [
            models.UniqueConstraint(
                fields=["history", "player"],
                name="unique_player_per_history",
            )
        ]