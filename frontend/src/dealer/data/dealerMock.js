// ==========================================================================
// CARCRAFT DEALER SUITE - MOCK DATA LAYER
// Dedicated private dataset isolated from customer frontend
// ==========================================================================

export const dealerInfoMock = {
  dealerId: "DLR-IN-9082",
  name: "Alexander Sterling",
  email: "sterling@carcraft.atelier.internal",
  phone: "+91 98450 12890",
  businessName: "CARCRAFT Atelier & Master Dealership",
  businessAddress: "7th Horizon Boulevard, Indiranagar, Bangalore, KA 560038",
  accountCreated: "January 14, 2024",
  tier: "Flagship Principal Dealer",
  status: "ACTIVE",
  lastLogin: "Today, 09:42 AM IST"
};

export const dashboardMetricsMock = {
  topStats: {
    totalVehicles: {
      label: "Total Fleet Vehicles",
      value: 48,
      display: "48",
      change: "+12%",
      trend: "positive",
      subtext: "8 arriving this week"
    },
    totalParts: {
      label: "Component Inventory",
      value: 326,
      display: "326",
      change: "+8.4%",
      trend: "positive",
      subtext: "14 items low in stock"
    },
    totalCustomers: {
      label: "Verified Clientele",
      value: 1240,
      display: "1,240",
      change: "+19.2%",
      trend: "positive",
      subtext: "84 active VIP tier"
    },
    totalOrders: {
      label: "Total Executed Orders",
      value: 894,
      display: "894",
      change: "+15.6%",
      trend: "positive",
      subtext: "23 pending dispatch"
    }
  },

  secondaryStats: {
    vehiclesSold: {
      label: "Vehicles Sold",
      value: 38,
      display: "38 Units",
      trend: "positive",
      change: "+6 vs last month"
    },
    partsSold: {
      label: "Parts Dispatched",
      value: 412,
      display: "412 Units",
      trend: "positive",
      change: "+44 vs last month"
    },
    servicesCompleted: {
      label: "Services Delivered",
      value: 194,
      display: "194 Completed",
      trend: "positive",
      change: "99.2% satisfaction"
    },
    pendingTestDrives: {
      label: "Pending Test Drives",
      value: 5,
      display: "5 Requests",
      trend: "neutral",
      badge: "Action Required"
    },
    pendingServices: {
      label: "Pending Services",
      value: 8,
      display: "8 Bookings",
      trend: "neutral",
      badge: "In Queue"
    }
  },

  financialStats: {
    totalRevenue: {
      raw: 28400000,
      display: "₹2.84 Cr",
      subtitle: "Gross Gross Sales & Bookings",
      change: "+18.4% YoY",
      trend: "positive"
    },
    directCosts: {
      raw: 14200000,
      display: "₹1.42 Cr",
      subtitle: "Vehicle & Parts Acquisition",
      change: "+12.1%",
      trend: "neutral"
    },
    totalExpenses: {
      raw: 19100000,
      display: "₹1.91 Cr",
      subtitle: "Total Outflow (Direct + OpEx)",
      change: "+9.2%",
      trend: "neutral"
    },
    grossProfit: {
      raw: 14200000,
      display: "₹1.42 Cr",
      formula: "Revenue - Direct Costs",
      change: "+24.5%",
      trend: "positive",
      margin: "50.0% Margin"
    },
    netProfit: {
      raw: 9300000,
      display: "₹93 Lakh",
      formula: "Gross Profit - Operating Expenses",
      change: "+32.8%",
      trend: "positive",
      margin: "32.7% Net Margin"
    },
    netLoss: {
      raw: 0,
      display: "₹0",
      formula: "Zero Net Deficit",
      status: "Profitable"
    }
  },

  revenueBreakdown: [
    { label: "Vehicles Revenue", amount: "₹2.12 Cr", percentage: 74.6, color: "#bef264" },
    { label: "Performance Parts", amount: "₹48.2 Lakh", percentage: 17.0, color: "#38bdf8" },
    { label: "Bespoke Services", amount: "₹23.8 Lakh", percentage: 8.4, color: "#fbbf24" }
  ]
};

