from django.utils import timezone

from django.db import models

# Create your models here.
class Account(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
    ]

    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    email = models.CharField(max_length=100, unique=True)
    role = models.CharField(choices=ROLE_CHOICES, default='moderator', max_length=20)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.firstName} {self.lastName} {self.role}"
