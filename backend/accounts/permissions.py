from rest_framework import permissions


class IsDealer(permissions.BasePermission):
    """
    Allows access only to authenticated users with the DEALER role or superusers.
    """
    message = "Access denied. Only authorized dealer/admin accounts are permitted."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_dealer
        )


class IsCustomer(permissions.BasePermission):
    """
    Allows access only to authenticated users with the CUSTOMER role.
    """
    message = "Access denied. Only registered customer accounts are permitted."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_customer
        )


class IsDealerOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access (GET, HEAD, OPTIONS) to any user (even unauthenticated),
    but requires DEALER permissions for creation, updates, and deletion.
    """
    message = "Access denied. Only dealers can modify this resource."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_dealer
        )


class IsOwnerOrDealer(permissions.BasePermission):
    """
    Allows access to the object owner (customer) or any dealer/admin.
    Assumes the object has a `customer` or `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.is_dealer:
            return True

        # Check if the object relates directly to the user
        owner = getattr(obj, 'customer', getattr(obj, 'user', None))
        return owner == request.user
