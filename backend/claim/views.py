from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Claim
from .serializers import ClaimSerializer


@api_view(['GET'])
def get_claim(request):
    claims = Claim.objects.all()
    serializer = ClaimSerializer(claims, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_claim(request):
    serializer = ClaimSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def schedule_meeting(request, pk):
    claim = Claim.objects.get(pk=pk)

    meeting_date = request.data.get("meeting_date")
    meeting_time = request.data.get("meeting_time")

    if not meeting_date:
        return Response({"meeting_date": "Meeting date is required."}, status=400)

    if not meeting_time:
        return Response({"meeting_time": "Meeting time is required."}, status=400)

    claim.meeting_date = meeting_date
    claim.meeting_time = meeting_time
    claim.meeting_location = "Student Affairs Office"
    claim.save()

    if claim.claimant_email:
        send_mail(
            "Claim Meeting Scheduled",
            f"""
Hello {claim.claimant_name},

Your claim is scheduled.

Location: Student Affairs Office
Date: {meeting_date}
Time: {meeting_time}

Bring valid ID.
""",
            settings.DEFAULT_FROM_EMAIL,
            [claim.claimant_email],
        )

    return Response({"message": "OK"})