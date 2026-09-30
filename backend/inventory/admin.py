from django.contrib import admin
from .models import InventoryTransaction


@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_type', 'vehicle', 'part', 'quantity', 'unit_cost', 'total_cost', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('reference', 'notes', 'vehicle__model', 'part__name')
    ordering = ('-created_at',)
