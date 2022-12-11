from django.shortcuts import render,get_object_or_404
from .models import shablons

# Create your views here.
def index(request,url_pk):
    sites = shablons.objects.filter()
    todo = get_object_or_404(sites,pk=url_pk)
    return render(request,'main/index.html', {'todo':todo})

def main(request):
    return render(request,'main/main.html')
def download(request,url_pk):
    todo = get_object_or_404(shablons,pk=url_pk)
    return render(request,'main/download.html', {'todo':todo})