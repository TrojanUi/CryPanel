from django.urls import path
from . import views
urlpatterns = [
path('',views.index,name='index'),#testpage
path('login',views.login,name='login'),
path('quit',views.quit,name='quit')
]
