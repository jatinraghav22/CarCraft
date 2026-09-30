import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  ExternalLink,
  ChevronDown,
  Search,
  Command,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Filter
} from 'lucide-react';
import { notificationsMock, dealerInfoMock } from '../data/dealerMock';
import { useDealerAuth } from '../context/DealerAuthContext';
import { useDealerCounts } from '../context/DealerCountsContext';

export default function DealerHeader({ onToggleSidebar, onOpenCommandPalette }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsMock);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'priority'
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { dealer } = useDealerAuth();
  const { counts } = useDealerCounts();

  const unreadCount = counts?.notifications !== undefined ? counts.notifications : notifications.filter((n) => n.unread).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Derive title from current path
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/vehicles/add')) return 'Register New Fleet Asset';
    if (p.includes('/vehicles') && p.includes('/edit')) return 'Edit Fleet Asset Dossier';
    if (p.includes('/vehicles')) return 'Fleet Vehicles Matrix';
    if (p.includes('/parts/add')) return 'Register New Component';
    if (p.includes('/parts') && p.includes('/edit')) return 'Edit Component Specification';
    if (p.includes('/parts')) return 'Performance Components Catalog';
    if (p.includes('/inventory')) return 'Live Inventory Matrix';
    if (p.includes('/test-drives')) return 'Test Drive Concierge Desk';
    if (p.includes('/service-appointments')) return 'Master Workshop Cleanroom';
    if (p.includes('/orders')) return 'Client Allocations & Orders';
    if (p.includes('/sales')) return 'Audited Sales Ledger';
    if (p.includes('/expenses')) return 'Operational Expenditure Desk';
    if (p.includes('/profit-loss')) return 'Profit & Loss Telemetry';
    if (p.includes('/customers')) return 'Verified Private Clientele';
    if (p.includes('/reports')) return 'Executive Reports & Dossiers';
    if (p.includes('/profile')) return 'Dealer Credentials & Security';
    return 'Executive Overview';
  };

  // Filter notifications
  const displayedNotifications = notifications.filter((item) => {
    if (filterType === 'unread') return item.unread;
    if (filterType === 'priority') return item.type === 'warning' || item.type === 'test_drive';
    return true;
  });

  return (
    <header className="dealer-header">
      <div className="dealer-header-left">
        <button
          type="button"
          className="dealer-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        <div className="dealer-header-breadcrumb">
          <h1 className="dealer-header-title">{getPageTitle()}</h1>
          <span className="dealer-header-subtitle">
            CARCRAFT DEALER ATELIER • {dealer?.businessName || dealerInfoMock.businessName}
          </span>
        </div>
      </div>

      <div className="dealer-header-right">
        {/* Global Command Palette Search Trigger */}
        <button
          type="button"
          className="dealer-header-search-trigger"
          onClick={onOpenCommandPalette}
          title="Search fleet, parts, commands (Ctrl + K)"
        >
          <Search size={15} />
          <span className="dealer-search-trigger-text">Search inventory & actions...</span>
          <span className="dealer-search-shortcut">
            <kbd>Ctrl</kbd> <kbd>K</kbd>
          </span>
        </button>

        {/* Live Telemetry Pill */}
        <div className="dealer-live-pill">
          <span className="dealer-live-dot" />
          <span>LIVE TELEMETRY</span>
        </div>

        {/* Quick Link to Customer Showroom */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="dealer-btn-secondary"
          title="Open Customer Showroom in new tab"
          style={{ padding: '7px 12px', fontSize: '0.75rem', gap: '6px' }}
        >
          <ExternalLink size={14} />
          <span className="dealer-btn-text-hide-sm">Customer Site</span>
        </Link>

        {/* Notifications Bell Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            className="dealer-header-btn"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Dealer Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="dealer-notification-dot" />}
          </button>

          {notificationsOpen && (
            <div className="dealer-notifications-dropdown">
              <div className="dealer-notif-header">
                <div>
                  <div className="dealer-notif-title">
                    System Alerts ({unreadCount} unread)
                  </div>
                  <div className="dealer-notif-filter-tabs">
                    <button
                      type="button"
                      className={`dealer-notif-tab ${filterType === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterType('all')}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      type="button"
                      className={`dealer-notif-tab ${filterType === 'unread' ? 'active' : ''}`}
                      onClick={() => setFilterType('unread')}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      type="button"
                      className={`dealer-notif-tab ${filterType === 'priority' ? 'active' : ''}`}
                      onClick={() => setFilterType('priority')}
                    >
                      Priority
                    </button>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="dealer-notif-mark-read"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="dealer-notif-list">
                {displayedNotifications.length === 0 ? (
                  <div className="dealer-notif-empty">
                    No active notifications in this view.
                  </div>
                ) : (
                  displayedNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`dealer-notif-item ${item.unread ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, unread: false } : n
                          )
                        );
                      }}
                    >
                      <div className="dealer-notif-icon">
                        {item.type === 'test_drive' && <Clock size={16} color="var(--dealer-cyan)" />}
                        {item.type === 'warning' && <AlertTriangle size={16} color="var(--dealer-amber)" />}
                        {item.type === 'payment' && <CheckCircle2 size={16} color="var(--dealer-emerald)" />}
                        {item.type === 'service' && <ShieldCheck size={16} color="var(--dealer-purple)" />}
                      </div>

                      <div className="dealer-notif-body">
                        <div className="dealer-notif-heading">{item.title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--dealer-text-secondary)', lineHeight: 1.3 }}>
                          {item.message}
                        </div>
                        <div className="dealer-notif-time" style={{ marginTop: '4px' }}>
                          {item.time}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="dealer-notif-dismiss"
                        onClick={(e) => removeNotification(e, item.id)}
                        aria-label="Dismiss alert"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <Link to="/dealer/profile" className="dealer-header-profile-link">
          <div className="dealer-avatar-circle" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
            AS
          </div>
          <span className="dealer-profile-name-hide-sm" style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.82rem', fontWeight: 600 }}>
            Alexander S.
          </span>
          <ChevronDown size={14} color="var(--dealer-text-muted)" />
        </Link>
      </div>
    </header>
  );
}
