import base64
import hashlib
import hmac
import io
import os
import secrets
import string
import time
from typing import List, Optional, Tuple

from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings
import pyotp
import qrcode
import qrcode.image.pil


def get_encryption_key() -> bytes:
    """
    Retrieves the 32-byte urlsafe base64-encoded encryption key for Fernet.
    Reads from settings.TOTP_ENCRYPTION_KEY or os.environ['TOTP_ENCRYPTION_KEY'].
    In test/dev environments without an explicit key, derives a deterministic
    valid Fernet key from SECRET_KEY as a safe fallback.
    """
    raw_key = getattr(settings, 'TOTP_ENCRYPTION_KEY', None) or os.environ.get('TOTP_ENCRYPTION_KEY')
    if raw_key:
        key_bytes = raw_key.strip().encode('utf-8')
        try:
            # Validate that the key works with Fernet
            Fernet(key_bytes)
            return key_bytes
        except Exception as exc:
            raise ValueError(f"Invalid TOTP_ENCRYPTION_KEY configuration: {exc}")

    # Fallback for development/testing: derive a 32-byte base64 key from SECRET_KEY
    derived_32 = hashlib.sha256(settings.SECRET_KEY.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(derived_32)


def get_fernet() -> Fernet:
    return Fernet(get_encryption_key())


def encrypt_secret(secret_base32: str) -> str:
    """
    Encrypts the plain base32 TOTP secret string at rest using Fernet.
    """
    if not secret_base32:
        return ""
    fernet = get_fernet()
    encrypted_bytes = fernet.encrypt(secret_base32.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')


def decrypt_secret(encrypted_secret: str) -> str:
    """
    Decrypts the Fernet-encrypted TOTP secret back into base32 string.
    """
    if not encrypted_secret:
        return ""
    fernet = get_fernet()
    try:
        decrypted_bytes = fernet.decrypt(encrypted_secret.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')
    except InvalidToken:
        raise ValueError("Failed to decrypt TOTP secret. The encryption key may have changed.")


def generate_totp_secret() -> str:
    """
    Generates a cryptographically secure random 32-character base32 secret.
    """
    return pyotp.random_base32(length=32)


def get_provisioning_uri(username: str, secret_base32: str, issuer: str = "CarCraft Admin") -> str:
    """
    Builds the standard otpauth:// URI for enrollment in TOTP authenticator apps.
    """
    totp = pyotp.TOTP(secret_base32, interval=30, digits=6)
    return totp.provisioning_uri(name=username, issuer_name=issuer)


def generate_qr_code_base64(provisioning_uri: str) -> str:
    """
    Renders a QR code containing the provisioning URI as a base64 PNG data URI.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=3,
    )
    qr.add_data(provisioning_uri)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer)
    b64_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{b64_data}"


def verify_totp(
    secret_base32: str,
    code: str,
    last_verified_step: Optional[int] = None,
    current_timestamp: Optional[float] = None
) -> Tuple[bool, int]:
    """
    Validates a 6-digit TOTP code against a decrypted secret.
    Enforces standard RFC 6238 30-second interval, 6-digit codes.
    Allows a small clock drift window (+/- 1 time step, 30s).
    Enforces replay protection: matching time step must be strictly > last_verified_step.

    Returns:
        (is_valid, verified_time_step)
    """
    clean_code = str(code).strip().replace(" ", "")
    if len(clean_code) != 6 or not clean_code.isdigit():
        return False, 0

    now = current_timestamp if current_timestamp is not None else time.time()
    current_step = int(now // 30)

    totp = pyotp.TOTP(secret_base32, interval=30, digits=6)

    # Check +/- 1 step (order: current step first, then past step, then future step)
    for offset in [0, -1, 1]:
        step = current_step + offset
        expected_code = totp.at(step * 30)
        if hmac.compare_digest(clean_code, expected_code):
            # Check replay prevention
            if last_verified_step is not None and step <= last_verified_step:
                # Replay of already accepted time step detected
                return False, 0
            return True, step

    return False, 0


def generate_recovery_codes(count: int = 8) -> List[str]:
    """
    Generates high-entropy, human-friendly one-time recovery codes.
    Format: XXXX-XXXX-XXXX (12 alphanumeric characters per code).
    """
    chars = string.ascii_uppercase + string.digits
    codes = []
    for _ in range(count):
        part1 = ''.join(secrets.choice(chars) for _ in range(4))
        part2 = ''.join(secrets.choice(chars) for _ in range(4))
        part3 = ''.join(secrets.choice(chars) for _ in range(4))
        codes.append(f"{part1}-{part2}-{part3}")
    return codes


def normalize_recovery_code(code: str) -> str:
    """
    Normalizes a recovery code for consistent hashing and matching.
    Strips whitespace and converts to uppercase.
    """
    return str(code).strip().upper().replace(" ", "").replace("-", "")


def hash_recovery_code(code: str) -> str:
    """
    Computes a secure SHA-256 hash of a normalized recovery code.
    """
    normalized = normalize_recovery_code(code)
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def verify_recovery_code(plain_code: str, hashed_code: str) -> bool:
    """
    Verifies a plain recovery code against its stored hash in constant time.
    """
    computed = hash_recovery_code(plain_code)
    return hmac.compare_digest(computed, hashed_code)


def hash_challenge_token(token: str) -> str:
    """
    Computes a SHA-256 hash of the login challenge token.
    Only the token hash is stored in the database.
    """
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
