import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0c0e] text-[#e7e1e5] flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-[#ff5540]/30 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#ff5540]/20 text-[#ff5540] border border-[#ff5540]/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-syne font-black text-2xl text-white">Ocurrió un inconveniente</h2>
              <p className="text-xs text-[#a89f9e]">
                Se ha detectado un error al cargar la aplicación. Puedes reiniciar el estado o recargar la página.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-left overflow-x-auto text-[11px] font-mono text-[#ff5540]">
                {this.state.error.message || 'Error desconocido'}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ff5540]/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
