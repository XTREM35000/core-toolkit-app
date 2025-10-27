/* Register the service worker in production only. Safe no-op in dev. */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('navigator' in window)) return;
  if (import.meta.env && import.meta.env.DEV) return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
      // Registration successful
      console.log('Service worker registered:', reg.scope);
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  }
}
