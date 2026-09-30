import React, { useState } from 'react';
import { handleImageError } from '../utils/imageFallback';
import { formatINR } from '../utils/currency';
import { X, CheckCircle2, Zap, Gauge, Shield, Calendar, Phone, Award } from 'lucide-react';

export default function VehicleModal({ vehicle, onClose, onBookTestDrive }) {
  const [activeImage, setActiveImage] = useState(vehicle ? vehicle.image : '');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  if (!vehicle) return null;

  const handleTestDriveSubmit = (e) => {
    e.preventDefault();
    setTestDriveSubmitted(true);
    setTimeout(() => {
      if (onBookTestDrive) onBookTestDrive(vehicle);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e1218] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Modal Hero Image */}
        <div className="relative w-full h-72 sm:h-96 bg-black">
          <img
            src={activeImage || vehicle.image}
            alt={vehicle.model}
            onError={handleImageError}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1218] via-transparent to-black/50" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded bg-[#bef264] text-black text-[11px] font-mono font-bold tracking-widest uppercase mb-2">
                {vehicle.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-tight">
                {vehicle.model}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#bef264] tracking-wider">
                {vehicle.tagline}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                {vehicle.formattedPrice || formatINR(vehicle.price)}
              </span>
              <span className="block text-[11px] font-mono text-slate-400">MSRP / ESTIMATED DELIVERY: 2 WEEKS</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">0-60 MPH</span>
              <span className="block text-lg font-mono font-bold text-white">{vehicle.acceleration}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">OUTPUT POWER</span>
              <span className="block text-lg font-mono font-bold text-[#bef264]">{vehicle.power}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">TORQUE</span>
              <span className="block text-lg font-mono font-bold text-white">{vehicle.torque}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">RANGE / TOP SPEED</span>
              <span className="block text-lg font-mono font-bold text-white">{vehicle.mileage}</span>
            </div>
          </div>

          {/* Description & Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-mono uppercase tracking-widest text-[#bef264] mb-3">
                ENGINEERING PROFILE
              </h4>
              <p className="text-sm text-slate-300 font-body leading-relaxed">
                {vehicle.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-400">
                <Shield size={14} className="text-[#bef264]" />
                <span>5-Year Comprehensive Warranty + Telemetry Care</span>
              </div>
            </div>

            <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10">
              <h4 className="text-sm font-mono uppercase tracking-widest text-white mb-3">
                SYSTEM SPECIFICATIONS
              </h4>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                {vehicle.specs && Object.entries(vehicle.specs).map(([key, val]) => (
                  <li key={key} className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 uppercase">{key}:</span>
                    <span className="text-right text-white font-medium">{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Test Drive / Reservation Form */}
          <div className="bg-[#141923] p-6 rounded-2xl border border-[#bef264]/30">
            {testDriveSubmitted ? (
              <div className="flex items-center gap-3 text-[#bef264] py-4 justify-center">
                <CheckCircle2 size={24} />
                <span className="font-display font-bold text-base uppercase tracking-wider">
                  Test Drive Request Received. A CARCRAFT Concierge Specialist will call you shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2">
                    <Calendar size={15} className="text-[#bef264]" />
                    SCHEDULE VIP TEST DRIVE // CONCIERGE EXPERIENCE
                  </h4>
                  <span className="text-[11px] font-mono text-[#bef264]">AVAILABLE TODAY</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+1 ...)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#ccff00] text-black font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(190,242,100,0.4)]"
                  >
                    CONFIRM VIP TEST DRIVE
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
