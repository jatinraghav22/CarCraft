// ==========================================================================
// CARCRAFT DEALER SUITE - MULTI-SECTION VEHICLE FORM (ADD / EDIT)
// Routes: /dealer/vehicles/add, /dealer/vehicles/:id/edit
// Reusable enterprise form with multi-photo gallery management
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Save,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Image as ImageIcon,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  DollarSign,
  Upload,
  Star,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
  FileImage,
  RefreshCw
} from 'lucide-react';

import { vehicleApi } from '../services/vehicleApi';
import { useDealerCounts } from '../context/DealerCountsContext';
import { getVehicleFallback } from '../../utils/imageFallback';
import Toast from '../components/Toast';
import DealerBreadcrumbs from '../components/DealerBreadcrumbs';
import ConfirmModal from '../components/ConfirmModal';

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

  // Multi-image Gallery States
  const [existingImages, setExistingImages] = useState([]); // [{ id, image, is_primary, order }]
  const [newImageFiles, setNewImageFiles] = useState([]);   // [{ id, file, previewUrl, sizeFormatted, isPrimary }]
  const [imageToDelete, setImageToDelete] = useState(null); // Image object to confirm removal
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

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

          // Populate existing gallery images
          let gallery = res.vehicle.gallery_images || [];
          if (gallery.length === 0 && res.vehicle.image) {
            gallery = [{
              id: 'initial-main',
              image: res.vehicle.image,
              is_primary: true,
              order: 0,
            }];
          }
          setExistingImages(gallery);
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

  // ── Multi-image Upload Handlers ─────────────────────────────────────────────

  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const validNewEntries = [];
    const errors = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!allowedExts.includes(ext)) {
        errors.push(`"${file.name}" has an unsupported format (.${ext}). Use JPG, PNG, WEBP, or GIF.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        errors.push(`"${file.name}" exceeds 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
        return;
      }

      // Avoid exact duplicates in current pending list
      const alreadyAdded = newImageFiles.some(
        (entry) => entry.file.name === file.name && entry.file.size === file.size
      );
      if (alreadyAdded) return;

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      validNewEntries.push({
        id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        sizeFormatted: sizeStr,
        isPrimary: false,
      });
    });

    if (errors.length > 0) {
      setToast({ type: 'error', message: errors[0] });
    }

    if (validNewEntries.length > 0) {
      setNewImageFiles((prev) => {
        const combined = [...prev, ...validNewEntries];
        // If no existing images have primary and no pending has primary, make first one primary
        const hasExistingPrimary = existingImages.some((img) => img.is_primary);
        const hasNewPrimary = combined.some((item) => item.isPrimary);
        if (!hasExistingPrimary && !hasNewPrimary && combined.length > 0) {
          combined[0].isPrimary = true;
        }
        return combined;
      });
    }
  };

  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ''; // Reset input so same file can be re-selected if removed
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Remove a pending (newly selected) image before saving
  const handleRemoveNewImage = (idToRemove) => {
    setNewImageFiles((prev) => {
      const target = prev.find((item) => item.id === idToRemove);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const remaining = prev.filter((item) => item.id !== idToRemove);
      // If we removed the primary, designate the first remaining or first existing
      if (target?.isPrimary) {
        if (existingImages.length > 0) {
          setExistingImages((curr) => curr.map((img, idx) => ({ ...img, is_primary: idx === 0 })));
        } else if (remaining.length > 0) {
          remaining[0].isPrimary = true;
        }
      }
      return remaining;
    });
  };

  // Designate an existing saved image as primary cover photo
  const handleSetPrimaryExisting = async (imgId) => {
    if (isEdit && id && !String(imgId).startsWith('initial-')) {
      try {
        const res = await vehicleApi.setPrimaryImage(id, imgId);
        if (res.success) {
          setExistingImages(res.gallery_images);
          setNewImageFiles((prev) => prev.map((item) => ({ ...item, isPrimary: false })));
          setToast({ type: 'success', message: 'Primary showroom cover photo updated.' });
          return;
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to update primary image.' });
      }
    }

    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: String(img.id) === String(imgId),
      }))
    );
    setNewImageFiles((prev) => prev.map((item) => ({ ...item, isPrimary: false })));
  };

  // Designate a newly selected image as primary cover photo
  const handleSetPrimaryNew = (pendingId) => {
    setNewImageFiles((prev) =>
      prev.map((item) => ({
        ...item,
        isPrimary: item.id === pendingId,
      }))
    );
    setExistingImages((prev) => prev.map((img) => ({ ...img, is_primary: false })));
  };

  // Confirm and delete an existing image
  const confirmDeleteExistingImage = async () => {
    if (!imageToDelete) return;
    const imgId = imageToDelete.id;
    setImageToDelete(null);

    if (isEdit && id && !String(imgId).startsWith('initial-')) {
      try {
        setDeletingImageId(imgId);
        const res = await vehicleApi.deleteGalleryImage(id, imgId);
        if (res.success) {
          setExistingImages(res.gallery_images);
          setToast({ type: 'success', message: 'Gallery image removed successfully.' });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to delete gallery image.' });
      } finally {
        setDeletingImageId(null);
      }
    } else {
      setExistingImages((prev) => {
        const remaining = prev.filter((img) => img.id !== imgId);
        if (imageToDelete.is_primary && remaining.length > 0) {
          remaining[0].is_primary = true;
        }
        return remaining;
      });
      setToast({ type: 'success', message: 'Image removed from gallery.' });
    }
  };

  // Reorder existing images (move earlier or later)
  const handleMoveExisting = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= existingImages.length) return;

    const reordered = [...existingImages];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setExistingImages(reordered);

    if (isEdit && id) {
      const orderIds = reordered
        .map((img) => img.id)
        .filter((i) => !String(i).startsWith('initial-'));
      if (orderIds.length > 0) {
        try {
          await vehicleApi.reorderGalleryImages(id, orderIds);
        } catch (e) {
          console.warn('Reorder gallery failed:', e.message);
        }
      }
    }
  };

  // ── Form Submission ─────────────────────────────────────────────────────────

  const submitLockRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || submitLockRef.current) return;
    submitLockRef.current = true;
    setSaving(true);
    setUploadStatus('Saving vehicle specifications and syncing gallery assets...');

    try {
      if (!formData.brand || !formData.model || !formData.price) {
        throw new Error('Please fill all mandatory fields (Brand, Model, Selling Price).');
      }

      const autoVin = formData.vin && formData.vin.trim()
        ? formData.vin.trim().toUpperCase()
        : `W${(formData.brand || 'CAR').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}${Math.floor(10000000000 + Math.random() * 90000000000)}`;

      // Determine designated primary image index or ID
      const primaryNewIdx = newImageFiles.findIndex((item) => item.isPrimary);
      const primaryExistingObj = existingImages.find((img) => img.is_primary);

      const submissionData = {
        ...formData,
        vin: autoVin,
        purchaseCost: (formData.purchaseCost !== '' && formData.purchaseCost !== undefined)
          ? formData.purchaseCost
          : Math.round(Number(formData.price) * 0.8) || 0,
        newImageFiles: newImageFiles.map((item) => item.file),
        primaryIndex: primaryNewIdx >= 0 ? primaryNewIdx : 0,
        primaryImageId: primaryExistingObj?.id && !String(primaryExistingObj.id).startsWith('initial-')
          ? primaryExistingObj.id
          : undefined,
      };

      if (isEdit) {
        const res = await vehicleApi.updateVehicle(id, submissionData);
        if (res.success) {
          refreshCounts();
          navigate('/dealer/vehicles', {
            state: { toast: { type: 'success', message: 'Vehicle specifications and multi-photo gallery updated successfully.' } }
          });
        }
      } else {
        const res = await vehicleApi.createVehicle(submissionData);
        if (res.success) {
          refreshCounts();
          navigate('/dealer/vehicles', {
            state: { toast: { type: 'success', message: 'Vehicle created successfully with gallery assets.' } }
          });
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save vehicle record.' });
      setSaving(false);
      submitLockRef.current = false;
      setUploadStatus('');
    }
  };

  // Quick Telemetry & Margins
  const numPrice = Number(formData.price) || 0;
  const numCost = Number(formData.purchaseCost) || 0;
  const estMargin = numPrice - numCost;
  const marginPct = numPrice ? ((estMargin / numPrice) * 100).toFixed(1) : 0;

  // Active cover preview determination
  const primaryPending = newImageFiles.find((item) => item.isPrimary);
  const primaryExisting = existingImages.find((img) => img.is_primary);
  const activeCoverPreview =
    primaryPending?.previewUrl ||
    primaryExisting?.image ||
    newImageFiles[0]?.previewUrl ||
    existingImages[0]?.image ||
    formData.image ||
    getVehicleFallback(formData.brand, formData.model);

  const totalPhotosCount = existingImages.length + newImageFiles.length;

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

      {/* Remove Photo Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(imageToDelete)}
        title="Remove Photo from Vehicle Gallery"
        message="Are you sure you want to remove this photo? If this is currently the primary cover image, another remaining photo will be designated as primary."
        confirmText="Remove Photo"
        confirmVariant="danger"
        loading={Boolean(deletingImageId)}
        onConfirm={confirmDeleteExistingImage}
        onCancel={() => setImageToDelete(null)}
      />

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
                ? 'Update specifications, showroom selling price, procurement cost ledger, and multi-photo gallery.'
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
                <h3 className="dealer-form-section-title">Brand & Commercial Valuation</h3>
                <p className="dealer-form-section-desc">Public pricing, private wholesale costs, and core provenance.</p>
              </div>
            </div>

            <div className="dealer-form-grid-3">
              <div className="dealer-form-group">
                <label className="dealer-form-label">Brand / Marque *</label>
                <input
                  type="text"
                  name="brand"
                  className="dealer-form-input"
                  placeholder="e.g. Porsche, Ferrari"
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
                  placeholder="e.g. 911 GT3 (992)"
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
                  min="1950"
                  max="2030"
                  className="dealer-form-input"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dealer-form-grid-2" style={{ marginTop: '12px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Selling Price (Customer ₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--dealer-lime)', fontWeight: 700 }}>₹</span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    className="dealer-form-input"
                    style={{ paddingLeft: '28px' }}
                    placeholder="25000000"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="dealer-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="dealer-form-label">Wholesale Cost (Confidential ₹)</label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--dealer-lime)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={11} /> Dealer Only
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--dealer-amber)', fontWeight: 700 }}>₹</span>
                  <input
                    type="number"
                    name="purchaseCost"
                    min="0"
                    className="dealer-form-input"
                    style={{ paddingLeft: '28px' }}
                    placeholder="20000000"
                    value={formData.purchaseCost}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 2: POWERTRAIN & DYNAMIC SPECIFICATIONS
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">02</div>
              <div>
                <h3 className="dealer-form-section-title">Powertrain & Engineering Attributes</h3>
                <p className="dealer-form-section-desc">Performance metrics, transmission architecture, and cabin ergonomics.</p>
              </div>
            </div>

            <div className="dealer-form-grid-4">
              <div className="dealer-form-group">
                <label className="dealer-form-label">Fuel Architecture</label>
                <select name="fuel" className="dealer-select" value={formData.fuel} onChange={handleChange}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Pure Electric">Pure Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  <option value="Mild Hybrid">Mild Hybrid</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Transmission</label>
                <select name="transmission" className="dealer-select" value={formData.transmission} onChange={handleChange}>
                  <option value="Automatic">Automatic</option>
                  <option value="Dual-Clutch">Dual-Clutch (PDK/DCT)</option>
                  <option value="Manual">Manual</option>
                  <option value="Direct Drive">Direct Drive (EV)</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Body Architecture</label>
                <select name="bodyType" className="dealer-select" value={formData.bodyType} onChange={handleChange}>
                  <option value="Supercar">Supercar</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Wagon">Wagon</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Cabin Capacity</label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  max="9"
                  className="dealer-form-input"
                  value={formData.seats}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dealer-form-grid-4" style={{ marginTop: '12px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Engine Specification</label>
                <input
                  type="text"
                  name="engine"
                  className="dealer-form-input"
                  placeholder="e.g. 4.0L Flat-6 NA"
                  value={formData.engine}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Power (HP)</label>
                <input
                  type="number"
                  name="horsepower"
                  min="0"
                  className="dealer-form-input"
                  placeholder="502"
                  value={formData.horsepower}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Torque (Nm)</label>
                <input
                  type="number"
                  name="torque"
                  min="0"
                  className="dealer-form-input"
                  placeholder="470"
                  value={formData.torque}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Top Speed (km/h)</label>
                <input
                  type="number"
                  name="topSpeed"
                  min="0"
                  className="dealer-form-input"
                  placeholder="318"
                  value={formData.topSpeed}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dealer-form-grid-2" style={{ marginTop: '12px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Odometer Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  min="0"
                  className="dealer-form-input"
                  placeholder="1200"
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Exterior Livery / Color</label>
                <input
                  type="text"
                  name="color"
                  className="dealer-form-input"
                  placeholder="e.g. Acid Lime Metallic"
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
                rows="3"
                className="dealer-form-textarea"
                placeholder="Comprehensive overview of provenance, carbon aerodynamics, interior trim..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Key Features List */}
            <div style={{ marginTop: '14px' }}>
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

              <div className="dealer-features-pill-list" style={{ marginTop: '10px' }}>
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

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 4: SHOWROOM MULTI-PHOTO GALLERY & COVER ASSETS
              ══════════════════════════════════════════════════════════════════ */}
          <div className="dealer-form-section-card">
            <div className="dealer-form-section-header">
              <div className="dealer-form-section-number">04</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="dealer-form-section-title">Showroom Multi-Photo Gallery</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dealer-lime)', fontFamily: 'var(--dealer-font-mono)', fontWeight: 700 }}>
                    {totalPhotosCount} Photo{totalPhotosCount !== 1 ? 's' : ''} ({existingImages.length} Saved, {newImageFiles.length} Pending)
                  </span>
                </div>
                <p className="dealer-form-section-desc">
                  Select and upload multiple high-resolution photos in one operation. Designate the primary cover photo for marketplace cards.
                </p>
              </div>
            </div>

            {/* Drag & Drop File Selector */}
            <div>
              <input
                type="file"
                id="gallery-file-input"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <div
                className={`dealer-gallery-upload-box ${isDragging ? 'is-dragging' : ''}`}
                onClick={() => document.getElementById('gallery-file-input')?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(190, 242, 100, 0.12)',
                    border: '1px solid var(--dealer-border-lime)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--dealer-lime)'
                  }}
                >
                  <Upload size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    Click to select multiple photos or drag & drop files here
                  </div>
                  <div style={{ color: 'var(--dealer-text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                    Select several photos at once. Supported formats: JPG, PNG, WEBP, GIF (up to 10MB each).
                  </div>
                </div>
              </div>
            </div>

            {/* Fallback Single Image URL */}
            <div style={{ marginTop: '4px' }}>
              <label className="dealer-form-label" style={{ fontSize: '0.78rem' }}>
                External Image URL (Fallback / Unsplash / CDN)
              </label>
              <input
                type="url"
                name="image"
                className="dealer-form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.image || ''}
                onChange={handleChange}
              />
            </div>

            {/* Pending (Newly Selected) Images */}
            {newImageFiles.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dealer-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Newly Selected Photos ({newImageFiles.length} Pending Upload)
                  </span>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--dealer-text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      newImageFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
                      setNewImageFiles([]);
                    }}
                  >
                    Clear All Pending
                  </button>
                </div>

                <div className="dealer-gallery-grid">
                  {newImageFiles.map((item, index) => (
                    <div
                      key={item.id}
                      className={`dealer-gallery-card ${item.isPrimary ? 'is-primary' : ''}`}
                    >
                      <div className="dealer-gallery-card-thumb-wrap">
                        <img
                          src={item.previewUrl}
                          alt={`New preview ${index + 1}`}
                          className="dealer-gallery-card-thumb"
                        />
                        {item.isPrimary && (
                          <div className="dealer-gallery-primary-badge">
                            <Star size={11} fill="#0c0a09" />
                            <span>PRIMARY</span>
                          </div>
                        )}
                        <div className="dealer-gallery-order-badge">
                          NEW
                        </div>
                      </div>

                      <div className="dealer-gallery-card-body">
                        <div className="dealer-gallery-card-meta">
                          <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.file.name}>
                            {item.file.name}
                          </span>
                          <span>{item.sizeFormatted}</span>
                        </div>

                        <div className="dealer-gallery-card-actions">
                          <button
                            type="button"
                            className={`dealer-gallery-primary-btn ${item.isPrimary ? 'active' : ''}`}
                            onClick={() => handleSetPrimaryNew(item.id)}
                            title="Set as primary cover photo"
                          >
                            <Star size={12} fill={item.isPrimary ? 'var(--dealer-lime)' : 'none'} color={item.isPrimary ? 'var(--dealer-lime)' : 'currentColor'} />
                            <span>{item.isPrimary ? 'Cover' : 'Make Cover'}</span>
                          </button>

                          <button
                            type="button"
                            className="dealer-gallery-icon-btn danger"
                            onClick={() => handleRemoveNewImage(item.id)}
                            title="Remove this photo before saving"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Existing Images */}
            {existingImages.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="var(--dealer-lime)" />
                  <span>Saved Showroom Gallery ({existingImages.length} Active Photos)</span>
                </div>

                <div className="dealer-gallery-grid">
                  {existingImages.map((img, index) => {
                    const isPrim = Boolean(img.is_primary);
                    return (
                      <div
                        key={img.id || index}
                        className={`dealer-gallery-card ${isPrim ? 'is-primary' : ''}`}
                      >
                        <div className="dealer-gallery-card-thumb-wrap">
                          <img
                            src={img.image}
                            alt={`Gallery asset ${index + 1}`}
                            className="dealer-gallery-card-thumb"
                            onError={(e) => {
                              e.target.src = getVehicleFallback(formData.brand, formData.model);
                            }}
                          />
                          {isPrim && (
                            <div className="dealer-gallery-primary-badge">
                              <Star size={11} fill="#0c0a09" />
                              <span>PRIMARY</span>
                            </div>
                          )}
                          <div className="dealer-gallery-order-badge">
                            #{index + 1}
                          </div>
                        </div>

                        <div className="dealer-gallery-card-body">
                          <div className="dealer-gallery-card-meta">
                            <span>Photo #{index + 1}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                type="button"
                                className="dealer-gallery-icon-btn"
                                style={{ width: '22px', height: '22px' }}
                                disabled={index === 0}
                                onClick={() => handleMoveExisting(index, -1)}
                                title="Move Earlier"
                              >
                                <ArrowUp size={11} />
                              </button>
                              <button
                                type="button"
                                className="dealer-gallery-icon-btn"
                                style={{ width: '22px', height: '22px' }}
                                disabled={index === existingImages.length - 1}
                                onClick={() => handleMoveExisting(index, 1)}
                                title="Move Later"
                              >
                                <ArrowDown size={11} />
                              </button>
                            </div>
                          </div>

                          <div className="dealer-gallery-card-actions">
                            <button
                              type="button"
                              className={`dealer-gallery-primary-btn ${isPrim ? 'active' : ''}`}
                              onClick={() => handleSetPrimaryExisting(img.id)}
                              disabled={isPrim}
                              title={isPrim ? 'Currently primary' : 'Set as primary showroom cover photo'}
                            >
                              <Star size={12} fill={isPrim ? 'var(--dealer-lime)' : 'none'} color={isPrim ? 'var(--dealer-lime)' : 'currentColor'} />
                              <span>{isPrim ? 'Cover Photo' : 'Set Cover'}</span>
                            </button>

                            <button
                              type="button"
                              className="dealer-gallery-icon-btn danger"
                              onClick={() => setImageToDelete(img)}
                              disabled={deletingImageId === img.id}
                              title="Delete photo from vehicle gallery"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {existingImages.length === 0 && newImageFiles.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--dealer-border-subtle)', color: 'var(--dealer-text-muted)', fontSize: '0.82rem' }}>
                <ImageIcon size={28} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.4 }} />
                <span>No photos uploaded yet. Select one or more images above to build the vehicle gallery.</span>
              </div>
            )}

            {uploadStatus && (
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--dealer-lime)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="dealer-spinner" style={{ width: '14px', height: '14px' }} />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry, Cover Preview & Inventory */}
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

          {/* Primary Cover Image Preview Card */}
          <div className="dealer-form-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '0.95rem', color: '#fff', margin: 0 }}>
                Primary Cover Photo
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--dealer-lime)', fontFamily: 'var(--dealer-font-mono)' }}>
                Marketplace Preview
              </span>
            </div>

            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--dealer-border-subtle)', background: '#090d16' }}>
              <img
                src={activeCoverPreview}
                alt="Active Primary Preview"
                style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.src = getVehicleFallback(formData.brand, formData.model);
                }}
              />
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#fff' }}>
                Cover Photo
              </div>
            </div>

            <button
              type="button"
              className="dealer-btn-secondary"
              style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '6px' }}
              onClick={() => document.getElementById('gallery-file-input')?.click()}
            >
              <Upload size={14} />
              <span>+ Select Additional Photos</span>
            </button>
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
        </div>
      </form>
    </div>
  );
}
