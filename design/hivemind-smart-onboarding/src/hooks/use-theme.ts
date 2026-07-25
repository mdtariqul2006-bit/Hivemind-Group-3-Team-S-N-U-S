import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Reads and toggles the data-theme attribute set before first paint in index.html. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('hm-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#22252A' : '#FBFAF7');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
