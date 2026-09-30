import apiClient from './client';

export const authApi = {
  async register(userData) {
    const res = await apiClient.post('/auth/register/', userData);
    return res.data;
  },

  async login(login, password) {
    const res = await apiClient.post('/auth/login/', { login, password });
    return res.data;
  },

  async dealerLogin(login, password) {
    const res = await apiClient.post('/auth/dealer/login/', { login, password });
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get('/auth/me/');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await apiClient.patch('/auth/me/', profileData);
    return res.data;
  },

  async refreshToken(refresh) {
    const res = await apiClient.post('/auth/token/refresh/', { refresh });
    return res.data;
  },
};

export default authApi;
