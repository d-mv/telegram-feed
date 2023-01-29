export function useGlobal() {
  const isMobileAgent = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const isTouch = () => navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;

  const isMobile = () => isMobileAgent() && isTouch();

  return { isMobile };
}
