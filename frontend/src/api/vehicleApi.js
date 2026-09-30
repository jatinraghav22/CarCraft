import apiClient from './client';

export const vehicleApi = {
  async getVehicles(params = {}) {
    const res = await apiClient.get('/vehicles/', { params });
    // DRF may return array or paginated object { count, next, previous, results }
    return res.data;
  },

  async getVehicleById(id) {
    const res = await apiClient.get(`/vehicles/${id}/`);
    return res.data;
  },

  async createVehicle(formData) {
    const res = await apiClient.post('/vehicles/', formData);
    return res.data;
  },

  async updateVehicle(id, formData) {
    const res = await apiClient.patch(`/vehicles/${id}/`, formData);
    return res.data;
  },

  async deleteVehicle(id) {
    const res = await apiClient.delete(`/vehicles/${id}/`);
    return res.data;
  },

  async uploadGalleryImage(id, formData) {
    const res = await apiClient.post(`/vehicles/${id}/upload_gallery_image/`, formData);
    return res.data;
  },
};

export default vehicleApi;
