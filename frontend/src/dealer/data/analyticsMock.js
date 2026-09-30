// ==========================================================================
// CARCRAFT DEALER SUITE - AUDITED FINANCIAL ANALYTICS & P&L MOCK DATA
// Prepared for Django endpoint: GET /api/dealer/profit-loss/?period={period}
// ==========================================================================

export const profitLossPeriodsMock = {
  this_month: {
    periodLabel: 'This Month (March 2026)',
    revenue: 28400000, // ₹2.84 Cr
    directCosts: 14200000, // ₹1.42 Cr
    grossProfit: 14200000, // ₹1.42 Cr (Revenue - Direct Costs)
    operatingExpenses: 4900000, // ₹49 Lakh (Rent + Salaries + Power + Transport)
    netProfit: 9300000, // ₹93 Lakh (Gross Profit - Operating Expenses)
    netLoss: 0,
    grossMargin: '50.0%',
    netMargin: '32.7%',

    revenueBreakdown: {
      vehicleRevenue: 21200000, // ₹2.12 Cr
      partsRevenue: 4820000, // ₹48.2 Lakh
      serviceRevenue: 2040000, // ₹20.4 Lakh
      otherRevenue: 340000 // ₹3.4 Lakh
    },

    costsBreakdown: {
      vehicleCost: 11200000, // ₹1.12 Cr
      partsCost: 2650000, // ₹26.5 Lakh
      serviceCost: 350000, // ₹3.5 Lakh
      operatingExpenses: 4900000, // ₹49.0 Lakh
      otherCosts: 0
    },

    financialTable: [
      { date: '2026-03-28', revenue: 7900000, directCost: 4100000, operatingExpense: 850000, profitLoss: 2950000, isProfit: true },
      { date: '2026-03-24', revenue: 14800000, directCost: 11200000, operatingExpense: 180000, profitLoss: 3420000, isProfit: true },
      { date: '2026-03-20', revenue: 890000, directCost: 640000, operatingExpense: 95000, profitLoss: 155000, isProfit: true },
      { date: '2026-03-15', revenue: 180000, directCost: 110000, operatingExpense: 220000, profitLoss: -150000, isProfit: false },
      { date: '2026-03-10', revenue: 4630000, directCost: 2150000, operatingExpense: 1250000, profitLoss: 1230000, isProfit: true }
    ]
  },

  today: {
    periodLabel: 'Today (Live Fiscal Day)',
    revenue: 1050000,
    directCosts: 640000,
    grossProfit: 410000,
    operatingExpenses: 110000,
    netProfit: 300000,
    netLoss: 0,
    grossMargin: '39.0%',
    netMargin: '28.5%',
    revenueBreakdown: {
      vehicleRevenue: 0,
      partsRevenue: 890000,
      serviceRevenue: 160000,
      otherRevenue: 0
    },
    costsBreakdown: {
      vehicleCost: 0,
      partsCost: 640000,
      serviceCost: 35000,
      operatingExpenses: 110000,
      otherCosts: 0
    },
    financialTable: [
      { date: 'Today, 15:30', revenue: 890000, directCost: 640000, operatingExpense: 40000, profitLoss: 210000, isProfit: true },
      { date: 'Today, 11:15', revenue: 160000, directCost: 35000, operatingExpense: 70000, profitLoss: 55000, isProfit: true }
    ]
  },

  this_week: {
    periodLabel: 'This Week',
    revenue: 7900000,
    directCosts: 4800000,
    grossProfit: 3100000,
    operatingExpenses: 950000,
    netProfit: 2150000,
    netLoss: 0,
    grossMargin: '39.2%',
    netMargin: '27.2%',
    revenueBreakdown: {
      vehicleRevenue: 5200000,
      partsRevenue: 2100000,
      serviceRevenue: 600000,
      otherRevenue: 0
    },
    costsBreakdown: {
      vehicleCost: 3400000,
      partsCost: 1200000,
      serviceCost: 200000,
      operatingExpenses: 950000,
      otherCosts: 0
    },
    financialTable: [
      { date: '2026-03-29', revenue: 1050000, directCost: 640000, operatingExpense: 110000, profitLoss: 300000, isProfit: true },
      { date: '2026-03-27', revenue: 55000, directCost: 18000, operatingExpense: 5000, profitLoss: 32000, isProfit: true },
      { date: '2026-03-24', revenue: 6795000, directCost: 4142000, operatingExpense: 835000, profitLoss: 1818000, isProfit: true }
    ]
  },

  last_month: {
    periodLabel: 'Last Month (February 2026)',
    revenue: 26000000,
    directCosts: 13500000,
    grossProfit: 12500000,
    operatingExpenses: 4000000,
    netProfit: 8500000,
    netLoss: 0,
    grossMargin: '48.0%',
    netMargin: '32.6%',
    revenueBreakdown: {
      vehicleRevenue: 19800000,
      partsRevenue: 4400000,
      serviceRevenue: 1800000,
      otherRevenue: 0
    },
    costsBreakdown: {
      vehicleCost: 10500000,
      partsCost: 2500000,
      serviceCost: 500000,
      operatingExpenses: 4000000,
      otherCosts: 0
    },
    financialTable: [
      { date: '2026-02-28', revenue: 8400000, directCost: 4500000, operatingExpense: 1100000, profitLoss: 2800000, isProfit: true },
      { date: '2026-02-15', revenue: 11200000, directCost: 6000000, operatingExpense: 1900000, profitLoss: 3300000, isProfit: true },
      { date: '2026-02-05', revenue: 6400000, directCost: 3000000, operatingExpense: 1000000, profitLoss: 2400000, isProfit: true }
    ]
  },

  this_year: {
    periodLabel: 'Fiscal Year 2026 YTD',
    revenue: 84200000, // ₹8.42 Cr
    directCosts: 42100000,
    grossProfit: 42100000,
    operatingExpenses: 14600000,
    netProfit: 27500000, // ₹2.75 Cr
    netLoss: 0,
    grossMargin: '50.0%',
    netMargin: '32.6%',
    revenueBreakdown: {
      vehicleRevenue: 64800000,
      partsRevenue: 13900000,
      serviceRevenue: 5500000,
      otherRevenue: 0
    },
    costsBreakdown: {
      vehicleCost: 34200000,
      partsCost: 6800000,
      serviceCost: 1100000,
      operatingExpenses: 14600000,
      otherCosts: 0
    },
    financialTable: [
      { date: 'March 2026', revenue: 28400000, directCost: 14200000, operatingExpense: 4900000, profitLoss: 9300000, isProfit: true },
      { date: 'February 2026', revenue: 26000000, directCost: 13500000, operatingExpense: 4000000, profitLoss: 8500000, isProfit: true },
      { date: 'January 2026', revenue: 29800000, directCost: 14400000, operatingExpense: 5700000, profitLoss: 9700000, isProfit: true }
    ]
  },

  custom: {
    periodLabel: 'Custom Date Audit Window',
    revenue: 12500000,
    directCosts: 6200000,
    grossProfit: 6300000,
    operatingExpenses: 2100000,
    netProfit: 4200000,
    netLoss: 0,
    grossMargin: '50.4%',
    netMargin: '33.6%',
    revenueBreakdown: {
      vehicleRevenue: 9800000,
      partsRevenue: 1900000,
      serviceRevenue: 800000,
      otherRevenue: 0
    },
    costsBreakdown: {
      vehicleCost: 4900000,
      partsCost: 1000000,
      serviceCost: 300000,
      operatingExpenses: 2100000,
      otherCosts: 0
    },
    financialTable: [
      { date: 'Filtered Day 1', revenue: 5200000, directCost: 2600000, operatingExpense: 850000, profitLoss: 1750000, isProfit: true },
      { date: 'Filtered Day 2', revenue: 7300000, directCost: 3600000, operatingExpense: 1250000, profitLoss: 2450000, isProfit: true }
    ]
  }
};
