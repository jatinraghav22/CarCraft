import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal-page">
      <Navbar />

      <main className="legal-container">
        <div className="legal-badge">
          <ShieldCheck size={13} />
          CLIENT DATA ACCORD // PRIVACY POLICY
        </div>
        <h1 className="legal-title">Privacy Policy & Telemetry Protection</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' }}>
          Last Updated: September 2026 • CarCraft International S.A.
        </p>

        <div className="legal-card">
          <h2>1. Confidential Client Data Principles</h2>
          <p>
            CarCraft respects the paramount privacy expected by our global collectors and track pilots. We never sell, monetize, or disclose client identity records, private garage addresses, or financial routing details to third-party commercial advertisers.
          </p>

          <h2>2. High-Performance Telemetry Collection</h2>
          <p>
            Our connected hypercars stream anonymized powertrain diagnostics, inverter junction temperatures, brake rotor wear metrics, and GPS lap times solely to provide real-time proactive maintenance alerts and over-the-air performance calibrations.
          </p>

          <h2>3. Private Atelier Encrypted Storage</h2>
          <p>
            All custom livery specifications, bespoke interior leather requests, and test drive reservations are secured with military-grade 256-bit AES encryption stored in private data vaults situated in Zurich, Switzerland.
          </p>

          <h2>4. Right To Erase & Local Cache</h2>
          <p>
            Members maintain absolute authority to request the immediate erasure of telemetry logs, garage inventory records, and session history by submitting a directive to privacy@carcraft.io.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
