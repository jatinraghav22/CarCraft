import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  X, 
  Share2, 
  ChevronRight 
} from 'lucide-react';
import { journalArticles } from '../../data/journalData';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Journal.css';

const CATEGORIES = ['All', 'Engineering', 'Track Telemetry', 'Heritage'];

export default function Journal() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return journalArticles;
    return journalArticles.filter((art) => art.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="journal-page">
      <Navbar />

      <main className="journal-container">
        {/* Header */}
        <div className="journal-header">
          <div className="journal-badge">
            <BookOpen size={13} />
            CARCRAFT TELEMETRY JOURNAL
          </div>
          <h1 className="journal-title">Motorsport & Engineering Dispatch</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Technical deep dives into carbon chassis dynamics, 800V silicon-carbide inverters, and Nürburgring lap records.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="journal-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`journal-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="journal-grid">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="journal-card"
              onClick={() => setActiveArticle(art)}
            >
              <div className="journal-card-media">
                <img src={art.image} alt={art.title} onError={handleImageError} className="journal-card-img" />
                <span className="journal-card-cat-badge">{art.category}</span>
              </div>

              <div className="journal-card-body">
                <h3 className="journal-card-title">{art.title}</h3>
                <p className="journal-card-summary">{art.summary}</p>

                <div className="journal-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />
                    <span>{art.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#bef264' }}>
                    <span>READ ARTICLE</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4,5,8,0.9)',
              backdropFilter: 'blur(16px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setActiveArticle(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '760px',
                maxHeight: '85vh',
                overflowY: 'auto',
                background: '#0d121c',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264', background: 'rgba(190,242,100,0.1)', padding: '4px 10px', borderRadius: '4px' }}>
                  {activeArticle.category} • {activeArticle.readTime}
                </span>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  onClick={() => setActiveArticle(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', color: '#fff', lineHeight: 1.25, margin: '0 0 16px' }}>
                {activeArticle.title}
              </h2>

              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                onError={handleImageError}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '14px', marginBottom: '24px' }}
              />

              <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line', fontFamily: 'Inter' }}>
                {activeArticle.content}
              </div>

              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                  Published by CarCraft Engineering Division
                </span>
                <button
                  type="button"
                  style={{ background: '#bef264', color: '#080a08', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontFamily: 'Outfit', cursor: 'pointer' }}
                  onClick={() => setActiveArticle(null)}
                >
                  CLOSE DISPATCH
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
