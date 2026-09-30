import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Disc, 
  Eye, 
  Heart, 
  SlidersHorizontal,
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronRight,
  Search
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const customerIsLoggedIn = Boolean(isAuthenticated && user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Global CMD+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const navLinks = [
    { label: 'VEHICLES', path: '/vehicles', icon: Car },
    { label: 'PARTS', path: '/parts', icon: Wrench },
    { label: 'SERVICE', path: '/service', icon: Disc },
    { label: 'SHOWROOM', path: '/showroom', icon: Eye },
  ];

  const isActive = (path) => {
    if (path === '/vehicles') {
      return location.pathname.startsWith('/vehicles');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isScrolled
            ? 'rgba(6, 8, 12, 0.88)'
            : 'rgba(6, 8, 12, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isScrolled ? '0 16px 36px rgba(0, 0, 0, 0.6)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #bef264, #84cc16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(190, 242, 100, 0.35)',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span
                style={{
                  fontFamily: 'Space Grotesk, monospace',
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#080a08',
                  letterSpacing: '-0.02em',
                }}
              >
                CC
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.12rem',
                  color: '#ffffff',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  lineHeight: 1,
                }}
              >
                CARCRAFT
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#bef264',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #bef264',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '8.5px',
                  fontFamily: 'Space Grotesk, monospace',
                  color: '#64748b',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                Automotive Suite
              </div>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="cc-desktop-nav"
          >
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: active ? '#bef264' : 'rgba(255, 255, 255, 0.72)',
                    background: active ? 'rgba(190, 242, 100, 0.08)' : 'transparent',
                    border: active ? '1px solid rgba(190, 242, 100, 0.25)' : '1px solid transparent',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <item.icon size={15} color={active ? '#bef264' : 'currentColor'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Universal Search Omnibar Button */}
            <Link
              to="/search"
              title="Search CarCraft Fleet & Engineering (Ctrl+K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: location.pathname === '/search' ? '#bef264' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(190, 242, 100, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Search size={16} />
            </Link>

            {/* Compare Button with Badge */}
            <Link
              to="/compare"
              title="Compare Vehicles"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: compareCount > 0 ? '#bef264' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(190, 242, 100, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <SlidersHorizontal size={17} />
              {compareCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#bef264',
                    color: '#080a08',
                    fontFamily: 'Space Grotesk, monospace',
                    fontWeight: 800,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(190, 242, 100, 0.6)',
                  }}
                >
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Button with Badge */}
            <Link
              to="/wishlist"
              title="Saved Vehicles & Parts"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: wishlistCount > 0 ? '#bef264' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(190, 242, 100, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Heart size={17} fill={wishlistCount > 0 ? '#bef264' : 'none'} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#bef264',
                    color: '#080a08',
                    fontFamily: 'Space Grotesk, monospace',
                    fontWeight: 800,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(190, 242, 100, 0.6)',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              title="Cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: cartCount > 0 ? '#bef264' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(190, 242, 100, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#bef264',
                    color: '#080a08',
                    fontFamily: 'Space Grotesk, monospace',
                    fontWeight: 800,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(190, 242, 100, 0.6)',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Customer Profile Photo or Login CTA */}
            {customerIsLoggedIn ? (
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '4px 16px 4px 5px',
                  borderRadius: '999px',
                  background: 'rgba(10, 15, 22, 0.75)',
                  border: '1.5px solid #bef264',
                  color: '#bef264',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 0 16px rgba(190, 242, 100, 0.2)',
                }}
                className="cc-login-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(190, 242, 100, 0.14)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(190, 242, 100, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(10, 15, 22, 0.75)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(190, 242, 100, 0.2)';
                }}
              >
                <UserAvatar user={user} size={28} fontSize="0.75rem" />
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: '#bef264',
                    letterSpacing: '0.02em',
                  }}
                >
                  {user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Client'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '9px',
                  background: 'rgba(190, 242, 100, 0.08)',
                  border: '1px solid rgba(190, 242, 100, 0.28)',
                  color: '#bef264',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                className="cc-login-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#bef264';
                  e.currentTarget.style.color = '#080a08';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(190, 242, 100, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(190, 242, 100, 0.08)';
                  e.currentTarget.style.color = '#bef264';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <User size={15} />
                LOGIN
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              className="cc-mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 24px 24px',
              background: 'rgba(8, 10, 15, 0.98)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: active ? '#bef264' : '#f8fafc',
                    background: active ? 'rgba(190, 242, 100, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <item.icon size={18} color={active ? '#bef264' : '#94a3b8'} />
                    {item.label}
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </Link>
              );
            })}
            {customerIsLoggedIn ? (
              <Link
                to="/profile"
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '9px',
                  background: 'rgba(190, 242, 100, 0.12)',
                  border: '1px solid rgba(190, 242, 100, 0.3)',
                  color: '#bef264',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <UserAvatar user={user} size={22} fontSize="0.65rem" />
                MEMBER GARAGE: {user?.name || 'MEMBER'}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '9px',
                  background: '#bef264',
                  color: '#080a08',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <User size={16} />
                LOGIN TO CARCRAFT
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .cc-desktop-nav {
            display: none !important;
          }
          .cc-login-btn {
            display: none !important;
          }
          .cc-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
