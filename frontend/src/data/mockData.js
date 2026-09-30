import { formatINR } from '../utils/currency';
// CARCRAFT Automotive Platform - Mock Data & Future Django REST API Schema
// Conforms to GET /api/cars/, GET /api/parts/, GET /api/services/, GET /api/orders/, GET /api/bookings/

export const mockVehicles = [
  {
    id: 'cc-v1',
    model: 'CARCRAFT Apex GT-R',
    category: 'Supercar',
    tagline: 'Carbon Monocoque Quad-Motor Hypercar',
    price: 28500000,
    formattedPrice: formatINR(28500000),
    fuelType: 'Pure Electric',
    transmission: '2-Speed Planetary Direct Drive',
    mileage: '420 mi range',
    acceleration: '1.88s (0-60 mph)',
    topSpeed: '236 mph',
    power: '1,280 HP',
    torque: '1,420 Nm',
    drivetrain: 'All-Wheel Torque Vectoring',
    year: 2026,
    badge: 'Flagship Edition',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    inStock: 3,
    description: 'Engineered for uncompromising aerodynamic balance and explosive electric response. Full pre-preg carbon fiber body shell with active rear wing and electromagnetic suspension.',
    specs: {
      battery: '118 kWh Liquid-Cooled 800V Architecture',
      charging: '10-80% in 14 mins (350kW DC Fast Charge)',
      weight: '1,840 kg',
      aerodynamics: '0.21 Cd with Ground-Effect Venturi Tunnels',
      brakes: 'Carbon-Ceramic 420mm Discs with 10-Piston Calipers'
    }
  },
  {
    id: 'cc-v2',
    model: 'CARCRAFT Spectre EV-7',
    category: 'Electric',
    tagline: 'Ultra-Luxury Grand Touring Aerodynamic Sedan',
    price: 14200000,
    formattedPrice: formatINR(14200000),
    fuelType: 'Dual Motor EV',
    transmission: 'Single-Speed Seamless Drive',
    mileage: '510 mi range',
    acceleration: '2.9s (0-60 mph)',
    topSpeed: '185 mph',
    power: '780 HP',
    torque: '980 Nm',
    drivetrain: 'Intelligent e-AWD',
    year: 2026,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    inStock: 7,
    description: 'The executive grand tourer of the next generation. Executive rear lounge seats with active noise cancellation, adaptive air suspension, and autonomous highway chauffeur.',
    specs: {
      battery: '105 kWh Solid-State Hybrid Pack',
      charging: '10-80% in 18 mins',
      weight: '2,150 kg',
      interior: 'Recycled Vegan Nappa Leather & Open-Pore Walnut',
      soundSystem: '23-Speaker 1,400W Spatial Audio'
    }
  },
  {
    id: 'cc-v3',
    model: 'CARCRAFT Veloce Corse',
    category: 'Track Edition',
    tagline: 'Twin-Turbo V8 Hybrid Track Weapon',
    price: 34000000,
    formattedPrice: formatINR(34000000),
    fuelType: 'Twin-Turbo Hybrid',
    transmission: '8-Speed Dual-Clutch F1 Sequential',
    mileage: '24 mpg / 8,800 RPM',
    acceleration: '2.3s (0-60 mph)',
    topSpeed: '218 mph',
    power: '1,050 HP',
    torque: '1,120 Nm',
    drivetrain: 'Rear-Wheel Drive with E-Diff',
    year: 2026,
    badge: 'Limited Run 1 of 50',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    inStock: 1,
    description: 'Forged from racing DNA. Incorporates Formula 1 MGU-K kinetic energy harvesting with a hand-assembled 4.0L flat-plane crank twin-turbocharged V8 engine.',
    specs: {
      engine: '4.0L Twin-Turbo Flat-Plane V8 + Axial Flux Motor',
      exhaust: 'Inconel 625 Center-Exit Active Racing Exhaust',
      downforce: '850 kg at 155 mph',
      suspension: 'Pushrod Inboard Multimatic DSSV Dampers',
      wheels: 'Monoblock Forged Magnesium Center-Lock'
    }
  },
  {
    id: 'cc-v4',
    model: 'CARCRAFT Horizon X-Cross',
    category: 'Luxury SUV',
    tagline: 'High-Performance All-Terrain Super SUV',
    price: 16800000,
    formattedPrice: formatINR(16800000),
    fuelType: 'Twin-Turbo V8 Mild-Hybrid',
    transmission: '9-Speed Tiptronic Sport',
    mileage: '21 mpg / 480 mi range',
    acceleration: '3.4s (0-60 mph)',
    topSpeed: '190 mph',
    power: '720 HP',
    torque: '900 Nm',
    drivetrain: 'Variable Locking 4WD + Terrain Response',
    year: 2026,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    inStock: 5,
    description: 'Commanding road presence meets extreme terrain capability. 48V active anti-roll stabilization and electro-hydraulic steering ensure razor-sharp agility.',
    specs: {
      towingCapacity: '3,500 kg',
      groundClearance: 'Adjustable 180mm to 285mm',
      differential: 'Front, Center & Rear Electronic Locking',
      wheels: '23-inch Forged Alloy with Pirelli Scorpion Zero',
      audio: 'Bespoke 3D Immersive Studio Audio'
    }
  }
];

