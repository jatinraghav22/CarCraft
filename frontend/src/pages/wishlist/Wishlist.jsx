import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Car, 
  Wrench, 
  Sparkles, 
  Compass, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { handleImageError, handlePartImageError } from '../../utils/imageFallback';
import { formatINR } from '../../utils/currency';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vehicles' | 'parts'

  // Filter lists
  const vehiclesOnly = useMemo(() => {
    return wishlist.filter((item) => item.type === 'vehicle');
  }, [wishlist]);

  const partsOnly = useMemo(() => {
    return wishlist.filter((item) => item.type === 'part');
  }, [wishlist]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'vehicles') return vehiclesOnly;
    if (activeTab === 'parts') return partsOnly;
    return wishlist;
  }, [activeTab, wishlist, vehiclesOnly, partsOnly]);

  const handleRemove = (item) => {
    removeFromWishlist(item.id);
    addToast(`${item.name} removed from your wishlist`, 'info');
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    addToast(`${item.name} added to cart`, 'success');
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <main className="wishlist-container">
        {/* Header */}
        <section className="wishlist-header">
          <div className="wishlist-header-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
            CURATED COLLECTION // SAVED FLEET & HARDWARE
          </div>
          <h1 className="wishlist-header-title">SAVED FLEET & WISHLIST</h1>
          <p className="wishlist-header-subtitle">
            Track allocations, monitor performance component stock levels, and prepare your bespoke automotive commission.
          </p>
        </section>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <Heart size={36} color="#bef264" />
            </div>
            <h2 className="wishlist-empty-title">YOUR WISHLIST IS EMPTY</h2>
            <p className="wishlist-empty-subtitle">
              Save hypercars from our 2026 fleet or motorsport performance parts to compare specifications, monitor allocations, and plan your build.
            </p>
            <div className="wishlist-empty-actions">
              <Link to="/vehicles" className="cart-empty-btn-primary">
                <Car size={16} />
                EXPLORE VEHICLES FLEET
              </Link>
              <Link to="/parts" className="cart-empty-btn-secondary">
                <Wrench size={16} />
                EXPLORE PARTS CATALOG
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar: Category Filter Tabs & Clear All */}
            <div className="wishlist-toolbar">
              <div className="wishlist-tabs-row">
                <button
                  className={`wishlist-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <span>ALL SAVED</span>
                  <span className="wishlist-tab-count">{wishlist.length}</span>
                </button>
                <button
                  className={`wishlist-tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vehicles')}
                >
                  <Car size={15} />
                  <span>VEHICLES</span>
                  <span className="wishlist-tab-count">{vehiclesOnly.length}</span>
                </button>
                <button
                  className={`wishlist-tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('parts')}
                >
                  <Wrench size={15} />
                  <span>PARTS & UPGRADES</span>
                  <span className="wishlist-tab-count">{partsOnly.length}</span>
                </button>
              </div>

              <button
                className="wishlist-clear-all-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                    clearWishlist();
                    addToast('Wishlist cleared', 'info');
                  }
                }}
              >
                <Trash2 size={15} />
                Clear Wishlist
              </button>
            </div>

            {/* Grid of Saved Items */}
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <p>No saved items in this category.</p>
              </div>
            ) : (
              <div className="wishlist-grid">
                {filteredItems.map((item) => {
                  const isPart = item.type === 'part';
                  const detailUrl = isPart ? `/parts/${item.id}` : `/vehicles/${item.id}`;

                  return (
                    <div key={item.id} className="wishlist-card">
                      {/* Media */}
                      <div className="wishlist-card-media">
                        <img src={item.image} alt={item.name} onError={(e) => isPart ? handlePartImageError(e, item.category, item.name) : handleImageError(e)} className="wishlist-card-img" />

                        {/* Type Badge */}
                        <div className={`wishlist-type-badge ${isPart ? 'part' : 'vehicle'}`}>
                          {isPart ? 'PERFORMANCE PART' : 'VEHICLE FLEET'}
                        </div>

                        {/* Remove Button */}
                        <button
                          className="wishlist-remove-btn"
                          onClick={() => handleRemove(item)}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Body */}
                      <div className="wishlist-card-body">
                        <div className="wishlist-card-brand-row">
                          <span className="wishlist-card-brand">{item.brand}</span>
                          <span className="wishlist-card-category">{item.category}</span>
                        </div>

                        <h3 className="wishlist-card-title">{item.name}</h3>

                        <div className="wishlist-card-price">{item.formattedPrice || formatINR(item.price)}</div>

                        {item.specs && (
                          <div className="wishlist-card-specs">{item.specs}</div>
                        )}

                        {/* Actions */}
                        <div className="wishlist-card-actions">
                          {isPart ? (
                            <>
                              <button
                                className="wishlist-cart-btn"
                                onClick={() => handleAddToCart(item)}
                              >
                                <ShoppingCart size={15} />
                                ADD TO CART
                              </button>
                              <Link to={detailUrl} className="wishlist-primary-btn">
                                DETAILS
                              </Link>
                            </>
                          ) : (
                            <Link to={detailUrl} className="wishlist-primary-btn" style={{ background: '#bef264', color: '#080a08' }}>
                              <span>VIEW VEHICLE</span>
                              <ArrowRight size={15} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
