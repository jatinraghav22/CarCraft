from django import forms


class PartOrderForm(forms.Form):
    quantity = forms.IntegerField(min_value=1)
