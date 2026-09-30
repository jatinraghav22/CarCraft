from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceAppointmentViewSet, TestDriveViewSet

router = DefaultRouter()
router.register('service-appointments', ServiceAppointmentViewSet, basename='service-appointment')
router.register('test-drives', TestDriveViewSet, basename='test-drive')

urlpatterns = [
    path('', include(router.urls)),
]
