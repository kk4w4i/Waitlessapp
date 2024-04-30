"""
URL configuration for waitlessapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from django.http import HttpResponse

def index_view(request, store_url=None):
    # You can add any logic here to fetch data related to store_url if necessary
    if store_url:
        context = {'store_url': store_url}
        return render(request, 'dist/index.html', context)
    else:
        return render(request, 'dist/index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', index_view, name='index'),
    path('signin/', index_view, name='signin'),
    path('signup/', index_view, name='signup'),
    path('user/', index_view, name='user'),
    path('menu/<str:store_url>/', index_view, name='menu_store'),
    path('demo/menu/', index_view, name='index'),
    path('demo/layout/', index_view, name='index'),
    path('demo/serving/', index_view, name='index'),
    path('demo/kitchen/', index_view, name='index'),
    path('demo/order/', index_view, name='index'),
]
