from django.contrib import admin
from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):

    list_display = (
        'make',
        'model',
        'year',
        'price',
        'status'
    )

    list_filter = (
        'status',
        'make',
        'year'
    )

    search_fields = (
        'make',
        'model',
        'vin'
    )