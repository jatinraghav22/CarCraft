from rest_framework import serializers, viewsets
from accounts.permissions import IsDealer
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id',
            'category',
            'description',
            'amount',
            'date',
            'payment_method',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Expense amount must be greater than zero.")
        return value


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Dealer-only operational expense tracking.
    Rent, payroll, utilities, marketing, maintenance.
    """
    permission_classes = [IsDealer]
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filterset_fields = ['category', 'date']
    search_fields = ['description', 'notes', 'category']
    ordering = ['-date', '-created_at']
