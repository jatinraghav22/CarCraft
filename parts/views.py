from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db import transaction

from .forms import PartForm
from .order_forms import PartOrderForm
from .models import Part, PartOrder


@login_required
def part_list(request):
    search = request.GET.get('search', '').strip()

    parts = Part.objects.all().order_by('name')

    if search:
        parts = parts.filter(
            name__icontains=search
        ) | parts.filter(
            sku__icontains=search
        ) | parts.filter(
            category__icontains=search
        )

    return render(request, 'parts/part_list.html', {
        'parts': parts,
        'search': search,
    })


@login_required
def part_detail(request, pk):
    part = get_object_or_404(Part, pk=pk)
    orders = PartOrder.objects.filter(part=part).order_by('-ordered_on')

    return render(request, 'parts/part_detail.html', {
        'part': part,
        'orders': orders,
    })


@login_required
def part_add(request):
    is_post = request.method == 'POST'
    form = PartForm(data=request.POST if is_post else None)

    if is_post and form.is_valid():
        form.save()
        return redirect('part_list')

    return render(request, 'parts/part_form.html', {
        'form': form,
    })


@login_required
def part_edit(request, pk):
    part = get_object_or_404(Part, pk=pk)
    is_post = request.method == 'POST'
    form = PartForm(
        data=request.POST if is_post else None,
        instance=part,
    )

    if is_post and form.is_valid():
        form.save()
        return redirect('part_list')

    return render(request, 'parts/part_form.html', {
        'part': form.instance,
        'form': form,
    })


@login_required
def part_delete(request, pk):
    part = get_object_or_404(Part, pk=pk)

    if request.method == 'POST':
        part.delete()
        return redirect('part_list')

    return render(request, 'parts/part_confirm_delete.html', {
        'part': part,
    })


@login_required
def part_order(request, pk):
    part = get_object_or_404(Part, pk=pk)
    is_post = request.method == 'POST'

    if is_post:
        with transaction.atomic():
            part = get_object_or_404(
                Part.objects.select_for_update(),
                pk=pk,
            )
            form = PartOrderForm(request.POST)

            if form.is_valid():
                quantity = form.cleaned_data['quantity']

                if quantity > part.stock_qty:
                    form.add_error(
                        'quantity',
                        f'Only {part.stock_qty} units are currently in stock.',
                    )
                else:
                    PartOrder.objects.create(part=part, quantity=quantity)
                    part.stock_qty -= quantity
                    part.save(update_fields=['stock_qty'])
                    return redirect('part_detail', pk=part.pk)
    else:
        form = PartOrderForm()

    return render(request, 'parts/part_order.html', {
        'part': part,
        'form': form,
    })