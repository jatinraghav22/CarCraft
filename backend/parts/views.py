from django.db import models
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsDealer, IsDealerOrReadOnly
from .models import Part
from .serializers import PartCustomerSerializer, PartDealerSerializer


class PartViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Parts & Accessories.
    Public: Browse and view details without purchase_cost.
    Dealer: Manage inventory, pricing, and purchase costs.
    """
    permission_classes = [IsDealerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'brand', 'category', 'description', 'compatibility']
    ordering_fields = ['selling_price', 'stock_quantity', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = Part.objects.all()

        # Unauthenticated or customer users
        if not (user.is_authenticated and getattr(user, 'is_dealer', False)):
            queryset = queryset.filter(status=Part.Status.AVAILABLE)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)

        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__iexact=brand)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(selling_price__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(selling_price__lte=max_price)

        return queryset

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'is_dealer', False):
            return PartDealerSerializer
        return PartCustomerSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsDealer])
    def low_stock(self, request):
        """Dealer-only: retrieve all parts with stock at or below minimum threshold."""
        low_stock_parts = Part.objects.filter(stock_quantity__lte=models.F('minimum_stock'))
        serializer = PartDealerSerializer(low_stock_parts, many=True)
        return Response({
            'success': True,
            'count': low_stock_parts.count(),
            'parts': serializer.data
        })
