// ==========================================================================
// CARCRAFT DEALER SUITE - INVENTORY MOCK DATA
// ==========================================================================

export const inventorySummaryMock = {
  totalItems: 72,
  inventoryCost: 312500000, // ₹31.25 Cr
  currentSellingValue: 389400000, // ₹38.94 Cr
  potentialMargin: 76900000, // ₹7.69 Cr
  potentialMarginPct: '19.7%',
  lowStockItemsCount: 3,
  outOfStockCount: 2
};

export const inventoryTransactionsMock = [
  {
    id: 'tx-501',
    product: 'Porsche 911 GT3 RS (992)',
    type: 'Vehicle',
    transaction: 'Purchase',
    quantity: 1,
    cost: '₹2,88,00,000',
    date: '2026-03-22',
    reference: 'PO-DLR-9021',
    supplier: 'Stuttgart Official Direct'
  },
  {
    id: 'tx-502',
    product: 'BMW M4 Competition Coupé',
    type: 'Vehicle',
    transaction: 'Sale',
    quantity: 1,
    cost: '₹1,48,00,000',
    date: '2026-03-21',
    reference: 'INV-2026-089',
    customer: 'Vikramaditya Singhania'
  },
  {
    id: 'tx-503',
    product: 'Akrapovič Titanium Exhaust System',
    type: 'Parts',
    transaction: 'Purchase',
    quantity: 4,
    cost: '₹19,60,000',
    date: '2026-03-19',
    reference: 'PO-DLR-8994',
    supplier: 'Akrapovič d.d.'
  },
  {
    id: 'tx-504',
    product: 'Brembo Carbon-Ceramic Matrix Kit',
    type: 'Parts',
    transaction: 'Adjustment',
    quantity: -1,
    cost: '₹3,80,000',
    date: '2026-03-18',
    reference: 'ADJ-BAY-03',
    note: 'Allocated to VIP Concierge Track Vehicle'
  },
  {
    id: 'tx-505',
    product: 'Eventuri Pre-Preg Carbon Air Intake',
    type: 'Parts',
    transaction: 'Return',
    quantity: 1,
    cost: '₹2,20,000',
    date: '2026-03-15',
    reference: 'RET-CUST-104',
    customer: 'Aarav Mahindra'
  },
  {
    id: 'tx-506',
    product: 'Pilot Sport Cup 2 R Semi-Slick Tyres',
    type: 'Parts',
    transaction: 'Damage',
    quantity: -2,
    cost: '₹87,500',
    date: '2026-03-12',
    reference: 'DMG-LOG-12',
    note: 'In-transit handling puncture written off'
  }
];
