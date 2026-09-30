import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  MessageSquarePlus, 
  CheckCircle2, 
  X,
  Car 
} from 'lucide-react';
import { ownerReviews } from '../../data/reviewsData';
import { mockVehicles } from '../../data/vehicles';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Reviews.css';

export default function Reviews() {
  const { addToast } = useToast();
  const [reviewsList, setReviewsList] = useState(ownerReviews);
  const [modalOpen, setModalOpen] = useState(false);

  // New review form
  const [authorName, setAuthorName] = useState('');
  const [vehicleModel, setVehicleModel] = useState(mockVehicles[0].model);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authorName || !reviewTitle || !reviewContent) {
      addToast('Please complete all review fields', 'error');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      author: authorName,
      location: 'Verified Owner',
      vehicle: vehicleModel,
      rating,
      date: 'Just Now',
      verified: true,
      title: reviewTitle,
      content: reviewContent,
      telemetryScore: '100% Client Rating'
    };

    setReviewsList([newRev, ...reviewsList]);
    setModalOpen(false);
    addToast('Thank you! Your verified owner testimonial has been published.', 'success');
  };

  return (
    <div className="reviews-page">
      <Navbar />

      <main className="reviews-container">
        {/* Header */}
        <div className="reviews-header">
          <div className="reviews-badge">
            <ShieldCheck size={13} />
            VERIFIED OWNER TELEMETRY
          </div>
          <h1 className="reviews-title">Client Perspectives</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Unfiltered feedback from collectors, track pilots, and hypercar owners worldwide.
          </p>
        </div>

        {/* Metrics Banner */}
        <div className="reviews-metrics-bar">
          <div className="reviews-metric-item">
            <div className="reviews-metric-val">4.98</div>
            <div className="reviews-metric-lbl">Overall Satisfaction (5.0)</div>
          </div>
          <div className="reviews-metric-item">
            <div className="reviews-metric-val">99.4%</div>
            <div className="reviews-metric-lbl">Concierge Recommendation</div>
          </div>
          <div className="reviews-metric-item">
            <div className="reviews-metric-val">1,420+</div>
            <div className="reviews-metric-lbl">Global Hypercar Deliveries</div>
          </div>
          <div className="reviews-metric-item">
            <div className="reviews-metric-val">100%</div>
            <div className="reviews-metric-lbl">Track Certified Quality</div>
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#fff' }}>
            Verified Testimonials ({reviewsList.length})
          </h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#bef264',
              color: '#080a08',
              fontFamily: 'Outfit',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <MessageSquarePlus size={16} />
            Submit Owner Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="review-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="review-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#bef264" />
                    ))}
                  </div>
                  <span className="review-verified-badge">
                    <CheckCircle2 size={11} /> VERIFIED
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#bef264', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {rev.vehicle}
                </div>

                <h3 className="review-title">{rev.title}</h3>
                <p className="review-content">"{rev.content}"</p>
              </div>

              <div className="review-author-row">
                <div>
                  <div className="review-author-name">{rev.author}</div>
                  <div className="review-author-meta">{rev.location} • {rev.date}</div>
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                  {rev.telemetryScore}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4,5,8,0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setModalOpen(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                background: '#0d121c',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: 0, color: '#fff' }}>
                  Submit Verified Owner Review
                </h3>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  onClick={() => setModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '6px' }}>
                    YOUR FULL NAME / TITLE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Marcus Sterling"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '6px' }}>
                    OWNED CARCRAFT VEHICLE
                  </label>
                  <select
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', outline: 'none' }}
                  >
                    {mockVehicles.map((car) => (
                      <option key={car.id} value={car.model}>{car.model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '6px' }}>
                    REVIEW HEADLINE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unbelievable throttle response on the Nordschleife"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'Space Grotesk', color: '#cbd5e1', marginBottom: '6px' }}>
                    DETAILED TESTIMONIAL
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your ownership experience, track telemetry, and concierge delivery remarks..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#bef264',
                    color: '#080a08',
                    fontFamily: 'Outfit',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  PUBLISH TESTIMONIAL
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
