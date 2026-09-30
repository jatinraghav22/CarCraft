import { formatINR } from '../../utils/currency';
import { handlePartImageError } from '../../utils/imageFallback';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Sparkles,
  Share2,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { mockParts } from '../../data/parts';
import partsApi from '../../api/partsApi';
import { normalizePart } from '../../api/normalizers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Parts.css';

export default function PartDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dbPart, setDbPart] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      partsApi.getPartById(id)
        .then((data) => {
          if (isMounted && data) {
            setDbPart(normalizePart(data));
          }
        })
        .catch(() => {
          const fallback = mockParts.find((p) => String(p.id) === String(id));
          if (isMounted && fallback) {
            setDbPart(normalizePart(fallback));
          }
        });
    }
    return () => { isMounted = false; };
  }, [id]);

  // Find part by ID
  const part = useMemo(() => {
    if (dbPart) return dbPart;
    const found = mockParts.find((p) => String(p.id) === String(id));
    return normalizePart(found || mockParts[0]);
  }, [id, dbPart]);


  const [activeImage, setActiveImage] = useState(part?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'overview'

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const isSaved = isInWishlist(part?.id);

  // Gallery items
  const gallery = useMemo(() => {
    if (!part) return [];
    const list = [part.image, ...(part.gallery || [])];
    return Array.from(new Set(list));
  }, [part]);

  // Frequently bought together items
  const bundleItems = useMemo(() => {
    if (!part || !part.frequentlyBoughtTogether) return [];
    return mockParts.filter((p) =>
      part.frequentlyBoughtTogether.includes(p.id)
    );
  }, [part]);

  const bundleTotal = useMemo(() => {
    if (!part) return 0;
    const companionSum = bundleItems.reduce((acc, curr) => acc + curr.price, 0);
    return part.price + companionSum;
  }, [part, bundleItems]);

  // Related products (same category, excluding current)
  const relatedParts = useMemo(() => {
    return mockParts
      .filter((p) => p.category === part?.category && p.id !== part?.id)
      .slice(0, 4);
  }, [part]);

  // Sync state on id change
  React.useEffect(() => {
    if (part) {
      setActiveImage(part.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [part]);

  if (!part) {
    return (
      <div className="part-details-page">
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Component Not Found</h2>
          <Link to="/parts" className="pd-cart-btn-primary" style={{ display: 'inline-flex', marginTop: '20px' }}>
            Back to Parts Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(part, quantity);
    addToast(`Added ${quantity} × ${part.name} to cart`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(part, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(part);
    addToast(
      added ? `${part.name} saved to wishlist` : `${part.name} removed from wishlist`,
      'success'
    );
  };

  const handleAddBundleToCart = () => {
    addToCart(part, 1);
    bundleItems.forEach((b) => addToCart(b, 1));
    addToast(`Added 3-piece performance bundle to cart!`, 'success');
  };

  return (
    <div className="part-details-page">
      <Navbar />

      <main className="part-details-container">
        {/* Top Back Nav & Wishlist */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/parts" className="vd-back-link">
            <ArrowLeft size={16} />
            BACK TO PARTS CATALOG
          </Link>

          <button
            className={`vd-action-icon-btn ${isSaved ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            <Heart size={16} fill={isSaved ? '#bef264' : 'none'} color={isSaved ? '#bef264' : 'currentColor'} />
            {isSaved ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
          </button>
        </div>

        {/* Main Grid: Gallery Left, Details Right */}
        <div className="pd-main-grid">
          {/* Gallery Column */}
          <div className="pd-gallery-wrap">
            <div className="pd-gallery-hero">
              <img src={activeImage} alt={part.name} onError={(e) => handlePartImageError(e, part?.category, part?.name)} className="pd-gallery-hero-img" />
              {part.discount && (
                <div className="part-discount-badge" style={{ top: '18px', left: '18px', padding: '6px 12px', fontSize: '11px' }}>
                  {part.discount}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="pd-thumbs-strip">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  className={`pd-thumb-btn ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} onError={(e) => handlePartImageError(e, part?.category, part?.name)} className="pd-thumb-img" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info & Purchase Column */}
          <div className="pd-info-col">
            <div className="pd-meta-row">
              <span className="pd-brand-tag">{part.brand} // {part.category}</span>
              <span className="pd-sku-tag">SKU: {part.sku}</span>
            </div>

            <h1 className="pd-title">{part.name}</h1>

            {/* Rating Row */}
            <div className="pd-rating-block">
              <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.floor(part.rating) ? '#eab308' : 'none'} />
                ))}
              </div>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>
                {part.rating}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                ({part.reviews} verified buyer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="pd-price-card">
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'Space Grotesk, monospace', color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  OEM DIRECT PRICING
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="pd-current-price">{part.formattedPrice}</span>
                  {part.formattedOldPrice && (
                    <span className="part-old-price" style={{ fontSize: '1.05rem' }}>
                      {part.formattedOldPrice}
                    </span>
                  )}
                </div>
              </div>
              <div className="pd-stock-alert">
                <span className="part-stock-dot" />
                {part.stockCount > 0 ? `${part.stockCount} Units In Stock` : 'Backordered'}
              </div>
            </div>

            {/* Vehicle Compatibility Box */}
            {part.compatibility && (Array.isArray(part.compatibility) ? part.compatibility.length > 0 : Boolean(part.compatibility)) && (
              <div className="pd-compat-box">
                <div className="pd-compat-title">Verified Vehicle Compatibility</div>
                <div className="pd-compat-tags">
                  {(Array.isArray(part.compatibility) ? part.compatibility : [part.compatibility]).map((comp, idx) => (
                    <span key={idx} className="pd-compat-tag">
                      <Check size={12} />
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Purchase Buttons */}
            <div className="pd-actions-box">
              <div className="pd-qty-row">
                <div className="pd-qty-selector">
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="pd-qty-value">{quantity}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => Math.min(part.stockCount || 10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button className="pd-cart-btn-primary" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  ADD TO CART
                </button>
              </div>

              <button className="pd-buy-now-btn" onClick={handleBuyNow}>
                BUY NOW WITH 1-CLICK DISPATCH
              </button>
            </div>

            {/* Assurance Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <Truck size={16} color="#bef264" />
                <span>Express Air Freight</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <ShieldCheck size={16} color="#bef264" />
                <span>3-Year Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <RotateCcw size={16} color="#bef264" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Tabs: Specifications, Features, Overview */}
        <section className="vd-deep-dive">
          <div className="vd-tabs-header">
            <button
              className={`vd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              TECHNICAL SPECIFICATIONS
            </button>
            <button
              className={`vd-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              ENGINEERING FEATURES
            </button>
            <button
              className={`vd-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              PRODUCT OVERVIEW
            </button>
          </div>

          <div className="vd-tab-content">
            {activeTab === 'specs' && (
              <table className="vd-specs-table">
                <tbody>
                  <tr>
                    <td>Manufacturer / Brand</td>
                    <td>{part.brand}</td>
                  </tr>
                  <tr>
                    <td>Component Category</td>
                    <td>{part.category}</td>
                  </tr>
                  <tr>
                    <td>Serial / SKU Reference</td>
                    <td>{part.sku}</td>
                  </tr>
                  {part.specifications &&
                    Object.entries(part.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === 'features' && (
              <div className="vd-features-grid">
                {(part.features || [
                  'Manufactured using aerospace certified materials',
                  'Dynamic stress-tested to automotive motorsport standards',
                  'Full bolt-on installation with direct OEM hardware fitment',
                  'Backed by CARCRAFT official performance telemetry warranty'
                ]).map((feat, idx) => (
                  <div key={idx} className="vd-feature-card">
                    <div className="vd-feature-icon">
                      <Sparkles size={16} />
                    </div>
                    <div className="vd-feature-text">{feat}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div style={{ maxWidth: '850px', lineHeight: 1.8, color: '#cbd5e1', fontSize: '1rem', fontFamily: 'Inter, sans-serif' }}>
                <p style={{ marginBottom: '16px' }}>{part.description}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Each CARCRAFT performance component is laser-scanned for dimensional accuracy and subjected to rigorous thermal shock simulations before dispatch. Professional installation at any certified CARCRAFT Service Hub is supported.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Frequently Bought Together Bundle */}
        {bundleItems.length > 0 && (
          <section className="pd-bundle-section">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#bef264', textTransform: 'uppercase', marginBottom: '6px' }}>
                RECOMMENDED COMPANION SETUP
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                FREQUENTLY BOUGHT TOGETHER
              </h3>
            </div>

            <div className="pd-bundle-card">
              <div className="pd-bundle-items-row">
                {/* Main Product */}
                <div className="pd-bundle-item-thumb">
                  <img src={part.image} alt={part.name} onError={(e) => handlePartImageError(e, part?.category, part?.name)} className="pd-bundle-img" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', maxWidth: '160px' }}>
                      {part.name}
                    </div>
                    <div style={{ color: '#bef264', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                      {part.formattedPrice}
                    </div>
                  </div>
                </div>

                {bundleItems.map((b) => (
                  <React.Fragment key={b.id}>
                    <span className="pd-bundle-plus">+</span>
                    <div className="pd-bundle-item-thumb">
                      <img src={b.image} alt={b.name} onError={(e) => handlePartImageError(e, b?.category, b?.name)} className="pd-bundle-img" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', maxWidth: '160px' }}>
                          {b.name}
                        </div>
                        <div style={{ color: '#bef264', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                          {b.formattedPrice}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="pd-bundle-pricing">
                <div style={{ fontSize: '11px', fontFamily: 'Space Grotesk, monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  BUNDLE PRICE ({bundleItems.length + 1} ITEMS)
                </div>
                <div className="pd-bundle-total-price">
                  {formatINR(bundleTotal)}
                </div>
                <button className="pd-bundle-add-btn" onClick={handleAddBundleToCart}>
                  ADD ALL {bundleItems.length + 1} TO CART
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Related Products Section */}
        {relatedParts.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#bef264', textTransform: 'uppercase', marginBottom: '6px' }}>
                MATCHING {part.category.toUpperCase()}
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                RELATED PERFORMANCE COMPONENTS
              </h3>
            </div>

            <div className="parts-grid">
              {relatedParts.map((rel) => (
                <div key={rel.id} className="part-card">
                  <div className="part-card-media" style={{ height: '170px' }}>
                    <img src={rel.image} alt={rel.name} onError={(e) => handlePartImageError(e, rel?.category, rel?.name)} className="part-card-img" />
                    {rel.discount && <div className="part-discount-badge">{rel.discount}</div>}
                  </div>
                  <div className="part-card-body" style={{ padding: '16px' }}>
                    <span className="part-brand-name">{rel.brand}</span>
                    <h4 className="part-name" style={{ fontSize: '0.95rem', height: '2.4rem' }}>
                      {rel.name}
                    </h4>
                    <div className="part-price-row" style={{ marginBottom: '12px' }}>
                      <span className="part-current-price" style={{ fontSize: '1.2rem' }}>{rel.formattedPrice}</span>
                    </div>
                    <Link to={`/parts/${rel.id}`} className="part-add-cart-btn" style={{ textDecoration: 'none' }}>
                      VIEW DETAILS
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
