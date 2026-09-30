import dealerApiClient from './api';
import { initialCustomers } from '../data/customerMock';

export const customerApi = {
  async getCustomers(params = {}) {
    return dealerApiClient.get(`/customers/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...initialCustomers];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
      }
      return { success: true, customers: list };
    });
  },

  async getCustomerById(id) {
    return dealerApiClient.get(`/customers/${id}/`, () => {
      const customer = initialCustomers.find((c) => c.id === id);
      return { success: true, customer };
    });
  }
};

export default customerApi;
