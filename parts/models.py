from django.db import models


class Part(models.Model):

    name = models.CharField(max_length=100)

    sku = models.CharField(
        'SKU',
        max_length=40,
        unique=True
    )

    category = models.CharField(max_length=50)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock_qty = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class PartOrder(models.Model):

    part = models.ForeignKey(
        Part,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(default=1)

    ordered_on = models.DateTimeField(
        auto_now_add=True
    )

    @property
    def total(self):
        return self.part.price * self.quantity