from decimal import Decimal
from django.db import models
from django.conf import settings
from vehicles.models import Vehicle
from parts.models import Part


class InventoryTransaction(models.Model):
    class TransactionType(models.TextChoices):
        PURCHASE = 'PURCHASE', 'Inventory Purchase / Stock In'
        SALE = 'SALE', 'Customer Sale / Stock Out'
        RETURN = 'RETURN', 'Customer Return'
        ADJUSTMENT = 'ADJUSTMENT', 'Inventory Adjustment'
        DAMAGE = 'DAMAGE', 'Damaged Stock Write-off'

    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        default=TransactionType.PURCHASE,
        db_index=True
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='inventory_transactions'
    )
    part = models.ForeignKey(
        Part,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='inventory_transactions'
    )
    quantity = models.IntegerField(help_text="Positive for addition, negative for deduction")
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Unit purchase cost")
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Total value based on purchase cost")
    
    reference = models.CharField(max_length=100, blank=True, default='', help_text="Order / Invoice / Audit Reference")
    notes = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        item = self.vehicle.model if self.vehicle else (self.part.name if self.part else "General")
        return f"{self.transaction_type}: {self.quantity}x {item} (₹{self.total_cost})"
