// ==========================================================================
// CARCRAFT IMAGE FALLBACK UTILITY
// Guarantees zero broken-image icons throughout customer & dealer suites.
// Includes Category-Specific Component Fallbacks for Parts & Accessories.
// ==========================================================================

export const DEFAULT_CARCRAFT_FALLBACK = '/carcraft-image-fallback.svg';

export const PART_CATEGORY_FALLBACKS = {
  'Suspension': '/images/parts/suspension_coilover.jpg',
  'Brakes': '/images/parts/brakes_rotor_caliper.jpg',
  'Engine': '/images/parts/turbocharger_billet.jpg',
  'Engine Parts': '/images/parts/turbocharger_billet.jpg',
  'Exhaust': '/images/parts/exhaust_titanium_akrapovic.jpg',
  'Exhaust System': '/images/parts/exhaust_titanium_akrapovic.jpg',
  'Wheels': '/images/parts/wheel_forged_turbofan.jpg',
  'Wheels & Tires': '/images/parts/wheel_forged_turbofan.jpg',
  'Tyres': '/images/parts/tyre_michelin_cup2.jpg',
  'Exterior': '/images/parts/aerodynamics_gt_wing.jpg',
  'Body & Exterior': '/images/parts/aerodynamics_gt_wing.jpg',
  'Interior': '/images/parts/interior_racing_steering_wheel.jpg',
  'Interior Accessories': '/images/parts/interior_racing_steering_wheel.jpg',
  'Lighting': '/images/parts/lighting_matrix_headlight.jpg',
  'Electrical': '/images/parts/telemetry_display_module.jpg',
  'Electrical & Lighting': '/images/parts/lighting_matrix_headlight.jpg',
  'Electronics': '/images/parts/telemetry_display_module.jpg',
  'Performance': '/images/parts/exhaust_titanium_akrapovic.jpg',
  'Service & Maintenance': '/images/parts/fluids_engine_oil.jpg',
  'Fluids & Filters': '/images/parts/fluids_engine_oil.jpg',
  'Accessories': '/images/parts/accessories_carbon_luggage.jpg',
  'Other Accessories': '/images/parts/maintenance_wiper_blades.jpg',
  'Other': '/images/parts/maintenance_wiper_blades.jpg',
  'Car Care': '/images/parts/care_ceramic_detailing.jpg',
};

/**
 * Returns a category-specific component fallback image.
 * Guarantees that parts never display generic vehicle outlines or broken images.
 */
