from rest_framework import serializers
from .models import Claim

class ClaimSerializers(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = '__all__' #palitan mo ito fields sa models

    #gawa function pang validate ng data
