from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from accounts.models import User
from accounts.permissions import IsDealer
from vehicles.models import Vehicle
from parts.models import Part
from orders.models import Order
from services.models import ServiceAppointment, TestDrive
from sales.models import Sale
from expenses.models import Expense


def get_date_range(request):
    period = request.query_params.get('period', 'all').lower()
    now = timezone.now()

    if period == 'today':
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        return start, now
    elif period == 'this_week':
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        return start, now
    elif period == 'this_month':
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return start, now
    elif period == 'this_year':
        start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        return start, now

    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d')
            end = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            return start, end
        except ValueError:
            pass

    return None, None


class DealerDashboardView(APIView):
    """
    Comprehensive Live Dealer & Admin Dashboard API.
    All metrics computed dynamically from live database records.
    """
    permission_classes = [IsDealer]

    def get(self, request):
        # 1. Vehicles Metrics
        total_vehicles = Vehicle.objects.count()
        available_vehicles = Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE).count()
        sold_vehicles = Vehicle.objects.filter(status=Vehicle.Status.SOLD).count()
        reserved_vehicles = Vehicle.objects.filter(status=Vehicle.Status.RESERVED).count()

        # 2. Parts Metrics
        total_parts = Part.objects.count()
        low_stock_parts = Part.objects.filter(stock_quantity__lte=F('minimum_stock')).count()

        # 3. Customer & Order Metrics
        total_customers = User.objects.filter(role=User.Role.CUSTOMER).count()
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status=Order.Status.PENDING).count()

        # 4. Service & Test Drive Metrics
        total_test_drives = TestDrive.objects.count()
        pending_test_drives = TestDrive.objects.filter(status=TestDrive.Status.PENDING).count()
        total_services = ServiceAppointment.objects.count()
        pending_services = ServiceAppointment.objects.filter(status=ServiceAppointment.Status.PENDING).count()
        completed_services = ServiceAppointment.objects.filter(status=ServiceAppointment.Status.COMPLETED).count()

        # 5. Financial Metrics (Only completed / paid transactions count as realized revenue)
        paid_sales = Sale.objects.filter(payment_status=Sale.PaymentStatus.PAID)
        total_revenue = paid_sales.aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')
        direct_costs = (paid_sales.aggregate(total=Sum('purchase_cost'))['total'] or Decimal('0.00')) + \
                       (paid_sales.aggregate(total=Sum('other_cost'))['total'] or Decimal('0.00'))
        gross_profit = total_revenue - direct_costs

        total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        net_profit = gross_profit - total_expenses
        net_loss = Decimal('0.00') if net_profit >= 0 else abs(net_profit)

        # 6. Inventory Valuation (based on confidential purchase costs)
        vehicle_inv_val = sum((v.purchase_cost * v.stock_quantity) for v in Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE))
        parts_inv_val = sum((p.purchase_cost * p.stock_quantity) for p in Part.objects.all())
        total_inventory_value = vehicle_inv_val + parts_inv_val

        # 7. Recent Activities
        recent_sales = list(Sale.objects.order_by('-created_at')[:5].values(
            'id', 'sale_type', 'net_amount', 'profit', 'payment_status', 'sale_date', 'customer__username'
        ))
        recent_appointments = list(ServiceAppointment.objects.order_by('-created_at')[:5].values(
            'id', 'service_type', 'preferred_date', 'status', 'customer__username'
        ))
        recent_test_drives = list(TestDrive.objects.order_by('-created_at')[:5].values(
            'id', 'vehicle__brand', 'vehicle__model', 'preferred_date', 'status', 'customer__username'
        ))

        return Response({
            'success': True,
            'summary': {
                'total_vehicles': total_vehicles,
                'available_vehicles': available_vehicles,
                'sold_vehicles': sold_vehicles,
                'reserved_vehicles': reserved_vehicles,
                'total_parts': total_parts,
                'low_stock_parts': low_stock_parts,
                'total_customers': total_customers,
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'total_test_drives': total_test_drives,
                'pending_test_drives': pending_test_drives,
                'total_services': total_services,
                'pending_services': pending_services,
                'completed_services': completed_services,
                'total_inventory': available_vehicles + total_parts,
            },
            'counts': {
                'test_drives': total_test_drives,
                'pending_test_drives': pending_test_drives,
                'service_appointments': total_services,
                'pending_service_appointments': pending_services,
                'client_orders': total_orders,
                'pending_orders': pending_orders,
                'inventory': available_vehicles + total_parts,
                'available_vehicles': available_vehicles,
                'total_parts': total_parts,
                'notifications': pending_test_drives + pending_services + pending_orders,
            },
            'financials': {
                'total_revenue': total_revenue,
                'direct_costs': direct_costs,
                'gross_profit': gross_profit,
                'total_expenses': total_expenses,
                'net_profit': net_profit if net_profit > 0 else Decimal('0.00'),
                'net_loss': net_loss,
                'inventory_value': total_inventory_value,
                'vehicle_inventory_value': vehicle_inv_val,
                'parts_inventory_value': parts_inv_val,
            },
            'recent_activity': {
                'sales': recent_sales,
                'appointments': recent_appointments,
                'test_drives': recent_test_drives,
            }
        })


