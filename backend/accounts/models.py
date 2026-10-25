from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', 'Customer'
        DEALER = 'DEALER', 'Dealer'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
        help_text='Application role: CUSTOMER or DEALER'
    )
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Email and username are primary identifiers
    REQUIRED_FIELDS = ['email']

    @property
    def is_dealer(self):
        return self.role == self.Role.DEALER or self.is_superuser

    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER

    def __str__(self):
        return f"{self.username} ({self.role})"


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer_profile'
    )
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Customer Profile'
        verbose_name_plural = 'Customer Profiles'

    def __str__(self):
        return f"Customer: {self.user.username}"


class DealerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='dealer_profile'
    )
    dealership_name = models.CharField(max_length=200, default='CarCraft Motors')
    license_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dealer Profile'
        verbose_name_plural = 'Dealer Profiles'

    def __str__(self):
        return f"Dealer: {self.user.username} ({self.dealership_name})"


class AdminTOTPDevice(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='totp_device'
    )
    encrypted_secret = models.TextField(
        blank=True,
        null=True,
        help_text="Fernet encrypted TOTP base32 secret at rest"
    )
    encrypted_pending_secret = models.TextField(
        blank=True,
        null=True,
        help_text="Pending secret during enrollment before confirmation"
    )
    is_enabled = models.BooleanField(
        default=False,
        help_text="Indicates whether 2FA TOTP is verified and active"
    )
    enrolled_at = models.DateTimeField(blank=True, null=True)
    last_verified_step = models.BigIntegerField(
        default=0,
        help_text="Last RFC 6238 time step accepted to prevent replay attacks"
    )
    failed_verify_attempts = models.PositiveIntegerField(default=0)
    last_failed_attempt_at = models.DateTimeField(blank=True, null=True)
    locked_until = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Admin TOTP Device'
        verbose_name_plural = 'Admin TOTP Devices'

    def __str__(self):
        status_str = "Enabled" if self.is_enabled else "Pending"
        return f"TOTP Device ({status_str}) - {self.user.username}"


class RecoveryCode(models.Model):
    device = models.ForeignKey(
        AdminTOTPDevice,
        on_delete=models.CASCADE,
        related_name='recovery_codes'
    )
    code_hash = models.CharField(
        max_length=128,
        db_index=True,
        help_text="SHA-256 hash of the recovery code"
    )
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Recovery Code'
        verbose_name_plural = 'Recovery Codes'

    def __str__(self):
        status_str = "Used" if self.is_used else "Active"
        return f"Recovery Code ({status_str}) for {self.device.user.username}"


class AdminLoginChallenge(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='admin_login_challenges'
    )
    token_hash = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="SHA-256 hash of the short-lived login challenge token"
    )
    purpose = models.CharField(
        max_length=32,
        default='dealer_mfa_login'
    )
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    failed_attempts = models.PositiveIntegerField(default=0)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Admin Login Challenge'
        verbose_name_plural = 'Admin Login Challenges'

    def __str__(self):
        status_str = "Used" if self.is_used else "Open"
        return f"MFA Challenge ({status_str}) - {self.user.username}"

