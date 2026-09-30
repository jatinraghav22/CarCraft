import apiClient from './client';

export const cartApi = {
  async getCart() {
    const res = await apiClient.get('/cart/');
    return res.data;
  },

  async addToCart(partId, quantity = 1) {
    const res = await apiClient.post('/cart/add/', { part_id: partId, quantity });
    return res.data;
  },

  async updateCartItem(itemId, quantity) {
    const res = await apiClient.patch(`/cart/item/${itemId}/`, { quantity });
    return res.data;
  },

  async removeCartItem(itemId) {
    const res = await apiClient.delete(`/cart/item/${itemId}/`);
    return res.data;
  },

  async clearCart() {
    const res = await apiClient.post('/cart/clear/');
    return res.data;
  },
};

export default cartApi;
