from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render
from django.utils import timezone

from inventory.models import Vehicle
from customers.models import Customer
from sales.models import Sale
from service.models import ServiceAppointment


def register(request):
    if request.user.is_authenticated:
        return redirect('dashboard:home')

    form = UserCreationForm(
        data=request.POST if request.method == 'POST' else None,
    )
    for name, field in form.fields.items():
        field.widget.attrs.update({'class': 'form-control'})
        field.widget.attrs['autocomplete'] = (
            'username' if name == 'username' else 'new-password'
        )
        if name == 'username':
            field.widget.attrs.update({
                'autofocus': True,
                'placeholder': 'Choose a username',
            })
        else:
            field.widget.attrs['placeholder'] = 'Enter password'

    if request.method == 'POST' and form.is_valid():
        user = form.save()
        auth_login(request, user)
        return redirect('dashboard:home')

    return render(request, 'registration/register.html', {'form': form})


def home(request):

    context = {

        'total_vehicles':
            Vehicle.objects.count(),

        'available':
            Vehicle.objects.filter(
                status='available'
            ).count(),

        'total_customers':
            Customer.objects.count(),

        'total_sales':
            Sale.objects.filter(
                stage__in=['sold', 'delivered']
            ).count(),

        'open_services':
            ServiceAppointment.objects.exclude(
                status='completed'
            ).count(),

        'recent_sales':
            Sale.objects.select_related(
                'customer',
                'vehicle',
            ).order_by('-sale_date', '-pk')[:5],

        'upcoming_services':
            ServiceAppointment.objects.select_related(
                'customer',
                'vehicle',
            ).filter(
                scheduled_for__gte=timezone.now(),
            ).exclude(
                status='completed'
            ).order_by('scheduled_for')[:5],
    }

    return render(
        request,
        'dashboard/home.html',
        context
    )