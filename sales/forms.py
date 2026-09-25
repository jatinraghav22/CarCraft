from django import forms
from django.db.models import Q

from inventory.models import Vehicle

from .models import Sale


class SaleForm(forms.ModelForm):
    class Meta:
        model = Sale
        fields = ('customer', 'vehicle', 'amount', 'stage')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        available_vehicles = Vehicle.objects.filter(status='available')

        if self.instance.pk:
            available_vehicles = Vehicle.objects.filter(
                Q(status='available') | Q(pk=self.instance.vehicle_id)
            )

        self.fields['vehicle'].queryset = available_vehicles.order_by(
            'make', 'model', 'year'
        )

    def clean(self):
        cleaned_data = super().clean()
        stage = cleaned_data.get('stage')
        vehicle = cleaned_data.get('vehicle')

        if not stage or not vehicle:
            return cleaned_data

        stage_order = {
            'inquiry': 0,
            'booking': 1,
            'sold': 2,
            'delivered': 3,
        }
        current_stage = self.instance.stage if self.instance.pk else 'inquiry'
        current_order = stage_order[current_stage]
        requested_order = stage_order[stage]

        if requested_order < current_order:
            self.add_error('stage', 'A sale cannot move back to an earlier stage.')
            return cleaned_data

        if requested_order > current_order + 1:
            self.add_error('stage', 'Advance the sale one stage at a time.')
            return cleaned_data

        if self.instance.pk and current_order > 0:
            if vehicle.pk != self.instance.vehicle_id:
                self.add_error(
                    'vehicle',
                    'The vehicle cannot be changed after a sale is booked.',
                )
                return cleaned_data

        expected_status = {
            'booking': 'available' if requested_order > current_order else 'reserved',
            'sold': 'reserved' if requested_order > current_order else 'sold',
            'delivered': 'sold' if requested_order > current_order else 'delivered',
        }.get(stage)

        if expected_status and vehicle.status != expected_status:
            self.add_error(
                'vehicle',
                f'The vehicle must be {expected_status} before this stage.',
            )

        return cleaned_data
