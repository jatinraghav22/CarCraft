import uuid
from decimal import Decimal
from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from accounts.permissions import IsDealer, IsCustomer, IsOwnerOrDealer
from parts.models import Part
from vehicles.models import Vehicle
from .models import Wishlist, WishlistItem, Cart, CartItem, Order, OrderItem, Payment
from .serializers import (
    WishlistSerializer,
    WishlistItemSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
    CheckoutSerializer,
)


class WishlistView(APIView):
    """
    Customer Wishlist endpoint.
    GET /api/wishlist/ - View wishlist
    POST /api/wishlist/ - Add vehicle or part to wishlist
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response({'success': True, 'wishlist': serializer.data})

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        vehicle_id = request.data.get('vehicle_id')
        part_id = request.data.get('part_id')

        if not vehicle_id and not part_id:
            return Response(
                {'success': False, 'message': 'Provide either vehicle_id or part_id.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if vehicle_id:
            vehicle = Vehicle.objects.filter(id=vehicle_id).first()
            if not vehicle:
                return Response({'success': False, 'message': 'Vehicle not found.'}, status=status.HTTP_404_NOT_FOUND)
            item, created = WishlistItem.objects.get_or_create(wishlist=wishlist, vehicle=vehicle)
        else:
            part = Part.objects.filter(id=part_id).first()
            if not part:
                return Response({'success': False, 'message': 'Part not found.'}, status=status.HTTP_404_NOT_FOUND)
            item, created = WishlistItem.objects.get_or_create(wishlist=wishlist, part=part)

        return Response({
            'success': True,
            'message': 'Item added to wishlist.' if created else 'Item already in wishlist.',
            'item': WishlistItemSerializer(item).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class WishlistItemDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        item = WishlistItem.objects.filter(id=pk, wishlist__user=request.user).first()
        if not item:
            return Response({'success': False, 'message': 'Wishlist item not found.'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response({'success': True, 'message': 'Item removed from wishlist.'})


class CartView(APIView):
    """
    Customer Cart endpoint.
    GET /api/cart/ - View cart items and subtotal
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response({'success': True, 'cart': serializer.data})


class CartAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        part_id = request.data.get('part_id')
        quantity = int(request.data.get('quantity', 1))

        if not part_id or quantity <= 0:
            return Response(
                {'success': False, 'message': 'Invalid part_id or quantity.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        part = Part.objects.filter(id=part_id).first()
        if not part:
            return Response({'success': False, 'message': 'Part not found.'}, status=status.HTTP_404_NOT_FOUND)

        if part.stock_quantity < quantity:
            return Response(
                {'success': False, 'message': f'Insufficient stock. Only {part.stock_quantity} available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            part=part,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            if cart_item.quantity > part.stock_quantity:
                return Response(
                    {'success': False, 'message': f'Cannot add more than available stock ({part.stock_quantity}).'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.save()

        return Response({
            'success': True,
            'message': 'Part added to cart.',
            'cart': CartSerializer(cart).data
        })


class CartUpdateItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({'success': False, 'message': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart_item = CartItem.objects.filter(id=pk, cart=cart).first()
        if not cart_item:
            return Response({'success': False, 'message': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            cart_item.delete()
            return Response({'success': True, 'message': 'Item removed from cart.', 'cart': CartSerializer(cart).data})

        if cart_item.part.stock_quantity < quantity:
            return Response(
                {'success': False, 'message': f'Only {cart_item.part.stock_quantity} in stock.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()
        return Response({'success': True, 'cart': CartSerializer(cart).data})

    def delete(self, request, pk):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({'success': False, 'message': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart_item = CartItem.objects.filter(id=pk, cart=cart).first()
        if not cart_item:
            return Response({'success': False, 'message': 'Item not found in cart.'}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({'success': True, 'message': 'Item removed from cart.', 'cart': CartSerializer(cart).data})


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        return Response({'success': True, 'message': 'Cart emptied.'})


class OrderViewSet(viewsets.ModelViewSet):
    """
    Orders endpoint.
    Customer: Views their own orders.
    Dealer: Views & manages all orders.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_dealer', False):
            return Order.objects.prefetch_related('items__part', 'payment').all()
        return Order.objects.prefetch_related('items__part', 'payment').filter(customer=user)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request):
        """
        Atomic Checkout from customer's Cart.
        Validates stock, creates order & order items, deducts stock, creates payment.
        """
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            return Response(
                {'success': False, 'message': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        with transaction.atomic():
            # 1. Stock validation
            for item in cart.items.select_related('part'):
                if item.part.stock_quantity < item.quantity:
                    return Response({
                        'success': False,
                        'message': f"Insufficient stock for '{item.part.name}'. Available: {item.part.stock_quantity}"
                    }, status=status.HTTP_400_BAD_REQUEST)

            # 2. Compute subtotal and totals with DB prices
            subtotal = sum(item.part.selling_price * item.quantity for item in cart.items.all())
            tax = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))  # 5% tax
            total_amount = subtotal + tax

            # 3. Create Order
            order = Order.objects.create(
                customer=user,
                order_number=Order.generate_order_number(),
                status=Order.Status.CONFIRMED,
                subtotal=subtotal,
                tax=tax,
                total_amount=total_amount,
                payment_status=Order.PaymentStatus.PAID,
                shipping_address=data['shipping_address'],
                shipping_city=data.get('shipping_city', ''),
                shipping_state=data.get('shipping_state', ''),
                shipping_postal_code=data.get('shipping_postal_code', ''),
                notes=data.get('notes', ''),
            )

            # 4. Create OrderItems & deduct stock
            total_purchase_cost = Decimal('0.00')
            for item in cart.items.select_related('part'):
                OrderItem.objects.create(
                    order=order,
                    part=item.part,
                    quantity=item.quantity,
                    unit_price=item.part.selling_price,
                    total_price=item.part.selling_price * item.quantity,
                )
                total_purchase_cost += (item.part.purchase_cost * item.quantity)
                item.part.stock_quantity -= item.quantity
                if item.part.stock_quantity == 0:
                    item.part.status = Part.Status.OUT_OF_STOCK
                item.part.save()

            # 5. Create Payment Record
            Payment.objects.create(
                order=order,
                transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
                amount=total_amount,
                payment_method=data['payment_method'],
                status=Payment.Status.SUCCESS,
            )

            # 6. Record Authoritative Sale in Single-Source-of-Truth
            from sales.models import Sale
            Sale.objects.create(
                customer=user,
                sale_type=Sale.SaleType.PART,
                order=order,
                selling_price=subtotal,
                purchase_cost=total_purchase_cost,
                other_cost=Decimal('0.00'),
                discount=order.discount,
                tax=tax,
                payment_status=Sale.PaymentStatus.PAID,
                notes=f"E-Commerce Parts Order #{order.order_number}"
            )

            # 7. Clear Cart
            cart.items.all().delete()

        return Response({
            'success': True,
            'message': 'Order placed successfully!',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], permission_classes=[IsDealer])
    def update_status(self, request, pk=None):
        """Dealer updates order status or payment status"""
        order = self.get_object()
        new_status = request.data.get('status')
        new_payment_status = request.data.get('payment_status')

        if new_status and new_status in Order.Status.values:
            order.status = new_status
        if new_payment_status and new_payment_status in Order.PaymentStatus.values:
            order.payment_status = new_payment_status
        order.save()

        return Response({
            'success': True,
            'message': f'Order #{order.order_number} status updated.',
            'order': OrderSerializer(order).data
        })
