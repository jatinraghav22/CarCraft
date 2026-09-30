import React from 'react';
import { ShieldCheck, Cpu, Zap, Award, Globe, Compass, ArrowUpRight } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    {
      icon: Cpu,
      title: 'CARBON ARCHITECTURE',
      desc: 'Autoclave-cured high-modulus pre-preg carbon fiber composite monocoques engineered for supreme torsional rigidity.'
    },
    {
      icon: Zap,
      title: '800V DIRECT VECTORING',
      desc: 'Quad-motor electric powertrains with sub-millisecond independent wheel torque distribution.'
    },
    {
      icon: ShieldCheck,
      title: 'CERTIFIED MASTER CARE',
      desc: 'Every technician is factory-trained with continuous direct telemetry access to our racing engineering teams.'
    },
    {
      icon: Globe,
      title: 'GLOBAL SHOWROOMS',
      desc: 'Immersive physical pavilions in Tokyo, Munich, Dubai, and Silicon Valley featuring bespoke concierge suites.'
    }
  ];

  return (
    <section id="about-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#090b0e] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
            ENGINEERING PHILOSOPHY // AERODYNAMIC MASTERY
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
            DRIVEN BY PRECISION
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-400 font-body leading-relaxed">
            At CARCRAFT, automotive performance is treated as an exact physical science. We blend cutting-edge computational fluid dynamics, motorsport battery chemistry, and artisanal craftsmanship.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#bef264]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bef264] mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-[#bef264]">
                  STANDARD SPECIFICATION 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
