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

const DEFAULT_ORDERS = {
  'CC-ORD-882109': {
    orderId: 'CC-ORD-882109',
    model: 'CARCRAFT Apex GT-R',
    tier: 'Flagship Bespoke Commission',
    vin: '1CC982GT002914',
    exteriorColor: 'Acid Lime Metallic',
    interiorColor: 'Obsidian Alcantara',
    deliveryHub: 'Silicon Valley Flagship Studio',
    estDelivery: 'October 18, 2026',
    currentStage: 3, // 1 to 5
    assignedEngineer: 'Dr. Wolfgang Becker, Lead Powertrain Specialist',
    stages: [
      { num: 1, name: 'Commission Approved', date: 'Sep 10' },
      { num: 2, name: 'Carbon Monocoque Mold', date: 'Sep 16' },
      { num: 3, name: 'Bespoke Paint & Interior', date: 'Sep 24 (In Progress)' },
      { num: 4, name: 'Dyno & Track Certification', date: 'Oct 04' },
      { num: 5, name: 'White-Glove Enclosed Transit', date: 'Oct 18' }
    ]
  },
  'CC-ORD-551920': {
    orderId: 'CC-ORD-551920',
    model: 'Apex Carbon Track Aerokit',
    tier: 'Performance Parts Package',
    vin: 'SKU-AERO-7712',
    exteriorColor: 'Pre-preg Dry Carbon Fiber',
    interiorColor: 'N/A',
    deliveryHub: 'Monaco Riviera Atelier',
    estDelivery: 'October 02, 2026',
    currentStage: 4,
    assignedEngineer: 'Master Technician Jean-Paul',
    stages: [
      { num: 1, name: 'Order Verified', date: 'Sep 18' },
      { num: 2, name: 'Autoclave Curing', date: 'Sep 20' },
      { num: 3, name: 'Quality Inspection', date: 'Sep 22' },
      { num: 4, name: 'Air Freight Dispatched', date: 'Sep 27 (In Flight)' },
      { num: 5, name: 'Delivered to Atelier', date: 'Oct 02' }
    ]
  }
};

export default function Orders() {
  const [searchCode, setSearchCode] = useState('CC-ORD-882109');
  const [activeOrder, setActiveOrder] = useState(DEFAULT_ORDERS['CC-ORD-882109']);
  const [searched, setSearched] = useState(true);

  React.useEffect(() => {
    orderApi.getOrders()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.results || []);
        if (list.length > 0) {
          const first = list[0];
          setSearchCode(first.order_number);
          setActiveOrder({
            orderId: first.order_number,
            model: first.items?.[0]?.part?.name ? `${first.items[0].part.name} + Components` : 'CARCRAFT Client Order',
            tier: `${first.payment_status} • Total ${formatINR(first.total_amount)}`,
            vin: first.order_number,
            exteriorColor: first.shipping_city || 'Atelier Delivery',
            interiorColor: first.shipping_address,
            deliveryHub: 'White-Glove Enclosed Transit',
            estDelivery: new Date(first.created_at).toLocaleDateString(),
            currentStage: first.status === 'DELIVERED' ? 5 : (first.status === 'SHIPPED' ? 4 : (first.status === 'PROCESSING' ? 3 : 2)),
            assignedEngineer: 'Chief Allocation Specialist',
            stages: [
              { num: 1, name: 'Commission Approved', date: 'Confirmed' },
              { num: 2, name: 'Component Allocation', date: first.status !== 'PENDING' ? 'Verified' : 'Pending' },
              { num: 3, name: 'Assembly & Inspection', date: first.status === 'PROCESSING' || first.status === 'SHIPPED' || first.status === 'DELIVERED' ? 'Complete' : 'In Progress' },
              { num: 4, name: 'Logistics Dispatched', date: first.status === 'SHIPPED' || first.status === 'DELIVERED' ? 'En Route' : 'Scheduled' },
              { num: 5, name: 'White-Glove Delivery', date: first.status === 'DELIVERED' ? 'Delivered' : 'Pending' },
            ]
          });
        }
      })
      .catch(() => {});
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    if (DEFAULT_ORDERS[clean]) {
      setActiveOrder(DEFAULT_ORDERS[clean]);
      setSearched(true);
    } else {
      // Create dynamic fallback mock order for whatever reference user types
      setActiveOrder({
        orderId: clean,
        model: 'CarCraft Bespoke Allocation',
        tier: 'Private Client Reserve',
        vin: '1CC' + Math.floor(10000000 + Math.random() * 90000000),
        exteriorColor: 'Liquid Titanium Silver',
        interiorColor: 'Tuscan Saddle Leather',
        deliveryHub: 'Global Atelier Delivery',
        estDelivery: 'Within 21 Business Days',
        currentStage: 2,
        assignedEngineer: 'Master Guild Artisan',
        stages: [
          { num: 1, name: 'Order Commissioned', date: 'Completed' },
          { num: 2, name: 'Component Fabrication', date: 'In Progress' },
          { num: 3, name: 'Bespoke Tailoring', date: 'Scheduled' },
          { num: 4, name: 'Dyno Track Testing', date: 'Scheduled' },
          { num: 5, name: 'Enclosed Carrier Delivery', date: 'Pending' }
        ]
      });
      setSearched(true);
    }
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
      </main>

      <Footer />
    </div>
  );
}
