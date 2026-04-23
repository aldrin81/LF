from django.contrib import admin
from .models import Account

# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstName', 'lastName', 'username', 'email', 'role', 'created_at', 'updated_at')

admin.site.register(Account, AccountAdmin)