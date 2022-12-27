from django.contrib import admin
from host.models import element,absUser
from django.contrib.auth.admin import UserAdmin
# Register your models here.
admin.site.register(element)
@admin.register(absUser)
class CustomUserAdmin(UserAdmin):
    model = absUser
    
    list_display = ['username','tarif']
    add_fieldsets=(
        *UserAdmin.add_fieldsets,
        (
            'Custom fields',
            {
                'fields':(
                    'tarif',
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
                    'tarif',
                )
            }
        )
    )