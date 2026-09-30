from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    auth_root,
    CustomerRegisterView,
    CustomerLoginView,
    DealerLoginView,
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

    # JWT Token Refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Current Authenticated User Profile
    path('me/', CurrentUserView.as_view(), name='auth-me'),
]
