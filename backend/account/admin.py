from django.contrib import admin
from .models import Account

# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'role', 'created_at', 'updated_at')

admin.site.register(Account, AccountAdmin)