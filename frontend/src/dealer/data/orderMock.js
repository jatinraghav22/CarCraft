// ==========================================================================
// CARCRAFT DEALER SUITE - CLIENT ORDERS MOCK DATA
// ==========================================================================

export const initialOrders = [
  {
    id: 'ORD-70891',
    customer: 'Vikramaditya Singhania',
    customerEmail: 'vikram.singhania@apexholding.com',
    items: 'BMW M4 Competition Coupé + Track Aero Pack',
    quantity: 1,
    subtotal: 14800000,
    discount: 200000,
    shipping: 50000,
    tax: 2628000,
    total: 17278000,
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    date: '2026-03-24',
    deliveryMethod: 'Enclosed Atelier Transporter'
  },
  {
    id: 'ORD-70892',
    customer: 'Aarav Mahindra',
    customerEmail: 'aarav.m@mahindra-atelier.com',
    items: 'Akrapovič Evolution Line Titanium Exhaust + Eventuri Intake',
    quantity: 2,
    subtotal: 1000000,
    discount: 50000,
    shipping: 12000,
    tax: 172800,
    total: 1134800,
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    date: '2026-03-28',
    deliveryMethod: 'Air Express Courier'
  },
  {
    id: 'ORD-70893',
    customer: 'Tara Wadia',
    customerEmail: 'tara.wadia@radiantcapital.com',
    items: 'BBS FI-R Forged Monoblock Wheels (Set of 4)',
    quantity: 1,
    subtotal: 890000,
    discount: 0,
    shipping: 15000,
    tax: 160200,
    total: 1065200,
    paymentStatus: 'PENDING',
    orderStatus: 'PROCESSING',
    date: '2026-03-29',
    deliveryMethod: 'Atelier Workshop Collection'
  },
  {
    id: 'ORD-70894',
    customer: 'Devansh Kothari',
    customerEmail: 'devansh@kotharijewels.com',
    items: 'Pilot Sport Cup 2 R Semi-Slick Tyres (Full Set)',
    quantity: 1,
    subtotal: 240000,
    discount: 0,
    shipping: 8000,
    tax: 43200,
    total: 291200,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    date: '2026-03-28',
    deliveryMethod: 'Direct Fitment at Workshop'
  },
  {
    id: 'ORD-70895',
    customer: 'Siddharth Mallya',
    customerEmail: 'siddharth@mallya-estates.com',
    items: 'Laser-Matrix Dynamic LED Headlamp Conversion',
    quantity: 1,
    subtotal: 450000,
    discount: 45000,
    shipping: 10000,
    tax: 72900,
    total: 487900,
    paymentStatus: 'REFUNDED',
    orderStatus: 'CANCELLED',
    date: '2026-03-21',
    deliveryMethod: 'Standard Logistics'
  }
];
