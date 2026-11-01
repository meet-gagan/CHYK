import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Marathon ErrorBoundary]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07162D] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0D1E3A] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-full bg-orange-500/15 text-orange-400 flex items-center justify-center mx-auto text-2xl font-bold border border-orange-500/30">
              🏃
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black font-heading text-white">
                Anti-Drug Movement Marathon 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A temporary display hiccup occurred while rendering this page.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F0441D] to-amber-500 hover:from-amber-500 hover:to-[#F0441D] text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

