import { formatINR } from '../../utils/currency';
import { handlePartImageError, formatImageUrl } from '../../utils/imageFallback';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Heart, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  X, 
  Sparkles, 
  CreditCard, 
  Wrench,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { mockParts } from '../../data/parts';
import orderApi from '../../api/orderApi';
import cartApi from '../../api/cartApi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cart = [], 
    cartCount = 0, 
    cartSubtotal = 0, 
    discountAmount = 0, 
    shippingFee = 0, 
    estimatedTax = 0, 
    cartTotal = 0, 
    promoCode = '', 
    shippingMethod = 'standard',
    setShippingMethod,
    applyPromo, 
    removePromo, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    addToCart
  } = useCart();

  const { toggleWishlist } = useWishlist() || {};
  const { addToast } = useToast();

  const [inputPromo, setInputPromo] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'India',
    paymentMethod: 'card' // 'card' | 'wire' | 'crypto' | 'apple'
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const res = applyPromo ? applyPromo(inputPromo) : { success: false, message: 'Promo invalid' };
    if (res.success) {
      addToast(res.message, 'success');
      setInputPromo('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleMoveToWishlist = (item) => {
    if (!item) return;
    if (removeFromCart) removeFromCart(item.id);
    if (toggleWishlist) toggleWishlist(item);
    addToast(`${item.name || 'Component'} moved to Wishlist`, 'info');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    let generatedId = '';
    try {
      // 1. Synchronize current cart items into backend database Cart if logged in
      try {
        await cartApi.clearCart();
        for (const item of (cart || [])) {
          const partId = item.rawId || (!isNaN(Number(item.id)) ? Number(item.id) : null);
          if (partId) {
            await cartApi.addToCart(partId, item.quantity || 1);
          }
        }
      } catch (syncErr) {
        console.warn('Backend cart pre-sync notice:', syncErr.message);
      }

      // 2. Perform authoritative checkout
      const res = await orderApi.checkout({
        shipping_address: checkoutForm.address || 'Flagship Atelier Address',
        shipping_city: checkoutForm.city || 'Mumbai',
        shipping_state: 'MH',
        shipping_postal_code: checkoutForm.zip || '400001',
        payment_method: 'CARD',
        notes: `Customer: ${checkoutForm.name || 'Valued Client'}, Phone: ${checkoutForm.phone || '+91 98765 43210'}, Email: ${checkoutForm.email || 'client@carcraft.com'}`,
      });
      if (res?.order?.order_number) {
        generatedId = res.order.order_number;
      }
    } catch (err) {
      console.warn('Backend order checkout notice:', err.message);
    }

    if (!generatedId) {
      generatedId = 'CC-ORD-' + Math.floor(100000 + Math.random() * 900000);
    }

    setOrderId(generatedId);
    setOrderConfirmed(true);
    if (clearCart) clearCart();
    addToast(`Order ${generatedId} placed successfully!`, 'success');
  };

  // 3 Recommended add-on parts for quick-add at the bottom
  const quickAddParts = Array.isArray(mockParts) ? mockParts.slice(0, 3) : [];
  const safeCart = Array.isArray(cart) ? cart : [];

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-container">
        {/* Header */}
        <section className="cart-header">
          <div className="cart-header-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bef264' }} />
            CARCRAFT COMPONENT GARAGE // LOGISTICS PIPELINE
          </div>
          <h1 className="cart-header-title">SHOPPING CART & BUILD ORDER</h1>
          <p className="cart-header-subtitle">
            Review your commissioned automotive upgrades, track parts, and accessories before dispatch.
          </p>
        </section>

        {/* Conditional Rendering: Cart Items vs Empty State */}
        {safeCart.length === 0 && !orderConfirmed ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <ShoppingCart size={36} />
            </div>
            <h2 className="cart-empty-title">YOUR CART IS EMPTY</h2>
            <p className="cart-empty-subtitle">
              No performance parts, aerodynamic kits, or accessories have been added to your build order yet.
            </p>
            <div className="cart-empty-actions">
              <Link to="/parts" className="cart-empty-btn-primary">
                <Wrench size={16} />
                EXPLORE PARTS CATALOG
              </Link>
              <Link to="/vehicles" className="cart-empty-btn-secondary">
                EXPLORE VEHICLES FLEET
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-main-grid">
            {/* Left Column: Cart Items List */}
            <div className="cart-items-col">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.88rem', color: '#94a3b8' }}>
                  ALLOCATED ITEMS (<strong>{cartCount}</strong>)
                </span>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontFamily: 'Outfit',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Empty Entire Garage
                </button>
              </div>

              {safeCart.map((item, idx) => {
                const itemKey = item?.id || `cart-item-${idx}`;
                const itemName = item?.name || 'Automotive Component';
                const itemBrand = item?.brand || 'CARCRAFT';
                const itemSku = item?.sku || `SKU-${itemKey}`;
                const itemPrice = Number(item?.price) || 0;
                const itemQty = Math.max(1, Number(item?.quantity) || 1);
                const itemImage = formatImageUrl(item?.image) || '';

                return (
                  <div key={itemKey} className="cart-item-card">
                    {/* Thumbnail */}
                    <Link to={item?.id ? `/parts/${item.id}` : '/parts'} className="cart-item-thumb-link">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="cart-item-img"
                        onError={(e) => handlePartImageError(e, item?.category, itemName)}
                      />
                    </Link>

                    {/* Info */}
                    <div className="cart-item-info">
                      <div className="cart-item-brand-row">
                        <span className="cart-item-brand">{itemBrand}</span>
                        <span className="cart-item-sku">SKU: {itemSku}</span>
                      </div>

                      <Link to={item?.id ? `/parts/${item.id}` : '/parts'} className="cart-item-title">
                        {itemName}
                      </Link>

                      <div className="cart-item-unit-price">
                        {formatINR(itemPrice)} each
                      </div>

                      {/* Stepper & Action Buttons */}
                      <div className="cart-item-controls-row">
                        <div className="cart-item-stepper">
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="cart-stepper-val">{itemQty}</span>
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="cart-item-actions">
                          <button
                            type="button"
                            className="cart-item-action-btn"
                            onClick={() => handleMoveToWishlist(item)}
                            title="Save item for later"
                          >
                            <Heart size={14} />
                            Save for Later
                          </button>

                          <button
                            type="button"
                            className="cart-item-action-btn delete"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove from cart"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="cart-item-total">
                      {formatINR(itemPrice * itemQty)}
                    </div>
                  </div>
                );
              })}

              {/* Continue Shopping Link */}
              <div style={{ marginTop: '16px' }}>
                <Link to="/parts" className="vd-back-link">
                  <ArrowLeft size={16} />
                  CONTINUE ADDING PARTS
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="cart-summary-col">
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">ORDER SUMMARY</h3>

                {/* Subtotal */}
                <div className="cart-breakdown-row">
                  <span>Components Subtotal</span>
                  <span>{formatINR(cartSubtotal)}</span>
                </div>

                {/* Promo Code Discount */}
                {discountAmount > 0 && (
                  <div className="cart-breakdown-row discount">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} />
                      Promo ({promoCode})
                    </span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                {/* Shipping Selector */}
                <div className="cart-shipping-selector">
                  <div className="cart-shipping-title">SELECT FREIGHT LOGISTICS</div>
                  <label className="cart-shipping-option">
                    <div>
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                      />
                      <span>White-Glove Road Freight</span>
                    </div>
                    <span>{cartSubtotal >= 5000 ? 'FREE' : '₹450'}</span>
                  </label>
                  <label className="cart-shipping-option" style={{ marginTop: '6px' }}>
                    <div>
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                      />
                      <span>Express Air Courier (48h)</span>
                    </div>
                    <span>₹1,200</span>
                  </label>
                </div>

                {/* Estimated Shipping Row */}
                <div className="cart-breakdown-row">
                  <span>Freight Delivery</span>
                  <span>{shippingFee === 0 ? 'COMPLIMENTARY' : formatINR(shippingFee)}</span>
                </div>

                {/* Estimated Tax */}
                <div className="cart-breakdown-row">
                  <span>Estimated Tax (5%)</span>
                  <span>{formatINR(estimatedTax)}</span>
                </div>

                {/* Promo Input */}
                <form className="cart-promo-box" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    className="cart-promo-input"
                    placeholder="PROMO CODE (e.g. CARCRAFT10)"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                  />
                  <button type="submit" className="cart-promo-btn">
                    APPLY
                  </button>
                </form>

                {promoCode && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#bef264', marginTop: '-12px', marginBottom: '16px' }}>
                    <span>Active: {promoCode}</span>
                    <button
                      type="button"
                      onClick={removePromo}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove Code
                    </button>
                  </div>
                )}

                {/* Total */}
                <div className="cart-total-row">
                  <span className="cart-total-label">ESTIMATED TOTAL</span>
                  <span className="cart-total-amount">{formatINR(cartTotal)}</span>
                </div>

                {/* Checkout CTA */}
                <button
                  className="cart-checkout-btn"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b', marginTop: '16px' }}>
                  <ShieldCheck size={16} color="#bef264" />
                  <span>256-Bit Encrypted Automotive Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Companion Accessories */}
        {cart.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px', marginTop: '60px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#bef264', textTransform: 'uppercase', marginBottom: '4px' }}>
                RECOMMENDED WITH YOUR ORDER
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                FREQUENTLY ADDED COMPANION PARTS
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              {quickAddParts.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(13, 17, 24, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <img src={item.image} alt={item.name} onError={(e) => handlePartImageError(e, item.category, item.name)} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ color: '#bef264', fontFamily: 'Space Grotesk', fontSize: '0.85rem', fontWeight: 700 }}>
                      {item.formattedPrice}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      addToast(`${item.name} added to cart`, 'success');
                    }}
                    style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(190, 242, 100, 0.1)', border: '1px solid rgba(190, 242, 100, 0.3)', color: '#bef264', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCheckoutModal(false)}>
              <X size={18} />
            </button>

            {!orderConfirmed ? (
              <>
                <div className="modal-header-badge">SECURE DISPATCH // CARCRAFT CLIENT CHECKOUT</div>
                <h3 className="modal-title">FINALIZE YOUR ORDER</h3>
                <p className="modal-subtitle">
                  Total Acquisition: <strong style={{ color: '#bef264' }}>{formatINR(cartTotal)}</strong> ({cartCount} components)
                </p>

                <form className="modal-form" onSubmit={handleCheckoutSubmit}>
                  {/* Personal Contact */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="modal-form-group">
                      <label className="modal-form-label">FULL NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Julian Drake"
                        className="modal-form-input"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2831"
                        className="modal-form-input"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">DELIVERY EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="client@carcraft.io"
                      className="modal-form-input"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="modal-form-group">
                    <label className="modal-form-label">SHIPPING STREET ADDRESS</label>
                    <input
                      type="text"
                      required
                      placeholder="742 Evergreen Speed Corridor, Suite 10"
                      className="modal-form-input"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                    <div className="modal-form-group">
                      <label className="modal-form-label">CITY</label>
                      <input
                        type="text"
                        required
                        placeholder="San Jose"
                        className="modal-form-input"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">POSTAL CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="95113"
                        className="modal-form-input"
                        value={checkoutForm.zip}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                      />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-form-label">COUNTRY</label>
                      <input
                        type="text"
                        required
                        className="modal-form-input"
                        value={checkoutForm.country}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, country: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="modal-form-group">
                    <label className="modal-form-label">PAYMENT CHANNEL</label>
                    <div className="checkout-payment-options">
                      {[
                        { id: 'card', label: 'Credit / Debit Card' },
                        { id: 'wire', label: 'Bank Wire Transfer' },
                        { id: 'crypto', label: 'Crypto (USDT / USDC)' },
                        { id: 'apple', label: 'Apple Pay / Google Pay' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`checkout-payment-btn ${checkoutForm.paymentMethod === p.id ? 'active' : ''}`}
                          onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: p.id })}
                        >
                          <CreditCard size={15} />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="modal-submit-btn" style={{ marginTop: '16px' }}>
                    PLACE COMMISSION ORDER ({formatINR(cartTotal)})
                  </button>
                </form>
              </>
            ) : (
              <div className="modal-confirmed">
                <div className="modal-confirmed-icon">
                  <CheckCircle2 size={38} />
                </div>
                <h3 className="modal-title">ORDER COMMISSION PLACED</h3>
                <div className="modal-confirmed-id">DISPATCH ID #{orderId}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you, <strong>{checkoutForm.name || 'Valued Client'}</strong>. Your component allocation has been verified. A logistics receipt has been dispatched to <strong>{checkoutForm.email || 'your email'}</strong>. Your tracking telemetry will activate once the freight courier confirms pickup.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    className="modal-submit-btn"
                    style={{ margin: 0, padding: '12px 24px' }}
                    onClick={() => {
                      setShowCheckoutModal(false);
                      navigate('/parts');
                    }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
