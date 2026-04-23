from django.db import models

# Create your models here.
class ItemDetails(models.Model):
    LOCATIONS = [
        ("ALL", "All"),
        ("CANTEEN", "Canteen"),
        ("GYM", "Gym"),
        ("HS_GROUNDS", "Highschool Grounds"),
        ("BASEMENT", "Basement"),
        ("MAIN_BLDG", "Main Building"),
        ("SAO_LOBBY", "Sao Lobby"),
        ("PARKING_AREA", "Parking Area"),
    ]

    CATEGORIES = [
        ("ALL", "All"),
        ("PERSONAL", "Personal"),
        ("ACCESSORIES", "Accessories"),
        ("ID", "Id"),
        ("ELECTRONICS", "Electronics"),
        ("KEYS", "Keys"),
        ("VALUABLES", "Valuables"),
    ]

    TYPE = [
        ("LOST", "Lost"),
        ("FOUND", "Found"),
    ]

    STATUS_OPTION = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("CLAIMED", "Claimed"),
        ("RETURNED", "Returned"),
        ("ARCHIVED", "Archived"),
    ]
    title = models.CharField(max_length=30)
    description = models.TextField(max_length=100, default='')
    category = models.CharField(choices=CATEGORIES, default="ALL", max_length=30)
    location = models.CharField(choices=LOCATIONS, default="ALL", max_length=30)
    created_at = models.DateTimeField(max_length=15)
    image = models.ImageField(upload_to='items_photos/', null=True, blank=True)
    status = models.CharField(choices=STATUS_OPTION, max_length=30, default="PENDING")
    poster_name = models.CharField(max_length=30, default='')
    poster_contact = models.CharField(max_length=30, default='')
    

    def __str__(self):
        return f"{self.title} {self.status}"

class declinedItems(models.Model):
    item_name = models.CharField(max_length=30)
    item_category = models.CharField(max_length=30)
    item_location = models.CharField(max_length=30)
    item_date_and_time = models.DateTimeField(max_length=15)
    item_image = models.ImageField(upload_to='declined_items_photos/', null=True, blank=True)
    item_status = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.item_name} {self.item_status}"