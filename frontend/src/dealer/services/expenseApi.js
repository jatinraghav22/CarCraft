import dealerApiClient from './api';
import { initialExpenses } from '../data/expenseMock';

let runtimeExpenses = [...initialExpenses];

const CATEGORY_MAP = {
  'Rent': 'RENT',
  'Salary/Staff Cost': 'SALARY',
  'Electricity': 'UTILITIES',
  'Marketing': 'MARKETING',
  'Maintenance': 'MAINTENANCE',
  'Transport': 'TRANSPORT',
  'Insurance': 'INSURANCE',
  'Tax': 'TAX',
  'Other': 'OTHER',
  'Vehicle Purchase': 'OTHER',
  'Parts Purchase': 'SUPPLIES',
  'Service Cost': 'MAINTENANCE',
};

function normalizeExpense(exp) {
  if (!exp) return exp;
  return {
    id: `EXP-${exp.id}`,
    rawId: exp.id,
    category: exp.category || 'OTHER',
    description: exp.description || 'Operating Expense',
    amount: parseFloat(exp.amount || 0),
    paymentMethod: exp.payment_method || 'Bank Wire / RTGS',
    date: exp.date || (exp.created_at ? exp.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    createdBy: 'Dealership Staff',
    receipt: 'RECEIPT-VERIFIED.pdf',
    notes: exp.notes || '',
  };
}

export const expenseApi = {
  async getExpenses(params = {}) {
    return dealerApiClient.get(`/expenses/?${new URLSearchParams(params).toString()}`, () => {
      let list = [...runtimeExpenses];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((e) => e.description.toLowerCase().includes(q) || String(e.id).toLowerCase().includes(q));
      }
      if (params.category && params.category !== 'All') {
        list = list.filter((e) => e.category === params.category);
      }
      const totalAmount = list.reduce((sum, e) => sum + e.amount, 0);
      return {
        success: true,
        expenses: list,
        summary: {
          totalCount: list.length,
          totalAmount
        }
      };
    }).then((res) => {
      const rawList = Array.isArray(res) ? res : (res?.results || res?.expenses || []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        const normalized = rawList.map(normalizeExpense);
        const totalAmount = normalized.reduce((sum, e) => sum + e.amount, 0);
        return {
          success: true,
          expenses: normalized,
          summary: {
            totalCount: normalized.length,
            totalAmount
          }
        };
      }
      if (res?.expenses) {
        return {
          success: true,
          expenses: res.expenses.map(normalizeExpense),
          summary: res.summary || { totalCount: res.expenses.length, totalAmount: 0 }
        };
      }
      return { success: true, expenses: [], summary: { totalCount: 0, totalAmount: 0 } };
    });
  },

  async createExpense(expenseData) {
    const backendCategory = CATEGORY_MAP[expenseData.category] || expenseData.category || 'OTHER';
    const payload = {
      category: backendCategory,
      description: expenseData.description,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      payment_method: expenseData.paymentMethod || 'Bank Wire / RTGS',
      notes: expenseData.notes || '',
    };

    return dealerApiClient.post('/expenses/', payload, () => {
      const newExp = {
        ...expenseData,
        id: `EXP-${Date.now().toString().slice(-4)}`,
        date: expenseData.date || new Date().toISOString().split('T')[0],
        amount: Number(expenseData.amount) || 0
      };
      runtimeExpenses = [newExp, ...runtimeExpenses];
      return { success: true, expense: newExp };
    }).then((res) => {
      if (res && (res.id || res.expense)) {
        const item = res.expense || res;
        return { success: true, expense: normalizeExpense(item) };
      }
      return res;
    });
  },

  async deleteExpense(id) {
    const rawId = String(id).replace(/^EXP-/, '');
    return dealerApiClient.delete(`/expenses/${rawId}/`, () => {
      runtimeExpenses = runtimeExpenses.filter((e) => String(e.id) !== String(id));
      return { success: true };
    });
  }
};

export default expenseApi;

