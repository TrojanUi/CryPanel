from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,'main/index.html')

def news(request):
    return render(request,'main/news.html')

def window(request):
    return render(request,'main/window_apps.html')

def app(request):
    return render(request,'main/app.html')

def games(request):
    return render(request,'main/games.html')