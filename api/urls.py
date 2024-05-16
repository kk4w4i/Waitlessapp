from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.login_view, name="api_login"),
    path("logout/", views.logout_view, name="api_logout"),
    path("session/", views.session_view, name="api_session"),
    path("whoami/", views.whoami_view, name="api_whoami"),
    path("signup/", views.signup_view, name="api_signup"),
    path("create-product/", views.create_product, name="api_product"),
    path("products/<uuid:store_id>/", views.get_products, name="api_products"),
    path("create-store/", views.create_store, name="api_store"),
    path("store/", views.get_store, name="api_stores"),
    path("create-store-profile/", views.create_store_profile, name="api_add_store_profile"),
    path("profiles/", views.get_store_profiles, name="api_store_profiles"),
    path('create-layout/', views.create_layout, name='api_create_layout'),
    path('get-seating-layout/<uuid:store_id>/', views.get_seating_layout, name='api_get_seating_layout'),
    path('order/', views.create_order, name="api_order"),
    path('get-orders/<uuid:store_id>/', views.get_orders, name="api_get_orders"),
    path('complete-hall-status/', views.complete_hall_status, name="api_complete_hall_status"),
    path('get-order-items/<uuid:store_id>/<uuid:order_id>/', views.get_order_items, name="api_order_items"),
    path('get-kitchen-orders/<uuid:store_id>/', views.get_kitchen_orders, name='api_kitchen_orders'),
    path('update-order/', views.update_order_status, name='api_kitchen_status'),
    path('delete-product/<uuid:product_id>/', views.delete_product, name='delete_product'),
]