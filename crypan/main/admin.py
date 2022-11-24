from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Custom,domains,Cloudflare
# Register your models here.
admin.site.register(domains)
admin.site.register(Cloudflare)
@admin.register(Custom)
class CustomUserAdmin(UserAdmin):
    model = Custom
    
    list_display = ['username','user_rights']
    add_fieldsets=(
        *UserAdmin.add_fieldsets,
        (
            'Custom fields',
            {
                'fields':(
                  'user_rights', 
                  'loco',
                )
            }
        )
    )
    
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Custom fields',
            {
                'fields':(
                    'user_rights',
                    'loco',
        )
            }
        )
    )
