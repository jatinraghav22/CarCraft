import apiClient from './client';

export const serviceApi = {
  async getServiceAppointments() {
    const res = await apiClient.get('/service-appointments/');
    return res.data;
  },

  async createServiceAppointment(data) {
    const res = await apiClient.post('/service-appointments/', data);
    return res.data;
  },

  async updateServiceAppointmentStatus(id, updateData) {
    // updateData: { status, final_cost, dealer_notes }
    const res = await apiClient.patch(`/service-appointments/${id}/update_status/`, updateData);
    return res.data;
  },
};

export default serviceApi;
