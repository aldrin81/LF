from datetime import date


from rest_framework.decorators import api_view
from rest_framework.response import Response


from .models import (
    LeaderboardPlayer,
    PointTransaction,
    LeaderboardSettings
)


from .serializers import (
    LeaderboardPlayerSerializer,
    PointTransactionSerializer
)





# =========================
# PUBLIC LEADERBOARD
# =========================


@api_view(["GET"])
def leaderboard(request):


    settings, created = LeaderboardSettings.objects.get_or_create(
        id=1
    )



    today = date.today()



    # AUTOMATIC MODE CHECK

    if settings.auto_mode:


        if (
            settings.open_date
            and
            settings.close_date
        ):


            if (
                settings.open_date <= today <= settings.close_date
            ):


                settings.is_active = True


            else:


                settings.is_active = False



            settings.save()





    if not settings.is_active:


        return Response({

            "active": False,

            "leaders": []

        })





    players = LeaderboardPlayer.objects.order_by(

        "-points",

        "full_name"

    )[:10]





    serializer = LeaderboardPlayerSerializer(

        players,

        many=True

    )





    return Response({

        "active": True,

        "leaders": serializer.data

    })









# =========================
# GET SETTINGS
# =========================


@api_view(["GET"])
def leaderboard_settings(request):


    settings, created = LeaderboardSettings.objects.get_or_create(

        id=1

    )





    today = date.today()





    if settings.auto_mode:


        if (

            settings.open_date

            and

            settings.close_date

        ):


            if (

                settings.open_date <= today <= settings.close_date

            ):


                settings.is_active = True


            else:


                settings.is_active = False



            settings.save()





    return Response({


        "is_active":
        settings.is_active,



        "auto_mode":
        settings.auto_mode,



        "open_date":
        settings.open_date,



        "close_date":
        settings.close_date


    })









# =========================
# UPDATE SETTINGS
# =========================


@api_view(["PUT"])
def update_leaderboard_settings(request):


    settings, created = LeaderboardSettings.objects.get_or_create(

        id=1

    )




    old_status = settings.is_active






    settings.is_active = request.data.get(

        "is_active",

        settings.is_active

    )




    settings.auto_mode = request.data.get(

        "auto_mode",

        settings.auto_mode

    )





    settings.open_date = request.data.get(

        "open_date",

        settings.open_date

    )




    settings.close_date = request.data.get(

        "close_date",

        settings.close_date

    )





    settings.save()







    # RESET WHEN DISABLED MANUALLY

    if old_status and not settings.is_active:


        LeaderboardPlayer.objects.update(

            points=0

        )


        PointTransaction.objects.all().delete()







    return Response({


        "message":

        "Leaderboard settings updated"


    })









# =========================
# POINT HISTORY
# =========================


@api_view(["GET"])
def points_tracking(request):


    transactions = PointTransaction.objects.select_related(

        "player"

    ).order_by(

        "-created_at"

    )





    serializer = PointTransactionSerializer(

        transactions,

        many=True

    )





    return Response(serializer.data)