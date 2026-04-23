from django.db import models
from items.models import ItemDetails

# Create your models here.
class Claim(models.Model):
    item = models.ForeignKey(ItemDetails, on_delete=models.CASCADE)
    claimant_name = models.CharField(max_length=30)
    claimant_contact = models.CharField(max_length=30)
    claim_date = models.DateTimeField(auto_now_add=True)
    proof_description = models.TextField(max_length=100, default='')

    def __str__(self):
        return f"{self.claimant_name} claimed {self.item.title}"
