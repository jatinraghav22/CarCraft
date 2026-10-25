from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', 'Customer'
        DEALER = 'DEALER', 'Dealer'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
        help_text='Application role: CUSTOMER or DEALER',
    )
    phone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return '{} ({})'.format(self.username, self.role)

    @property
    def is_dealer(self):
        return self.role == self.Role.DEALER or self.is_superuser

    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
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
        return 'CustomerProfile({})'.format(self.user.username)


class DealerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dealer_profile')
    dealership_name = models.CharField(max_length=200, default='CarCraft Motors')
    license_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dealer Profile'
        verbose_name_plural = 'Dealer Profiles'

    def __str__(self):
        return 'DealerProfile({})'.format(self.user.username)


class AdminTOTPDevice(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='totp_device')
    encrypted_secret = models.TextField(blank=True, null=True, help_text='Fernet encrypted TOTP base32 secret at rest')
    encrypted_pending_secret = models.TextField(blank=True, null=True, help_text='Pending secret during enrollment before confirmation')
    is_enabled = models.BooleanField(default=False, help_text='Indicates whether 2FA TOTP is verified and active')
    enrolled_at = models.DateTimeField(blank=True, null=True)
    last_verified_step = models.BigIntegerField(default=0, help_text='Last RFC 6238 time step accepted to prevent replay attacks')
    failed_verify_attempts = models.PositiveIntegerField(default=0)
    last_failed_attempt_at = models.DateTimeField(blank=True, null=True)
    locked_until = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Admin TOTP Device'
        verbose_name_plural = 'Admin TOTP Devices'

    def __str__(self):
        return 'AdminTOTPDevice({}, enabled={})'.format(self.user.username, self.is_enabled)

    def is_locked(self):
        if self.locked_until and timezone.now() < self.locked_until:
            return True
        return False

    def record_failed_attempt(self, max_attempts=5, lockout_minutes=15):
        from datetime import timedelta
        self.failed_verify_attempts += 1
        self.last_failed_attempt_at = timezone.now()
        if self.failed_verify_attempts >= max_attempts:
            self.locked_until = timezone.now() + timedelta(minutes=lockout_minutes)
        self.save(update_fields=['failed_verify_attempts', 'last_failed_attempt_at', 'locked_until'])

    def clear_failed_attempts(self):
        self.failed_verify_attempts = 0
        self.last_failed_attempt_at = None
        self.locked_until = None
        self.save(update_fields=['failed_verify_attempts', 'last_failed_attempt_at', 'locked_until'])


class RecoveryCode(models.Model):
    device = models.ForeignKey(AdminTOTPDevice, on_delete=models.CASCADE, related_name='recovery_codes')
    code_hash = models.CharField(max_length=128, db_index=True, help_text='SHA-256 hash of the recovery code')
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Recovery Code'
        verbose_name_plural = 'Recovery Codes'

    def __str__(self):
        return 'RecoveryCode(device={}, used={})'.format(self.device_id, self.is_used)


class AdminLoginChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_login_challenges')
    token_hash = models.CharField(max_length=64, unique=True, db_index=True, help_text='SHA-256 hash of the short-lived login challenge token')
    purpose = models.CharField(max_length=32, default='dealer_mfa_login')
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
        return 'AdminLoginChallenge({}, used={})'.format(self.user.username, self.is_used)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
