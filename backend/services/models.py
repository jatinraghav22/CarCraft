from decimal import Decimal
from django.db import models
from django.conf import settings
from vehicles.models import Vehicle


class ServiceType(models.TextChoices):
    OIL_CHANGE = 'Oil & Filter Change', 'Oil & Filter Change'
    BRAKE_SERVICE = 'Brake Service', 'Brake Service & Replacement'
    FULL_INSPECTION = 'Full Inspection', 'Comprehensive Vehicle Inspection'
    ENGINE_DIAGNOSTICS = 'Engine Diagnostics', 'Engine Diagnostics & Tuning'
    TIRE_ROTATION = 'Tire Service', 'Tire Rotation & Alignment'
    TRANSMISSION = 'Transmission Service', 'Transmission Fluid & Check'
    BATTERY_ELECTRICAL = 'Electrical', 'Battery & Electrical Diagnostics'
    AIR_CONDITIONING = 'AC Service', 'Air Conditioning & Climate Control'
    CUSTOM = 'Custom Request', 'Custom Service / Repair'


class ServiceAppointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_appointments'
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='service_appointments'
    )
    custom_vehicle = models.CharField(
        max_length=200,
        blank=True,
        default='',
        help_text="Custom vehicle make/model if not from inventory"
    )
    service_type = models.CharField(
        max_length=50,
        choices=ServiceType.choices,
        default=ServiceType.FULL_INSPECTION
    )
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    description = models.TextField(blank=True, default='')

    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    dealer_notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-preferred_date', '-preferred_time']

    def __str__(self):
        v_name = self.vehicle.model if self.vehicle else (self.custom_vehicle or "Vehicle")
        return f"Service: {self.customer.username} - {v_name} ({self.status})"


class TestDrive(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='test_drives'
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='test_drives'
    )
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    phone = models.CharField(max_length=20)
    notes = models.TextField(blank=True, default='')

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    dealer_notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-preferred_date', '-preferred_time']

    def __str__(self):
        return f"Test Drive: {self.customer.username} for {self.vehicle.brand} {self.vehicle.model} ({self.status})"
