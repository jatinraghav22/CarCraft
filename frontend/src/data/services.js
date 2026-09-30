import { formatINR } from '../utils/currency';
// CARCRAFT Precision Automotive Service - Mock Data Catalog
// Conforms to GET /api/services/, POST /api/bookings/

export const mockServices = [
  {
    id: 'srv-maint',
    name: 'Periodic Maintenance & Telemetry Check',
    category: 'Periodic Maintenance',
    price: 490,
    formattedPrice: formatINR(490),
    duration: '2.5 Hours',
    badge: 'Factory Standard',
    iconName: 'Wrench',
    description: 'Factory-certified comprehensive service covering high-stress chassis fasteners, multi-point electronic diagnostics, fluid top-offs, cabin micro-filters, and digital telemetry logging.',
    features: [
      'Comprehensive 80-point vehicle mechanical check',
      'Electronic brake & steering sensor calibration',
      'Bespoke synthetic lubricant replacement',
      'Cabin pollen & particulate micro-filter refresh',
      'Digital diagnostic certificate logged to vehicle VIN'
    ]
  },
  {
    id: 'srv-oil',
    name: 'Ultra-Performance Synthetic Oil & Filter Service',
    category: 'Oil Change',
    price: 260,
    formattedPrice: formatINR(260),
    duration: '1.0 Hour',
    badge: 'Essential',
    iconName: 'Droplets',
    description: 'Track-grade 0W-40 or 5W-50 ester-synthetic oil formulated for high-revving turbo and naturally aspirated engines. Includes magnetic drain plug inspection and OEM filter replacement.',
    features: [
      'Track-proven full ester synthetic motorsport lubricant',
      'OEM high-capacity particulate oil filter replacement',
      'Magnetic sump plug wear particle analysis',
      'Fluid level safety check (coolant, brake fluid, steering)',
      'Digital service interval counter reset'
    ]
  },
  {
    id: 'srv-brake',
    name: 'Brake System Overhaul & Fluid Bleed',
    category: 'Brake Service',
    price: 580,
    formattedPrice: formatINR(580),
    duration: '2.0 Hours',
    badge: 'Safety Critical',
    iconName: 'Disc',
    description: 'Comprehensive inspection of pads, rotors, caliper slide pins, and high-boiling-point DOT 5.1 or Castrol SRF brake fluid flush to eliminate pedal sponginess and heat fade.',
    features: [
      'High-temp Castrol SRF / DOT 5.1 racing fluid pressure flush',
      'Micrometer rotor thickness & runout measurement',
      'Brake pad friction material depth scan',
      'Caliper seal inspection and acoustic anti-squeal lubrication',
      'ABS / ESP dynamic hydraulic pressure test'
    ]
  },
  {
    id: 'srv-tyre',
    name: 'High-Speed Dynamic Tyre Balancing & Mounting',
    category: 'Tyre Service',
    price: 190,
    formattedPrice: formatINR(190),
    duration: '1.0 Hour',
    badge: 'Handling',
    iconName: 'CircleDashed',
    description: 'Laser-guided road force balancing and mounting for ultra-low profile supercar wheels. Eliminates micro-vibrations at speeds up to 200 mph.',
    features: [
      'Hunter Road Force Elite laser balancing',
      'Non-contact touchless tire dismount & mount',
      'Cold & warm tire pressure optimization with pure nitrogen',
      'Tread depth profile & uneven wear laser analysis',
      'TPMS wireless sensor recalibration'
    ]
  },
  {
    id: 'srv-battery',
    name: 'High-Voltage Battery Cell Health & 12V Audit',
    category: 'Battery Service',
    price: 350,
    formattedPrice: formatINR(350),
    duration: '1.5 Hours',
    badge: 'EV Certified',
    iconName: 'Zap',
    description: 'Specialized diagnostic analysis of 400V/800V EV traction battery modules, cell impedance variance, DC fast-charging thermal dissipation, and 12V auxiliary lithium battery capacity.',
    features: [
      'Individual battery module internal resistance analysis',
      'Thermal cooling circuit flow rate & glycol check',
      'State of Health (SoH) and usable capacity verification',
      'High-voltage safety disconnect switch audit',
      'DC fast-charge port contact inspection and cleaning'
    ]
  },
  {
    id: 'srv-ac',
    name: 'Climate System Purge & Refrigerant Recharge',
    category: 'AC Service',
    price: 290,
    formattedPrice: formatINR(290),
    duration: '1.5 Hours',
    badge: 'Comfort',
    iconName: 'Wind',
    description: 'Full vacuum evacuation, leak detection test, and R1234yf eco-refrigerant recharge with UV dye inspection and anti-bacterial evaporator core ultrasonic sanitization.',
    features: [
      'Automated vacuum pressure decay leak test',
      'Precision recovery & recharge with R1234yf refrigerant',
      'Compressor PAG lubricating oil renewal',
      'Ultrasonic anti-bacterial cabin duct sanitization',
      'Electronic dual-zone blend door actuator calibration'
    ]
  },
  {
    id: 'srv-diag',
    name: 'Master Telemetry & Electronic Diagnostics Scan',
    category: 'Engine Diagnostics',
    price: 240,
    formattedPrice: formatINR(240),
    duration: '1.0 Hour',
    badge: 'Deep Telemetry',
    iconName: 'Activity',
    description: 'Factory-level CAN-bus and Ethernet network interrogations across powertrain, chassis, battery management, and driver-assist LiDAR/radar modules with complete fault logging.',
    features: [
      'Complete 120-point digital sensor scan',
      'Live fuel trim, boost curves, and yaw sensor streaming',
      'Firmware flash status check and control unit synchronization',
      'Historical fault code analysis and soft error clearing',
      'Comprehensive PDF diagnostic report with telemetry graphs'
    ]
  },
  {
    id: 'srv-align',
    name: 'Precision 3D Laser Wheel & Camber Alignment',
    category: 'Wheel Alignment',
    price: 320,
    formattedPrice: formatINR(320),
    duration: '1.5 Hours',
    badge: 'Track Setup',
    iconName: 'Compass',
    description: 'Sub-millimeter 3D optical laser alignment for camber, caster, and toe settings. Customized for aggressive street cornering or specialized track camber angles.',
    features: [
      'Multi-camera high-definition 3D optical tracking',
      'Front & rear camber, caster, and individual toe adjustments',
      'Chassis thrust angle alignment to center-line',
      'Steering angle sensor zero-point recalibration',
      'Custom track-day camber specifications on request'
    ]
  },
  {
    id: 'srv-detail',
    name: 'Graphene Ceramic Paint Correction & Studio Detail',
    category: 'Detailing',
    price: 850,
    formattedPrice: formatINR(850),
    duration: '5.0 Hours',
    badge: 'Concierge Grade',
    iconName: 'Sparkles',
    description: 'Multi-stage rotary and dual-action machine paint correction to eliminate 95%+ of swirl marks, followed by an ultra-hydrophobic ceramic graphene quartz protective layer.',
    features: [
      'pH-neutral snow foam bath and clay bar decontamination',
      '2-stage rotary machine polishing removing micro-marring',
      '3-year graphene quartz ceramic protective topcoat',
      'Interior Alcantara & Nappa leather deep conditioning',
      'Wheel barrels and brake calipers ceramic sealed'
    ]
  },
  {
    id: 'srv-inspect',
    name: '120-Point Track-Ready Certification & Safety Inspection',
    category: 'Full Inspection',
    price: 420,
    formattedPrice: formatINR(420),
    duration: '2.5 Hours',
    badge: 'Full Telemetry',
    iconName: 'ShieldCheck',
    description: 'The ultimate pre-purchase, pre-track, or seasonal certification inspection covering suspension ball joints, structural monocoque integrity, fluid chemistry, and telemetry sensors.',
    features: [
      'Rigorous 120-point physical and electronic audit',
      'Chassis monocoque and subframe integrity check',
      'Drivetrain mount and CV axle boots inspection',
      'Aerodynamic active wing and diffuser test',
      'Official CARCRAFT Track Readiness Certificate issued'
    ]
  }
];

export const serviceHubs = [
  'CARCRAFT Studio - Silicon Valley Hub (1040 Speed Corridor, San Jose, CA)',
  'CARCRAFT Studio - Manhattan Private Lounge (580 11th Ave, New York, NY)',
  'CARCRAFT Studio - Miami Speed Corridor (240 Biscayne Way, Miami, FL)',
  'CARCRAFT Studio - Beverly Hills Gallery (9400 Wilshire Blvd, Los Angeles, CA)',
  'CARCRAFT Studio - Austin Performance Center (450 Apex Circuit, Austin, TX)'
];

export const serviceTimeSlots = [
  '09:00 AM - Morning Early Inspection',
  '11:00 AM - Midday Telemetry Session',
  '01:30 PM - Afternoon Service Block',
  '03:30 PM - High-Performance Tuning Slot',
  '05:30 PM - Sunset Express Handover'
];
