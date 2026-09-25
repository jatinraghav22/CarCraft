from django.db import models

from customers.models import Customer
from inventory.models import Vehicle


class ServiceAppointment(models.Model):

    STATUS = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    scheduled_for = models.DateTimeField()

    description = models.TextField()

    status = models.CharField(
        max_length=12,
        choices=STATUS,
        default='scheduled'
    )

    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"Service for {self.customer}"