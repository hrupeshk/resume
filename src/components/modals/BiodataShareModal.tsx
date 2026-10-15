import React, { useState, useEffect } from 'react';
import type { BiodataDocument } from '../../lib/schema';
import {
  exportToPng,
  shareBiodataToWhatsApp,
  shareMatrimonialSummaryToWhatsApp,
  generateMatrimonialTextSummary,
} from '../../lib/imageExport';
import { exportToPdf } from '../../lib/pdf';
import { generateQrCodeDataUrl } from '../../lib/qrCode';

interface BiodataShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: BiodataDocument;
  templateName?: string;
}

export default function BiodataShareModal({
  isOpen,
  onClose,
  doc,
  templateName,
}: BiodataShareModalProps) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'download' | 'summary' | 'qrcode'>('whatsapp');
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const candidateName = doc.personalInfo.fullName.trim() || 'Candidate';
  const nameSlug = candidateName.replace(/\s+/g, '_');
  const filename = `${nameSlug}_Marriage_Biodata.png`;

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate QR Code on open
  useEffect(() => {
    if (!isOpen) return;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://resume.com';
    generateQrCodeDataUrl(currentUrl, { size: 180, darkColor: '#1e293b' })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.warn('Could not generate QR code:', err));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadPng = async () => {
    try {
      setIsExportingPng(true);
      setStatusMessage('Rendering high-resolution 2x Retina PNG…');
      await exportToPng(filename);
      setStatusMessage('✓ Downloaded high-resolution image!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error('PNG export failed:', err);
      alert('Failed to generate PNG image: ' + (err.message || 'Unknown error'));
      setStatusMessage(null);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadPdf = () => {
    exportToPdf(`${nameSlug}_Marriage_Biodata.pdf`);
    setStatusMessage('✓ Print dialog opened for PDF download');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleWhatsAppShare = async () => {
    try {
      setIsSharingWhatsApp(true);
      setStatusMessage('Preparing WhatsApp share…');
      const res = await shareBiodataToWhatsApp(doc, filename);
      setStatusMessage(res.message);
      setTimeout(() => setStatusMessage(null), 4500);
    } catch (err: any) {
      console.error('WhatsApp share error:', err);
      alert('Share error: ' + (err.message || 'Unknown error'));
      setStatusMessage(null);
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  const handleCopySummary = async () => {
    const summary = generateMatrimonialTextSummary(doc);
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleWhatsAppTextShare = () => {
    shareMatrimonialSummaryToWhatsApp(doc);
    setStatusMessage('Opened WhatsApp with text summary');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Link copy failed:', err);
    }
  };

  const handleEmailShare = () => {
    const summary = generateMatrimonialTextSummary(doc);
    const subject = encodeURIComponent(`Marriage Biodata - ${candidateName}`);
    const body = encodeURIComponent(
      `Please find the matrimonial biodata details for ${candidateName} below:\n\n${summary}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white dark:bg-neutral-900 text-ink rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0016] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌸</span>
            <div>
              <h2 id="share-modal-title" className="text-sm sm:text-base font-bold tracking-tight">
                Export & Share Marriage Biodata
              </h2>
              <p className="text-[11px] text-amber-200/90">
                {candidateName} • {templateName || 'Traditional Layout'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-lg leading-none"
            aria-label="Close share dialog"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-[#25D366] text-[#128C7E] dark:text-emerald-400 font-bold bg-white dark:bg-neutral-900'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-[#800020] text-[#800020] dark:text-rose-400 font-bold bg-white dark:bg-neutral-900'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>📥</span>
            <span>Image / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'summary'
                ? 'border-[#800020] text-[#800020] dark:text-rose-400 font-bold bg-white dark:bg-neutral-900'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>Bio Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'qrcode'
                ? 'border-[#800020] text-[#800020] dark:text-rose-400 font-bold bg-white dark:bg-neutral-900'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>📱</span>
            <span>Phone QR</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* TAB 1: WHATSAPP SHARING */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-emerald-50/80 border border-emerald-200 text-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span>🟢</span>
                  <span>Instant WhatsApp Sharing</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Share this biodata image directly with family, relatives, and matrimonial groups. On smartphones, this sends the high-definition image directly via WhatsApp without redundant text. On PC/Mac, it opens WhatsApp Web and downloads the image.
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                disabled={isSharingWhatsApp}
                className="w-full py-3 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSharingWhatsApp ? (
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.761.815 2.79.815 3.183 0 5.769-2.587 5.77-5.768.001-3.181-2.585-5.799-5.768-5.799zm8.567 5.769c-.002 4.743-3.858 8.598-8.599 8.598-1.503 0-2.912-.39-4.143-1.071l-4.596 1.205 1.229-4.482c-.752-1.285-1.189-2.776-1.19-4.25.002-4.742 3.859-8.599 8.6-8.599 4.742 0 8.599 3.857 8.599 8.599z"/>
                  </svg>
                )}
                <span>{isSharingWhatsApp ? 'Preparing Share…' : 'Share to WhatsApp Now'}</span>
              </button>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Also need high-res file?</span>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExportingPng}
                  className="text-[#800020] hover:underline font-semibold cursor-pointer"
                >
                  {isExportingPng ? 'Rendering…' : 'Download Image (PNG) →'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD IMAGE (PNG) & PDF */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* PNG Card */}
                <div className="p-4 rounded-md border-2 border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#800020] uppercase tracking-wide">
                        Image File (PNG)
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-xs font-mono">
                        WhatsApp Ready
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      2x Retina resolution (1588 × 2246 px). High-definition image with rich gold borders, ready to send on any messaging app.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={isExportingPng}
                    className="w-full py-2.5 px-3 rounded-sm bg-[#800020] hover:bg-[#66001a] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isExportingPng ? (
                      <span>Rendering PNG…</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download PNG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* PDF Card */}
                <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                        Standard PDF
                      </span>
                      <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold px-1.5 py-0.5 rounded-xs font-mono">
                        Print Ready
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                      Standard A4 print document with selectable text. Ideal for color printing on bond or parchment paper.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full py-2.5 px-3 rounded-sm bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <div className="bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 rounded text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <span>💡</span>
                <span>
                  Tip: For WhatsApp, sending the <strong>PNG Image</strong> is easiest because relatives can view it directly in the chat without opening a PDF viewer!
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: MATRIMONIAL TEXT SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Preformatted Text Summary:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppTextShare}
                    className="px-2.5 py-1 rounded bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="Send this text summary directly on WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.761.815 2.79.815 3.183 0 5.769-2.587 5.77-5.768.001-3.181-2.585-5.799-5.768-5.799zm8.567 5.769c-.002 4.743-3.858 8.598-8.599 8.598-1.503 0-2.912-.39-4.143-1.071l-4.596 1.205 1.229-4.482c-.752-1.285-1.189-2.776-1.19-4.25.002-4.742 3.859-8.599 8.6-8.599 4.742 0 8.599 3.857 8.599 8.599z"/>
                    </svg>
                    <span>Send on WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="px-2.5 py-1 rounded bg-[#800020] text-white text-xs font-semibold hover:bg-[#66001a] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{copiedSummary ? '✓ Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-md text-[11px] leading-relaxed font-mono whitespace-pre-wrap max-h-56 overflow-y-auto border border-neutral-700">
                {generateMatrimonialTextSummary(doc)}
              </pre>

              <p className="text-[11px] text-neutral-500">
                Ideal for sharing candidate details when the biodata image is not sent, or for quick copy-pasting into text messages.
              </p>
            </div>
          )}

          {/* TAB 4: SMARTPHONE QR CODE & LINK */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 rounded-md border border-neutral-200 dark:border-neutral-800">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Smartphone QR Code"
                    className="w-40 h-40 border border-neutral-300 rounded shadow-xs p-1 bg-white"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-500 text-xs">
                    Generating QR…
                  </div>
                )}
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-3">
                  Scan with your phone camera
                </span>
                <p className="text-[11px] text-neutral-500 max-w-xs mt-1">
                  Instantly open on your smartphone to view, edit, or share directly via mobile WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedLink ? '✓ Link Copied' : '🔗 Copy Link'}
                </button>
                <button
                  type="button"
                  onClick={handleEmailShare}
                  className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  ✉️ Share via Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-5 py-3 flex items-center justify-between text-xs text-neutral-500">
          <span>100% Free & Unlimited • No Login Required</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
