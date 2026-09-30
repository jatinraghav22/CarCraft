from rest_framework import serializers
from .models import Vehicle, VehicleImage


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'is_primary', 'created_at']


class VehicleCustomerSerializer(serializers.ModelSerializer):
    """
    Public customer-facing vehicle serializer.
    STRICTLY excludes purchase_cost, supplier cost, and internal profit margins.
    """
    gallery_images = VehicleImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'brand',
            'model',
            'year',
            'vin',
            'price',
            'fuel',
            'transmission',
            'mileage',
            'body_type',
            'engine',
            'horsepower',
            'torque',
            'seats',
            'top_speed',
            'color',
            'description',
            'features',
            'stock_quantity',
            'status',
            'image',
            'image_url',
            'gallery_images',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or ''


class VehicleDealerSerializer(serializers.ModelSerializer):
    """
    Private dealer vehicle serializer.
    Includes purchase_cost and potential_margin.
    Supports file uploads via multipart/form-data as well as image URLs.
    """
    gallery_images = VehicleImageSerializer(many=True, read_only=True)
    potential_margin = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'brand',
            'model',
            'year',
            'vin',
            'price',
            'purchase_cost',
            'potential_margin',
            'fuel',
            'transmission',
            'mileage',
            'body_type',
            'engine',
            'horsepower',
            'torque',
            'seats',
            'top_speed',
            'color',
            'description',
            'features',
            'stock_quantity',
            'status',
            'image',
            'image_url',
            'gallery_images',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'potential_margin', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Gracefully handle string in image field (URL or empty string)
        mutable_data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Normalize status
        status_val = mutable_data.get('status')
        if status_val and isinstance(status_val, str):
            status_map = {
                'available': 'AVAILABLE',
                'reserved': 'RESERVED',
                'sold': 'SOLD',
                'unavailable': 'UNAVAILABLE',
            }
            mutable_data['status'] = status_map.get(status_val.strip().lower(), status_val.upper())

        # Normalize fuel
        if 'fuel' in mutable_data and isinstance(mutable_data['fuel'], str):
            fuel_map = {
                'electric': 'Electric',
                'pure electric': 'Pure Electric',
                'petrol': 'Petrol',
                'gasoline': 'Petrol',
                'diesel': 'Diesel',
                'hybrid': 'Hybrid',
                'plug-in hybrid': 'Plug-in Hybrid',
                'mild hybrid': 'Mild Hybrid',
            }
            mutable_data['fuel'] = fuel_map.get(mutable_data['fuel'].strip().lower(), mutable_data['fuel'])

        # Normalize transmission
        if 'transmission' in mutable_data and isinstance(mutable_data['transmission'], str):
            trans_map = {
                'automatic': 'Automatic',
                '8-speed automatic': 'Automatic',
                'direct drive': 'Direct Drive',
                'dual-clutch': 'Dual-Clutch',
                '7-speed dual-clutch': 'Dual-Clutch',
                'manual': 'Manual',
                '6-speed manual': 'Manual',
                'semi-automatic': 'Semi-Automatic',
            }
            mutable_data['transmission'] = trans_map.get(mutable_data['transmission'].strip().lower(), mutable_data['transmission'])

        # Normalize body_type
        if 'body_type' in mutable_data and isinstance(mutable_data['body_type'], str):
            body_map = {
                'supercar': 'Supercar',
                'coupe': 'Coupe',
                'sedan': 'Sedan',
                'suv': 'SUV',
                'performance suv': 'SUV',
                'convertible': 'Convertible',
                'hatchback': 'Hatchback',
                'truck': 'Truck',
                'wagon': 'Wagon',
            }
            mutable_data['body_type'] = body_map.get(mutable_data['body_type'].strip().lower(), mutable_data['body_type'])

        # Ensure purchase_cost has a numeric default if empty
        if not mutable_data.get('purchase_cost') and not self.instance:
            mutable_data['purchase_cost'] = 0.0

        # Ensure VIN is present on creation; preserve on update
        if not self.instance:
            vin_val = mutable_data.get('vin')
            if not vin_val or not str(vin_val).strip():
                import random, string
                brand_clean = ''.join(c for c in (mutable_data.get('brand') or 'CAR') if c.isalnum()).upper()[:3].ljust(3, 'X')
                suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=11))
                mutable_data['vin'] = f"W{brand_clean}{suffix}"
        else:
            if 'vin' in mutable_data:
                vin_val = mutable_data.get('vin')
                if not vin_val or not str(vin_val).strip():
                    if self.instance.vin:
                        mutable_data['vin'] = self.instance.vin
                    else:
                        import random, string
                        brand_clean = ''.join(c for c in (mutable_data.get('brand') or self.instance.brand or 'CAR') if c.isalnum()).upper()[:3].ljust(3, 'X')
                        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=11))
                        mutable_data['vin'] = f"W{brand_clean}{suffix}"

        img_val = mutable_data.get('image')
        if isinstance(img_val, str):
            if img_val.startswith('http://') or img_val.startswith('https://') or img_val.startswith('/'):
                mutable_data['image_url'] = img_val
            # Remove string from image field so ImageField doesn't reject it as invalid file
            mutable_data.pop('image', None)
        return super().to_internal_value(mutable_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ensure image representation outputs full media URL or external image_url
        if instance.image:
            request = self.context.get('request')
            if request:
                ret['image'] = request.build_absolute_uri(instance.image.url)
            else:
                ret['image'] = instance.image.url
        elif instance.image_url:
            ret['image'] = instance.image_url
        else:
            ret['image'] = ''
        return ret

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Selling price must be greater than zero.")
        return value

    def validate_purchase_cost(self, value):
        if value < 0:
            raise serializers.ValidationError("Purchase cost cannot be negative.")
        return value

    def validate_vin(self, value):
        if value and str(value).strip():
            qs = Vehicle.objects.filter(vin__iexact=str(value).strip())
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError(f"A vehicle with VIN '{value}' is already registered in inventory.")
        return value
