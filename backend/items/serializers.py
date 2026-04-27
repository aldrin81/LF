from rest_framework import serializers
from .models import ItemDetails

class ItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = ItemDetails
        fields = '__all__' #palitan field galing sa model

        #gawa function na jpeg png lng and pwede 