from django.urls import path
from django.conf.urls import handler404, handler500

from . import views


urlpatterns = [
]

handler404 = views.route_all