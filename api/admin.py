from django.contrib import admin

from .models import Product, Store, StoreProfile, Layout, Table

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

@admin.register(Layout)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'store_id', 'name')
    search_fields = ('name',)

@admin.register(Table)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('store_id', 'table_number', 'layout', 'width')
    search_fields = ('table_number', 'layout')

