from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ItemDetails
from .serializers import ItemSerializers

# Create your views here.

@api_view(['GET'])
def get_item_details(request):
    lost_item = ItemDetails.objects.all()
    serializer = ItemSerializers(lost_item, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_item_details(request):
    serializer = ItemSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def item_details(request, pk):
    try:
        item = ItemDetails.objects.get(pk=pk)
    except ItemDetails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ItemSerializers(item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ItemSerializers(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)