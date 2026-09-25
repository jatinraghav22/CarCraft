from django.shortcuts import render
from django.utils import timezone

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