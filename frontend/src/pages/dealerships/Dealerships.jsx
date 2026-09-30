import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  Compass, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { dealershipHubs } from '../../data/dealerships';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Dealerships.css';

export default function Dealerships() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrackOnly, setFilterTrackOnly] = useState(false);

  const filteredHubs = useMemo(() => {
    return dealershipHubs.filter((hub) => {
      if (filterTrackOnly && !hub.hasTrackAccess) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        hub.name.toLowerCase().includes(q) ||
        hub.city.toLowerCase().includes(q) ||
        hub.country.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, filterTrackOnly]);

  return (
    <div className="dealerships-page">
      <Navbar />

      <main className="dealerships-container">
        {/* Header */}
        <div className="dealerships-header">
          <div className="dealerships-badge">
            <Compass size={13} />
            GLOBAL ATELIER NETWORK
          </div>
          <h1 className="dealerships-title">Studios & Private Ateliers</h1>
          <p className="dealerships-subtitle">
            Experience CarCraft across six world capitals. Private vehicle docks, carbon fitting lounges, and FIA partner circuit access.
          </p>
        </div>

        {/* Controls */}
        <div className="dealerships-controls">
          <div className="dealerships-search-box">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              className="dealerships-search-input"
              placeholder="Search by city, country or studio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dealerships-pills">
            <button
              className={`dealerships-pill-btn ${!filterTrackOnly ? 'active' : ''}`}
              onClick={() => setFilterTrackOnly(false)}
            >
              All Ateliers ({dealershipHubs.length})
            </button>
            <button
              className={`dealerships-pill-btn ${filterTrackOnly ? 'active' : ''}`}
              onClick={() => setFilterTrackOnly(true)}
            >
              ⚡ With Private Circuit Track
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="dealerships-grid">
          {filteredHubs.map((hub) => (
            <div key={hub.id} className="dealership-card">
              <div className="dealership-media">
                <img src={hub.image} alt={hub.name} onError={handleImageError} className="dealership-img" />
                <span className="dealership-badge-float">{hub.badge}</span>
              </div>

              <div className="dealership-body">
                <div>
                  <h3 className="dealership-name">{hub.name}</h3>
                  <div className="dealership-address-row" style={{ marginTop: '6px' }}>
                    <MapPin size={15} color="#bef264" />
                    <span>{hub.address}, {hub.city}</span>
                  </div>
                </div>

                {hub.hasTrackAccess && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '4px 10px', borderRadius: '6px', width: 'fit-content' }}>
                    <Zap size={13} />
                    <span>{hub.trackName}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={13} />
                    <span>{hub.operatingHours}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={13} />
                    <span>{hub.phone}</span>
                  </div>
                </div>

                <div className="dealership-facilities-list">
                  {hub.facilities.map((f, i) => (
                    <span key={i} className="dealership-facility-chip">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="dealership-footer">
                  <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                    CONCIERGE ACCESS OPEN
                  </span>
                  <Link to={`/test-drive`} className="dealership-cta-book">
                    <span>BOOK TEST DRIVE</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
