"""
URL patterns for the accounts application.
All paths are mounted under /api/auth/ in config/urls.py.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    # Customer endpoints
    path('register/', views.register, name='auth-register'),
    path('login/', views.login, name='auth-login'),
    path('me/', views.user_profile, name='auth-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Dealer / Admin endpoints
    path('dealer/login/', views.dealer_login, name='auth-dealer-login'),
    path('dealer/mfa/verify/', views.dealer_mfa_verify, name='auth-dealer-mfa-verify'),
    path('dealer/mfa/status/', views.dealer_mfa_status, name='auth-dealer-mfa-status'),
    path('dealer/mfa/setup/', views.dealer_mfa_setup, name='auth-dealer-mfa-setup'),
    path('dealer/mfa/confirm/', views.dealer_mfa_confirm, name='auth-dealer-mfa-confirm'),
    path('dealer/mfa/disable/', views.dealer_mfa_disable, name='auth-dealer-mfa-disable'),
    path('dealer/mfa/recovery-codes/regenerate/', views.dealer_mfa_regenerate_recovery_codes, name='auth-dealer-mfa-recovery-regenerate'),
]
