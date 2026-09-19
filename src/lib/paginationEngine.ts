import type {
  ResumeDocument,
  ResumeSections,
} from './schema';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const CONTENT_WIDTH_PX = 694;
export const PAGE_TOP_MARGIN_PX = 38; // ~10mm
export const PAGE_SIDE_MARGIN_PX = 50; // ~13mm
export const PAGE_BOTTOM_MARGIN_PX = 32; // ~8.5mm - compact bottom margin to maximize fitted content on Page 1
// Physical printable height = 1123 - 38 - 32 = 1053px.
// Setting calibrated ceiling to 1015px guarantees a safe 38px buffer above the bottom page edge,
// ensuring zero lines are ever sliced in half or hidden by container clipping.
export const MAX_PAGE_CONTENT_HEIGHT = 1015;

export interface ItemMeasurement {
  index: number;
  height: number;
}

export interface SectionMeasurement {
  type: keyof ResumeSections | 'summary' | 'unknown';
  headerHeight: number;
  totalHeight: number;
  marginTop: number;
  marginBottom: number;
  items: ItemMeasurement[];
  columnIndex?: 0 | 1; // 0 = left, 1 = right for Novoresume 2-column templates
  flowColIndex?: 0 | 1; // 0 = left, 1 = right for FlowDeveloper secondary grid
}

export interface TemplateMeasurements {
  headerHeight: number;
  totalHeight: number;
  isTwoColumn: boolean;
  sections: SectionMeasurement[];
}

/**
 * Fallback identifier for section type if data-section-type attribute is missing
 */
function matchSectionType(text: string): keyof ResumeSections | 'summary' | 'unknown' {
  const lower = text.toLowerCase().trim();
  // Check volunteer before general experience to prevent "Volunteer Experience" misclassification
  if (lower.includes('volunteer') || lower.includes('community')) return 'volunteer';
  if (lower.includes('experience') || lower.includes('work') || lower.includes('employment') || lower.includes('career')) return 'experience';
  if (lower.includes('education') || lower.includes('academic')) return 'education';
  if (lower.includes('skill') || lower.includes('tech stack') || lower.includes('technologies')) return 'skills';
  if (lower.includes('project')) return 'projects';
  if (lower.includes('certif') || lower.includes('license') || lower.includes('awards')) return 'certifications';
  if (lower.includes('language')) return 'languages';
  if (lower.includes('reference')) return 'references';
  if (lower.includes('summary') || lower.includes('profile') || lower.includes('about')) return 'summary';
  return 'unknown';
}

/**
 * Measures the rendered DOM elements inside the measurement sandbox container
 */