// Period-specific chart series data
export const chartSeriesMock = {
  monthly: {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    revenue: [180, 210, 245, 220, 260, 284],
    expenses: [130, 150, 168, 155, 175, 191],
    profit: [50, 60, 77, 65, 85, 93],
    vehicleSales: [5, 6, 8, 6, 7, 6],
    partsSales: [58, 64, 76, 68, 72, 74],
    serviceRevenue: [3.2, 3.8, 4.2, 3.9, 4.1, 4.6]
  },
  weekly: {
    labels: ["W1 (Mar)", "W2 (Mar)", "W3 (Mar)", "W4 (Mar)"],
    revenue: [62, 74, 69, 79],
    expenses: [42, 49, 47, 53],
    profit: [20, 25, 22, 26],
    vehicleSales: [1, 2, 1, 2],
    partsSales: [18, 22, 16, 18],
    serviceRevenue: [1.1, 1.3, 1.0, 1.2]
  },
  yearly: {
    labels: ["2022", "2023", "2024", "2025", "2026 (YTD)"],
    revenue: [1420, 1980, 2450, 2980, 2840],
    expenses: [1020, 1380, 1720, 2040, 1910],
    profit: [400, 600, 730, 940, 930],
    vehicleSales: [24, 34, 42, 51, 38],
    partsSales: [210, 320, 440, 580, 412],
    serviceRevenue: [24.5, 38.2, 46.0, 55.4, 42.6]
  },
  custom: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    revenue: [680, 720, 690, 750],
    expenses: [460, 485, 470, 495],
    profit: [220, 235, 220, 255],
    vehicleSales: [9, 10, 9, 10],
    partsSales: [98, 108, 102, 104],
    serviceRevenue: [9.5, 11.2, 10.8, 11.1]
  }
};

export const recentActivityMock = [
  {
    id: "act-101",
    type: "sale",
    title: "BMW M4 Competition",
    subtitle: "Vehicle Sale • Customer: Vikramaditya Singhania",
    amount: "₹1,48,00,000",
    isPositive: true,
    status: "COMPLETED",
    time: "42 mins ago"
  },
  {
    id: "act-102",
    type: "sale",
    title: "Brembo GT-R Carbon Ceramic Brake Kit",
    subtitle: "Parts Sale • Invoice #CC-PRT-8921",
    amount: "₹75,000",
    isPositive: true,
    status: "COMPLETED",
    time: "2 hours ago"
  },
  {
    id: "act-103",
    type: "service",
    title: "BMW X5 xDrive40i",
    subtitle: "Scheduled Concierge Service • Bay #3",
    amount: "₹42,000 (Est.)",
    isPositive: false,
    status: "PENDING",
    time: "3 hours ago"
  },
  {
    id: "act-104",
    type: "test_drive",
    title: "Porsche 911 GT3 RS",
    subtitle: "Track Circuit Test Drive • Slot 16:30 IST",
    amount: "Complimentary VIP",
    isPositive: false,
    status: "PENDING",
    time: "4 hours ago"
  },
  {
    id: "act-105",
    type: "expense",
    title: "Mobil 1 Supercar Synthetic Lubricants (100L)",
    subtitle: "Workshop Consumables • Inv #PO-209",
    amount: "- ₹84,500",
    isPositive: false,
    status: "PAID",
    time: "Yesterday, 17:15"
  },
  {
    id: "act-106",
    type: "sale",
    title: "Mercedes-AMG GT Black Series",
    subtitle: "Vehicle Allocation • Private Collector Deal",
    amount: "₹2,35,00,000",
    isPositive: true,
    status: "COMPLETED",
    time: "Yesterday, 14:20"
  }
];

export const notificationsMock = [
  {
    id: "notif-1",
    title: "New Test Drive Request",
    message: "Rajiv Malhotra requested Porsche 911 GT3 RS for tomorrow at 11:00 AM.",
    time: "15m ago",
    unread: true,
    type: "test_drive"
  },
  {
    id: "notif-2",
    title: "Low Inventory Alert",
    message: "Brembo High Performance Brake Pads (SKU: BRM-889) below threshold (2 left).",
    time: "1h ago",
    unread: true,
    type: "warning"
  },
  {
    id: "notif-3",
    title: "Payment Credited",
    message: "Wire transfer of ₹1,48,00,000 received for BMW M4 Competition.",
    time: "2h ago",
    unread: false,
    type: "payment"
  },
  {
    id: "notif-4",
    title: "New Service Booking",
    message: "Major inspection scheduled for Ferrari Roma on Friday, Bay 1.",
    time: "4h ago",
    unread: false,
    type: "service"
  }
];
