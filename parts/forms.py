from decimal import Decimal

from django import forms

from .models import Part


class PartForm(forms.ModelForm):
    price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.00'),
    )
    stock_qty = forms.IntegerField(min_value=0)

    class Meta:
        model = Part
        fields = ('name', 'sku', 'category', 'price', 'stock_qty')
