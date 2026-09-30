// ==========================================================================
// CARCRAFT DEALER SUITE - PERFORMANCE PARTS INVENTORY MOCK DATA
// PRIVATE DEALER INFORMATION: Purchase cost, wholesale markup, minimum stock
// ==========================================================================

export const initialDealerParts = [
  {
    id: 'prt-101',
    name: 'Apex Carbon-Ceramic Matrix Brake Kit',
    brand: 'Brembo Motorsport',
    category: 'Brakes',
    sku: 'CC-BRK-9901',
    price: 540000, // ₹5,40,000 selling price
    purchaseCost: 380000, // ₹3,80,000 private purchase cost
    discount: 5,
    stock: 12,
    minStockLevel: 4,
    status: 'In Stock',
    image: '/images/parts/brakes_rotor_caliper.jpg',
    dateAdded: '2026-03-01',
    supplier: 'Brembo S.p.A. Official Motorsport Division',
    description: 'Forged 10-piston front calipers paired with 420mm drilled carbon-silicon carbide discs. Eliminates thermal fade up to 1,000°C while shedding 18kg unsprung mass.',
    specifications: '10-Piston Calipers, 420mm Discs, Titanium Backplate, Operating Temp 1,000°C',
    compatibility: ['CARCRAFT Apex GT-R', 'Porsche 911 GT3 RS', 'BMW M4 Competition', 'Universal 5x112/5x130']
  },
  {
    id: 'prt-102',
    name: 'Evolution Line Titanium Exhaust System',
    brand: 'Akrapovič',
    category: 'Performance',
    sku: 'AKR-EXH-7702',
    price: 680000, // ₹6,80,000
    purchaseCost: 490000, // ₹4,90,000
    discount: 0,
    stock: 3,
    minStockLevel: 5,
    status: 'Low Stock',
    image: '/images/parts/exhaust_titanium_akrapovic.jpg',
    dateAdded: '2026-02-18',
    supplier: 'Akrapovič d.d. Slovenia Direct',
    description: 'Hand-welded aerospace titanium exhaust with integrated active dual acoustic valves and handcrafted carbon fiber end-pipes.',
    specifications: 'Weight reduction: -14.2kg, Power increase: +28 HP, Hand-crafted pre-preg carbon tips',
    compatibility: ['Porsche 911 GT3 RS (992)', 'Ferrari SF90 Stradale', 'McLaren 750S']
  },
  {
    id: 'prt-103',
    name: 'TTX Pro 4-Way Adjustable Coilover Kit',
    brand: 'Öhlins Racing',
    category: 'Suspension',
    sku: 'OHL-SUS-4401',
    price: 420000, // ₹4,20,000
    purchaseCost: 295000, // ₹2,95,000
    discount: 8,
    stock: 8,
    minStockLevel: 3,
    status: 'In Stock',
    image: '/images/parts/suspension_coilover.jpg',
    dateAdded: '2026-01-24',
    supplier: 'Öhlins Racing AB Sweden',
    description: 'Twin-Tube (TTX) technology with independent high/low speed compression and rebound adjusters, external reservoirs, and titanium springs.',
    specifications: '4-Way Damping Adjustability, Remote Nitrogen Reservoirs, Dual Valve Flow Rate',
    compatibility: ['CARCRAFT Apex GT-R', 'Mercedes-AMG GT Black Series', 'BMW M4 Competition']
  },
  {
    id: 'prt-104',
    name: 'FI-R Centerlock Forged Monoblock Wheels (Set of 4)',
    brand: 'BBS Motorsport',
    category: 'Wheels',
    sku: 'BBS-WHL-1092',
    price: 890000, // ₹8,90,000
    purchaseCost: 640000, // ₹6,40,000
    discount: 0,
    stock: 4,
    minStockLevel: 2,
    status: 'In Stock',
    image: '/images/parts/wheel_forged_turbofan.jpg',
    dateAdded: '2026-03-08',
    supplier: 'BBS Kraftfahrzeugtechnik AG',
    description: 'Forged aviation-grade aluminum wheels featuring relief holes directly milled into the spokes for minimum rotational inertia.',
    specifications: 'Front: 20x9.5J ET45 (7.8kg), Rear: 21x12.5J ET48 (9.2kg), Centerlock interface',
    compatibility: ['Porsche 911 GT3 RS', 'Ferrari SF90 Assetto Fiorano', 'CARCRAFT Apex GT-R']
  },
  {
    id: 'prt-105',
    name: 'Pilot Sport Cup 2 R Semi-Slick Tyres (Full Set)',
    brand: 'Michelin',
    category: 'Tyres',
    sku: 'MCH-TYR-2004',
    price: 240000, // ₹2,40,000
    purchaseCost: 175000, // ₹1,75,000
    discount: 0,
    stock: 16,
    minStockLevel: 6,
    status: 'In Stock',
    image: '/images/parts/tyre_michelin_cup2.jpg',
    dateAdded: '2026-03-14',
    supplier: 'Michelin Motorsport Logistics',
    description: 'Competition-grade semi-slick compound derived from 24 Hours of Le Mans technology. Enhanced lateral grip delivering up to 0.5s per km lap advantage.',
    specifications: 'Compound: Dual Compound 2.0, Treadwear: 140, Speed Rating: (Y) >300 km/h',
    compatibility: ['All 20/21 inch performance wheel fitments']
  },
  {
    id: 'prt-106',
    name: 'Eventuri Pre-Preg Carbon Fiber Air Intake Suite',
    brand: 'Eventuri',
    category: 'Engine Parts',
    sku: 'EVT-ENG-8831',
    price: 320000, // ₹3,20,000
    purchaseCost: 220000, // ₹2,20,000
    discount: 5,
    stock: 2,
    minStockLevel: 4,
    status: 'Low Stock',
    image: '/images/parts/performance_carbon_intake.jpg',
    dateAdded: '2026-02-04',
    supplier: 'Eventuri UK Headquarters',
    description: 'Patented Venturi reverse cone housing creating a laminar airflow velocity stack with zero inlet turbulence and lower intake air temperatures.',
    specifications: 'Pre-preg carbon fiber housing, Dry synthetic high-flow filter, Dyno verified +24 HP',
    compatibility: ['BMW M4 Competition', 'Mercedes-AMG GT Black Series']
  },
  {
    id: 'prt-107',
    name: 'Laser-Matrix Dynamic LED Headlamp Conversion',
    brand: 'Magneti Marelli',
    category: 'Lighting',
    sku: 'MGM-LGT-5501',
    price: 450000, // ₹4,50,000
    purchaseCost: 320000, // ₹3,20,000
    discount: 0,
    stock: 0,
    minStockLevel: 3,
    status: 'Out of Stock',
    image: '/images/parts/lighting_matrix_headlight.jpg',
    dateAdded: '2026-01-10',
    supplier: 'Marelli Automotive Lighting Italy',
    description: '600-meter range high-beam laser diode assembly with 84 individually controlled matrix micro-LEDs and dynamic turn indicators.',
    specifications: 'Range: 600m, Color Temp: 5,500K daylight, Active anti-glare shadowing',
    compatibility: ['Audi RS e-tron GT', 'CARCRAFT Apex GT-R']
  },
  {
    id: 'prt-108',
    name: 'Carbon-Alcantara Ergonomic Motorsport Steering Wheel',
    brand: 'CARCRAFT Atelier',
    category: 'Interior',
    sku: 'CC-INT-9912',
    price: 180000, // ₹1,80,000
    purchaseCost: 110000, // ₹1,10,000
    discount: 10,
    stock: 9,
    minStockLevel: 3,
    status: 'In Stock',
    image: '/images/parts/interior_racing_steering_wheel.jpg',
    dateAdded: '2026-03-02',
    supplier: 'CARCRAFT Master Interior Workshop',
    description: 'Formula 1 inspired flat-bottom steering wheel with integrated shift LED rev indicator, rotary drive-mode selectors, and genuine Italian Alcantara.',
    specifications: 'Carbon twill gloss finish, 16-LED shift array, Magnetic paddle shifters',
    compatibility: ['CARCRAFT Apex GT-R', 'Universal Boss Adapter Compatibility']
  }
];

export const partCategories = [
  'Engine Parts',
  'Brakes',
  'Suspension',
  'Tyres',
  'Wheels',
  'Lighting',
  'Interior',
  'Exterior',
  'Electronics',
  'Performance',
  'Accessories',
  'Car Care'
];

export const partStatuses = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
  'Discontinued'
];
