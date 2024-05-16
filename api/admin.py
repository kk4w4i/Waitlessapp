from django.contrib import admin

from .models import Product, Store, StoreProfile, Layout, Table, Order, OrderItem

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
    list_display = ('id', 'store_id', 'table_number', 'layout', 'width')
    search_fields = ('table_number', 'layout')

@admin.register(Order)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'store_id', 'status', 'ordered_at', 'table_number', 'order_type', 'order_number', 'completeStatus')
    search_fields = ('status', 'table_number', 'ordered_at', 'order_type')

@admin.register(OrderItem)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'menu_name', 'menu_id', 'order_id', 'count')
    search_fields = ('menu_name', 'menu_id', 'order_id')
