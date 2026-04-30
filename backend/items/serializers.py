from rest_framework import serializers
from .models import ItemDetails

class ItemSerializers(serializers.ModelSerializer):
    created_time = serializers.TimeField(
        format='%I:%M %p', 
        input_formats=['%H:%M', '%I:%M %p']
    )
    
    class Meta:
        model = ItemDetails
        fields = '__all__'
        extra_kwargs = {
            'created_time': {'format': '%H:%M'}
        }
    
    def to_representation(self, instance):
        """Convert image field to full URL in responses"""
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                data['image'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image'] = instance.image.url
        return data