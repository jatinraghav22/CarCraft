// ==========================================================================
// CARCRAFT DEALER SUITE - VEHICLE FLEET INVENTORY MOCK DATA
// PRIVATE DEALER INFORMATION: Purchase cost, procurement ledger, margin data
// These fields are strictly isolated from customer-facing payloads.
// ==========================================================================

export const initialDealerVehicles = [
  {
    id: 'veh-101',
    brand: 'CARCRAFT',
    model: 'Apex GT-R',
    year: 2026,
    vin: 'WCC994827X78201',
    price: 28500000, // ₹2.85 Cr
    purchaseCost: 19800000, // ₹1.98 Cr private dealer procurement cost
    status: 'Available',
    stock: 3,
    fuel: 'Pure Electric',
    transmission: 'Direct Drive',
    mileage: '420 km range',
    bodyType: 'Supercar',
    engine: 'Quad Liquid-Cooled Axial Flux Motors',
    horsepower: '1,280 HP',
    torque: '1,420 Nm',
    seats: 2,
    topSpeed: '380 km/h',
    color: 'Acid Lime Metallic',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-03-12',
    supplier: 'CARCRAFT Precision Engineering Atelier',
    description: 'Carbon Monocoque Quad-Motor Electric Hypercar. Factory-certified flagship demonstration unit with complete telemetry logging.',
    features: [
      'Quad-Motor Vectoring with 1,280 HP',
      'Pre-preg Carbon Fiber Tub & Active Aero Venturi Tunnels',
      'Carbon-Ceramic 420mm Discs with 10-Piston Calipers',
      'AR Head-Up Display with Track Telemetry Overlay'
    ]
  },
  {
    id: 'veh-102',
    brand: 'Porsche',
    model: '911 GT3 RS (992)',
    year: 2025,
    vin: 'WP0AF2A97RS20491',
    price: 36500000, // ₹3.65 Cr
    purchaseCost: 28800000, // ₹2.88 Cr
    status: 'Available',
    stock: 2,
    fuel: 'Petrol',
    transmission: '7-Speed PDK Dual-Clutch',
    mileage: '4,200 km',
    bodyType: 'Coupe',
    engine: '4.0L Naturally Aspirated Boxer-6',
    horsepower: '525 HP',
    torque: '465 Nm',
    seats: 2,
    topSpeed: '296 km/h',
    color: 'Guards Red / Weissach Package',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-02-28',
    supplier: 'Stuttgart Exclusive Allocations',
    description: 'Track-focused Weissach Package with carbon magnesium wheels, active DRS rear wing, and ceramic composite brakes (PCCB).',
    features: [
      'Weissach Carbon Aerodynamics & Roll Cage',
      'PDK 7-Speed Dual-Clutch with Paddle Shifters',
      'Active Drag Reduction System (DRS)',
      'Front-Axle Lift System'
    ]
  },
  {
    id: 'veh-103',
    brand: 'BMW',
    model: 'M4 Competition Coupé',
    year: 2025,
    vin: 'WBA43AZ08FS98112',
    price: 14800000, // ₹1.48 Cr
    purchaseCost: 11200000, // ₹1.12 Cr
    status: 'Sold',
    stock: 0,
    fuel: 'Petrol',
    transmission: '8-Speed M Steptronic',
    mileage: '6,800 km',
    bodyType: 'Coupe',
    engine: '3.0L BMW M TwinPower Turbo Inline-6',
    horsepower: '510 HP',
    torque: '650 Nm',
    seats: 4,
    topSpeed: '290 km/h',
    color: 'Isle of Man Green Metallic',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-01-15',
    supplier: 'Bavaria Motor Group Direct',
    description: 'M xDrive all-wheel drive with active M Differential, carbon fiber roof, and Merino full leather interior.',
    features: [
      'M Carbon Bucket Seats',
      'M Carbon Ceramic Brake System',
      'Harman Kardon Surround Audio',
      'M Drive Professional with Drift Analyser'
    ]
  },
  {
    id: 'veh-104',
    brand: 'Mercedes-AMG',
    model: 'GT Black Series',
    year: 2024,
    vin: 'WDD1903821A89201',
    price: 52000000, // ₹5.20 Cr
    purchaseCost: 41000000, // ₹4.10 Cr
    status: 'Reserved',
    stock: 1,
    fuel: 'Petrol',
    transmission: '7-Speed AMG SPEEDSHIFT DCT',
    mileage: '1,800 km',
    bodyType: 'Coupe',
    engine: '4.0L Flat-Plane Crank Bi-Turbo V8',
    horsepower: '730 HP',
    torque: '800 Nm',
    seats: 2,
    topSpeed: '325 km/h',
    color: 'Magno Alanite Grey',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-02-10',
    supplier: 'Affalterbach Bespoke Registry',
    description: 'Limited production run halo car. Flat-plane crank V8 with manually adjustable carbon fiber front splitter and two-stage rear wing.',
    features: [
      'Flat-Plane Crankshaft Bi-Turbo V8',
      'Full Carbon Fiber Body Paneling',
      'Coil-Over Suspension with Adaptive Damping',
      '9-Step AMG Traction Control'
    ]
  },
  {
    id: 'veh-105',
    brand: 'Ferrari',
    model: 'SF90 Stradale Assetto Fiorano',
    year: 2025,
    vin: 'ZFF94NHA8P0281920',
    price: 78000000, // ₹7.80 Cr
    purchaseCost: 62500000, // ₹6.25 Cr
    status: 'Available',
    stock: 1,
    fuel: 'Plug-in Hybrid',
    transmission: '8-Speed Dual-Clutch F1',
    mileage: '2,400 km',
    bodyType: 'Supercar',
    engine: '4.0L Twin-Turbo V8 + Tri-Electric Motors',
    horsepower: '1,000 HP',
    torque: '800 Nm',
    seats: 2,
    topSpeed: '340 km/h',
    color: 'Rosso Corsa with Nero Roof',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-03-01',
    supplier: 'Maranello Official Consignment',
    description: 'Assetto Fiorano specification with Multimatic shock absorbers, titanium exhaust, carbon door panels, and Michelin Pilot Sport Cup 2 tyres.',
    features: [
      'Assetto Fiorano Lightweight Package',
      'eManettino Hybrid Drive Modes (eDrive, Hybrid, Performance, Qualify)',
      'Carbon-Fiber Racing Seats',
      'Titanium Springs & Exhaust Architecture'
    ]
  },
  {
    id: 'veh-106',
    brand: 'McLaren',
    model: '750S Spider',
    year: 2025,
    vin: 'SBM14FAA6PW00921',
    price: 49500000, // ₹4.95 Cr
    purchaseCost: 39500000, // ₹3.95 Cr
    status: 'Available',
    stock: 2,
    fuel: 'Petrol',
    transmission: '7-Speed Seamless Shift Gearbox',
    mileage: '3,100 km',
    bodyType: 'Convertible',
    engine: '4.0L Twin-Turbo M840T V8',
    horsepower: '750 HP',
    torque: '800 Nm',
    seats: 2,
    topSpeed: '332 km/h',
    color: 'Papaya Spark Orange',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-03-05',
    supplier: 'Woking Technology Centre',
    description: 'Retractable Hard Top folding in 11 seconds. Proactive Chassis Control III with McLaren Variable Drift Control.',
    features: [
      'Carbon Fiber Monocage II-S Structure',
      'One-Touch Retractable Hard Top',
      'Titanium Sport Exhaust System',
      'Bowers & Wilkins 12-Speaker High-Fidelity Audio'
    ]
  },
  {
    id: 'veh-107',
    brand: 'Audi',
    model: 'RS e-tron GT Performance',
    year: 2026,
    vin: 'WAUZZZFW9RA02931',
    price: 21500000, // ₹2.15 Cr
    purchaseCost: 16800000, // ₹1.68 Cr
    status: 'Unavailable',
    stock: 0,
    fuel: 'Pure Electric',
    transmission: '2-Speed Rear / 1-Speed Front',
    mileage: '120 km (Delivery Mileage)',
    bodyType: 'Sedan',
    engine: 'Dual Permanent-Magnet Synchronous Motors',
    horsepower: '925 HP',
    torque: '1,027 Nm',
    seats: 5,
    topSpeed: '250 km/h',
    color: 'Daytona Grey Matte',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-03-18',
    supplier: 'Ingolstadt Motorsport Dispatch',
    description: 'Factory transit vehicle reserved for technical homologation and software calibration.',
    features: [
      'Active Air Suspension with Push-to-Pass Boost',
      'Carbon Roof and Ceramic Brake Package',
      'Matrix LED Headlights with Audi Laser Light',
      'Bang & Olufsen 3D Premium Sound'
    ]
  },
  {
    id: 'veh-108',
    brand: 'Aston Martin',
    model: 'DBS 770 Ultimate',
    year: 2024,
    vin: 'SCFRMFB76PBL00182',
    price: 59000000, // ₹5.90 Cr
    purchaseCost: 46800000, // ₹4.68 Cr
    status: 'Available',
    stock: 1,
    fuel: 'Petrol',
    transmission: 'ZF 8-Speed Automatic with Paddle Shift',
    mileage: '1,200 km',
    bodyType: 'Coupe',
    engine: '5.2L Quad-Cam 48-Valve Bi-Turbo V12',
    horsepower: '770 HP',
    torque: '900 Nm',
    seats: 4,
    topSpeed: '340 km/h',
    color: 'Satin Xenon Grey / Q Bespoke',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
    dateAdded: '2026-02-14',
    supplier: 'Gaydon Q Heritage Division',
    description: 'Final edition V12 flagship limited to 300 coupes worldwide. Bespoke solid carbon front splitter and horse-shoe bonnet vent.',
    features: [
      '5.2L Bi-Turbo V12 with 770 PS Output',
      'Carbon Ceramic Brakes (410mm front, 360mm rear)',
      'Sports Plus Semi-Aniline Leather and Alcantara',
      'Q by Aston Martin Bespoke Commission Badge'
    ]
  }
];

// Helper to format Indian Currency in Lakhs and Crores
export const formatDealerINR = (amount) => {
  if (typeof amount !== 'number') return amount;
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};
