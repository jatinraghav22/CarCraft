from rest_framework import serializers
from decimal import Decimal
from vehicles.serializers import VehicleCustomerSerializer
from parts.serializers import PartCustomerSerializer
from .models import Wishlist, WishlistItem, Cart, CartItem, Order, OrderItem, Payment


class WishlistItemSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleCustomerSerializer(source='vehicle', read_only=True)
    part_details = PartCustomerSerializer(source='part', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'vehicle', 'part', 'vehicle_details', 'part_details', 'created_at']

    def validate(self, attrs):
        vehicle = attrs.get('vehicle')
        part = attrs.get('part')
        if not vehicle and not part:
            raise serializers.ValidationError("Either a vehicle or a part must be specified.")
        if vehicle and part:
            raise serializers.ValidationError("Cannot specify both vehicle and part in a single wishlist item.")
        return attrs


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'created_at', 'updated_at']


class CartItemSerializer(serializers.ModelSerializer):
    part_details = PartCustomerSerializer(source='part', read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'part', 'part_details', 'quantity', 'unit_price', 'total_price', 'created_at']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    part_details = PartCustomerSerializer(source='part', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'part', 'part_details', 'quantity', 'unit_price', 'total_price']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'transaction_id', 'amount', 'payment_method', 'status', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    customer_username = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer',
            'customer_username',
            'status',
            'subtotal',
            'discount',
            'tax',
            'total_amount',
            'payment_status',
            'shipping_address',
            'shipping_city',
            'shipping_state',
            'shipping_postal_code',
            'notes',
            'items',
            'payment',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'order_number', 'customer', 'subtotal', 'total_amount', 'created_at', 'updated_at']


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=True)
    shipping_city = serializers.CharField(required=False, default='')
    shipping_state = serializers.CharField(required=False, default='')
    shipping_postal_code = serializers.CharField(required=False, default='')
    payment_method = serializers.ChoiceField(
        choices=Payment.PaymentMethod.choices,
        default=Payment.PaymentMethod.CARD
    )
    notes = serializers.CharField(required=False, allow_blank=True, default='')