export function measureRenderedTemplate(rootEl: HTMLElement): TemplateMeasurements {
  const rootRect = rootEl.getBoundingClientRect();

  const headerEl = rootEl.querySelector('header');
  let headerHeight = 0;
  if (headerEl) {
    const rect = headerEl.getBoundingClientRect();
    const style = window.getComputedStyle(headerEl);
    const mt = parseFloat(style.marginTop) || 0;
    const mb = parseFloat(style.marginBottom) || 0;
    headerHeight = rect.height + mt + mb;
  }

  const gridEl = rootEl.querySelector('[data-novoresume-grid="true"]');
  const isTwoColumn = Boolean(gridEl && gridEl.children.length >= 2);

  const flowGridEl = rootEl.querySelector('[data-flow-grid="true"]');

  const sections: SectionMeasurement[] = [];

  // Query all sections: first those explicitly tagged with data-section-type, then generic section tags
  const sectionEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-section-type], section'));
  // De-duplicate in case [data-section-type] is on a section element
  const uniqueSectionEls = Array.from(new Set(sectionEls));

  uniqueSectionEls.forEach((secEl) => {
    const secRect = secEl.getBoundingClientRect();
    const secStyle = window.getComputedStyle(secEl);
    const secMt = parseFloat(secStyle.marginTop) || 0;
    const secMb = parseFloat(secStyle.marginBottom) || 0;
    const totalSecHeight = secRect.height + secMt + secMb;

    let colIndex: 0 | 1 | undefined = undefined;
    if (isTwoColumn && gridEl) {
      if (gridEl.children[0]?.contains(secEl)) colIndex = 0;
      else if (gridEl.children[1]?.contains(secEl)) colIndex = 1;
    }

    let flowColIndex: 0 | 1 | undefined = undefined;
    if (flowGridEl && flowGridEl.contains(secEl)) {
      if (flowGridEl.children[0]?.contains(secEl)) flowColIndex = 0;
      else if (flowGridEl.children[1]?.contains(secEl)) flowColIndex = 1;
    }

    const explicitType = secEl.getAttribute('data-section-type') as keyof ResumeSections | null;
    let type: keyof ResumeSections | 'summary' | 'unknown' = 'unknown';

    const headingEl = secEl.querySelector('h1, h2, h3, [data-section-header="true"], [data-section-heading="true"]');
    let headerHeight = 28;
    if (headingEl) {
      const hRect = headingEl.getBoundingClientRect();
      const hStyle = window.getComputedStyle(headingEl);
      const hMt = parseFloat(hStyle.marginTop) || 0;
      const hMb = parseFloat(hStyle.marginBottom) || 0;
      headerHeight = hRect.height + hMt + hMb;
    }

    if (explicitType) {
      type = explicitType;
    } else if (headingEl) {
      type = matchSectionType(headingEl.textContent || '');
    }

    // Measure child entries: prioritize explicit [data-entry-item="true"]
    const items: ItemMeasurement[] = [];
    const explicitEntryEls = Array.from(secEl.querySelectorAll<HTMLElement>('[data-entry-item="true"]'));

    if (explicitEntryEls.length > 0) {
      explicitEntryEls.forEach((entry, idx) => {
        const r = entry.getBoundingClientRect();
        const s = window.getComputedStyle(entry);
        const mt = parseFloat(s.marginTop) || 0;
        const mb = parseFloat(s.marginBottom) || 0;
        items.push({ index: idx, height: r.height + mt + mb });
      });
    } else if (type !== 'skills') {
      const fallbackEntryEls = Array.from(
        secEl.querySelectorAll<HTMLElement>('section > div > div, section > div > article, ul > li')
      );
      fallbackEntryEls.forEach((entry, idx) => {
        const r = entry.getBoundingClientRect();
        const s = window.getComputedStyle(entry);
        const mt = parseFloat(s.marginTop) || 0;
        const mb = parseFloat(s.marginBottom) || 0;
        items.push({ index: idx, height: r.height + mt + mb });
      });
    }

    sections.push({
      type,
      headerHeight,
      totalHeight: totalSecHeight,
      marginTop: secMt,
      marginBottom: secMb,
      items,
      columnIndex: colIndex,
      flowColIndex,
    });
  });

  // Calculate actual content bottom including margins
  let maxBottom = 0;
  const allTracked = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-section-type], section, header'));
  allTracked.forEach((el) => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    const mb = parseFloat(s.marginBottom) || 0;
    const bottom = r.bottom - rootRect.top + mb;
    if (bottom > maxBottom) maxBottom = bottom;
  });

  // The true physical height of the entire rendered document
  const articleEl = rootEl.querySelector('article') || (rootEl.firstElementChild as HTMLElement) || rootEl;
  const articleRect = articleEl.getBoundingClientRect();
  const totalHeight = Math.max(
    articleRect.height,
    articleEl.scrollHeight || 0,
    rootEl.scrollHeight || 0,
    maxBottom
  );

  return {
    headerHeight,
    totalHeight,
    isTwoColumn,
    sections,
  };
}

/**
 * Creates an empty slice with the same envelope as the original document.
 * On Page 2+, personalInfo and summary are blank so Page 2 starts directly with continued content.
 */
function createEmptyPageSlice(data: ResumeDocument, pageIndex: number): ResumeDocument {
  const isFirstPage = pageIndex === 0;
  return {
    ...data,
    personalInfo: isFirstPage
      ? { ...data.personalInfo }
      : {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          photoUrl: '',
          links: [],
        },
    summary: isFirstPage ? data.summary : '',
    continuingSections: [],
    sections: {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      volunteer: [],
      languages: [],
      references: [],
    },
  };
}

/**
 * Deterministically partitions a ResumeDocument into discrete A4 pages
 */
