import { formatINR } from '../utils/currency';
import { DEFAULT_CARCRAFT_FALLBACK, getPartCategoryFallback, getVehicleFallback } from '../utils/imageFallback';

// Data normalizers: bridge backend Django REST responses with frontend UI expectations
// Ensures complete compatibility with existing templates, Three.js canvases, and cards.

const getBackendBase = () => {
  return (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');
};

export function normalizeVehicle(v) {
  if (!v) return null;
  const priceNum = typeof v.price === 'string' ? parseFloat(v.price) : Number(v.price || 0);
  const backendBase = getBackendBase();
  
  let img = v.image || '';
  if (img && img.startsWith('/')) {
    img = `${backendBase}${img}`;
  } else if (img && img.includes('127.0.0.1:8000') && !backendBase.includes('127.0.0.1')) {
    img = img.replace('http://127.0.0.1:8000', backendBase);
  } else if (!img || img.includes('carcraft-image-fallback.svg')) {
    img = getVehicleFallback(v.brand, v.model);
  }

  const galleryList = Array.isArray(v.gallery_images) && v.gallery_images.length > 0
    ? v.gallery_images.map(g => {
        let gImg = g.image || '';
        if (gImg.startsWith('/')) return `${backendBase}${gImg}`;
        if (gImg.includes('127.0.0.1:8000') && !backendBase.includes('127.0.0.1')) {
          return gImg.replace('http://127.0.0.1:8000', backendBase);
        }
        return gImg;
      })
    : (v.gallery || [img]);

  return {
    ...v,
    id: String(v.id),
    rawId: v.id,
    brand: v.brand,
    model: v.model,
    vin: v.vin || `W${(v.brand || 'CAR').slice(0, 3).toUpperCase()}${String(v.id).padStart(4, '0')}789`,
    name: `${v.brand} ${v.model}`,
    year: v.year,
    price: priceNum,
    formattedPrice: formatINR(priceNum),
    bodyType: v.body_type || v.bodyType || 'Coupe',
    fuel: v.fuel || v.fuelType || 'Petrol',
    transmission: v.transmission || 'Automatic',
    mileage: v.mileage ? `${v.mileage} km` : (v.mileage || '0 km'),
    power: v.horsepower ? `${v.horsepower} HP` : (v.power || '450 HP'),
    torque: v.torque ? `${v.torque} Nm` : (v.torque || '530 Nm'),
    topSpeed: v.top_speed ? `${v.top_speed} km/h` : (v.topSpeed || '280 km/h'),
    acceleration: v.acceleration || '3.5s (0-100 km/h)',
    seats: v.seats || 2,
    color: v.color || 'Acid Lime Metallic',
    description: v.description || `${v.year} ${v.brand} ${v.model}`,
    image: img,
    gallery: galleryList,
    inStock: v.stock_quantity !== undefined ? v.stock_quantity : (v.inStock || 1),
    status: v.status || 'AVAILABLE',
  };
}

export function normalizePart(p) {
  if (!p) return null;
  const priceNum = typeof p.selling_price === 'string'
    ? parseFloat(p.selling_price)
    : (typeof p.price === 'string' ? parseFloat(p.price) : Number(p.selling_price || p.price || 0));
  
  const backendBase = getBackendBase();
  let img = p.image || '';
  if (img && img.startsWith('/')) {
    img = `${backendBase}${img}`;
  } else if (img && img.includes('127.0.0.1:8000') && !backendBase.includes('127.0.0.1')) {
    img = img.replace('http://127.0.0.1:8000', backendBase);
  } else if (!img) {
    img = getPartCategoryFallback(p.category, p.name);
  }

  let compatList = [];
  if (Array.isArray(p.compatibility)) {
    compatList = p.compatibility;
  } else if (typeof p.compatibility === 'string' && p.compatibility.trim()) {
    compatList = p.compatibility.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (compatList.length === 0) {
    compatList = ['Universal Fitment'];
  }

  return {
    ...p,
    id: String(p.id),
    rawId: p.id,
    name: p.name,
    sku: p.sku || `SKU-${p.id}`,
    brand: p.brand || 'CARCRAFT',
    category: p.category || 'Component',
    price: priceNum,
    formattedPrice: formatINR(priceNum),
    stockCount: p.stock_quantity !== undefined ? p.stock_quantity : (p.stockCount || 10),
    inStock: p.stock_quantity !== undefined ? p.stock_quantity > 0 : true,
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || 18,
    description: p.description || '',
    compatibility: compatList,
    image: img,
  };
}
