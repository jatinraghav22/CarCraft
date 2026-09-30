// ==========================================================================
// CARCRAFT DEALER SUITE - SALES LEDGER MOCK DATA
// ==========================================================================

export const initialSales = [
  {
    id: 'SL-2026-081',
    invoiceNumber: 'INV-CC-2026-0081',
    customer: 'Vikramaditya Singhania',
    saleType: 'Vehicle',
    product: 'BMW M4 Competition Coupé',
    sellingPrice: 14800000,
    purchaseCost: 11200000,
    otherCosts: 180000,
    tax: 2664000,
    discount: 200000,
    netAmount: 17264000,
    profit: 3420000, // sellingPrice - purchaseCost - otherCosts
    saleDate: '2026-03-24',
    paymentStatus: 'PAID',
    paymentMethod: 'RTGS Wire Transfer'
  },
  {
    id: 'SL-2026-082',
    invoiceNumber: 'INV-CC-2026-0082',
    customer: 'Aarav Mahindra',
    saleType: 'Parts',
    product: 'Akrapovič Evolution Titanium Exhaust System',
    sellingPrice: 680000,
    purchaseCost: 490000,
    otherCosts: 15000,
    tax: 122400,
    discount: 30000,
    netAmount: 772400,
    profit: 175000,
    saleDate: '2026-03-22',
    paymentStatus: 'PAID',
    paymentMethod: 'Corporate Credit Card'
  },
  {
    id: 'SL-2026-083',
    invoiceNumber: 'INV-CC-2026-0083',
    customer: 'Meera Chawla',
    saleType: 'Service',
    product: '800V HV Battery Telemetry Health Check & Ceramic Coating',
    sellingPrice: 55000,
    purchaseCost: 18000, // Consumables cost
    otherCosts: 5000,
    tax: 9900,
    discount: 0,
    netAmount: 64900,
    profit: 32000,
    saleDate: '2026-03-27',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI Instant'
  },
  {
    id: 'SL-2026-084',
    invoiceNumber: 'INV-CC-2026-0084',
    customer: 'Rohan Murthy',
    saleType: 'Vehicle',
    product: 'Mercedes-AMG GT Black Series (Allocation Deposit)',
    sellingPrice: 52000000,
    purchaseCost: 41000000,
    otherCosts: 450000,
    tax: 9360000,
    discount: 0,
    netAmount: 60910000,
    profit: 10550000,
    saleDate: '2026-03-15',
    paymentStatus: 'PAID',
    paymentMethod: 'Treasury Wire'
  },
  {
    id: 'SL-2026-085',
    invoiceNumber: 'INV-CC-2026-0085',
    customer: 'Tara Wadia',
    saleType: 'Parts',
    product: 'BBS FI-R Forged Monoblock Wheels',
    sellingPrice: 890000,
    purchaseCost: 640000,
    otherCosts: 20000,
    tax: 160200,
    discount: 0,
    netAmount: 1050200,
    profit: 230000,
    saleDate: '2026-03-29',
    paymentStatus: 'PENDING',
    paymentMethod: 'Cheque Clearance'
  }
];
