import React, { useState } from 'react';
import { mockAdminStats, mockVehicles, mockParts } from '../data/mockData';
import { 
  ShieldCheck, 
  BarChart3, 
  Car, 
  ShoppingBag, 
  Wrench, 
  Users, 
  DollarSign, 
  X, 
  TrendingUp, 
  Activity,
  Layers,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vehicles' | 'parts' | 'bookings'
  const stats = mockAdminStats;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0c0f16] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col min-h-[700px]">
        
        {/* Admin Bar */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-white/10 bg-[#121622]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#bef264]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-wider">
                  CARCRAFT CENTRAL TELEMETRY
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold">
                  SYSTEM ONLINE
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                DJANGO REST API COMPATIBLE // ADMIN PORTAL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#080a0f] border-b border-white/5 overflow-x-auto text-xs font-display font-semibold tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={15} />
            OVERVIEW & KPIS
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car size={15} />
            VEHICLE FLEET ({mockVehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={15} />
            PARTS INVENTORY ({mockParts.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench size={15} />
            SERVICE QUEUE
          </button>
        </div>

        {/* Admin Content Pane */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Top Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>REVENUE</span>
                    <DollarSign size={14} className="text-[#bef264]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">{stats.kpis.revenue}</span>
                  <span className="block text-[10px] font-mono text-emerald-400 mt-1">{stats.kpis.growth}</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>VEHICLES</span>
                    <Car size={14} className="text-[#bef264]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">{stats.kpis.totalVehicles}</span>
                  <span className="block text-[10px] font-mono text-slate-400 mt-1">Global Showroom Fleet</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>CUSTOMERS</span>
                    <Users size={14} className="text-[#bef264]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">{stats.kpis.activeCustomers}</span>
                  <span className="block text-[10px] font-mono text-slate-400 mt-1">Verified VIP Clients</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                    <span>PENDING BAYS</span>
                    <Wrench size={14} className="text-[#bef264]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-[#bef264]">{stats.kpis.pendingServices}</span>
                  <span className="block text-[10px] font-mono text-slate-400 mt-1">Live Diagnostics</span>
                </div>
              </div>

              {/* Recent Orders & Bay Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Orders Table */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#bef264] mb-4 flex items-center justify-between">
                    <span>RECENT MARKETPLACE TRANSACTIONS</span>
                    <Activity size={14} />
                  </h4>
                  <div className="space-y-3">
                    {stats.recentOrders.map((ord) => (
                      <div key={ord.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-white font-bold block">{ord.customer}</span>
                          <span className="text-slate-400 text-[11px]">{ord.item}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">{ord.amount}</span>
                          <span className="text-[#bef264] text-[10px] uppercase">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Bay Telemetry Queue */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#bef264] mb-4 flex items-center justify-between">
                    <span>ACTIVE SERVICE BAY TELEMETRY</span>
                    <Wrench size={14} />
                  </h4>
                  <div className="space-y-3">
                    {stats.serviceQueue.map((sq) => (
                      <div key={sq.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-white font-bold block">{sq.car} // {sq.customer}</span>
                          <span className="text-slate-400 text-[11px]">{sq.service}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-300 block">{sq.bay}</span>
                          <span className="text-amber-400 text-[10px] uppercase font-bold">{sq.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: VEHICLES TABLE */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                INVENTORY FLEET MANAGEMENT (DJANGO GET /api/cars/)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-3 px-4">MODEL</th>
                      <th className="py-3 px-4">CATEGORY</th>
                      <th className="py-3 px-4">POWER / TOP SPEED</th>
                      <th className="py-3 px-4">PRICE</th>
                      <th className="py-3 px-4">IN STOCK</th>
                      <th className="py-3 px-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockVehicles.map((v) => (
                      <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-white font-bold">{v.model}</td>
                        <td className="py-3 px-4 text-slate-300">{v.category}</td>
                        <td className="py-3 px-4 text-slate-400">{v.power} / {v.topSpeed}</td>
                        <td className="py-3 px-4 text-[#bef264] font-bold">{v.formattedPrice}</td>
                        <td className="py-3 px-4 text-white">{v.inStock}</td>
                        <td className="py-3 px-4">
                          <button className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px]">
                            EDIT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PARTS INVENTORY */}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                PARTS & HARDWARE WAREHOUSE (DJANGO GET /api/parts/)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-3 px-4">ITEM NAME</th>
                      <th className="py-3 px-4">CATEGORY</th>
                      <th className="py-3 px-4">PRICE</th>
                      <th className="py-3 px-4">STOCK</th>
                      <th className="py-3 px-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockParts.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-white font-bold">{p.name}</td>
                        <td className="py-3 px-4 text-slate-300">{p.category}</td>
                        <td className="py-3 px-4 text-[#bef264] font-bold">${p.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-white">{p.stock} units</td>
                        <td className="py-3 px-4">
                          <button className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px]">
                            RESTOCK
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICE QUEUE */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                LIVE SERVICE APPOINTMENT SCHEDULE (DJANGO GET /api/bookings/)
              </h4>
              <div className="space-y-3">
                {stats.serviceQueue.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-white font-bold text-sm block">{item.car} ({item.customer})</span>
                      <span className="text-slate-400">{item.service}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-black text-[#bef264] border border-[#bef264]/30">
                        {item.bay}
                      </span>
                      <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
