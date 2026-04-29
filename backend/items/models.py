from django.db import models

# Create your models here.
class ItemDetails(models.Model):
    LOCATIONS = [
        ("All", "All"),
        ("Canteen", "Canteen"),
        ("Gym", "Gym"),
        ("Highschool Grounds", "Highschool Grounds"),
        ("Basement", "Basement"),
        ("Main Building", "Main Building"),
        ("Sao Lobby", "Sao Lobby"),
        ("Parking Area", "Parking Area"),
    ]

    CATEGORIES = [
        ("All", "All"),
        ("Personal", "Personal"),
        ("Accessories", "Accessories"),
        ("Id", "Id"),
        ("Electronics", "Electronics"),
        ("Keys", "Keys"),
        ("Valuables", "Valuables"),
    ]

    ITEM_TYPE = [
        ("Lost", "Lost"),
        ("Found", "Found"),
    ]

    STATUS_OPTION = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Claimed", "Claimed"),
        ("Returned", "Returned"),
        ("Archived", "Archived"),
    ]
    title = models.CharField(max_length=30)
    description = models.TextField(max_length=100, default='')
    category = models.CharField(choices=CATEGORIES, default="All", max_length=30)
    location = models.CharField(choices=LOCATIONS, default="All", max_length=30)
    created_date = models.DateField()
    created_time = models.TimeField()
    image = models.ImageField(upload_to='items_photos/', null=True, blank=True)
    status = models.CharField(choices=STATUS_OPTION, max_length=30, default="Pending")
    type = models.CharField(choices=ITEM_TYPE, max_length=30, default="Lost")
    poster_name = models.CharField(max_length=30, default='')
    poster_contact = models.CharField(max_length=30, default='')
    

    def __str__(self):
        return f"{self.title} {self.type} {self.status}"

class declinedItems(models.Model):
    item_name = models.CharField(max_length=30)
    item_category = models.CharField(max_length=30)
    item_location = models.CharField(max_length=30)
    item_date_and_time = models.DateTimeField(max_length=15)
    item_image = models.ImageField(upload_to='declined_items_photos/', null=True, blank=True)
    item_status = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.item_name} {self.item_status}"