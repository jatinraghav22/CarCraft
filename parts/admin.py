from django.contrib import admin
from .models import Part, PartOrder


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'stock_qty')
    list_filter = ('category',)
    search_fields = ('name', 'sku', 'category')


@admin.register(PartOrder)
class PartOrderAdmin(admin.ModelAdmin):
    list_display = ('part', 'quantity')
    search_fields = ('part__name', 'part__sku')