from decimal import Decimal

from django import forms

from inventory.models import Vehicle

from .models import ServiceAppointment


class ServiceAppointmentForm(forms.ModelForm):
    vehicle = forms.ModelChoiceField(queryset=Vehicle.objects.all())
    cost = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.00'),
    )

    class Meta:
        model = ServiceAppointment
        fields = (
            'customer',
            'vehicle',
            'scheduled_for',
            'description',
            'status',
            'cost',
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        status_choices = {
            'scheduled': [('scheduled', 'Scheduled'), ('in_progress', 'In Progress')],
            'in_progress': [('in_progress', 'In Progress'), ('completed', 'Completed')],
            'completed': [('completed', 'Completed')],
        }
        if self.instance.pk:
            self.fields['status'].choices = status_choices[self.instance.status]
        else:
            self.fields['status'].choices = [('scheduled', 'Scheduled')]

    def clean(self):
        cleaned_data = super().clean()
        requested_status = cleaned_data.get('status')
        current_status = self.instance.status if self.instance.pk else 'scheduled'

        status_order = {
            'scheduled': 0,
            'in_progress': 1,
            'completed': 2,
        }

        if requested_status and status_order[requested_status] < status_order[current_status]:
            self.add_error('status', 'An appointment cannot move back to an earlier status.')

        return cleaned_data
