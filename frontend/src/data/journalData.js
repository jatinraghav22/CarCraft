// CARCRAFT Telemetry Journal & Engineering News

export const journalArticles = [
  {
    id: 'art-01',
    title: 'Breaking the 20-Second Barrier: How Silicon-Carbide Inverters Revolutionized the Apex GT-R',
    category: 'Engineering',
    date: 'September 24, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    summary: 'An inside look at our 800V quad axial-flux motor architecture and how liquid-cooled silicon-carbide switches eliminate thermal throttling on endurance circuits.',
    content: `When our engineering division began development on the Apex GT-R, the brief was uncompromising: sustain maximum 1,280 horsepower output through an entire 14-lap stint at the Nürburgring Nordschleife without a single watt of thermal de-rating.

Traditional automotive inverters rely on silicon IGBTs, which generate immense resistive heat when pulsing high amperage during continuous track use. By transitioning to custom military-spec Silicon-Carbide (SiC) MOSFETs operating at switching frequencies exceeding 100 kHz, switching losses were curtailed by 78%.

Coupled with our proprietary dielectric oil direct-rotor immersion cooling, the Apex GT-R maintains peak stator temperatures below 68°C even after repeated 0-200 km/h sprint cycles.`
  },
  {
    id: 'art-02',
    title: 'Laguna Seca Corkscrew Telemetry: Balancing Downforce and Drag at 140 MPH',
    category: 'Track Telemetry',
    date: 'September 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    summary: 'Analyzing suspension telemetry data from our recent closed-circuit aerodynamic testing sessions across California and Germany.',
    content: `The Corkscrew at WeatherTech Raceway Laguna Seca represents the ultimate stress test for active ground-effects. As the vehicle crests Turn 8 and plunges five stories down through Turn 8A, normal load shifts violently from the front to rear axle within 0.4 seconds.

Our active carbon venturi tunnels automatically adjust their variable throat strakes in real-time, holding aerodynamic center-of-pressure locked exactly 42% forward. The result is total steering authority during airborne compression.`
  },
  {
    id: 'art-03',
    title: 'The Art of Exposed Weave: Crafting Single-Piece Carbon Monocoques',
    category: 'Heritage',
    date: 'August 28, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    summary: 'A photo journey through our Modena carbon composite autoclaves where pre-preg aerospace fibers are laid by master artisans.',
    content: `Every CarCraft monocoque requires 420 individual sheets of Toray T1100 carbon fiber, precisely aligned by hand to ensure structural grain continuity across exterior body panels. Baked under 9 bars of pressure at 140°C, each chassis delivers over 52,000 Nm/degree of torsional rigidity.`
  }
];
