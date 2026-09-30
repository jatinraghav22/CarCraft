// ==========================================================================
// CARCRAFT DEALER SUITE - CLIENT ORDERS MANAGEMENT
// Route: /dealer/orders
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  Search,
  CheckCircle2,
  Truck,
  Filter,
  CreditCard,
  X
} from 'lucide-react';

import { orderApi } from '../services/orderApi';
import { formatDealerINR } from '../data/dealerVehiclesMock';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrders({ search, orderStatus, paymentStatus });
      if (res.success) setOrders(res.orders);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load client orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, orderStatus, paymentStatus]);

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <ShoppingBag size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Client Allocations & Orders</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Bespoke vehicle reservations, performance parts fulfillment, payment telemetry, and logistics dispatch.
          </p>
        </div>
      </div>

      <div className="dealer-controls-bar">
        <div className="dealer-search-box">
          <Search size={16} className="dealer-search-icon" />
          <input
            type="text"
            className="dealer-search-input"
            placeholder="Search by Order ID, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Order Status</label>
          <select className="dealer-select" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="dealer-select-wrap">
          <label className="dealer-select-label">Payment</label>
          <select className="dealer-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="All">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="dealer-table-container">
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Allocated Items</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Tax & Logistics</th>
              <th>Order Total</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><code className="dealer-vin-tag">{o.id}</code></td>
                <td>
                  <div>
                    <strong style={{ color: '#fff' }}>{o.customer}</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--dealer-text-muted)' }}>{o.customerEmail}</span>
                  </div>
                </td>
                <td style={{ maxWidth: '240px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dealer-text-secondary)', display: 'block' }}>{o.items}</span>
                </td>
                <td><span className="dealer-font-mono">{o.quantity}</span></td>
                <td><span className="dealer-font-mono">{formatDealerINR(o.subtotal)}</span></td>
                <td><span className="dealer-font-mono" style={{ fontSize: '0.75rem', color: 'var(--dealer-text-muted)' }}>{formatDealerINR(o.tax + o.shipping)}</span></td>
                <td><span className="dealer-table-price">{formatDealerINR(o.total)}</span></td>
                <td>
                  <span className={`dealer-status-badge ${o.paymentStatus === 'PAID' ? 'available' : o.paymentStatus === 'PENDING' ? 'pending' : 'cancelled'}`}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td><StatusBadge status={o.orderStatus} /></td>
                <td><span className="dealer-date-cell">{o.date}</span></td>
                <td>
                  <div className="dealer-table-actions">
                    <button type="button" className="dealer-action-btn view" onClick={() => setSelectedOrder(o)} title="View Order Manifest">
                      <Eye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Manifest Modal */}
      {selectedOrder && (
        <div className="dealer-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>Order Manifest #{selectedOrder.id}</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '2px' }}>{selectedOrder.customer}</h3>
              </div>
              <StatusBadge status={selectedOrder.orderStatus} />
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Fulfillment Items:</strong> <span style={{ color: '#fff' }}>{selectedOrder.items}</span></div>
              <div><strong style={{ color: 'var(--dealer-text-muted)' }}>Delivery Method:</strong> <span style={{ color: 'var(--dealer-cyan)' }}>{selectedOrder.deliveryMethod}</span></div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Subtotal:</span>
                <span style={{ color: '#fff' }}>{formatDealerINR(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>Dealer Discount:</span>
                <span style={{ color: 'var(--dealer-lime)' }}>- {formatDealerINR(selectedOrder.discount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dealer-text-muted)' }}>GST Tax & Logistics:</span>
                <span style={{ color: '#fff' }}>{formatDealerINR(selectedOrder.tax + selectedOrder.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                <span style={{ color: '#fff' }}>Total Realized:</span>
                <span style={{ color: 'var(--dealer-lime)' }}>{formatDealerINR(selectedOrder.total)}</span>
              </div>
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setSelectedOrder(null)} style={{ alignSelf: 'flex-end' }}>
              Close Manifest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
