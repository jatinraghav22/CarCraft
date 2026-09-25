from django.shortcuts import render

from inventory.models import Vehicle
from customers.models import Customer
from sales.models import Sale
from service.models import ServiceAppointment


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
    }

    return render(
        request,
        'dashboard/home.html',
        context
    )