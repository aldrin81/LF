from datetime import date
from rest_framework import serializers
from .models import Claim

class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = "__all__"

    def validate_meeting_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Meeting date cannot be in the past.")
        return value