// CARCRAFT Virtual Showroom - Curated Studio Showcase Data
import { mockVehicles } from './vehicles';

export const showroomSpotlight = mockVehicles.find((v) => v.id === 'cc-apex-gtr') || mockVehicles[0];

export const showroomZones = [
  {
    id: 'featured',
    title: 'Featured Vehicles',
    badge: 'Curator Selection',
    subtitle: 'The zenith of high-performance automotive engineering and design aesthetics.',
    vehicleIds: ['cc-apex-gtr', 'rimac-nevera', 'lamborghini-revuelto']
  },
  {
    id: 'performance',
    title: 'Performance Zone',
    badge: 'Track Weaponry',
    subtitle: 'Aerodynamically honed track weapons engineered for blistering lap records and raw acoustic sensory response.',
    vehicleIds: ['cc-veloce-corse', 'ferrari-296-gtb', 'mclaren-750s-spider']
  },
  {
    id: 'electric',
    title: 'Electric Garage',
    badge: '800V Architecture',
    subtitle: 'Silent, instantaneous torque with quad-motor yaw telemetry and ultra-fast liquid-cooled battery architectures.',
    vehicleIds: ['cc-apex-gtr', 'cc-spectre-ev7', 'porsche-taycan-gt', 'rimac-nevera']
  },
  {
    id: 'luxury',
    title: 'Luxury Collection',
    badge: 'Grand Touring',
    subtitle: 'Handcrafted executive sanctuaries, whisper-quiet autonomous highway cruising, and imposing road presence.',
    vehicleIds: ['cc-spectre-ev7', 'cc-horizon-xcross', 'mercedes-amg-gt63']
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    badge: '2026 Allocations',
    subtitle: 'Recently commissioned production allocations available for bespoke customer livery customization.',
    vehicleIds: ['cc-horizon-xcross', 'lamborghini-revuelto', 'cc-veloce-corse']
  }
];

export const studioLightingThemes = [
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    accentColor: '#bef264',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(190, 242, 100, 0.15) 0%, rgba(4, 5, 10, 0.95) 75%)'
  },
  {
    id: 'stealth',
    name: 'Stealth Onyx',
    accentColor: '#94a3b8',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(30, 41, 59, 0.25) 0%, rgba(4, 5, 10, 0.98) 75%)'
  },
  {
    id: 'hyper',
    name: 'Hyper Velocity',
    accentColor: '#38bdf8',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.18) 0%, rgba(4, 5, 10, 0.95) 75%)'
  }
];
