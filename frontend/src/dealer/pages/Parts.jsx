// ==========================================================================
// CARCRAFT DEALER SUITE - PERFORMANCE PARTS MANAGEMENT PAGE
// Route: /dealer/parts
// Features: Search, Category Filters, Stock Thresholds, Private Costs, CRUD
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  Lock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag,
  Boxes,
  X
} from 'lucide-react';

import { partApi } from '../services/partApi';
import { partCategories, partStatuses } from '../data/dealerPartsMock';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import { handlePartImageError } from '../../utils/imageFallback';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function Parts() {
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [selectedPart, setSelectedPart] = useState(null);
  const [partToDelete, setPartToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const loadParts = async () => {
    try {
      setLoading(true);
      const res = await partApi.getParts({
        search,
        category: categoryFilter,
        brand: brandFilter,
        status: statusFilter,
        sortBy,
        page,
        limit: 6
      });

      if (res.success) {
        setParts(res.parts);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load parts catalog' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, [search, categoryFilter, brandFilter, statusFilter, sortBy, page]);

  const handleDeleteConfirm = async () => {
    if (!partToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await partApi.deletePart(partToDelete.id);
      if (res.success) {
        setToast({ type: 'success', message: 'Part deleted successfully from catalog.' });
        setPartToDelete(null);
        loadParts();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Unable to delete part' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const brandOptions = ['All', 'Brembo Motorsport', 'Akrapovič', 'Öhlins Racing', 'BBS Motorsport', 'Michelin', 'Eventuri', 'Magneti Marelli', 'CARCRAFT Atelier'];

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
          1. HEADER & COMPONENT INVENTORY SUMMARY BAR
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Package size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Performance Parts & Component Matrix</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Catalog inventory, OEM SKUs, wholesale procurement costs, re-order thresholds, and dynamic pricing tiers.
          </p>
        </div>

        <Link to="/dealer/parts/add" className="dealer-btn-primary">
          <Plus size={16} />
          <span>+ ADD PART</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="dealer-fleet-summary-bar">
        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Active SKUs</span>
          <span className="dealer-fleet-kpi-val">{summary?.totalSKUs || 0} Models</span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Stock Units</span>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary?.totalUnitsInStock || 0} In Bay
          </span>
        </div>

        <div className="dealer-fleet-kpi" style={{ borderColor: (summary?.lowStockSKUs || 0) > 0 ? 'rgba(251, 191, 36, 0.4)' : '' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {(summary?.lowStockSKUs || 0) > 0 && <AlertTriangle size={12} color="var(--dealer-amber)" />}
            <span className="dealer-fleet-kpi-label" style={{ color: (summary?.lowStockSKUs || 0) > 0 ? 'var(--dealer-amber)' : '' }}>
              Low Stock Warnings
            </span>
          </div>
          <span className="dealer-fleet-kpi-val" style={{ color: (summary?.lowStockSKUs || 0) > 0 ? 'var(--dealer-amber)' : '#fff' }}>
            {summary?.lowStockSKUs || 0} SKUs
          </span>
        </div>

        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Parts Valuation</span>
          <span className="dealer-fleet-kpi-val">
            {summary ? formatDealerINR(summary.totalValuation) : '₹0'}
          </span>
        </div>

        <div className="dealer-fleet-kpi private">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} color="var(--dealer-lime)" />
            <span className="dealer-fleet-kpi-label" style={{ color: 'var(--dealer-lime)' }}>
              Projected Margin
            </span>
          </div>
          <span className="dealer-fleet-kpi-val text-lime">
            {summary ? formatDealerINR(summary.projectedMargin) : '₹0'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. SEARCH, FILTER & SORT CONTROLS
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-controls-bar">
        {/* Search */}
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by part name, brand, SKU..."
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

        {/* Category Filter */}
        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Category</label>
          <select
            className="dealer-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {partCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
          <label className="dealer-select-label">Stock Status</label>
          <select
            className="dealer-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            {partStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
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
            <option value="stock_asc">Stock: Low to High</option>
            <option value="stock_desc">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. PARTS DATA TABLE (WITH PRIVATE PROCUREMENT COSTS & MARGINS)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dealer-table-container">
        {loading ? (
          <div style={{ padding: '16px' }}>
            <TableSkeleton rows={6} cols={7} />
          </div>
        ) : parts.length === 0 ? (
          <div className="dealer-table-empty">
            <Package size={48} color="var(--dealer-text-muted)" />
            <h3>No Performance Components Found</h3>
            <p>Try refining your search terms or reset the category and stock filters.</p>
            <button
              type="button"
              className="dealer-btn-secondary"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setBrandFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <table className="dealer-table">
            <thead>
              <tr>
                <th>Component Information</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Selling Price</th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--dealer-lime)' }}>
                    <Lock size={13} />
                    <span>Purchase Cost</span>
                  </div>
                </th>
                <th>Stock / Min</th>
                <th>Status</th>
                <th>Added</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const marginAmount = p.price - p.purchaseCost;
                const marginPercent = p.price ? ((marginAmount / p.price) * 100).toFixed(1) : '0';
                const isLowStock = p.stock <= (p.minStockLevel || 3);

                return (
                  <tr key={p.id}>
                    {/* Thumbnail & Title */}
                    <td>
                      <div className="dealer-table-item">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="dealer-table-thumb"
                          loading="lazy"
                          onError={(e) => handlePartImageError(e, p.category, p.name)}
                        />
                        <div className="dealer-table-item-info">
                          <span className="dealer-table-item-title">{p.name}</span>
                          <span className="dealer-table-item-sub">
                            Brand: <strong style={{ color: '#fff' }}>{p.brand}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="dealer-category-badge">
                        <Tag size={11} style={{ marginRight: '4px' }} />
                        {p.category}
                      </span>
                    </td>

                    {/* SKU */}
                    <td>
                      <code className="dealer-vin-tag">{p.sku}</code>
                    </td>

                    {/* Selling Price */}
                    <td>
                      <div>
                        <span className="dealer-table-price">{formatDealerINR(p.price)}</span>
                        {p.discount > 0 && (
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--dealer-lime)' }}>
                            {p.discount}% Dealer Rebate
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Private Purchase Cost */}
                    <td>
                      <div className="dealer-private-cost-cell" title="Private Wholesale Acquisition Cost">
                        <Lock size={12} color="var(--dealer-lime)" />
                        <span>{formatDealerINR(p.purchaseCost)}</span>
                      </div>
                    </td>

                    {/* Stock Count with Low Stock Warning */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`dealer-stock-pill ${p.stock === 0 ? 'zero' : isLowStock ? 'low' : ''}`}>
                          {p.stock} units
                        </span>
                        {isLowStock && p.stock > 0 && (
                          <AlertTriangle size={14} color="var(--dealer-amber)" title="Stock below minimum threshold" />
                        )}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--dealer-text-muted)', display: 'block', marginTop: '2px' }}>
                        Min: {p.minStockLevel || 3} units
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Date */}
                    <td>
                      <span className="dealer-date-cell">{p.dateAdded}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="dealer-table-actions">
                        <button
                          type="button"
                          className="dealer-action-btn view"
                          onClick={() => setSelectedPart(p)}
                          title="View Specifications & Compatibility Matrix"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn edit"
                          onClick={() => navigate(`/dealer/parts/${p.id}/edit`)}
                          title="Edit Part Details & Pricing"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          className="dealer-action-btn delete"
                          onClick={() => setPartToDelete(p)}
                          title="Remove Part from Catalog"
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
            Showing <span className="text-lime">{parts.length}</span> of{' '}
            <span className="text-lime">{totalCount}</span> catalog SKUs
          </div>

          <div className="dealer-pagination-controls">
            <button
              type="button"
              className="dealer-pagination-btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
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
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. QUICK VIEW PART SPECIFICATIONS & COMPATIBILITY MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {selectedPart && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedPart(null)}>
          <div
            className="dealer-modal-content dealer-vehicle-view-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '750px', textAlign: 'left', alignItems: 'stretch' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '16px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>
                  {selectedPart.brand} • {selectedPart.category}
                </span>
                <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.45rem', color: '#fff', marginTop: '2px' }}>
                  {selectedPart.name}
                </h3>
                <code style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)' }}>
                  SKU: {selectedPart.sku}
                </code>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StatusBadge status={selectedPart.status} />
                <button
                  type="button"
                  className="dealer-header-btn"
                  onClick={() => setSelectedPart(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', margin: '20px 0' }}>
              <div>
                <img
                  src={selectedPart.image}
                  alt={selectedPart.name}
                  onError={(e) => handlePartImageError(e, selectedPart.category, selectedPart.name)}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--dealer-border-subtle)' }}
                />

                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)', textTransform: 'uppercase', fontFamily: 'var(--dealer-font-mono)' }}>
                    Engineering Specifications
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--dealer-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {selectedPart.specifications || 'Standard manufacturer precision tolerances.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Financial Ledger (Private) */}
                <div style={{ padding: '16px', background: 'rgba(190, 242, 100, 0.04)', borderRadius: '12px', border: '1px solid rgba(190, 242, 100, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--dealer-lime)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--dealer-font-mono)' }}>
                    <Lock size={12} />
                    <span>Private Procurement & Margin</span>
                  </div>

                  <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>Selling Price</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                        {formatDealerINR(selectedPart.price)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dealer-lime)' }}>Purchase Cost</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dealer-lime)' }}>
                        {formatDealerINR(selectedPart.purchaseCost)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--dealer-text-muted)' }}>Gross Margin</span>
                    <span style={{ color: 'var(--dealer-emerald)', fontWeight: 700 }}>
                      +{formatDealerINR(selectedPart.price - selectedPart.purchaseCost)} (
                      {(((selectedPart.price - selectedPart.purchaseCost) / selectedPart.price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Compatibility Matrix */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)', textTransform: 'uppercase', fontFamily: 'var(--dealer-font-mono)', marginBottom: '6px' }}>
                    Verified Vehicle Compatibility
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPart.compatibility && selectedPart.compatibility.length > 0 ? (
                      selectedPart.compatibility.map((m, idx) => (
                        <span key={idx} className="dealer-compat-tag">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--dealer-text-muted)' }}>
                        Universal Performance Fitment
                      </span>
                    )}
                  </div>
                </div>

                {/* Supplier */}
                <div style={{ fontSize: '0.76rem', color: 'var(--dealer-text-secondary)', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--dealer-border-subtle)' }}>
                  <strong style={{ color: '#fff' }}>Official Supplier:</strong> {selectedPart.supplier}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--dealer-border-subtle)', paddingTop: '16px' }}>
              <button
                type="button"
                className="dealer-btn-secondary"
                onClick={() => setSelectedPart(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="dealer-btn-primary"
                onClick={() => {
                  const id = selectedPart.id;
                  setSelectedPart(null);
                  navigate(`/dealer/parts/${id}/edit`);
                }}
              >
                <Edit size={15} />
                <span>Edit Component</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. CONFIRM DELETE MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={Boolean(partToDelete)}
        title="Remove Component from Catalog"
        message={`Are you sure you want to permanently delete "${partToDelete?.name}" (SKU: ${partToDelete?.sku})? This item will be removed from inventory valuation.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPartToDelete(null)}
      />
    </div>
  );
}