export const mockParts = [
  {
    id: 'pt-1',
    name: 'Apex Carbon-Ceramic Matrix Brake Kit',
    category: 'Performance',
    price: 6850,
    rating: 4.9,
    reviews: 48,
    stock: 12,
    image: '/images/parts/brakes_rotor_caliper.jpg',
    description: 'Forged 10-piston front calipers with 420mm drilled carbon-silicon carbide discs. Eliminates brake fade up to 1,000°C.',
    compatibility: 'CARCRAFT Apex, Spectre & Universal 5x112'
  },
  {
    id: 'pt-2',
    name: 'Dual Stage Ball-Bearing Turbocharger Upgrade',
    category: 'Performance',
    price: 4200,
    rating: 4.8,
    reviews: 62,
    stock: 8,
    image: '/images/parts/turbocharger_billet.jpg',
    description: 'Billet titanium compressor wheel with ceramic ball bearings for instantaneous spool-up. Supports up to 950 BHP.',
    compatibility: 'CARCRAFT Veloce & 3.0L-4.0L Twin-Scroll Engines'
  },
  {
    id: 'pt-3',
    name: 'Dry Carbon Fiber Aerodynamic Front Splitter & Canards',
    category: 'Exterior',
    price: 2150,
    rating: 5.0,
    reviews: 31,
    stock: 15,
    image: '/images/parts/aerodynamics_carbon_splitter.jpg',
    description: 'Autoclave-cured 2x2 twill pre-preg dry carbon fiber. Adds 95kg of high-speed front axle downforce.',
    compatibility: 'CARCRAFT Apex GT-R & Spectre EV-7'
  },
  {
    id: 'pt-4',
    name: 'Monoblock Forged Aero-Turbine 21" Wheels (Set of 4)',
    category: 'Wheels & Tyres',
    price: 4900,
    rating: 4.9,
    reviews: 27,
    stock: 6,
    image: '/images/parts/wheel_forged_turbofan.jpg',
    description: 'Aerospace-grade 6061-T6 forged aluminum with integrated aerodynamic directional vanes for brake cooling.',
    compatibility: '5x112 / 5x120 PCD Centers'
  },
  {
    id: 'pt-5',
    name: 'Inboard Adaptive Electronic Coilover Suspension Kit',
    category: 'Maintenance',
    price: 3450,
    rating: 4.7,
    reviews: 19,
    stock: 9,
    image: '/images/parts/suspension_coilover.jpg',
    description: '3-way adjustable rebound and compression with magnetic damping sensors sampling at 1,000Hz.',
    compatibility: 'All CARCRAFT Models'
  },
  {
    id: 'pt-6',
    name: 'Alcantara & Carbon LED Steering Wheel with Shift Lights',
    category: 'Interior',
    price: 1850,
    rating: 4.9,
    reviews: 54,
    stock: 18,
    image: '/images/parts/interior_racing_steering_wheel.jpg',
    description: 'Integrated OLED telemetry display showing RPM, 0-60 timer, G-force meter, and battery thermal levels.',
    compatibility: 'Plug-and-Play CANbus Integration'
  }
];

export const mockServices = [
  {
    id: 'srv-1',
    name: 'Master Diagnostic & Telemetry Inspection',
    price: 249,
    duration: '1.5 Hours',
    badge: 'Recommended',
    description: 'Complete 120-point digital scan covering powertrain, HV battery health, CAN-bus networks, brake efficiency, and optical LiDAR calibration.',
    features: ['120-point sensor telemetry scan', 'Battery cell impedance analysis', 'ECU fault clearing & firmware sync', 'Digital report with video documentation']
  },
  {
    id: 'srv-2',
    name: 'High-Performance Brake System Overhaul',
    price: 499,
    duration: '2.5 Hours',
    badge: 'Safety Critical',
    description: 'Inspection and servicing of carbon-ceramic or steel rotors, caliper rebuilds, DOT 5.1 racing brake fluid flush, and pad bedding.',
    features: ['Ultrasonic caliper cleaning', 'DOT 5.1 fluid bleeding with pressure purge', 'Micrometer disc thickness mapping', 'Track pad torque verification']
  },
  {
    id: 'srv-3',
    name: '800V High-Voltage Battery & Inverter Optimization',
    price: 390,
    duration: '2 Hours',
    badge: 'EV Specialized',
    description: 'Coolant dielectric dielectric loop flush, cell balancing, inverter thermal paste inspection, and regenerative braking recalibration.',
    features: ['HV safety isolation check', 'Thermal pump flow rate analysis', 'Cell balancing algorithm run', 'Regenerative braking efficiency tuning']
  },
  {
    id: 'srv-4',
    name: 'Precision Laser Wheel Alignment & Corner Balancing',
    price: 280,
    duration: '2 Hours',
    badge: 'Handling',
    description: 'Digital 3D laser alignment to motorsport tolerances, corner weight scaling with driver ballast, camber, caster, and toe adjustment.',
    features: ['3D digital optical targeting', 'Corner weight scaling (+/- 0.5kg)', 'Camber & caster track/street setup', 'Ride height sensor re-zeroing']
  },
  {
    id: 'srv-5',
    name: 'Ultra Ceramic Coating & Detail Studio',
    price: 799,
    duration: '5 Hours',
    badge: 'Concierge',
    description: 'Multi-stage rotary paint correction, 9H dual-layer nanotech ceramic coating on bodywork, wheels, and glass with infrared curing.',
    features: ['Multi-stage paint depth measurement', 'Rotary swirl & scratch elimination', '9H hydrophobic ceramic application', 'Infrared thermal lamp curing']
  },
  {
    id: 'srv-6',
    name: 'Engine Dyno Tune & ECU Calibration',
    price: 650,
    duration: '3.5 Hours',
    badge: 'Motorsport',
    description: 'All-wheel drive hub dynamometer mapping for ignition timing, boost pressure curve, air-fuel ratios, and launch control refinement.',
    features: ['AWD linked hub dynamometer runs', 'Bespoke fuel and spark map tuning', 'Wideband lambda monitoring', 'Printout of HP & Torque curves']
  }
];

