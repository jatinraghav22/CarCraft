from django.contrib import admin
from .models import ServiceAppointment, TestDrive


@admin.register(ServiceAppointment)
class ServiceAppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'vehicle', 'service_type', 'preferred_date', 'preferred_time', 'status', 'final_cost')
    list_filter = ('status', 'service_type', 'preferred_date')
    search_fields = ('customer__username', 'customer__email', 'vehicle__model', 'description')
    ordering = ('-preferred_date',)


@admin.register(TestDrive)
class TestDriveAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'vehicle', 'preferred_date', 'preferred_time', 'phone', 'status')
    list_filter = ('status', 'preferred_date')
    search_fields = ('customer__username', 'vehicle__brand', 'vehicle__model', 'phone')
    ordering = ('-preferred_date',)
