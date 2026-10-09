import React, { useState } from 'react';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  Truck,
  ShieldCheck,
  ArrowRight,
  Car
} from 'lucide-react';
import orderApi from '../../api/orderApi';
import { formatINR } from '../../utils/currency';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Orders.css';

const toOrderTracker = (order) => ({
  orderId: order.order_number,
  model: order.items?.[0]?.part_details?.name || 'CarCraft Parts Order',
  tier: `${order.payment_status} • Total ${formatINR(order.total_amount)}`,
  vin: order.order_number,
  exteriorColor: order.shipping_city || 'Atelier Delivery',
  interiorColor: order.shipping_address,
  deliveryHub: 'White-Glove Enclosed Transit',
  estDelivery: new Date(order.created_at).toLocaleDateString(),
  currentStage: order.status === 'DELIVERED' ? 5 : (order.status === 'SHIPPED' ? 4 : (order.status === 'PROCESSING' ? 3 : 2)),
  assignedEngineer: 'Chief Allocation Specialist',
  stages: [
    { num: 1, name: 'Commission Approved', date: 'Confirmed' },
    { num: 2, name: 'Component Allocation', date: order.status !== 'PENDING' ? 'Verified' : 'Pending' },
    { num: 3, name: 'Assembly & Inspection', date: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'Complete' : 'In Progress' },
    { num: 4, name: 'Logistics Dispatched', date: ['SHIPPED', 'DELIVERED'].includes(order.status) ? 'En Route' : 'Scheduled' },
    { num: 5, name: 'White-Glove Delivery', date: order.status === 'DELIVERED' ? 'Delivered' : 'Pending' },
  ],
});

export default function Orders() {
  const [searchCode, setSearchCode] = useState('');
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  React.useEffect(() => {
    orderApi.getOrders()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.results || []);
        setOrders(list);
        if (list.length > 0) {
          setSearchCode(list[0].order_number);
          setActiveOrder(toOrderTracker(list[0]));
        }
      })
      .catch(() => setOrders([]));
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    const foundOrder = orders.find((order) => order.order_number.toUpperCase() === clean);
    setActiveOrder(foundOrder ? toOrderTracker(foundOrder) : null);
    setSearched(true);
  };

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="orders-badge">
            <Package size={13} />
            LIVE ALLOCATION TRACKER
          </div>
          <h1 className="orders-title">Track Your Build & Allocation</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto' }}>
            Monitor real-time assembly progress, carbon tub autoclaving, dynamometer validation, and international air transit.
          </p>
        </div>

        {/* Search Card */}
        <form className="orders-search-card" onSubmit={handleSearch}>
          <Search size={22} color="#bef264" />
          <input
            type="text"
            className="orders-search-input"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Order Code (e.g. CC-ORD-882109)"
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#bef264',
              color: '#080a08',
              fontFamily: 'Outfit',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Locate Build
          </button>
        </form>

        {/* Order Display */}
        {activeOrder && (
          <div className="order-card">
            <div className="order-header-row">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264', letterSpacing: '0.12em' }}>
                  ALLOCATION IN PROGRESS
                </span>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 2px', color: '#fff' }}>
                  {activeOrder.model}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Reference Code: <strong style={{ color: '#bef264' }}>{activeOrder.orderId}</strong> • VIN: {activeOrder.vin}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                  ESTIMATED DELIVERY
                </span>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>
                  {activeOrder.estDelivery}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                  {activeOrder.deliveryHub}
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="order-timeline">
              {activeOrder.stages.map((stg) => {
                const isCompleted = stg.num < activeOrder.currentStage;
                const isActive = stg.num === activeOrder.currentStage;
                return (
                  <div
                    key={stg.num}
                    className={`order-step-col ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="order-step-bubble">
                      {isCompleted ? <CheckCircle2 size={18} /> : stg.num}
                    </div>
                    <div className="order-step-label">
                      <strong>{stg.name}</strong>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                        {stg.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concierge Contact Footer */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b' }}>SUPERVISING CHIEF ENGINEER</span>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                  {activeOrder.assignedEngineer}
                </div>
              </div>
              <button
                type="button"
                style={{
                  background: 'rgba(190,242,100,0.1)',
                  border: '1px solid rgba(190,242,100,0.3)',
                  color: '#bef264',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontFamily: 'Space Grotesk',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                REQUEST TELEMETRY PHOTOS
              </button>
            </div>
          </div>
        )}
        {!activeOrder && searched && (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 16px' }}>
            No order found for this reference.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
