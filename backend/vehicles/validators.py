import os
from PIL import Image as PilImage
from django.core.exceptions import ValidationError

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
ALLOWED_MIME_TYPES = {
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit


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
