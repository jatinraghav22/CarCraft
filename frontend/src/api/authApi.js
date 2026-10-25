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

  async dealerVerifyMFA(challengeToken, code) {
    const res = await apiClient.post('/auth/dealer/mfa/verify/', {
      challenge_token: challengeToken,
      code,
    });
    return res.data;
  },

  async dealerSetupMFA(password) {
    const res = await apiClient.post('/auth/dealer/mfa/setup/', { password });
    return res.data;
  },

  async dealerConfirmMFA(code) {
    const res = await apiClient.post('/auth/dealer/mfa/confirm/', { code });
    return res.data;
  },

  async dealerGetMFAStatus() {
    const res = await apiClient.get('/auth/dealer/mfa/status/');
    return res.data;
  },

  async dealerDisableMFA(password, code) {
    const res = await apiClient.post('/auth/dealer/mfa/disable/', { password, code });
    return res.data;
  },

  async dealerRegenerateRecoveryCodes(password, code) {
    const res = await apiClient.post('/auth/dealer/mfa/recovery-codes/regenerate/', { password, code });
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
