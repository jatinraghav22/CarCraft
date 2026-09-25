from django.shortcuts import render, redirect, get_object_or_404
from django.db import transaction

from .forms import ServiceAppointmentForm
from .models import ServiceAppointment
from customers.models import Customer


def service_list(request):
    status = request.GET.get('status')

    services = ServiceAppointment.objects.select_related(
        'customer',
        'vehicle'
    ).order_by('-scheduled_for')

    if status and status != 'all':
        services = services.filter(status=status)

    return render(request, 'service/service_list.html', {
        'services': services,
        'selected_status': status or 'all',
    })


def service_detail(request, pk):
    service = get_object_or_404(
        ServiceAppointment.objects.select_related('customer', 'vehicle'),
        pk=pk,
    )

    return render(request, 'service/service_detail.html', {
        'service': service,
    })


def service_add(request):
    customers = Customer.objects.all()
    is_post = request.method == 'POST'
    form = ServiceAppointmentForm(data=request.POST if is_post else None)

    if is_post and form.is_valid():
        form.save()
        return redirect('service_list')

    return render(request, 'service/service_form.html', {
        'customers': customers,
        'vehicles': form.fields['vehicle'].queryset,
        'form': form,
    })


def service_edit(request, pk):
    customers = Customer.objects.all()
    is_post = request.method == 'POST'

    if is_post:
        with transaction.atomic():
            service = get_object_or_404(
                ServiceAppointment.objects.select_for_update(),
                pk=pk,
            )
            form = ServiceAppointmentForm(
                data=request.POST,
                instance=service,
            )

            if form.is_valid():
                form.save()
                return redirect('service_list')
    else:
        service = get_object_or_404(ServiceAppointment, pk=pk)
        form = ServiceAppointmentForm(instance=service)

    return render(request, 'service/service_form.html', {
        'service': form.instance,
        'customers': customers,
        'vehicles': form.fields['vehicle'].queryset,
        'form': form,
    })


def service_delete(request, pk):
    service = get_object_or_404(ServiceAppointment, pk=pk)

    if request.method == 'POST':
        service.delete()
        return redirect('service_list')

    return render(request, 'service/service_confirm_delete.html', {
        'service': service,
    })