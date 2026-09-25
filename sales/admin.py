from django.contrib import admin
from .models import Sale


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
        'vehicle',
        'amount',
        'stage',
        'sale_date',
    )

    list_filter = (
        'stage',
        'sale_date',
    )

    search_fields = (
        'customer__full_name',
        'vehicle__make',
        'vehicle__model',
    )