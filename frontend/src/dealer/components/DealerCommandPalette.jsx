import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Car,
  Package,
  Boxes,
  KeyRound,
  Wrench,
  Receipt,
  Scale,
  Users,
  FileBarChart,
  PlusCircle,
  ExternalLink,
  X,
  Command,
  ArrowRight
} from 'lucide-react';
import { initialDealerVehicles } from '../data/dealerVehiclesMock';
import { initialDealerParts } from '../data/dealerPartsMock';

export default function DealerCommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation & escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search items across routes, vehicles, and parts
  const quickActions = [
    { title: 'Add New Vehicle', path: '/dealer/vehicles/add', icon: PlusCircle, group: 'Quick Actions' },
    { title: 'Add Component Part', path: '/dealer/parts/add', icon: PlusCircle, group: 'Quick Actions' },
    { title: 'Fleet Inventory', path: '/dealer/vehicles', icon: Car, group: 'Navigation' },
    { title: 'Parts Catalog', path: '/dealer/parts', icon: Package, group: 'Navigation' },
    { title: 'Live Inventory Matrix', path: '/dealer/inventory', icon: Boxes, group: 'Navigation' },
    { title: 'Test Drive Requests', path: '/dealer/test-drives', icon: KeyRound, group: 'Navigation' },
    { title: 'Workshop Service Bay', path: '/dealer/service-appointments', icon: Wrench, group: 'Navigation' },
    { title: 'Profit & Loss Statement', path: '/dealer/profit-loss', icon: Scale, group: 'Navigation' },
    { title: 'Clientele Registry', path: '/dealer/customers', icon: Users, group: 'Navigation' },
    { title: 'Operational Expenses', path: '/dealer/expenses', icon: Receipt, group: 'Navigation' },
    { title: 'Executive Reports', path: '/dealer/reports', icon: FileBarChart, group: 'Navigation' }
  ];

  const vehicleMatches = (initialDealerVehicles || [])
    .filter((v) =>
      `${v.brand || ''} ${v.model || ''} ${v.vin || ''}`.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4)
    .map((v) => ({
      title: `${v.year} ${v.brand} ${v.model}`,
      subtitle: `VIN: ${v.vin} • Status: ${v.status}`,
      path: `/dealer/vehicles/${v.id}/edit`,
      icon: Car,
      group: 'Vehicles Fleet'
    }));

  const partMatches = (initialDealerParts || [])
    .filter((p) =>
      `${p.name || ''} ${p.sku || ''} ${p.brand || ''}`.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3)
    .map((p) => ({
      title: p.name,
      subtitle: `SKU: ${p.sku} • Stock: ${p.stock}`,
      path: `/dealer/parts/${p.id}/edit`,
      icon: Package,
      group: 'Parts & Components'
    }));

  const filteredNav = quickActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const allResults = query.trim()
    ? [...filteredNav, ...vehicleMatches, ...partMatches]
    : quickActions;

  const handleSelect = (item) => {
    onClose();
    navigate(item.path);
  };

  return (
    <div className="dealer-command-backdrop" onClick={onClose}>
      <div
        className="dealer-command-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="dealer-command-header">
          <Search size={18} className="dealer-command-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="dealer-command-input"
            placeholder="Search vehicles, parts, telemetry, or commands... (e.g. Porsche, GT3, Add, P&L)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="dealer-command-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="dealer-command-results">
          {allResults.length === 0 ? (
            <div className="dealer-command-empty">
              No matching automotive records or commands found for "{query}".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`dealer-command-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="dealer-command-item-left">
                    <div className="dealer-command-item-icon">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="dealer-command-item-title">{item.title}</div>
                      {item.subtitle && (
                        <div className="dealer-command-item-sub">{item.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="dealer-command-item-right">
                    <span className="dealer-command-group-badge">{item.group}</span>
                    <ArrowRight size={14} className="dealer-command-arrow" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="dealer-command-footer">
          <div className="dealer-command-hint">
            <span>Use</span> <kbd>↑</kbd> <kbd>↓</kbd> <span>to navigate</span>
            <span>•</span>
            <kbd>Enter</kbd> <span>to select</span>
            <span>•</span>
            <kbd>Esc</kbd> <span>to exit</span>
          </div>
          <div className="dealer-command-badge">CARCRAFT Command Desk</div>
        </div>
      </div>
    </div>
  );
}
