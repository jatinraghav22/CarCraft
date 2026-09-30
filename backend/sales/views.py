from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsDealer
from .models import Sale
from .serializers import SaleSerializer


class SaleViewSet(viewsets.ModelViewSet):
    """
    Dealer-only Sales management.
    Records vehicle sales, parts orders, and completed service revenue.
    """
    permission_classes = [IsDealer]
    queryset = Sale.objects.select_related('customer', 'vehicle', 'order', 'service_appointment').all()
    serializer_class = SaleSerializer
    filterset_fields = ['sale_type', 'payment_status', 'sale_date']
    search_fields = ['customer__username', 'customer__email', 'vehicle__model', 'notes']
    ordering = ['-sale_date', '-created_at']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        from django.db.models import Sum

        paid_sales = Sale.objects.filter(payment_status=Sale.PaymentStatus.PAID)
        total_revenue = paid_sales.aggregate(total=Sum('net_amount'))['total'] or 0
        total_profit = paid_sales.aggregate(total=Sum('profit'))['total'] or 0

        vehicle_rev = paid_sales.filter(sale_type=Sale.SaleType.VEHICLE).aggregate(total=Sum('net_amount'))['total'] or 0
        parts_rev = paid_sales.filter(sale_type=Sale.SaleType.PART).aggregate(total=Sum('net_amount'))['total'] or 0
        service_rev = paid_sales.filter(sale_type=Sale.SaleType.SERVICE).aggregate(total=Sum('net_amount'))['total'] or 0

        return Response({
            'success': True,
            'total_realized_revenue': total_revenue,
            'total_gross_profit': total_profit,
            'vehicle_revenue': vehicle_rev,
            'parts_revenue': parts_rev,
            'service_revenue': service_rev,
        })
