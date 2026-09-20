import React, { useState, useEffect, useRef } from 'react';
import type { ResumeDocument } from '../../lib/schema';
import { getTemplateById, getTemplatesForCategory } from '../../lib/templateRegistry';
import ResumePageSheet from './ResumePageSheet';
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  CONTENT_WIDTH_PX,
  measureRenderedTemplate,
  partitionResumeIntoPages,
  MAX_PAGE_CONTENT_HEIGHT,
} from '../../lib/paginationEngine';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const categoryTemplates = getTemplatesForCategory(data.category);
  const currentTemplate = getTemplateById(data.category, data.templateId);
  const TemplateComponent = currentTemplate ? currentTemplate.component : null;

  const [pageSlices, setPageSlices] = useState<ResumeDocument[]>([data]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const PAGE_GAP = 28; // Visual gap between A4 sheets in preview

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

  // Scroll listener to update active page indicator as user scrolls / slides
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const pageCardHeight = (A4_HEIGHT_PX + PAGE_GAP + 28) * activeScale;
    const current = Math.min(
      pageCount,
      Math.max(1, Math.floor((scrollTop + 200 * activeScale) / pageCardHeight) + 1)
    );
    setActivePage(current);

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1200);
  };

  // Intelligently calculate discrete pages using DOM sandbox measurement
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const recalculatePagination = () => {
      if (!measureRef.current) return;
      const measurements = measureRenderedTemplate(measureRef.current);
      const slices = partitionResumeIntoPages(data, measurements, MAX_PAGE_CONTENT_HEIGHT);
      setPageSlices(slices);
      setPageCount(slices.length);
    };

    const frameId = window.requestAnimationFrame(recalculatePagination);
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(recalculatePagination);
    });
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    return () => {
      window.cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [data, spacingDensity, columnSplit, fontSizeScale, data.templateId]);

  const visualCanvasHeight =
    pageCount === 1
      ? A4_HEIGHT_PX + 24
      : pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP + pageCount * 30 + 24;

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
                  : `Viewing Page ${activePage} of ${pageCount}. Adjust Font Size or Spacing if you want it to fit on 1 page.`
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pageCount === 1 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span>
                {pageCount === 1
                  ? '1 Page (Fit)'
                  : `Page ${activePage} of ${pageCount} (Overflow)`}
              </span>
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
        onScroll={handleScroll}
        data-preview-container="true"
        className="flex-1 overflow-auto p-4 sm:p-6 bg-neutral-200/70 flex justify-center items-start min-h-0 [scrollbar-gutter:stable] print:bg-white print:p-0 print:overflow-visible print:!min-h-0 print:!h-auto relative"
      >
        {/* Floating Active Page Indicator while scrolling / sliding */}
        {pageCount > 1 && (
          <div
            className={`no-print fixed bottom-6 right-8 sm:right-12 z-30 transition-all duration-300 pointer-events-none ${
              isScrolling ? 'opacity-100 translate-y-0 scale-100' : 'opacity-70 hover:opacity-100 translate-y-0'
            }`}
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white text-xs font-mono font-semibold shadow-lg backdrop-blur-xs border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Page {activePage} of {pageCount}</span>
            </div>
          </div>
        )}

        <div
          data-preview-canvas-wrapper="true"
          style={{
            width: `${Math.round(A4_WIDTH_PX * activeScale)}px`,
            height: `${Math.round(visualCanvasHeight * activeScale)}px`,
          }}
          className="relative flex-shrink-0 transition-[height] duration-150 flex flex-col items-center mb-12 sm:mb-16 print:!mb-0 print:!w-full print:!h-auto print:!min-h-0 print:static"
        >
          {/* Discrete Visual A4 Sheet Cards for Screen Preview and Chromium Print */}
          <div
            className="flex flex-col items-center print:!w-[210mm] print:!max-w-[210mm] print:!block print:!transform-none print:!m-0 print:!p-0"
            style={{
              transform: `scale(${activeScale})`,
              transformOrigin: 'top center',
              willChange: 'transform',
            }}
          >
            {pageSlices.map((slice, i) => {
              const pageNum = i + 1;
              return (
                <ResumePageSheet
                  key={pageNum}
                  pageNumber={pageNum}
                  totalPages={pageSlices.length}
                  scale={activeScale}
                >
                  <div
                    style={{
                      '--fs': fontSizeScale / 100,
                    } as React.CSSProperties}
                  >
                    {TemplateComponent ? (
                      // @ts-ignore - TemplateComponent accepts optional autoBalance, spacingDensity, columnSplit, fontSizeScale
                      <TemplateComponent
                        data={slice}
                        pageNumber={pageNum}
                        totalPages={pageSlices.length}
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
                </ResumePageSheet>
              );
            })}
          </div>

          {/* Offscreen Measurement Sandbox (Strictly hidden from screen and print) */}
          <div
            id="resume-measure-sandbox"
            ref={measureRef}
            style={{
              position: 'fixed',
              left: '-99999px',
              top: 0,
              width: `${CONTENT_WIDTH_PX}px`,
              opacity: 0,
              pointerEvents: 'none',
              '--fs': fontSizeScale / 100,
            } as React.CSSProperties}
            className="no-print pointer-events-none"
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
