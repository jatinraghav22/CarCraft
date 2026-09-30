from rest_framework import serializers
from vehicles.serializers import VehicleCustomerSerializer
from .models import ServiceAppointment, TestDrive


class ServiceAppointmentSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleCustomerSerializer(source='vehicle', read_only=True)
    customer_username = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = ServiceAppointment
        fields = [
            'id',
            'customer',
            'customer_username',
            'vehicle',
            'vehicle_details',
            'custom_vehicle',
            'service_type',
            'preferred_date',
            'preferred_time',
            'description',
            'estimated_cost',
            'final_cost',
            'status',
            'dealer_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        # If user is not dealer, they cannot set status or dealer_notes or costs directly
        if request and not getattr(request.user, 'is_dealer', False):
            attrs.pop('status', None)
            attrs.pop('dealer_notes', None)
            attrs.pop('final_cost', None)
        return attrs


class TestDriveSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleCustomerSerializer(source='vehicle', read_only=True)
    customer_username = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = TestDrive
        fields = [
            'id',
            'customer',
            'customer_username',
            'vehicle',
            'vehicle_details',
            'preferred_date',
            'preferred_time',
            'phone',
            'notes',
            'status',
            'dealer_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        if request and not getattr(request.user, 'is_dealer', False):
            attrs.pop('status', None)
            attrs.pop('dealer_notes', None)
        return attrs
