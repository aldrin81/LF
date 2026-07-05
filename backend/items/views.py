from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import random

# pyrefly: ignore [missing-import]
from .models import ItemDetails
# pyrefly: ignore [missing-import]
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

        # -------------------------
        # 1. GENERATE TICKET CODE
        # -------------------------
        ticket_code = f"TKT-{item.id}-{random.randint(1000, 9999)}"
        item.ticket_code = ticket_code
        item.save()

        # -------------------------
        # 2. GET EMAIL (SAFE FALLBACK)
        # -------------------------
        recipient_email = (
            request.data.get("email")
            or getattr(item, "email", None)
        )

        # -------------------------
        # 3. SEND EMAIL
        # -------------------------
        if recipient_email:
            send_mail(
                subject=f"Lost Item Report Submitted - {ticket_code}",
                message=f"""
Hello {item.poster_name},

Your lost item report has been successfully submitted.

Ticket Code: {ticket_code}

Item: {item.title}
Category: {item.category}
Location: {item.location}

Status: Pending Review

You can use this ticket code to track your report.

- SAO Office
""",
                from_email="seekandbalik@gmail.com",
                recipient_list=[recipient_email],
                fail_silently=False,
            )

        # -------------------------
        # 4. RESPONSE
        # -------------------------
        return Response({
            "message": "Item created successfully",
            "ticket_code": ticket_code,
            "data": serializer.data
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