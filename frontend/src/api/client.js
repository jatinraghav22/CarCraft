import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    // Check customer token first, then dealer token
    const token =
      localStorage.getItem('carcraft_access_token') ||
      sessionStorage.getItem('carcraft_dealer_token') ||
      localStorage.getItem('carcraft_dealer_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set Content-Type with boundary for FormData uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken =
        localStorage.getItem('carcraft_refresh_token') ||
        sessionStorage.getItem('carcraft_dealer_refresh_token');

      // Do not attempt refresh on auth login endpoints
      if (!refreshToken || originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/dealer/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('carcraft_access_token', newAccessToken);
        if (sessionStorage.getItem('carcraft_dealer_token')) {
          sessionStorage.setItem('carcraft_dealer_token', newAccessToken);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Clear invalid tokens
        localStorage.removeItem('carcraft_access_token');
        localStorage.removeItem('carcraft_refresh_token');
        sessionStorage.removeItem('carcraft_dealer_token');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
