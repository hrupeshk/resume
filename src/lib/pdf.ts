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

  // Trigger browser print dialog (where user can Save as PDF)
  window.print();

  // Restore title
  if (filename) {
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }
}
