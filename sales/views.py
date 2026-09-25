from django.shortcuts import render, redirect, get_object_or_404
from django.db import transaction
from .forms import SaleForm
from .models import Sale
from customers.models import Customer
from inventory.models import Vehicle


def _lock_selected_vehicle(request):
    vehicle_id = request.POST.get('vehicle', '')
    if not vehicle_id.isdecimal():
        return None

    return Vehicle.objects.select_for_update().filter(pk=vehicle_id).first()


def _save_sale_and_update_vehicle(form, vehicle):
    form.cleaned_data['vehicle'] = vehicle
    form.instance.vehicle = vehicle

    vehicle_status = {
        'booking': 'reserved',
        'sold': 'sold',
        'delivered': 'delivered',
    }.get(form.cleaned_data['stage'])

    if vehicle_status:
        vehicle.status = vehicle_status
        vehicle.save(update_fields=['status'])

    form.save()


def sale_list(request):
    stage = request.GET.get('stage')

    sales = Sale.objects.select_related(
        'customer',
        'vehicle'
    ).order_by('-sale_date')

    if stage and stage != 'all':
        sales = sales.filter(stage=stage)

    return render(request, 'sales/sale_list.html', {
        'sales': sales,
        'selected_stage': stage or 'all',
    })


def sale_detail(request, pk):
    sale = get_object_or_404(
        Sale.objects.select_related('customer', 'vehicle'),
        pk=pk,
    )

    return render(request, 'sales/sale_detail.html', {
        'sale': sale,
    })


def sale_add(request):
    customers = Customer.objects.all()
    is_post = request.method == 'POST'
    if is_post:
        with transaction.atomic():
            vehicle = _lock_selected_vehicle(request)
            form = SaleForm(data=request.POST)

            if form.is_valid() and vehicle:
                _save_sale_and_update_vehicle(form, vehicle)
                return redirect('sale_list')
    else:
        form = SaleForm()

    if is_post and not vehicle and not form.errors.get('vehicle'):
        form.add_error('vehicle', 'Select a valid vehicle.')

    return render(request, 'sales/sale_form.html', {
        'customers': customers,
        'vehicles': form.fields['vehicle'].queryset,
        'form': form,
    })


def sale_edit(request, pk):
    customers = Customer.objects.all()
    is_post = request.method == 'POST'
    if is_post:
        with transaction.atomic():
            sale = get_object_or_404(
                Sale.objects.select_for_update(),
                pk=pk,
            )
            vehicle = _lock_selected_vehicle(request)
            form = SaleForm(data=request.POST, instance=sale)

            if form.is_valid() and vehicle:
                _save_sale_and_update_vehicle(form, vehicle)
                return redirect('sale_list')
    else:
        sale = get_object_or_404(Sale, pk=pk)
        form = SaleForm(instance=sale)

    if is_post and not vehicle and not form.errors.get('vehicle'):
        form.add_error('vehicle', 'Select a valid vehicle.')

    return render(request, 'sales/sale_form.html', {
        'sale': form.instance,
        'customers': customers,
        'vehicles': form.fields['vehicle'].queryset,
        'form': form,
    })


def sale_delete(request, pk):
    sale = get_object_or_404(Sale, pk=pk)

    if request.method == 'POST':
        with transaction.atomic():
            sale = get_object_or_404(
                Sale.objects.select_for_update(),
                pk=pk,
            )
            vehicle = Vehicle.objects.select_for_update().get(pk=sale.vehicle_id)
            sale.delete()
            if sale.stage in ('booking', 'sold', 'delivered'):
                vehicle.status = 'available'
                vehicle.save(update_fields=['status'])
        return redirect('sale_list')

    return render(request, 'sales/sale_confirm_delete.html', {
        'sale': sale,
    })