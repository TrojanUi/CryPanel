from django.shortcuts import render,redirect
from main.models import Custom,domains
from django.contrib.auth.models import User
from django.contrib.auth import logout as django_logout, login as django_login, authenticate,get_user_model
# Create your views here.
from django.http import HttpResponseRedirect, JsonResponse
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
    
    
    
def add_domains(request):
    if request.method=='GET':
        return render(request,'main/domens.html')
    if request.method == 'POST':
        data = request.POST
        if domains.objects.filter(name_domain=data['name_domain']).first():
            return JsonResponse({
                    'success': False,
                    'message': 'Domain is busy'
                })
        else:
            if data['shablon']=='Loco(file hosting)':
                varianta ='loco'
            new_domain = domains(name_domain=data['name_domain'],variant=varianta,owner=request.user)
            new_domain.save()
            result = new_domain.addToCloudflare()
            return JsonResponse(result) #7bd5645d42632802889e9b3c1f60d292d7a15