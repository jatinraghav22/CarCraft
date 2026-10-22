import os
import urllib.request
import urllib.error
from PIL import Image as PilImage
from django.core.exceptions import ValidationError

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}
ALLOWED_MIME_TYPES = {
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit

# URL schemes we allow
ALLOWED_URL_SCHEMES = {'http', 'https'}

# Known problematic domains that require authentication / block bots
_URL_HEADER_TIMEOUT = 8  # seconds


def validate_image_file(file):
    """
    Validates uploaded image file size, extension, MIME type, and structural integrity.
    """
    if not file:
        raise ValidationError("No file provided.")

    # 1. File size check
    if file.size > MAX_IMAGE_SIZE_BYTES:
        size_mb = round(file.size / (1024 * 1024), 2)
        raise ValidationError(
            f"File '{file.name}' ({size_mb}MB) exceeds the maximum allowed size of 10MB."
        )

    # 2. Extension check
    name = getattr(file, 'name', '') or ''
    ext = os.path.splitext(name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(
            f"File '{name}' has an unsupported extension '{ext}'. "
            f"Supported image formats are: JPG, JPEG, PNG, WEBP, GIF."
        )

    # 3. Content type check (if present from HTTP header)
    content_type = getattr(file, 'content_type', '')
    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        raise ValidationError(
            f"File '{name}' has unsupported MIME type '{content_type}'."
        )

    # 4. Pillow image integrity verification
    try:
        file.seek(0)
        img = PilImage.open(file)
        img.verify()
        file.seek(0)
    except Exception as e:
        raise ValidationError(
            f"File '{name}' could not be decoded or is a corrupted image: {str(e)}"
        )


def validate_image_url(url):
    """
    Validates an externally supplied image URL:
      1. Must use http:// or https://
      2. Must not be empty or excessively long
      3. HEAD request must succeed (or extension fallback)
      4. Content-Type response header must be an image MIME type
      5. Content-Length (if returned) must not exceed 10 MB

    Raises django.core.exceptions.ValidationError on failure.
    Returns the cleaned URL on success.
    """
    if not url or not isinstance(url, str):
        raise ValidationError("A non-empty image URL is required.")

    url = url.strip()

    if len(url) > 2000:
        raise ValidationError("Image URL is too long (maximum 2000 characters).")

    # Scheme check
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
    except Exception:
        raise ValidationError(f"'{url}' is not a valid URL.")

    if parsed.scheme.lower() not in ALLOWED_URL_SCHEMES:
        raise ValidationError(
            f"Only http:// and https:// URLs are accepted. Got scheme: '{parsed.scheme}'."
        )

    if not parsed.netloc:
        raise ValidationError(f"'{url}' does not contain a valid hostname.")

    # Extension-based quick accept (for well-known CDN paths)
    path_lower = (parsed.path or '').lower().split('?')[0]
    path_ext   = os.path.splitext(path_lower)[1]
    extension_ok = path_ext in ALLOWED_IMAGE_EXTENSIONS

    # HEAD request to validate Content-Type + Content-Length
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'CarCraft-ImageValidator/1.0')
        with urllib.request.urlopen(req, timeout=_URL_HEADER_TIMEOUT) as resp:
            ct = (resp.headers.get('Content-Type') or '').lower().split(';')[0].strip()
            cl = resp.headers.get('Content-Length')

            # MIME type validation
            if ct and ct not in ALLOWED_MIME_TYPES:
                # Some CDNs return application/octet-stream; fall back to extension
                if not extension_ok:
                    raise ValidationError(
                        f"URL does not point to an image. "
                        f"Content-Type returned: '{ct}'. "
                        f"Supported types: JPEG, PNG, WEBP, GIF."
                    )

            # Size validation (if header present)
            if cl:
                try:
                    size_bytes = int(cl)
                    if size_bytes > MAX_IMAGE_SIZE_BYTES:
                        raise ValidationError(
                            f"Remote image exceeds 10 MB limit "
                            f"({round(size_bytes / (1024 * 1024), 1)} MB reported by server)."
                        )
                except ValueError:
                    pass

    except ValidationError:
        raise
    except (urllib.error.URLError, urllib.error.HTTPError) as e:
        # Network issues: accept if extension clearly indicates an image
        if not extension_ok:
            code = getattr(e, 'code', None)
            if code in (401, 403):
                # Auth-protected URL — accept conditionally if extension looks right
                pass  # will be caught below if ext not ok
            raise ValidationError(
                f"Cannot reach the image URL: {str(e)}. "
                f"Please verify the URL is publicly accessible."
            )
    except Exception as e:
        if not extension_ok:
            raise ValidationError(
                f"Failed to validate image URL: {str(e)}. "
                f"Ensure the URL is a direct link to a publicly accessible image."
            )

    return url

