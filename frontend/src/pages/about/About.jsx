import React from 'react';
import { 
  Building2, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { handleImageError } from '../../utils/imageFallback';
import './About.css';

const TIMELINE = [
  { year: '2018', title: 'Skunkworks Inception', desc: 'Founded by ex-aerospace propulsion and F1 aerodynamic engineers in Zurich and Modena.' },
  { year: '2021', title: 'LMP1 Hybrid Victory', desc: 'Clinched privateer class podium at 24 Hours of Le Mans using custom silicon-carbide inverters.' },
  { year: '2024', title: 'Silicon Valley Hub', desc: 'Commissioned our 40,000 sq ft flagship design studio and carbon autoclave facility in California.' },
  { year: '2026', title: 'Apex GT-R Unveiled', desc: 'World debut of the quad-motor carbon monocoque hypercar with 1,280 HP and 1.88s 0-60 MPH.' }
];

const LEADERSHIP = [
  {
    name: 'Henrik Von Klaus',
    title: 'Founder & Chief Executive Officer',
    desc: 'Former Technical Director at FIA World Endurance Championship.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dr. Camille Laurent',
    title: 'Chief Aerodynamics & Telemetry Officer',
    desc: 'Ph.D. in Computational Fluid Dynamics, former aero lead for Red Bull Racing.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Matteo Bellini',
    title: 'Head of Special Atelier Operations',
    desc: 'Master coachbuilder with 25 years specializing in pre-preg carbon autoclaves.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  }
];

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-container">
        {/* Header */}
        <div className="about-header">
          <div className="about-badge">
            <Building2 size={13} />
            CARCRAFT AUTOMOTIVE SUITE // HERITAGE
          </div>
          <h1 className="about-title">Defying Physical Conventions</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Born on the pit lanes of Le Mans and nurtured in California's high-tech corridors, CarCraft merges hand-laid Italian carbon artistry with military-grade silicon-carbide propulsion.
          </p>
        </div>

        {/* Milestone Timeline */}
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>
          Milestone Timeline
        </h2>
        <div className="about-timeline-grid">
          {TIMELINE.map((item) => (
            <div key={item.year} className="about-timeline-card">
              <div className="about-timeline-year">{item.year}</div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.05rem', color: '#fff', margin: '0 0 6px' }}>
                {item.title}
              </h3>
              <p className="about-timeline-text">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Executive Leadership */}
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>
          Executive Leadership
        </h2>
        <div className="about-team-grid">
          {LEADERSHIP.map((leader) => (
            <div key={leader.name} className="about-team-card">
              <img src={leader.image} alt={leader.name} onError={handleImageError} className="about-team-img" />
              <div className="about-team-body">
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: '0 0 4px' }}>
                  {leader.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#bef264', fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
                  {leader.title}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {leader.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
