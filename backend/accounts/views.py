from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    DealerLoginSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
)


from rest_framework.decorators import api_view, permission_classes


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_root(request):
    """
    Overview of all authentication endpoints with clickable links.
    """
    return Response({
        'service': 'CarCraft Authentication Service',
        'endpoints': {
            'register': request.build_absolute_uri('register/'),
            'login': request.build_absolute_uri('login/'),
            'dealer_login': request.build_absolute_uri('dealer/login/'),
            'token_refresh': request.build_absolute_uri('token/refresh/'),
            'me': request.build_absolute_uri('me/'),
        }
    })


class CustomerRegisterView(APIView):
    """
    Public customer registration endpoint.
    Registration is strictly constrained to the CUSTOMER role.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Customer Registration',
            'method': 'POST',
            'required_fields': {
                'username': 'string (unique username)',
                'email': 'string (valid email address)',
                'password': 'string (secure password)',
                'confirm_password': 'string (must match password)',
            },
            'optional_fields': {
                'first_name': 'string',
                'last_name': 'string',
                'phone': 'string',
                'address': 'string',
                'city': 'string',
                'state': 'string',
                'postal_code': 'string',
            },
            'note': 'Dealer accounts cannot be registered publicly.'
        })

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Auto-generate JWT tokens for immediate login
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role
            refresh['username'] = user.username
            refresh['email'] = user.email

            return Response({
                'success': True,
                'message': 'Customer registered successfully.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Registration validation failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginView(APIView):
    """
    Customer & standard user login endpoint.
    Accepts username or email along with password.
    Returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Customer Login',
            'method': 'POST',
            'required_fields': {
                'login': 'string (your username OR email address)',
                'password': 'string (your password)'
            }
        })

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = data['user']
            return Response({
                'success': True,
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': data['access'],
                    'refresh': data['refresh'],
                }
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Authentication failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class DealerLoginView(APIView):
    """
    Private Dealer/Admin login endpoint.
    Strictly verifies that the authenticated user possesses the DEALER role.
    Rejects customer accounts with 403 Forbidden.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Private Dealer/Admin Portal Login',
            'method': 'POST',
            'required_fields': {
                'login': 'string (dealer username or email, e.g. "admin")',
                'password': 'string (e.g. "admin123")'
            },
            'note': 'Customer accounts are blocked from this endpoint with 403 Forbidden.'
        })

    def post(self, request):
        serializer = DealerLoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = data['user']
            return Response({
                'success': True,
                'message': 'Dealer login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': data['access'],
                    'refresh': data['refresh'],
                }
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Dealer authentication failed.',
            'errors': serializer.errors
        }, status=status.HTTP_403_FORBIDDEN if 'Only authorized dealer' in str(serializer.errors) else status.HTTP_400_BAD_REQUEST)



class CurrentUserView(APIView):
    """
    Profile endpoint for the currently authenticated user.
    Requires a valid JWT Bearer token.
    Supports GET (view profile) and PATCH (update profile).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully.',
                'user': UserSerializer(updated_user).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Profile update validation failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
