from django.urls import path
from . import views
urlpatterns = [
path('',views.index,name='index'),
path('news/',views.news,name='news'),
path('windows/',views.window,name='window'),
path('app/',views.app,name='app'),
path('games/',views.games,name='games')
]
