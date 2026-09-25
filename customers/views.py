from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .forms import CustomerForm
from .models import Customer


@login_required
def customer_list(request):
    query = request.GET.get('q', '').strip()

    customers = Customer.objects.all().order_by('-created_on')

    if query:
        customers = customers.filter(
            full_name__icontains=query
        ) | customers.filter(
            email__icontains=query
        ) | customers.filter(
            phone__icontains=query
        )

    return render(request, 'customers/customer_list.html', {
        'customers': customers,
        'query': query,
    })


@login_required
def customer_detail(request, pk):
    customer = get_object_or_404(Customer, pk=pk)

    return render(request, 'customers/customer_detail.html', {
        'customer': customer,
    })


@login_required
def customer_add(request):
    is_post = request.method == 'POST'
    form = CustomerForm(data=request.POST if is_post else None)

    if is_post and form.is_valid():
        form.save()
        return redirect('customer_list')

    return render(request, 'customers/customer_form.html', {
        'form': form,
    })


@login_required
def customer_edit(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    is_post = request.method == 'POST'
    form = CustomerForm(
        data=request.POST if is_post else None,
        instance=customer,
    )

    if is_post and form.is_valid():
        form.save()
        return redirect('customer_list')

    return render(request, 'customers/customer_form.html', {
        'customer': form.instance,
        'form': form,
    })


@login_required
def customer_delete(request, pk):
    customer = get_object_or_404(Customer, pk=pk)

    if request.method == 'POST':
        customer.delete()
        return redirect('customer_list')

    return render(request, 'customers/customer_confirm_delete.html', {
        'customer': customer,
    })