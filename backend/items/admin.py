from django.contrib import admin
from .models import ItemDetails

# Register your models here.
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'location', 'category', 'status', 'created_at', 'image')

admin.site.register(ItemDetails, ItemAdmin)