from django.urls import path
from .views import (
    DealerDashboardView,
    DealerNavigationCountsView,
    ProfitAndLossReportView,
    SalesReportView,
    ExpensesReportView,
    CustomerManagementView,
)

urlpatterns = [
    # Live Dealer Dashboard & Navigation Counts
    path('dealer/dashboard/', DealerDashboardView.as_view(), name='dealer-dashboard'),
    path('dealer/counts/', DealerNavigationCountsView.as_view(), name='dealer-counts'),

    # Financial & Analytical Reports
    path('reports/profit-loss/', ProfitAndLossReportView.as_view(), name='report-profit-loss'),
    path('reports/sales/', SalesReportView.as_view(), name='report-sales'),
    path('reports/expenses/', ExpensesReportView.as_view(), name='report-expenses'),

    # Customer Records Management (Dealer only)
    path('customers/', CustomerManagementView.as_view(), name='customer-list'),
    path('customers/<int:pk>/', CustomerManagementView.as_view(), name='customer-detail'),
]
