import dealerApiClient from './api';
import { initialOrders } from '../data/orderMock';

let runtimeOrders = [...initialOrders];

function normalizeOrder(item) {
  if (!item) return item;
  const itemsList = Array.isArray(item.items) ? item.items : [];
  const itemsSummary = itemsList.length > 0
    ? itemsList.map((i) => `${i.part_details?.name || 'Part'} (x${i.quantity})`).join(', ')
    : 'Bespoke Automotive Components';

  const totalQuantity = itemsList.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1;
  const customerName = item.customer_username || item.customer?.username || (typeof item.customer === 'string' ? item.customer : `Client #${item.customer}`);

  return {
    id: item.order_number || String(item.id),
    rawId: item.id,
    customer: customerName,
    customerEmail: item.customer_email || `${customerName.toLowerCase()}@client.carcraft.com`,
    items: itemsSummary,
    itemsList: itemsList,
    quantity: totalQuantity,
    subtotal: parseFloat(item.subtotal || 0),
    discount: parseFloat(item.discount || 0),
    tax: parseFloat(item.tax || 0),
    shipping: 0,
    total: parseFloat(item.total_amount || 0),
    paymentStatus: item.payment_status || 'PAID',
    orderStatus: item.status || 'CONFIRMED',
    deliveryMethod: item.shipping_city ? `${item.shipping_city} (White-Glove Enclosed Transit)` : 'Express Atelier Transit',
    date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (item.date || 'Recent'),
    shippingAddress: item.shipping_address || '',
  };
}

export const orderApi = {
  async getOrders(params = {}) {
    return dealerApiClient.get(`/orders/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...runtimeOrders];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
      }
      if (params.orderStatus && params.orderStatus !== 'All') {
        list = list.filter((o) => o.orderStatus === params.orderStatus);
      }
      if (params.paymentStatus && params.paymentStatus !== 'All') {
        list = list.filter((o) => o.paymentStatus === params.paymentStatus);
      }
      return { success: true, orders: list };
    }).then((res) => {
      if (res && res.results && Array.isArray(res.results)) {
        return {
          success: true,
          count: res.count,
          orders: res.results.map(normalizeOrder),
        };
      }
      if (Array.isArray(res)) {
        return {
          success: true,
          count: res.length,
          orders: res.map(normalizeOrder),
        };
      }
      if (res && res.orders) {
        return {
          success: true,
          orders: res.orders.map(normalizeOrder),
        };
      }
      return { success: true, orders: [] };
    });
  },

  async updateOrderStatus(id, newStatus, paymentStatus = null) {
    const payload = { status: newStatus };
    if (paymentStatus) payload.payment_status = paymentStatus;

    return dealerApiClient.patch(`/orders/${id}/update_status/`, payload, () => {
      const idx = runtimeOrders.findIndex((o) => String(o.id) === String(id) || o.rawId === id);
      if (idx !== -1) {
        runtimeOrders[idx] = { ...runtimeOrders[idx], orderStatus: newStatus };
      }
      return { success: true, order: runtimeOrders[idx] };
    }).then((res) => {
      if (res && res.order) {
        return {
          success: true,
          message: res.message,
          order: normalizeOrder(res.order),
        };
      }
      return res;
    });
  }
};

export default orderApi;

