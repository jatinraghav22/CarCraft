from django.contrib import admin
from .models import Vehicle, VehicleImage


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model', 'year', 'price', 'purchase_cost', 'fuel', 'transmission', 'mileage', 'status', 'created_at')
    list_filter = ('status', 'brand', 'fuel', 'transmission', 'body_type', 'year')
    search_fields = ('brand', 'model', 'color', 'description')
    ordering = ('-created_at',)
    inlines = [VehicleImageInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('brand', 'model', 'year', 'color', 'body_type', 'status', 'stock_quantity')
        }),
        ('Pricing (Confidentiality Protected)', {
            'fields': ('price', 'purchase_cost')
        }),
        ('Technical Specifications', {
            'fields': ('fuel', 'transmission', 'mileage', 'engine', 'horsepower', 'torque', 'seats', 'top_speed')
        }),
        ('Media & Features', {
            'fields': ('image', 'description', 'features')
        }),
    )
