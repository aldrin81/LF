from django.db import models

# Create your models here.
class Notification(models.Model):
    recipient_contact = models.CharField(max_length=30)
    message = models.TextField(max_length=255)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification to {self.recipient_contact} - Sent: {self.is_sent}"
