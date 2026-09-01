import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Bell, X, CheckCircle2 } from 'lucide-react';
import { offlineAndPwaService } from '../services/offlineAndPwaService';

interface PwaInstallBannerProps {
  theme?: 'dark' | 'light';
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ theme = 'dark' }) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('kiaan_pwa_prompt_dismissed') === 'true';
  });
  const [notificationState, setNotificationState] = useState<string>('default');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const handleInstallable = () => {
      setIsInstallable(true);
    };

    window.addEventListener('kiaan_pwa_installable', handleInstallable);
    if (offlineAndPwaService.isInstallable()) {
      setIsInstallable(true);
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationState(Notification.permission);
    }

    return () => {
      window.removeEventListener('kiaan_pwa_installable', handleInstallable);
    };
  }, []);

  const handleInstallClick = async () => {
    const res = await offlineAndPwaService.promptInstall();
    if (res === 'ACCEPTED') {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
      setIsInstallable(false);
    }
  };

  const handleNotificationRequest = async () => {
    const perm = await offlineAndPwaService.requestNotificationPermission();
    if (perm === 'granted') {
      setNotificationState('granted');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } else {
      setNotificationState(perm);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('kiaan_pwa_prompt_dismissed', 'true');
  };

  if (isDismissed) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold ${
              isDark
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences saved. Kiaan instant mobile experience activated.</span>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full hidden sm:block">
        <div
          className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-[#0E1526]/90 border-white/10 text-white shadow-black/60'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-tight">Kiaan Experience App</h4>
                <p className="text-[11px] opacity-70">Instant offline floor plans & VIP price alerts</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity text-xs"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 pt-3 border-t border-current/10 flex items-center justify-between gap-2">
            <button
              onClick={handleNotificationRequest}
              disabled={notificationState === 'granted'}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                notificationState === 'granted'
                  ? 'text-emerald-500 bg-emerald-500/10'
                  : 'hover:bg-current/5 opacity-80 hover:opacity-100'
              }`}
            >
              <Bell className="w-3 h-3" />
              <span>{notificationState === 'granted' ? 'Alerts Enabled' : 'Enable Alerts'}</span>
            </button>

            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3 h-3" />
              <span>Add to Screen</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
