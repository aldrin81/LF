# gamification/services.py
from django.db import transaction
from .models import LeaderboardPlayer, PointTransaction

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