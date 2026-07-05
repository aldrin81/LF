import random

from django.conf import settings
from django.core.mail import send_mail

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ItemDetails
from .serializers import ItemSerializers


# GET ALL ITEMS
@api_view(['GET'])
def get_item_details(request):
    items = ItemDetails.objects.all()
    serializer = ItemSerializers(items, many=True, context={'request': request})
    return Response(serializer.data)


# CREATE ITEM (WITH EMAIL + TICKET SYSTEM)
@api_view(['POST'])
def create_item_details(request):
    serializer = ItemSerializers(data=request.data, context={'request': request})

    if serializer.is_valid():
        item = serializer.save()

        recipient_email = item.email or request.data.get("email")

        if recipient_email:
            try:
                send_mail(
                    subject=f"Lost Item Report Submitted - {item.ticket_code}",
                    message=f"""
Hello {item.poster_name},

Your lost item report has been successfully submitted.

Ticket Code: {item.ticket_code}

Item: {item.title}
Category: {item.category}
Location: {item.location}

Status: Pending Review

You can use this ticket code to track your report.

- SAO Office
""",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient_email],
                    fail_silently=False,
                )
            except Exception as e:
                print("Failed to send lost item email:", e)

        return Response({
            "message": "Item created successfully",
            "ticket_code": item.ticket_code,
            "data": ItemSerializers(item, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET SINGLE ITEM + UPDATE
@api_view(['GET', 'PUT'])
def item_details(request, pk):
    try:
        item = ItemDetails.objects.get(pk=pk)
    except ItemDetails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ItemSerializers(item, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ItemSerializers(item, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# DELETE ITEM
@api_view(['DELETE'])
def delete_item(request, pk):
    try:
        item = ItemDetails.objects.get(pk=pk)
    except ItemDetails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def track_item(request, ticket_code):
    try:
        item = ItemDetails.objects.get(ticket_code=ticket_code)

        serializer = ItemSerializers(item, context={'request': request})

        return Response({
            "found": True,
            "item": serializer.data
        })

    except ItemDetails.DoesNotExist:
        return Response({
            "found": False,
            "message": "Ticket not found"
        }, status=status.HTTP_404_NOT_FOUND)