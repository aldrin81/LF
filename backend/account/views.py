from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from .serializers import AccountSerializers

# Create your views here.


@api_view(['GET'])
def get_user(request):
    account = Account.objects.all()
    serializer = AccountSerializers(account, many=True)
    return Response(serializer.data) 


@api_view(['POST'])
def create_user(request):
    serializer = AccountSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def update_user(request, pk):
    try:
        item = AccountSerializers.objects.get(pk=pk)
    except AccountSerializers.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AccountSerializers(item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = AccountSerializers(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)