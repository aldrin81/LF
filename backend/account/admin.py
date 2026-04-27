from django.contrib import admin
from .models import Account

# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_username', 'role', 'created_at', 'updated_at')

    def get_username(self, obj):
        return obj.user.username
    
    get_username.short_description = 'Username'

admin.site.register(Account, AccountAdmin)