export function partitionResumeIntoPages(
  data: ResumeDocument,
  measurements: TemplateMeasurements,
  maxContentHeight: number = MAX_PAGE_CONTENT_HEIGHT
): ResumeDocument[] {
  // 1. Strict Single Page Fast Path
  if (measurements.totalHeight <= maxContentHeight) {
    return [{ ...data }];
  }

  // 2. Multi-Page Partitioning
  const pages: ResumeDocument[] = [createEmptyPageSlice(data, 0)];
  let currentPageIndex = 0;
  let currentPageRemaining = maxContentHeight - measurements.headerHeight;

  // Account for standalone summary section on Page 1 if present
  // (e.g. in CompactMono, MinimalBlue, ExecutiveMba where summary is rendered as a separate <section data-section-type="summary">)
  const summarySec = measurements.sections.find((s) => s.type === 'summary');
  if (summarySec && data.summary && data.summary.trim().length > 0) {
    const sumSpacing = Math.max(summarySec.marginBottom, 12);
    currentPageRemaining -= (summarySec.totalHeight + sumSpacing);
  }

  const getOrCreatePage = (idx: number): ResumeDocument => {
    while (pages.length <= idx) {
      pages.push(createEmptyPageSlice(data, pages.length));
    }
    return pages[idx];
  };

  if (measurements.isTwoColumn) {
    // -----------------------------------------------------------------------
    // Two-Column Partitioning (e.g. Novorésumé Modern)
    // -----------------------------------------------------------------------
    let leftColIndex = 0;
    let rightColIndex = 0;
    let leftRemaining = maxContentHeight - measurements.headerHeight;
    let rightRemaining = maxContentHeight - measurements.headerHeight;

    const leftSections = measurements.sections.filter((s) => s.columnIndex === 0);
    const rightSections = measurements.sections.filter((s) => s.columnIndex === 1);

    // Allocate Left Column (typically Experience, Projects)
    leftSections.forEach((sec) => {
      if (sec.type === 'unknown' || sec.type === 'summary') return;
      const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
      if (!rawItems.length) return;

      if (sec.items.length > 0 && rawItems.length === sec.items.length) {
        let secHeaderAdded = false;
        sec.items.forEach((item, idx) => {
          const needed = item.height + (secHeaderAdded ? 0 : sec.headerHeight);
          if (needed > leftRemaining && leftRemaining < maxContentHeight) {
            leftColIndex++;
            const newPage = getOrCreatePage(leftColIndex);
            leftRemaining = maxContentHeight;
            secHeaderAdded = false;
            if (!newPage.continuingSections) newPage.continuingSections = [];
            if (!newPage.continuingSections.includes(sec.type)) {
              newPage.continuingSections.push(sec.type);
            }
          }
          const target = getOrCreatePage(leftColIndex);
          (target.sections[sec.type as keyof ResumeSections] as any[]).push(rawItems[idx]);
          secHeaderAdded = true;
          leftRemaining -= needed;
        });
        leftRemaining -= Math.max(sec.marginBottom, 14);
      } else {
        if (sec.totalHeight > leftRemaining && leftRemaining < maxContentHeight) {
          leftColIndex++;
          getOrCreatePage(leftColIndex);
          leftRemaining = maxContentHeight;
        }
        const target = getOrCreatePage(leftColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        leftRemaining -= (sec.totalHeight + Math.max(sec.marginBottom, 14));
      }
    });

    // Sections that should stay atomic (never split across pages)
    const ATOMIC_SECTIONS = new Set(['certifications', 'education', 'languages', 'skills', 'volunteer']);

    // Allocate Right Column (typically Skills, Certifications, Volunteer, Education, Languages)
    rightSections.forEach((sec) => {
      if (sec.type === 'unknown' || sec.type === 'summary') return;
      const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
      if (!rawItems.length) return;

      const isAtomic = ATOMIC_SECTIONS.has(sec.type);

      if (isAtomic) {
        if (sec.totalHeight > rightRemaining && rightRemaining < maxContentHeight) {
          rightColIndex++;
          getOrCreatePage(rightColIndex);
          rightRemaining = maxContentHeight;
        }
        const target = getOrCreatePage(rightColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        rightRemaining -= (sec.totalHeight + Math.max(sec.marginBottom, 14));
      } else if (sec.items.length > 0 && rawItems.length === sec.items.length) {
        let secHeaderAdded = false;
        sec.items.forEach((item, idx) => {
          const needed = item.height + (secHeaderAdded ? 0 : sec.headerHeight);
          if (needed > rightRemaining && rightRemaining < maxContentHeight) {
            rightColIndex++;
            const newPage = getOrCreatePage(rightColIndex);
            rightRemaining = maxContentHeight;
            secHeaderAdded = false;
            if (!newPage.continuingSections) newPage.continuingSections = [];
            if (!newPage.continuingSections.includes(sec.type)) {
              newPage.continuingSections.push(sec.type);
            }
          }
          const target = getOrCreatePage(rightColIndex);
          (target.sections[sec.type as keyof ResumeSections] as any[]).push(rawItems[idx]);
          secHeaderAdded = true;
          rightRemaining -= needed;
        });
        rightRemaining -= Math.max(sec.marginBottom, 14);
      } else {
        if (sec.totalHeight > rightRemaining && rightRemaining < maxContentHeight) {
          rightColIndex++;
          getOrCreatePage(rightColIndex);
          rightRemaining = maxContentHeight;
        }
        const target = getOrCreatePage(rightColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        rightRemaining -= (sec.totalHeight + Math.max(sec.marginBottom, 14));
      }
    });

    return pages;
  }

  // -------------------------------------------------------------------------
  // Single-Column & Flow Developer Hybrid Partitioning
  // -------------------------------------------------------------------------
  const mainSections = measurements.sections.filter((s) => s.flowColIndex === undefined);
  const flowSecondarySections = measurements.sections.filter((s) => s.flowColIndex !== undefined);

  // Sections that should stay atomic and never split across pages with orphan headings
  // (Only inline lists / single paragraphs that cannot be meaningfully split per-item)
  const ATOMIC_SECTIONS = new Set(['languages', 'skills', 'summary']);

  // Track the first page index where each section began
  const sectionStartedOnPage = new Map<string, number>();

  // 1. Process Main Flow Sections
  mainSections.forEach((sec) => {
    if (sec.type === 'unknown' || sec.type === 'summary') return;
    const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
    if (!rawItems.length) return;

    const isAtomic = ATOMIC_SECTIONS.has(sec.type);
    const secSpacing = Math.max(sec.marginBottom, 14);

    if (isAtomic) {
      // If this atomic section does not fit with a 16px safety cushion, advance to next page
      if (sec.totalHeight + 16 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
        currentPageIndex++;
        getOrCreatePage(currentPageIndex);
        currentPageRemaining = maxContentHeight;
      }

      const targetPage = getOrCreatePage(currentPageIndex);
      (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
      currentPageRemaining -= (sec.totalHeight + secSpacing);
    } else {
      // Splittable sections (Experience, Projects, Certifications, Education, Volunteer)
      if (sec.items.length > 0 && rawItems.length === sec.items.length) {
        let isHeaderPlacedOnCurrentPage = false;

        sec.items.forEach((item, idx) => {
          const hasStartedBefore = sectionStartedOnPage.has(sec.type);
          
          // Cost of placing this item:
          // If section hasn't started yet on any page, heading must be rendered.
          // If section is continuing from an earlier page, heading is NOT rendered.
          const headerCost = (!hasStartedBefore && !isHeaderPlacedOnCurrentPage) ? sec.headerHeight : 0;
          const itemNeededHeight = item.height + headerCost;

          // Safety buffer: require at least 16px cushion for header + entry, 10px for entry
          const safetyBuffer = (!hasStartedBefore && !isHeaderPlacedOnCurrentPage) ? 16 : 10;

          // If this entry does not fit on the current page, advance to the next page
          if (
            itemNeededHeight + safetyBuffer > currentPageRemaining &&
            currentPageRemaining < maxContentHeight
          ) {
            currentPageIndex++;
            getOrCreatePage(currentPageIndex);
            currentPageRemaining = maxContentHeight;
            isHeaderPlacedOnCurrentPage = false;
          }

          const targetPage = getOrCreatePage(currentPageIndex);

          if (!hasStartedBefore) {
            // First time this section is placed anywhere
            sectionStartedOnPage.set(sec.type, currentPageIndex);
            isHeaderPlacedOnCurrentPage = true;
          } else if (sectionStartedOnPage.get(sec.type) !== currentPageIndex) {
            // Section started on an earlier page and continues here:
            // Mark continuingSections so template suppresses repeated <h2>
            if (!targetPage.continuingSections) targetPage.continuingSections = [];
            if (!targetPage.continuingSections.includes(sec.type)) {
              targetPage.continuingSections.push(sec.type);
            }
          }

          (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(rawItems[idx]);
          currentPageRemaining -= itemNeededHeight;
        });

        // Strictly deduct section bottom margin so following section begins at true visual offset
        currentPageRemaining -= secSpacing;
      } else {
        if (sec.totalHeight + 16 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
          currentPageIndex++;
          getOrCreatePage(currentPageIndex);
          currentPageRemaining = maxContentHeight;
        }

        const targetPage = getOrCreatePage(currentPageIndex);
        (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        currentPageRemaining -= (sec.totalHeight + secSpacing);
      }
    }
  });

  // 2. Process Flow Developer 2-Column Secondary Grid (if present)
  if (flowSecondarySections.length > 0) {
    const col0Sections = flowSecondarySections.filter((s) => s.flowColIndex === 0);
    const col1Sections = flowSecondarySections.filter((s) => s.flowColIndex === 1);
    const col0Gaps = Math.max(0, col0Sections.length - 1) * 16;
    const col1Gaps = Math.max(0, col1Sections.length - 1) * 16;
    const col0Height = col0Sections.reduce((sum, s) => sum + s.totalHeight, 0) + col0Gaps;
    const col1Height = col1Sections.reduce((sum, s) => sum + s.totalHeight, 0) + col1Gaps;
    const secondaryGridVisualHeight = Math.max(col0Height, col1Height) + 8;

    // A. If the entire secondary 2-column block fits on current page, keep all together
    if (secondaryGridVisualHeight + 16 <= currentPageRemaining) {
      flowSecondarySections.forEach((sec) => {
        if (sec.type === 'unknown' || sec.type === 'summary') return;
        const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
        if (!rawItems.length) return;

        const targetPage = getOrCreatePage(currentPageIndex);
        (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
      });
      currentPageRemaining -= secondaryGridVisualHeight;
    } else {
      // B. Intelligent Grid Balancing:
      // Find best 2-section pair that fits within currentPageRemaining to eliminate bottom blank space
      let bestPair: [SectionMeasurement, SectionMeasurement] | null = null;
      let bestPairHeight = 0;

      for (let i = 0; i < flowSecondarySections.length; i++) {
        for (let j = i + 1; j < flowSecondarySections.length; j++) {
          const sA = flowSecondarySections[i];
          const sB = flowSecondarySections[j];
          const pairH = Math.max(sA.totalHeight, sB.totalHeight) + 8;
          if (pairH + 16 <= currentPageRemaining && pairH > bestPairHeight) {
            bestPair = [sA, sB];
            bestPairHeight = pairH;
          }
        }
      }

      if (bestPair) {
        // Place best pair on currentPage (renders as 2-column grid on Page 1)
        const placedTypes = new Set([bestPair[0].type, bestPair[1].type]);
        [bestPair[0], bestPair[1]].forEach((sec) => {
          if (sec.type === 'unknown' || sec.type === 'summary') return;
          const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
          if (!rawItems.length) return;
          const targetPage = getOrCreatePage(currentPageIndex);
          (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        });

        // Advance to next page for remaining secondary sections
        currentPageIndex++;
        getOrCreatePage(currentPageIndex);
        currentPageRemaining = maxContentHeight;

        flowSecondarySections.forEach((sec) => {
          if (placedTypes.has(sec.type)) return;
          if (sec.type === 'unknown' || sec.type === 'summary') return;
          const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
          if (!rawItems.length) return;
          const targetPage = getOrCreatePage(currentPageIndex);
          (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        });
      } else {
        // Check if any single secondary section fits on currentPage
        let bestSingle: SectionMeasurement | null = null;
        let bestSingleHeight = 0;

        for (const sec of flowSecondarySections) {
          if (sec.totalHeight + 16 <= currentPageRemaining && sec.totalHeight > bestSingleHeight) {
            bestSingle = sec;
            bestSingleHeight = sec.totalHeight;
          }
        }

        if (bestSingle) {
          // Place single section on currentPage (renders full-width on Page 1)
          const rawItems = (data.sections[bestSingle.type as keyof ResumeSections] || []) as any[];
          const targetPage = getOrCreatePage(currentPageIndex);
          (targetPage.sections[bestSingle.type as keyof ResumeSections] as any[]).push(...rawItems);

          // Advance to next page for remaining secondary sections
          currentPageIndex++;
          getOrCreatePage(currentPageIndex);
          currentPageRemaining = maxContentHeight;

          flowSecondarySections.forEach((sec) => {
            if (sec.type === bestSingle!.type) return;
            if (sec.type === 'unknown' || sec.type === 'summary') return;
            const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
            if (!rawItems.length) return;
            const targetPage = getOrCreatePage(currentPageIndex);
            (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
          });
        } else {
          // If neither pair nor single section fits, advance all secondary sections to next page
          currentPageIndex++;
          getOrCreatePage(currentPageIndex);
          currentPageRemaining = maxContentHeight;

          flowSecondarySections.forEach((sec) => {
            if (sec.type === 'unknown' || sec.type === 'summary') return;
            const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
            if (!rawItems.length) return;

            const targetPage = getOrCreatePage(currentPageIndex);
            (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
          });
        }
      }
    }
  }

  return pages;
}
