import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.utils.log import logging
logger = logging.getLogger(__name__)
from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP

from .models import Store, StoreProfile, Product, Layout, Table
from .serializers import StoreSerializer, StoreProfileSerializer, ProductSerializer

@csrf_exempt
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
        login(request, user)
        csrf_token = get_token(request)
        return JsonResponse({'csrftoken': csrf_token}, status=200)
    except Exception as e:
        return JsonResponse({"detail": str(e)}, status=400)

@csrf_exempt
def login_view(request):
    data = json.loads(request.body)
    username = data.get("name")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Please provide username and password"}, status=400)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        csrf_token = get_token(request)
        print("logged in!")
        return JsonResponse({'csrftoken': csrf_token, 'username': username}, status=200)
    else:
        return JsonResponse({'error': 'Login failed'}, status=400)
    
@ensure_csrf_cookie 
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

@ensure_csrf_cookie
def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})

    return JsonResponse({"username": request.user.username})

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
    products = Product.objects.filter(store_id=store_id)
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)

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


@require_POST
@login_required
def create_layout(request):
    data = json.loads(request.body)
    store_id = data.get('store_id')
    
    if store_id:
        try:
            store = Store.objects.get(id=store_id)
            store_name = store.name
            with transaction.atomic():
                layout, created = Layout.objects.update_or_create(
                    store_id=store_id,
                    defaults={'name': store_name}
                )
                
                if not created:
                    Table.objects.filter(layout=layout).delete()

                tables_data = data.get('tables')
                for table_data in tables_data:
                    positionX = round_decimal(table_data['positionX'])
                    positionY = round_decimal(table_data['positionY'])
                    width = round_decimal(table_data['width'])
                    length = round_decimal(table_data['length'])
                    Table.objects.create(
                        layout=layout,
                        store_id=store_id,
                        position_x=positionX,
                        position_y=positionY,
                        width=width,
                        height=length,
                        table_number=table_data['tableNumber']
                    )

                return JsonResponse({"detail": "Layout successfully created or updated with tables"}, status=201)
        except Exception as e:
            return JsonResponse({"detail": str(e)}, status=500)
        
def get_seating_layout(request):
    data = json.loads(request.body)
    store_id = data.get('storeId')
    
    if store_id:
        try:
            layout = Layout.objects.get(store_id=store_id)
            
            tables = Table.objects.filter(layout=layout).values(
                'table_number', 'position_x', 'position_y', 'width', 'height'
            )
            
            tables_list = list(tables)
            
            return JsonResponse({"tables": tables_list}, status=200)
        except Exception as e:
            logger.error(f"Error retrieving layout: {str(e)}")
            return JsonResponse({"detail": "Layout not found for the given store ID"}, status=404)
        
def round_decimal(value):
    """Round the decimal to a maximum of 5 decimal places."""
    return Decimal(value).quantize(Decimal('.00001'), rounding=ROUND_HALF_UP)

    