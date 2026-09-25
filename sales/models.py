from django.db import models

from customers.models import Customer
from inventory.models import Vehicle


class Sale(models.Model):

    STAGE = [
        ('inquiry', 'Inquiry'),
        ('booking', 'Booking'),
        ('sold', 'Sold'),
        ('delivered', 'Delivered'),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT
    )

    stage = models.CharField(
        max_length=10,
        choices=STAGE,
        default='inquiry'
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    sale_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} → {self.vehicle} ({self.stage})"