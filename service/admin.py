from django.contrib import admin
from .models import ServiceAppointment


@admin.register(ServiceAppointment)
class ServiceAppointmentAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
        'vehicle',
        'scheduled_for',
        'status',
        'cost',
    )

    list_filter = (
        'status',
        'scheduled_for',
    )

    search_fields = (
        'customer__full_name',
        'vehicle__make',
        'vehicle__model',
        'description',
    )