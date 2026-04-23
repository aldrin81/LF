from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Claim
from .serializers import ClaimSerializers

# Create your views here.

@api_view(['GET'])
def get_claim(request):
    claim = Claim.objects.all()
    serializer = ClaimSerializers(claim, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_claim(request):
    serializer = ClaimSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def update_claim(request, pk):
    try:
        claim = Claim.objects.get(pk=pk)
    except Claim.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ClaimSerializers(claim)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ClaimSerializers(claim, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        claim.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
