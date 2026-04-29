from rest_framework import serializers
from .models import ItemDetails

class ItemSerializers(serializers.ModelSerializer):
    created_time = serializers.TimeField(
        format='%I:%M %p', 
        input_formats=['%H:%M', '%I:%M %p']
    )
    class Meta:
        model = ItemDetails
        fields = '__all__' #palitan field galing sa model
        extra_kwargs = {
            'created_time': {'format': '%H:%M'}
        }

        #gawa function na jpeg png lng and pwede 