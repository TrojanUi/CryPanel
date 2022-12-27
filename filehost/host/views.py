from django.shortcuts import render,get_object_or_404,redirect
from host.models import element,absUser
from filehost.settings import MEDIA_ROOT
# Create your views here.
import os
from django.contrib.auth import authenticate, logout, login as django_login
def index(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            h = request.FILES['fileob']
            a = element(file = h)
            
            
            a.save()
            host = request.META['HTTP_HOST']
            urlka = f'{host}/media/{h}'
            ves = os.stat(f'{MEDIA_ROOT}/{h}')
            ves= ves.st_size
            context={
                'urlka':urlka
            }
            return render(request,'main/index.html',context)
        return render(request,'main/index.html')
    else:
        if request.method == 'POST':
            login = request.POST['login']
            pas = request.POST['password']
            user = authenticate(username=login,password=pas)
            if user:
                django_login(request,user)
                return redirect('index')
            else:
                return render(request,'main/login.html',{'error':'login or password is not correct'})
        return render(request,'main/login.html')

        