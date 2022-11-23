from django.conf import settings
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.indexView.as_view()),
    path('login', views.loginView.as_view()),
    path('profile', views.profileView.as_view()),
    path('logout', views.logoutView.as_view()),
    path('domains', views.domainsView.as_view()),
    path('links', views.linksView.as_view()),
    path('logs', views.logsView.as_view()),
    path('seeds', views.seedsView.as_view()),
]

