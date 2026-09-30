import React, { createContext, useContext, useState, useEffect } from 'react';
import wishlistApi from '../api/wishlistApi';
import { normalizeVehicle, normalizePart } from '../api/normalizers';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('carcraft_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with Django wishlist on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('carcraft_access_token');
    if (token) {
      wishlistApi.getWishlist()
        .then((res) => {
          const items = res?.wishlist?.items || [];
          if (items.length > 0) {
            const mapped = items.map((item) => {
              if (item.vehicle) {
                const norm = normalizeVehicle(item.vehicle);
                return { ...norm, wishlistItemId: item.id, type: 'vehicle' };
              } else if (item.part) {
                const norm = normalizePart(item.part);
                return { ...norm, wishlistItemId: item.id, type: 'part' };
              }
              return null;
            }).filter(Boolean);
            if (mapped.length > 0) {
              setWishlist(mapped);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('carcraft_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const toggleWishlist = (item) => {
    if (!item || !item.id) return false;
    let added = false;
    const token = localStorage.getItem('carcraft_access_token');

    setWishlist((prev) => {
      const exists = prev.some((i) => String(i.id) === String(item.id));
      if (exists) {
        added = false;
        const target = prev.find((i) => String(i.id) === String(item.id));
        if (token && target?.wishlistItemId) {
          wishlistApi.removeFromWishlist(target.wishlistItemId).catch(() => {});
        }
        return prev.filter((i) => String(i.id) !== String(item.id));
      } else {
        added = true;
        const isPart = Boolean(item.sku || item.category === 'Brakes' || item.category === 'Performance' || item.stockCount !== undefined);
        const normalized = {
          ...item,
          id: String(item.id),
          name: item.name || `${item.brand} ${item.model}`,
          brand: item.brand,
          price: item.price,
          formattedPrice: item.formattedPrice,
          image: item.image,
          type: isPart ? 'part' : 'vehicle',
          category: item.category || (isPart ? 'Component' : 'Fleet'),
          badge: item.badge || item.category,
          specs: item.power ? `${item.power} • ${item.acceleration}` : (item.sku ? `SKU: ${item.sku}` : '')
        };

        if (token) {
          const payload = isPart
            ? { part_id: item.rawId || item.id }
            : { vehicle_id: item.rawId || item.id };
          wishlistApi.addToWishlist(payload)
            .then((res) => {
              if (res?.item?.id) {
                setWishlist((cur) => cur.map((w) => String(w.id) === String(item.id) ? { ...w, wishlistItemId: res.item.id } : w));
              }
            })
            .catch(() => {});
        }

        return [...prev, normalized];
      }
    });
    return added;
  };

  const removeFromWishlist = (id) => {
    const token = localStorage.getItem('carcraft_access_token');
    const target = wishlist.find((i) => String(i.id) === String(id));
    if (token && target?.wishlistItemId) {
      wishlistApi.removeFromWishlist(target.wishlistItemId).catch(() => {});
    }
    setWishlist((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const isInWishlist = (id) => {
    return wishlist.some((i) => String(i.id) === String(id));
  };


  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
