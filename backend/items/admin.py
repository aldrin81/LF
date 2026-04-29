from django.contrib import admin
from .models import ItemDetails

# Register your models here.
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type', 'location', 'category', 'status', 'created_date', 'created_time', 'image')

admin.site.register(ItemDetails, ItemAdmin)