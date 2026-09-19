import React from 'react';
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  CONTENT_WIDTH_PX,
  PAGE_TOP_MARGIN_PX,
  PAGE_SIDE_MARGIN_PX,
  PAGE_BOTTOM_MARGIN_PX,
} from '../../lib/paginationEngine';

interface ResumePageSheetProps {
  pageNumber: number;
  totalPages: number;
  scale: number;
  children: React.ReactNode;
}

export default function ResumePageSheet({
  pageNumber,
  totalPages,
  scale,
  children,
}: ResumePageSheetProps) {
  const isLastPage = pageNumber === totalPages;

  return (
    <div
      data-resume-sheet={pageNumber}
      className={`resume-page-sheet-wrapper flex flex-col items-center mb-7 last:mb-0 print:!mb-0 print:!p-0 print:!block ${
        isLastPage ? 'print:!break-after-auto' : 'print:!break-after-page'
      }`}
    >
      {/* Visual Screen-Only Page Badge between sheets */}
      {totalPages > 1 && (
        <div className="no-print mb-2 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-800/90 text-white text-[10px] font-mono font-semibold shadow-xs">
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      )}

      {/* Discrete Physical A4 Sheet Container */}
      <div
        data-page-container={pageNumber}
        style={{
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          boxSizing: 'border-box',
          paddingTop: `${PAGE_TOP_MARGIN_PX}px`,
          paddingLeft: `${PAGE_SIDE_MARGIN_PX}px`,
          paddingRight: `${PAGE_SIDE_MARGIN_PX}px`,
          paddingBottom: `${PAGE_BOTTOM_MARGIN_PX}px`,
          overflow: 'hidden',
          position: 'relative',
        }}
        className="resume-page-sheet bg-white rounded-xs border border-neutral-300/80 shadow-md text-neutral-900 print:!rounded-none print:!border-none print:!shadow-none print:!w-[210mm] print:!h-[297mm] print:!min-h-[297mm] print:!max-h-[297mm] print:!overflow-hidden print:!p-[12mm_14mm_14mm_14mm] print:!box-border print:!m-0"
      >
        {/* Printable Content Area with exact width */}
        <div
          style={{
            width: `${CONTENT_WIDTH_PX}px`,
            maxWidth: `${CONTENT_WIDTH_PX}px`,
            boxSizing: 'border-box',
          }}
          className="resume-page-content mx-auto h-full overflow-hidden print:!w-full print:!max-w-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
