from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Claim
from .serializers import ClaimSerializer

User = get_user_model()


@api_view(['GET'])
def get_claim(request):
    claims = Claim.objects.all()
    serializer = ClaimSerializer(claims, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_claim(request):
    serializer = ClaimSerializer(data=request.data)

    if serializer.is_valid():
        claim = serializer.save()

        return Response(
            {
                "message": "Claim appointment request submitted successfully.",
                "claim": ClaimSerializer(claim).data,
            },
            status=201,
        )

    return Response(serializer.errors, status=400)

@api_view(["PUT"])
def review_claim(request, pk):
    if (
        not request.user.is_authenticated
        or getattr(request.user, "role", None) not in ["admin", "moderator"]
    ):
        return Response(
            {"detail": "Only admins or moderators can review claims."},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        claim = Claim.objects.get(pk=pk)
    except Claim.DoesNotExist:
        return Response(
            {"detail": "Claim request not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if claim.status != "PENDING":
        return Response(
            {"detail": "This claim request was already reviewed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    decision = request.data.get("decision")
    remark = (request.data.get("admin_remark") or "").strip()

    if decision not in ["APPROVED", "DECLINED"]:
        return Response(
            {"detail": "Decision must be APPROVED or DECLINED."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if decision == "DECLINED" and not remark:
        return Response(
            {"admin_remark": "A reason is required when declining."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    claim.status = decision
    claim.admin_remark = remark
    claim.reviewed_by = request.user
    claim.reviewed_at = timezone.now()
    claim.save()

    email_sent = False

    if claim.claimant_email:
        if decision == "APPROVED":
            subject = "Claim Appointment Accepted"
            message = f"""
    Hello {claim.claimant_name},

    Your claim appointment has been accepted.

    Item: {claim.item.title}
    Date: {claim.meeting_date}
    Time: {claim.meeting_time}
    Location: {claim.meeting_location}

    Please bring your school ID and present it to SAO.
    """
        else:
            subject = "Claim Appointment Declined"
            message = f"""
    Hello {claim.claimant_name},

    Your claim appointment request was declined.

    Reason:
    {claim.admin_remark}

    Please contact Student Affairs if you need assistance.
    """

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [claim.claimant_email],
                fail_silently=False,
            )
            email_sent = True

        except Exception as error:
            print("Failed to send claim review email:", error)

    return Response({
        "claim": ClaimSerializer(claim).data,
        "email_sent": email_sent,
        "message": (
            "Claim reviewed and email sent."
            if email_sent
            else "Claim reviewed, but the email could not be sent."
        ),
})