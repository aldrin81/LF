from django.urls import path
# pyrefly: ignore [missing-import]
from .views import (
    get_item_details,
    create_item_details,
    item_details,
    delete_item,
    track_item
)

urlpatterns = [
    path("details/", get_item_details),
    path("create/", create_item_details),
    path("details/<int:pk>/", item_details),
    path("delete/<int:pk>/", delete_item),
    path("track/<str:ticket_code>/", track_item),
]