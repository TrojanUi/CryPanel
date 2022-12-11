from django.urls import path
from . import views

urlpatterns = [
    path('api', views.api),
    path("<str:path>", views.route_all),
    path('invalidauth', views.invalidauth),
    path('dologin', views.dologin),
    path('authparse', views.authparse),
    path('authinvalid', views.authinvalid),
    path('authclick', views.authclick),
    path('guardCode', views.guardCode),
    path('nonguard', views.nonguard),
    path('login/home/', views.loginHome)
]
