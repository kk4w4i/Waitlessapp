import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.log import logging
logger = logging.getLogger(__name__)

@require_POST
def signup_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    stores = []

    if username is None or password is None or email is None:
        return JsonResponse({"detail": "Please provide username, password, and email"}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, stores=stores)
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

from .models import Product
from .serializers import ProductSerializer

@require_POST
def create_product(request):
    try:
        data = json.loads(request.body)
        price = data.get('price')
        category = data.get('category')
        status = data.get('status')
        name = data.get('name')
        image = data.get('image')
        store_id = data.get('storeId')

        existing_store = Store.objects.filter(
                id=store_id, 
            ).exists()
        
        if existing_store:
            product = Product(
                price=price,
                category=category,
                status=status,
                name=name,
                image=image,
                store_id=store_id
            )
            product.save()
        else:
            return JsonResponse({"detail" : "This store does not exist"})
        return JsonResponse({"detail": "Product created successfully"})
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        return JsonResponse({"detail": "Failed to create product"}, status=500)

@require_POST 
def get_products(request):
    data = json.loads(request.body)
    store_id = data.get('storeId')
    print(store_id)
    products = Product.objects.filter(store_id=store_id)
    print(products)
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)

from .models import Store
from .serializers import StoreSerializer
from .models import StoreProfile
from .serializers import StoreProfileSerializer

@require_POST
@login_required
def create_store(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        address = data.get('address')
        email = data.get('email')

        name_lc = name.lower()
        url = name_lc.replace(' ', '-')

        store = Store(
            name=name,
            address=address,
            email=email,
            url=url
        )
        store.save()

        store_profile = StoreProfile(
            store_id = store.id,
            username = request.user.username,
            store_url = url,
            store_name = name,
            role = 'Manager'
        )
        store_profile.save()

        return JsonResponse({"detail": "Store created successfully"})
    except Exception as e:
        logger.error(f"Error creating store: {str(e)}")
        return JsonResponse({"detail": "Failed to create store"}, status=500)
    
def get_stores(request):
    stores = Store.objects.all()
    serializer = StoreSerializer(stores, many=True)
    return JsonResponse(serializer.data, safe=False)
    
@require_POST
@login_required
def create_store_profile(request):
    data = json.loads(request.body)
    store_key = data.get('key')

    if store_key:
        try:
            store = Store.objects.get(key=store_key)
            user = User.objects.get(id=request.user.id)

            existing_profile_exists = StoreProfile.objects.filter(
                store_id=store.id, 
                user__username=user.username
            ).exists()

            if existing_profile_exists:
                return JsonResponse({"detail": "You have already connected to this store"}, status=400)

            store_profile = StoreProfile(
                store_id = store.id,
                username = user.username,
                store_url = store.url,
                store_name = store.name,
                role = 'Staff',
            )
            store_profile.save()
            return JsonResponse({"detail": "Store Successfully Connected, made your new store profile"})
        except Exception as e:
            logger.error(f"Error creating store profile: {str(e)}")
            return JsonResponse({"detail": "Failed to create store profile"}, status=500) 
            
def get_store_profiles(request):
    store_profiles = StoreProfile.objects.filter(username=request.user.username)
    serializer = StoreProfileSerializer(store_profiles, many=True)
    return JsonResponse(serializer.data, safe=False) 




    