import apiClient from './client';

export const partsApi = {
  async getParts(params = {}) {
    const res = await apiClient.get('/parts/', { params });
    return res.data;
  },

  async getPartById(id) {
    const res = await apiClient.get(`/parts/${id}/`);
    return res.data;
  },

  async createPart(formData) {
    const res = await apiClient.post('/parts/', formData);
    return res.data;
  },

  async updatePart(id, formData) {
    const res = await apiClient.patch(`/parts/${id}/`, formData);
    return res.data;
  },

  async deletePart(id) {
    const res = await apiClient.delete(`/parts/${id}/`);
    return res.data;
  },

  async getLowStockParts() {
    const res = await apiClient.get('/parts/low_stock/');
    return res.data;
  },
};

export default partsApi;
