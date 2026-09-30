import os, sys, django
sys.path.insert(0, r'c:\Users\jatin\HCL Project\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from vehicles.models import Vehicle

vehicles_data = [
    {
        'brand': 'CARCRAFT',
        'model': 'Apex GT-R',
        'year': 2026,
        'price': 28500000.00,
        'purchase_cost': 21000000.00,
        'fuel': 'Pure Electric',
        'transmission': 'Direct Drive',
        'mileage': 420,
        'body_type': 'Supercar',
        'engine': 'Quad Liquid-Cooled Axial Flux Motors',
        'horsepower': 1280,
        'torque': 1420,
        'seats': 2,
        'top_speed': 380,
        'color': 'Acid Lime Metallic',
        'description': 'Carbon Monocoque Quad-Motor Electric Hypercar with active aero.',
        'features': [
            'Quad-Motor Vectoring with 1,280 Horsepower Output',
            '118 kWh Liquid-Cooled 800V Ultra-Fast Architecture',
            'Carbon-Ceramic 420mm Discs with 10-Piston Calipers',
            'AR Head-Up Display with Track Telemetry Overlay'
        ],
        'stock_quantity': 3,
        'status': 'AVAILABLE',
        'image_url': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    },
    {
        'brand': 'CARCRAFT',
        'model': 'Spectre EV-7',
        'year': 2026,
        'price': 14200000.00,
        'purchase_cost': 10500000.00,
        'fuel': 'Pure Electric',
        'transmission': 'Direct Drive',
        'mileage': 510,
        'body_type': 'Sedan',
        'engine': 'Dual Permanent Magnet Synchronous Motors',
        'horsepower': 780,
        'torque': 980,
        'seats': 5,
        'top_speed': 298,
        'color': 'Obsidian Midnight',
        'description': 'Ultra-Luxury Grand Touring Aerodynamic Sedan with Level 3 autonomous navigation.',
        'features': [
            '510-Mile Long-Range Solid-State Hybrid Pack',
            'Dual-Chamber Adaptive Air Suspension with Road Preview',
            'Executive Rear Lounge with Massaging Climate Seats',
            '23-Speaker 1,400W Immersive Spatial Audio System'
        ],
        'stock_quantity': 5,
        'status': 'AVAILABLE',
        'image_url': 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80'
    },
    {
        'brand': 'CARCRAFT',
        'model': 'Veloce Corse',
        'year': 2026,
        'price': 34000000.00,
        'purchase_cost': 26000000.00,
        'fuel': 'Hybrid',
        'transmission': 'Dual-Clutch',
        'mileage': 1500,
        'body_type': 'Coupe',
        'engine': '4.0L Flat-Plane Crank Twin-Turbo V8 + F1 Axial Flux MGU',
        'horsepower': 1050,
        'torque': 1120,
        'seats': 2,
        'top_speed': 350,
        'color': 'Rosso Corsa Racing',
        'description': 'Twin-Turbo V8 Hybrid Track Weapon with active aero dual-wing deck.',
        'features': [
            '8,800 RPM 4.0L Twin-Turbo Flat-Plane V8 with MGU Boost',
            'Inconel 625 Center-Exit Active Valved Racing Exhaust',
            'Pushrod Inboard Multimatic DSSV Spool-Valve Dampers',
            'Center-Lock Monoblock Forged Magnesium Wheels'
        ],
        'stock_quantity': 2,
        'status': 'AVAILABLE',
        'image_url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    },
    {
        'brand': 'CARCRAFT',
        'model': 'Horizon X-Cross',
        'year': 2026,
        'price': 16800000.00,
        'purchase_cost': 12800000.00,
        'fuel': 'Hybrid',
        'transmission': 'Automatic',
        'mileage': 2500,
        'body_type': 'SUV',
        'engine': '4.4L Twin-Turbo V8 with 48V Mild-Hybrid Supercharger',
        'horsepower': 720,
        'torque': 900,
        'seats': 5,
        'top_speed': 305,
        'color': 'Satin Dakar Sand',
        'description': 'High-Performance All-Terrain Super SUV with triple locking differentials.',
        'features': [
            'Variable Air Suspension with 180mm to 285mm Ground Clearance',
            'Triple Electronic Locking Differential with Terrain Modes',
            '23-inch Forged Alloy Wheels with Pirelli Rubber',
            'Panoramic Starlight Headliner'
        ],
        'stock_quantity': 4,
        'status': 'AVAILABLE',
        'image_url': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    },
    {
        'brand': 'Ferrari',
        'model': 'SF90 Stradale',
        'year': 2026,
        'price': 75000000.00,
        'purchase_cost': 62000000.00,
        'fuel': 'Plug-in Hybrid',
        'transmission': 'Dual-Clutch',
        'mileage': 800,
        'body_type': 'Supercar',
        'engine': '4.0L Twin-Turbo V8 with 3 Electric Motors',
        'horsepower': 986,
        'torque': 800,
        'seats': 2,
        'top_speed': 340,
        'color': 'Giallo Modena Yellow',
        'description': 'Flagship Maranello plug-in hybrid supercar with e-4WD traction.',
        'features': [
            'RAC-e Electric Front Axle with Dynamic Torque Vectoring',
            'Carbon Fiber Engine Bay and Rear Diffuser',
            'Head-Up Display with Digital Touch Cockpit'
        ],
        'stock_quantity': 1,
        'status': 'AVAILABLE',
        'image_url': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80'
    }
]

created_count = 0
for v_data in vehicles_data:
    v, created = Vehicle.objects.get_or_create(
        brand=v_data['brand'],
        model=v_data['model'],
        defaults=v_data
    )
    if created:
        created_count += 1
        print(f"Created: {v.brand} {v.model} (ID: {v.id})")
    else:
        # Update image_url if empty
        if not v.image and not v.image_url and v_data.get('image_url'):
            v.image_url = v_data['image_url']
            v.save(update_fields=['image_url'])
        print(f"Already exists: {v.brand} {v.model} (ID: {v.id})")

print(f"\nSeeding complete! Added {created_count} vehicles. Total vehicles in DB: {Vehicle.objects.count()}")
