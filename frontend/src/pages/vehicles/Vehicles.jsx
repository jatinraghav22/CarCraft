import { formatINR } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Heart, 
  Zap, 
  Gauge, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Fuel, 
  Check, 
  X, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { mockVehicles } from '../../data/vehicles';
import vehicleApi from '../../api/vehicleApi';
import { normalizeVehicle } from '../../api/normalizers';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Vehicles.css';

const sortOptions = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'featured', label: 'Featured Fleet' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'power-high', label: 'Power: High to Low' },
  { value: 'acceleration', label: '0-60: Fastest First' },
  { value: 'year-newest', label: 'Year: Newest First' },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250000000);
  const [sortBy, setSortBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { addToast } = useToast();

  const fetchVehicles = () => {
    setLoading(true);
    vehicleApi.getVehicles({ page_size: 100 })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length > 0) {
          setVehicles(list.map(normalizeVehicle));
        } else {
          setVehicles(mockVehicles.map(normalizeVehicle));
        }
      })
      .catch((err) => {
        console.warn('Backend vehicles fetch error, fallback to initial catalog:', err.message);
        setVehicles(mockVehicles.map(normalizeVehicle));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Live synchronizer: refetches latest catalog whenever window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchVehicles();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const activeVehicles = useMemo(() => {
    return vehicles.length > 0 ? vehicles : mockVehicles.map(normalizeVehicle);
  }, [vehicles]);

  // Extract unique brands, body types, fuel types, years
  const brands = useMemo(() => ['All', ...new Set(activeVehicles.map((v) => v.brand))], [activeVehicles]);
  const bodyTypes = useMemo(() => ['All', ...new Set(activeVehicles.map((v) => v.bodyType))], [activeVehicles]);
  const fuelTypes = useMemo(() => ['All', ...new Set(activeVehicles.map((v) => v.fuel))], [activeVehicles]);
  const transmissions = useMemo(() => ['All', ...new Set(activeVehicles.map((v) => v.transmission))], [activeVehicles]);
  const years = useMemo(() => ['All', ...new Set(activeVehicles.map((v) => v.year.toString()))], [activeVehicles]);

  // Filter Logic - determines WHICH vehicles are shown
  const filteredVehicles = useMemo(() => {
    return activeVehicles.filter((vehicle) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchModel = (vehicle.model || '').toLowerCase().includes(query);
        const matchBrand = (vehicle.brand || '').toLowerCase().includes(query);
        const matchDesc = (vehicle.description || '').toLowerCase().includes(query);
        const matchTagline = (vehicle.tagline || '').toLowerCase().includes(query);
        if (!matchModel && !matchBrand && !matchDesc && !matchTagline) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'All' && vehicle.brand !== selectedBrand) {
        return false;
      }

      // Body type filter
      if (selectedBodyType !== 'All' && vehicle.bodyType !== selectedBodyType) {
        return false;
      }

      // Fuel filter
      if (selectedFuel !== 'All' && vehicle.fuel !== selectedFuel) {
        return false;
      }

      // Transmission filter
      if (selectedTransmission !== 'All' && vehicle.transmission !== selectedTransmission) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'All' && vehicle.year.toString() !== selectedYear) {
        return false;
      }

      // Price filter
      if (vehicle.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [
    activeVehicles,
    searchTerm,
    selectedBrand,
    selectedBodyType,
    selectedFuel,
    selectedTransmission,
    selectedYear,
    maxPrice,
  ]);

  // Sort Logic - determines ORDER of vehicles (preserving original order for 'all')
  const sortedVehicles = useMemo(() => {
    if (sortBy === 'all') {
      return filteredVehicles;
    }

    const list = [...filteredVehicles];
    return list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'power-high') return (b.powerNum || 0) - (a.powerNum || 0);
      if (sortBy === 'acceleration' || sortBy === 'accel-fast') return (a.accelerationNum || 99) - (b.accelerationNum || 99);
      if (sortBy === 'year-newest' || sortBy === 'year-new') return b.year - a.year;
      return 0; // featured default
    });
  }, [filteredVehicles, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSelectedYear('All');
    setMaxPrice(250000000);
    setSortBy('all');
  };

  const handleWishlistClick = (e, vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(vehicle);
    addToast(
      added
        ? `${vehicle.model} saved to your Wishlist`
        : `${vehicle.model} removed from your Wishlist`,
      'success'
    );
  };

  const handleCompareClick = (e, vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCompare(vehicle);
    if (!result.success && result.action === 'limit') {
      addToast(result.message, 'error');
    } else {
      addToast(result.message, 'info');
    }
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedBrand !== 'All' ||
    selectedBodyType !== 'All' ||
    selectedFuel !== 'All' ||
    selectedTransmission !== 'All' ||
    selectedYear !== 'All' ||
    maxPrice < 250000000 ||
    sortBy !== 'all';

  return (
    <div className="vehicles-page">
      <Navbar />

      <main className="vehicles-container">
        {/* Hero Header */}
        <section className="vehicles-hero">
          <div className="vehicles-hero-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
            CARCRAFT FLEET // 2026 INVENTORY
          </div>
          <h1 className="vehicles-hero-title">VEHICLES MARKETPLACE</h1>
          <p className="vehicles-hero-subtitle">
            Explore curated hypercars, cutting-edge electric performance vehicles, and grand tourers built with race-proven engineering.
          </p>
        </section>

        {/* Controls & Search Bar */}
        <div className="vehicles-control-bar">
          <div className="vehicles-search-wrapper">
            <Search className="vehicles-search-icon" size={18} />
            <input
              type="text"
              className="vehicles-search-input"
              placeholder="Search by model, brand, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="vehicles-actions-group">
            {/* Filter Drawer Toggle */}
            <button
              className={`vehicles-filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              FILTERS {hasActiveFilters && '•'}
              <ChevronDown
                size={14}
                style={{
                  transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Sort Select */}
            <select
              className="vehicles-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`vehicles-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`vehicles-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="vehicles-filter-panel">
            {/* Brand Filter */}
            <div>
              <div className="filter-group-title">Brand</div>
              <div className="filter-chips-row">
                {brands.map((b) => (
                  <button
                    key={b}
                    className={`filter-chip ${selectedBrand === b ? 'active' : ''}`}
                    onClick={() => setSelectedBrand(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div>
              <div className="filter-group-title">Body Type</div>
              <div className="filter-chips-row">
                {bodyTypes.map((t) => (
                  <button
                    key={t}
                    className={`filter-chip ${selectedBodyType === t ? 'active' : ''}`}
                    onClick={() => setSelectedBodyType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <div className="filter-group-title">Powertrain / Fuel</div>
              <div className="filter-chips-row">
                {fuelTypes.map((f) => (
                  <button
                    key={f}
                    className={`filter-chip ${selectedFuel === f ? 'active' : ''}`}
                    onClick={() => setSelectedFuel(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <div className="filter-group-title">Transmission</div>
              <div className="filter-chips-row">
                {transmissions.map((tr) => (
                  <button
                    key={tr}
                    className={`filter-chip ${selectedTransmission === tr ? 'active' : ''}`}
                    onClick={() => setSelectedTransmission(tr)}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <div className="filter-group-title">Model Year</div>
              <div className="filter-chips-row">
                {years.map((y) => (
                  <button
                    key={y}
                    className={`filter-chip ${selectedYear === y ? 'active' : ''}`}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="filter-group-title">
                Max Price: {formatINR(maxPrice)}
              </div>
              <input
                type="range"
                min="2000000"
                max="250000000"
                step="1000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#bef264',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginTop: '4px',
                }}
              >
                <span>₹20 Lakh</span>
                <span>₹25 Cr+</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter & Clear Filter Row */}
        <div className="vehicles-status-row">
          <div className="vehicles-count">
            SHOWING <strong>{sortedVehicles.length}</strong> OF{' '}
            <strong>{activeVehicles.length}</strong> VEHICLES
          </div>
          {hasActiveFilters && (
            <button className="vehicles-clear-all-btn" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>

        {/* Vehicle Cards Grid / List */}
        {sortedVehicles.length === 0 ? (
          <div className="vehicles-empty">
            <div className="vehicles-empty-icon">
              <RotateCcw size={28} />
            </div>
            <h3 className="vehicles-empty-title">NO VEHICLES MATCH YOUR CRITERIA</h3>
            <p className="vehicles-empty-subtitle">
              We couldn't find any vehicles matching your filter criteria. Try expanding your price range or resetting selected options.
            </p>
            <button className="vehicles-empty-btn" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'vehicles-grid' : 'vehicles-list'}>
            {sortedVehicles.map((vehicle) => {
              const inWish = isInWishlist(vehicle.id);
              const inComp = isInCompare(vehicle.id);

              return (
                <div key={vehicle.id} className="vehicle-card">
                  {/* Media View */}
                  <div className="vehicle-card-media">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="vehicle-card-img"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {vehicle.badge && (
                      <div className="vehicle-card-badge">{vehicle.badge}</div>
                    )}
                    <div className="vehicle-card-actions-top">
                      {/* Compare Button */}
                      <button
                        className={`vehicle-card-btn-icon ${inComp ? 'active' : ''}`}
                        onClick={(e) => handleCompareClick(e, vehicle)}
                        title={inComp ? 'Remove from compare' : 'Add to compare'}
                      >
                        <Layers size={16} />
                      </button>

                      {/* Wishlist Button */}
                      <button
                        className={`vehicle-card-btn-icon ${inWish ? 'active' : ''}`}
                        onClick={(e) => handleWishlistClick(e, vehicle)}
                        title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart size={16} fill={inWish ? '#bef264' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="vehicle-card-body">
                    <div className="vehicle-card-brand-row">
                      <span className="vehicle-card-brand">{vehicle.brand}</span>
                      <span className="vehicle-card-year">{vehicle.year}</span>
                    </div>

                    <h3 className="vehicle-card-title">{vehicle.model}</h3>

                    <div className="vehicle-card-price-row">
                      <span className="vehicle-card-price">{vehicle.formattedPrice}</span>
                      <span className="vehicle-card-est-financing">
                        Est. {formatINR(Math.round(vehicle.price / 60))}/mo
                      </span>
                    </div>

                    {/* Spec Summary Chips */}
                    <div className="vehicle-card-specs">
                      <div className="vehicle-spec-item">
                        <Zap size={15} color="#bef264" />
                        <span><strong>{vehicle.power}</strong></span>
                      </div>
                      <div className="vehicle-spec-item">
                        <Gauge size={15} color="#bef264" />
                        <span><strong>{vehicle.acceleration}</strong></span>
                      </div>
                      <div className="vehicle-spec-item">
                        <Fuel size={15} color="#94a3b8" />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="vehicle-spec-item">
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="vehicle-spec-item">
                        <span>{vehicle.mileage}</span>
                      </div>
                      <div className="vehicle-spec-item">
                        <span>{vehicle.bodyType}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="vehicle-card-footer">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="vehicle-card-cta"
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
