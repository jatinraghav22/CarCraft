import dealerApiClient from './api';
import { initialServices } from '../data/serviceMock';

let runtimeServices = [...initialServices];

function formatPriceINR(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

function normalizeAppointment(item) {
  if (!item) return item;
  const vehicleName = item.vehicle_details
    ? `${item.vehicle_details.brand || ''} ${item.vehicle_details.model || ''}`.trim()
    : (item.custom_vehicle || (typeof item.vehicle === 'string' ? item.vehicle : `Vehicle #${item.vehicle || ''}`));

  const customerName = item.customer_username || item.customer?.username || (typeof item.customer === 'string' ? item.customer : `Customer #${item.customer}`);

  return {
    id: String(item.id),
    customer: customerName,
    vehicle: vehicleName || 'Porsche 911 GT3',
    service: item.service_type || item.service || 'Comprehensive Inspection',
    date: item.preferred_date || item.date || '',
    time: item.preferred_time || item.time || '',
    estimatedPrice: formatPriceINR(item.estimated_cost || item.estimatedPrice),
    estimatedCost: Number(item.estimated_cost) || 0,
    finalCost: Number(item.final_cost) || 0,
    bay: item.dealer_notes?.split(';')[0]?.trim() || item.bay || 'Bay 01 - Dyno Diagnostics',
    technician: item.dealer_notes?.split(';')[1]?.trim() || item.technician || 'Senior Powertrain Tech',
    notes: item.description || item.notes || '',
    dealerNotes: item.dealer_notes || '',
    status: item.status || 'PENDING',
    createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : (item.createdAt || 'Recent'),
  };
}

export const serviceApi = {
  async getAppointments(params = {}) {
    return dealerApiClient.get(`/service-appointments/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...runtimeServices];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((s) => s.customer.toLowerCase().includes(q) || s.vehicle.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
      }
      if (params.status && params.status !== 'All') {
        list = list.filter((s) => s.status === params.status);
      }
      return { success: true, appointments: list };
    }).then((res) => {
      if (res && res.results && Array.isArray(res.results)) {
        return {
          success: true,
          count: res.count,
          appointments: res.results.map(normalizeAppointment),
        };
      }
      if (Array.isArray(res)) {
        return {
          success: true,
          count: res.length,
          appointments: res.map(normalizeAppointment),
        };
      }
      if (res && res.appointments) {
        return {
          success: true,
          appointments: res.appointments.map(normalizeAppointment),
        };
      }
      return { success: true, appointments: [] };
    });
  },

  async updateStatus(id, newStatus, finalCost = null, notes = null) {
    const payload = { status: newStatus };
    if (finalCost !== null) payload.final_cost = finalCost;
    if (notes !== null) payload.dealer_notes = notes;

    return dealerApiClient.patch(`/service-appointments/${id}/update_status/`, payload, () => {
      const idx = runtimeServices.findIndex((s) => String(s.id) === String(id));
      if (idx !== -1) {
        runtimeServices[idx] = { ...runtimeServices[idx], status: newStatus };
      }
      return { success: true, appointment: runtimeServices[idx] };
    }).then((res) => {
      if (res && res.appointment) {
        return {
          success: true,
          message: res.message,
          appointment: normalizeAppointment(res.appointment),
        };
      }
      return res;
    });
  }
};

export default serviceApi;

