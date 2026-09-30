import React, { useState } from 'react';
import { mockServices } from '../data/mockData';
import { api } from '../services/api';
import { formatINR } from '../utils/currency';
import { Wrench, Calendar, Clock, CheckCircle2, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function ServiceSection({ onBookingConfirmed }) {
  const [selectedServiceId, setSelectedServiceId] = useState(mockServices[0].id);
  const [vehicleModel, setVehicleModel] = useState('CARCRAFT Apex GT-R');
  const [vehicleReg, setVehicleReg] = useState('CC-2026-X');
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  const selectedService = mockServices.find(s => s.id === selectedServiceId) || mockServices[0];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      service: selectedService.name,
      serviceId: selectedService.id,
      price: selectedService.price,
      vehicle: `${vehicleModel} (${vehicleReg})`,
      date: selectedDate,
      time: selectedTime,
      notes: specialNotes
    };

    try {
      const result = await api.createBooking(bookingPayload);
      setConfirmedBooking(result);
      if (onBookingConfirmed) onBookingConfirmed(result);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="service-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#090b0e] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
            PRECISION SERVICE // MASTER CERTIFIED BAY
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
            PROFESSIONAL CARE
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400 font-body">
            Direct telemetry integration, laser-calibrated alignment, 800V EV diagnostics, and hand-finished cosmetic care.
          </p>
        </div>

        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#10141c] border border-[#bef264]/40 text-center space-y-5 shadow-2xl">
            <CheckCircle2 size={56} className="text-[#bef264] mx-auto animate-pulse" />
            <span className="inline-block px-3 py-1 rounded bg-[#bef264]/10 text-[#bef264] font-mono text-xs font-bold uppercase tracking-widest">
              BOOKING CONFIRMED // {confirmedBooking.id}
            </span>
            <h3 className="text-3xl font-display font-extrabold text-white uppercase">
              Service Bay Reserved
            </h3>
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">SERVICE:</span>
                <span className="text-white font-bold">{confirmedBooking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VEHICLE:</span>
                <span className="text-white">{confirmedBooking.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">APPOINTMENT:</span>
                <span className="text-[#bef264]">{confirmedBooking.date} @ {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SERVICE ADVISOR:</span>
                <span className="text-white">{confirmedBooking.advisor}</span>
              </div>
            </div>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="btn-primary mt-4"
            >
              BOOK ANOTHER SERVICE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Select Service Package */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-2">
                1. SELECT SERVICE PACKAGE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockServices.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#151a24] border-[#bef264] shadow-[0_0_24px_rgba(190,242,100,0.25)]'
                          : 'bg-[#10141c]/80 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                            isSelected ? 'bg-[#bef264] text-black font-bold' : 'bg-white/10 text-slate-300'
                          }`}>
                            {srv.badge}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {srv.duration}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-base text-white leading-snug">
                          {srv.name}
                        </h4>

                        <p className="mt-2 text-xs text-slate-400 font-body line-clamp-2">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-lg font-mono font-extrabold text-white">
                          {formatINR(srv.price)}
                        </span>
                        <span className={`text-xs font-mono tracking-wider ${
                          isSelected ? 'text-[#bef264] font-bold' : 'text-slate-500'
                        }`}>
                          {isSelected ? 'SELECTED' : 'SELECT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Appointment Scheduler Form */}
            <div className="lg:col-span-5 bg-[#10141c] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                    RESERVE SERVICE BAY
                  </h3>
                  <p className="text-xs font-mono text-[#bef264]">
                    SELECTED: {selectedService.name} ({formatINR(selectedService.price)})
                  </p>
                </div>
                <Wrench size={22} className="text-[#bef264]" />
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Vehicle Model */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                    VEHICLE MODEL
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. CARCRAFT Apex GT-R / Porsche 911"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>

                {/* VIN / Plate */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                    PLATE OR VIN IDENTIFIER
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    placeholder="e.g. CC-9042-X"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                    PREFERRED DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-2">
                    AVAILABLE TIME SLOT
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 rounded-lg text-xs font-mono tracking-wider transition-all ${
                          selectedTime === slot
                            ? 'bg-[#bef264] text-black font-bold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                    DIAGNOSTIC NOTES / SYMPTOMS
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Squeal under heavy braking at high speed, request telemetry download"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>

                {/* Summary & Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#bef264] hover:bg-[#ccff00] text-black font-display font-extrabold text-xs uppercase tracking-widest transition-all shadow-[0_0_24px_rgba(190,242,100,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'CONFIRMING BAY...' : `CONFIRM BOOKING (${formatINR(selectedService.price)})`}
                    <ArrowRight size={15} />
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
