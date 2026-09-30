import React, { useState, useEffect } from 'react';
import DealerSidebar from './DealerSidebar';
import DealerHeader from './DealerHeader';
import DealerErrorBoundary from './DealerErrorBoundary';
import DealerCommandPalette from './DealerCommandPalette';
import { DealerToastProvider } from '../context/DealerToastContext';
import { DealerCountsProvider } from '../context/DealerCountsContext';
import '../styles/dealer.css';

export default function DealerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DealerToastProvider>
      <DealerCountsProvider>
        <div className="dealer-app-container">
        {/* Ambient Luxury Lighting */}
        <div className="dealer-ambient-glow" />

        {/* Persistent & Responsive Collapsible Sidebar */}
        <DealerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="dealer-main-wrapper">
          <DealerHeader
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          <main className="dealer-main-content">
            <DealerErrorBoundary>
              {children}
            </DealerErrorBoundary>
          </main>
        </div>

        {/* Global Executive Command Search */}
        <DealerCommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      </div>
      </DealerCountsProvider>
    </DealerToastProvider>
  );
}
