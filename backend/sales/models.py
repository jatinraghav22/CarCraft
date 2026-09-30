from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.conf import settings
from vehicles.models import Vehicle
from orders.models import Order
from services.models import ServiceAppointment


class Sale(models.Model):
    class SaleType(models.TextChoices):
        VEHICLE = 'VEHICLE', 'Vehicle Sale'
        PART = 'PART', 'Parts & Accessories Order'
        SERVICE = 'SERVICE', 'Service Revenue'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sales')
    sale_type = models.CharField(max_length=20, choices=SaleType.choices, default=SaleType.VEHICLE, db_index=True)
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, blank=True, null=True, related_name='sales')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True, related_name='sales')
    service_appointment = models.ForeignKey(ServiceAppointment, on_delete=models.SET_NULL, blank=True, null=True, related_name='sales')

    selling_price = models.DecimalField(max_digits=12, decimal_places=2)
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Direct product cost")
    other_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Direct labor / preparation / logistics")
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    net_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Net customer billing")
    profit = models.DecimalField(max_digits=12, decimal_places=2, help_text="Gross profit = net_amount - direct costs")

    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PAID, db_index=True)
    sale_date = models.DateField(default=timezone.now, db_index=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-sale_date', '-created_at']

    def __str__(self):
        return f"{self.sale_type} Sale (₹{self.net_amount}) - Profit: ₹{self.profit}"

    def save(self, *args, **kwargs):
        # Enforce backend-calculated financial metrics
        self.net_amount = self.selling_price - self.discount + self.tax
        direct_costs = self.purchase_cost + self.other_cost
        self.profit = self.net_amount - direct_costs
        super().save(*args, **kwargs)
