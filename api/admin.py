from django.contrib import admin

# Register your models here.
from .models import Product
from .models import Store
from .models import StoreProfile

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'email', 'url', 'key')
    search_fields = ('name',)
@admin.register(StoreProfile)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'store_name', 'username', 'store_id', 'store_url', 'role')
    search_fields = ('store_name', 'username', 'store_id', 'role')
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'status', 'store_id')
    list_filter = ('category', 'status')
    search_fields = ('name','store_id')
