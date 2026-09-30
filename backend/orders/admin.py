from django.contrib import admin
from .models import Wishlist, WishlistItem, Cart, CartItem, Order, OrderItem, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('part', 'quantity', 'unit_price', 'total_price')


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0
    readonly_fields = ('transaction_id', 'amount', 'payment_method', 'status', 'created_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'total_amount', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'customer__username', 'customer__email', 'shipping_address')
    ordering = ('-created_at',)
    inlines = [OrderItemInline, PaymentInline]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'subtotal', 'updated_at')
    search_fields = ('user__username',)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)
