from django.db import models


class Vehicle(models.Model):

    STATUS = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('delivered', 'Delivered'),
    ]

    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField('VIN', max_length=17, unique=True)
    color = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mileage = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=10,
        choices=STATUS,
        default='available'
    )

    image = models.ImageField(
        upload_to='vehicles/',
        blank=True,
        null=True
    )

    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"