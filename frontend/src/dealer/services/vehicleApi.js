// ==========================================================================
// CARCRAFT DEALER SUITE - VEHICLE FLEET API SERVICE
// Connects to Django REST API: GET/POST/PATCH/DELETE /api/vehicles/
// Transforms camelCase form data ↔ snake_case Django API fields
// ==========================================================================

import dealerApiClient from './api';
import { initialDealerVehicles } from '../data/dealerVehiclesMock';
import { getVehicleFallback } from '../../utils/imageFallback';

// In-memory runtime cache for mock fallback during development
let runtimeVehicles = [...initialDealerVehicles];

// ── Field name mappings ────────────────────────────────────────────────────
// Django model uses snake_case; the form uses camelCase.
// These functions handle the translation in both directions.

/**
 * Converts form camelCase fields → Django snake_case payload.
 * Also maps status values: 'Available' → 'AVAILABLE', etc.
 */
function parseNum(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Converts form camelCase fields → Django snake_case payload.
 * Also maps status values: 'Available' → 'AVAILABLE', etc.
 */
function toApiPayload(formData) {
  const statusMap = {
    Available: 'AVAILABLE',
    Reserved: 'RESERVED',
    Sold: 'SOLD',
    Unavailable: 'UNAVAILABLE',
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    SOLD: 'SOLD',
    UNAVAILABLE: 'UNAVAILABLE',
  };

  const fuelMap = {
    'Pure Electric': 'Pure Electric',
    'Electric': 'Electric',
    'Petrol': 'Petrol',
    'Diesel': 'Diesel',
    'Plug-in Hybrid': 'Plug-in Hybrid',
    'Hybrid': 'Hybrid',
    'Mild Hybrid': 'Mild Hybrid',
  };

  const transMap = {
    'Automatic': 'Automatic',
    '8-Speed Automatic': 'Automatic',
    'Direct Drive': 'Direct Drive',
    'Dual-Clutch': 'Dual-Clutch',
    '7-Speed Dual-Clutch': 'Dual-Clutch',
    'Manual': 'Manual',
    '6-Speed Manual': 'Manual',
    'Semi-Automatic': 'Semi-Automatic',
  };

  const bodyMap = {
    'Supercar': 'Supercar',
    'Coupe': 'Coupe',
    'Sedan': 'Sedan',
    'SUV': 'SUV',
    'Performance SUV': 'SUV',
    'Convertible': 'Convertible',
    'Hatchback': 'Hatchback',
    'Truck': 'Truck',
    'Wagon': 'Wagon',
  };

  const payload = {
    brand: String(formData.brand || '').trim(),
    model: String(formData.model || '').trim(),
    year: parseNum(formData.year) || new Date().getFullYear(),
    vin: String(formData.vin || '').trim(),
    price: parseNum(formData.price),
    purchase_cost: parseNum(formData.purchaseCost ?? formData.purchase_cost),
    fuel: fuelMap[formData.fuel] || formData.fuel || 'Petrol',
    transmission: transMap[formData.transmission] || formData.transmission || 'Automatic',
    mileage: parseNum(formData.mileage),
    body_type: bodyMap[formData.bodyType ?? formData.body_type] || 'Sedan',
    engine: String(formData.engine || '').trim(),
    horsepower: parseNum(formData.horsepower),
    torque: parseNum(formData.torque),
    seats: parseNum(formData.seats) || 5,
    top_speed: parseNum(formData.topSpeed ?? formData.top_speed),
    color: String(formData.color || '').trim(),
    description: String(formData.description || '').trim(),
    features: Array.isArray(formData.features) ? formData.features : [],
    stock_quantity: parseNum(formData.stock ?? formData.stock_quantity) || 1,
    status: statusMap[formData.status] || 'AVAILABLE',
  };

  if (formData.image && typeof formData.image === 'string' && !formData.imageFile) {
    payload.image = formData.image;
    payload.image_url = formData.image;
  }

  return payload;
}

const getBackendBase = () => (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');

/**
 * Normalizes a Django API response vehicle → dealer UI format.
 * Wraps in { success, vehicle } envelope that the pages expect.
 */
function normalizeApiVehicle(apiVehicle) {
  if (!apiVehicle) return null;
  const brand = apiVehicle.brand || '';
  const model = apiVehicle.model || '';
  const defaultFallback = getVehicleFallback(brand, model);
  
  let img = apiVehicle.image || '';
  if (img && img.startsWith('/') && !img.startsWith('http')) {
    img = `${getBackendBase()}${img}`;
  } else if (!img || img.includes('carcraft-image-fallback.svg')) {
    img = defaultFallback;
  }

  return {
    id: String(apiVehicle.id),
    brand,
    model,
    year: apiVehicle.year,
    vin: apiVehicle.vin || `W${brand.slice(0, 3).toUpperCase()}${String(apiVehicle.id).padStart(4, '0')}789`,
    price: Number(apiVehicle.price),
    purchaseCost: Number(apiVehicle.purchase_cost || 0),
    purchase_cost: Number(apiVehicle.purchase_cost || 0),
    fuel: apiVehicle.fuel,
    transmission: apiVehicle.transmission,
    mileage: apiVehicle.mileage,
    bodyType: apiVehicle.body_type,
    body_type: apiVehicle.body_type,
    engine: apiVehicle.engine || '',
    horsepower: apiVehicle.horsepower || 0,
    torque: apiVehicle.torque || 0,
    seats: apiVehicle.seats || 5,
    topSpeed: apiVehicle.top_speed || 0,
    top_speed: apiVehicle.top_speed || 0,
    color: apiVehicle.color || '',
    description: apiVehicle.description || '',
    features: Array.isArray(apiVehicle.features) ? apiVehicle.features : [],
    stock: apiVehicle.stock_quantity ?? 1,
    stock_quantity: apiVehicle.stock_quantity ?? 1,
    status: apiVehicle.status,
    image: img,
    gallery_images: apiVehicle.gallery_images || [],
    dateAdded: apiVehicle.created_at ? apiVehicle.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    potentialMargin: Number(apiVehicle.price) - Number(apiVehicle.purchase_cost || 0),
  };
}

/**
 * Normalizes a DRF paginated (or plain array) list response.
 * Handles both { results: [] } and plain array from backend.
 */
function normalizeListResponse(data, params = {}) {
  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 6;

  let rawVehicles = [];
  let total = 0;

  if (Array.isArray(data)) {
    rawVehicles = data;
    total = data.length;
  } else if (data?.results) {
    rawVehicles = data.results;
    total = data.count || data.results.length;
  }

  const vehicles = rawVehicles.map(normalizeApiVehicle);

  // Client-side filtering for dealer suite (backend already filters by status)
  let filtered = [...vehicles];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }

  if (params.status && params.status !== 'All') {
    const statusMap = {
      Available: 'AVAILABLE',
      Reserved: 'RESERVED',
      Sold: 'SOLD',
      Unavailable: 'UNAVAILABLE',
    };
    const mapped = statusMap[params.status] || params.status;
    filtered = filtered.filter((v) => v.status === mapped);
  }

  if (params.brand && params.brand !== 'All') {
    filtered = filtered.filter((v) => v.brand === params.brand);
  }

  if (params.year && params.year !== 'All') {
    filtered = filtered.filter((v) => String(v.year) === String(params.year));
  }

  // Sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year_desc':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'date_desc':
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
  }

  // Pagination (when backend returns all; if paginated already, skip)
  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // Summary telemetry
  const totalValuation = vehicles.reduce((s, v) => s + v.price * (v.stock || 1), 0);
  const totalProcurementCost = vehicles.reduce((s, v) => s + v.purchaseCost * (v.stock || 1), 0);

  return {
    success: true,
    vehicles: paginated,
    total: totalFiltered,
    page,
    totalPages,
    limit,
    summary: {
      totalVehicles: vehicles.length,
      availableUnits: vehicles.filter((v) => v.status === 'AVAILABLE').length,
      reservedUnits: vehicles.filter((v) => v.status === 'RESERVED').length,
      soldUnits: vehicles.filter((v) => v.status === 'SOLD').length,
      totalValuation,
      totalProcurementCost,
      projectedGrossMargin: totalValuation - totalProcurementCost,
    },
  };
}

