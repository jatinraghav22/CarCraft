from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('category', 'description', 'amount', 'date', 'payment_method')
    list_filter = ('category', 'date')
    search_fields = ('description', 'notes', 'category')
    ordering = ('-date',)
