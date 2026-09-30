from rest_framework import viewsets
from accounts.permissions import IsDealer
from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Dealer-only operational expense tracking.
    Rent, payroll, utilities, marketing, maintenance.
    """
    permission_classes = [IsDealer]
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    search_fields = ['description', 'notes', 'category']
    ordering = ['-date', '-created_at']
