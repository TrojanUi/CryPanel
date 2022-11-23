from django.shortcuts import render,redirect
from main.models import Custom
from django.contrib.auth.models import User
from django.contrib.auth import logout as django_logout, login as django_login, authenticate,get_user_model
# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request,'main/index.html')
    else:
        return redirect('login')

def login(request):
    if request.method=='POST':
        login = request.POST['login']
        password = request.POST['password']
        user = authenticate(username = login,password = password)
        if user is None:
            context={
                'error':'Login or password is not correct',    
            }
            return render(request,'main/login.html',context)
        else:
            django_login(request,user)
    return render(request,'main/login.html')

def quit(request):
    if request.method=='POST':
        django_logout(request)
        return redirect('index')