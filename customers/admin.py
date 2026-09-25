from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):

    list_display = (
        'full_name',
        'email',
        'phone',
        'created_on',
    )

    search_fields = (
        'full_name',
        'email',
        'phone',
    )