from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.login_view, name="api_login"),
    path("logout/", views.logout_view, name="api_logout"),
    path("session/", views.session_view, name="api_session"),
    path("whoami/", views.whoami_view, name="api_whoami"),
    path("signup/", views.signup_view, name="api_signup"),
    path("create-product/", views.create_product, name="api_product"),
    path("products/", views.get_products, name="api_products"),
    path("create-store/", views.create_store, name="api_store"),
    path("store/", views.get_store, name="api_stores"),
    path("create-store-profile/", views.create_store_profile, name="api_add_store_profile"),
    path("profiles/", views.get_store_profiles, name="api_store_profiles"),
    path('create-layout/', views.create_layout, name='api_create_layout'),
    path('get-seating-layout/', views.get_seating_layout, name='api_get_seating_layout'),
    path('order/', views.create_order, name="api_order"),
    path('get-orders/', views.get_orders, name="api_get_orders"),
    path('complete-hall-status/', views.complete_hall_status, name="api_complete_hall_status"),
    path('get-order-items/', views.get_order_items, name="api_order_items")
]