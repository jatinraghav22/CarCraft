// ==========================================================================
// CARCRAFT DEALER SUITE - OPERATIONAL EXPENDITURE
// Route: /dealer/expenses
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Trash2,
  DollarSign,
  Tag,
  Paperclip,
  Check,
  X
} from 'lucide-react';

import { expenseApi } from '../services/expenseApi';
import { expenseCategories } from '../data/expenseMock';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // New Expense Form State
  const [newExp, setNewExp] = useState({
    category: 'Rent',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Wire / RTGS',
    notes: '',
    receipt: 'RECEIPT-PENDING.pdf'
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getExpenses({ search, category: categoryFilter });
      if (res.success) {
        setExpenses(res.expenses);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load expenses' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [search, categoryFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newExp.description || !newExp.amount) return;

    try {
      const res = await expenseApi.createExpense({
        ...newExp,
        createdBy: 'Alexander Sterling (Principal)'
      });
      if (res.success) {
        setToast({ type: 'success', message: 'Expense added successfully.' });
        setAddModalOpen(false);
        setNewExp({
          category: 'Rent',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'Bank Wire / RTGS',
          notes: '',
          receipt: 'RECEIPT-ATTACHED.pdf'
        });
        loadExpenses();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Could not create expense record' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    try {
      setDeleteLoading(true);
      await expenseApi.deleteExpense(expenseToDelete.id);
      setToast({ type: 'success', message: 'Expense removed successfully.' });
      setExpenseToDelete(null);
      loadExpenses();
    } catch (err) {
      setToast({ type: 'error', message: 'Could not remove expense' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <Receipt size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Operational Expenditure & Costs</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Facility leases, workshop logistics, power, personnel payroll, marketing, and acquisition expenses.
          </p>
        </div>

        <button type="button" className="dealer-btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          <span>+ ADD EXPENSE</span>
        </button>
      </div>

      <div className="dealer-fleet-summary-bar">
        <div className="dealer-fleet-kpi">
          <span className="dealer-fleet-kpi-label">Expense Items</span>
          <span className="dealer-fleet-kpi-val">{summary?.totalCount || 0} Records</span>
        </div>
        <div className="dealer-fleet-kpi" style={{ borderLeft: '3px solid var(--dealer-amber)' }}>
          <span className="dealer-fleet-kpi-label">Total Outflow</span>
          <span className="dealer-fleet-kpi-val" style={{ color: 'var(--dealer-amber)' }}>
            {summary ? formatDealerINR(summary.totalAmount) : '₹0'}
          </span>
        </div>
      </div>

      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search description, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Category</label>
          <select className="dealer-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {expenseCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payment Instrument</th>
              <th>Date</th>
              <th>Created By</th>
              <th>Receipt</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td><code className="dealer-vin-tag">{exp.id}</code></td>
                <td>
                  <span className="dealer-category-badge" style={{ color: 'var(--dealer-amber)', borderColor: 'rgba(251, 191, 36, 0.25)', background: 'rgba(251, 191, 36, 0.08)' }}>
                    {exp.category}
                  </span>
                </td>
                <td><span style={{ fontSize: '0.84rem', color: '#fff' }}>{exp.description}</span></td>
                <td>
                  <span className="dealer-font-mono" style={{ color: 'var(--dealer-rose)', fontWeight: 700 }}>
                    - {formatDealerINR(exp.amount)}
                  </span>
                </td>
                <td><span style={{ fontSize: '0.78rem', color: 'var(--dealer-text-secondary)' }}>{exp.paymentMethod}</span></td>
                <td><span className="dealer-date-cell">{exp.date}</span></td>
                <td><span style={{ fontSize: '0.78rem', color: 'var(--dealer-text-muted)' }}>{exp.createdBy}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--dealer-cyan)' }}>
                    <Paperclip size={12} />
                    <span>{exp.receipt || 'Attached'}</span>
                  </div>
                </td>
                <td>
                  <div className="dealer-table-actions">
                    <button type="button" className="dealer-action-btn delete" onClick={() => setExpenseToDelete(exp)} title="Delete Expense">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {addModalOpen && (
        <div className="dealer-modal-backdrop" onClick={() => setAddModalOpen(false)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Log Operational Expense</h3>
              <button type="button" className="dealer-header-btn" onClick={() => setAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="dealer-form-group">
                <label className="dealer-form-label">Expense Category *</label>
                <select
                  className="dealer-select"
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                >
                  {expenseCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Description / Purpose *</label>
                <input
                  type="text"
                  className="dealer-form-input"
                  placeholder="e.g. Workshop MagneRide calibration tooling lease"
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  required
                />
              </div>

              <div className="dealer-form-grid-2">
                <div className="dealer-form-group">
                  <label className="dealer-form-label">Amount (INR ₹) *</label>
                  <input
                    type="number"
                    min="0"
                    className="dealer-form-input"
                    placeholder="e.g. 150000"
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="dealer-form-group">
                  <label className="dealer-form-label">Date *</label>
                  <input
                    type="date"
                    className="dealer-form-input"
                    value={newExp.date}
                    onChange={(e) => setNewExp({ ...newExp, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Payment Method</label>
                <select
                  className="dealer-select"
                  value={newExp.paymentMethod}
                  onChange={(e) => setNewExp({ ...newExp, paymentMethod: e.target.value })}
                >
                  <option value="Bank Wire / RTGS">Bank Wire / RTGS</option>
                  <option value="Corporate Credit Card">Corporate Credit Card</option>
                  <option value="Standing Instruction Auto-Debit">Standing Instruction Auto-Debit</option>
                  <option value="Online Banking">Online Banking</option>
                  <option value="UPI Instant">UPI Instant</option>
                </select>
              </div>

              <div className="dealer-form-group">
                <label className="dealer-form-label">Internal Audit Notes</label>
                <input
                  type="text"
                  className="dealer-form-input"
                  placeholder="Optional internal justification"
                  value={newExp.notes}
                  onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dealer-btn-secondary" style={{ flex: 1 }} onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dealer-btn-primary" style={{ flex: 1 }}>
                  Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(expenseToDelete)}
        title="Delete Expense Entry"
        message={`Are you sure you want to delete expense "${expenseToDelete?.description}" of ${formatDealerINR(expenseToDelete?.amount || 0)}?`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
}
