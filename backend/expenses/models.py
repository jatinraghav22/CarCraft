from decimal import Decimal
from django.db import models
from django.utils import timezone


class ExpenseCategory(models.TextChoices):
    RENT = 'RENT', 'Facility Rent & Lease'
    SALARY = 'SALARY', 'Payroll & Commissions'
    UTILITIES = 'UTILITIES', 'Electricity, Water & Internet'
    MARKETING = 'MARKETING', 'Advertising & Marketing'
    MAINTENANCE = 'MAINTENANCE', 'Tools & Equipment Maintenance'
    TRANSPORT = 'TRANSPORT', 'Vehicle Logistics & Shipping'
    SUPPLIES = 'SUPPLIES', 'Office & Shop Supplies'
    INSURANCE = 'INSURANCE', 'Dealership & Liability Insurance'
    TAX = 'TAX', 'Business Taxes & Municipal Fees'
    OTHER = 'OTHER', 'Miscellaneous Expenses'


class Expense(models.Model):
    category = models.CharField(
        max_length=30,
        choices=ExpenseCategory.choices,
        default=ExpenseCategory.OTHER,
        db_index=True
    )
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Operating expense amount")
    date = models.DateField(default=timezone.now, db_index=True)
    payment_method = models.CharField(max_length=50, blank=True, default='Bank Transfer')
    notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.category}: {self.description} (₹{self.amount})"
