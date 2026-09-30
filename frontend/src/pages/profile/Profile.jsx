import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  Car, 
  Wrench, 
  Heart, 
  ShoppingCart, 
  SlidersHorizontal, 
  Eye, 
  ArrowRight, 
  Clock, 
  Award,
  Layers,
  Sparkles,
  Calendar,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import testDriveApi from '../../api/testDriveApi';
import serviceApi from '../../api/serviceApi';
import UserAvatar from '../../components/UserAvatar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { wishlistCount = 0 } = useWishlist() || {};
  const { cartCount = 0 } = useCart() || {};
  const { compareCount = 0 } = useCompare() || {};

  const [dbTestDrives, setDbTestDrives] = useState([]);
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    testDriveApi.getTestDrives()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.results || []);
        setDbTestDrives(list);
      })
      .catch((err) => console.warn('Backend profile test drives note:', err.message));

    serviceApi.getServiceAppointments()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.results || []);
        setDbServices(list);
      })
      .catch((err) => console.warn('Backend profile services note:', err.message));
  }, [isAuthenticated]);

  // Load service bookings: live backend data prioritized, falling back to local storage
  const serviceBookings = useMemo(() => {
    if (dbServices.length > 0) {
      return dbServices.map((sb) => ({
        id: sb.id,
        bookingId: `CC-SRV-${sb.id}`,
        serviceName: sb.service_type,
        vehicle: sb.vehicle_details ? `${sb.vehicle_details.brand} ${sb.vehicle_details.model}` : (sb.custom_vehicle || 'Client Vehicle'),
        hub: sb.description?.split('Hub:')?.[1]?.split('.')?.[0]?.trim() || 'Studio Atelier',
        date: sb.preferred_date,
        time: sb.preferred_time,
        status: sb.status,
        finalCost: sb.final_cost,
      }));
    }
    try {
      const stored = JSON.parse(localStorage.getItem('carcraft_service_bookings') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  }, [dbServices]);

  // Load test drive reservations: live backend data prioritized, falling back to local storage
  const testDrives = useMemo(() => {
    if (dbTestDrives.length > 0) {
      return dbTestDrives.map((td) => ({
        id: td.id,
        refNumber: `CC-TD-${td.id}`,
        vehicle: td.vehicle_details ? `${td.vehicle_details.brand} ${td.vehicle_details.model}` : (td.vehicle || 'Allocated Vehicle'),
        hub: td.notes?.split('Hub:')?.[1]?.split(',')?.[0]?.trim() || 'Atelier Concierge',
        date: td.preferred_date,
        time: td.preferred_time,
        status: td.status,
      }));
    }
    try {
      const stored = JSON.parse(localStorage.getItem('carcraft_testdrives') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  }, [dbTestDrives]);

  // Guest view if unauthenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-container">
          <div className="profile-guest-card">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(190, 242, 100, 0.1)',
                border: '1px solid rgba(190, 242, 100, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#bef264',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
              Private Member Terminal Locked
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 28px' }}>
              Authenticate your identity to view private vehicle allocations, test drive reservations, and active garage assets.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                style={{
                  background: '#bef264',
                  color: '#080a08',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => quickDemoLogin(0)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                1-Click Demo Login
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safe fallback attributes for authenticated user
  const displayName = user?.name || user?.username || 'CarCraft Member';
  const displayEmail = user?.email || 'client@carcraft.io';
  const displayTier = user?.tier || 'Apex VIP';
  const displayJoined = user?.joinedDate || 'Member';
  const displayAllocation = user?.allocationTier || 'Priority Level 1';

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        {/* Hero Card */}
        <section className="profile-hero-card">
          <div className="profile-hero-content">
            <div className="profile-user-left">
              <div className="profile-avatar-wrapper">
                <UserAvatar
                  user={user}
                  size={88}
                  fontSize="2rem"
                  className="profile-avatar"
                  style={{
                    boxShadow: '0 0 24px rgba(190, 242, 100, 0.3)',
                    border: '2px solid #bef264',
                  }}
                />
                <div className="profile-avatar-badge">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div className="profile-identity-info">
                <div className="profile-badge-row">
                  <span className="profile-member-pill">{displayTier}</span>
                  <span className="profile-joined-text">MEMBER SINCE {displayJoined}</span>
                </div>
                <h1 className="profile-name">{displayName}</h1>
                <p className="profile-email">{displayEmail}</p>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button 
                type="button"
                className="profile-logout-btn" 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={16} />
                <span>SIGN OUT</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-top">
              <span className="profile-stat-label">SAVED ITEMS</span>
              <div className="profile-stat-icon-wrap">
                <Heart size={16} />
              </div>
            </div>
            <div className="profile-stat-value">{wishlistCount}</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-top">
              <span className="profile-stat-label">CART ASSETS</span>
              <div className="profile-stat-icon-wrap">
                <ShoppingCart size={16} />
              </div>
            </div>
            <div className="profile-stat-value">{cartCount}</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-top">
              <span className="profile-stat-label">COMPARE QUEUE</span>
              <div className="profile-stat-icon-wrap">
                <SlidersHorizontal size={16} />
              </div>
            </div>
            <div className="profile-stat-value">{compareCount}</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-top">
              <span className="profile-stat-label">CONFIRMED DRIVES</span>
              <div className="profile-stat-icon-wrap">
                <Calendar size={16} />
              </div>
            </div>
            <div className="profile-stat-value">{testDrives.length}</div>
          </div>
        </section>

        {/* Panels Grid */}
        <div className="profile-panels-grid">
          {/* Active Allocations & Garage */}
          <div className="profile-panel">
            <div className="profile-panel-header">
              <h2 className="profile-panel-title">
                <Award size={18} color="#bef264" />
                Concierge Privileges & Status
              </h2>
              <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264' }}>
                {displayAllocation}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}>
                    Hypercar Allocation Status
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#bef264' }}>
                    ACTIVE
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Your account is credentialed for private allocations, track reservations, and studio consultations across our global network.
                </p>
              </div>

              {/* Confirmed Test Drives preview */}
              {testDrives.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(190, 242, 100, 0.25)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="#bef264" />
                      Confirmed Test Drive Sessions
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: '#bef264' }}>
                      BOARDING PASS ISSUED
                    </span>
                  </div>
                  {testDrives.slice(0, 3).map((td, i) => {
                    if (!td) return null;
                    const carName = td.vehicle?.model || (typeof td.vehicle === 'string' ? td.vehicle : 'CarCraft Vehicle');
                    const hubName = td.hub?.city || td.hub?.name || (typeof td.hub === 'string' ? td.hub : 'Studio Atelier');
                    const dateVal = td.date || 'Upcoming';
                    const timeVal = typeof td.time === 'string' ? td.time.split(' ')[0] : (td.time || '');
                    const code = td.refNumber || `CC-TD-${i + 1}`;
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.82rem',
                          color: '#cbd5e1',
                          padding: '8px 0',
                          borderBottom: i < testDrives.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#bef264' }}>{carName}</strong>
                          <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                            • {hubName} • {dateVal} {timeVal ? `(${timeVal})` : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'Space Grotesk',
                              fontSize: '10px',
                              color: td.status === 'APPROVED' ? '#bef264' : (td.status === 'REJECTED' ? '#f87171' : '#38bdf8'),
                              background: td.status === 'APPROVED' ? 'rgba(190, 242, 100, 0.12)' : (td.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.12)'),
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: `1px solid ${td.status === 'APPROVED' ? 'rgba(190, 242, 100, 0.25)' : (td.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)')}`,
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {td.status || 'PENDING'}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Space Grotesk',
                              fontSize: '10px',
                              color: '#94a3b8',
                              background: 'rgba(255, 255, 255, 0.05)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {code}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Service bookings preview */}
              {serviceBookings.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wrench size={15} color="#38bdf8" />
                      Studio Service Reservations
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: '#38bdf8' }}>
                      SYNCHRONIZED
                    </span>
                  </div>
                  {serviceBookings.slice(0, 3).map((sb, i) => {
                    if (!sb) return null;
                    const sName = sb.serviceName || sb.title || 'Master Service';
                    const hName = sb.hub || 'Studio Hub';
                    const dVal = sb.date || 'Scheduled';
                    const tVal = sb.time || '';
                    const statusColor = sb.status === 'APPROVED' || sb.status === 'COMPLETED' ? '#bef264' : (sb.status === 'REJECTED' || sb.status === 'CANCELLED' ? '#f87171' : '#38bdf8');
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.82rem',
                          color: '#cbd5e1',
                          padding: '8px 0',
                          borderBottom: i < serviceBookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <strong>{sName}</strong>
                          <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                            • {hName} • {dVal} {tVal ? `at ${tVal}` : ''}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: 'Space Grotesk',
                            fontSize: '10px',
                            color: statusColor,
                            background: `${statusColor}18`,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: `1px solid ${statusColor}40`,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {sb.status || 'PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Terminal Navigation */}
          <div className="profile-panel">
            <div className="profile-panel-header">
              <h2 className="profile-panel-title">
                <Layers size={18} color="#bef264" />
                Quick Commands
              </h2>
            </div>

            <div className="profile-quick-links">
              <Link to="/test-drive" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={16} color="#bef264" />
                  <span>Book Test Drive / Circuit Session</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/showroom" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Eye size={16} />
                  <span>360° Studio Showroom</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/vehicles" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={16} />
                  <span>Inventory Catalog</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/compare" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SlidersHorizontal size={16} />
                  <span>Vehicle Comparison Suite</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/parts" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Wrench size={16} />
                  <span>High-Performance Parts</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/service" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} />
                  <span>Master Service Hub</span>
                </div>
                <ArrowRight size={14} />
              </Link>

              <Link to="/wishlist" className="profile-quick-link-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Heart size={16} />
                  <span>Saved Collection ({wishlistCount})</span>
                </div>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
