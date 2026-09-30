import apiClient from './client';

export const testDriveApi = {
  async getTestDrives() {
    const res = await apiClient.get('/test-drives/');
    return res.data;
  },

  async createTestDrive(data) {
    const res = await apiClient.post('/test-drives/', data);
    return res.data;
  },

  async updateTestDriveStatus(id, updateData) {
    // updateData: { status, dealer_notes }
    const res = await apiClient.patch(`/test-drives/${id}/update_status/`, updateData);
    return res.data;
  },
};

export default testDriveApi;