export const mockCustomerProfile = {
  name: 'Alexander Cross',
  email: 'a.cross@carcraft-network.com',
  memberSince: 'March 2024',
  membershipTier: 'Apex Black VIP',
  garage: [
    {
      id: 'g-1',
      model: 'CARCRAFT Apex GT-R',
      vin: 'CC9X-2026-0042',
      mileage: '4,820 mi',
      status: 'Optimal',
      batteryHealth: '99.4%',
      lastService: '12 Jan 2026',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'g-2',
      model: 'CARCRAFT Horizon X-Cross',
      vin: 'CC7H-2025-0189',
      mileage: '12,400 mi',
      status: 'Service Due in 600 mi',
      batteryHealth: '97.8%',
      lastService: '18 Aug 2025',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80'
    }
  ],
  orders: [
    {
      id: 'ORD-9921',
      date: '18 Sep 2026',
      total: formatINR(900000),
      status: 'In Transit',
      carrier: 'Apex Secure Freight',
      items: ['Apex Carbon-Ceramic Matrix Brake Kit', 'Dry Carbon Fiber Aerodynamic Front Splitter']
    },
    {
      id: 'ORD-8812',
      date: '04 Jun 2026',
      total: formatINR(185000),
      status: 'Delivered',
      carrier: 'DHL Express',
      items: ['Alcantara & Carbon LED Steering Wheel']
    }
  ],
  bookings: [
    {
      id: 'BK-4102',
      service: 'Master Diagnostic & Telemetry Inspection',
      vehicle: 'CARCRAFT Apex GT-R',
      date: '14 Oct 2026',
      time: '10:30 AM',
      advisor: 'Marcus Vance (Master Tech #04)',
      status: 'Confirmed'
    }
  ]
};

export const mockAdminStats = {
  kpis: {
    totalVehicles: 148,
    activeCustomers: 3240,
    totalOrders: 892,
    pendingServices: 14,
    revenue: '₹40,52,40,000',
    growth: '+18.4% this quarter'
  },
  recentOrders: [
    { id: 'ORD-9924', customer: 'Sophia Lin', item: 'Apex GT-R (Order Deposit)', amount: '₹25,00,000', status: 'Verified' },
    { id: 'ORD-9923', customer: 'David Sterling', item: 'Forged 21" Aero Wheels', amount: '₹4,90,000', status: 'Processing' },
    { id: 'ORD-9922', customer: 'Vikram Mehta', item: 'Spectre EV-7 (Full Payment)', amount: '₹1,42,00,000', status: 'Completed' },
    { id: 'ORD-9921', customer: 'Alexander Cross', item: 'Carbon Brake Kit + Splitter', amount: '₹9,00,000', status: 'Shipped' }
  ],
  serviceQueue: [
    { id: 'SRV-801', customer: 'Julian Thorne', car: 'Apex GT-R', service: 'ECU Dyno Calibration', bay: 'Dyno Bay 1', status: 'In Progress' },
    { id: 'SRV-802', customer: 'Elena Rostova', car: 'Spectre EV-7', service: '800V HV Battery Flush', bay: 'Clean Lab 2', status: 'Awaiting Parts' },
    { id: 'SRV-803', customer: 'Marcus Hayes', car: 'Veloce Corse', service: 'Ceramic Detail & Cure', bay: 'Studio 3', status: 'Scheduled' }
  ],
  inventoryBreakdown: [
    { category: 'Supercars & Hypercars', count: 18, value: '₹42.5 Cr' },
    { category: 'Electric Luxury Sedans', count: 42, value: '₹50.0 Cr' },
    { category: 'Performance SUVs', count: 35, value: '₹48.0 Cr' },
    { category: 'Performance Parts & Kits', count: 420, value: '₹11.6 Cr' }
  ]
};
