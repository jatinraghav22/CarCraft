import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Package,
  Boxes,
  KeyRound,
  Wrench,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Scale,
  Users,
  FileBarChart,
  UserCheck,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { dealerInfoMock } from '../data/dealerMock';
import { useDealerAuth } from '../context/DealerAuthContext';
import { useDealerCounts } from '../context/DealerCountsContext';

export default function DealerSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, dealer } = useDealerAuth();
  const { counts, loading, error } = useDealerCounts();

  const handleLogout = () => {
    logout();
    navigate('/dealer/login');
  };

  const getBadge = (key) => {
    if (loading && !counts) return null;
    if (error && !counts) return '—';
    if (!counts || counts[key] === undefined || counts[key] === null) return null;
    return counts[key];
  };

  const navSections = [
    {
      title: 'Executive',
      items: [
        { name: 'Dashboard', path: '/dealer/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Fleet & Catalog',
      items: [
        { name: 'Vehicles', path: '/dealer/vehicles', icon: Car, badge: getBadge('availableVehicles') },
        { name: 'Parts Catalog', path: '/dealer/parts', icon: Package, badge: getBadge('totalParts') },
        { name: 'Live Inventory', path: '/dealer/inventory', icon: Boxes, badge: getBadge('inventory') }
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Test Drives', path: '/dealer/test-drives', icon: KeyRound, badge: getBadge('testDrives') },
        { name: 'Service Bay', path: '/dealer/service-appointments', icon: Wrench, badge: getBadge('serviceAppointments') },
        { name: 'Client Orders', path: '/dealer/orders', icon: ShoppingBag, badge: getBadge('clientOrders') }
      ]
    },
    {
      title: 'Financials',
      items: [
        { name: 'Sales Ledger', path: '/dealer/sales', icon: TrendingUp },
        { name: 'Expenses', path: '/dealer/expenses', icon: Receipt },
        { name: 'Profit & Loss', path: '/dealer/profit-loss', icon: Scale }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'Clientele', path: '/dealer/customers', icon: Users },
        { name: 'Reports Desk', path: '/dealer/reports', icon: FileBarChart }
      ]
    },
    {
      title: 'Identity',
      items: [
        { name: 'Dealer Profile', path: '/dealer/profile', icon: UserCheck }
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="dealer-sidebar-backdrop"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`dealer-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="dealer-sidebar-header">
          <Link to="/dealer/dashboard" className="dealer-brand-link" onClick={onClose}>
            <div className="dealer-brand-badge">
              <Sparkles size={20} />
            </div>
            <div className="dealer-brand-text">
              <span className="dealer-brand-title">CARCRAFT</span>
              <span className="dealer-brand-tag">Dealer Suite</span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            className="dealer-mobile-toggle"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="dealer-sidebar-nav">
          {navSections.map((sec, idx) => (
            <div key={idx} className="dealer-nav-group">
              <div className="dealer-nav-group-title">{sec.title}</div>
              <ul className="dealer-nav-group-list">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `dealer-nav-item ${isActive ? 'active' : ''}`
                        }
                        onClick={onClose}
                      >
                        <div className="dealer-nav-item-content">
                          <Icon size={18} strokeWidth={2} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== null && item.badge !== undefined && (
                          <span className="dealer-nav-badge">{item.badge}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="dealer-sidebar-footer">
          <div className="dealer-user-badge-mini">
            <div className="dealer-avatar-circle">AS</div>
            <div className="dealer-user-meta">
              <div className="dealer-user-name">{dealerInfoMock.name}</div>
              <div className="dealer-user-role">{dealerInfoMock.tier}</div>
            </div>
          </div>

          <button
            type="button"
            className="dealer-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
