// CARCRAFT API Client - Configured for Django REST API Integration
// Base URL can be configured with VITE_API_URL or defaults to localhost:8000
import { mockVehicles, mockParts, mockServices, mockCustomerProfile, mockAdminStats } from '../data/mockData';

const rawEnv = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const BASE_URL = rawEnv.replace(/\/api\/?$/, '').replace(/\/$/, '');

class CarcraftApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.useMock = true; // Fallback to mock data while backend is spinning up
  }

  async getCars(params = {}) {
    if (this.useMock) {
      return new Promise((resolve) => setTimeout(() => resolve(mockVehicles), 150));
    }
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/api/cars/${query ? `?${query}` : ''}`);
    return res.json();
  }

  async getParts(category = null) {
    if (this.useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!category || category === 'All') return resolve(mockParts);
          resolve(mockParts.filter(p => p.category === category));
        }, 150);
      });
    }
    const res = await fetch(`${this.baseUrl}/api/parts/${category ? `?category=${category}` : ''}`);
    return res.json();
  }

  async getServices() {
    if (this.useMock) {
      return new Promise((resolve) => setTimeout(() => resolve(mockServices), 150));
    }
    const res = await fetch(`${this.baseUrl}/api/services/`);
    return res.json();
  }

  async getOrders() {
    if (this.useMock) {
      return new Promise((resolve) => setTimeout(() => resolve(mockCustomerProfile.orders), 150));
    }
    const res = await fetch(`${this.baseUrl}/api/orders/`);
    return res.json();
  }

  async createBooking(bookingData) {
    if (this.useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBooking = {
            id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
            ...bookingData,
            status: 'Confirmed',
            advisor: 'Assigned Master Technician'
          };
          resolve(newBooking);
        }, 300);
      });
    }
    const res = await fetch(`${this.baseUrl}/api/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  }

  async getCustomerProfile() {
    return new Promise((resolve) => setTimeout(() => resolve(mockCustomerProfile), 100));
  }

  async getAdminStats() {
    return new Promise((resolve) => setTimeout(() => resolve(mockAdminStats), 100));
  }
}

export const api = new CarcraftApiClient(BASE_URL);