class DealerNavigationCountsView(APIView):
    """
    Lightweight, high-frequency endpoint for Dealer Portal sidebar badges,
    navigation counters, and alert dots.
    All numbers strictly derived from database records.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        test_drives_count = TestDrive.objects.count()
        pending_test_drives_count = TestDrive.objects.filter(status=TestDrive.Status.PENDING).count()

        service_appointments_count = ServiceAppointment.objects.count()
        pending_services_count = ServiceAppointment.objects.filter(status=ServiceAppointment.Status.PENDING).count()

        client_orders_count = Order.objects.count()
        pending_orders_count = Order.objects.filter(status=Order.Status.PENDING).count()

        available_vehicles_count = Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE).count()
        total_parts_count = Part.objects.count()
        total_inventory_count = available_vehicles_count + total_parts_count

        notifications_count = pending_test_drives_count + pending_services_count + pending_orders_count

        return Response({
            'success': True,
            'test_drives': test_drives_count,
            'pending_test_drives': pending_test_drives_count,
            'service_appointments': service_appointments_count,
            'pending_service_appointments': pending_services_count,
            'client_orders': client_orders_count,
            'pending_orders': pending_orders_count,
            'inventory': total_inventory_count,
            'available_vehicles': available_vehicles_count,
            'total_parts': total_parts_count,
            'notifications': notifications_count,
        })


class ProfitAndLossReportView(APIView):
    """
    Detailed Profit & Loss Financial Report API with date range filtering.
    """
    permission_classes = [IsDealer]

    def get(self, request):
        start, end = get_date_range(request)

        sales_qs = Sale.objects.filter(payment_status=Sale.PaymentStatus.PAID)
        expenses_qs = Expense.objects.all()

        if start and end:
            sales_qs = sales_qs.filter(sale_date__gte=start, sale_date__lte=end)
            expenses_qs = expenses_qs.filter(date__gte=start, date__lte=end)

        vehicle_rev = sales_qs.filter(sale_type=Sale.SaleType.VEHICLE).aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')
        parts_rev = sales_qs.filter(sale_type=Sale.SaleType.PART).aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')
        service_rev = sales_qs.filter(sale_type=Sale.SaleType.SERVICE).aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')

        total_revenue = vehicle_rev + parts_rev + service_rev
        direct_costs = (sales_qs.aggregate(total=Sum('purchase_cost'))['total'] or Decimal('0.00')) + \
                       (sales_qs.aggregate(total=Sum('other_cost'))['total'] or Decimal('0.00'))
        gross_profit = total_revenue - direct_costs

        operating_expenses = expenses_qs.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        net_profit = gross_profit - operating_expenses

        # Pending receivables
        pending_payments = Sale.objects.filter(payment_status=Sale.PaymentStatus.PENDING).aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')

        return Response({
            'success': True,
            'filter_period': request.query_params.get('period', 'all'),
            'revenue_breakdown': {
                'vehicle_revenue': vehicle_rev,
                'parts_revenue': parts_rev,
                'service_revenue': service_rev,
                'total_revenue': total_revenue,
            },
            'cost_breakdown': {
                'direct_costs': direct_costs,
                'gross_profit': gross_profit,
                'operating_expenses': operating_expenses,
            },
            'bottom_line': {
                'net_profit': max(net_profit, Decimal('0.00')),
                'net_loss': abs(min(net_profit, Decimal('0.00'))),
                'pending_receivables': pending_payments,
            }
        })


class SalesReportView(APIView):
    """
    Sales report formatted for React Chart visualizations.
    """
    permission_classes = [IsDealer]

    def get(self, request):
        sales = Sale.objects.filter(payment_status=Sale.PaymentStatus.PAID).order_by('sale_date')
        
        # Monthly grouping
        monthly_data = {}
        for s in sales:
            month_key = s.sale_date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    'period': month_key,
                    'revenue': Decimal('0.00'),
                    'direct_costs': Decimal('0.00'),
                    'gross_profit': Decimal('0.00'),
                    'transactions': 0
                }
            monthly_data[month_key]['revenue'] += s.net_amount
            monthly_data[month_key]['direct_costs'] += (s.purchase_cost + s.other_cost)
            monthly_data[month_key]['gross_profit'] += s.profit
            monthly_data[month_key]['transactions'] += 1

        chart_data = list(monthly_data.values())
        return Response({
            'success': True,
            'data': chart_data
        })


class ExpensesReportView(APIView):
    """
    Expense breakdown by category for React Pie / Donut charts.
    """
    permission_classes = [IsDealer]

    def get(self, request):
        categories = Expense.objects.values('category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        return Response({
            'success': True,
            'categories': list(categories)
        })


class CustomerManagementView(APIView):
    """
    Dealer-only Customer Records & History View.
    Never exposes passwords, tokens, or security credentials.
    """
    permission_classes = [IsDealer]

    def get(self, request, pk=None):
        if pk:
            customer = User.objects.filter(id=pk, role=User.Role.CUSTOMER).first()
            if not customer:
                return Response({'success': False, 'message': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)

            orders = list(customer.orders.values('id', 'order_number', 'total_amount', 'status', 'created_at'))
            test_drives = list(customer.test_drives.values('id', 'vehicle__brand', 'vehicle__model', 'preferred_date', 'status'))
            appointments = list(customer.service_appointments.values('id', 'service_type', 'preferred_date', 'status', 'final_cost'))
            total_spent = customer.sales.filter(payment_status=Sale.PaymentStatus.PAID).aggregate(total=Sum('net_amount'))['total'] or Decimal('0.00')

            return Response({
                'success': True,
                'customer': {
                    'id': customer.id,
                    'username': customer.username,
                    'email': customer.email,
                    'first_name': customer.first_name,
                    'last_name': customer.last_name,
                    'phone': customer.phone,
                    'registered_date': customer.date_joined,
                    'total_spent': total_spent,
                    'orders': orders,
                    'test_drives': test_drives,
                    'service_appointments': appointments,
                }
            })

        customers = User.objects.filter(role=User.Role.CUSTOMER).prefetch_related('orders', 'test_drives', 'service_appointments')
        customer_list = []
        for c in customers:
            customer_list.append({
                'id': c.id,
                'username': c.username,
                'email': c.email,
                'name': f"{c.first_name} {c.last_name}".strip() or c.username,
                'phone': c.phone or 'N/A',
                'registered_date': c.date_joined,
                'total_orders': c.orders.count(),
                'total_test_drives': c.test_drives.count(),
                'total_appointments': c.service_appointments.count(),
            })

        return Response({
            'success': True,
            'total_customers': len(customer_list),
            'customers': customer_list
        })
