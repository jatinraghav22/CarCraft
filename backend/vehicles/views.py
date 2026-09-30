from rest_framework import viewsets, filters, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from accounts.permissions import IsDealer, IsDealerOrReadOnly
from .models import Vehicle, VehicleImage
from .serializers import (
    VehicleCustomerSerializer,
    VehicleDealerSerializer,
    VehicleImageSerializer,
)


class VehiclePagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class VehicleViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Vehicles.
    Public: GET list and retrieve (using CustomerSerializer without purchase_cost).
    Dealer: Full CRUD with DealerSerializer (exposing purchase_cost & margin).
    """
    permission_classes = [permissions.AllowAny]
    pagination_class = VehiclePagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['brand', 'model', 'color', 'description', 'engine']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = Vehicle.objects.prefetch_related('gallery_images').all()

        # Customers and unauthenticated users only see available/reserved vehicles
        if not (user.is_authenticated and getattr(user, 'is_dealer', False)):
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status__iexact=status_param)
            else:
                queryset = queryset.filter(status__in=[Vehicle.Status.AVAILABLE, Vehicle.Status.RESERVED])
        else:
            # Dealer can filter by any status
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status__iexact=status_param)

        # Filters
        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__iexact=brand)

        fuel = self.request.query_params.get('fuel')
        if fuel:
            queryset = queryset.filter(fuel__iexact=fuel)

        transmission = self.request.query_params.get('transmission')
        if transmission:
            queryset = queryset.filter(transmission__iexact=transmission)

        body_type = self.request.query_params.get('body_type')
        if body_type:
            queryset = queryset.filter(body_type__iexact=body_type)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        min_year = self.request.query_params.get('min_year')
        if min_year:
            queryset = queryset.filter(year__gte=min_year)

        max_year = self.request.query_params.get('max_year')
        if max_year:
            queryset = queryset.filter(year__lte=max_year)

        return queryset

    def get_serializer_class(self):
        user = self.request.user
        # Write actions from Dealer Suite always use VehicleDealerSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return VehicleDealerSerializer
        if user.is_authenticated and getattr(user, 'is_dealer', False):
            return VehicleDealerSerializer
        return VehicleCustomerSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsDealer])
    def upload_gallery_image(self, request, pk=None):
        vehicle = self.get_object()
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {'success': False, 'message': 'No image file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        gallery_img = VehicleImage.objects.create(
            vehicle=vehicle,
            image=image_file,
            is_primary=request.data.get('is_primary', 'false').lower() in ('true', '1')
        )
        return Response({
            'success': True,
            'message': 'Gallery image uploaded.',
            'image': VehicleImageSerializer(gallery_img).data
        }, status=status.HTTP_201_CREATED)
