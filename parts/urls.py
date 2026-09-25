from django.urls import path
from . import views

urlpatterns = [
    path('', views.part_list, name='part_list'),

    path('<int:pk>/', views.part_detail, name='part_detail'),

    path('add/', views.part_add, name='part_add'),

    path('edit/<int:pk>/', views.part_edit, name='part_edit'),

    path('delete/<int:pk>/', views.part_delete, name='part_delete'),

    path('order/<int:pk>/', views.part_order, name='part_order'),
]