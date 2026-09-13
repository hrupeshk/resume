import React, { useState, useEffect, useRef } from 'react';
import type { ResumeDocument } from '../../lib/schema';
import { getTemplateById, getTemplatesForCategory } from '../../lib/templateRegistry';

interface PreviewPaneProps {
  data: ResumeDocument;
  onCycleTemplate: () => void;
  onSelectTemplate: (templateId: string) => void;
  onPrint: () => void;
}

export type ZoomMode = 'fit-width' | 'custom';
export type SpacingDensity = 'compact' | 'balanced' | 'spacious';

export default function PreviewPane({
  data,
  onCycleTemplate,
  onSelectTemplate,
  onPrint,
}: PreviewPaneProps) {
  const [zoomMode, setZoomMode] = useState<ZoomMode>('fit-width');
  const [customZoom, setCustomZoom] = useState<number>(100);
  const [containerScale, setContainerScale] = useState<number>(1);
  const [columnSplit, setColumnSplit] = useState<number>(58);
  const [autoBalance, setAutoBalance] = useState<boolean>(false);
  const [spacingDensity, setSpacingDensity] = useState<SpacingDensity>('balanced');
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);
  const [contentHeight, setContentHeight] = useState<number>(1123);

  const containerRef = useRef<HTMLDivElement>(null);
  const categoryTemplates = getTemplatesForCategory(data.category);
  const currentTemplate = getTemplateById(data.category, data.templateId);
  const TemplateComponent = currentTemplate ? currentTemplate.component : null;

  // Standard A4 width in pixels at standard 96 DPI: 210mm = 794px, 297mm = 1123px
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  // Automatically calculate scale to fit the preview container comfortably
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;

      // Leave 32px comfortable margin inside the pane
      const availableWidth = Math.max(280, containerWidth - 32);

      let nextScale = 1;
      if (zoomMode === 'fit-width') {
        nextScale = Math.min(1.0, availableWidth / A4_WIDTH_PX);
      } else {
        nextScale = customZoom / 100;
      }

      const rounded = Number(nextScale.toFixed(3));
      setContainerScale((prev) => (Math.abs(prev - rounded) > 0.005 ? rounded : prev));
    };

    updateScale();
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateScale);
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [zoomMode, customZoom]);

  const activeScale = zoomMode === 'custom' ? customZoom / 100 : containerScale;

  const handleZoomChange = (delta: number) => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.min(140, Math.max(40, prev + delta)));
  };

  // Measure actual rendered resume height so user can scroll to see overflowing content
  useEffect(() => {
    const el = document.getElementById('resume-print-area');
    if (!el) return;
    const updateContentHeight = () => {
      const art = el.querySelector('article');
      const h = art ? art.scrollHeight : el.scrollHeight;
      if (h > 0) {
        setContentHeight(h);
      }
    };
    updateContentHeight();
    const ro = new ResizeObserver(updateContentHeight);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [data, spacingDensity, columnSplit, fontSizeScale, data.templateId]);

  // Calculate live pages needed with 8px tolerance for subpixel rounding
  const pageCount = Math.max(1, Math.ceil((contentHeight - 8) / A4_HEIGHT_PX));
  const visualCanvasHeight = Math.max(pageCount * A4_HEIGHT_PX, contentHeight);

  return (
    <div
      data-preview-root="true"
      className="flex flex-col h-full bg-canvas rounded-md border border-hairline overflow-hidden shadow-xs print:border-none print:shadow-none print:bg-white print:overflow-visible print:!min-h-0 print:!h-auto"
    >
      {/* Preview Action Header */}
      <div className="no-print p-3 sm:p-4 bg-canvas-elevated border-b border-hairline space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="template-select" className="text-xs font-semibold text-ink">
              Template:
            </label>
            <select
              id="template-select"
              value={data.templateId}
              onChange={(e) => onSelectTemplate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas text-ink font-semibold focus:outline-none focus:border-ink cursor-pointer"
            >
              {categoryTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.badge ? `• ${t.badge}` : ''}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onCycleTemplate}
              title="Cycle through templates instantly with zero data loss"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas hover:border-mute text-xs font-mono text-ink transition-colors cursor-pointer"
            >
              <span>Cycle ↻</span>
            </button>
          </div>

          {/* Zoom & Print Controls */}
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1 border border-hairline rounded-sm bg-canvas px-1 py-0.5"
              title="Screen view magnification (does not affect PDF export)"
            >
              <span className="text-[10px] text-mute font-medium pl-1">Zoom:</span>
              <button
                type="button"
                onClick={() => handleZoomChange(-10)}
                className="px-1.5 py-0.5 text-xs text-mute hover:text-ink cursor-pointer"
                title="Zoom out"
              >
                −
              </button>
              <span className="text-[11px] font-mono px-1.5 py-0.5 text-ink font-semibold">
                {Math.round(activeScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoomChange(10)}
                className="px-1.5 py-0.5 text-xs text-mute hover:text-ink cursor-pointer"
                title="Zoom in"
              >
                +
              </button>
              <div className="h-3 w-px bg-hairline" />
              <button
                type="button"
                onClick={() => setZoomMode('fit-width')}
                className={`text-[10.5px] px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer ${
                  zoomMode === 'fit-width' ? 'bg-neutral-900 text-white font-semibold' : 'text-mute hover:text-ink'
                }`}
                title="Fit view to window width"
              >
                Fit Screen
              </button>
            </div>

            {/* Live Page Count Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-mono font-semibold shadow-2xs ${
                pageCount === 1
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
              title={
                pageCount === 1
                  ? 'Resume fits on 1 standard A4 page with zero overflow.'
                  : `Resume spans ${pageCount} pages. Adjust Font Size or Spacing if you want it to fit on 1 page.`
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pageCount === 1 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span>{pageCount} {pageCount === 1 ? 'Page (Fit)' : `Pages (Overflow)`}</span>
            </div>

            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Quick-Switch Pill Strip for Top Templates */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {categoryTemplates.slice(0, 4).map((t) => {
            const isSelected = t.id === data.templateId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTemplate(t.id)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs'
                    : 'bg-canvas text-body border-hairline hover:border-mute'
                }`}
              >
                <span>{t.name}</span>
                {t.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-xs font-mono uppercase ${
                      isSelected
                        ? 'bg-neutral-700 text-neutral-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal Column Split, Spacing & Font Size Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-neutral-100/90 rounded-sm border border-neutral-200 text-xs text-neutral-700">
          {/* Column Width Split Drag Slider - only for templates that support it */}
          {currentTemplate?.supportsColumnSplit ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[11px] text-neutral-800 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#0d9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Column Split:</span>
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-neutral-400 font-mono">48%</span>
                <input
                  type="range"
                  min="48"
                  max="68"
                  step="1"
                  value={columnSplit}
                  onChange={(e) => setColumnSplit(Number(e.target.value))}
                  className="w-24 sm:w-36 h-1.5 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-[#0d9488]"
                  title="Drag slider left/right to adjust column widths and balance bottom lining"
                />
                <span className="text-[10px] text-neutral-400 font-mono">68%</span>
              </div>

              <span className="text-[10.5px] font-mono font-semibold text-[#0d9488] bg-teal-50 px-1.5 py-0.5 rounded-xs border border-teal-200 shadow-2xs">
                {columnSplit}% / {100 - columnSplit}%
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500 italic flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{currentTemplate?.name || 'Template'} layout optimized for single-page standard</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* Font Size Adjuster (Feature 7) */}
            <div className="flex items-center gap-1.5" title="Adjust font size to fill page or compact content to 1 page">
              <span className="text-neutral-500 font-medium text-[11px] flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 5v14m4-8h8m-4 0v8" />
                </svg>
                <span>Font Size:</span>
              </span>
              <div className="flex items-center gap-0.5 bg-white border border-neutral-300 rounded-xs px-1 py-0.5 shadow-2xs">
                <button
                  type="button"
                  disabled={fontSizeScale <= 85}
                  onClick={() => setFontSizeScale((s) => Math.max(85, s - 5))}
                  className="w-4 h-4 flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  title="Decrease font size"
                >
                  −
                </button>
                <span className="text-[10.5px] font-mono font-semibold px-1 min-w-[34px] text-center text-neutral-800">
                  {fontSizeScale}%
                </span>
                <button
                  type="button"
                  disabled={fontSizeScale >= 115}
                  onClick={() => setFontSizeScale((s) => Math.min(115, s + 5))}
                  className="w-4 h-4 flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  title="Increase font size"
                >
                  +
                </button>
              </div>
            </div>

            {/* Density Spacing */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 font-medium text-[11px]">Spacing:</span>
              {(['compact', 'balanced', 'spacious'] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => setSpacingDensity(density)}
                  className={`px-2 py-0.5 rounded-xs capitalize text-[10.5px] font-medium transition-colors cursor-pointer ${
                    spacingDensity === density
                      ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                      : 'hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Document Canvas (Hardware-accelerated fixed 794px A4 coordinate system) */}
      <div
        ref={containerRef}
        data-preview-container="true"
        className="flex-1 overflow-auto p-4 sm:p-6 bg-neutral-200/70 flex justify-center items-start min-h-[500px] [scrollbar-gutter:stable] print:bg-white print:p-0 print:overflow-visible print:!min-h-0 print:!h-auto"
      >
        <div
          data-preview-canvas-wrapper="true"
          style={{
            width: `${Math.round(A4_WIDTH_PX * activeScale)}px`,
            height: `${Math.round(visualCanvasHeight * activeScale)}px`,
          }}
          className="relative flex-shrink-0 transition-[height] duration-150 print:!w-[210mm] print:!h-auto print:!min-h-0 print:static"
        >
          <div
            id="resume-print-area"
            style={{
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${pageCount * A4_HEIGHT_PX}px`,
              transform: `scale(${activeScale})`,
              transformOrigin: 'top left',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              '--fs': fontSizeScale / 100,
            } as React.CSSProperties}
            className="single-page-mode absolute top-0 left-0 bg-white shadow-lg print:shadow-none print:transform-none print:!w-[210mm] print:min-w-0 print:!min-h-0 print:!h-auto print:static"
          >
            {TemplateComponent ? (
              // @ts-ignore - TemplateComponent accepts optional autoBalance, spacingDensity, columnSplit, fontSizeScale
              <TemplateComponent
                data={data}
                autoBalance={autoBalance}
                spacingDensity={spacingDensity}
                columnSplit={columnSplit}
                fontSizeScale={fontSizeScale}
              />
            ) : (
              <div className="p-8 text-center text-mute bg-white rounded border border-hairline">
                No template found for ID: {data.templateId}
              </div>
            )}
          </div>

          {/* Visual Distinct A4 Page Cut Separator for Multi-Page Resumes */}
          {pageCount > 1 &&
            Array.from({ length: pageCount - 1 }).map((_, i) => {
              const pageNum = i + 1;
              const topPx = pageNum * A4_HEIGHT_PX;
              return (
                <div
                  key={pageNum}
                  style={{
                    position: 'absolute',
                    top: `${Math.round(topPx * activeScale)}px`,
                    left: 0,
                    width: `${Math.round(A4_WIDTH_PX * activeScale)}px`,
                    pointerEvents: 'none',
                  }}
                  className="z-20 no-print flex items-center justify-between px-3 -translate-y-1/2"
                >
                  <div className="flex-1 h-[2px] bg-red-400/80 border-t border-b border-dashed border-red-500/90" />
                  <div className="mx-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold shadow-sm tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    <span>✂ End of Page {pageNum}</span>
                    <span>•</span>
                    <span>Start of Page {pageNum + 1}</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-red-400/80 border-t border-b border-dashed border-red-500/90" />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
