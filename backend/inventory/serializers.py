from rest_framework import serializers, viewsets
from accounts.permissions import IsDealer
from vehicles.serializers import VehicleDealerSerializer
from parts.serializers import PartDealerSerializer
from .models import InventoryTransaction


class InventoryTransactionSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleDealerSerializer(source='vehicle', read_only=True)
    part_details = PartDealerSerializer(source='part', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = InventoryTransaction
        fields = [
            'id',
            'transaction_type',
            'vehicle',
            'vehicle_details',
            'part',
            'part_details',
            'quantity',
            'unit_cost',
            'total_cost',
            'reference',
            'notes',
            'created_by',
            'created_by_username',
            'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        
        # Calculate total cost if not explicitly provided
        qty = abs(validated_data.get('quantity', 1))
        unit = validated_data.get('unit_cost', 0)
        validated_data['total_cost'] = qty * unit
        return super().create(validated_data)


class InventoryTransactionViewSet(viewsets.ModelViewSet):
    """
    Dealer-only inventory transaction management.
    """
    permission_classes = [IsDealer]
    queryset = InventoryTransaction.objects.select_related('vehicle', 'part', 'created_by').all()
    serializer_class = InventoryTransactionSerializer
    filterset_fields = ['transaction_type']
    search_fields = ['reference', 'notes', 'vehicle__model', 'part__name']
    ordering = ['-created_at']
