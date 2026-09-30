import apiClient from './client';

export const dealerApi = {
  // Live Dashboard Metrics
  async getDashboard() {
    const res = await apiClient.get('/dealer/dashboard/');
    return res.data;
  },

  // Financial & Operational Reports
  async getProfitLoss(params = {}) {
    const res = await apiClient.get('/reports/profit-loss/', { params });
    return res.data;
  },

  async getSalesReport(params = {}) {
    const res = await apiClient.get('/reports/sales/', { params });
    return res.data;
  },

  async getExpensesReport(params = {}) {
    const res = await apiClient.get('/reports/expenses/', { params });
    return res.data;
  },

  // Customer Records Management
  async getCustomers() {
    const res = await apiClient.get('/customers/');
    return res.data;
  },

  async getCustomerById(id) {
    const res = await apiClient.get(`/customers/${id}/`);
    return res.data;
  },

  // Inventory Transactions & Valuation
  async getInventory(params = {}) {
    const res = await apiClient.get('/inventory/', { params });
    return res.data;
  },

  async createInventoryTransaction(data) {
    const res = await apiClient.post('/inventory/', data);
    return res.data;
  },

  async getInventorySummary() {
    const res = await apiClient.get('/inventory/summary/');
    return res.data;
  },

  // Sales Ledger
  async getSales(params = {}) {
    const res = await apiClient.get('/sales/', { params });
    return res.data;
  },

  async createSale(data) {
    const res = await apiClient.post('/sales/', data);
    return res.data;
  },

  async getSalesSummary() {
    const res = await apiClient.get('/sales/summary/');
    return res.data;
  },

  // Operating Expenses
  async getExpenses(params = {}) {
    const res = await apiClient.get('/expenses/', { params });
    return res.data;
  },

  async createExpense(data) {
    const res = await apiClient.post('/expenses/', data);
    return res.data;
  },

  async updateExpense(id, data) {
    const res = await apiClient.patch(`/expenses/${id}/`, data);
    return res.data;
  },

  async deleteExpense(id) {
    const res = await apiClient.delete(`/expenses/${id}/`);
    return res.data;
  },
};

export default dealerApi;
