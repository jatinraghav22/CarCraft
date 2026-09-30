import dealerApiClient from './api';
import { initialTestDrives } from '../data/testDriveMock';

let runtimeTestDrives = [...initialTestDrives];

function normalizeTestDrive(item) {
  if (!item) return item;
  const vehicleName = item.vehicle_details
    ? `${item.vehicle_details.brand || ''} ${item.vehicle_details.model || ''}`.trim()
    : (typeof item.vehicle === 'string' ? item.vehicle : `Vehicle #${item.vehicle}`);

  const customerName = item.customer_username || item.customer?.username || (typeof item.customer === 'string' ? item.customer : `Customer #${item.customer}`);

  return {
    id: String(item.id),
    customer: customerName,
    phone: item.phone || '',
    vehicle: vehicleName || 'Porsche 911 GT3',
    preferredDate: item.preferred_date || item.preferredDate || '',
    preferredTime: item.preferred_time || item.preferredTime || '',
    location: item.location || 'Bespoke Experience Circuit',
    status: item.status || 'PENDING',
    createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (item.createdAt || 'Recent'),
    notes: item.notes || '',
    dealerNotes: item.dealer_notes || item.dealerNotes || '',
    vehicleDetails: item.vehicle_details || null,
  };
}

export const testDriveApi = {
  async getRequests(params = {}) {
    return dealerApiClient.get(`/test-drives/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...runtimeTestDrives];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((r) => r.customer.toLowerCase().includes(q) || r.vehicle.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
      }
      if (params.status && params.status !== 'All') {
        list = list.filter((r) => r.status === params.status);
      }
      return { success: true, requests: list };
    }).then((res) => {
      // If backend responded with DRF structure ({ count, results } or array)
      if (res && res.results && Array.isArray(res.results)) {
        return {
          success: true,
          count: res.count,
          requests: res.results.map(normalizeTestDrive),
        };
      }
      if (Array.isArray(res)) {
        return {
          success: true,
          count: res.length,
          requests: res.map(normalizeTestDrive),
        };
      }
      if (res && res.requests) {
        return {
          success: true,
          requests: res.requests.map(normalizeTestDrive),
        };
      }
      return { success: true, requests: [] };
    });
  },

  async updateStatus(id, newStatus, dealerNotes = null) {
    const payload = { status: newStatus };
    if (dealerNotes !== null) payload.dealer_notes = dealerNotes;

    return dealerApiClient.patch(`/test-drives/${id}/update_status/`, payload, () => {
      const idx = runtimeTestDrives.findIndex((r) => String(r.id) === String(id));
      if (idx !== -1) {
        runtimeTestDrives[idx] = { ...runtimeTestDrives[idx], status: newStatus };
      }
      return { success: true, request: runtimeTestDrives[idx] };
    }).then((res) => {
      if (res && res.test_drive) {
        return {
          success: true,
          message: res.message,
          request: normalizeTestDrive(res.test_drive),
        };
      }
      return res;
    });
  }
};

export default testDriveApi;

