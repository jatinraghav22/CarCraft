import apiClient from './client';

export const wishlistApi = {
  async getWishlist() {
    const res = await apiClient.get('/wishlist/');
    return res.data;
  },

  async addToWishlist(payload) {
    // payload: { vehicle: vehicleId } or { part: partId }
    const res = await apiClient.post('/wishlist/', payload);
    return res.data;
  },

  async removeFromWishlist(itemId) {
    const res = await apiClient.delete(`/wishlist/item/${itemId}/`);
    return res.data;
  },
};

export default wishlistApi;
