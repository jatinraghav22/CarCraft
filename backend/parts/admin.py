from django.contrib import admin
from .models import Part


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'brand', 'category', 'selling_price', 'purchase_cost', 'stock_quantity', 'minimum_stock', 'status')
    list_filter = ('category', 'status', 'brand')
    search_fields = ('name', 'sku', 'brand', 'compatibility', 'description')
    ordering = ('-created_at',)

    fieldsets = (
        ('General Information', {
            'fields': ('name', 'sku', 'brand', 'category', 'status', 'compatibility', 'description', 'image')
        }),
        ('Financial Information', {
            'fields': ('selling_price', 'purchase_cost')
        }),
        ('Inventory Tracking', {
            'fields': ('stock_quantity', 'minimum_stock')
        }),
    )
