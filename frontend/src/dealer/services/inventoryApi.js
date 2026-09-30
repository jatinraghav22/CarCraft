import dealerApiClient from './api';
import { inventorySummaryMock, inventoryTransactionsMock } from '../data/inventoryMock';
import { formatINR } from '../../utils/currency';

export const inventoryApi = {
  async getInventorySummary() {
    return dealerApiClient.get('/inventory/summary/', () => ({
      success: true,
      summary: inventorySummaryMock
    }));
  },

  async getTransactions(params = {}) {
    return dealerApiClient.get(`/inventory/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...inventoryTransactionsMock];
      if (params.type && params.type !== 'All') {
        list = list.filter((t) => t.type === params.type);
      }
      if (params.transaction && params.transaction !== 'All') {
        list = list.filter((t) => t.transaction === params.transaction);
      }
      return {
        success: true,
        transactions: list
      };
    }).then((res) => {
      if (Array.isArray(res) || res?.results) {
        const raw = Array.isArray(res) ? res : res.results;
        return {
          success: true,
          transactions: raw.map((t) => ({
            id: `TX-${t.id}`,
            date: t.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            item: t.vehicle_model || t.part_name || (t.vehicle ? `Vehicle #${t.vehicle}` : `Part #${t.part}`),
            type: t.vehicle ? 'Vehicle' : 'Component',
            transaction: t.transaction_type === 'PURCHASE' ? 'Inbound Fleet' : (t.transaction_type === 'SALE' ? 'Customer Delivery' : t.transaction_type),
            quantity: t.quantity > 0 ? `+${t.quantity}` : `${t.quantity}`,
            cost: formatINR(t.total_cost || 0),
            operator: t.created_by_username || 'Atelier Master',
            reference: t.reference || `REF-${t.id}`
          }))
        };
      }
      return res;
    });
  }

};

export default inventoryApi;
