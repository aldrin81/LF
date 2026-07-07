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