// ── Mock fallback helpers ──────────────────────────────────────────────────

function mockGetList(params = {}) {
  let filtered = [...runtimeVehicles];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.vin && v.vin.toLowerCase().includes(q))
    );
  }

  if (params.status && params.status !== 'All') {
    filtered = filtered.filter((v) => v.status === params.status);
  }

  if (params.brand && params.brand !== 'All') {
    filtered = filtered.filter((v) => v.brand === params.brand);
  }

  if (params.year && params.year !== 'All') {
    filtered = filtered.filter((v) => String(v.year) === String(params.year));
  }

  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year_desc':
        filtered.sort((a, b) => b.year - a.year);
        break;
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
  }

  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 6;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const totalValuation = runtimeVehicles.reduce((s, v) => s + v.price * (v.stock || 1), 0);
  const totalProcurementCost = runtimeVehicles.reduce((s, v) => s + (v.purchaseCost || 0) * (v.stock || 1), 0);

  return {
    success: true,
    vehicles: paginated,
    total,
    page,
    totalPages,
    limit,
    summary: {
      totalVehicles: runtimeVehicles.length,
      availableUnits: runtimeVehicles.filter((v) => v.status === 'Available').length,
      reservedUnits: runtimeVehicles.filter((v) => v.status === 'Reserved').length,
      soldUnits: runtimeVehicles.filter((v) => v.status === 'Sold').length,
      totalValuation,
      totalProcurementCost,
      projectedGrossMargin: totalValuation - totalProcurementCost,
    },
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

export const vehicleApi = {
  /**
   * Fetches paginated & filtered vehicle fleet.
   * Endpoint: GET /api/vehicles/
   */
  async getVehicles(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page_size', '100');
      // Only send status to backend if dealer needs all statuses
      if (params.search) queryParams.set('search', params.search);
      if (params.brand && params.brand !== 'All') queryParams.set('brand', params.brand);

      const url = `/vehicles/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const data = await dealerApiClient.get(url);

      // normalizeListResponse handles client-side filter/sort/paginate
      return normalizeListResponse(data, params);
    } catch (err) {
      console.warn('[vehicleApi] getVehicles falling back to mock:', err.message);
      return mockGetList(params);
    }
  },

  /**
   * Retrieves single vehicle details.
   * Endpoint: GET /api/vehicles/:id/
   */
  async getVehicleById(id) {
    try {
      const data = await dealerApiClient.get(`/vehicles/${id}/`);
      const vehicle = normalizeApiVehicle(data);
      return { success: true, vehicle };
    } catch (err) {
      console.warn('[vehicleApi] getVehicleById falling back to mock:', err.message);
      const vehicle = runtimeVehicles.find((v) => String(v.id) === String(id));
      if (!vehicle) throw new Error(`Vehicle #${id} not found.`);
      return { success: true, vehicle };
    }
  },

  /**
   * Registers a new vehicle into the dealer fleet.
   * Endpoint: POST /api/vehicles/
   * Supports JSON payloads (with image URL) or FormData (with uploaded image file).
   */
  async createVehicle(formData) {
    let payload;
    if (formData.imageFile instanceof File) {
      const raw = toApiPayload(formData);
      const fd = new FormData();
      Object.entries(raw).forEach(([k, v]) => {
        if (k === 'features') {
          fd.append(k, JSON.stringify(v));
        } else if (v !== null && v !== undefined) {
          fd.append(k, v);
        }
      });
      fd.append('image', formData.imageFile);
      payload = fd;
    } else {
      payload = toApiPayload(formData);
    }

    const data = await dealerApiClient.post('/vehicles/', payload);
    const vehicle = normalizeApiVehicle(data);
    return { success: true, vehicle };
  },

  /**
   * Updates an existing fleet vehicle.
   * Endpoint: PATCH /api/vehicles/:id/
   */
  async updateVehicle(id, formData) {
    let payload;
    if (formData.imageFile instanceof File) {
      const raw = toApiPayload(formData);
      const fd = new FormData();
      Object.entries(raw).forEach(([k, v]) => {
        if (k === 'features') {
          fd.append(k, JSON.stringify(v));
        } else if (v !== null && v !== undefined) {
          fd.append(k, v);
        }
      });
      fd.append('image', formData.imageFile);
      payload = fd;
    } else {
      payload = toApiPayload(formData);
    }

    const data = await dealerApiClient.patch(`/vehicles/${id}/`, payload);
    const vehicle = normalizeApiVehicle(data);
    return { success: true, vehicle };
  },

  /**
   * Removes a vehicle from the fleet ledger.
   * Endpoint: DELETE /api/vehicles/:id/
   */
  async deleteVehicle(id) {
    await dealerApiClient.delete(`/vehicles/${id}/`);
    return { success: true, message: `Vehicle #${id} removed successfully.` };
  },
};

export default vehicleApi;
