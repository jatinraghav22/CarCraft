// ==========================================================================
// CARCRAFT DEALER SUITE - EXECUTIVE REPORTS CENTER
// Route: /dealer/reports
// ==========================================================================

import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Calendar,
  Download,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';

import { reportApi, reportCategories } from '../services/reportApi';
import Toast from '../components/Toast';

export default function Reports() {
  const [reports, setReports] = useState(reportCategories);
  const [selectedRange, setSelectedRange] = useState('monthly');
  const [format, setFormat] = useState('CSV');
  const [generatingId, setGeneratingId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [toast, setToast] = useState(null);

  const handleGenerate = async (report) => {
    setGeneratingId(report.id);
    try {
      const res = await reportApi.generateReport(report.id, {
        range: selectedRange,
        format
      });

      if (res.success) {
        setToast({ type: 'success', message: `${report.title} generated successfully.` });
        setViewingReport({
          ...report,
          generatedAt: new Date().toLocaleTimeString(),
          range: selectedRange,
          format
        });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Could not generate report' });
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="dealer-vehicles-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="dealer-page-header">
        <div>
          <div className="dealer-section-title-wrap">
            <FileBarChart size={24} color="var(--dealer-lime)" />
            <h2 className="dealer-welcome-title">Executive Reports & Dossiers</h2>
          </div>
          <p className="dealer-welcome-subtitle">
            Generate and export consolidated business telemetry, inventory turns, P&L statements, and client portfolios.
          </p>
        </div>

        {/* Global Export Options */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="dealer-select-wrap">
            <label className="dealer-select-label">Range</label>
            <select className="dealer-select" value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual Fiscal</option>
            </select>
          </div>

          <div className="dealer-select-wrap">
            <label className="dealer-select-label">Format</label>
            <select className="dealer-select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="CSV">CSV Data Export</option>
              <option value="JSON">JSON Telemetry</option>
              <option value="PDF">Executive PDF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {reports.map((r) => (
          <div key={r.id} className="dealer-form-section-card" style={{ justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="dealer-category-badge" style={{ color: 'var(--dealer-cyan)' }}>
                  Audit Ready
                </span>
                <span className="dealer-font-mono" style={{ fontSize: '0.7rem', color: 'var(--dealer-text-muted)' }}>
                  ID: #{r.id}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--dealer-font-heading)', fontSize: '1.15rem', color: '#fff' }}>
                {r.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--dealer-text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                {r.desc}
              </p>
            </div>

            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="dealer-btn-secondary"
                style={{ padding: '7px 12px', fontSize: '0.76rem' }}
                onClick={() => setViewingReport(r)}
              >
                <span>View Schema</span>
              </button>

              <button
                type="button"
                className="dealer-btn-primary"
                style={{ padding: '7px 14px', fontSize: '0.76rem' }}
                disabled={generatingId === r.id}
                onClick={() => handleGenerate(r)}
              >
                {generatingId === r.id ? (
                  <span>Compiling...</span>
                ) : (
                  <>
                    <Download size={13} />
                    <span>Generate {format}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Schema Modal */}
      {viewingReport && (
        <div className="dealer-modal-backdrop" onClick={() => setViewingReport(null)}>
          <div className="dealer-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dealer-border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span className="dealer-brand-tag" style={{ color: 'var(--dealer-lime)' }}>Data Pipeline Definition</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '2px' }}>{viewingReport.title}</h3>
              </div>
              <button type="button" className="dealer-header-btn" onClick={() => setViewingReport(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <p style={{ color: 'var(--dealer-text-secondary)', lineHeight: 1.5 }}>
                {viewingReport.desc}
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--dealer-border-subtle)', fontFamily: 'var(--dealer-font-mono)', fontSize: '0.76rem' }}>
                <div style={{ color: 'var(--dealer-lime)', marginBottom: '4px' }}>
                  Target Endpoint:
                </div>
                <code>GET /api/dealer/reports/{viewingReport.id}/?range={selectedRange}&format={format.toLowerCase()}</code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--dealer-text-muted)' }}>
                <span>Format: <strong>{format}</strong></span>
                <span>Active Scope: <strong>{selectedRange.toUpperCase()}</strong></span>
              </div>
            </div>

            <button type="button" className="dealer-btn-primary" onClick={() => setViewingReport(null)} style={{ alignSelf: 'flex-end' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
