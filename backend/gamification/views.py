from datetime import date, timedelta
from django.db.models import Sum

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    LeaderboardPlayer,
    PointTransaction,
    LeaderboardSettings,
    LeaderboardHistory,
)
from .serializers import (
    LeaderboardPlayerSerializer,
    CurrentLeaderboardSerializer,
    PointTransactionSerializer,
    ArchiveLeaderboardSerializer,
    LeaderboardHistorySerializer,
)
from .services import archive_leaderboard


def get_school_year_and_semester(reference_date):
    year = reference_date.year
    month = reference_date.month

    if 8 <= month <= 12:
        return f"{year}-{year + 1}", "1st Semester"

    if 1 <= month <= 5:
        return f"{year - 1}-{year}", "2nd Semester"

    return str(year), "Short Term"


def get_current_leaderboard_settings():
    settings, _ = LeaderboardSettings.objects.get_or_create(id=1)
    today = date.today()

    if settings.auto_mode and settings.open_date and settings.close_date:
        if today >= settings.close_date:
            school_year, semester = get_school_year_and_semester(
                settings.close_date
            )

            archive_leaderboard(
                school_year=school_year,
                semester=semester,
                start_date=settings.open_date,
                end_date=settings.close_date - timedelta(days=1),
            )

            if settings.is_active:
                settings.is_active = False
                settings.save(update_fields=["is_active", "updated_at"])

        else:
            should_be_active = settings.open_date <= today < settings.close_date

            if settings.is_active != should_be_active:
                settings.is_active = should_be_active
                settings.save(update_fields=["is_active", "updated_at"])

    return settings


@api_view(["GET"])
def leaderboard(request):
    settings = get_current_leaderboard_settings()

    days_left = None

    if settings.auto_mode and settings.close_date:
        days_left = max((settings.close_date - date.today()).days, 0)

    if not settings.is_active:
        return Response({
            "active": False,
            "leaders": [],
            "days_left": days_left,
            "close_date": settings.close_date,
        })

    transaction_filters = {}

    if settings.open_date:
        transaction_filters["transactions__created_at__date__gte"] = (
            settings.open_date
        )

    if settings.close_date:
        transaction_filters["transactions__created_at__date__lte"] = (
            settings.close_date
        )

    players = (
        LeaderboardPlayer.objects
        .filter(**transaction_filters)
        .annotate(leaderboard_points=Sum("transactions__points"))
        .filter(leaderboard_points__gt=0)
        .order_by("-leaderboard_points", "full_name")[:20]
    )

    serializer = CurrentLeaderboardSerializer(players, many=True)

    return Response({
        "active": True,
        "leaders": serializer.data,
        "days_left": days_left,
        "close_date": settings.close_date,
    })


@api_view(["GET"])
def points_tracking(request):
    transactions = (
        PointTransaction.objects
        .select_related("player")
        .order_by("-created_at")
    )

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

    auto_mode = request.data.get("auto_mode", settings.auto_mode)
    open_date = request.data.get("open_date") or None
    close_date = request.data.get("close_date") or None

    if auto_mode and (not open_date or not close_date):
        return Response(
            {"detail": "Start date and turn-off date are required in automatic mode."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if auto_mode and open_date > close_date:
        return Response(
            {"detail": "Start date cannot be later than turn-off date."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    settings.auto_mode = auto_mode
    settings.open_date = open_date
    settings.close_date = close_date

    if not auto_mode:
        settings.is_active = request.data.get(
            "is_active",
            settings.is_active,
        )

    settings.save()

    return Response({
        "message": "Leaderboard settings updated",
        "is_active": settings.is_active,
        "auto_mode": settings.auto_mode,
        "open_date": settings.open_date,
        "close_date": settings.close_date,
    })


@api_view(["GET"])
def leaderboard_history(request):
    """
    Optional filters:
    ?school_year=2026-2027
    ?semester=1st Semester
    """
    histories = (
        LeaderboardHistory.objects
        .prefetch_related("players__player")
        .all()
    )

    school_year = request.query_params.get("school_year")
    semester = request.query_params.get("semester")

    if school_year:
        histories = histories.filter(school_year=school_year)

    if semester:
        histories = histories.filter(semester=semester)

    serializer = LeaderboardHistorySerializer(histories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def leaderboard_history_detail(request, history_id):
    try:
        history = (
            LeaderboardHistory.objects
            .prefetch_related("players__player")
            .get(id=history_id)
        )
    except LeaderboardHistory.DoesNotExist:
        return Response(
            {"detail": "Leaderboard history not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = LeaderboardHistorySerializer(history)
    return Response(serializer.data)


@api_view(["POST"])
def archive_leaderboard_history(request):
    """
    Manually archive a semester.

    Example body:
    {
      "school_year": "2026-2027",
      "semester": "1st Semester",
      "start_date": "2026-08-01",
      "end_date": "2026-12-20"
    }
    """
    serializer = ArchiveLeaderboardSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    history, created = archive_leaderboard(
        school_year=serializer.validated_data["school_year"],
        semester=serializer.validated_data["semester"],
        start_date=serializer.validated_data["start_date"],
        end_date=serializer.validated_data["end_date"],
    )

    response_serializer = LeaderboardHistorySerializer(history)

    return Response(
        {
            "message": (
                "Leaderboard history created successfully."
                if created
                else "This school year and semester are already archived."
            ),
            "created": created,
            "history": response_serializer.data,
        },
        status=(
            status.HTTP_201_CREATED
            if created
            else status.HTTP_200_OK
        ),
    )