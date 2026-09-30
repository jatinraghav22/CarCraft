import { formatINR } from '../utils/currency';
// CARCRAFT Automotive Parts & Accessories - Mock Data Catalog
// Conforms to GET /api/parts/, GET /api/parts/:id/

export const mockParts = [
  {
    id: 'pt-brake-01',
    name: 'Apex Carbon-Ceramic Matrix Brake Kit',
    brand: 'Brembo Motorsport',
    category: 'Brakes',
    price: 6850,
    formattedPrice: formatINR(6850),
    oldPrice: 7450,
    formattedOldPrice: formatINR(7450),
    discount: '8% OFF',
    discountNum: 8,
    rating: 4.9,
    reviews: 58,
    stockCount: 12,
    sku: 'CC-BRK-9901',
    image: '/images/parts/brakes_rotor_caliper.jpg',
    gallery: ['/images/parts/brakes_rotor_caliper.jpg'],
    description: 'Forged 10-piston front calipers paired with 420mm drilled carbon-silicon carbide discs. Engineered to eliminate thermal fade up to 1,000°C while shedding 18kg of unsprung rotational mass.',
    features: [
      '10-Piston Monoblock Forged Aluminum Calipers',
      '420mm Continuous Fiber Carbon-Ceramic Discs',
      'Titanium Backplate Brake Pads with High Thermal Resistance',
      'Stainless Steel Braided PTFE Fluid Lines',
      'Up to 18kg Unsprung Weight Reduction'
    ],
    specifications: {
      'Rotor Diameter': '420mm Front / 390mm Rear',
      'Piston Count': '10-Piston Front, 6-Piston Rear',
      'Friction Material': 'Carbon-Silicon Carbide Matrix (C/SiC)',
      'Operating Temp': 'Up to 1,000°C Peak Tolerance',
      'Mounting Hardware': 'Grade 5 Aerospace Titanium Bolts'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Spectre EV-7',
      'Porsche Taycan (All Trims)',
      'Universal 5x112 & 5x130 PCD'
    ],
    frequentlyBoughtTogether: ['pt-susp-01', 'pt-perf-02']
  },
  {
    id: 'pt-turbo-01',
    name: 'Dual Stage Ball-Bearing Turbocharger Upgrade',
    brand: 'Garrett Motorsport',
    category: 'Engine Parts',
    price: 4200,
    formattedPrice: formatINR(4200),
    oldPrice: 4800,
    formattedOldPrice: formatINR(4800),
    discount: '12% OFF',
    discountNum: 12,
    rating: 4.8,
    reviews: 64,
    stockCount: 8,
    sku: 'CC-ENG-4420',
    image: '/images/parts/turbocharger_billet.jpg',
    gallery: ['/images/parts/turbocharger_billet.jpg'],
    description: 'Billet titanium compressor wheel coupled with ceramic ball bearings for lightning-fast boost response. Capable of supporting sustained airflow for internal combustion and hybrid setups producing up to 1,050 BHP.',
    features: [
      'Point-Milled Billet Titanium Impeller Wheel',
      'Dual Ceramic Ball-Bearing Cartridge Assembly',
      'Inconel Turbine Housing for 1,050°C Exhaust Gas Temp',
      'Internal High-Flow Electronic Wastegate Actuator',
      'Reversible V-Band Flange Mounting'
    ],
    specifications: {
      'Compressor Inducer': '68mm Billet Titanium',
      'Turbine Wheel': '71mm Mar-M 246 Superalloy',
      'Max Flow Rate': '108 lbs/min Airflow',
      'Cooling': 'Dual Water & Oil Cooled Core',
      'Weight': '8.2 kg'
    },
    compatibility: [
      'CARCRAFT Veloce Corse',
      'Ferrari 296 GTB (Custom Manifold)',
      '3.0L-4.4L Twin-Scroll V6 / V8 Platforms'
    ],
    frequentlyBoughtTogether: ['pt-perf-01', 'pt-elec-01']
  },
  {
    id: 'pt-susp-01',
    name: 'Adaptive Inboard Coilover Telemetry Suspension',
    brand: 'Öhlins Racing',
    category: 'Suspension',
    price: 3850,
    formattedPrice: formatINR(3850),
    oldPrice: 4200,
    formattedOldPrice: formatINR(4200),
    discount: '8% OFF',
    discountNum: 8,
    rating: 4.9,
    reviews: 32,
    stockCount: 6,
    sku: 'CC-SUS-8802',
    image: '/images/parts/suspension_coilover.jpg',
    gallery: ['/images/parts/suspension_coilover.jpg'],
    description: '3-way adjustable compression, rebound, and high-speed valve dampers featuring magnetic electronic telemetry that adjusts damping force within 2 milliseconds based on track telemetry.',
    features: [
      'Dual Flow Valve (DFV) Technology',
      'Electronic Magnetic Damping Sensors (1,000Hz sampling)',
      'Lightweight Anodized Aluminum Shock Bodies',
      'Remote Hydraulic Preload Spring Adjuster',
      'CAN-bus Ride Height & Body Roll Integration'
    ],
    specifications: {
      'Adjustment Range': '32 Clicks Damping, 50mm Ride Height',
      'Spring Material': 'Cold-Wound Silicon-Chrome Steel',
      'Sensor Response': '0.002 seconds (2ms)',
      'Finish': 'Hard Anodized Gold & Carbon Sheaths',
      'Weight': '14.4 kg full vehicle set'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Veloce Corse',
      'Porsche 911 GT3 / RS',
      'McLaren 750S Spider'
    ],
    frequentlyBoughtTogether: ['pt-brake-01', 'pt-wheel-01']
  },
  {
    id: 'pt-wheel-01',
    name: 'Monoblock Forged Aero-Turbine 21" Center-Lock Wheels',
    brand: 'BBS Motorsport',
    category: 'Wheels',
    price: 5200,
    formattedPrice: formatINR(5200),
    oldPrice: 5900,
    formattedOldPrice: formatINR(5900),
    discount: '12% OFF',
    discountNum: 12,
    rating: 5.0,
    reviews: 29,
    stockCount: 5,
    sku: 'CC-WHL-2101',
    image: '/images/parts/wheel_forged_turbofan.jpg',
    gallery: ['/images/parts/wheel_forged_turbofan.jpg'],
    description: 'Aerospace-grade 6061-T6 forged aluminum alloy featuring functional directional aero vanes that extract heat directly from the carbon-ceramic brakes at speeds exceeding 140 mph.',
    features: [
      'Monoblock Forging from 10,000-Ton Hydraulic Press',
      'Directional Heat-Extraction Air Vanes',
      'Center-Lock and 5x112 Conversion Options',
      'Knurled Bead Seats to Prevent Tire Slip Under High Torque',
      'Weight per wheel: Only 8.9 kg'
    ],
    specifications: {
      'Size Front': '21x9.5J ET28',
      'Size Rear': '21x12J ET35',
      'Bolt Pattern': 'Center-Lock or 5x112 / 5x130',
      'Color Finish': 'Satin Titanium Bronze or Stealth Matte',
      'Load Rating': '850 kg per corner'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Spectre EV-7',
      'Porsche Taycan & 911 Turbo',
      'Universal High-Performance 5x112 Hubs'
    ],
    frequentlyBoughtTogether: ['pt-tyre-01', 'pt-brake-01']
  },
  {
    id: 'pt-tyre-01',
    name: 'Pilot Sport Cup 2 R Track Semi-Slick Tyres (Set of 4)',
    brand: 'Michelin',
    category: 'Tyres',
    price: 2450,
    formattedPrice: formatINR(2450),
    oldPrice: 2750,
    formattedOldPrice: formatINR(2750),
    discount: '11% OFF',
    discountNum: 11,
    rating: 4.9,
    reviews: 73,
    stockCount: 15,
    sku: 'CC-TYR-2004',
    image: '/images/parts/tyre_michelin_cup2.jpg',
    gallery: ['/images/parts/tyre_michelin_cup2.jpg'],
    description: 'Competition-grade semi-slick compound delivering up to 1.8G lateral grip. Formulated with motorsport synthetic elastomers for maximum contact patch adhesion on warm tarmac.',
    features: [
      'Dual-Compound Track 2.0 Rubber Matrix',
      'Dynamic Response Technology with Aramid & Nylon Belt',
      'Deep Outer Shoulder for Razor-Sharp Turn-In',
      '1.8G Peak Lateral Cornering Capability',
      'DOT & ECE Road Legal Certification'
    ],
    specifications: {
      'Dimensions Front': '265/35 ZR21 (98Y) XL',
      'Dimensions Rear': '325/30 ZR21 (108Y) XL',
      'Speed Rating': '(Y) > 300 km/h (186+ mph)',
      'Treadwear Rating': 'UTQG 140 AA A',
      'Rim Compatibility': '21-inch Diameter'
    },
    compatibility: [
      'All 21-inch Wheel Sets',
      'CARCRAFT Apex GT-R',
      'CARCRAFT Veloce Corse',
      'Porsche GT3 RS & GT2 RS'
    ],
    frequentlyBoughtTogether: ['pt-wheel-01', 'pt-brake-01']
  },
  {
    id: 'pt-ext-01',
    name: 'Pre-Preg Dry Carbon Aerodynamic Front Splitter & Canards',
    brand: 'CARCRAFT Performance',
    category: 'Exterior',
    price: 2650,
    formattedPrice: formatINR(2650),
    oldPrice: 3100,
    formattedOldPrice: formatINR(3100),
    discount: '15% OFF',
    discountNum: 15,
    rating: 4.8,
    reviews: 41,
    stockCount: 9,
    sku: 'CC-EXT-3105',
    image: '/images/parts/aerodynamics_carbon_splitter.jpg',
    gallery: ['/images/parts/aerodynamics_carbon_splitter.jpg'],
    description: 'Autoclave-cured 2x2 twill pre-preg dry carbon fiber with high-gloss UV protective clearcoat. Generates up to 110 kg of front-axle downforce at 155 mph while weighing just 3.1 kg.',
    features: [
      'Aerospace Spec Pre-Preg Dry Carbon Fiber Construction',
      'High-Temperature Autoclave Cured for Structural Rigidity',
      'Wind-Tunnel Developed Integrated Aerodynamic Canards',
      'High-Gloss 3K Carbon Finish with UV Inhibitors',
      'Pre-drilled for Direct OEM Mounting Points'
    ],
    specifications: {
      'Downforce Generation': '110 kg @ 155 mph (250 km/h)',
      'Weight': '3.1 kg complete assembly',
      'Weave Pattern': '2x2 Twill 3K Carbon',
      'Clearcoat': 'Anti-UV Ceramic Infused Clear Coat',
      'Hardware': 'Stainless Steel Quick-Mount Brackets'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Spectre EV-7'
    ],
    frequentlyBoughtTogether: ['pt-ext-02', 'pt-wheel-01']
  },
  {
    id: 'pt-ext-02',
    name: 'Active Swan-Neck Dual-Element Carbon Rear Wing',
    brand: 'CARCRAFT Performance',
    category: 'Exterior',
    price: 4600,
    formattedPrice: formatINR(4600),
    oldPrice: 5200,
    formattedOldPrice: formatINR(5200),
    discount: '11% OFF',
    discountNum: 11,
    rating: 5.0,
    reviews: 21,
    stockCount: 4,
    sku: 'CC-EXT-3108',
    image: '/images/parts/aerodynamics_gt_wing.jpg',
    gallery: ['/images/parts/aerodynamics_gt_wing.jpg'],
    description: 'High-downforce swan-neck wing featuring integrated servo actuators that automatically vary angle-of-attack between 0° (low drag) and 28° (airbrake / high downforce) based on vehicle braking telemetry.',
    features: [
      'Full Pre-Preg Carbon Fiber Airfoil Element',
      'Dual High-Torque Brushless Servo Actuators',
      'DRS (Drag Reduction System) Automatic High-Speed Deploy',
      'Integrated High-Mount Brake Light in Carbon Gurney Flap',
      'Supports up to 480 kg of Downforce'
    ],
    specifications: {
      'Span Width': '1,680mm Wide',
      'Angle of Attack': '0° to 28° Motorized Range',
      'Actuator Speed': '0.3s Full Airbrake Deploy',
      'Pylon Material': 'CNC Billet 7075-T6 Anodized Aluminum',
      'Total Weight': '6.4 kg'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Veloce Corse',
      'Universal Coupe Decklid (Chassis Mount)'
    ],
    frequentlyBoughtTogether: ['pt-ext-01', 'pt-susp-01']
  },
  {
    id: 'pt-int-01',
    name: 'Alcantara & Carbon LED Steering Wheel with Telemetry OLED',
    brand: 'CARCRAFT Bespoke',
    category: 'Interior',
    price: 1850,
    formattedPrice: formatINR(1850),
    oldPrice: 2200,
    formattedOldPrice: formatINR(2200),
    discount: '16% OFF',
    discountNum: 16,
    rating: 4.9,
    reviews: 82,
    stockCount: 14,
    sku: 'CC-INT-7001',
    image: '/images/parts/interior_racing_steering_wheel.jpg',
    gallery: ['/images/parts/interior_racing_steering_wheel.jpg'],
    description: 'Hand-stitched genuine Italian Alcantara with 2x2 matte carbon trim. Features a built-in OLED telemetry display providing real-time 0-60 timers, lap delta, oil/coolant temperatures, and progressive F1 RPM shift lights.',
    features: [
      'Integrated 2.4-inch OLED Telemetry Screen',
      '16-LED Progressive Sequential Shift Light Bar',
      'Plug-and-Play Wireless CAN-bus OBD-II Receiver',
      'Genuine Italian Alcantara with Acid Lime Stitching',
      'Magnetic Paddle Shifters with Carbon Fiber Blades'
    ],
    specifications: {
      'Diameter': '360mm Flat-Bottom Sport Profile',
      'Display Features': 'RPM, Speed, Lap Timer, Oil Temp, G-Force',
      'Connection': 'Encrypted 2.4GHz CAN-bus Wireless Receiver',
      'Core': 'Magnesium Alloy Structural Skeleton',
      'Warranty': '2-Year Electronics & Craftsmanship Guarantee'
    },
    compatibility: [
      'CARCRAFT Apex GT-R & Spectre EV-7',
      'CARCRAFT Veloce Corse',
      'Universal CAN-bus OBD-II Equipped Vehicles'
    ],
    frequentlyBoughtTogether: ['pt-elec-01', 'pt-perf-01']
  },
  {
    id: 'pt-int-02',
    name: 'FIA-Certified Carbon Monocoque Bucket Seats (Pair)',
    brand: 'Recaro Pro',
    category: 'Interior',
    price: 4950,
    formattedPrice: formatINR(4950),
    oldPrice: 5600,
    formattedOldPrice: formatINR(5600),
    discount: '12% OFF',
    discountNum: 12,
    rating: 5.0,
    reviews: 18,
    stockCount: 4,
    sku: 'CC-INT-7020',
    image: '/images/parts/interior_paddle_shifters.jpg',
    gallery: ['/images/parts/interior_paddle_shifters.jpg'],
    description: 'Ultra-lightweight autoclaved carbon fiber racing buckets weighing just 4.8 kg each. Upholstered in fire-retardant perforated Alcantara with integrated lumbar pneumatic bladders for custom posture adjustment.',
    features: [
      'FIA 8855-1999 Homologated Racing Certification',
      'Exposed Gloss Carbon-Aramid Monocoque Shell',
      'Pneumatic Lumbar & Bolster Inflatable Cushions',
      'Compatible with 4-Point, 5-Point and 6-Point Harnesses',
      'Weighs only 4.8 kg per seat'
    ],
    specifications: {
      'Shell Material': 'Carbon-Kevlar Composite',
      'Upholstery': 'Fire-Resistant Alcantara & High-Density Memory Foam',
      'Weight': '4.8 kg (10.5 lbs) per bare shell',
      'Brackets': 'Steel / Aluminum FIA Side Mounts Included',
      'Harness Slots': '4, 5, or 6 Point Configuration'
    },
    compatibility: [
      'CARCRAFT Veloce Corse',
      'CARCRAFT Apex GT-R',
      'Universal Track & Sports Car Floor Rails'
    ],
    frequentlyBoughtTogether: ['pt-int-01', 'pt-acc-01']
  },
  {
    id: 'pt-elec-01',
    name: 'Pro Racing Telemetry Data Logger & CAN-bus Hub',
    brand: 'AiM Motorsport',
    category: 'Electronics',
    price: 1450,
    formattedPrice: formatINR(1450),
    oldPrice: 1650,
    formattedOldPrice: formatINR(1650),
    discount: '12% OFF',
    discountNum: 12,
    rating: 4.8,
    reviews: 35,
    stockCount: 16,
    sku: 'CC-ELC-1090',
    image: '/images/parts/telemetry_display_module.jpg',
    gallery: ['/images/parts/telemetry_display_module.jpg'],
    description: 'High-precision 25Hz GPS receiver with 3-axis accelerometer and 16-channel CAN-bus datalogger. Synchronizes speed, throttle position, brake pressure, yaw rate, and lap delta directly with the CARCRAFT mobile app.',
    features: [
      '25Hz Multi-Constellation GPS + GLONASS Sensor',
      'Internal 32GB Flash Memory for 1,000+ Track Hours',
      'Direct CAN-bus & OBD-II Integration',
      'Bluetooth 5.3 & Wi-Fi Cloud Sync with iOS/Android Suite',
      'Predictive Real-Time Lap Timing with 0.01s Precision'
    ],
    specifications: {
      'Sampling Frequency': '100 Hz per CAN channel / 25 Hz GPS',
      'Inputs': '16 CAN Channels + 4 Analog 0-5V Channels',
      'Dimensions': '112 x 78 x 26 mm',
      'Enclosure': 'IP67 Water and Dust Resistant Aluminum Casing',
      'Power Supply': '9V - 16V Vehicle DC'
    },
    compatibility: [
      'Universal OBD-II / CAN-bus (All CARCRAFT Fleet)',
      'Porsche, Ferrari, McLaren, Lamborghini CAN Systems'
    ],
    frequentlyBoughtTogether: ['pt-int-01', 'pt-perf-01']
  },
  {
    id: 'pt-light-01',
    name: 'Adaptive Laser Matrix Headlight Conversion Units',
    brand: 'Hella Automotive',
    category: 'Lighting',
    price: 3200,
    formattedPrice: formatINR(3200),
    oldPrice: 3700,
    formattedOldPrice: formatINR(3700),
    discount: '14% OFF',
    discountNum: 14,
    rating: 4.9,
    reviews: 24,
    stockCount: 7,
    sku: 'CC-LGT-6500',
    image: '/images/parts/lighting_matrix_headlight.jpg',
    gallery: ['/images/parts/lighting_matrix_headlight.jpg'],
    description: 'High-intensity laser diode modules projecting up to 600 meters of road illumination. Digital micromirror technology masks oncoming vehicles in real time while maintaining high-beam visibility on road edges.',
    features: [
      '600-Meter High-Intensity Laser High Beam Reach',
      '84-Pixel Adaptive Anti-Glare Matrix Shielding',
      'Dynamic Welcome Choreography Lighting Animation',
      'Integrated Sequential Acid-Lime Daytime Running Lights',
      'DOT & SAE Compliant with Built-In Automatic Leveling'
    ],
    specifications: {
      'Luminous Output': '12,000 Lumens per pair',
      'Color Temperature': '6,000K Pure Daylight White',
      'Beam Distance': '600 Meters (0.25 Lux standard)',
      'Lifespan': '30,000 Operating Hours',
      'Housing': 'Polycarbonate Hard-Coated Anti-Scratch Lens'
    },
    compatibility: [
      'CARCRAFT Spectre EV-7',
      'CARCRAFT Apex GT-R',
      'Direct OE Replacement for Selected Xenon/LED Models'
    ],
    frequentlyBoughtTogether: ['pt-ext-01', 'pt-elec-01']
  },
  {
    id: 'pt-perf-01',
    name: 'Titanium Lightweight Inconel Valved Exhaust System',
    brand: 'Akrapovič',
    category: 'Performance',
    price: 7200,
    formattedPrice: formatINR(7200),
    oldPrice: 8100,
    formattedOldPrice: formatINR(8100),
    discount: '11% OFF',
    discountNum: 11,
    rating: 5.0,
    reviews: 44,
    stockCount: 3,
    sku: 'CC-PRF-8800',
    image: '/images/parts/exhaust_titanium_akrapovic.jpg',
    gallery: ['/images/parts/exhaust_titanium_akrapovic.jpg'],
    description: 'Handcrafted aerospace-grade titanium and Inconel 625 active valved exhaust. Sheds 22.4 kg of rear weight while optimizing scavenge velocity to release an additional 38 horsepower and a spine-tingling acoustic note.',
    features: [
      'Inconel 625 & Grade 5 Titanium Construction',
      'Electro-Pneumatic Active Exhaust Flaps with Cockpit Switch',
      '22.4 kg Weight Saving over Standard Steel Systems',
      '+38 BHP and +45 Nm Torque Verified on Dyno',
      'Quad Carbon Fiber Tailpipes with Acid Lime Inner Sleeves'
    ],
    specifications: {
      'Material': 'Inconel 625 Headers & Grade 5 Titanium Mufflers',
      'Weight Reduction': '-22.4 kg (-49.4 lbs)',
      'Power Gain': '+38.2 HP @ 7,800 RPM',
      'Sound Level': 'Quiet Mode: 84 dB / Track Mode: 112 dB',
      'Piping Diameter': 'Dual 76mm (3.0-inch) Mandrel Bent'
    },
    compatibility: [
      'CARCRAFT Veloce Corse',
      'Ferrari 296 GTB / GTS',
      'McLaren 750S / 720S'
    ],
    frequentlyBoughtTogether: ['pt-turbo-01', 'pt-perf-02']
  },
  {
    id: 'pt-perf-02',
    name: 'Plug-and-Play ECU Telemetry Engine Remap Module',
    brand: 'HKS Power',
    category: 'Performance',
    price: 1650,
    formattedPrice: formatINR(1650),
    oldPrice: 1950,
    formattedOldPrice: formatINR(1950),
    discount: '15% OFF',
    discountNum: 15,
    rating: 4.8,
    reviews: 52,
    stockCount: 11,
    sku: 'CC-PRF-2110',
    image: '/images/parts/performance_carbon_intake.jpg',
    gallery: ['/images/parts/performance_carbon_intake.jpg'],
    description: 'Microprocessor-controlled piggyback engine management unit. Intercepts sensor telemetry to optimize boost curves, cam phasing, and ignition timing. Instantly switch between Eco, Sport, and Race maps via smartphone.',
    features: [
      'Dyno-Proven Power Increases up to +95 BHP',
      '3 Switchable Power Maps via Bluetooth iOS/Android App',
      'OEM Engine Protection Protocols Fully Preserved',
      'Zero Traceable Footprint (Easily Removed for Warranty)',
      'Integrated High-Speed CAN-bus Communication'
    ],
    specifications: {
      'Processor': '32-bit Automotive MCU running at 180MHz',
      'Power Output Increase': '+65 to +95 BHP (depending on fuel octane)',
      'Torque Increase': '+110 Nm',
      'Connectivity': 'Bluetooth Low Energy 5.2',
      'Installation': '15-minute OEM Plug-and-Play Harness'
    },
    compatibility: [
      'CARCRAFT Veloce Corse',
      'CARCRAFT Horizon X-Cross',
      'Twin-Turbo V6 / V8 Gasoline Platforms'
    ],
    frequentlyBoughtTogether: ['pt-perf-01', 'pt-turbo-01']
  },
  {
    id: 'pt-acc-01',
    name: 'Smart 360° Magnetic High-Current EV Fast Charger',
    brand: 'CARCRAFT Energy',
    category: 'Accessories',
    price: 1250,
    formattedPrice: formatINR(1250),
    oldPrice: 1450,
    formattedOldPrice: formatINR(1450),
    discount: '14% OFF',
    discountNum: 14,
    rating: 4.9,
    reviews: 88,
    stockCount: 22,
    sku: 'CC-ACC-5501',
    image: '/images/parts/accessories_carbon_luggage.jpg',
    gallery: ['/images/parts/accessories_carbon_luggage.jpg'],
    description: 'Wall-mounted 22kW AC Level 2 smart home charger. Features magnetic breakaway connection, RFID client authorization, solar surplus charging integration, and live energy analytics on the CARCRAFT mobile suite.',
    features: [
      'Up to 22kW Fast AC Charging (48A / 400V 3-Phase)',
      'Magnetic Quick-Release Cable Dock with Auto-Lock',
      'Wi-Fi & 4G Connected with Remote Scheduling',
      'Integrated Energy Metering with Off-Peak Tariff Automation',
      'NEMA 4 / IP66 Weatherproof for Indoor/Outdoor Installation'
    ],
    specifications: {
      'Power Output': 'Adjustable 7.4kW to 22kW (32A - 48A)',
      'Connector': 'Universal Type 2 / CCS Compatible',
      'Cable Length': '7.5 Meters Premium High-Flex Cord',
      'Certifications': 'UL, CE, TÜV Certified',
      'Dimensions': '360 x 240 x 130 mm'
    },
    compatibility: [
      'CARCRAFT Apex GT-R',
      'CARCRAFT Spectre EV-7',
      'All J1772 & Type 2 Electric & Plug-In Hybrid Vehicles'
    ],
    frequentlyBoughtTogether: ['pt-care-01', 'pt-acc-02']
  },
  {
    id: 'pt-acc-02',
    name: 'Bespoke Quilted Waterproof Indoor/Outdoor Car Cover',
    brand: 'CARCRAFT Bespoke',
    category: 'Accessories',
    price: 680,
    formattedPrice: formatINR(680),
    oldPrice: 800,
    formattedOldPrice: formatINR(800),
    discount: '15% OFF',
    discountNum: 15,
    rating: 4.8,
    reviews: 37,
    stockCount: 18,
    sku: 'CC-ACC-9011',
    image: '/images/parts/accessories_car_cover.jpg',
    gallery: ['/images/parts/accessories_car_cover.jpg'],
    description: 'Precision-tailored 4-layer breathable membrane with soft fleece inner lining that shields bodywork against dust, UV degradation, moisture, and micro-scratches. Includes embossed CARCRAFT logo and duffle bag.',
    features: [
      '4-Layer Hydrophobic Microporous Breathable Membrane',
      'Ultra-Soft Anti-Scratch Inner Microfiber Fleece',
      'Tailored Mirror Pockets and Elastic Hem Cords',
      'Integrated Under-Chassis Quick-Buckle Straps',
      'Compact Monogrammed Storage Duffle Included'
    ],
    specifications: {
      'Material': 'Polyester with TPU Membrane and Cotton Fleece',
      'UV Protection Factor': 'UPF 50+ Sun Barrier',
      'Water Resistance': '5,000mm Hydrostatic Head',
      'Warranty': '3-Year All-Weather Guarantee'
    },
    compatibility: [
      'Tailored Sizes for All CARCRAFT Supercars, Sedans & SUVs',
      'Universal Coupe / Supercar Sizing (Size L & XL)'
    ],
    frequentlyBoughtTogether: ['pt-care-01', 'pt-acc-01']
  },
  {
    id: 'pt-care-01',
    name: 'Graphene Ceramic Nanotech Protective Coating Kit',
    brand: "Gyeon Quartz",
    category: 'Car Care',
    price: 280,
    formattedPrice: formatINR(280),
    oldPrice: 340,
    formattedOldPrice: formatINR(340),
    discount: '18% OFF',
    discountNum: 18,
    rating: 4.9,
    reviews: 114,
    stockCount: 30,
    sku: 'CC-CAR-1120',
    image: '/images/parts/care_ceramic_detailing.jpg',
    gallery: ['/images/parts/care_ceramic_detailing.jpg'],
    description: 'Next-generation reduced graphene oxide (rGO) ceramic matrix providing 10H surface hardness, hydrophobic water beading exceeding 115° contact angles, and up to 5 years of swirl and bird-dropping resistance.',
    features: [
      '10H Mohs Hardness Scratch-Resistant Surface Film',
      '118° Superhydrophobic Water Contact Angle',
      'Thermal Heat Resistance up to 800°C on Brake Calipers',
      'Enhanced Depth of Gloss and Paint Reflection',
      'Complete Kit with Prep Polish, Applicator & Microfibers'
    ],
    specifications: {
      'Bottle Volume': '50ml (Enough for 2 Complete Supercar Coats)',
      'Durability': 'Up to 5 Years / 50,000 Miles',
      'Cure Time': '12 Hours Initial / 7 Days Full Bond',
      'Chemical Resistance': 'pH 2 to pH 13'
    },
    compatibility: [
      'All Paintwork, Clearcoat, Matte Wraps, PPF, Carbon & Wheels',
      'Universal Application for All Automotive Finishes'
    ],
    frequentlyBoughtTogether: ['pt-acc-02', 'pt-acc-01']
  }
];

export const partCategories = [
  'All',
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
