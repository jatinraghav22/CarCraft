from datetime import date, time, timedelta
from decimal import Decimal
import uuid
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User, CustomerProfile, DealerProfile
from vehicles.models import Vehicle
from parts.models import Part
from orders.models import Order, OrderItem, Payment, Cart, CartItem, Wishlist, WishlistItem
from services.models import ServiceAppointment, TestDrive
from inventory.models import InventoryTransaction
from sales.models import Sale
from expenses.models import Expense, ExpenseCategory



class Command(BaseCommand):
    help = 'Populates the CarCraft platform with comprehensive realistic demo data.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding CarCraft Platform Data..."))

        # 1. Dealer User
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@carcraft.com',
                'first_name': 'CarCraft',
                'last_name': 'Dealer HQ',
                'role': User.Role.DEALER,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        DealerProfile.objects.get_or_create(user=admin_user, defaults={'dealership_name': 'CarCraft Performance Motors HQ'})

        # 2. Customers
        customers_data = [
            {'username': 'jatin', 'email': 'jatin@carcraft.com', 'first': 'Jatin', 'last': 'Raghav', 'phone': '9876543210', 'city': 'New Delhi'},
            {'username': 'rohit', 'email': 'rohit@example.com', 'first': 'Rohit', 'last': 'Verma', 'phone': '9811223344', 'city': 'Mumbai'},
            {'username': 'ananya', 'email': 'ananya@example.com', 'first': 'Ananya', 'last': 'Sen', 'phone': '9899001122', 'city': 'Bangalore'},
        ]
        customers = []
        for c in customers_data:
            u, created = User.objects.get_or_create(
                username=c['username'],
                defaults={
                    'email': c['email'],
                    'first_name': c['first'],
                    'last_name': c['last'],
                    'phone': c['phone'],
                    'role': User.Role.CUSTOMER,
                }
            )
            if created:
                u.set_password('Customer@123')
                u.save()
            CustomerProfile.objects.get_or_create(user=u, defaults={'city': c['city'], 'address': f"Block A, {c['city']}"})
            customers.append(u)

        # 3. Vehicles
        vehicles_data = [
            {
                'brand': 'BMW', 'model': 'M4 Competition Coupé', 'year': 2025,
                'price': Decimal('14500000.00'), 'purchase_cost': Decimal('12200000.00'),
                'fuel': Vehicle.FuelType.PETROL, 'transmission': Vehicle.TransmissionType.AUTOMATIC,
                'mileage': 4500, 'body_type': Vehicle.BodyType.COUPE, 'engine': '3.0L M TwinPower Turbo Inline-6',
                'horsepower': 503, 'torque': 650, 'seats': 4, 'top_speed': 290, 'color': 'Isle of Man Green',
                'description': 'Pristine condition BMW M4 Competition with carbon exterior package and M Sport exhaust.',
                'features': ['Carbon Bucket Seats', 'M Carbon Ceramic Brakes', 'Harman Kardon Audio', 'Head-Up Display', 'Laserlight'],
                'stock_quantity': 2, 'status': Vehicle.Status.AVAILABLE
            },
            {
                'brand': 'Porsche', 'model': '911 GT3 (992)', 'year': 2025,
                'price': Decimal('27500000.00'), 'purchase_cost': Decimal('23400000.00'),
                'fuel': Vehicle.FuelType.PETROL, 'transmission': Vehicle.TransmissionType.AUTOMATIC,
                'mileage': 1200, 'body_type': Vehicle.BodyType.COUPE, 'engine': '4.0L Naturally Aspirated Boxer-6',
                'horsepower': 502, 'torque': 470, 'seats': 2, 'top_speed': 318, 'color': 'Shark Blue',
                'description': 'Swan-neck rear wing aerodynamic package, PDK dual-clutch transmission, front axle lift.',
                'features': ['Club Sport Package', 'Chrono Package', 'Front Axle Lift', 'Sport Exhaust', 'Ceramic Brakes (PCCB)'],
                'stock_quantity': 1, 'status': Vehicle.Status.AVAILABLE
            },
            {
                'brand': 'Audi', 'model': 'RS6 Avant Performance', 'year': 2025,
                'price': Decimal('19200000.00'), 'purchase_cost': Decimal('16500000.00'),
                'fuel': Vehicle.FuelType.PETROL, 'transmission': Vehicle.TransmissionType.AUTOMATIC,
                'mileage': 8200, 'body_type': Vehicle.BodyType.WAGON, 'engine': '4.0L Twin-Turbocharged V8 MHEV',
                'horsepower': 621, 'torque': 850, 'seats': 5, 'top_speed': 305, 'color': 'Nardo Grey',
                'description': 'The ultimate supercar wagon. Bang & Olufsen 3D Advanced sound, quattro all-wheel drive.',
                'features': ['Dynamic Ride Control', 'Night Vision Assistant', 'Panoramic Sunroof', 'Quattro Sport Diff'],
                'stock_quantity': 1, 'status': Vehicle.Status.RESERVED
            },
            {
                'brand': 'Mercedes-AMG', 'model': 'GT 63 S E Performance', 'year': 2024,
                'price': Decimal('23500000.00'), 'purchase_cost': Decimal('19800000.00'),
                'fuel': Vehicle.FuelType.HYBRID, 'transmission': Vehicle.TransmissionType.AUTOMATIC,
                'mileage': 3100, 'body_type': Vehicle.BodyType.SEDAN, 'engine': '4.0L V8 Biturbo + Electric Motor',
                'horsepower': 831, 'torque': 1400, 'seats': 4, 'top_speed': 316, 'color': 'Magno Selenite Grey',
                'description': 'Hyper-sedan with 1,400 Nm torque. Burmester High-End 3D, carbon interior trim.',
                'features': ['AMG RIDE CONTROL+', 'Rear-Axle Steering', 'AMG Ceramic High-Performance Brakes'],
                'stock_quantity': 1, 'status': Vehicle.Status.AVAILABLE
            },
            {
                'brand': 'Toyota', 'model': 'Fortuner Legender 4x4', 'year': 2025,
                'price': Decimal('4800000.00'), 'purchase_cost': Decimal('41500000.00'),
                'fuel': Vehicle.FuelType.DIESEL, 'transmission': Vehicle.TransmissionType.AUTOMATIC,
                'mileage': 11000, 'body_type': Vehicle.BodyType.SUV, 'engine': '2.8L Turbo Diesel',
                'horsepower': 201, 'torque': 500, 'seats': 7, 'top_speed': 190, 'color': 'Pearl White / Black Roof',
                'description': 'Legendary durability with 4x4 electronic shift and dual-tone premium interior.',
                'features': ['JBL 11-Speaker Audio', 'Ventilated Front Seats', 'Wireless Phone Charger', 'Power Tailgate'],
                'stock_quantity': 3, 'status': Vehicle.Status.AVAILABLE
            },
        ]
        vehicles = []
        for v in vehicles_data:
            veh, _ = Vehicle.objects.get_or_create(brand=v['brand'], model=v['model'], defaults=v)
            vehicles.append(veh)

        # 4. Parts & Accessories
        parts_data = [
            {
                'name': 'Brembo GT Carbon-Ceramic 6-Piston Brake Kit', 'sku': 'BRM-GT-6P-001',
                'brand': 'Brembo', 'category': 'Brakes', 'selling_price': Decimal('345000.00'), 'purchase_cost': Decimal('240000.00'),
                'stock_quantity': 12, 'minimum_stock': 3, 'compatibility': 'BMW M3/M4, Porsche 911, Audi RS6',
                'description': 'High-performance 380mm vented drilled rotors with 6-piston monobloc calipers.'
            },
            {
                'name': 'Michelin Pilot Sport 4S (275/35 ZR19)', 'sku': 'MICH-PS4S-275',
                'brand': 'Michelin', 'category': 'Wheels & Tires', 'selling_price': Decimal('38000.00'), 'purchase_cost': Decimal('27000.00'),
                'stock_quantity': 24, 'minimum_stock': 8, 'compatibility': 'Universal High Performance',
                'description': 'Ultra-high performance street and track summer radial tire.'
            },
            {
                'name': 'Akrapovic Evolution Titanium Exhaust System', 'sku': 'AKR-EVO-TIT-09',
                'brand': 'Akrapovic', 'category': 'Exhaust System', 'selling_price': Decimal('490000.00'), 'purchase_cost': Decimal('360000.00'),
                'stock_quantity': 4, 'minimum_stock': 2, 'compatibility': 'BMW M3 G80 / M4 G82',
                'description': 'Weight-saving titanium construction with carbon fiber quad tips and dynamic valves.'
            },
            {
                'name': 'Bilstein B16 PSS10 Height & Damping Adjustable Coilovers', 'sku': 'BIL-B16-COIL',
                'brand': 'Bilstein', 'category': 'Suspension', 'selling_price': Decimal('215000.00'), 'purchase_cost': Decimal('155000.00'),
                'stock_quantity': 7, 'minimum_stock': 2, 'compatibility': 'BMW 3/4 Series, Audi A4/S4',
                'description': '10-stage parallel damping adjustment for ultimate track-to-street versatility.'
            },
            {
                'name': 'Castrol EDGE 5W-40 Advanced Full Synthetic Engine Oil (5L)', 'sku': 'CAS-EDGE-5W40',
                'brand': 'Castrol', 'category': 'Fluids & Filters', 'selling_price': Decimal('4500.00'), 'purchase_cost': Decimal('2800.00'),
                'stock_quantity': 50, 'minimum_stock': 15, 'compatibility': 'Universal Petrol & Diesel Engines',
                'description': 'Fluid TITANIUM Technology provides maximum engine strength under extreme pressures.'
            },
            {
                'name': 'Bosch Aerotwin Premium Wiper Blade Set', 'sku': 'BOS-AERO-2619',
                'brand': 'Bosch', 'category': 'Other Accessories', 'selling_price': Decimal('2800.00'), 'purchase_cost': Decimal('1400.00'),
                'stock_quantity': 2, 'minimum_stock': 5, 'compatibility': 'Universal fit for modern windshields',
                'description': 'Aerodynamic spoiler design for whisper-quiet wiping at high motorway speeds.'
            },
        ]
        parts = []
        for p in parts_data:
            part_obj, _ = Part.objects.get_or_create(sku=p['sku'], defaults=p)
            parts.append(part_obj)

        # 5. Service Appointments
        ServiceAppointment.objects.get_or_create(
            customer=customers[0],
            preferred_date=date.today() + timedelta(days=2),
            preferred_time=time(10, 30),
            defaults={
                'vehicle': vehicles[0],
                'service_type': 'Brake Service & Replacement',
                'description': 'Install Brembo brake pads and inspect brake lines.',
                'estimated_cost': Decimal('15000.00'),
                'status': ServiceAppointment.Status.APPROVED,
                'dealer_notes': 'Brake technicians assigned to Bay 3.'
            }
        )
        ServiceAppointment.objects.get_or_create(
            customer=customers[1],
            preferred_date=date.today() + timedelta(days=4),
            preferred_time=time(14, 0),
            defaults={
                'custom_vehicle': 'Mercedes C300d',
                'service_type': 'Oil & Filter Change',
                'description': 'Scheduled 20,000km periodic service.',
                'estimated_cost': Decimal('12000.00'),
                'status': ServiceAppointment.Status.PENDING,
            }
        )

        # 6. Test Drives
        TestDrive.objects.get_or_create(
            customer=customers[0],
            vehicle=vehicles[1],
            preferred_date=date.today() + timedelta(days=1),
            preferred_time=time(11, 0),
            defaults={
                'phone': customers[0].phone,
                'notes': 'Interested in track pack options.',
                'status': TestDrive.Status.APPROVED,
                'dealer_notes': 'Confirmed with client. Test car prepped.'
            }
        )

        # 7. Orders & Cart
        cart, _ = Cart.objects.get_or_create(user=customers[0])
        CartItem.objects.get_or_create(cart=cart, part=parts[1], defaults={'quantity': 2})

        wishlist, _ = Wishlist.objects.get_or_create(user=customers[0])
        WishlistItem.objects.get_or_create(wishlist=wishlist, vehicle=vehicles[0])
        WishlistItem.objects.get_or_create(wishlist=wishlist, part=parts[2])

        # Completed Order
        order_num = "CC-DEMO-001"
        if not Order.objects.filter(order_number=order_num).exists():
            order = Order.objects.create(
                customer=customers[0],
                order_number=order_num,
                status=Order.Status.DELIVERED,
                subtotal=Decimal('383500.00'),
                tax=Decimal('19175.00'),
                total_amount=Decimal('402675.00'),
                payment_status=Order.PaymentStatus.PAID,
                shipping_address='Banail Post, Bulandshahr, UP',
                shipping_city='Bulandshahr',
                shipping_state='Uttar Pradesh',
                shipping_postal_code='203394',
            )
            OrderItem.objects.create(order=order, part=parts[0], quantity=1, unit_price=parts[0].selling_price, total_price=parts[0].selling_price)
            OrderItem.objects.create(order=order, part=parts[1], quantity=1, unit_price=parts[1].selling_price, total_price=parts[1].selling_price)
            Payment.objects.create(
                order=order,
                transaction_id='TXN-DEMO-998811',
                amount=order.total_amount,
                payment_method=Payment.PaymentMethod.CARD,
                status=Payment.Status.SUCCESS
            )

        # 8. Sales & Realized Revenue
        Sale.objects.get_or_create(
            customer=customers[0],
            sale_type=Sale.SaleType.PART,
            selling_price=Decimal('383500.00'),
            defaults={
                'purchase_cost': Decimal('267000.00'),
                'tax': Decimal('19175.00'),
                'payment_status': Sale.PaymentStatus.PAID,
                'sale_date': date.today() - timedelta(days=3),
                'notes': 'Demo parts sale: Brembo GT + Michelin Pilot Sport'
            }
        )
        Sale.objects.get_or_create(
            customer=customers[1],
            sale_type=Sale.SaleType.SERVICE,
            selling_price=Decimal('18500.00'),
            defaults={
                'purchase_cost': Decimal('8200.00'),
                'payment_status': Sale.PaymentStatus.PAID,
                'sale_date': date.today() - timedelta(days=1),
                'notes': 'Completed full synthetic oil service + alignment'
            }
        )

        # 9. Inventory Transactions
        InventoryTransaction.objects.get_or_create(
            reference='PO-2026-IN01',
            defaults={
                'transaction_type': InventoryTransaction.TransactionType.PURCHASE,
                'part': parts[0],
                'quantity': 15,
                'unit_cost': parts[0].purchase_cost,
                'total_cost': parts[0].purchase_cost * 15,
                'notes': 'Direct supplier delivery from Brembo SpA',
                'created_by': admin_user
            }
        )

        # 10. Operational Expenses
        expenses_data = [
            {'category': ExpenseCategory.RENT, 'desc': 'Prime Dealership Showroom & Workshop Facility Lease', 'amount': Decimal('180000.00')},
            {'category': ExpenseCategory.SALARY, 'desc': 'Master Certified Technicians & Sales Staff Payroll', 'amount': Decimal('145000.00')},
            {'category': ExpenseCategory.UTILITIES, 'desc': 'High-Voltage EV Charging Grid & Facility Electricity', 'amount': Decimal('24500.00')},
            {'category': ExpenseCategory.MARKETING, 'desc': 'Digital Automotive Marketing & Launch Campaign', 'amount': Decimal('42000.00')},
            {'category': ExpenseCategory.MAINTENANCE, 'desc': 'Hydraulic Lift Calibration & Diagnostic Tool Licenses', 'amount': Decimal('16500.00')},
        ]
        for e in expenses_data:
            Expense.objects.get_or_create(
                category=e['category'],
                description=e['desc'],
                defaults={'amount': e['amount'], 'date': date.today() - timedelta(days=7)}
            )

        self.stdout.write(self.style.SUCCESS("\nCarCraft Platform successfully seeded with full production-grade demo data!"))
