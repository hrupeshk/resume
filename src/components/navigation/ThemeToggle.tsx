import React, { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode === 'system' && systemPrefersDark);

  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

export default function ThemeToggle({ compact = false, className = '' }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    const initial: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    setCurrentTheme(initial);

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      const active = (localStorage.getItem('theme') as ThemeMode) || 'system';
      if (active === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Listen for cross-tab or cross-component theme changes
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail && customEvent.detail !== currentTheme) {
        setCurrentTheme(customEvent.detail);
      }
    };
    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, [currentTheme]);

  const handleSelectTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    try {
      localStorage.setItem('theme', mode);
    } catch (_) {}
    applyTheme(mode);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: mode }));
  };

  if (!mounted) {
    // Render placeholder with same dimensions to avoid layout shift
    return (
      <div
        className={`inline-flex items-center rounded-full border border-hairline bg-canvas p-0.5 opacity-60 ${className}`}
        aria-hidden="true"
      >
        <span className="w-6 h-6 inline-block" />
        <span className="w-6 h-6 inline-block" />
        <span className="w-6 h-6 inline-block" />
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selector"
      className={`inline-flex items-center rounded-full border border-hairline bg-canvas-elevated p-0.5 shadow-2xs transition-colors ${className}`}
    >
      {/* Light option */}
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === 'light'}
        title="Light theme"
        onClick={() => handleSelectTheme('light')}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
          compact ? 'w-6 h-6' : 'w-7 h-7 sm:px-2.5 sm:w-auto sm:h-6 gap-1.5 text-xs'
        } ${
          currentTheme === 'light'
            ? 'bg-neutral-100 text-ink font-semibold shadow-xs dark:bg-neutral-800 dark:text-white'
            : 'text-mute hover:text-ink hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"
          />
        </svg>
        {!compact && <span className="hidden sm:inline text-[11px]">Light</span>}
      </button>

      {/* Dark option */}
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === 'dark'}
        title="Dark theme"
        onClick={() => handleSelectTheme('dark')}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
          compact ? 'w-6 h-6' : 'w-7 h-7 sm:px-2.5 sm:w-auto sm:h-6 gap-1.5 text-xs'
        } ${
          currentTheme === 'dark'
            ? 'bg-neutral-100 text-ink font-semibold shadow-xs dark:bg-neutral-800 dark:text-white'
            : 'text-mute hover:text-ink hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        {!compact && <span className="hidden sm:inline text-[11px]">Dark</span>}
      </button>

      {/* System option */}
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === 'system'}
        title="Follow system theme"
        onClick={() => handleSelectTheme('system')}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
          compact ? 'w-6 h-6' : 'w-7 h-7 sm:px-2.5 sm:w-auto sm:h-6 gap-1.5 text-xs'
        } ${
          currentTheme === 'system'
            ? 'bg-neutral-100 text-ink font-semibold shadow-xs dark:bg-neutral-800 dark:text-white'
            : 'text-mute hover:text-ink hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
          <path strokeWidth="2" strokeLinecap="round" d="M8 21h8m-4-4v4" />
        </svg>
        {!compact && <span className="hidden sm:inline text-[11px]">Auto</span>}
      </button>
    </div>
  );
}
