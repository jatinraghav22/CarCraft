import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Trash2, 
  Plus, 
  X, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Gauge, 
  Sparkles,
  Layers,
  Car,
  Check
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { mockVehicles } from '../../data/vehicles';
import { handleImageError } from '../../utils/imageFallback';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Compare.css';

export default function Compare() {
  const { compareList, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { addToast } = useToast();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Available vehicles that are NOT currently in compare list
  const availableVehicles = useMemo(() => {
    const selectedIds = new Set(compareList.map((v) => v.id));
    return mockVehicles.filter((v) => !selectedIds.has(v.id));
  }, [compareList]);

  // Load preset flagship matchup
  const loadFlagshipMatchup = () => {
    clearCompare();
    const defaults = ['cc-apex-gtr', 'cc-chronos-gt', 'cc-phantom-v12'];
    defaults.forEach((id) => {
      const v = mockVehicles.find((car) => car.id === id);
      if (v) addToCompare(v);
    });
    addToast('Loaded Flagship Matchup (3 Vehicles)', 'info');
  };

  // Performance winner calculations
  const highestPowerId = useMemo(() => {
    if (compareList.length < 2) return null;
    let max = -1;
    let bestId = null;
    compareList.forEach((c) => {
      const val = c.powerNum || 0;
      if (val > max) {
        max = val;
        bestId = c.id;
      }
    });
    return bestId;
  }, [compareList]);

  const bestAccelerationId = useMemo(() => {
    if (compareList.length < 2) return null;
    let min = 999;
    let bestId = null;
    compareList.forEach((c) => {
      const val = c.accelerationNum || 999;
      if (val < min && val > 0) {
        min = val;
        bestId = c.id;
      }
    });
    return bestId;
  }, [compareList]);

  const highestTopSpeedId = useMemo(() => {
    if (compareList.length < 2) return null;
    let max = -1;
    let bestId = null;
    compareList.forEach((c) => {
      const val = c.topSpeedNum || 0;
      if (val > max) {
        max = val;
        bestId = c.id;
      }
    });
    return bestId;
  }, [compareList]);

  // Helper to check if values differ across compared cars
  const hasDifference = (getValue) => {
    if (compareList.length < 2) return false;
    const first = getValue(compareList[0]);
    return compareList.some((c) => getValue(c) !== first);
  };

  return (
    <div className="compare-page">
      <div className="compare-atmosphere" />
      <Navbar />

      <main className="compare-container">
        {/* Top Header */}
        <div className="compare-header-row">
          <div>
            <div className="compare-badge">
              <SlidersHorizontal size={13} />
              TELEMETRY COMPARISON ENGINE
            </div>
            <h1 className="compare-title">Vehicle Spec Differential</h1>
          </div>

          <div className="compare-controls-right">
            {compareList.length > 0 && (
              <>
                <label className="compare-toggle-label">
                  <input
                    type="checkbox"
                    checked={highlightDiff}
                    onChange={(e) => setHighlightDiff(e.target.checked)}
                    style={{ accentColor: '#bef264', cursor: 'pointer' }}
                  />
                  <span>Highlight Differences</span>
                </label>

                <button className="compare-clear-btn" onClick={clearCompare}>
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            ZERO STATE: When no vehicles are selected
        ════════════════════════════════════════════════════ */}
        {compareList.length === 0 ? (
          <div className="compare-zero-state">
            <div className="compare-zero-icon-wrap">
              <SlidersHorizontal size={34} />
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 10px' }}>
              No Vehicles In Comparison Matrix
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 28px' }}>
              Select up to 3 high-performance vehicles from our fleet to analyze acceleration curves, powertrain telemetry, and aero dynamics side-by-side.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={loadFlagshipMatchup}
                style={{
                  background: '#bef264',
                  color: '#080a08',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: 'none',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} />
                Load Flagship Matchup (3 Cars)
              </button>
              <Link
                to="/vehicles"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Car size={16} />
                Browse Fleet Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════
             ACTIVE COMPARISON MATRIX TABLE
          ════════════════════════════════════════════════════ */
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-th-metric">
                    <span style={{ fontSize: '11px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                      TELEMETRY MATRIX
                    </span>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'Outfit', fontWeight: 700, marginTop: '4px' }}>
                      {compareList.length} / 3 Selected
                    </div>
                  </th>

                  {compareList.map((car) => (
                    <th key={car.id} className="compare-th-car">
                      <div className="compare-car-card">
                        <div className="compare-car-media-wrap">
                          <img src={car.image} alt={car.model} onError={handleImageError} className="compare-car-img" />
                          <button
                            type="button"
                            className="compare-remove-car-btn"
                            title="Remove from comparison"
                            onClick={() => removeFromCompare(car.id)}
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <div>
                          <span className="compare-car-brand">{car.brand}</span>
                          <h3 className="compare-car-title">{car.model}</h3>
                          <div className="compare-car-price">{car.formattedPrice}</div>
                        </div>

                        <div className="compare-car-actions">
                          <Link
                            to={`/vehicles/${car.id}`}
                            className="compare-action-btn-primary"
                          >
                            <span>VIEW SPEC</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Empty Slot Card if less than 3 cars */}
                  {compareList.length < 3 && (
                    <th className="compare-th-car">
                      <div
                        className="compare-empty-slot"
                        onClick={() => setModalOpen(true)}
                      >
                        <div className="compare-add-icon-wrap">
                          <Plus size={20} />
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                            Add Competitor
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
                            Choose from {availableVehicles.length} vehicles
                          </div>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {/* ─────────────────────────────────────────────
                    SECTION 1: PERFORMANCE TELEMETRY
                ───────────────────────────────────────────── */}
                <tr className="compare-section-row">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)}>
                    ⚡ Performance Telemetry
                  </td>
                </tr>

                {/* Horsepower */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.powerNum) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">
                      <Zap size={14} color="#bef264" />
                      Horsepower
                    </div>
                  </td>
                  {compareList.map((car) => {
                    const isWinner = car.id === highestPowerId;
                    return (
                      <td key={car.id}>
                        <span className={`compare-cell-val ${isWinner ? 'winner' : ''}`}>
                          {car.power}
                        </span>
                        {isWinner && (
                          <span className="compare-winner-chip">
                            <Trophy size={10} /> BEST
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* 0-60 MPH */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.accelerationNum) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">
                      <Gauge size={14} color="#38bdf8" />
                      0-60 MPH Acceleration
                    </div>
                  </td>
                  {compareList.map((car) => {
                    const isWinner = car.id === bestAccelerationId;
                    return (
                      <td key={car.id}>
                        <span className={`compare-cell-val ${isWinner ? 'winner' : ''}`}>
                          {car.acceleration}
                        </span>
                        {isWinner && (
                          <span className="compare-winner-chip">
                            <Trophy size={10} /> FASTEST
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Top Speed */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.topSpeedNum) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">
                      <Gauge size={14} color="#f59e0b" />
                      Top Speed
                    </div>
                  </td>
                  {compareList.map((car) => {
                    const isWinner = car.id === highestTopSpeedId;
                    return (
                      <td key={car.id}>
                        <span className={`compare-cell-val ${isWinner ? 'winner' : ''}`}>
                          {car.topSpeed}
                        </span>
                        {isWinner && (
                          <span className="compare-winner-chip">
                            <Trophy size={10} /> HIGHEST
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Torque */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.torque) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">
                      <span>Torque Output</span>
                    </div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.torque || 'N/A'}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* ─────────────────────────────────────────────
                    SECTION 2: POWERTRAIN & DRIVETRAIN
                ───────────────────────────────────────────── */}
                <tr className="compare-section-row">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)}>
                    ⚙️ Powertrain & Architecture
                  </td>
                </tr>

                {/* Fuel Architecture */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.fuel) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Fuel / Energy</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.fuel}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Engine / Motors */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.engine) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Motor / Engine</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val" style={{ fontSize: '0.82rem' }}>
                        {car.engine}
                      </span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Transmission */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.transmission) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Transmission</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.transmission}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Drivetrain */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.drivetrain) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Drivetrain</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.drivetrain}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* ─────────────────────────────────────────────
                    SECTION 3: PHYSICAL METRICS & RANGE
                ───────────────────────────────────────────── */}
                <tr className="compare-section-row">
                  <td colSpan={compareList.length + (compareList.length < 3 ? 2 : 1)}>
                    📐 Specifications & Capacity
                  </td>
                </tr>

                {/* Range / Efficiency */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.mileage) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Range / Mileage</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.mileage}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Body Segment */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.category) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Body Segment</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.category}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Seating */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.seats) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Seating Capacity</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.seats} Passengers</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>

                {/* Model Year */}
                <tr className={`compare-data-row ${highlightDiff && hasDifference((c) => c.year) ? 'highlight-diff' : ''}`}>
                  <td>
                    <div className="compare-metric-name">Production Year</div>
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id}>
                      <span className="compare-cell-val">{car.year}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            MODAL SELECTOR: Add vehicle to empty slot
        ════════════════════════════════════════════════════ */}
        {modalOpen && (
          <div className="compare-modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="compare-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="compare-modal-header">
                <div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                    Select Vehicle To Compare
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>
                    Choose a model to analyze alongside your current selection.
                  </p>
                </div>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  onClick={() => setModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="compare-modal-list">
                {availableVehicles.map((car) => (
                  <div
                    key={car.id}
                    className="compare-modal-item"
                    onClick={() => {
                      addToCompare(car);
                      setModalOpen(false);
                      addToast(`${car.model} added to comparison matrix`, 'success');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={car.image} alt={car.model} onError={handleImageError} className="compare-modal-thumb" />
                      <div>
                        <div style={{ fontSize: '10px', fontFamily: 'Space Grotesk', color: '#64748b' }}>
                          {car.brand}
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}>
                          {car.model}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#bef264' }}>
                          {car.power} • {car.acceleration}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem' }}>
                        {car.formattedPrice}
                      </span>
                      <Plus size={16} color="#bef264" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
