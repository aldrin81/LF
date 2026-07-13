from django.db import models
from django.conf import settings
from items.models import ItemDetails

class Claim(models.Model):
    CLAIM_TIME_CHOICES = [
        ("9:00 AM - 10:00 AM", "9:00 AM - 10:00 AM"),
        ("10:00 AM - 11:00 AM", "10:00 AM - 11:00 AM"),
        ("11:00 AM - 12:00 PM", "11:00 AM - 12:00 PM"),
        ("1:00 PM - 2:00 PM", "1:00 PM - 2:00 PM"),
        ("2:00 PM - 3:00 PM", "2:00 PM - 3:00 PM"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("DECLINED", "Declined"),
    ]

    item = models.ForeignKey(ItemDetails, on_delete=models.CASCADE)

    claimant_name = models.CharField(max_length=30)
    claimant_contact = models.CharField(max_length=30)
    claimant_email = models.EmailField(null=True, blank=True)

    proof_description = models.TextField(max_length=100, default='')
    claim_date = models.DateTimeField(auto_now_add=True)

    meeting_date = models.DateField(null=True, blank=True)
    meeting_time = models.CharField(
        max_length=30,
        choices=CLAIM_TIME_CHOICES,
        null=True,
        blank=True
    )

    meeting_location = models.CharField(
        max_length=100,
        default="Student Affairs Office"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    admin_remark = models.TextField(blank=True, default="")
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.claimant_name} claimed {self.item.title}"