from django.urls import path
from . import views


urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('add/', views.service_add, name='service_add'),
    path('<int:pk>/', views.service_detail, name='service_detail'),
    path('edit/<int:pk>/', views.service_edit, name='service_edit'),
    path('delete/<int:pk>/', views.service_delete, name='service_delete'),
]