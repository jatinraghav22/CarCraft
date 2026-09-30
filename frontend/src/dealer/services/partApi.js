// ==========================================================================
// CARCRAFT DEALER SUITE - PARTS CATALOG API SERVICE
// Connects to Django REST API: GET/POST/PATCH/DELETE /api/parts/
// Transforms camelCase form data ↔ snake_case Django API fields
// ==========================================================================

import dealerApiClient from './api';
import { initialDealerParts } from '../data/dealerPartsMock';
import { getPartCategoryFallback } from '../../utils/imageFallback';

let runtimeParts = [...initialDealerParts];

// ── Field name mappings ────────────────────────────────────────────────────

/**
 * Converts form camelCase fields → Django snake_case payload.
 * Maps status labels: 'In Stock' → 'AVAILABLE', etc.
 * The compatibility array is joined into a comma-separated string.
 */
function toApiPayload(formData) {
  const statusMap = {
    'In Stock': 'AVAILABLE',
    'Out of Stock': 'OUT_OF_STOCK',
    'Discontinued': 'DISCONTINUED',
    // pass-through if already uppercase
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    DISCONTINUED: 'DISCONTINUED',
  };

  // compatibility can be array (form) or string (API round-trip)
  const compatString = Array.isArray(formData.compatibility)
    ? formData.compatibility.join(', ')
    : (formData.compatibility || '');

  const payload = {
    name: formData.name,
    sku: formData.sku,
    brand: formData.brand,
    category: formData.category || 'Other',
    description: formData.description || formData.specifications || '',
    purchase_cost: Number(formData.purchaseCost ?? formData.purchase_cost) || 0,
    selling_price: Number(formData.price ?? formData.selling_price) || 0,
    stock_quantity: Number(formData.stock ?? formData.stock_quantity) || 0,
    minimum_stock: Number(formData.minStockLevel ?? formData.minimum_stock) || 5,
    compatibility: compatString,
    status: statusMap[formData.status] || 'AVAILABLE',
  };
  if (formData.image) {
    payload.image = formData.image;
  }
  return payload;
}

