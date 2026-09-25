from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path('', include('dashboard.urls')),

    path('admin/', admin.site.urls),

    path(
        'login/',
        auth_views.LoginView.as_view(
            template_name='registration/login.html'
        ),
        name='login'
    ),

    path(
    'login/',
    auth_views.LoginView.as_view(
        template_name='registration/login.html'
    ),
    name='login'
    ),

    path(
        'logout/',
        auth_views.LogoutView.as_view(),
        name='logout'
    ),

    path('inventory/', include('inventory.urls')),

    path('customers/', include('customers.urls')),

    path('sales/', include('sales.urls')),

    path('service/', include('service.urls')),

    path('parts/', include('parts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)