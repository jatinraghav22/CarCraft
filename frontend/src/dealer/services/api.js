// ==========================================================================
// CARCRAFT DEALER SUITE - BASE API CLIENT
// Connected to Django REST APIs (http://127.0.0.1:8000/api)
// ==========================================================================

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true'; // false by default -> uses real backend

class DealerApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  getHeaders(isFormData = false) {
    const headers = {
      'Accept': 'application/json',
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token =
      sessionStorage.getItem('carcraft_dealer_token') ||
      localStorage.getItem('carcraft_dealer_token') ||
      localStorage.getItem('carcraft_access_token');

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  resolveUrl(endpoint) {
    let clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Normalize endpoint path if called with short names
    if (clean.startsWith('/dashboard/')) {
      clean = `/dealer${clean}`;
    }

    return `${this.baseUrl}${clean}`;
  }

  async request(endpoint, options = {}, mockFallbackFn = null) {
    if (USE_MOCK_DATA && mockFallbackFn) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return await mockFallbackFn();
    }

    const isFormData = options.body instanceof FormData;
    const url = this.resolveUrl(endpoint);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: Request failed`;
        const errorText = await response.text().catch(() => '');
        if (errorText) {
          try {
            const errorBody = JSON.parse(errorText);
            errMessage =
              errorBody.detail ||
              errorBody.message ||
              (errorBody.errors ? JSON.stringify(errorBody.errors) : errorText);
          } catch {
            errMessage = errorText;
          }
        }
        throw new Error(errMessage);
      }

      // Handle 204 No Content or empty bodies safely
      if (response.status === 204) {
        return { success: true };
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      if (!text || !text.trim()) {
        return { success: true };
      }

      if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
        try {
          return JSON.parse(text);
        } catch {
          return { success: true, text };
        }
      }

      return { success: true, text };
    } catch (err) {
      if (mockFallbackFn && USE_MOCK_DATA) {
        console.warn(`[DealerApi] Falling back to local data for ${url}:`, err.message);
        return await mockFallbackFn();
      }
      throw err;
    }
  }

  get(endpoint, mockFallbackFn) {
    return this.request(endpoint, { method: 'GET' }, mockFallbackFn);
  }

  post(endpoint, data, mockFallbackFn) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', body }, mockFallbackFn);
  }

  put(endpoint, data, mockFallbackFn) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'PUT', body }, mockFallbackFn);
  }

  patch(endpoint, data, mockFallbackFn) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'PATCH', body }, mockFallbackFn);
  }

  delete(endpoint, mockFallbackFn) {
    return this.request(endpoint, { method: 'DELETE' }, mockFallbackFn);
  }
}

export const dealerApiClient = new DealerApiClient();
export default dealerApiClient;
