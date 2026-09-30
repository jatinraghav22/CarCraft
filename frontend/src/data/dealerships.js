// CARCRAFT Global Studios & Dealership Hubs Dataset
// Aligned with future Django REST API: GET /api/dealerships/, POST /api/test-drives/

export const dealershipHubs = [
  {
    id: 'hub-sv-flagship',
    name: 'Silicon Valley Flagship Studio',
    city: 'Palo Alto, California',
    country: 'United States',
    address: '280 Sand Hill Road, Suite 400',
    phone: '+1 (650) 843-9200',
    email: 'siliconvalley@carcraft.io',
    operatingHours: 'Mon - Sat: 09:00 - 19:00 PST',
    hasTrackAccess: true,
    trackName: 'Laguna Seca Circuit Partner Access',
    image: 'https://images.unsplash.com/photo-1541348263662-e0c82661ab25?auto=format&fit=crop&w=800&q=80',
    badge: 'GLOBAL HEADQUARTERS',
    facilities: ['Dynamic 800V DC Hyperchargers', 'Private Telemetry Tunnel', 'VIP Client Lounge', 'Carbon Tub Fitting Bay']
  },
  {
    id: 'hub-manhattan',
    name: 'Manhattan Sky Studio',
    city: 'New York City, New York',
    country: 'United States',
    address: '432 Park Avenue Atelier',
    phone: '+1 (212) 590-3300',
    email: 'manhattan@carcraft.io',
    operatingHours: 'Mon - Sat: 10:00 - 20:00 EST',
    hasTrackAccess: false,
    trackName: 'Monticello Motor Club Reserved Access',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    badge: 'METROPOLITAN ATELIER',
    facilities: ['Private Rooftop Helipad', 'Virtual 360 Turntable', 'Client Whiskey & Espresso Bar']
  },
  {
    id: 'hub-monaco',
    name: 'Monaco Riviera Atelier',
    city: 'Monte Carlo',
    country: 'Monaco',
    address: '7 Boulevard de Suisse, Port Hercule',
    phone: '+377 98 90 22 10',
    email: 'monaco@carcraft.io',
    operatingHours: 'Tue - Sun: 09:30 - 19:30 CET',
    hasTrackAccess: true,
    trackName: 'Circuit de Monaco Grand Prix Course',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    badge: 'RIVIERA SUPERYACHT DOCK',
    facilities: ['Marina Berth Vehicle Docking', 'Coastal Alpine Highway Route', 'Concierge Driver Service']
  },
  {
    id: 'hub-nurburgring',
    name: 'Nürburgring Apex Center',
    city: 'Nürburg, Rhineland-Palatinate',
    country: 'Germany',
    address: 'Otto-Flimm-Straße 1',
    phone: '+49 2691 3020',
    email: 'nurburg@carcraft.io',
    operatingHours: 'Mon - Sun: 08:00 - 20:00 CET',
    hasTrackAccess: true,
    trackName: 'Nordschleife 20.8km Full Circuit Access',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    badge: 'HIGH-SPEED TEST TRACK',
    facilities: ['FIA-Grade Pit Garages', 'Full Telemetry Data Analysis', 'Pro Race Helmet & Suit Fitting']
  },
  {
    id: 'hub-tokyo',
    name: 'Tokyo Ginza Tower',
    city: 'Chuo City, Tokyo',
    country: 'Japan',
    address: '6-10-1 Ginza, Chuo-ku',
    phone: '+81 3 5537 9900',
    email: 'tokyo@carcraft.io',
    operatingHours: 'Mon - Sun: 10:00 - 21:00 JST',
    hasTrackAccess: true,
    trackName: 'Fuji Speedway Private Session',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    badge: 'CYBER ARCHITECTURE',
    facilities: ['Robotic Turntable Display', 'Bespoke Japanese Indigo Leather Room', 'Wangan Expressway Route']
  },
  {
    id: 'hub-dubai',
    name: 'Dubai Marina Pavilion',
    city: 'Dubai Marina',
    country: 'United Arab Emirates',
    address: 'Al Marsa Street, Marina Gate 1',
    phone: '+971 4 458 7700',
    email: 'dubai@carcraft.io',
    operatingHours: 'Sat - Thu: 10:00 - 22:00 GST',
    hasTrackAccess: true,
    trackName: 'Dubai Autodrome Circuit Access',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    badge: 'DESERT AERODYNAMICS',
    facilities: ['Air-Conditioned Private Garages', 'Sheikh Zayed Highway Test Route', 'Gold Concierge Lounge']
  }
];

export const experienceTiers = [
  {
    id: 'tier-street',
    name: 'City & Coastal Pilot',
    duration: '45 Minutes',
    badge: 'COMPLIMENTARY',
    cost: '₹0 (Member Privilege)',
    description: 'Experience highway acceleration, active suspension comfort, and daily ergonomics guided by a CarCraft specialist.',
    features: ['Highway Pulls & Launch Control', 'Active Noise Cancellation Demo', 'Infotainment & HUD Overview']
  },
  {
    id: 'tier-track',
    name: 'Circuit Telemetry Masterclass',
    duration: '90 Minutes',
    badge: 'HIGH PERFORMANCE',
    cost: '₹35,000 (Waived with vehicle purchase)',
    description: 'Full track session with an FIA-certified instructor. Real-time telemetry monitoring, skidpad dynamics, and apex clipping.',
    features: ['10 Laps on Private Closed Circuit', 'Telemetry Data Lap Review', 'Carbon-Ceramic Braking Limit Testing', 'Nomex Racing Suit Provided']
  },
  {
    id: 'tier-vip',
    name: 'Private Atelier VIP Day',
    duration: 'Full Day (6 Hours)',
    badge: 'ULTRA EXCLUSIVE',
    cost: '₹1,50,000 (Credited toward allocation)',
    description: 'The pinnacle CarCraft experience. Private helicopter transfer, multi-vehicle comparison drives, bespoke tailoring atelier, and chef dining.',
    features: ['Test Up To 3 Different Hypercars', 'Helicopter / Chauffeur Transit', 'Bespoke Color & Material Commissioning', 'Private Chef Dining for Two']
  }
];

export const conciergeInstructors = [
  {
    id: 'inst-marcus',
    name: 'Marcus Sterling',
    title: 'Lead Development Driver',
    credentials: 'Ex-Le Mans LMP1 Pilot, 14 Years Vehicle Dynamics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    specialty: 'High-Downforce Aero & Brake Modulation'
  },
  {
    id: 'inst-elena',
    name: 'Elena Rostova',
    title: 'Senior Track Master',
    credentials: 'Nürburgring 24h Finisher, Master Dynamics Instructor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    specialty: 'Torque Vectoring & Oversteer Recovery'
  },
  {
    id: 'inst-kenji',
    name: 'Kenji Sato',
    title: 'EV Powertrain Engineer & Test Pilot',
    credentials: 'Super GT Driver, 800V High-Voltage Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    specialty: 'Electric Instant Torque & Regenerative Trail Braking'
  }
];
