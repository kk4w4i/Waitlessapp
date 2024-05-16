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


def index_view(request, url_context=None):
    store = request.GET.get('store')
    table = request.GET.get('table')

    if url_context:
        context = {
            'url_context': url_context,
            'store': store,
            'table': table
        }
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
    path('menu/<str:url_context>/', index_view, name='menu_store'),
    path('layout/<str:url_context>/', index_view, name='layout_store'),
    path('serving/<str:url_context>/', index_view, name='serve_store'),
    path('kitchen/<str:url_context>/', index_view, name='kitchen_store'),
    path('order/', index_view, name='order_store'),
    path('demo/menu/', index_view, name='index'),
    path('demo/layout/', index_view, name='index'),
    path('demo/serving/', index_view, name='index'),
    path('demo/kitchen/', index_view, name='index'),
    path('demo/order/', index_view, name='index'),
]
