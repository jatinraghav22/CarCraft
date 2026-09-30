from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsDealer
from .models import InventoryTransaction
from .serializers import InventoryTransactionSerializer


class InventoryTransactionViewSet(viewsets.ModelViewSet):
    """
    Internal Dealer-only inventory operations.
    Track purchases, customer sales, adjustments, and damaged inventory.
    """
    permission_classes = [IsDealer]
    queryset = InventoryTransaction.objects.select_related('vehicle', 'part', 'created_by').all()
    serializer_class = InventoryTransactionSerializer
    search_fields = ['reference', 'notes', 'vehicle__model', 'part__name']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        from django.db.models import Sum, F
        from vehicles.models import Vehicle
        from parts.models import Part

        available_vehicles = Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE)
        all_parts = Part.objects.all()

        total_vehicles_stock = sum(v.stock_quantity for v in available_vehicles)
        total_parts_stock = sum(p.stock_quantity for p in all_parts)
        total_items = total_vehicles_stock + total_parts_stock

        vehicle_inventory_value = sum((v.purchase_cost * v.stock_quantity) for v in available_vehicles)
        parts_inventory_value = sum((p.purchase_cost * p.stock_quantity) for p in all_parts)
        total_inventory_cost = vehicle_inventory_value + parts_inventory_value

        current_selling_value = sum((v.price * v.stock_quantity) for v in available_vehicles) + \
                                sum((p.selling_price * p.stock_quantity) for p in all_parts)

        potential_margin = current_selling_value - total_inventory_cost
        potential_margin_pct = f"{(potential_margin / current_selling_value * 100):.1f}%" if current_selling_value > 0 else "0.0%"

        low_stock_count = Part.objects.filter(stock_quantity__lte=F('minimum_stock')).count()
        out_of_stock_count = Part.objects.filter(stock_quantity=0).count() + Vehicle.objects.filter(stock_quantity=0).count()

        return Response({
            'success': True,
            'summary': {
                'totalItems': total_items,
                'total_items': total_items,
                'inventoryCost': total_inventory_cost,
                'inventory_cost': total_inventory_cost,
                'currentSellingValue': current_selling_value,
                'current_selling_value': current_selling_value,
                'potentialMargin': potential_margin,
                'potential_margin': potential_margin,
                'potentialMarginPct': potential_margin_pct,
                'lowStockItemsCount': low_stock_count,
                'outOfStockCount': out_of_stock_count,
                'vehicle_inventory_value': vehicle_inventory_value,
                'parts_inventory_value': parts_inventory_value,
                'total_inventory_value': total_inventory_cost,
            }
        })
