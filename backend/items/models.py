from django.db import models
import uuid

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
        ("Surrendered", "Surrendered"),
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
    location = models.CharField(default="All", max_length=254)
    created_date = models.DateField()
    created_time = models.TimeField()
    image = models.ImageField(upload_to='items_photos/', null=True, blank=True)
    status = models.CharField(choices=STATUS_OPTION, max_length=30, default="Pending")
    type = models.CharField(choices=ITEM_TYPE, max_length=30, default="Lost")
    poster_name = models.CharField(max_length=30, default='')

    student_id = models.CharField(max_length=30, null=True, blank=True)

    email = models.EmailField(max_length=254, default='')

    time_stamp = models.DateTimeField(auto_now_add=True)

    #GAMIFICATION
    surrender_points_awarded = models.BooleanField(default=False)
    claimed_bonus_awarded = models.BooleanField(default=False)

    # 🔥 TICKET SYSTEM
    ticket_code = models.CharField(max_length=20, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.ticket_code:
            self.ticket_code = f"TKT-{self.id}-{uuid.uuid4().hex[:4].upper()}"
            super().save(update_fields=["ticket_code"])

    def __str__(self):
        return f"{self.title} {self.type} {self.status}"