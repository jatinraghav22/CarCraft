import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  Search, 
  Zap, 
  Clock, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Support.css';

const FAQ_DATA = [
  {
    category: 'Allocations & Orders',
    q: 'How does the CarCraft vehicle allocation protocol work?',
    a: 'Each CarCraft production slot is assigned on a confidential priority allocation basis. Upon placing a refundable reservation deposit, clients are partnered with a dedicated private concierge officer who oversees bespoke commissioning, factory visit arrangements, and transport flight tracking.'
  },
  {
    category: 'Allocations & Orders',
    q: 'Can I customize bespoke materials beyond the online configurator?',
    a: 'Yes. Our Special Operations Atelier in Modena accommodates bespoke one-off requests including custom livery paint-matching, family crest titanium engraving, carbon fiber dye pigments, and bespoke leather sourcing.'
  },
  {
    category: 'International Shipping',
    q: 'What international delivery options are provided?',
    a: 'We provide climate-controlled enclosed air freight delivery worldwide directly to your private hangar, residence, or nearest CarCraft Flagship Studio. All customs, duties, and import logistics are managed by our global transport guild.'
  },
  {
    category: 'Charging & Battery Tech',
    q: 'What charging speeds does the 800V architecture support?',
    a: 'Our pure electric models utilize 800V silicon-carbide inverters capable of accepting up to 350 kW DC ultra-fast charging, recovering 10% to 80% state-of-charge in approximately 14 minutes at compatible stations.'
  },
  {
    category: 'Warranty & Service',
    q: 'What is included in the CarCraft Master Warranty?',
    a: 'Every vehicle includes a comprehensive 4-Year / 50,000-Mile Global Factory Warranty with complimentary annual telemetry health checks, 24/7 flying doctor trackside support, and all scheduled fluid services at certified studios.'
  },
  {
    category: 'Warranty & Service',
    q: 'How does the Trackside Flying Doctor service function?',
    a: 'For clients competing in track days or club circuits, certified CarCraft race technicians can be dispatched directly to your circuit pit box with diagnostic equipment, spare brake friction packs, and telemetry analysis tools.'
  }
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggleIndex = (index) => {
    setOpenIndexes((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      if (!matchCat) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="support-page">
      <Navbar />

      <main className="support-container">
        {/* Header */}
        <div className="support-header">
          <div className="support-badge">
            <HelpCircle size={13} />
            CONCIERGE CLIENT ASSISTANCE
          </div>
          <h1 className="support-title">Concierge Help & Knowledge Base</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Find immediate answers regarding bespoke vehicle commissioning, international air freight, and 24/7 flying doctor support.
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: '600px', margin: '0 auto 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '12px 18px' }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', fontFamily: 'Inter' }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="support-pills">
          {['All', 'Allocations & Orders', 'International Shipping', 'Charging & Battery Tech', 'Warranty & Service'].map((cat) => (
            <button
              key={cat}
              className={`support-pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="support-accordion">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div key={idx} className={`support-faq-item ${isOpen ? 'open' : ''}`}>
                <div className="support-faq-question" onClick={() => toggleIndex(idx)}>
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#bef264" /> : <ChevronDown size={18} color="#64748b" />}
                </div>
                {isOpen && <div className="support-faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>

        {/* Direct Contact Cards */}
        <div className="support-contact-grid">
          <div className="support-contact-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(190,242,100,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bef264' }}>
                <PhoneCall size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', margin: 0, color: '#fff' }}>
                  24/7 Global Flying Doctor
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'Space Grotesk' }}>
                  EMERGENCY TRACKSIDE ASSISTANCE
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Immediate satellite dispatch for trackside telemetry failures, tire punctures, or charging station diagnostics.
            </p>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: '#bef264', marginTop: '6px' }}>
              +1 (800) 584-CRAFT (27238)
            </div>
          </div>

          <div className="support-contact-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Mail size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', margin: 0, color: '#fff' }}>
                  Private Concierge Desk
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'Space Grotesk' }}>
                  CONFIDENTIAL INQUIRIES
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Direct email link to our executive desk in Geneva for allocation requests, private museum acquisitions, and press relations.
            </p>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: '#38bdf8', marginTop: '6px' }}>
              concierge@carcraft.io
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
