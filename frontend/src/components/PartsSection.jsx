import React, { useState } from 'react';
import { mockParts } from '../data/mockData';
import { handlePartImageError } from '../utils/imageFallback';
import { formatINR } from '../utils/currency';
import { ShoppingCart, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function PartsSection({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedIds, setAddedIds] = useState([]);

  const categories = [
    'All',
    'Performance',
    'Exterior',
    'Wheels & Tyres',
    'Interior',
    'Maintenance'
  ];

  const filteredParts = activeCategory === 'All'
    ? mockParts
    : mockParts.filter(p => p.category === activeCategory);

  const handleAdd = (part) => {
    onAddToCart(part);
    setAddedIds((prev) => [...prev, part.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter(id => id !== part.id));
    }, 1800);
  };

  return (
    <section id="parts-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#08090b] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
              PERFORMANCE HARDWARE & ACCESSORIES
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
              PRECISION COMPONENTS
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 font-body max-w-xl">
              Factory OEM replacements, track-grade carbon composites, and motorsport enhancements engineered to CARCRAFT aerospace standards.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.4)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredParts.map((part) => {
            const isAdded = addedIds.includes(part.id);

            return (
              <div
                key={part.id}
                className="group relative rounded-2xl overflow-hidden bg-[#10141c]/90 border border-white/10 hover:border-[#bef264]/40 transition-all duration-400 flex flex-col justify-between shadow-xl"
                style={{ backdropFilter: 'blur(16px)' }}
              >
                {/* Product Image */}
                <div className="relative w-full h-56 bg-black/60 overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    onError={(e) => handlePartImageError(e, part.category, part.name)}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-600 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10141c] via-transparent to-black/30" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#bef264] uppercase tracking-wider">
                    {part.category}
                  </span>

                  {/* Stock Status */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/90">
                    {part.stock > 0 ? `${part.stock} IN STOCK` : 'BACKORDER'}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2">
                      <Star size={13} fill="currentColor" />
                      <span className="font-mono font-bold text-white">{part.rating}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({part.reviews} verified reviews)</span>
                    </div>

                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[#bef264] transition-colors leading-snug">
                      {part.name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 font-body line-clamp-2">
                      {part.description}
                    </p>

                    <div className="mt-3 text-[11px] font-mono text-slate-400">
                      Fitment: <span className="text-white/80">{part.compatibility}</span>
                    </div>
                  </div>

                  {/* Pricing and Cart Action */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">PRICE</span>
                      <span className="text-xl font-mono font-black text-white">
                        {formatINR(part.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(part)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        isAdded 
                          ? 'bg-[#84cc16] text-black shadow-[0_0_20px_rgba(132,204,22,0.6)]' 
                          : 'bg-white/10 hover:bg-[#bef264] text-white hover:text-black border border-white/15'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          ADDED
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          ADD TO CART
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
