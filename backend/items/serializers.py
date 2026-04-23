from rest_framework import serializers
from .models import ItemDetails

class ItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = ItemDetails
        fields = '__all__'