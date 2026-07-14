# gamification/services.py
from collections import defaultdict

from django.db import transaction

from .models import (
    LeaderboardPlayer,
    LeaderboardHistory,
    LeaderboardHistoryPlayer,
    PointTransaction,
)

CLAIMED_BONUS_POINTS = 10

ITEM_POINTS = {
    "cellphone": 5,
    "phone": 5,
    "electronics": 5,
    "wallet": 5,
    "id": 3,
    "keys": 3,
    "accessories": 2,
    "personal": 2,
    "valuables": 5,
}


def get_item_points(item):
    title = (item.title or "").lower()
    category = (item.category or "").lower()

    if "cellphone" in title or "phone" in title:
        return 5

    return ITEM_POINTS.get(category, 1)


@transaction.atomic
def award_points(student_id, full_name, points, reason, item_id=None):
    if not student_id or points <= 0:
        return None

    clean_student_id = student_id.strip()
    clean_name = " ".join((full_name or "").strip().split())

    player, _ = LeaderboardPlayer.objects.get_or_create(
        student_id=clean_student_id,
        defaults={
            "full_name": clean_name,
        }
    )

    if clean_name and player.full_name != clean_name:
        player.full_name = clean_name
        player.save(update_fields=["full_name"])

    point_transaction, created = PointTransaction.objects.get_or_create(
        player=player,
        reason=reason,
        item_id=item_id,
        defaults={
            "points": points,
        }
    )

    if created:
        player.points += points
        player.save(update_fields=["points"])

    return point_transaction

@transaction.atomic
def archive_leaderboard(school_year, semester, start_date, end_date):
    history, created = LeaderboardHistory.objects.get_or_create(
        school_year=school_year,
        semester=semester,
        defaults={
            "start_date": start_date,
            "end_date": end_date,
        },
    )

    # Prevent duplicate history for the same school year and semester.
    if not created:
        return history, False

    transactions = (
        PointTransaction.objects
        .select_related("player")
        .filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date,
        )
    )

    player_totals = defaultdict(
        lambda: {
            "player": None,
            "total_points": 0,
            "surrendered_items": 0,
        }
    )

    for transaction in transactions:
        player = transaction.player
        values = player_totals[player.id]

        values["player"] = player
        values["total_points"] += transaction.points

        if transaction.reason == "SURRENDER_ITEM":
            values["surrendered_items"] += 1

    ranked_players = sorted(
        player_totals.values(),
        key=lambda entry: (
            -entry["total_points"],
            -entry["surrendered_items"],
            entry["player"].full_name.lower(),
        ),
    )

    LeaderboardHistoryPlayer.objects.bulk_create([
        LeaderboardHistoryPlayer(
            history=history,
            player=entry["player"],
            player_name=entry["player"].full_name,
            rank=rank,
            total_points=entry["total_points"],
            surrendered_items=entry["surrendered_items"],
        )
        for rank, entry in enumerate(ranked_players, start=1)
    ])

    history.total_players = len(ranked_players)
    history.save(update_fields=["total_players"])

    return history, True