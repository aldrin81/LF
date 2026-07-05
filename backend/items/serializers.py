from rest_framework import serializers
# pyrefly: ignore [missing-import]
from .models import ItemDetails

class ItemSerializers(serializers.ModelSerializer):
    other_location = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True
    )

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

    def validate(self, attrs):
        location = attrs.get('location', '').strip()
        other_location = attrs.pop('other_location', '').strip()

        if location == 'Others':
            if not other_location:
                raise serializers.ValidationError({
                    'other_location': 'Please specify the location.'
                })

            attrs['location'] = other_location

        elif other_location:
            raise serializers.ValidationError({
                'other_location': 'Only fill this when location is Others.'
            })

        return attrs

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