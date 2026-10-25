from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    auth_root,
    CustomerRegisterView,
    CustomerLoginView,
    DealerLoginView,
    DealerMFAVerifyView,
    DealerMFASetupView,
    DealerMFAConfirmView,
    DealerMFAStatusView,
    DealerMFADisableView,
    DealerMFARecoveryRegenerateView,
    CurrentUserView,
)

urlpatterns = [
    # Auth overview
    path('', auth_root, name='auth-root'),

    # Customer registration
    path('register/', CustomerRegisterView.as_view(), name='auth-register'),

    # Login endpoints
    path('login/', CustomerLoginView.as_view(), name='auth-login'),
    path('dealer/login/', DealerLoginView.as_view(), name='auth-dealer-login'),

    # Dealer 2FA TOTP Endpoints
    path('dealer/mfa/verify/', DealerMFAVerifyView.as_view(), name='auth-dealer-mfa-verify'),
    path('dealer/mfa/setup/', DealerMFASetupView.as_view(), name='auth-dealer-mfa-setup'),
    path('dealer/mfa/confirm/', DealerMFAConfirmView.as_view(), name='auth-dealer-mfa-confirm'),
    path('dealer/mfa/status/', DealerMFAStatusView.as_view(), name='auth-dealer-mfa-status'),
    path('dealer/mfa/disable/', DealerMFADisableView.as_view(), name='auth-dealer-mfa-disable'),
    path('dealer/mfa/recovery-codes/regenerate/', DealerMFARecoveryRegenerateView.as_view(), name='auth-dealer-mfa-recovery-regenerate'),

    # JWT Token Refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Current Authenticated User Profile
    path('me/', CurrentUserView.as_view(), name='auth-me'),
]
