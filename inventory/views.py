from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .forms import VehicleForm
from .models import Vehicle


@login_required
def vehicle_list(request):
    query = request.GET.get('q', '').strip()
    selected_status = request.GET.get('status', 'all')
    valid_statuses = dict(Vehicle.STATUS)

    if selected_status not in valid_statuses and selected_status != 'all':
        selected_status = 'all'

    vehicles = Vehicle.objects.all().order_by('-added_on')

    if query:
        vehicles = vehicles.filter(
            make__icontains=query
        ) | vehicles.filter(
            model__icontains=query
        ) | vehicles.filter(
            vin__icontains=query
        )

    if selected_status != 'all':
        vehicles = vehicles.filter(status=selected_status)

    return render(request, 'inventory/vehicle_list.html', {
        'vehicles': vehicles,
        'query': query,
        'selected_status': selected_status,
    })


@login_required
def vehicle_detail(request, pk):
    vehicle = get_object_or_404(Vehicle, pk=pk)

    return render(request, 'inventory/vehicle_detail.html', {
        'vehicle': vehicle,
    })


@login_required
def vehicle_add(request):
    is_post = request.method == 'POST'
    form = VehicleForm(
        data=request.POST if is_post else None,
        files=request.FILES if is_post else None,
    )

    if is_post and form.is_valid():
        form.save()
        return redirect('vehicle_list')

    return render(request, 'inventory/vehicle_form.html', {
        'form': form,
    })


@login_required
def vehicle_edit(request, pk):
    vehicle = get_object_or_404(Vehicle, pk=pk)
    is_post = request.method == 'POST'
    form = VehicleForm(
        data=request.POST if is_post else None,
        files=request.FILES if is_post else None,
        instance=vehicle,
    )

    if is_post and form.is_valid():
        form.save()
        return redirect('vehicle_list')

    return render(request, 'inventory/vehicle_form.html', {
        'vehicle': form.instance,
        'form': form,
    })


@login_required
def vehicle_delete(request, pk):
    vehicle = get_object_or_404(Vehicle, pk=pk)

    if request.method == 'POST':
        vehicle.delete()
        return redirect('vehicle_list')

    return render(request, 'inventory/vehicle_confirm_delete.html', {
        'vehicle': vehicle,
    })