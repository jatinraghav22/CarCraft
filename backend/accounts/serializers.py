from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import User, CustomerProfile, DealerProfile


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['address', 'city', 'state', 'postal_code', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class DealerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerProfile
        fields = ['dealership_name', 'license_number', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone',
            'is_dealer',
            'is_customer',
            'date_joined',
            'profile',
        ]
        read_only_fields = ['id', 'role', 'is_dealer', 'is_customer', 'date_joined']

    def get_profile(self, obj):
        if obj.is_customer and hasattr(obj, 'customer_profile'):
            return CustomerProfileSerializer(obj.customer_profile).data
        elif obj.is_dealer and hasattr(obj, 'dealer_profile'):
            return DealerProfileSerializer(obj.dealer_profile).data
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    address = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')
    city = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')
    state = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')
    postal_code = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone',
            'address',
            'city',
            'state',
            'postal_code',
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value.lower()

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.pop('confirm_password', None)

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        # Validate password using Django's built-in validators
        validate_password(password)

        return attrs

    def create(self, validated_data):
        address = validated_data.pop('address', '')
        city = validated_data.pop('city', '')
        state = validated_data.pop('state', '')
        postal_code = validated_data.pop('postal_code', '')

        with transaction.atomic():
            # Public registration is strictly locked to CUSTOMER role
            user = User(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                phone=validated_data.get('phone', ''),
                role=User.Role.CUSTOMER,
            )
            user.set_password(validated_data['password'])
            user.save()

            # Create corresponding CustomerProfile
            CustomerProfile.objects.create(
                user=user,
                address=address,
                city=city,
                state=state,
                postal_code=postal_code,
            )

        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(
        required=True,
        help_text="Enter your username or email address."
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def to_internal_value(self, data):
        mutable_data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'login' not in mutable_data or not mutable_data['login']:
            ident = mutable_data.get('username') or mutable_data.get('email') or mutable_data.get('identifier')
            if ident:
                mutable_data['login'] = ident
        return super().to_internal_value(mutable_data)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        # Allow login via username or email
        user = None
        if '@' in login:
            try:
                user_obj = User.objects.get(email__iexact=login)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=login, password=password)

        if not user:
            raise serializers.ValidationError({
                "detail": "Invalid credentials. Please verify your username/email and password."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "This user account is currently deactivated."
            })

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        # Include custom claims in the token
        refresh['role'] = user.role
        refresh['username'] = user.username
        refresh['email'] = user.email

        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class DealerLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = data['user']

        if not user.is_dealer:
            raise serializers.ValidationError({
                "detail": "Access denied. Only authorized dealer accounts are permitted to log in through this portal."
            })

        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'address', 'city', 'state', 'postal_code']

    def update(self, instance, validated_data):
        address = validated_data.pop('address', None)
        city = validated_data.pop('city', None)
        state = validated_data.pop('state', None)
        postal_code = validated_data.pop('postal_code', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile if customer
        if instance.is_customer and hasattr(instance, 'customer_profile'):
            profile = instance.customer_profile
            if address is not None:
                profile.address = address
            if city is not None:
                profile.city = city
            if state is not None:
                profile.state = state
            if postal_code is not None:
                profile.postal_code = postal_code
            profile.save()

        return instance
