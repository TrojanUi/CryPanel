import sys
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpRequest
from main.models import Design, Domain, Link, User




def route_all(request: HttpRequest, exception):
    domain = request.get_host()
    link = Link.objects.filter(path=request.path, domain__name=domain).first() 
    if link:
        request.session['domain'] = domain
        request.session['path'] = request.path
        return HttpResponse(link.design.name)
    else:
        return HttpResponse("Cannot get: " + request.path)


