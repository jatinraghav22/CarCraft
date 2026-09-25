from datetime import date
from decimal import Decimal

from django import forms

from .models import Vehicle


class VehicleForm(forms.ModelForm):
    year = forms.IntegerField(
        min_value=1886,
        max_value=date.today().year + 1,
    )
    price = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal('0.01'),
    )

    class Meta:
        model = Vehicle
        fields = (
            'make',
            'model',
            'year',
            'vin',
            'color',
            'price',
            'mileage',
            'status',
            'image',
        )
