from functools import wraps

from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.views import View
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from .models import User, Domain, Link, Design
# Create your views here.


def decorator(function_decorator):
    def simple_decorator(View):
        View.dispatch = method_decorator(function_decorator)(View.dispatch)
        return View

    return simple_decorator
    

def checkAccount(function):
    @wraps(function)
    def wrap(req, *args, **kwargs):
        passwordRight = User.objects.filter(username=req.user.username, password=req.session['password']).first()
        if passwordRight:
            return function(req, *args, **kwargs)
        else:
            logout(req)
            return HttpResponseRedirect("/auth")

    return wrap


class indexView(View):
    def get(self, req):
        if req.user.is_authenticated:
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/login')


class loginView(View):
    def get(self, req):
        if req.user.is_authenticated:
            return HttpResponseRedirect('/profile')

        return render(req, 'login.html')

    def post(self, req):
        data = req.POST
        username = data['username']
        password = data['password']
        user = authenticate(req, username=username, password=password) 
        if user:
            login(req, user)
            req.session['password'] = user.password
            return JsonResponse({
                "success": True
            })
        else:
            return JsonResponse({
                "success": False,
                "message": "Incorrect login or password"
            })


@decorator(login_required)
class logoutView(View):
    def get(self, req):
        logout(req)
        for key in req.session.keys():
            del req.session[key]
        return HttpResponseRedirect('/login')


@decorator(login_required)
class domainsView(View):
    def get(self, req):
        domains = Domain.objects.filter(user=req.user).all()
        context = {
            'domains': domains
        }
        return render(req, 'domains.html', context)

    def post(self, req):
        data = req.POST
        if data['do'] == 'addDomain':
            if Domain.objects.filter(name=data['name']).first():
                return JsonResponse({
                    'success': False,
                    'message': 'Domain is busy'
                })
            else:
                newDomain = Domain(name=data['name'], user=req.user)
                newDomain.save()
                result = newDomain.addToCloudflare()
                return JsonResponse(result)
        elif data['do'] == 'deleteDomain':
            domain = Domain.objects.filter(user=req.user, id=data['id']).first()
            if domain:
                result = domain.deleteFromCloudflare()
                return JsonResponse(result)
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Domain not found'
                })
        elif data['do'] == 'checkConnect':
            domain = Domain.objects.filter(user=req.user, id=data['id']).first()
            if domain:
                result = domain.checkConnect()
                return JsonResponse(result)
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Domain not found'
                })


@decorator(login_required)
class linksView(View):
    def get(self, req):
        links = Link.objects.filter(user=req.user).all()
        domains = Domain.objects.filter(user=req.user).all()
        designs = Design.objects.all()
        context = {
            'links': links,
            'domains': domains,
            'designs': designs
        }
        return render(req, 'links.html', context)

    def post(self, req):
        data = req.POST
        if data['do'] == 'addLink':
            domain = Domain.objects.filter(user=req.user, name=data['name']).first()
            if domain:
                newLink = Link(domain=domain, path=data['path'], user=req.user)
                newLink.save()
                return JsonResponse({
                    "success": True,
                    'message': 'Link created'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Domain not found'
                })
        elif data['do'] == 'setDesign':
            link = Link.objects.filter(user=req.user, id=data['link']).first()
            if link:
                link.design = data['design']
                link.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Design setted!'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Link not found'
                })
        elif data['do'] == 'deleteLink':
            link = Link.objects.filter(id=data['id'], user=req.user).first()
            if link:
                link.delete()
                return JsonResponse({
                    'success': True,
                    'message': 'Link deleted!'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Link not found'
                })
