import React, { useState } from 'react';
import { mockCustomerProfile } from '../data/mockData';
import { handleImageError } from '../utils/imageFallback';
import { User, Car, ShoppingBag, Calendar, Heart, Shield, X, CheckCircle2, ChevronRight, Gauge, Cpu } from 'lucide-react';

export default function CustomerDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('garage'); // 'garage' | 'orders' | 'bookings' | 'wishlist' | 'profile'
  const profile = mockCustomerProfile;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0d1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col min-h-[640px]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-white/10 bg-[#121620]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#bef264] to-[#84cc16] flex items-center justify-center text-black font-bold font-mono">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-wider">
                  CUSTOMER COMMAND CENTER
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 text-[#bef264] text-[10px] font-mono uppercase font-bold">
                  {profile.membershipTier}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                {profile.name} // {profile.email}
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#0a0c12] border-b border-white/5 overflow-x-auto text-xs font-display font-semibold tracking-wider">
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'garage'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car size={15} />
            MY VEHICLES ({profile.garage.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={15} />
            ORDERS ({profile.orders.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar size={15} />
            SERVICE BOOKINGS ({profile.bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#bef264] text-black shadow-lg font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={15} />
            PROFILE & TELEMETRY
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          
          {/* 1. MY GARAGE TAB */}
          {activeTab === 'garage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                  REGISTERED VEHICLES & TELEMETRY HEALTH
                </h4>
                <span className="text-xs font-mono text-slate-400">2 VEHICLES ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.garage.map((car) => (
                  <div 
                    key={car.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#bef264]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-black">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          onError={handleImageError}
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#bef264] border border-[#bef264]/30">
                          {car.status}
                        </span>
                      </div>

                      <h5 className="font-display font-extrabold text-xl text-white uppercase">
                        {car.model}
                      </h5>
                      <span className="text-xs font-mono text-slate-400 block mt-0.5">
                        VIN: {car.vin}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">BATTERY STATE</span>
                        <span className="text-white font-bold text-[#bef264]">{car.batteryHealth}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">ODOMETER</span>
                        <span className="text-white font-bold">{car.mileage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest mb-4">
                PAST & ACTIVE HARDWARE DISPATCHES
              </h4>

              {profile.orders.map((ord) => (
                <div 
                  key={ord.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                        {ord.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-body">
                      {ord.items.join(', ')}
                    </p>
                    <span className="text-[11px] font-mono text-slate-400">
                      Carrier: {ord.carrier}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="block text-lg font-mono font-black text-white">
                      {ord.total}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#bef264]/20 text-[#bef264] border border-[#bef264]/40 mt-1">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. SERVICE BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest mb-4">
                SCHEDULED MAINTENANCE & TELEMETRY SCANS
              </h4>

              {profile.bookings.map((bk) => (
                <div 
                  key={bk.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-white text-base">{bk.id}</span>
                      <span className="px-2 py-0.5 rounded bg-[#bef264]/20 text-[#bef264] text-[10px] font-mono font-bold">
                        {bk.status}
                      </span>
                    </div>
                    <h5 className="font-display font-bold text-lg text-white">
                      {bk.service}
                    </h5>
                    <p className="text-xs font-mono text-slate-400">
                      Vehicle: {bk.vehicle} • Advisor: {bk.advisor}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="block text-sm font-mono font-bold text-[#bef264]">
                      {bk.date} @ {bk.time}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Bay Location: Flagship Sector 1
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. PROFILE & MEMBERSHIP TAB */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                  VIP CONCIERGE PROFILE
                </h4>
                <div className="space-y-3 text-xs font-mono text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">NAME:</span>
                    <span className="text-white font-bold">{profile.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">EMAIL:</span>
                    <span className="text-white">{profile.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">MEMBERSHIP:</span>
                    <span className="text-[#bef264] font-bold">{profile.membershipTier}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">SINCE:</span>
                    <span className="text-white">{profile.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="text-sm font-mono text-[#bef264] uppercase tracking-widest">
                  CONCIERGE PERKS & PRIVILEGES
                </h4>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#bef264]" />
                    <span>Complimentary Annual Telemetry Recalibration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#bef264]" />
                    <span>Priority Queue for Limited-Run Hypercar Allocations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#bef264]" />
                    <span>24/7 Global Trackside Emergency Recovery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#bef264]" />
                    <span>Private VIP Lounge Access at Global Showrooms</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
