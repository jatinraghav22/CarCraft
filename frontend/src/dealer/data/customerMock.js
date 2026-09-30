// ==========================================================================
// CARCRAFT DEALER SUITE - VERIFIED CLIENTELE MOCK DATA
// STRICT SECURITY: Passwords and authentication secrets are NEVER stored or returned.
// ==========================================================================

export const initialCustomers = [
  {
    id: 'CUST-1001',
    name: 'Vikramaditya Singhania',
    email: 'vikram.singhania@apexholding.com',
    phone: '+91 98200 11982',
    registrationDate: '2024-02-14',
    orders: 4,
    serviceAppointments: 6,
    testDrives: 3,
    totalSpending: '₹3,42,00,000',
    status: 'VIP Atelier Tier',
    city: 'Bangalore, KA',
    garage: [
      { model: 'CARCRAFT Apex GT-R', year: 2026, plate: 'KA 03 MM 0001' },
      { model: 'BMW M4 Competition Coupé', year: 2025, plate: 'KA 01 ZZ 9999' }
    ],
    notes: 'Prefers concierge delivery to private residence; VIP track day attendee.'
  },
  {
    id: 'CUST-1002',
    name: 'Aarav Mahindra',
    email: 'aarav.m@mahindra-atelier.com',
    phone: '+91 98450 77123',
    registrationDate: '2024-06-20',
    orders: 8,
    serviceAppointments: 4,
    testDrives: 2,
    totalSpending: '₹18,50,000',
    status: 'Club Member',
    city: 'Mumbai, MH',
    garage: [
      { model: 'Porsche 911 GT3 RS', year: 2024, plate: 'MH 01 EQ 7777' }
    ],
    notes: 'Regular customer for Akrapovič and BBS track parts.'
  },
  {
    id: 'CUST-1003',
    name: 'Tara Wadia',
    email: 'tara.wadia@radiantcapital.com',
    phone: '+91 99201 34901',
    registrationDate: '2025-01-10',
    orders: 2,
    serviceAppointments: 1,
    testDrives: 4,
    totalSpending: '₹8,90,000',
    status: 'Active Client',
    city: 'Bangalore, KA',
    garage: [
      { model: 'Audi RS e-tron GT', year: 2025, plate: 'KA 04 RS 1212' }
    ],
    notes: 'Interested in bespoke exterior carbon styling components.'
  },
  {
    id: 'CUST-1004',
    name: 'Devansh Kothari',
    email: 'devansh@kotharijewels.com',
    phone: '+91 98330 91823',
    registrationDate: '2025-03-04',
    orders: 3,
    serviceAppointments: 2,
    testDrives: 1,
    totalSpending: '₹5,20,000',
    status: 'Active Client',
    city: 'Chennai, TN',
    garage: [
      { model: 'Mercedes-AMG GT Black Series', year: 2024, plate: 'TN 07 AMG 01' }
    ],
    notes: 'Motorsport enthusiast; tracks at Madras International Circuit.'
  },
  {
    id: 'CUST-1005',
    name: 'Sanjana Oberoi',
    email: 'soberoi@oberoigroup.com',
    phone: '+91 98112 55901',
    registrationDate: '2025-07-18',
    orders: 1,
    serviceAppointments: 3,
    testDrives: 5,
    totalSpending: '₹78,00,000',
    status: 'VIP Atelier Tier',
    city: 'New Delhi, DL',
    garage: [
      { model: 'Ferrari SF90 Stradale Assetto Fiorano', year: 2025, plate: 'DL 01 SF 9000' }
    ],
    notes: 'Allocation confirmed for upcoming bespoke atelier commissions.'
  }
];
