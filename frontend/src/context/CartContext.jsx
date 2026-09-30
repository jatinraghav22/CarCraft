import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatINR } from '../utils/currency';
import { formatImageUrl, getPartCategoryFallback } from '../utils/imageFallback';

const CartContext = createContext();

const normalizeCartEntry = (product, quantity = 1) => {
  if (!product) return null;
  const rawId = product.rawId || product.id;
  const id = String(rawId || Math.random().toString(36).slice(2, 9));
  const priceNum =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price || product.selling_price || 0) || 0;

  const rawImg = product.image || '';
  const resolvedImg = rawImg ? formatImageUrl(rawImg) : getPartCategoryFallback(product.category, product.name);

  return {
    id,
    rawId,
    name: product.name || 'Automotive Component',
    brand: product.brand || 'CARCRAFT',
    category: product.category || 'Component',
    price: priceNum,
    formattedPrice: formatINR(priceNum),
    image: resolvedImg,
    sku: product.sku || `SKU-${id}`,
    stock: Number(product.stock || product.stockCount || product.stock_quantity) || 10,
    quantity: Math.max(1, Number(quantity) || 1),
  };
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('carcraft_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => normalizeCartEntry(item, item.quantity)).filter(Boolean);
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    try {
      return localStorage.getItem('carcraft_promo') || '';
    } catch {
      return '';
    }
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'

  useEffect(() => {
    try {
      localStorage.setItem('carcraft_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('carcraft_promo', promoCode);
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [promoCode]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const normalized = normalizeCartEntry(product, quantity);
    if (!normalized) return;

    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(
        (item) => String(item.id) === String(normalized.id) || (item.rawId && String(item.rawId) === String(normalized.rawId))
      );
      if (existing) {
        return safePrev.map((item) =>
          String(item.id) === String(normalized.id) || (item.rawId && String(item.rawId) === String(normalized.rawId))
            ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 1) + Math.max(1, Number(quantity) || 1)) }
            : item
        );
      } else {
        return [...safePrev, normalized];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev
        .map((item) => {
          if (String(item.id) === String(id) || (item.rawId && String(item.rawId) === String(id))) {
            const newQty = (Number(item.quantity) || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter(
        (item) => String(item.id) !== String(id) && (!item.rawId || String(item.rawId) !== String(id))
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = String(code || '').trim().toUpperCase();
    if (clean === 'CARCRAFT10') {
      setPromoCode('CARCRAFT10');
      return { success: true, message: 'CARCRAFT10 Applied (10% Discount)!' };
    }
    if (clean === 'APEX500') {
      setPromoCode('APEX500');
      return { success: true, message: 'APEX500 Applied (₹5,000 Credit)!' };
    }
    if (clean === 'FREESHIP') {
      setPromoCode('FREESHIP');
      return { success: true, message: 'FREESHIP Applied (Complimentary Express Freight)!' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removePromo = () => {
    setPromoCode('');
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const cartCount = safeCart.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
  const cartSubtotal = safeCart.reduce(
    (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
    0
  );

  // Discount calculation
  let discountAmount = 0;
  if (promoCode === 'CARCRAFT10') {
    discountAmount = Math.round(cartSubtotal * 0.1);
  } else if (promoCode === 'APEX500') {
    discountAmount = Math.min(cartSubtotal, 5000);
  }

  // Shipping calculation
  let shippingFee = 0;
  if (cartSubtotal > 0) {
    if (promoCode === 'FREESHIP') {
      shippingFee = 0;
    } else if (shippingMethod === 'express') {
      shippingFee = 1200;
    } else {
      // Free white glove freight over ₹5,000, otherwise ₹450
      shippingFee = cartSubtotal >= 5000 ? 0 : 450;
    }
  }

  // Estimated tax (5%)
  const estimatedTax = cartSubtotal > 0 ? Math.round((cartSubtotal - discountAmount) * 0.05) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + estimatedTax);

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        estimatedTax,
        cartTotal,
        promoCode,
        shippingMethod,
        setShippingMethod,
        applyPromo,
        removePromo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
