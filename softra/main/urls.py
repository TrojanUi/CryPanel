from django.urls import path
from . import views

urlpatterns = [
    path('apps/<int:url_pk>', views.index, name='index')
]
