import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('carcraft_cart');
      return saved ? JSON.parse(saved) : [];
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
    if (!product || !product.id) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            formattedPrice: product.formattedPrice,
            image: product.image,
            sku: product.sku || `SKU-${product.id}`,
            stock: product.stockCount || 10,
            quantity: quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
        cart,
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
