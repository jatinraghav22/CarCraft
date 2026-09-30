import React from 'react';
import { Scale, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Legal.css';

export default function Terms() {
  return (
    <div className="legal-page">
      <Navbar />

      <main className="legal-container">
        <div className="legal-badge">
          <Scale size={13} />
          CLIENT ACCORD // TERMS OF SERVICE
        </div>
        <h1 className="legal-title">Terms of Service & Commission Accord</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' }}>
          Effective: September 2026 • Governing Worldwide Operations
        </p>

        <div className="legal-card">
          <h2>1. Vehicle Allocation & Production Slots</h2>
          <p>
            Submission of an allocation reservation or test drive request does not establish a legally binding transfer of title until bilateral execution of the CarCraft Purchase & Commission Agreement by our executive treasury desk.
          </p>

          <h2>2. Track Testing & Circuit Conduct</h2>
          <p>
            Participation in closed-circuit telemetry masterclasses at Laguna Seca, Nürburgring Nordschleife, or Dubai Autodrome requires presentation of a valid civil driver's license or FIA racing permit. Pilots must follow all instructor directives regarding apex flags and pit exit speeds.
          </p>

          <h2>3. Intellectual Property & Digital Models</h2>
          <p>
            All 3D vehicle models, aerodynamic vectoring schematics, high-voltage battery designs, and bespoke configurator renders remain the exclusive intellectual property of CarCraft International S.A.
          </p>

          <h2>4. Dispute Resolution & Arbitration</h2>
          <p>
            Any disputes arising under these terms shall be settled by confidential international arbitration conducted in Geneva, Switzerland, in accordance with the Swiss Rules of International Arbitration.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
