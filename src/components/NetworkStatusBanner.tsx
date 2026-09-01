import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { offlineAndPwaService, NetworkHealthState } from '../services/offlineAndPwaService';

interface NetworkStatusBannerProps {
  theme?: 'dark' | 'light';
  onOpenRecentCached?: () => void;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  theme = 'dark',
  onOpenRecentCached,
}) => {
  const [networkState, setNetworkState] = useState<NetworkHealthState>(offlineAndPwaService.getNetworkState());
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDismissed, setShowDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineAndPwaService.subscribeNetworkStatus((state) => {
      setNetworkState(state);
      if (state.isOnline && !state.isLowNetwork) {
        // Auto reset dismissed when back online
        setShowDismissed(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 800);
  };

  // Only show when offline or low network, unless dismissed
  if ((networkState.isOnline && !networkState.isLowNetwork) || showDismissed) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slide-up">
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${
          !networkState.isOnline
            ? isDark
              ? 'bg-rose-950/80 border-rose-500/30 text-rose-100'
              : 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-100'
            : isDark
            ? 'bg-amber-950/80 border-amber-500/30 text-amber-100'
            : 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              !networkState.isOnline ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {!networkState.isOnline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>{!networkState.isOnline ? 'Offline Mode Active' : 'Low Bandwidth Detected'}</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-current/10">
                {networkState.effectiveType.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] opacity-80 line-clamp-1">
              {!networkState.isOnline
                ? 'Serving cached properties & offline blueprints.'
                : 'Optimizing high-res imagery for faster mobile loading.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Syncing...' : 'Retry'}</span>
          </button>
          <button
            onClick={() => setShowDismissed(true)}
            className="text-[11px] opacity-60 hover:opacity-100 px-1 py-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
