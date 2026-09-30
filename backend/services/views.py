from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from accounts.permissions import IsDealer, IsCustomer
from .models import ServiceAppointment, TestDrive
from .serializers import ServiceAppointmentSerializer, TestDriveSerializer


class ServiceAppointmentViewSet(viewsets.ModelViewSet):
    """
    Service Appointment API.
    Customer: Create bookings and view own appointments.
    Dealer: View all bookings, approve, reject, start, complete, and set final cost.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceAppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_dealer', False):
            return ServiceAppointment.objects.select_related('customer', 'vehicle').all()
        return ServiceAppointment.objects.select_related('customer', 'vehicle').filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user, status=ServiceAppointment.Status.PENDING)

    @action(detail=True, methods=['patch'], permission_classes=[IsDealer])
    def update_status(self, request, pk=None):
        """Dealer updates appointment status, cost, and notes"""
        appointment = self.get_object()
        new_status = request.data.get('status')
        final_cost = request.data.get('final_cost')
        dealer_notes = request.data.get('dealer_notes')

        if new_status and new_status in ServiceAppointment.Status.values:
            appointment.status = new_status
        if final_cost is not None:
            appointment.final_cost = final_cost
        if dealer_notes is not None:
            appointment.dealer_notes = dealer_notes

        appointment.save()
        return Response({
            'success': True,
            'message': f'Appointment #{appointment.id} updated.',
            'appointment': ServiceAppointmentSerializer(appointment).data
        })


class TestDriveViewSet(viewsets.ModelViewSet):
    """
    Test Drive API.
    Customer: Book a test drive and track booking status.
    Dealer: Approve, reschedule, complete, or reject test drive requests.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = TestDriveSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated or getattr(user, 'is_dealer', False):
            return TestDrive.objects.select_related('customer', 'vehicle').all()
        return TestDrive.objects.select_related('customer', 'vehicle').filter(customer=user)

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None
        if not user:
            from accounts.models import User
            user = User.objects.filter(role=User.Role.CUSTOMER).first() or User.objects.first()
        serializer.save(customer=user, status=TestDrive.Status.PENDING)

    @action(detail=True, methods=['patch'], permission_classes=[IsDealer])
    def update_status(self, request, pk=None):
        """Dealer manages test drive approval and completion"""
        test_drive = self.get_object()
        new_status = request.data.get('status')
        dealer_notes = request.data.get('dealer_notes')

        if new_status and new_status in TestDrive.Status.values:
            test_drive.status = new_status
        if dealer_notes is not None:
            test_drive.dealer_notes = dealer_notes

        test_drive.save()
        return Response({
            'success': True,
            'message': f'Test drive booking #{test_drive.id} updated.',
            'test_drive': TestDriveSerializer(test_drive).data
        })
