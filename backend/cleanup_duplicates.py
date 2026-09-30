import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from vehicles.models import Vehicle
from services.models import TestDrive

def cleanup():
    print("=" * 60)
    print("CLEANING UP DUPLICATES, FIXING VINS, IMAGES & FLEET MARGINS")
    print("=" * 60)

    # 1. Fix Toyota Fortuner procurement cost typo (ID 5)
    fortuner = Vehicle.objects.filter(id=5).first()
    if fortuner and fortuner.purchase_cost > 10000000:
        print(f"Fixing Fortuner ID 5 purchase cost from {fortuner.purchase_cost} to 3900000.00")
        fortuner.purchase_cost = 3900000.00
        fortuner.save(update_fields=['purchase_cost'])

    # 2. Retain one primary BMW M4 Competition (e.g. ID 8 or ID 1) and clean up test duplicates (19, 20, 22, 24, 26)
    target_bmw = Vehicle.objects.filter(brand='BMW', model='M4 Competition').order_by('id').first()
    if not target_bmw:
        target_bmw = Vehicle.objects.filter(brand='BMW').first()

    if target_bmw:
        target_bmw.vin = 'WBA43AZ08FS98112'
        target_bmw.image_url = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
        target_bmw.save()
        print(f"Target retained BMW: ID={target_bmw.id} VIN={target_bmw.vin}")

        # Re-link any TestDrives pointing to duplicates
        duplicates = Vehicle.objects.filter(brand='BMW', model__icontains='M4').exclude(id=target_bmw.id)
        for dup in duplicates:
            # Reassign test drives before deleting duplicate
            TestDrive.objects.filter(vehicle=dup).update(vehicle=target_bmw)
            print(f"Deleting duplicate BMW ID {dup.id} (Price: {dup.price})")
            dup.delete()

    # 3. Ensure every vehicle has a unique valid VIN and high-quality image
    vin_map = {
        'Porsche': 'WP0AF2A97RS20491',
        'Ferrari': 'ZFF94NHA8P0281920',
        'Mercedes-AMG': 'WDD1903821A89201',
        'Audi': 'WAUZZZF27LN092182',
        'Toyota': 'MBJ11JJ510800192',
        'Mahindra': 'MA1TA2SK0091820',
    }

    img_map = {
        'BMW': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
        'Porsche': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
        'Ferrari': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
        'Mercedes-AMG': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
        'Audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
        'Toyota': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        'Mahindra': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
        'CARCRAFT': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    }

    for idx, v in enumerate(Vehicle.objects.all()):
        brand_key = v.brand.split()[0]
        if not v.vin:
            base_vin = vin_map.get(v.brand) or vin_map.get(brand_key)
            if base_vin and not Vehicle.objects.filter(vin=base_vin).exclude(id=v.id).exists():
                v.vin = base_vin
            else:
                brand_code = ''.join(c for c in v.brand if c.isalnum()).upper()[:3].ljust(3, 'X')
                v.vin = f"W{brand_code}{v.year}{str(v.id).padStart(4, '0') if hasattr(str(v.id), 'padStart') else str(v.id).zfill(4)}CC"
        
        if not v.image_url or 'carcraft-image-fallback.svg' in v.image_url or not v.image:
            fallback = img_map.get(v.brand) or img_map.get(brand_key) or img_map['CARCRAFT']
            if not v.image_url:
                v.image_url = fallback
        
        v.save()
        print(f"Vehicle #{v.id}: {v.brand} {v.model} | VIN: {v.vin} | Price: INR {v.price} | Cost: INR {v.purchase_cost} | Margin: INR {v.price - v.purchase_cost}")

    print("\nSUMMARY STATS:")
    total = Vehicle.objects.count()
    total_val = sum(v.price * v.stock_quantity for v in Vehicle.objects.all())
    total_cost = sum(v.purchase_cost * v.stock_quantity for v in Vehicle.objects.all())
    gross_margin = total_val - total_cost
    print(f"Total Fleet: {total} Units")
    print(f"Total Valuation: INR {total_val}")
    print(f"Total Procurement Cost: INR {total_cost}")
    print(f"Projected Gross Margin: INR {gross_margin}")
    print("=" * 60)

if __name__ == '__main__':
    cleanup()
