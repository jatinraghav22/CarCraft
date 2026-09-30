import React, { useState } from 'react';
import { mockVehicles } from '../data/mockData';
import { handleImageError } from '../utils/imageFallback';
import { formatINR } from '../utils/currency';
import { Zap, Gauge, Shield, ArrowRight, Eye, Sparkles, Filter } from 'lucide-react';

export default function VehicleSection({ onSelectVehicle }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Supercar', 'Electric', 'Track Edition', 'Luxury SUV'];

  const filteredVehicles = selectedCategory === 'All'
    ? mockVehicles
    : mockVehicles.filter(v => v.category === selectedCategory);

  return (
    <section id="vehicles-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#090b0e] border-t border-white/5">
      {/* Background Lighting Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#bef264]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
              FLAGSHIP SHOWCASE // 2026 FLEET
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
              CURATED VEHICLES
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 font-body max-w-xl">
              Engineered with advanced lightweight composites, dual and quad-motor electric architectures, and competition pedigree.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.4)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle)}
              className="group relative rounded-2xl overflow-hidden bg-[#10141c]/80 border border-white/10 hover:border-[#bef264]/50 transition-all duration-500 cursor-pointer shadow-xl flex flex-col justify-between"
              style={{
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Vehicle Image Container */}
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black/50">
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#10141c] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-[#bef264] border border-[#bef264]/30">
                    {vehicle.badge}
                  </span>
                  <span className="px-3 py-1 rounded-md text-[11px] font-mono tracking-wider text-white/80 bg-black/60 backdrop-blur-md border border-white/10">
                    {vehicle.year}
                  </span>
                </div>

                {/* Price Display */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10">
                  <span className="text-base sm:text-lg font-mono font-extrabold text-white">
                    {vehicle.formattedPrice || formatINR(vehicle.price)}
                  </span>
                </div>
              </div>

              {/* Vehicle Specs & Details */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#bef264] tracking-wider uppercase">
                      {vehicle.category} • {vehicle.fuelType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {vehicle.inStock} UNITS AVAILABLE
                    </span>
                  </div>

                  <h3 className="mt-2 text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight uppercase group-hover:text-[#bef264] transition-colors">
                    {vehicle.model}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 font-body line-clamp-2">
                    {vehicle.description}
                  </p>
                </div>

                {/* Specs Telemetry Row */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">0-60 MPH</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white">{vehicle.acceleration}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">POWER</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#bef264]">{vehicle.power}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">TOP SPEED</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white">{vehicle.topSpeed}</span>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    {vehicle.transmission}
                  </span>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 group-hover:bg-[#bef264] text-white group-hover:text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-300">
                    <Eye size={14} />
                    VIEW DETAILS
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
