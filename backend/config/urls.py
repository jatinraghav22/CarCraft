"""
URL configuration for CarCraft project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    CarCraft Master API Directory with direct clickable links for all modules.
    """
    return Response({
        'app': 'CarCraft — Automotive Inventory, Dealership, E-Commerce & Service Management System',
        'status': 'online',
        'version': '1.0.0',
        'core_endpoints': {
            'health_check': request.build_absolute_uri('/api/health/'),
            'admin_panel': request.build_absolute_uri('/admin/'),
        },
        'customer_endpoints': {
            'registration': request.build_absolute_uri('/api/auth/register/'),
            'login': request.build_absolute_uri('/api/auth/login/'),
            'my_profile': request.build_absolute_uri('/api/auth/me/'),
            'browse_vehicles': request.build_absolute_uri('/api/vehicles/'),
            'browse_parts': request.build_absolute_uri('/api/parts/'),
            'wishlist': request.build_absolute_uri('/api/wishlist/'),
            'cart': request.build_absolute_uri('/api/cart/'),
            'my_orders': request.build_absolute_uri('/api/orders/'),
            'book_service': request.build_absolute_uri('/api/service-appointments/'),
            'book_test_drive': request.build_absolute_uri('/api/test-drives/'),
        },
        'dealer_endpoints': {
            'dealer_login': request.build_absolute_uri('/api/auth/dealer/login/'),
            'dashboard': request.build_absolute_uri('/api/dealer/dashboard/'),
            'manage_vehicles': request.build_absolute_uri('/api/vehicles/'),
            'manage_parts': request.build_absolute_uri('/api/parts/'),
            'manage_inventory': request.build_absolute_uri('/api/inventory/'),
            'manage_sales': request.build_absolute_uri('/api/sales/'),
            'manage_expenses': request.build_absolute_uri('/api/expenses/'),
            'manage_orders': request.build_absolute_uri('/api/orders/'),
            'manage_services': request.build_absolute_uri('/api/service-appointments/'),
            'manage_test_drives': request.build_absolute_uri('/api/test-drives/'),
            'customer_records': request.build_absolute_uri('/api/customers/'),
            'profit_loss_report': request.build_absolute_uri('/api/reports/profit-loss/'),
            'sales_report': request.build_absolute_uri('/api/reports/sales/'),
            'expenses_report': request.build_absolute_uri('/api/reports/expenses/'),
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_health_check(request):
    """
    Health check endpoint to verify backend status, Django REST Framework, and database connectivity.
    """
    return Response({
        'status': 'ok',
        'app': 'CarCraft Automotive Platform API',
        'version': '1.0.0',
        'database': settings.DATABASES['default']['ENGINE'].split('.')[-1],
    })


urlpatterns = [
    # API Directory & Health
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-index'),
    path('api/health/', api_health_check, name='api-health-check'),
    
    # Django Admin
    path('admin/', admin.site.urls),

    # CarCraft Business Modules
    path('api/auth/', include('accounts.urls')),
    path('api/vehicles/', include('vehicles.urls')),
    path('api/parts/', include('parts.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('services.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/', include('reports.urls')),
]

from django.urls import re_path
from django.views.static import serve

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
