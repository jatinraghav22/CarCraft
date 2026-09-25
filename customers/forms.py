import re

from django import forms

from .models import Customer


class CustomerForm(forms.ModelForm):
    phone = forms.CharField(max_length=20)

    class Meta:
        model = Customer
        fields = ('full_name', 'email', 'phone', 'address')

    def clean_phone(self):
        phone = self.cleaned_data['phone'].strip()
        digits = re.sub(r'\D', '', phone)

        if not re.fullmatch(r'\+?[0-9\s().-]+', phone) or not 7 <= len(digits) <= 15:
            raise forms.ValidationError(
                'Enter a valid phone number with 7 to 15 digits.'
            )

        return phone
