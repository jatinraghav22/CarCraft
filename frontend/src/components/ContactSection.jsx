import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact-section" className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#08090b] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#bef264] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
              VIP CONCIERGE // GLOBAL PAVILIONS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-none">
              CONNECT WITH CARCRAFT
            </h2>
            <p className="text-sm text-slate-400 font-body max-w-lg leading-relaxed">
              Whether arranging a private track demonstration, inquiring about bespoke vehicle allocations, or consulting with our master technical advisors.
            </p>

            <div className="space-y-4 pt-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#bef264]" />
                <span>Global Flagship: 100 Hypercar Boulevard, Silicon Valley, CA</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#bef264]" />
                <span>Concierge Direct: +1 (800) 555-CRAFT // +1 (800) 555-2723</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#bef264]" />
                <span>Private Inquiries: concierge@carcraft-automotive.com</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-6 bg-[#10141c] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 size={44} className="text-[#bef264] mx-auto animate-bounce" />
                <h4 className="text-xl font-display font-bold text-white uppercase">
                  MESSAGE TRANSMITTED
                </h4>
                <p className="text-xs font-mono text-slate-300">
                  A CARCRAFT VIP Advisor will respond within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-2">
                  DIRECT CONCIERGE INQUIRY
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#bef264]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#bef264]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject (Vehicle Inquiry / Parts / Service)"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#bef264]"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="How can our concierge assist your automotive journey?"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#bef264]"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#bef264] hover:bg-[#ccff00] text-black font-display font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(190,242,100,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  SEND PRIVATE MESSAGE
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
