from django.db import models
from items.models import ItemDetails

class Claim(models.Model):
    CLAIM_TIME_CHOICES = [
        ("9:00 AM - 10:00 AM", "9:00 AM - 10:00 AM"),
        ("10:00 AM - 11:00 AM", "10:00 AM - 11:00 AM"),
        ("11:00 AM - 12:00 PM", "11:00 AM - 12:00 PM"),
        ("1:00 PM - 2:00 PM", "1:00 PM - 2:00 PM"),
        ("2:00 PM - 3:00 PM", "2:00 PM - 3:00 PM"),
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

    def __str__(self):
        return f"{self.claimant_name} claimed {self.item.title}"