export function getPartCategoryFallback(category = '', partName = '') {
  const cat = String(category || '').toLowerCase();
  const name = String(partName || '').toLowerCase();

  if (name.includes('coilover') || name.includes('suspension') || cat.includes('suspension')) {
    return '/images/parts/suspension_coilover.jpg';
  }
  if (name.includes('brake') || name.includes('caliper') || name.includes('rotor') || cat.includes('brake')) {
    return '/images/parts/brakes_rotor_caliper.jpg';
  }
  if (name.includes('turbo') || name.includes('supercharger')) {
    return '/images/parts/turbocharger_billet.jpg';
  }
  if (name.includes('intake') || name.includes('filter')) {
    return '/images/parts/performance_carbon_intake.jpg';
  }
  if (name.includes('wheel') || name.includes('rim') || cat === 'wheels') {
    return '/images/parts/wheel_forged_turbofan.jpg';
  }
  if (name.includes('tyre') || name.includes('tire') || cat.includes('tire') || cat.includes('tyre')) {
    return '/images/parts/tyre_michelin_cup2.jpg';
  }
  if (name.includes('exhaust') || name.includes('downpipe') || name.includes('muffler') || cat.includes('exhaust')) {
    return '/images/parts/exhaust_titanium_akrapovic.jpg';
  }
  if (name.includes('wing') || name.includes('spoiler')) {
    return '/images/parts/aerodynamics_gt_wing.jpg';
  }
  if (name.includes('splitter') || name.includes('diffuser') || name.includes('canard') || cat.includes('exterior')) {
    return '/images/parts/aerodynamics_carbon_splitter.jpg';
  }
  if (name.includes('steering') || name.includes('wheel') || cat.includes('interior')) {
    return '/images/parts/interior_racing_steering_wheel.jpg';
  }
  if (name.includes('paddle') || name.includes('shifter')) {
    return '/images/parts/interior_paddle_shifters.jpg';
  }
  if (name.includes('light') || name.includes('lamp') || name.includes('headlight') || cat.includes('light')) {
    return '/images/parts/lighting_matrix_headlight.jpg';
  }
  if (name.includes('telemetry') || name.includes('logger') || name.includes('display') || cat.includes('electronics') || cat.includes('electrical')) {
    return '/images/parts/telemetry_display_module.jpg';
  }
  if (name.includes('oil') || name.includes('fluid') || name.includes('coolant') || cat.includes('fluids') || cat.includes('service')) {
    return '/images/parts/fluids_engine_oil.jpg';
  }
  if (name.includes('wiper') || name.includes('blade')) {
    return '/images/parts/maintenance_wiper_blades.jpg';
  }
  if (name.includes('cover')) {
    return '/images/parts/accessories_car_cover.jpg';
  }
  if (name.includes('ceramic') || name.includes('coating') || name.includes('detail') || cat.includes('care')) {
    return '/images/parts/care_ceramic_detailing.jpg';
  }

  // Exact or partial category match
  for (const [key, fallbackPath] of Object.entries(PART_CATEGORY_FALLBACKS)) {
    if (cat.includes(key.toLowerCase()) || key.toLowerCase().includes(cat)) {
      return fallbackPath;
    }
  }

  // Default component fallback is high-precision suspension component, not a car silhouette
  return '/images/parts/suspension_coilover.jpg';
}

/**
 * Universal onError event handler for <img> elements.
 * Automatically replaces broken/404 image sources with the CarCraft fallback.
 * Prevents infinite loop re-triggers if the fallback image itself triggers error.
 */
export function handleImageError(e) {
  if (!e || !e.currentTarget) return;
  const target = e.currentTarget;
  if (!target.dataset.hasFallback) {
    target.dataset.hasFallback = 'true';
    target.src = DEFAULT_CARCRAFT_FALLBACK;
  }
}

/**
 * Category-aware onError event handler specifically for parts and accessories images.
 * If a product image fails to load, it replaces it with the exact component image for that category.
 */
export function handlePartImageError(e, category = '', partName = '') {
  if (!e || !e.currentTarget) return;
  const target = e.currentTarget;
  if (!target.dataset.hasFallback) {
    target.dataset.hasFallback = 'true';
    target.src = getPartCategoryFallback(category, partName);
  }
}

/**
 * Brand & model-aware vehicle fallback image.
 * Guarantees that vehicles (like BMW M4) never display generic svg outlines.
 */
export function getVehicleFallback(brand = '', model = '') {
  const b = String(brand || '').toLowerCase();
  const m = String(model || '').toLowerCase();
  if (b.includes('bmw') || m.includes('m4')) {
    return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('porsche') || m.includes('911') || m.includes('gt3')) {
    return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('ferrari') || m.includes('sf90')) {
    return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('mercedes') || m.includes('amg')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('audi') || m.includes('rs6')) {
    return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('toyota') || m.includes('fortuner')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
  }
  if (b.includes('mahindra') || m.includes('scorpio')) {
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80';
}

export function handleVehicleImageError(e, brand = '', model = '') {
  if (!e || !e.currentTarget) return;
  const target = e.currentTarget;
  if (!target.dataset.hasFallback) {
    target.dataset.hasFallback = 'true';
    target.src = getVehicleFallback(brand, model);
  }
}

export default handleImageError;
