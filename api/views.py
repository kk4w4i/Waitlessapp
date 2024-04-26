import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.tokens import RefreshToken

@require_POST
def signup_view(request):
    data = json.loads(request.body)
    username = data.get("email")
    password = data.get("password")
    email = data.get("email")
    first_name = data.get("firstName")
    last_name = data.get("lastName")

    if username is None or password is None or email is None:
        return JsonResponse({"detail": "Please provide username, password, and email"}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
    except Exception as e:
        return JsonResponse({"detail": str(e)}, status=400)

    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        "detail": "User created successfully",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh)
    })

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Please provide username and password"}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    login(request, user)

    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        "detail": "Successfully logged in!",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh)
    })

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You are not logged in"}, status=400)

    logout(request)
    return JsonResponse({"detail": "Successfully logged out"})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})

    return JsonResponse({"isauthenticated": True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})

    return JsonResponse({"username": request.user.username})

