// ==========================================================================
// CARCRAFT DEALER SUITE - MULTI-SECTION PART FORM (ADD / EDIT)
// Routes: /dealer/parts/add, /dealer/parts/:id/edit
// Component catalog registration with compatibility tagging & wholesale pricing
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Save,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Image,
  Tag,
  AlertTriangle,
  Layers
} from 'lucide-react';

import { partApi } from '../services/partApi';
import { partCategories, partStatuses } from '../data/dealerPartsMock';
import { getPartCategoryFallback } from '../../utils/imageFallback';
import Toast from '../components/Toast';
import DealerBreadcrumbs from '../components/DealerBreadcrumbs';

export default function PartForm({ mode = 'add' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = mode === 'edit' || Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Performance',
    sku: '',
    price: '',
    purchaseCost: '',
    discount: 0,
    stock: 5,
    minStockLevel: 3,
    status: 'In Stock',
    supplier: 'CARCRAFT Master Parts Atelier',
    description: '',
    specifications: '',
    image: '',
    compatibility: [
      'CARCRAFT Apex GT-R',
      'Porsche 911 GT3 RS'
    ]
  });

  const [newCompat, setNewCompat] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Pre-fill existing data in edit mode
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchPart = async () => {
      try {
        setLoading(true);
        const res = await partApi.getPartById(id);
        if (res.success && res.part) {
          setFormData({
            ...res.part,
            compatibility: res.part.compatibility || []
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Component record not found' });
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCompat = () => {
    if (!newCompat.trim()) return;
    setFormData((prev) => ({
      ...prev,
      compatibility: [...prev.compatibility, newCompat.trim()]
    }));
    setNewCompat('');
  };

  const handleRemoveCompat = (index) => {
    setFormData((prev) => ({
      ...prev,
      compatibility: prev.compatibility.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.name || !formData.brand || !formData.price || !formData.purchaseCost || !formData.sku) {
        throw new Error('Please enter all mandatory fields (Name, Brand, SKU, Selling Price, Purchase Cost).');
      }

      if (isEdit) {
        const res = await partApi.updatePart(id, formData);
        if (res.success) {
          navigate('/dealer/parts', {
            state: { toast: { type: 'success', message: 'Part updated successfully in catalog.' } }
          });
        }
      } else {
        const res = await partApi.createPart(formData);
        if (res.success) {
          navigate('/dealer/parts', {
            state: { toast: { type: 'success', message: 'Part created successfully and added to stock.' } }
          });
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save part record.' });
      setSaving(false);
    }
  };

  const numPrice = Number(formData.price) || 0;
  const numCost = Number(formData.purchaseCost) || 0;
  const estMargin = numPrice - numCost;
  const marginPct = numPrice ? ((estMargin / numPrice) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="dealer-table-loading" style={{ minHeight: '400px' }}>
        <div className="dealer-spinner" />
        <span>Retrieving Component Record #{id}...</span>
      </div>
    );
  }

  return (
    <div className="dealer-vehicle-form-page">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumb Hierarchy */}
      <DealerBreadcrumbs
        items={[
          { label: 'Parts Catalog', to: '/dealer/parts' },
          { label: isEdit ? `Edit ${formData.name || 'Component'}` : 'Register Component' }
        ]}
      />

      {/* Header */}
      <div className="dealer-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            className="dealer-header-btn"
            onClick={() => navigate('/dealer/parts')}
            title="Return to catalog"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="dealer-section-title-wrap">
              <Package size={22} color="var(--dealer-lime)" />
              <h2 className="dealer-welcome-title">
                {isEdit ? `Edit Component (${formData.name})` : 'Register Performance Component'}
              </h2>
            </div>
            <p className="dealer-welcome-subtitle">
              {isEdit
                ? 'Update OEM specifications, wholesale acquisition cost, minimum stock re-order thresholds, and compatibility.'
                : 'Enter component details, category classification, inventory thresholds, and vehicle fitment matrix.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="dealer-btn-secondary"
            onClick={() => navigate('/dealer/parts')}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="dealer-part-form"
            className="dealer-btn-primary"
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : isEdit ? 'SAVE CHANGES' : 'SAVE PART'}</span>
          </button>
        </div>
      </div>

      <form id="dealer-part-form" onSubmit={handleSubmit} className="dealer-form-layout">
        {/* Main Columns */}
        <div className="dealer-form-main-col">
          {/* ══════════════════════════════════════════════════════════════════
              SECTION 1: IDENTIFICATION & PRICING
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">01</div>
              <div>
                <h3 className="dealer-form-section-title">Component Identification & Pricing</h3>
                <p className="dealer-form-section-desc">OEM branding, catalog category, and confidential procurement cost.</p>
              </div>
            </div>

            <div className="dealer-form-grid-2">
              <div className="dealer-form-group">
                <label className="dealer-form-label">Component Name *</label>
                <input
                  type="text"
                  name="name"
                  className="dealer-form-input"
                  placeholder="e.g. Apex Carbon-Ceramic Matrix Brake Kit"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Brand / Manufacturer *</label>
                <input
                  type="text"
                  name="brand"
                  className="dealer-form-input"
                  placeholder="e.g. Brembo Motorsport, Akrapovič"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dealer-form-grid-2" style={{ marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Catalog Category *</label>
                <select
                  name="category"
                  className="dealer-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {partCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">OEM SKU Identifier *</label>
                <input
                  type="text"
                  name="sku"
                  className="dealer-form-input font-mono"
                  placeholder="e.g. CC-BRK-9901"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dealer-form-grid-3" style={{ marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Public Selling Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  className="dealer-form-input"
                  placeholder="e.g. 540000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dealer-form-group" style={{ background: 'rgba(190, 242, 100, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(190, 242, 100, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <Lock size={12} />
                  <span>Purchase Cost (Private) *</span>
                </div>
                <input
                  type="number"
                  name="purchaseCost"
                  min="0"
                  className="dealer-form-input"
                  placeholder="e.g. 380000"
                  style={{ marginTop: '6px', borderColor: 'rgba(190, 242, 100, 0.35)' }}
                  value={formData.purchaseCost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Dealer Discount / Rebate (%)</label>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  className="dealer-form-input"
                  placeholder="0"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 2: SPECIFICATIONS & VEHICLE COMPATIBILITY
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">02</div>
              <div>
                <h3 className="dealer-form-section-title">Technical Specifications & Compatibility</h3>
                <p className="dealer-form-section-desc">Engineering metrics and verified vehicle fitments.</p>
              </div>
            </div>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Engineering Specifications</label>
              <textarea
                name="specifications"
                rows="3"
                className="dealer-form-textarea"
                placeholder="e.g. 10-Piston Calipers, 420mm Discs, Titanium Backplate, Operating Temp 1,000°C..."
                value={formData.specifications}
                onChange={handleChange}
              />
            </div>

            {/* Vehicle Compatibility Tag Manager */}
            <div style={{ marginTop: '16px' }}>
              <label className="dealer-form-label">Verified Vehicle Compatibility Fitments</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="dealer-form-input"
                  placeholder="Add vehicle model (e.g. Porsche 911 GT3 RS)..."
                  value={newCompat}
                  onChange={(e) => setNewCompat(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCompat();
                    }
                  }}
                />
                <button
                  type="button"
                  className="dealer-btn-secondary"
                  onClick={handleAddCompat}
                  style={{ flexShrink: 0 }}
                >
                  <Plus size={15} />
                  <span>Add Fitment</span>
                </button>
              </div>

              <div className="dealer-features-pill-list">
                {formData.compatibility.map((model, idx) => (
                  <span key={idx} className="dealer-feature-pill">
                    <span>{model}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompat(idx)}
                      aria-label="Remove fitment"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 3: NARRATIVE DESCRIPTION
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">03</div>
              <div>
                <h3 className="dealer-form-section-title">Narrative Description</h3>
                <p className="dealer-form-section-desc">Client-facing component presentation and benefits.</p>
              </div>
            </div>

            <div className="dealer-form-group">
              <textarea
                name="description"
                rows="4"
                className="dealer-form-textarea"
                placeholder="Highlight material craftsmanship, dyno gains, unsprung weight reduction..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Thresholds & Live Margin */}
        <div className="dealer-form-side-col">
          {/* Live Margin Card */}
          <div className="dealer-form-section-card" style={{ borderLeft: '3px solid var(--dealer-lime)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Lock size={15} />
              <span>Projected Unit Margin</span>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Selling Price:</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>₹{numPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Procurement Cost:</span>
                <span style={{ fontWeight: 700, color: 'var(--dealer-amber)' }}>₹{numCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--dealer-lime)', fontWeight: 700 }}>Unit Margin:</span>
                <span style={{ fontWeight: 800, color: estMargin >= 0 ? 'var(--dealer-emerald)' : 'var(--dealer-rose)' }}>
                  ₹{estMargin.toLocaleString('en-IN')} ({marginPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Stock Levels & Re-order Thresholds */}
          <div className="dealer-form-section-card">
            <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.95rem', color: '#fff', marginBottom: '14px' }}>
              Stock & Re-Order Thresholds
            </h4>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Current Stock Units *</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="dealer-form-input"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Minimum Stock Level (Low Stock Alert) *</label>
              <input
                type="number"
                name="minStockLevel"
                min="1"
                className="dealer-form-input"
                value={formData.minStockLevel}
                onChange={handleChange}
                required
              />
              <span className="dealer-form-hint">Triggers an alert when inventory falls to this count.</span>
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Inventory Status *</label>
              <select
                name="status"
                className="dealer-select"
                value={formData.status}
                onChange={handleChange}
              >
                {partStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Authorized Supplier</label>
              <input
                type="text"
                name="supplier"
                className="dealer-form-input"
                placeholder="e.g. Brembo S.p.A. Official"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Component Imagery */}
          <div className="dealer-form-section-card">
            <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.95rem', color: '#fff', marginBottom: '14px' }}>
              Component Imagery
            </h4>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Image URL or Local Asset Path</label>
              <input
                type="text"
                name="image"
                className="dealer-form-input"
                placeholder="/images/parts/suspension_coilover.jpg"
                value={formData.image}
                onChange={handleChange}
              />
              <span className="dealer-form-hint">Leave blank to automatically use the certified {formData.category} component image.</span>
            </div>

            <div style={{ marginTop: '14px' }}>
              <img
                src={formData.image || getPartCategoryFallback(formData.category, formData.name)}
                alt="Component Preview"
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--dealer-border-subtle)' }}
                onError={(e) => {
                  e.target.src = getPartCategoryFallback(formData.category, formData.name);
                }}
              />
              <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--dealer-lime)', fontFamily: 'var(--dealer-font-mono)' }}>
                {formData.image ? 'Custom Product Asset Active' : `Auto-Assigned Category Visual: ${formData.category}`}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
