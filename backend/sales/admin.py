from django.contrib import admin
from .models import Sale


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('sale_type', 'customer', 'vehicle', 'selling_price', 'purchase_cost', 'net_amount', 'profit', 'payment_status', 'sale_date')
    list_filter = ('sale_type', 'payment_status', 'sale_date')
    search_fields = ('customer__username', 'customer__email', 'vehicle__model', 'notes')
    ordering = ('-sale_date',)
