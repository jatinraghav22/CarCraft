from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrderViewSet,
    CartView,
    CartAddView,
    CartUpdateItemView,
    CartClearView,
    WishlistView,
    WishlistItemDeleteView,
)

router = DefaultRouter()
router.register('', OrderViewSet, basename='order')

urlpatterns = [
    # Cart routes
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('cart/item/<int:pk>/', CartUpdateItemView.as_view(), name='cart-item-detail'),
    path('cart/clear/', CartClearView.as_view(), name='cart-clear'),

    # Wishlist routes
    path('wishlist/', WishlistView.as_view(), name='wishlist-detail'),
    path('wishlist/item/<int:pk>/', WishlistItemDeleteView.as_view(), name='wishlist-item-delete'),

    # Order routes
    path('orders/', include(router.urls)),
]
