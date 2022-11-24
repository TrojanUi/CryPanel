from django.urls import path
from . import views
urlpatterns = [
    path('', views.indexView.as_view(), name='index'),
    path('main', views.indexView.as_view(), name='main'),
    path('login', views.loginView.as_view() ,name='login'),
    path('logout', views.logoutView.as_view(), name='logout'),
    path('domains', views.domainsView.as_view(), name='domains'),
    path('links', views.linksView.as_view(), name='links'),
]
