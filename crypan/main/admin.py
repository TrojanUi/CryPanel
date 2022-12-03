from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as UserAdminModel
from django.utils.html import mark_safe


from .models import User, Design, Link, Domain, Cloudflare
# Register your models here.


class LinkAdmin(admin.ModelAdmin):
    model = Link
    list_display = ['id', 'user', 'domain', 'path', 'design', 'created_at',]
    list_editable = ['domain', 'path', 'design', 'created_at',]


class UserAdmin(UserAdminModel):
    model = User
    list_display = ['id', 'username',  'role', 'created_at', 'is_staff', 'is_active', 'is_superuser'] 
    list_editable = ['username',  'role', 'created_at', 'is_staff', 'is_active', 'is_superuser'] 
    list_filter = ('username', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'role',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_staff', 'is_active', 'is_superuser',  'role',)}
        ),
    )
    search_fields = ('username',)
    ordering = ('id',)


class CloudflareAdmin(admin.ModelAdmin):
    model = Cloudflare
    list_display = ['id', 'email', 'token', 'used', 'cloud_id', 'created_at']
    list_editable = ['email', 'token', 'used', 'cloud_id']


class DesignAdmin(admin.ModelAdmin):
    model = Design
    list_display = ['id', 'name', 'preview', 'type', 'created_at',]
    list_editable = ['name', 'type']
    def preview(self, obj):
        return mark_safe(f'<img src="/{obj.img}" width="50%" height="50%" />')


class DomainAdmin(admin.ModelAdmin):
    model = Domain
    list_display = ['id', 'user', 'name', 'ns1', 'ns2', 'cloudId', 'cloud', 'status', 'created_at']
    list_editable = ['name', 'ns1', 'ns2', 'cloudId', 'cloud', 'status']



admin.site.register(User, UserAdmin)
admin.site.register(Domain, DomainAdmin)
admin.site.register(Cloudflare, CloudflareAdmin)
admin.site.register(Link, LinkAdmin)
admin.site.register(Design, DesignAdmin)