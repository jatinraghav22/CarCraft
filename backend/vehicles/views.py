from django.db import transaction, models
from django.core.exceptions import ValidationError
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
from .validators import validate_image_file


class VehiclePagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class VehicleViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Vehicles.
    Public: GET list and retrieve (using CustomerSerializer without purchase_cost).
    Dealer: Full CRUD with DealerSerializer (exposing purchase_cost & margin, multi-image upload).
    """
    permission_classes = [IsDealerOrReadOnly]
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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Extract uploaded gallery files if any
        raw_files = (
            request.FILES.getlist('images') or
            request.FILES.getlist('gallery_images')
        )
        single_img = request.FILES.get('image')

        # Collect and validate all image files before touching DB
        all_upload_files = list(raw_files)
        if single_img and single_img not in all_upload_files:
            all_upload_files.append(single_img)

        for f in all_upload_files:
            try:
                validate_image_file(f)
            except ValidationError as e:
                return Response(
                    {'success': False, 'message': e.message if hasattr(e, 'message') else str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.save()

        # Handle primary index request if provided
        try:
            primary_idx = int(request.data.get('primary_index', 0))
        except (ValueError, TypeError):
            primary_idx = 0

        # Save gallery image records
        if all_upload_files:
            for idx, img_file in enumerate(all_upload_files):
                is_primary = (idx == primary_idx)
                img_obj = VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=img_file,
                    is_primary=is_primary,
                    order=idx
                )
                if is_primary:
                    vehicle.image = img_obj.image
                    vehicle.save(update_fields=['image'])

        vehicle.refresh_from_db()
        headers = self.get_success_headers(serializer.data)
        out_serializer = VehicleDealerSerializer(vehicle, context={'request': request})
        return Response(out_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        vehicle = self.get_object()

        # Extract newly uploaded gallery files if any
        raw_files = (
            request.FILES.getlist('images') or
            request.FILES.getlist('gallery_images')
        )

        for f in raw_files:
            try:
                validate_image_file(f)
            except ValidationError as e:
                return Response(
                    {'success': False, 'message': e.message if hasattr(e, 'message') else str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(vehicle, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.save()

        # Add newly uploaded images without removing existing ones
        if raw_files:
            start_order = (vehicle.gallery_images.aggregate(m=models.Max('order'))['m'] or 0) + 1
            has_primary = vehicle.gallery_images.filter(is_primary=True).exists()
            for idx, img_file in enumerate(raw_files):
                make_primary = (not has_primary and idx == 0)
                img_obj = VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=img_file,
                    is_primary=make_primary,
                    order=start_order + idx
                )
                if make_primary:
                    vehicle.image = img_obj.image
                    vehicle.save(update_fields=['image'])

        # Set primary image by ID if specified
        primary_id = request.data.get('primary_image_id')
        if primary_id:
            try:
                target_img = vehicle.gallery_images.get(id=primary_id)
                vehicle.gallery_images.filter(is_primary=True).update(is_primary=False)
                target_img.is_primary = True
                target_img.save(update_fields=['is_primary'])
                vehicle.image = target_img.image
                vehicle.save(update_fields=['image'])
            except VehicleImage.DoesNotExist:
                pass

        vehicle.refresh_from_db()
        out_serializer = VehicleDealerSerializer(vehicle, context={'request': request})
        return Response(out_serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsDealer])
    def upload_gallery_image(self, request, pk=None):
        vehicle = self.get_object()
        files = (
            request.FILES.getlist('images') or
            request.FILES.getlist('gallery_images') or
            request.FILES.getlist('image')
        )
        if not files:
            single = request.FILES.get('image')
            if single:
                files = [single]
            else:
                return Response(
                    {'success': False, 'message': 'No image file provided.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        for f in files:
            try:
                validate_image_file(f)
            except ValidationError as e:
                return Response(
                    {'success': False, 'message': e.message if hasattr(e, 'message') else str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        is_primary_req = str(request.data.get('is_primary', 'false')).lower() in ('true', '1')
        has_primary = vehicle.gallery_images.filter(is_primary=True).exists()

        created_images = []
        with transaction.atomic():
            start_order = (vehicle.gallery_images.aggregate(m=models.Max('order'))['m'] or 0) + 1
            for idx, img_file in enumerate(files):
                make_primary = (is_primary_req and idx == 0) or (not has_primary and idx == 0 and not vehicle.gallery_images.exists())
                if make_primary:
                    vehicle.gallery_images.filter(is_primary=True).update(is_primary=False)

                img_obj = VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=img_file,
                    is_primary=make_primary,
                    order=start_order + idx
                )
                if make_primary:
                    vehicle.image = img_obj.image
                    vehicle.save(update_fields=['image'])
                created_images.append(img_obj)

        context = {'request': request}
        return Response({
            'success': True,
            'message': f'{len(created_images)} image(s) uploaded successfully.',
            'images': VehicleImageSerializer(created_images, many=True, context=context).data,
            'image': VehicleImageSerializer(created_images[0], context=context).data if created_images else None,
            'gallery_images': VehicleImageSerializer(vehicle.gallery_images.all(), many=True, context=context).data,
            'vehicle': VehicleDealerSerializer(vehicle, context=context).data,
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsDealer])
    def delete_gallery_image(self, request, pk=None):
        vehicle = self.get_object()
        image_id = request.data.get('image_id') or request.query_params.get('image_id')
        if not image_id:
            return Response(
                {'success': False, 'message': 'Missing image_id parameter.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            gallery_img = vehicle.gallery_images.get(id=image_id)
        except (VehicleImage.DoesNotExist, ValueError):
            return Response(
                {'success': False, 'message': 'Image does not exist or does not belong to this vehicle.'},
                status=status.HTTP_404_NOT_FOUND
            )

        was_primary = gallery_img.is_primary
        gallery_img.delete()

        # If deleted image was primary, designate next remaining image as primary if available
        if was_primary:
            remaining = vehicle.gallery_images.first()
            if remaining:
                remaining.is_primary = True
                remaining.save(update_fields=['is_primary'])
                vehicle.image = remaining.image
                vehicle.save(update_fields=['image'])
            else:
                vehicle.image = None
                vehicle.save(update_fields=['image'])

        context = {'request': request}
        return Response({
            'success': True,
            'message': 'Gallery image removed successfully.',
            'gallery_images': VehicleImageSerializer(vehicle.gallery_images.all(), many=True, context=context).data,
            'vehicle': VehicleDealerSerializer(vehicle, context=context).data,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsDealer])
    def set_primary_image(self, request, pk=None):
        vehicle = self.get_object()
        image_id = request.data.get('image_id')
        if not image_id:
            return Response(
                {'success': False, 'message': 'Missing image_id parameter.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            target_img = vehicle.gallery_images.get(id=image_id)
        except (VehicleImage.DoesNotExist, ValueError):
            return Response(
                {'success': False, 'message': 'Image does not exist or does not belong to this vehicle.'},
                status=status.HTTP_404_NOT_FOUND
            )

        with transaction.atomic():
            vehicle.gallery_images.filter(is_primary=True).update(is_primary=False)
            target_img.is_primary = True
            target_img.save(update_fields=['is_primary'])
            vehicle.image = target_img.image
            vehicle.save(update_fields=['image'])

        context = {'request': request}
        return Response({
            'success': True,
            'message': 'Primary image updated successfully.',
            'gallery_images': VehicleImageSerializer(vehicle.gallery_images.all(), many=True, context=context).data,
            'vehicle': VehicleDealerSerializer(vehicle, context=context).data,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsDealer])
    def reorder_gallery_images(self, request, pk=None):
        vehicle = self.get_object()
        order_list = request.data.get('order', [])
        if not isinstance(order_list, list):
            return Response(
                {'success': False, 'message': 'Invalid order list format. Expected array of image IDs.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            for idx, img_id in enumerate(order_list):
                vehicle.gallery_images.filter(id=img_id).update(order=idx)

        context = {'request': request}
        return Response({
            'success': True,
            'message': 'Gallery order updated successfully.',
            'gallery_images': VehicleImageSerializer(vehicle.gallery_images.all(), many=True, context=context).data,
        }, status=status.HTTP_200_OK)
