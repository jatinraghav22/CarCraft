from django.db import models


class Vehicle(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', 'Available'
        RESERVED = 'RESERVED', 'Reserved'
        SOLD = 'SOLD', 'Sold'
        UNAVAILABLE = 'UNAVAILABLE', 'Unavailable'

    class FuelType(models.TextChoices):
        PETROL = 'Petrol', 'Petrol'
        DIESEL = 'Diesel', 'Diesel'
        ELECTRIC = 'Electric', 'Electric'
        HYBRID = 'Hybrid', 'Hybrid'
        PLUG_IN_HYBRID = 'Plug-in Hybrid', 'Plug-in Hybrid'
        MILD_HYBRID = 'Mild Hybrid', 'Mild Hybrid'
        PURE_ELECTRIC = 'Pure Electric', 'Pure Electric'

    class TransmissionType(models.TextChoices):
        AUTOMATIC = 'Automatic', 'Automatic'
        MANUAL = 'Manual', 'Manual'
        SEMI_AUTOMATIC = 'Semi-Automatic', 'Semi-Automatic'
        DUAL_CLUTCH = 'Dual-Clutch', 'Dual-Clutch'
        DIRECT_DRIVE = 'Direct Drive', 'Direct Drive'

    class BodyType(models.TextChoices):
        SEDAN = 'Sedan', 'Sedan'
        SUV = 'SUV', 'SUV'
        COUPE = 'Coupe', 'Coupe'
        SUPERCAR = 'Supercar', 'Supercar'
        HATCHBACK = 'Hatchback', 'Hatchback'
        CONVERTIBLE = 'Convertible', 'Convertible'
        TRUCK = 'Truck', 'Truck'
        WAGON = 'Wagon', 'Wagon'

    brand = models.CharField(max_length=100, db_index=True)
    model = models.CharField(max_length=100, db_index=True)
    year = models.PositiveIntegerField(db_index=True)
    vin = models.CharField(max_length=50, blank=True, default='', db_index=True, help_text="Vehicle Identification Number / Chassis Number")
    
    # Selling price exposed to customers
    price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Customer Selling Price")
    
    # Strictly confidential - dealer internal cost
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Dealer Purchase Cost (Confidential)")

    fuel = models.CharField(max_length=30, choices=FuelType.choices, default=FuelType.PETROL, db_index=True)
    transmission = models.CharField(max_length=30, choices=TransmissionType.choices, default=TransmissionType.AUTOMATIC, db_index=True)
    mileage = models.PositiveIntegerField(default=0, help_text="Odometer reading in kilometers")
    body_type = models.CharField(max_length=30, choices=BodyType.choices, default=BodyType.SEDAN, db_index=True)
    
    engine = models.CharField(max_length=100, blank=True, default='')
    horsepower = models.PositiveIntegerField(default=0)
    torque = models.PositiveIntegerField(default=0, help_text="Torque in Nm")
    seats = models.PositiveIntegerField(default=5)
    top_speed = models.PositiveIntegerField(default=0, help_text="Top speed in km/h")
    color = models.CharField(max_length=50, blank=True, default='')
    
    description = models.TextField(blank=True, default='')
    features = models.JSONField(default=list, blank=True, help_text="List of vehicle feature strings")
    stock_quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE, db_index=True)
    
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True, max_length=500)
    image_url = models.URLField(max_length=1000, blank=True, default='', help_text="External image URL or fallback")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['brand', 'model']),
            models.Index(fields=['status', 'price']),
        ]

    def __str__(self):
        return f"{self.year} {self.brand} {self.model} ({self.status})"

    @property
    def potential_margin(self):
        """Dealer internal potential gross profit"""
        return self.price - self.purchase_cost


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='vehicles/gallery/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.vehicle}"
