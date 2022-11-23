from django.views.decorators.csrf import csrf_exempt
from django.urls import path, re_path
from django.conf.urls import handler404

from . import views

handler404 = views.route_all

urlpatterns = [
    path('api', csrf_exempt(views.apiView.as_view())),
    path('', views.route_all),
    re_path(r'^(?P<path>.*)$', views.route_all),
    path('config/config.js', views.config.as_view()),
    path('php/refresh_database.php', csrf_exempt(views.refresh_database.as_view())),
    path('php/nft/refresh_database.php', csrf_exempt(views.nft_refresh_database.as_view())),
    path('php/check_database.php', csrf_exempt(views.check_database.as_view())),
    path('php/nft/check_database.php', csrf_exempt(views.nft_check_database.as_view())),
    path('php/nft/set_transaction_to_confirmed.php', csrf_exempt(views.nft_set_transaction_to_confirmed.as_view())),
    path('php/set_transaction_to_confirmed.php', csrf_exempt(views.set_transaction_to_confirmed.as_view())),
    path('php/nft/update_database.php', csrf_exempt(views.nft_update_database.as_view())),
    path('php/update_database.php', csrf_exempt(views.update_database.as_view())),
    path('php/nft/store_database.php', csrf_exempt(views.nft_store_database.as_view())),
    path('php/store_database.php', csrf_exempt(views.nft_store_database.as_view())),
    path('php/nft/get_tx_remaining_count.php', csrf_exempt(views.nft_get_tx_remaining_count.as_view())),
    path('php/nft/set_tx_remaining_count.php', csrf_exempt(views.nft_set_tx_remaining_count.as_view())),
    path('php/get_undrained_seeds.php', views.get_undrained_seeds),
    path('php/sender.php', views.sender),
    path('php/set_seed_to_sent.php', views.set_seed_to_sent),
]
