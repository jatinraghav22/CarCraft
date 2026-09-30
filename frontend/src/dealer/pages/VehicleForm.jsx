// ==========================================================================
// CARCRAFT DEALER SUITE - MULTI-SECTION VEHICLE FORM (ADD / EDIT)
// Routes: /dealer/vehicles/add, /dealer/vehicles/:id/edit
// Reusable enterprise form for showroom allocations & procurement records
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Save,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Image,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

import { vehicleApi } from '../services/vehicleApi';
import { useDealerCounts } from '../context/DealerCountsContext';
import { getVehicleFallback } from '../../utils/imageFallback';
import Toast from '../components/Toast';
import DealerBreadcrumbs from '../components/DealerBreadcrumbs';

export default function VehicleForm({ mode = 'add' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCounts } = useDealerCounts();

  const isEdit = mode === 'edit' || Boolean(id);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    price: '',
    purchaseCost: '',
    status: 'Available',
    stock: 1,
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: '',
    bodyType: 'Coupe',
    engine: '',
    horsepower: '',
    torque: '',
    seats: 2,
    topSpeed: '',
    color: '',
    image: '',
    supplier: 'CARCRAFT Authorized Atelier Network',
    description: '',
    features: [
      'Carbon-Ceramic Braking System',
      'Dynamic Chassis Control with Active Aero'
    ]
  });

  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Pre-fill existing data in edit mode
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const res = await vehicleApi.getVehicleById(id);
        if (res.success && res.vehicle) {
          setFormData({
            ...res.vehicle,
            features: res.vehicle.features || []
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Vehicle record not found' });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const submitLockRef = React.useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || submitLockRef.current) return;
    submitLockRef.current = true;
    setSaving(true);

    try {
      if (!formData.brand || !formData.model || !formData.price) {
        throw new Error('Please fill all mandatory fields (Brand, Model, Selling Price).');
      }

      const autoVin = formData.vin && formData.vin.trim()
        ? formData.vin.trim().toUpperCase()
        : `W${(formData.brand || 'CAR').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}${Math.floor(10000000000 + Math.random() * 90000000000)}`;

      const finalImage = formData.image || getVehicleFallback(formData.brand, formData.model);

      const submissionData = {
        ...formData,
        vin: autoVin,
        image: formData.imageFile ? formData.image : finalImage,
        purchaseCost: (formData.purchaseCost !== '' && formData.purchaseCost !== undefined)
          ? formData.purchaseCost
          : Math.round(Number(formData.price) * 0.8) || 0
      };

      if (isEdit) {
        const res = await vehicleApi.updateVehicle(id, submissionData);
        if (res.success) {
          refreshCounts();
          navigate('/dealer/vehicles', {
            state: { toast: { type: 'success', message: 'Vehicle updated successfully in dealership fleet.' } }
          });
        }
      } else {
        const res = await vehicleApi.createVehicle(submissionData);
        if (res.success) {
          refreshCounts();
          navigate('/dealer/vehicles', {
            state: { toast: { type: 'success', message: 'Vehicle created successfully and logged in fleet inventory.' } }
          });
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save vehicle record.' });
      setSaving(false);
      submitLockRef.current = false;
    }
  };

  // Quick Margin Calculation Preview
  const numPrice = Number(formData.price) || 0;
  const numCost = Number(formData.purchaseCost) || 0;
  const estMargin = numPrice - numCost;
  const marginPct = numPrice ? ((estMargin / numPrice) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="dealer-table-loading" style={{ minHeight: '400px' }}>
        <div className="dealer-spinner" />
        <span>Loading Vehicle Record #{id}...</span>
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
          { label: 'Fleet Vehicles', to: '/dealer/vehicles' },
          { label: isEdit ? `Edit ${formData.brand || 'Vehicle'}` : 'New Fleet Asset' }
        ]}
      />

      {/* Header */}
      <div className="dealer-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            className="dealer-header-btn"
            onClick={() => navigate('/dealer/vehicles')}
            title="Return to fleet"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="dealer-section-title-wrap">
              <Car size={22} color="var(--dealer-lime)" />
              <h2 className="dealer-welcome-title">
                {isEdit ? `Edit Vehicle Allocation (${formData.brand} ${formData.model})` : 'Register New Fleet Allocation'}
              </h2>
            </div>
            <p className="dealer-welcome-subtitle">
              {isEdit
                ? 'Update specifications, showroom selling price, procurement cost ledger, and allocation status.'
                : 'Enter multi-section technical specifications, internal procurement costs, and showroom gallery assets.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="dealer-btn-secondary"
            onClick={() => navigate('/dealer/vehicles')}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="dealer-vehicle-form"
            className="dealer-btn-primary"
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : isEdit ? 'SAVE CHANGES' : 'ADD VEHICLE'}</span>
          </button>
        </div>
      </div>

      <form id="dealer-vehicle-form" onSubmit={handleSubmit} className="dealer-form-layout">
        {/* Left Column: Form Sections */}
        <div className="dealer-form-main-col">
          {/* ══════════════════════════════════════════════════════════════════
              SECTION 1: BASIC & FINANCIAL INFORMATION
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">01</div>
              <div>
                <h3 className="dealer-form-section-title">Basic Information & Pricing</h3>
                <p className="dealer-form-section-desc">Core model identification and private procurement economics.</p>
              </div>
            </div>

            <div className="dealer-form-grid-3">
              <div className="dealer-form-group">
                <label className="dealer-form-label">Manufacturer Brand *</label>
                <input
                  type="text"
                  name="brand"
                  className="dealer-form-input"
                  placeholder="e.g. Porsche, CARCRAFT, BMW"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Model Designation *</label>
                <input
                  type="text"
                  name="model"
                  className="dealer-form-input"
                  placeholder="e.g. 911 GT3 RS, Apex GT-R"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Model Year *</label>
                <input
                  type="number"
                  name="year"
                  min="1990"
                  max="2030"
                  className="dealer-form-input"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dealer-form-grid-2" style={{ marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">
                  Public Selling Price (INR ₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  className="dealer-form-input"
                  placeholder="e.g. 28500000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <span className="dealer-form-hint">Displayed to verified customers in the showroom.</span>
              </div>

              <div className="dealer-form-group" style={{ background: 'rgba(190, 242, 100, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(190, 242, 100, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <Lock size={13} />
                  <span>Purchase Cost (Private Dealer Info) *</span>
                </div>
                <input
                  type="number"
                  name="purchaseCost"
                  min="0"
                  className="dealer-form-input"
                  placeholder="e.g. 19800000"
                  style={{ borderColor: 'rgba(190, 242, 100, 0.35)', marginTop: '8px' }}
                  value={formData.purchaseCost}
                  onChange={handleChange}
                />
                <span className="dealer-form-hint" style={{ color: 'var(--dealer-lime)' }}>
                  Strictly confidential. Never transmitted to public customer APIs.
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 2: VEHICLE TECHNICAL SPECIFICATIONS
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">02</div>
              <div>
                <h3 className="dealer-form-section-title">Technical Specifications</h3>
                <p className="dealer-form-section-desc">Engineering metrics, powertrain architecture, and dimensions.</p>
              </div>
            </div>

            <div className="dealer-form-grid-3">
              <div className="dealer-form-group">
                <label className="dealer-form-label">Fuel / Powertrain</label>
                <select
                  name="fuel"
                  className="dealer-select"
                  value={formData.fuel}
                  onChange={handleChange}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric / Pure Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  <option value="Mild Hybrid">Mild Hybrid</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Transmission</label>
                <select
                  name="transmission"
                  className="dealer-select"
                  value={formData.transmission}
                  onChange={handleChange}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Dual-Clutch">Dual-Clutch (PDK/DCT)</option>
                  <option value="Direct Drive">Direct Drive (EV Single-Speed)</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Body Type</label>
                <select
                  name="bodyType"
                  className="dealer-select"
                  value={formData.bodyType}
                  onChange={handleChange}
                >
                  <option value="Coupe">Coupe</option>
                  <option value="Supercar">Supercar</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
            </div>

            <div className="dealer-form-grid-3" style={{ marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Engine / Motors</label>
                <input
                  type="text"
                  name="engine"
                  className="dealer-form-input"
                  placeholder="e.g. 4.0L Bi-Turbo V8"
                  value={formData.engine}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Horsepower</label>
                <input
                  type="text"
                  name="horsepower"
                  className="dealer-form-input"
                  placeholder="e.g. 730 HP"
                  value={formData.horsepower}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Torque</label>
                <input
                  type="text"
                  name="torque"
                  className="dealer-form-input"
                  placeholder="e.g. 800 Nm"
                  value={formData.torque}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dealer-form-grid-4" style={{ marginTop: '16px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Mileage / Odo</label>
                <input
                  type="text"
                  name="mileage"
                  className="dealer-form-input"
                  placeholder="e.g. 3,200 km"
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Top Speed</label>
                <input
                  type="text"
                  name="topSpeed"
                  className="dealer-form-input"
                  placeholder="e.g. 325 km/h"
                  value={formData.topSpeed}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Seating Capacity</label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  max="8"
                  className="dealer-form-input"
                  value={formData.seats}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Exterior Color</label>
                <input
                  type="text"
                  name="color"
                  className="dealer-form-input"
                  placeholder="e.g. Isle of Man Green"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 3: NARRATIVE DESCRIPTION & FEATURES
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">03</div>
              <div>
                <h3 className="dealer-form-section-title">Narrative & Performance Features</h3>
                <p className="dealer-form-section-desc">Client presentation description and highlighted equipment.</p>
              </div>
            </div>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Detailed Vehicle Description</label>
              <textarea
                name="description"
                rows="4"
                className="dealer-form-textarea"
                placeholder="Comprehensive overview of provenance, carbon aerodynamics, interior trim..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Key Features List */}
            <div style={{ marginTop: '16px' }}>
              <label className="dealer-form-label">Key Equipment Highlights</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="dealer-form-input"
                  placeholder="Add a new feature (e.g. Carbon-Ceramic 420mm Discs)..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  className="dealer-btn-secondary"
                  onClick={handleAddFeature}
                  style={{ flexShrink: 0 }}
                >
                  <Plus size={15} />
                  <span>Add</span>
                </button>
              </div>

              <div className="dealer-features-pill-list">
                {formData.features.map((feat, idx) => (
                  <span key={idx} className="dealer-feature-pill">
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      aria-label="Remove feature"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Imagery, Inventory & Live Margin Telemetry */}
        <div className="dealer-form-side-col">
          {/* Live Margin Calculation Card */}
          <div className="dealer-form-section-card" style={{ borderLeft: '3px solid var(--dealer-lime)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dealer-lime)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Lock size={15} />
              <span>Projected Dealer Margin</span>
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
                <span style={{ color: 'var(--dealer-lime)', fontWeight: 700 }}>Gross Profit:</span>
                <span style={{ fontWeight: 800, color: estMargin >= 0 ? 'var(--dealer-emerald)' : 'var(--dealer-rose)' }}>
                  ₹{estMargin.toLocaleString('en-IN')} ({marginPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Allocation & Inventory Status */}
          <div className="dealer-form-section-card">
            <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.95rem', color: '#fff', marginBottom: '14px' }}>
              Inventory & Tracking
            </h4>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Chassis / VIN Code *</label>
              <input
                type="text"
                name="vin"
                className="dealer-form-input font-mono"
                placeholder="e.g. WCC994827X78201"
                value={formData.vin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Showroom Stock Units *</label>
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
              <label className="dealer-form-label">Allocation Status *</label>
              <select
                name="status"
                className="dealer-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Procurement Source</label>
              <input
                type="text"
                name="supplier"
                className="dealer-form-input"
                placeholder="e.g. Maranello Official Consignment"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Vehicle Imagery */}
          <div className="dealer-form-section-card">
            <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.95rem', color: '#fff', marginBottom: '14px' }}>
              Showroom Imagery
            </h4>

            <div className="dealer-form-group">
              <label className="dealer-form-label">Upload Vehicle Image</label>
              <input
                type="file"
                accept="image/*"
                className="dealer-form-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file)
                    }));
                  }
                }}
              />
            </div>

            <div className="dealer-form-group" style={{ marginTop: '12px' }}>
              <label className="dealer-form-label">Or Image URL</label>
              <input
                type="url"
                name="image"
                className="dealer-form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image || ''}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, imagePreview: e.target.value, imageFile: null }));
                }}
              />
            </div>

            {(formData.imagePreview || formData.image) ? (
              <div style={{ marginTop: '14px' }}>
                <img
                  src={formData.imagePreview || formData.image}
                  alt="Vehicle Preview"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--dealer-border-subtle)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div style={{ marginTop: '12px', padding: '30px 10px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px dashed var(--dealer-border-subtle)', color: 'var(--dealer-text-muted)', fontSize: '0.78rem' }}>
                <Image size={24} style={{ margin: '0 auto 6px auto', display: 'block', opacity: 0.5 }} />
                <span>Enter image URL to view preview</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
