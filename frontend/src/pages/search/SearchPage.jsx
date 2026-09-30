import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Car, 
  Wrench, 
  MapPin, 
  BookOpen, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles,
  Zap
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import { mockParts } from '../../data/parts';
import { dealershipHubs } from '../../data/dealerships';
import { journalArticles } from '../../data/journalData';
import { formatINR } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './SearchPage.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  // Filter vehicles
  const matchedVehicles = useMemo(() => {
    if (!query.trim()) return mockVehicles.slice(0, 3);
    const q = query.toLowerCase();
    return mockVehicles.filter((v) => 
      v.model.toLowerCase().includes(q) || 
      v.brand.toLowerCase().includes(q) || 
      (v.category && v.category.toLowerCase().includes(q))
    );
  }, [query]);

  // Filter parts
  const matchedParts = useMemo(() => {
    if (!query.trim()) return (mockParts || []).slice(0, 3);
    const q = query.toLowerCase();
    return (mockParts || []).filter((p) => 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [query]);

  // Filter hubs
  const matchedHubs = useMemo(() => {
    if (!query.trim()) return dealershipHubs.slice(0, 3);
    const q = query.toLowerCase();
    return dealershipHubs.filter((h) => 
      h.name.toLowerCase().includes(q) || 
      h.city.toLowerCase().includes(q)
    );
  }, [query]);

  // Filter articles
  const matchedArticles = useMemo(() => {
    if (!query.trim()) return journalArticles.slice(0, 2);
    const q = query.toLowerCase();
    return journalArticles.filter((a) => 
      a.title.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="search-page">
      <Navbar />

      <main className="search-container">
        {/* Header */}
        <div className="search-header">
          <div className="search-badge">
            <Zap size={13} />
            CARCRAFT OMNIBAR // UNIFIED SEARCH
          </div>
          <h1 className="search-title">Universal Search</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Instant intelligence across hypercar models, carbon performance components, global atelier studios, and engineering dispatches.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="search-input-wrapper">
          <Search size={24} color="#bef264" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Type vehicle model, component SKU, studio city or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Quick Command Direct Links */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <Link to="/configurator" style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#bef264', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Space Grotesk' }}>
            ⚡ 3D Configurator
          </Link>
          <Link to="/test-drive" style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#38bdf8', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Space Grotesk' }}>
            🏁 Test Drive Circuit
          </Link>
          <Link to="/compare" style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Space Grotesk' }}>
            📊 Spec Comparison Matrix
          </Link>
          <Link to="/financing" style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#bef264', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Space Grotesk' }}>
            💳 Lease & Finance Calculator
          </Link>
          <Link to="/dealerships" style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Space Grotesk' }}>
            📍 Global Atelier Network
          </Link>
        </div>

        {/* Vehicles Section */}
        {matchedVehicles.length > 0 && (
          <div className="search-category-group">
            <div className="search-category-title">
              Vehicles ({matchedVehicles.length})
            </div>
            <div className="search-results-list">
              {matchedVehicles.map((car) => (
                <Link key={car.id} to={`/vehicles/${car.id}`} className="search-result-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={car.image} alt={car.model} onError={handleImageError} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>
                        {car.brand} {car.model}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {car.power} • {car.acceleration} • {car.category}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#bef264', fontSize: '0.95rem' }}>
                      {car.formattedPrice}
                    </span>
                    <ArrowRight size={14} color="#64748b" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Parts Section */}
        {matchedParts.length > 0 && (
          <div className="search-category-group">
            <div className="search-category-title">
              Components & Aero Parts ({matchedParts.length})
            </div>
            <div className="search-results-list">
              {matchedParts.map((part) => (
                <Link key={part.id} to={`/parts/${part.id}`} className="search-result-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bef264' }}>
                      <Wrench size={18} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}>
                        {part.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        SKU: {part.sku} • {part.category}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#bef264', fontSize: '0.9rem' }}>
                      {part.formattedPrice || formatINR(part.price)}
                    </span>
                    <ArrowRight size={14} color="#64748b" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Global Ateliers Section */}
        {matchedHubs.length > 0 && (
          <div className="search-category-group">
            <div className="search-category-title">
              Dealership Studios ({matchedHubs.length})
            </div>
            <div className="search-results-list">
              {matchedHubs.map((hub) => (
                <Link key={hub.id} to="/dealerships" className="search-result-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <MapPin size={20} color="#bef264" />
                    <div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}>
                        {hub.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {hub.address}, {hub.city}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="#64748b" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
