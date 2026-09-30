import dealerApiClient from './api';

export const reportCategories = [
  { id: 'sales', title: 'Executive Sales Ledger', desc: 'Comprehensive unit sales, invoice aggregates, and commission splits.' },
  { id: 'vehicle-sales', title: 'Vehicle Fleet Sales Dossier', desc: 'Allocation velocity, margin realized per chassis, and inventory turnover.' },
  { id: 'parts-sales', title: 'Performance Parts Sales Report', desc: 'High-turnover SKUs, catalog category performance, and wholesale markups.' },
  { id: 'service', title: 'Master Workshop Bay Report', desc: 'Technician billable hours, completed work orders, and service revenue.' },
  { id: 'expenses', title: 'Operational Expenditure Ledger', desc: 'Direct procurement costs, facility lease, workshop consumables, and overheads.' },
  { id: 'profit-loss', title: 'Audited Profit & Loss Statement', desc: 'Audited EBITDA, gross vs net margin ratios, and fiscal quarterly comparisons.' },
  { id: 'inventory', title: 'Inventory Valuation Matrix', desc: 'Capital tied in fleet, parts stock level alerts, and write-down logs.' },
  { id: 'customers', title: 'Clientele Demographics & VIP Tiering', desc: 'High-net-worth portfolio analysis, garage collection registry, and LTV.' }
];

export const reportApi = {
  async getAvailableReports() {
    return dealerApiClient.get('/reports/', () => ({
      success: true,
      reports: reportCategories
    }));
  },

  async generateReport(reportId, options = {}) {
    return dealerApiClient.post(`/reports/${reportId}/generate/`, options, () => ({
      success: true,
      reportId,
      options,
      generatedAt: new Date().toISOString(),
      downloadUrl: '#csv-export-stream'
    }));
  }
};

export default reportApi;
