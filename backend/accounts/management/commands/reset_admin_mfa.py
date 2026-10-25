from django.core.management.base import BaseCommand, CommandError
from accounts.models import User, AdminTOTPDevice, RecoveryCode


class Command(BaseCommand):
    help = "Safely reset or disable Two-Factor Authentication for an administrator without opening public backdoors."

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            required=True,
            help='Username of the administrator account whose MFA should be reset.'
        )
        parser.add_argument(
            '--disable',
            action='store_true',
            help='Disable MFA completely for this admin account.'
        )

    def handle(self, *args, **options):
        username = options['username']
        should_disable = options['disable']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise CommandError(f"User with username '{username}' does not exist.")

        if not user.is_dealer:
            raise CommandError(f"User '{username}' is not a Dealer/Admin account.")

        device = getattr(user, 'totp_device', None)
        if not device or not device.is_enabled:
            self.stdout.write(self.style.WARNING(f"Admin '{username}' does not have MFA enabled."))
            return

        device.is_enabled = False
        device.encrypted_secret = None
        device.encrypted_pending_secret = None
        device.failed_verify_attempts = 0
        device.locked_until = None
        device.recovery_codes.all().delete()
        device.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully reset Two-Factor Authentication for admin '{username}'. "
                f"The admin can now log in with their password and re-enroll their authenticator app."
            )
        )
