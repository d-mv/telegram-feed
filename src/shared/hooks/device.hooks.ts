import { useEffect, useState } from 'react';

export function useScreen() {
  const [isSmall, setIsSmall] = useState(window.innerWidth < 800);

  function updateIsSmall() {
    const newValue = window.innerWidth < 800;

    if (newValue !== isSmall) setIsSmall(newValue);
  }

  useEffect(() => {
    globalThis.window.addEventListener('resize', updateIsSmall);
    return () => {
      globalThis.window.removeEventListener('resize', updateIsSmall);
    };
  });
}
