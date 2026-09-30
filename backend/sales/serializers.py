from rest_framework import serializers
from accounts.permissions import IsDealer
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    vehicle_name = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = [
            'id',
            'customer',
            'customer_username',
            'customer_email',
            'sale_type',
            'vehicle',
            'vehicle_name',
            'order',
            'service_appointment',
            'selling_price',
            'purchase_cost',
            'other_cost',
            'discount',
            'tax',
            'net_amount',
            'profit',
            'payment_status',
            'sale_date',
            'notes',
            'created_at',
        ]
        read_only_fields = ['id', 'net_amount', 'profit', 'created_at']

    def get_vehicle_name(self, obj):
        if obj.vehicle:
            return f"{obj.vehicle.year} {obj.vehicle.brand} {obj.vehicle.model}"
        return None
