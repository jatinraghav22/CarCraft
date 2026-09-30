import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from parts.models import Part, PartCategory

# Comprehensive parts catalog with actual physical component images
PARTS_DATA = [
    {
        'sku': 'BRM-GT-6P-001',
        'name': 'Brembo GT Carbon-Ceramic 6-Piston Brake Kit',
        'brand': 'Brembo Motorsport',
        'category': PartCategory.BRAKES,
        'description': 'Forged 6-piston front calipers paired with 400mm carbon-ceramic drilled rotors. Engineered for zero thermal fade under extreme circuit conditions.',
        'purchase_cost': 450000.00,
        'selling_price': 650000.00,
        'stock_quantity': 12,
        'minimum_stock': 4,
        'image': 'parts/brakes_rotor_caliper.jpg',
        'compatibility': 'Porsche 911 GT3, BMW M3/M4, CARCRAFT Apex GT-R, Universal 5x112/5x130',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'MICH-PS4S-275',
        'name': 'Michelin Pilot Sport Cup 2 R Semi-Slick Tyres (Set of 4)',
        'brand': 'Michelin',
        'category': PartCategory.WHEELS,
        'description': 'Road-legal semi-slick competition rubber offering up to 1.8G lateral grip and razor-sharp steering turn-in response.',
        'purchase_cost': 160000.00,
        'selling_price': 225000.00,
        'stock_quantity': 16,
        'minimum_stock': 6,
        'image': 'parts/tyre_michelin_cup2.jpg',
        'compatibility': '265/35 ZR21 Front, 325/30 ZR21 Rear, All 21-inch Performance Wheels',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'AKR-EVO-TIT-09',
        'name': 'Akrapovic Evolution Titanium Exhaust System',
        'brand': 'Akrapovic',
        'category': PartCategory.EXHAUST,
        'description': 'Ultra-lightweight titanium and Inconel active valved exhaust with quad pre-preg carbon tips. Saves 22.4 kg and adds +38 BHP.',
        'purchase_cost': 480000.00,
        'selling_price': 690000.00,
        'stock_quantity': 5,
        'minimum_stock': 2,
        'image': 'parts/exhaust_titanium_akrapovic.jpg',
        'compatibility': 'Porsche 911 GT3 RS (992), Ferrari 296 GTB, McLaren 750S, CARCRAFT Veloce',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'BIL-B16-COIL',
        'name': 'Bilstein B16 PSS10 Height & Damping Adjustable Coilovers',
        'brand': 'Bilstein',
        'category': PartCategory.SUSPENSION,
        'description': 'Inverted mono-tube technology with 10-stage parallel damping clickers and cold-wound performance springs.',
        'purchase_cost': 260000.00,
        'selling_price': 365000.00,
        'stock_quantity': 8,
        'minimum_stock': 3,
        'image': 'parts/suspension_coilover.jpg',
        'compatibility': 'BMW M3/M4 (G80/G82), Porsche 911 (991/992), CARCRAFT Apex GT-R',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CAS-EDGE-5W40',
        'name': 'Castrol EDGE 5W-40 Advanced Full Synthetic Engine Oil (5L)',
        'brand': 'Castrol',
        'category': PartCategory.SERVICE,
        'description': 'Fluid TITANIUM technology transforms structure under extreme pressure to reduce friction by 20% across high-revving turbo engines.',
        'purchase_cost': 2800.00,
        'selling_price': 4200.00,
        'stock_quantity': 65,
        'minimum_stock': 15,
        'image': 'parts/fluids_engine_oil.jpg',
        'compatibility': 'Universal High-Performance Gasoline & Diesel Engines, API SP/SN Plus, ACEA A3/B4',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'BOS-AERO-2619',
        'name': 'Bosch Aerotwin Premium Wiper Blade Set',
        'brand': 'Bosch',
        'category': PartCategory.OTHER,
        'description': 'Dual-rubber compound with Power Protection Plus coating for streak-free, whisper-quiet wiping at high aerodynamic speeds.',
        'purchase_cost': 1200.00,
        'selling_price': 1950.00,
        'stock_quantity': 42,
        'minimum_stock': 10,
        'image': 'parts/maintenance_wiper_blades.jpg',
        'compatibility': 'Universal Hook & Top-Lock Fitment (26" Driver / 19" Passenger)',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-TURBO-01',
        'name': 'Dual Stage Ball-Bearing Turbocharger Upgrade',
        'brand': 'Garrett Motorsport',
        'category': PartCategory.ENGINE,
        'description': 'Point-milled billet titanium compressor wheel with ceramic ball bearings. Supports sustained boost for up to 1,050 BHP.',
        'purchase_cost': 290000.00,
        'selling_price': 395000.00,
        'stock_quantity': 7,
        'minimum_stock': 2,
        'image': 'parts/turbocharger_billet.jpg',
        'compatibility': 'CARCRAFT Veloce Corse, Ferrari 296 GTB, 3.0L-4.4L Twin-Scroll V6 / V8 Platforms',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-WHL-2101',
        'name': 'Monoblock Forged Aero-Turbine 21" Center-Lock Wheels',
        'brand': 'BBS Motorsport',
        'category': PartCategory.WHEELS,
        'description': 'Aerospace 6061-T6 forged monoblock alloy with directional aero cooling vanes. Weighs only 8.9 kg per corner.',
        'purchase_cost': 370000.00,
        'selling_price': 490000.00,
        'stock_quantity': 6,
        'minimum_stock': 2,
        'image': 'parts/wheel_forged_turbofan.jpg',
        'compatibility': 'CARCRAFT Apex GT-R, Porsche Taycan, 911 Turbo, Universal 5x112/5x130',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-AERO-SPLIT',
        'name': 'Pre-Preg Dry Carbon Aerodynamic Front Splitter',
        'brand': 'CARCRAFT Performance',
        'category': PartCategory.EXTERIOR,
        'description': 'Autoclave-cured 2x2 twill carbon splitter with integrated venturi canards. Delivers 110 kg downforce at 155 mph.',
        'purchase_cost': 160000.00,
        'selling_price': 245000.00,
        'stock_quantity': 9,
        'minimum_stock': 3,
        'image': 'parts/aerodynamics_carbon_splitter.jpg',
        'compatibility': 'CARCRAFT Apex GT-R, CARCRAFT Spectre EV-7, Universal Track Splitter Fitments',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-AERO-WING',
        'name': 'Active Swan-Neck Dual-Element Carbon Rear Wing',
        'brand': 'CARCRAFT Performance',
        'category': PartCategory.EXTERIOR,
        'description': 'High-downforce swan-neck rear wing with motorized DRS angle-of-attack actuator (0° to 28° deployment).',
        'purchase_cost': 280000.00,
        'selling_price': 420000.00,
        'stock_quantity': 4,
        'minimum_stock': 2,
        'image': 'parts/aerodynamics_gt_wing.jpg',
        'compatibility': 'CARCRAFT Apex GT-R, CARCRAFT Veloce Corse, Universal Coupe Chassis Mount',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-INT-STRG',
        'name': 'Alcantara Racing Steering Wheel with Mode Dials',
        'brand': 'CARCRAFT Bespoke',
        'category': PartCategory.INTERIOR,
        'description': 'Flat-bottom motorsport wheel wrapped in genuine Alcantara with acid-lime 12 o\'clock stripe and dry carbon center spokes.',
        'purchase_cost': 115000.00,
        'selling_price': 175000.00,
        'stock_quantity': 11,
        'minimum_stock': 3,
        'image': 'parts/interior_racing_steering_wheel.jpg',
        'compatibility': 'CARCRAFT Apex GT-R, CARCRAFT Veloce Corse, Universal Boss Adapter',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-INT-PADDLE',
        'name': 'CNC Carbon Magnetic Paddle Shifter Set',
        'brand': 'CARCRAFT Atelier',
        'category': PartCategory.INTERIOR,
        'description': 'Dry carbon magnetic microswitch paddle shifters for tactile, instant shift engagement on track.',
        'purchase_cost': 45000.00,
        'selling_price': 68000.00,
        'stock_quantity': 18,
        'minimum_stock': 5,
        'image': 'parts/interior_paddle_shifters.jpg',
        'compatibility': 'BMW M Steptronic, Porsche PDK, CARCRAFT Dual-Clutch Steering Wheels',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-ENG-INTAKE',
        'name': 'Eventuri Carbon Fiber High-Flow Intake Suite',
        'brand': 'Eventuri Motorsport',
        'category': PartCategory.ENGINE,
        'description': 'Dry carbon aerodynamic velocity intake housing with high-flow washable synthetic filters. Dyno tested +24 HP.',
        'purchase_cost': 180000.00,
        'selling_price': 265000.00,
        'stock_quantity': 6,
        'minimum_stock': 2,
        'image': 'parts/performance_carbon_intake.jpg',
        'compatibility': 'BMW M3/M4 G8X, Audi RS4/RS5, Mercedes-AMG GT, CARCRAFT Fleet',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-ELEC-TLM',
        'name': 'Pro 25Hz Racing Telemetry & CAN-bus Logger',
        'brand': 'AiM Motorsport',
        'category': PartCategory.ELECTRICAL,
        'description': 'Multi-constellation 25Hz GPS receiver with 16-channel CAN bus datalogger and smartphone wireless telemetry sync.',
        'purchase_cost': 85000.00,
        'selling_price': 135000.00,
        'stock_quantity': 14,
        'minimum_stock': 4,
        'image': 'parts/telemetry_display_module.jpg',
        'compatibility': 'Universal OBD-II / CAN-bus (All Modern Sports Cars & CARCRAFT Fleet)',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-LGT-LASER',
        'name': 'Adaptive Laser Matrix LED Headlight Units',
        'brand': 'Hella Automotive',
        'category': PartCategory.ELECTRICAL,
        'description': '600-meter range laser diode projectors with 84-pixel adaptive anti-dazzle matrix shielding and dynamic acid-lime DRLs.',
        'purchase_cost': 210000.00,
        'selling_price': 310000.00,
        'stock_quantity': 5,
        'minimum_stock': 2,
        'image': 'parts/lighting_matrix_headlight.jpg',
        'compatibility': 'CARCRAFT Spectre EV-7, CARCRAFT Apex GT-R, Direct OE LED Harnesses',
        'status': Part.Status.AVAILABLE,
    },
    {
        'sku': 'CC-CARE-CERAMIC',
        'name': 'Graphene Ceramic Nanotech Protective Coating Kit',
        'brand': 'Gyeon Quartz',
        'category': PartCategory.OTHER,
        'description': 'Reduced graphene oxide 10H hardness surface protection with 118° superhydrophobic water contact angle.',
        'purchase_cost': 14000.00,
        'selling_price': 26000.00,
        'stock_quantity': 35,
        'minimum_stock': 8,
        'image': 'parts/care_ceramic_detailing.jpg',
        'compatibility': 'Universal Automotive Paintwork, Clearcoat, PPF, Wraps, Wheels & Carbon',
        'status': Part.Status.AVAILABLE,
    }
]

updated_count = 0
created_count = 0

for item in PARTS_DATA:
    sku = item['sku']
    part = Part.objects.filter(sku=sku).first()
    if part:
        part.name = item['name']
        part.brand = item['brand']
        part.category = item['category']
        part.description = item['description']
        part.purchase_cost = item['purchase_cost']
        part.selling_price = item['selling_price']
        part.stock_quantity = item['stock_quantity']
        part.minimum_stock = item['minimum_stock']
        part.image = item['image']
        part.compatibility = item['compatibility']
        part.status = item['status']
        part.save()
        updated_count += 1
        print(f"Updated Part: {part.sku} -> {part.name} (IMG: {part.image})")
    else:
        part = Part.objects.create(**item)
        created_count += 1
        print(f"Created Part: {part.sku} -> {part.name} (IMG: {part.image})")

print(f"\nDone! Updated: {updated_count}, Created: {created_count}. Total parts in DB: {Part.objects.count()}")
