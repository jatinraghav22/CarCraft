// ==========================================================================
// CARCRAFT DEALER SUITE - EXPENSES MOCK DATA
// ==========================================================================

export const expenseCategories = [
  'Vehicle Purchase',
  'Parts Purchase',
  'Service Cost',
  'Transport',
  'Rent',
  'Electricity',
  'Marketing',
  'Maintenance',
  'Insurance',
  'Tax',
  'Salary/Staff Cost',
  'Other'
];

export const initialExpenses = [
  {
    id: 'EXP-401',
    category: 'Vehicle Purchase',
    description: 'Procurement Allocation: Porsche 911 GT3 RS Weissach Pack',
    amount: 28800000,
    paymentMethod: 'Bank Wire / RTGS',
    date: '2026-03-20',
    createdBy: 'Alexander Sterling (Principal)',
    receipt: 'PO-REC-9912.pdf',
    notes: 'Direct from Stuttgart factory dispatch.'
  },
  {
    id: 'EXP-402',
    category: 'Rent',
    description: 'Atelier Flagship Facility Lease (Indiranagar, Bangalore)',
    amount: 1450000,
    paymentMethod: 'Standing Instruction Auto-Debit',
    date: '2026-03-01',
    createdBy: 'Accounts Treasury',
    receipt: 'LEASE-MAR-2026.pdf',
    notes: 'Primary showroom, showroom display floor and subterranean detail bay.'
  },
  {
    id: 'EXP-403',
    category: 'Salary/Staff Cost',
    description: 'Master Technicians, Service Advisors & Concierge Payroll',
    amount: 2650000,
    paymentMethod: 'Direct Payroll Deposit',
    date: '2026-03-05',
    createdBy: 'HR & Operations Desk',
    receipt: 'PAYROLL-MAR-2026.pdf',
    notes: '14 certified technicians and atelier personnel.'
  },
  {
    id: 'EXP-404',
    category: 'Transport',
    description: 'Enclosed Climate-Controlled Vehicle Transporter Logistics',
    amount: 185000,
    paymentMethod: 'Corporate Card',
    date: '2026-03-22',
    createdBy: 'Logistics Supervisor',
    receipt: 'LOG-REC-482.pdf',
    notes: 'Interstate transit of 2 hypercars to Bangalore atelier.'
  },
  {
    id: 'EXP-405',
    category: 'Electricity',
    description: 'Commercial 350kW DC Fast-Charging Grid & Atelier Power',
    amount: 320000,
    paymentMethod: 'Online Banking',
    date: '2026-03-12',
    createdBy: 'Facility Manager',
    receipt: 'BESCOM-ELEC-MAR.pdf',
    notes: 'High-voltage sub-station draw for EV fleet charging.'
  },
  {
    id: 'EXP-406',
    category: 'Marketing',
    description: 'Private Collector Closed-Track Experience at Bangalore Circuit',
    amount: 750000,
    paymentMethod: 'Bank Transfer',
    date: '2026-03-18',
    createdBy: 'Alexander Sterling',
    receipt: 'EVT-TRACK-MAR.pdf',
    notes: 'Hospitality, safety crews, and track lease for 25 VIP clients.'
  }
];
