from base64 import b64encode
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.apps import apps
from django.views.decorators.csrf import csrf_exempt
from requests import request

User = apps.get_model('main', 'User')
Link = apps.get_model('main', 'Link')
Domain = apps.get_model('main', 'Domain')
Design = apps.get_model('main', 'Design')



def route_all(req, path):
    domain = req.get_host()
    path = '/' + path
    link = Link.objects.filter(promo=path, domain=domain).first()
    if link:
        req.session['domain'] = domain
        req.session['path'] = path
        design = Design.objects.filter(name=link.design).first()
        return HttpResponse(design.html)
    else:
        return HttpResponse("Cannot get: /" + path)

