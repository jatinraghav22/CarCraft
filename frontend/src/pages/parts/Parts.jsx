import { formatINR } from '../../utils/currency';
import { handlePartImageError } from '../../utils/imageFallback';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X, 
  ChevronDown,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { mockParts, partCategories } from '../../data/parts';
import partsApi from '../../api/partsApi';
import { normalizePart } from '../../api/normalizers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Parts.css';

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    partsApi.getParts()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (list.length > 0) {
          setParts(list.map(normalizePart));
        } else {
          setParts(mockParts.map(normalizePart));
        }
      })
      .catch((err) => {
        console.warn('Backend parts fetch notice, using fallback catalog:', err.message);
        if (isMounted) setParts(mockParts.map(normalizePart));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const activeParts = useMemo(() => {
    return parts.length > 0 ? parts : mockParts.map(normalizePart);
  }, [parts]);

  // Extract unique brands
  const brands = useMemo(() => ['All', ...new Set(activeParts.map((p) => p.brand))], [activeParts]);

  // Filter & Sort Logic
  const filteredParts = useMemo(() => {
    return activeParts
      .filter((part) => {

        // Search
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchName = part.name.toLowerCase().includes(query);
          const matchBrand = part.brand.toLowerCase().includes(query);
          const matchCat = part.category.toLowerCase().includes(query);
          const matchDesc = part.description.toLowerCase().includes(query);
          const matchCompat = Array.isArray(part.compatibility)
            ? part.compatibility.some((c) => String(c).toLowerCase().includes(query))
            : (typeof part.compatibility === 'string' && part.compatibility.toLowerCase().includes(query));
          if (!matchName && !matchBrand && !matchCat && !matchDesc && !matchCompat) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All' && part.category !== selectedCategory) {
          return false;
        }

        // Brand
        if (selectedBrand !== 'All' && part.brand !== selectedBrand) {
          return false;
        }

        // Price
        if (part.price > maxPrice) {
          return false;
        }

        // Rating
        if (part.rating < minRating) {
          return false;
        }

        // Availability
        if (inStockOnly && (!part.stockCount || part.stockCount <= 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating-high') return b.rating - a.rating;
        if (sortBy === 'reviews-high') return b.reviews - a.reviews;
        if (sortBy === 'discount-high') return (b.discountNum || 0) - (a.discountNum || 0);
        return 0; // featured default
      });
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMinRating(0);
    setInStockOnly(false);
    setMaxPrice(1000000);
    setSortBy('featured');
  };

  const handleAddToCart = (e, part) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(part, 1);
    addToast(`${part.name} added to cart`, 'success');
  };

  const handleWishlistToggle = (e, part) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(part);
    addToast(
      added ? `${part.name} saved to wishlist` : `${part.name} removed from wishlist`,
      'success'
    );
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    minRating > 0 ||
    inStockOnly ||
    maxPrice < 10000;

  return (
    <div className="parts-page">
      <Navbar />

      <main className="parts-container">
        {/* Hero Section */}
        <section className="parts-hero">
          <div className="parts-hero-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
            OEM & MOTORSPORT CATALOG // OEM SPEC
          </div>
          <h1 className="parts-hero-title">PARTS & ACCESSORIES</h1>
          <p className="parts-hero-subtitle">
            Upgrade, configure, and maintain your vehicle with competition-proven carbon composites, titanium exhausts, and track-engineered components.
          </p>
        </section>

        {/* 12 Categories Horizontal Scrolling Pills */}
        <div className="parts-categories-bar">
          {partCategories.map((cat) => (
            <button
              key={cat}
              className={`parts-category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Control Bar (Search, Filter Drawer Toggle, Sort) */}
        <div className="parts-control-bar">
          <div className="parts-search-box">
            <Search className="parts-search-icon" size={18} />
            <input
              type="text"
              className="parts-search-input"
              placeholder="Search by part name, SKU, category, or vehicle model..."
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

          <div className="parts-controls-right">
            {/* Filter Toggle */}
            <button
              className={`parts-filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              FILTERS {hasActiveFilters && '•'}
              <ChevronDown
                size={14}
                style={{
                  transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {/* Sort Select */}
            <select
              className="parts-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort: Featured Parts</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Highest Rated</option>
              <option value="reviews-high">Most Reviewed</option>
              <option value="discount-high">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {showFilters && (
          <div className="parts-filter-drawer">
            {/* Brand Filter */}
            <div>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Manufacturer / Brand
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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

            {/* Minimum Rating */}
            <div>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Customer Rating
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    className={`filter-chip ${minRating === r ? 'active' : ''}`}
                    onClick={() => setMinRating(r)}
                  >
                    {r === 0 ? 'All' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Availability
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: '#bef264', width: '16px', height: '16px' }}
                />
                In Stock & Ready to Ship Only
              </label>
            </div>

            {/* Max Price Slider */}
            <div>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, color: '#bef264', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Max Budget: {formatINR(maxPrice)}
              </div>
              <input
                type="range"
                min="500"
                max="1000000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#bef264', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                <span>₹500</span>
                <span>₹10,00,000+</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter & Clear Filter Row */}
        <div className="parts-status-row">
          <div className="parts-count">
            SHOWING <strong>{filteredParts.length}</strong> OF <strong>{mockParts.length}</strong> COMPONENTS
          </div>
          {hasActiveFilters && (
            <button className="parts-clear-btn" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>

        {/* Parts Grid: 4 Columns on Desktop */}
        {filteredParts.length === 0 ? (
          <div className="vehicles-empty">
            <div className="vehicles-empty-icon">
              <RotateCcw size={28} />
            </div>
            <h3 className="vehicles-empty-title">NO PARTS MATCH YOUR FILTERS</h3>
            <p className="vehicles-empty-subtitle">
              We couldn't find any performance parts matching your search criteria. Try selecting another category or expanding the price range.
            </p>
            <button className="vehicles-empty-btn" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="parts-grid">
            {filteredParts.map((part) => {
              const inWish = isInWishlist(part.id);

              return (
                <div key={part.id} className="part-card">
                  {/* Media */}
                  <div className="part-card-media">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="part-card-img"
                      onError={(e) => handlePartImageError(e, part.category, part.name)}
                      loading="lazy"
                    />
                    {part.discount && (
                      <div className="part-discount-badge">{part.discount}</div>
                    )}
                    <div className="part-category-tag">{part.category}</div>
                    <button
                      className={`part-wishlist-btn ${inWish ? 'active' : ''}`}
                      onClick={(e) => handleWishlistToggle(e, part)}
                      title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={16} fill={inWish ? '#bef264' : 'none'} color={inWish ? '#bef264' : 'currentColor'} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="part-card-body">
                    <div className="part-brand-row">
                      <span className="part-brand-name">{part.brand}</span>
                      <span className="part-stock-badge">
                        <span className={`part-stock-dot ${part.stockCount <= 3 ? 'low' : ''}`} />
                        {part.stockCount > 0 ? `${part.stockCount} in stock` : 'Backorder'}
                      </span>
                    </div>

                    <h3 className="part-name" title={part.name}>
                      {part.name}
                    </h3>

                    <div className="part-rating-row">
                      <div style={{ display: 'flex', color: '#eab308' }}>
                        <Star size={13} fill="#eab308" />
                      </div>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{part.rating}</span>
                      <span>({part.reviews} reviews)</span>
                    </div>

                    <div className="part-price-row">
                      <span className="part-current-price">{part.formattedPrice}</span>
                      {part.formattedOldPrice && (
                        <span className="part-old-price">{part.formattedOldPrice}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="part-card-actions">
                      <button
                        className="part-add-cart-btn"
                        onClick={(e) => handleAddToCart(e, part)}
                      >
                        <ShoppingCart size={15} />
                        ADD TO CART
                      </button>
                      <Link
                        to={`/parts/${part.id}`}
                        className="part-details-link-btn"
                        title="View Part Details"
                      >
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
