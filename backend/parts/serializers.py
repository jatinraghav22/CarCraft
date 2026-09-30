from rest_framework import serializers
from .models import Part


class PartCustomerSerializer(serializers.ModelSerializer):
    """
    Public customer-facing part serializer.
    STRICTLY excludes purchase_cost and supplier information.
    """
    class Meta:
        model = Part
        fields = [
            'id',
            'name',
            'sku',
            'brand',
            'category',
            'description',
            'selling_price',
            'stock_quantity',
            'image',
            'compatibility',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PartDealerSerializer(serializers.ModelSerializer):
    """
    Dealer part serializer with purchase_cost, potential_margin, and is_low_stock flag.
    """
    is_low_stock = serializers.BooleanField(read_only=True)
    potential_margin = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Part
        fields = [
            'id',
            'name',
            'sku',
            'brand',
            'category',
            'description',
            'purchase_cost',
            'selling_price',
            'potential_margin',
            'stock_quantity',
            'minimum_stock',
            'is_low_stock',
            'image',
            'compatibility',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'is_low_stock', 'potential_margin', 'created_at', 'updated_at']

    def validate_selling_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Selling price must be greater than zero.")
        return value

    def validate_purchase_cost(self, value):
        if value < 0:
            raise serializers.ValidationError("Purchase cost cannot be negative.")
        return value
