import dealerApiClient from './api';
import { initialSales } from '../data/salesMock';

export const salesApi = {
  async getSales(params = {}) {
    return dealerApiClient.get(`/sales/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...initialSales];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((s) => s.invoiceNumber.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q) || s.product.toLowerCase().includes(q));
      }
      if (params.saleType && params.saleType !== 'All') {
        list = list.filter((s) => s.saleType === params.saleType);
      }
      if (params.paymentStatus && params.paymentStatus !== 'All') {
        list = list.filter((s) => s.paymentStatus === params.paymentStatus);
      }

      const totalRevenue = list.reduce((sum, s) => sum + s.sellingPrice, 0);
      const totalProfit = list.reduce((sum, s) => sum + s.profit, 0);

      return {
        success: true,
        sales: list,
        summary: {
          totalSalesCount: list.length,
          totalRevenue,
          totalProfit
        }
      };
    });
  }
};

export default salesApi;
