from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Custom,domains
# Register your models here.
admin.site.register(domains)

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
        )
            }
        )
    )
