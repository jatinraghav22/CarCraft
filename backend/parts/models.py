from django.db import models


class PartCategory(models.TextChoices):
    BRAKES = 'Brakes', 'Brakes'
    SUSPENSION = 'Suspension', 'Suspension'
    ENGINE = 'Engine', 'Engine & Performance'
    EXHAUST = 'Exhaust', 'Exhaust System'
    WHEELS = 'Wheels & Tires', 'Wheels & Tires'
    ELECTRICAL = 'Electrical', 'Electrical & Lighting'
    INTERIOR = 'Interior', 'Interior Accessories'
    EXTERIOR = 'Exterior', 'Body & Exterior'
    SERVICE = 'Service & Maintenance', 'Fluids & Filters'
    OTHER = 'Other', 'Other Accessories'


class Part(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', 'Available'
        OUT_OF_STOCK = 'OUT_OF_STOCK', 'Out of Stock'
        DISCONTINUED = 'DISCONTINUED', 'Discontinued'

    name = models.CharField(max_length=200, db_index=True)
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    brand = models.CharField(max_length=100, db_index=True)
    category = models.CharField(max_length=50, choices=PartCategory.choices, default=PartCategory.OTHER, db_index=True)
    description = models.TextField(blank=True, default='')

    # Dealer confidential purchase cost
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Confidential supplier/purchase cost")

    # Customer selling price
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Customer retail price")

    stock_quantity = models.PositiveIntegerField(default=0)
    minimum_stock = models.PositiveIntegerField(default=5, help_text="Threshold for low-stock warnings")
    image = models.ImageField(upload_to='parts/', blank=True, null=True)
    compatibility = models.CharField(max_length=255, blank=True, default='', help_text="e.g. BMW M3/M4, Porsche 911, Universal")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['brand', 'name']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku}) - ₹{self.selling_price}"

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.minimum_stock

    @property
    def potential_margin(self):
        return self.selling_price - self.purchase_cost
