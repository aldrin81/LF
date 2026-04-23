from rest_framework import serializers
from .models import Notification

class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__' #fields sa model

        #pang validate ng data