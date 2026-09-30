// ==========================================================================
// CARCRAFT DEALER SUITE - VEHICLE FLEET MANAGEMENT PAGE
// Route: /dealer/vehicles
// Features: Search, Filters, Sorting, Pagination, Margin Audits, CRUD Actions
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  Lock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';

import { vehicleApi } from '../services/vehicleApi';
import { handleImageError } from '../../utils/imageFallback';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function Vehicles() {
  const navigate = useNavigate();

  // State management
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load vehicles from service layer
  const loadFleet = async () => {
    try {
      setLoading(true);
      const res = await vehicleApi.getVehicles({
        search,
        status: statusFilter,
        brand: brandFilter,
        year: yearFilter,
        sortBy,
        page,
        limit: 6
      });

      if (res.success) {
        setVehicles(res.vehicles);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load fleet data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
  }, [search, statusFilter, brandFilter, yearFilter, sortBy, page]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await vehicleApi.deleteVehicle(vehicleToDelete.id);
      if (res.success) {
        setToast({ type: 'success', message: 'Vehicle deleted successfully from dealer fleet.' });
        setVehicleToDelete(null);
        loadFleet();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Unable to delete vehicle' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const brandOptions = ['All', 'CARCRAFT', 'Porsche', 'BMW', 'Mercedes-AMG', 'Ferrari', 'McLaren', 'Audi', 'Aston Martin'];
  const statusOptions = ['All', 'Available', 'Reserved', 'Sold', 'Unavailable'];
  const yearOptions = ['All', '2026', '2025', '2024'];

  return (
    <div className="dealer-vehicles-page">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER & FLEET VALUATION SUMMARY BAR
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Car size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Fleet & Vehicle Management</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Executive control of dealership showroom allocations, acquisition costs, pricing, and margin telemetry.
          </p>
        </div>

        <Link to="/dealer/vehicles/add" className="dealer-btn-primary">
          <Plus size={16} />
          <span>+ ADD VEHICLE</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="dealer-fleet-summary-bar">
        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Fleet Capacity</span>
          <span className="dealer-fleet-kpi-val">{summary?.totalVehicles || 0} Units</span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Available for Sale</span>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary?.availableUnits || 0} Showroom
          </span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Reserved / Sold</span>
          <span className="dealer-fleet-kpi-val" style={{ color: 'var(--dealer-cyan)' }}>
            {(summary?.reservedUnits || 0) + (summary?.soldUnits || 0)} Units
          </span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Total Inventory Value</span>
          <span className="dealer-fleet-kpi-val">
            {summary ? formatDealerINR(summary.totalValuation) : '₹0'}
          </span>
        </div>

        <div className="dealer-fleet-kpi private">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} color="var(--dealer-lime)" />
            <span className="dealer-fleet-kpi-label" style={{ color: 'var(--dealer-lime)' }}>
              Projected Fleet Margin
            </span>
          </div>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary ? formatDealerINR(summary.projectedGrossMargin) : '₹0'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. SEARCH, FILTER & SORT CONTROLS
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-controls-bar">
        {/* Search Input */}
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by brand, model, VIN..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              type="button"
              className="dealer-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Brand Filter */}
        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Brand</label>
          <select
            className="dealer-select"
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
          >
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Status</label>
          <select
            className="dealer-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Year</label>
          <select
            className="dealer-select"
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Sort</label>
          <select
            className="dealer-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date_desc">Recently Added</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="year_desc">Year: Newest First</option>
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FLEET DATA TABLE (WITH PRIVATE PURCHASE COSTS & MARGINS)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-table-container">
        {loading ? (
          <div style={{ padding: '16px' }}>
            <TableSkeleton rows={6} cols={7} />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="dealer-table-empty">
            <Car size={48} color="var(--dealer-text-muted)" />
            <h3>No Vehicles Match Your Criteria</h3>
            <p>Try modifying your search query or reset the brand and status filters.</p>
            <button
              type="button"
              className="dealer-btn-secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setBrandFilter('All');
                setYearFilter('All');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <table className="dealer-table">
            <thead>
              <tr>
                <th>Vehicle Details</th>
                <th>VIN / Chassis</th>
                <th>Year</th>
                <th>Selling Price</th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--dealer-lime)' }}>
                    <Lock size={13} />
                    <span>Purchase Cost</span>
                  </div>
                </th>
                <th>Est. Margin</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Added</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const marginAmount = v.price - v.purchaseCost;
                const marginPercent = v.price ? ((marginAmount / v.price) * 100).toFixed(1) : '0';

                return (
                  <tr key={v.id}>
                    {/* Vehicle Branding & Thumbnail */}
                    <td>
                      <div className="dealer-table-item">
                        <img
                          src={v.image}
                          alt={`${v.brand} ${v.model}`}
                          className="dealer-table-thumb"
                          loading="lazy"
                          onError={handleImageError}
                        />
                        <div className="dealer-table-item-info">
                          <span className="dealer-table-item-title">
                            {v.brand} {v.model}
                          </span>
                          <span className="dealer-table-item-sub">
                            {v.fuel} • {v.bodyType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* VIN */}
                    <td>
                      <code className="dealer-vin-tag">{v.vin}</code>
                    </td>

                    {/* Year */}
                    <td>
                      <span className="dealer-font-mono">{v.year}</span>
                    </td>

                    {/* Selling Price */}
                    <td>
                      <span className="dealer-table-price">
                        {formatDealerINR(v.price)}
                      </span>
                    </td>

                    {/* Private Purchase Cost */}
                    <td>
                      <div className="dealer-private-cost-cell" title="Private Dealer Cost (Strictly Hidden from Customers)">
                        <Lock size={12} color="var(--dealer-lime)" />
                        <span>{formatDealerINR(v.purchaseCost)}</span>
                      </div>
                    </td>

                    {/* Estimated Margin */}
                    <td>
                      <div className="dealer-margin-cell">
                        <span className="dealer-margin-pct text-lime">
                          +{marginPercent}%
                        </span>
                        <span className="dealer-margin-amt">
                          {formatDealerINR(marginAmount)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={v.status} />
                    </td>

                    {/* Stock */}
                    <td>
                      <span className={`dealer-stock-pill ${v.stock === 0 ? 'zero' : ''}`}>
                        {v.stock} unit{v.stock !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Date Added */}
                    <td>
                      <span className="dealer-date-cell">{v.dateAdded}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="dealer-table-actions">
                        <button
                          type="button"
                          className="dealer-action-btn view"
                          onClick={() => setSelectedVehicle(v)}
                          title="View Complete Specifications & Procurement Dossier"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn edit"
                          onClick={() => navigate(`/dealer/vehicles/${v.id}/edit`)}
                          title="Edit Vehicle Details & Pricing"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn delete"
                          onClick={() => setVehicleToDelete(v)}
                          title="Delete Vehicle from Fleet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. PAGINATION FOOTER
          ══════════════════════════════════════════════════════════════════════ */}
      {totalPages > 1 && (
        <div className="dealer-pagination-bar">
          <div className="dealer-pagination-info">
            Showing <span className="text-lime">{vehicles.length}</span> of{' '}
            <span className="text-lime">{totalCount}</span> fleet allocations
          </div>

          <div className="dealer-pagination-controls">
            <button
              type="button"
              className="dealer-pagination-btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                type="button"
                className={`dealer-pagination-num ${page === pNum ? 'active' : ''}`}
                onClick={() => setPage(pNum)}
              >
                {pNum}
              </button>
            ))}

            <button
              type="button"
              className="dealer-pagination-btn"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. QUICK VIEW SPECIFICATIONS & PROCUREMENT MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {selectedVehicle && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedVehicle(null)}>
          <div
            className="dealer-modal-content dealer-vehicle-view-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', textAlign: 'left', alignItems: 'stretch' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '16px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>
                  {selectedVehicle.brand} • {selectedVehicle.year}
                </span>
                <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.6rem', color: '#fff', marginTop: '2px' }}>
                  {selectedVehicle.model}
                </h3>
                <code style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)' }}>
                  VIN: {selectedVehicle.vin}
                </code>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StatusBadge status={selectedVehicle.status} />
                <button
                  type="button"
                  className="dealer-header-btn"
                  onClick={() => setSelectedVehicle(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '20px 0' }}>
              <div>
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.model}
                  onError={handleImageError}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid var(--dealer-border-subtle)' }}
                />

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--dealer-text-muted)', textTransform: 'uppercase', fontFamily: 'var(--dealer-font-mono)' }}>
                    Description
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--dealer-text-secondary)', lineHeight: 1.5 }}>
                    {selectedVehicle.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Financial Ledger (Private) */}
                <div style={{ padding: '16px', background: 'rgba(190, 242, 100, 0.04)', borderRadius: '12px', border: '1px solid rgba(190, 242, 100, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--dealer-lime)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--dealer-font-mono)' }}>
                    <Lock size={12} />
                    <span>Private Dealership Financials</span>
                  </div>

                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>Selling Price</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                        {formatDealerINR(selectedVehicle.price)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dealer-lime)' }}>Purchase Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dealer-lime)' }}>
                        {formatDealerINR(selectedVehicle.purchaseCost)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--dealer-text-muted)' }}>Realized Margin</span>
                    <span style={{ color: 'var(--dealer-emerald)', fontWeight: 700 }}>
                      +{formatDealerINR(selectedVehicle.price - selectedVehicle.purchaseCost)} (
                      {(((selectedVehicle.price - selectedVehicle.purchaseCost) / selectedVehicle.price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Technical Specs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div className="dealer-spec-pill">
                    <span className="label">Engine:</span>
                    <span className="val">{selectedVehicle.engine}</span>
                  </div>
                  <div className="dealer-spec-pill">
                    <span className="label">Power:</span>
                    <span className="val">{selectedVehicle.horsepower}</span>
                  </div>
                  <div className="dealer-spec-pill">
                    <span className="label">Top Speed:</span>
                    <span className="val">{selectedVehicle.topSpeed}</span>
                  </div>
                  <div className="dealer-spec-pill">
                    <span className="label">Transmission:</span>
                    <span className="val">{selectedVehicle.transmission}</span>
                  </div>
                  <div className="dealer-spec-pill">
                    <span className="label">Mileage / Odo:</span>
                    <span className="val">{selectedVehicle.mileage}</span>
                  </div>
                  <div className="dealer-spec-pill">
                    <span className="label">Chassis Stock:</span>
                    <span className="val">{selectedVehicle.stock} Units</span>
                  </div>
                </div>

                {/* Supplier */}
                <div style={{ fontSize: '0.78rem', color: 'var(--dealer-text-secondary)', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--dealer-border-subtle)' }}>
                  <strong style={{ color: '#fff' }}>Acquisition Channel:</strong> {selectedVehicle.supplier}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--dealer-border-subtle)', paddingTop: '16px' }}>
              <button
                type="button"
                className="dealer-btn-secondary"
                onClick={() => setSelectedVehicle(null)}
              >
                Close Dossier
              </button>
              <button
                type="button"
                className="dealer-btn-primary"
                onClick={() => {
                  const id = selectedVehicle.id;
                  setSelectedVehicle(null);
                  navigate(`/dealer/vehicles/${id}/edit`);
                }}
              >
                <Edit size={15} />
                <span>Edit Vehicle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. CONFIRM DELETE MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={Boolean(vehicleToDelete)}
        title="Delete Fleet Vehicle Allocation"
        message={`Are you sure you want to permanently remove "${vehicleToDelete?.brand} ${vehicleToDelete?.model}" (VIN: ${vehicleToDelete?.vin}) from the dealer registry? This action will remove internal stock records and margin projections.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setVehicleToDelete(null)}
      />
    </div>
  );
}