const getBackendBase = () => (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');

/**
 * Normalizes a Django API Part response → dealer UI format.
 * Maps snake_case → camelCase and provides the { success, part } envelope.
 */
function normalizeApiPart(apiPart) {
  if (!apiPart) return null;

  // Convert compatibility string back to array for form/display
  const compatArray = apiPart.compatibility
    ? apiPart.compatibility.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  // Infer UI status from Django status code
  const statusDisplayMap = {
    AVAILABLE: 'In Stock',
    OUT_OF_STOCK: 'Out of Stock',
    DISCONTINUED: 'Discontinued',
  };

  const stockQty = apiPart.stock_quantity ?? 0;
  const minStock = apiPart.minimum_stock ?? 5;
  let uiStatus = statusDisplayMap[apiPart.status] || 'In Stock';
  if (apiPart.status === 'AVAILABLE' && stockQty <= minStock) {
    uiStatus = 'Low Stock';
  }

  return {
    id: String(apiPart.id),
    name: apiPart.name,
    sku: apiPart.sku,
    brand: apiPart.brand,
    category: apiPart.category,
    description: apiPart.description || '',
    specifications: apiPart.description || '',
    // UI fields
    price: Number(apiPart.selling_price),
    purchaseCost: Number(apiPart.purchase_cost || 0),
    selling_price: Number(apiPart.selling_price),
    purchase_cost: Number(apiPart.purchase_cost || 0),
    stock: stockQty,
    stock_quantity: stockQty,
    minStockLevel: minStock,
    minimum_stock: minStock,
    compatibility: compatArray,
    status: uiStatus,
    image: apiPart.image
      ? (apiPart.image.startsWith('/') && !apiPart.image.startsWith('http') ? `${getBackendBase()}${apiPart.image}` : apiPart.image)
      : getPartCategoryFallback(apiPart.category, apiPart.name),
    dateAdded: apiPart.created_at ? apiPart.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    potentialMargin: Number(apiPart.selling_price) - Number(apiPart.purchase_cost || 0),
  };
}

/**
 * Normalizes a DRF paginated or plain array response.
 * Applies client-side filter/sort/paginate for dealer suite.
 */
function normalizeListResponse(data, params = {}) {
  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 6;

  let rawParts = [];
  if (Array.isArray(data)) {
    rawParts = data;
  } else if (data?.results) {
    rawParts = data.results;
  }

  const allParts = rawParts.map(normalizeApiPart);
  let filtered = [...allParts];

  // Client-side filters
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  if (params.category && params.category !== 'All') {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.brand && params.brand !== 'All') {
    filtered = filtered.filter((p) => p.brand === params.brand);
  }

  if (params.status && params.status !== 'All') {
    filtered = filtered.filter((p) => p.status === params.status);
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
      case 'stock_asc':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock_desc':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
  }

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const totalUnitsInStock = allParts.reduce((s, p) => s + (p.stock || 0), 0);
  const totalValuation = allParts.reduce((s, p) => s + p.price * (p.stock || 0), 0);
  const totalCost = allParts.reduce((s, p) => s + (p.purchaseCost || 0) * (p.stock || 0), 0);

  return {
    success: true,
    parts: paginated,
    total: totalFiltered,
    page,
    totalPages,
    limit,
    summary: {
      totalSKUs: allParts.length,
      totalUnitsInStock,
      inStockSKUs: allParts.filter((p) => p.status === 'In Stock').length,
      lowStockSKUs: allParts.filter((p) => p.status === 'Low Stock').length,
      outOfStockSKUs: allParts.filter((p) => p.status === 'Out of Stock').length,
      totalValuation,
      totalCost,
      projectedMargin: totalValuation - totalCost,
    },
  };
}

// ── Mock fallback ──────────────────────────────────────────────────────────

function mockGetList(params = {}) {
  let filtered = [...runtimeParts];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  if (params.category && params.category !== 'All') {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.brand && params.brand !== 'All') {
    filtered = filtered.filter((p) => p.brand === params.brand);
  }

  if (params.status && params.status !== 'All') {
    filtered = filtered.filter((p) => p.status === params.status);
  }

  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'stock_asc': filtered.sort((a, b) => a.stock - b.stock); break;
      case 'stock_desc': filtered.sort((a, b) => b.stock - a.stock); break;
      default: filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
  }

  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 6;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const totalUnitsInStock = runtimeParts.reduce((s, p) => s + (p.stock || 0), 0);
  const totalValuation = runtimeParts.reduce((s, p) => s + (p.price * (p.stock || 0)), 0);
  const totalCost = runtimeParts.reduce((s, p) => s + ((p.purchaseCost || 0) * (p.stock || 0)), 0);

  return {
    success: true,
    parts: paginated,
    total,
    page,
    totalPages,
    limit,
    summary: {
      totalSKUs: runtimeParts.length,
      totalUnitsInStock,
      inStockSKUs: runtimeParts.filter((p) => p.status === 'In Stock').length,
      lowStockSKUs: runtimeParts.filter((p) => p.status === 'Low Stock').length,
      outOfStockSKUs: runtimeParts.filter((p) => p.status === 'Out of Stock').length,
      totalValuation,
      totalCost,
      projectedMargin: totalValuation - totalCost,
    },
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

export const partApi = {
  /**
   * Fetches paginated & filtered parts catalog.
   * Endpoint: GET /api/parts/
   */
  async getParts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.set('search', params.search);
      if (params.category && params.category !== 'All') queryParams.set('category', params.category);
      if (params.brand && params.brand !== 'All') queryParams.set('brand', params.brand);

      const url = `/parts/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const data = await dealerApiClient.get(url);
      return normalizeListResponse(data, params);
    } catch (err) {
      console.warn('[partApi] getParts falling back to mock:', err.message);
      return mockGetList(params);
    }
  },

  /**
   * Retrieves single part details.
   * Endpoint: GET /api/parts/:id/
   */
  async getPartById(id) {
    try {
      const data = await dealerApiClient.get(`/parts/${id}/`);
      const part = normalizeApiPart(data);
      return { success: true, part };
    } catch (err) {
      console.warn('[partApi] getPartById falling back to mock:', err.message);
      const part = runtimeParts.find((p) => String(p.id) === String(id));
      if (!part) throw new Error(`Component #${id} not found in catalog.`);
      return { success: true, part };
    }
  },

  /**
   * Registers a new part into the catalog.
   * Endpoint: POST /api/parts/
   * Transforms camelCase form → snake_case Django payload.
   */
  async createPart(formData) {
    const payload = toApiPayload(formData);

    try {
      const data = await dealerApiClient.post('/parts/', payload);
      const part = normalizeApiPart(data);
      return { success: true, part };
    } catch (err) {
      console.warn('[partApi] createPart falling back to mock:', err.message);
      const newPart = {
        ...formData,
        id: `prt-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0],
        price: Number(formData.price) || 0,
        purchaseCost: Number(formData.purchaseCost) || 0,
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        minStockLevel: Number(formData.minStockLevel) || 3,
        compatibility: Array.isArray(formData.compatibility) ? formData.compatibility : [],
      };
      runtimeParts = [newPart, ...runtimeParts];
      return { success: true, part: newPart };
    }
  },

  /**
   * Updates an existing catalog component.
   * Endpoint: PATCH /api/parts/:id/
   */
  async updatePart(id, formData) {
    const payload = toApiPayload(formData);

    try {
      const data = await dealerApiClient.patch(`/parts/${id}/`, payload);
      const part = normalizeApiPart(data);
      return { success: true, part };
    } catch (err) {
      console.warn('[partApi] updatePart falling back to mock:', err.message);
      const index = runtimeParts.findIndex((p) => String(p.id) === String(id));
      if (index === -1) throw new Error(`Component #${id} not found.`);
      const updated = {
        ...runtimeParts[index],
        ...formData,
        price: Number(formData.price) || runtimeParts[index].price,
        purchaseCost: Number(formData.purchaseCost) || runtimeParts[index].purchaseCost,
        stock: Number(formData.stock) ?? runtimeParts[index].stock,
        minStockLevel: Number(formData.minStockLevel) || runtimeParts[index].minStockLevel,
      };
      runtimeParts[index] = updated;
      return { success: true, part: updated };
    }
  },

  /**
   * Removes a part from the catalog.
   * Endpoint: DELETE /api/parts/:id/
   */
  async deletePart(id) {
    try {
      await dealerApiClient.delete(`/parts/${id}/`);
      return { success: true, message: `Component #${id} removed successfully.` };
    } catch (err) {
      console.warn('[partApi] deletePart falling back to mock:', err.message);
      runtimeParts = runtimeParts.filter((p) => String(p.id) !== String(id));
      return { success: true, message: `Component #${id} removed successfully.` };
    }
  },
};

export default partApi;
