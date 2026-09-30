from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryTransactionViewSet

router = DefaultRouter()
router.register('', InventoryTransactionViewSet, basename='inventory')

urlpatterns = [
    path('', include(router.urls)),
]
