/**
 * Client-side PDF export logic.
 * Triggers high-fidelity browser print rendering targeting #resume-print-area
 * with selectable vector text suitable for ATS parsers.
 */
export function exportToPdf(filename?: string): void {
  if (typeof window === 'undefined') return;

  const originalTitle = document.title;
  if (filename) {
    document.title = filename;
  }

  // Ensure DOM is strictly in light theme before printing so Chromium's print preview engine
  // never paints a dark background tile or margin on any paper size
  const wasDark = document.documentElement.classList.contains('dark');
  if (wasDark) {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }

  const restoreTheme = () => {
    if (wasDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    }
    if (filename) {
      document.title = originalTitle;
    }
    window.removeEventListener('afterprint', restoreTheme);
  };

  window.addEventListener('afterprint', restoreTheme);

  try {
    // Trigger browser print dialog (where user can Save as PDF)
    window.print();
  } finally {
    // Fallback restoration in case afterprint fired immediately or browser blocked
    setTimeout(() => {
      restoreTheme();
    }, 150);
  }
}
