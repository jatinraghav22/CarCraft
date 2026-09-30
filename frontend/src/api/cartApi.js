import apiClient from './client';

export const cartApi = {
  async getCart() {
    try {
      const res = await apiClient.get('/cart/');
      if (res.status === 204 || !res.data) {
        return { items: [], total_items: 0, subtotal: 0 };
      }
      return res.data?.cart || res.data || { items: [], total_items: 0, subtotal: 0 };
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        return { items: [], total_items: 0, subtotal: 0 };
      }
      console.warn('cartApi.getCart network/server notice:', err.message);
      return { items: [], total_items: 0, subtotal: 0 };
    }
  },

  async addToCart(partId, quantity = 1) {
    if (!partId) return null;
    try {
      const res = await apiClient.post('/cart/add/', {
        part_id: Number(partId),
        quantity: Math.max(1, Number(quantity) || 1),
      });
      if (res.status === 204 || !res.data) {
        return { success: true };
      }
      return res.data;
    } catch (err) {
      console.warn('cartApi.addToCart notice:', err.message);
      return null;
    }
  },

  async updateCartItem(itemId, quantity) {
    if (!itemId) return null;
    try {
      const res = await apiClient.patch(`/cart/item/${itemId}/`, {
        quantity: Math.max(0, Number(quantity) || 0),
      });
      if (res.status === 204 || !res.data) {
        return { success: true };
      }
      return res.data;
    } catch (err) {
      console.warn('cartApi.updateCartItem notice:', err.message);
      return null;
    }
  },

  async removeCartItem(itemId) {
    if (!itemId) return null;
    try {
      const res = await apiClient.delete(`/cart/item/${itemId}/`);
      if (res.status === 204 || !res.data) {
        return { success: true, message: 'Item removed from cart.' };
      }
      return res.data;
    } catch (err) {
      console.warn('cartApi.removeCartItem notice:', err.message);
      return { success: false, message: err.message };
    }
  },

  async clearCart() {
    try {
      const res = await apiClient.post('/cart/clear/');
      if (res.status === 204 || !res.data) {
        return { success: true, message: 'Cart emptied.' };
      }
      return res.data;
    } catch (err) {
      console.warn('cartApi.clearCart notice:', err.message);
      return { success: false, message: err.message };
    }
  },
};

export default cartApi;
