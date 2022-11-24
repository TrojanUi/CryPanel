from django.shortcuts import render,get_object_or_404
from host.models import element
# Create your views here.
def index(request):
    if request.method == 'POST':
        h = request.FILES['fileob']
        a = element(file = h)
        a.save()
        host = request.META['HTTP_HOST']
        urlka = f'{host}/media/{h}'
        context={
            'urlka':urlka
        }
        return render(request,'main/index.html',context)
    return render(request,'main/index.html')

        