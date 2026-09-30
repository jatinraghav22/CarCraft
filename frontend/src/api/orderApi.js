import apiClient from './client';

export const orderApi = {
  async getOrders() {
    const res = await apiClient.get('/orders/');
    return res.data;
  },

  async getOrderById(id) {
    const res = await apiClient.get(`/orders/${id}/`);
    return res.data;
  },

  async checkout(checkoutData) {
    // checkoutData: { shipping_address, shipping_city, shipping_state, shipping_postal_code, payment_method, notes }
    const res = await apiClient.post('/orders/checkout/', checkoutData);
    return res.data;
  },

  async updateOrderStatus(id, { status, payment_status }) {
    const res = await apiClient.patch(`/orders/${id}/update_status/`, {
      status,
      payment_status,
    });
    return res.data;
  },
};

export default orderApi;
