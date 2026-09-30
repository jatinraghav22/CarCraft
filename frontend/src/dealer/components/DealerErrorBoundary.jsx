import React, { Component } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default class DealerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CARCRAFT Dealer Suite caught runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="dealer-error-boundary-container">
          <div className="dealer-error-boundary-card">
            <div className="dealer-error-boundary-icon">
              <AlertOctagon size={36} color="var(--dealer-rose)" />
            </div>

            <h2 className="dealer-error-boundary-title">
              Diagnostic Interruption
            </h2>

            <p className="dealer-error-boundary-desc">
              The dealer telemetry engine encountered an unexpected rendering condition.
              Your local cache and credentials remain secure.
            </p>

            {this.state.error && (
              <div className="dealer-error-boundary-details">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="dealer-error-boundary-actions">
              <button
                type="button"
                className="dealer-btn-primary"
                onClick={this.handleReset}
              >
                <RotateCcw size={16} />
                <span>Reload Console</span>
              </button>

              <a
                href="/dealer/dashboard"
                className="dealer-btn-secondary"
              >
                <Home size={16} />
                <span>Return to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
