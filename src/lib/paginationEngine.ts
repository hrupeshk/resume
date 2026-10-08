import type {
  ResumeDocument,
  ResumeSections,
} from './schema';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const CONTENT_WIDTH_PX = 698;
export const PAGE_TOP_MARGIN_PX = 28; // ~7.5mm
export const PAGE_SIDE_MARGIN_PX = 48; // ~12.5mm
export const PAGE_BOTTOM_MARGIN_PX = 26; // ~6.9mm - elegant bottom margin for professional printing
// Physical printable height = 1123 - 28 - 26 = 1069px.
// Calibrated ceiling to 1045px maximizes single-page fit while preserving
// a safe 24px buffer above the bottom page edge to eliminate print cutoffs.
export const MAX_PAGE_CONTENT_HEIGHT = 1045;

export interface ItemMeasurement {
  index: number;
  height: number;
}

export type SectionType = keyof ResumeSections | 'summary' | 'personalDetails' | 'unknown';

export interface SectionMeasurement {
  type: SectionType;
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
function matchSectionType(text: string): SectionType {
  const lower = text.toLowerCase().trim();
  // Check declaration first
  if (lower.includes('declaration') || lower.includes('signature')) return 'declaration';
  if (lower.includes('personal detail') || lower.includes('personal information') || lower.includes('particulars')) return 'personalDetails';
  // Check volunteer before general experience to prevent "Volunteer Experience" misclassification
  if (lower.includes('volunteer') || lower.includes('community') || lower.includes('leadership')) return 'volunteer';
  if (lower.includes('experience') || lower.includes('work') || lower.includes('employment') || lower.includes('career')) return 'experience';
  if (lower.includes('education') || lower.includes('academic') || lower.includes('qualification')) return 'education';
  if (lower.includes('skill') || lower.includes('tech stack') || lower.includes('technologies')) return 'skills';
  if (lower.includes('award') || lower.includes('honor') || lower.includes('achievement')) return 'awards';
  if (lower.includes('certif') || lower.includes('license')) return 'certifications';
  if (lower.includes('language')) return 'languages';
  if (lower.includes('reference')) return 'references';
  if (lower.includes('summary') || lower.includes('profile') || lower.includes('about') || lower.includes('objective')) return 'summary';
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
          fatherName: '',
          dateOfBirth: '',
          gender: '',
          maritalStatus: '',
          nationality: '',
          languagesKnown: '',
          permanentAddress: '',
        },
    summary: isFirstPage ? data.summary : '',
    continuingSections: [],
    _masterDocument: data,
    sections: {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      awards: [],
      volunteer: [],
      languages: [],
      references: [],
      declaration: undefined,
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
    // summarySec.totalHeight already contains measured marginTop and marginBottom
    currentPageRemaining -= summarySec.totalHeight;
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
    const declarationSec = measurements.sections.find((s) => s.type === 'declaration');
    const declarationHeight = (data.sections.declaration?.enabled && declarationSec)
      ? Math.max(declarationSec.totalHeight, 130)
      : (data.sections.declaration?.enabled ? 135 : 0);

    const leftSections = measurements.sections.filter((s) => s.columnIndex === 0);
    const rightSections = measurements.sections.filter((s) => s.columnIndex === 1);

    // Check if the entire resume can fit on a single page with declaration included
    const totalLeftHeight = leftSections.reduce((sum, s) => sum + s.totalHeight, 0);
    const totalRightHeight = rightSections.reduce((sum, s) => sum + s.totalHeight, 0);
    const totalNeededForOnePage = measurements.headerHeight +
      Math.max(totalLeftHeight, totalRightHeight) +
      (data.sections.declaration?.enabled ? declarationHeight + 12 : 0);
    const fitsOnOnePage = totalNeededForOnePage <= maxContentHeight;

    let leftColIndex = 0;
    let rightColIndex = 0;
    // On Page 1, declaration is only rendered if it fits on Page 1 or is a single-page document.
    let leftRemaining = maxContentHeight - measurements.headerHeight;
    let rightRemaining = maxContentHeight - measurements.headerHeight;

    // Track the first page index where each section began
    const sectionStartedOnPage = new Map<string, number>();

    // Allocate Left Column (typically Experience, Projects, or Education if balanced left)
    leftSections.forEach((sec) => {
      if (sec.type === 'unknown' || sec.type === 'summary') return;
      const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
      if (!rawItems.length) return;

      if (sec.items.length > 0 && rawItems.length === sec.items.length) {
        sec.items.forEach((item, idx) => {
          const hasStartedBefore = sectionStartedOnPage.has(sec.type);
          const headerCost = !hasStartedBefore ? sec.headerHeight : 0;
          const needed = item.height + headerCost;

          const colCap = leftColIndex === 0
            ? (maxContentHeight - measurements.headerHeight)
            : (maxContentHeight - declarationHeight);

          if (needed + 4 > leftRemaining && leftRemaining < colCap) {
            leftColIndex++;
            const newPage = getOrCreatePage(leftColIndex);
            leftRemaining = maxContentHeight - declarationHeight;
            if (hasStartedBefore) {
              if (!newPage.continuingSections) newPage.continuingSections = [];
              if (!newPage.continuingSections.includes(sec.type)) {
                newPage.continuingSections.push(sec.type);
              }
            }
          }

          const target = getOrCreatePage(leftColIndex);
          if (!sectionStartedOnPage.has(sec.type)) {
            sectionStartedOnPage.set(sec.type, leftColIndex);
          } else if (sectionStartedOnPage.get(sec.type) !== leftColIndex) {
            if (!target.continuingSections) target.continuingSections = [];
            if (!target.continuingSections.includes(sec.type)) {
              target.continuingSections.push(sec.type);
            }
          }

          (target.sections[sec.type as keyof ResumeSections] as any[]).push(rawItems[idx]);
          leftRemaining -= needed;
        });
        leftRemaining -= (sec.marginBottom > 0 ? sec.marginBottom : 6);
      } else {
        const colCap = leftColIndex === 0
          ? (maxContentHeight - measurements.headerHeight)
          : (maxContentHeight - declarationHeight);

        if (sec.totalHeight + 4 > leftRemaining && leftRemaining < colCap) {
          leftColIndex++;
          getOrCreatePage(leftColIndex);
          leftRemaining = maxContentHeight - declarationHeight;
        }
        const target = getOrCreatePage(leftColIndex);
        sectionStartedOnPage.set(sec.type, leftColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        leftRemaining -= sec.totalHeight;
      }
    });

    // Sections that should stay atomic (never split across pages without meaning)
    const ATOMIC_SECTIONS = new Set(['certifications', 'awards', 'languages', 'skills']);

    // Allocate Right Column (typically Skills, Certifications, Volunteer, Education, Languages, References)
    rightSections.forEach((sec) => {
      if (sec.type === 'unknown' || sec.type === 'summary') return;
      const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
      if (!rawItems.length) return;

      // If document cannot fit on a single page with declaration included,
      // and we are placing references on page 0 while declaration is enabled:
      // Proactively move references to page 1 so page 2 has legitimate content (References + Declaration)
      // and page 0 never crowds out or clips declaration.
      if (
        sec.type === 'references' &&
        rightColIndex === 0 &&
        !fitsOnOnePage &&
        data.sections.declaration?.enabled
      ) {
        rightColIndex++;
        getOrCreatePage(rightColIndex);
        rightRemaining = maxContentHeight - declarationHeight;
      }

      const isAtomic = ATOMIC_SECTIONS.has(sec.type);

      if (isAtomic) {
        const colCap = rightColIndex === 0
          ? (maxContentHeight - measurements.headerHeight)
          : (maxContentHeight - declarationHeight);

        if (sec.totalHeight + 4 > rightRemaining && rightRemaining < colCap) {
          rightColIndex++;
          getOrCreatePage(rightColIndex);
          rightRemaining = maxContentHeight - declarationHeight;
        }
        const target = getOrCreatePage(rightColIndex);
        sectionStartedOnPage.set(sec.type, rightColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        rightRemaining -= sec.totalHeight;
      } else if (sec.items.length > 0 && rawItems.length === sec.items.length) {
        sec.items.forEach((item, idx) => {
          const hasStartedBefore = sectionStartedOnPage.has(sec.type);
          const headerCost = !hasStartedBefore ? sec.headerHeight : 0;
          const needed = item.height + headerCost;

          const colCap = rightColIndex === 0
            ? (maxContentHeight - measurements.headerHeight)
            : (maxContentHeight - declarationHeight);

          if (needed + 4 > rightRemaining && rightRemaining < colCap) {
            rightColIndex++;
            const newPage = getOrCreatePage(rightColIndex);
            rightRemaining = maxContentHeight - declarationHeight;
            if (hasStartedBefore) {
              if (!newPage.continuingSections) newPage.continuingSections = [];
              if (!newPage.continuingSections.includes(sec.type)) {
                newPage.continuingSections.push(sec.type);
              }
            }
          }

          const target = getOrCreatePage(rightColIndex);
          if (!sectionStartedOnPage.has(sec.type)) {
            sectionStartedOnPage.set(sec.type, rightColIndex);
          } else if (sectionStartedOnPage.get(sec.type) !== rightColIndex) {
            if (!target.continuingSections) target.continuingSections = [];
            if (!target.continuingSections.includes(sec.type)) {
              target.continuingSections.push(sec.type);
            }
          }

          (target.sections[sec.type as keyof ResumeSections] as any[]).push(rawItems[idx]);
          rightRemaining -= needed;
        });
        rightRemaining -= (sec.marginBottom > 0 ? sec.marginBottom : 6);
      } else {
        const colCap = rightColIndex === 0
          ? (maxContentHeight - measurements.headerHeight)
          : (maxContentHeight - declarationHeight);

        if (sec.totalHeight + 4 > rightRemaining && rightRemaining < colCap) {
          rightColIndex++;
          getOrCreatePage(rightColIndex);
          rightRemaining = maxContentHeight - declarationHeight;
        }
        const target = getOrCreatePage(rightColIndex);
        sectionStartedOnPage.set(sec.type, rightColIndex);
        (target.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        rightRemaining -= sec.totalHeight;
      }
    });

    if (data.sections.declaration?.enabled && pages.length > 0) {
      const lastPageIdx = pages.length - 1;
      const cap = lastPageIdx === 0
        ? (maxContentHeight - measurements.headerHeight)
        : maxContentHeight;
      const leftUsed = cap - leftRemaining;
      const rightUsed = cap - rightRemaining;
      const gridHeightOnLast = (leftColIndex === rightColIndex)
        ? Math.max(leftUsed, rightUsed)
        : (leftColIndex > rightColIndex ? leftUsed : rightUsed);
      const remainingOnLast = cap - gridHeightOnLast;

      if (declarationHeight + 8 <= remainingOnLast) {
        pages[lastPageIdx].sections.declaration = data.sections.declaration;
      } else {
        // Declaration cannot fit on current last page without clipping:
        // Proactively advance to next page so declaration NEVER clips!
        const nextPageIndex = lastPageIdx + 1;
        const newPage = getOrCreatePage(nextPageIndex);
        newPage.sections.declaration = data.sections.declaration;
      }

      for (let p = 0; p < pages.length - 1; p++) {
        pages[p].sections.declaration = undefined;
      }
    }

    return pages;
  }

  // -------------------------------------------------------------------------
  // Single-Column & Flow Developer Hybrid Partitioning
  // -------------------------------------------------------------------------
  const mainSections = measurements.sections.filter((s) => s.flowColIndex === undefined);
  const flowSecondarySections = measurements.sections.filter((s) => s.flowColIndex !== undefined);

  // Sections that should stay atomic and never split across pages with orphan headings
  // (Only inline lists / single paragraphs that cannot be meaningfully split per-item)
  const ATOMIC_SECTIONS = new Set(['languages', 'skills', 'summary', 'personalDetails', 'declaration', 'awards']);

  // Track the first page index where each section began
  const sectionStartedOnPage = new Map<string, number>();

  // 1. Process Main Flow Sections
  mainSections.forEach((sec) => {
    if (sec.type === 'unknown' || sec.type === 'summary') return;

    // Handle standalone atomic sections (personalDetails, declaration)
    if (sec.type === 'personalDetails') {
      if (sec.totalHeight + 6 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
        currentPageIndex++;
        getOrCreatePage(currentPageIndex);
        currentPageRemaining = maxContentHeight;
      }
      const targetPage = getOrCreatePage(currentPageIndex);
      targetPage.personalInfo.fatherName = data.personalInfo.fatherName;
      targetPage.personalInfo.dateOfBirth = data.personalInfo.dateOfBirth;
      targetPage.personalInfo.gender = data.personalInfo.gender;
      targetPage.personalInfo.maritalStatus = data.personalInfo.maritalStatus;
      targetPage.personalInfo.nationality = data.personalInfo.nationality;
      targetPage.personalInfo.languagesKnown = data.personalInfo.languagesKnown;
      targetPage.personalInfo.permanentAddress = data.personalInfo.permanentAddress;

      // If personalDetails moved to Page 2+, clear from earlier pages
      if (currentPageIndex > 0) {
        for (let p = 0; p < currentPageIndex; p++) {
          pages[p].personalInfo.fatherName = '';
          pages[p].personalInfo.dateOfBirth = '';
          pages[p].personalInfo.gender = '';
          pages[p].personalInfo.maritalStatus = '';
          pages[p].personalInfo.nationality = '';
          pages[p].personalInfo.languagesKnown = '';
          pages[p].personalInfo.permanentAddress = '';
        }
      }
      currentPageRemaining -= sec.totalHeight;
      return;
    }

    if (sec.type === 'declaration') {
      if (sec.totalHeight + 6 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
        currentPageIndex++;
        getOrCreatePage(currentPageIndex);
        currentPageRemaining = maxContentHeight;

        // If personalDetails was placed on the immediate previous page, move it to this final page
        // so that the declaration signature block is never an orphan alone on the final page
        const prevPage = pages[currentPageIndex - 1];
        if (prevPage && (prevPage.personalInfo.fatherName || prevPage.personalInfo.permanentAddress)) {
          const targetPage = getOrCreatePage(currentPageIndex);
          targetPage.personalInfo.fatherName = data.personalInfo.fatherName;
          targetPage.personalInfo.dateOfBirth = data.personalInfo.dateOfBirth;
          targetPage.personalInfo.gender = data.personalInfo.gender;
          targetPage.personalInfo.maritalStatus = data.personalInfo.maritalStatus;
          targetPage.personalInfo.nationality = data.personalInfo.nationality;
          targetPage.personalInfo.languagesKnown = data.personalInfo.languagesKnown;
          targetPage.personalInfo.permanentAddress = data.personalInfo.permanentAddress;

          prevPage.personalInfo.fatherName = '';
          prevPage.personalInfo.dateOfBirth = '';
          prevPage.personalInfo.gender = '';
          prevPage.personalInfo.maritalStatus = '';
          prevPage.personalInfo.nationality = '';
          prevPage.personalInfo.languagesKnown = '';
          prevPage.personalInfo.permanentAddress = '';
        }
      }
      const targetPage = getOrCreatePage(currentPageIndex);
      targetPage.sections.declaration = data.sections.declaration;
      for (let p = 0; p < currentPageIndex; p++) {
        pages[p].sections.declaration = undefined;
      }
      currentPageRemaining -= sec.totalHeight;
      return;
    }

    const rawItems = (data.sections[sec.type as keyof ResumeSections] || []) as any[];
    if (!rawItems.length) return;

    const isAtomic = ATOMIC_SECTIONS.has(sec.type);
    const secSpacing = sec.marginBottom > 0 ? sec.marginBottom : 8;

    if (isAtomic) {
      // If this atomic section does not fit with a slim 4px cushion, advance to next page
      if (sec.totalHeight + 4 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
        currentPageIndex++;
        getOrCreatePage(currentPageIndex);
        currentPageRemaining = maxContentHeight;
      }

      const targetPage = getOrCreatePage(currentPageIndex);
      (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
      // sec.totalHeight already contains measured marginTop and marginBottom
      currentPageRemaining -= sec.totalHeight;
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

          // Safety buffer: require 6px cushion for header + entry, 2px for continuation entry
          const safetyBuffer = (!hasStartedBefore && !isHeaderPlacedOnCurrentPage) ? 6 : 2;

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

        // Deduct section bottom margin so following section begins at true visual offset
        currentPageRemaining -= secSpacing;
      } else {
        if (sec.totalHeight + 4 > currentPageRemaining && currentPageRemaining < maxContentHeight) {
          currentPageIndex++;
          getOrCreatePage(currentPageIndex);
          currentPageRemaining = maxContentHeight;
        }

        const targetPage = getOrCreatePage(currentPageIndex);
        (targetPage.sections[sec.type as keyof ResumeSections] as any[]).push(...rawItems);
        currentPageRemaining -= sec.totalHeight;
      }
    }
  });

  // 2. Process Flow Developer 2-Column Secondary Grid (if present)
  if (flowSecondarySections.length > 0) {
    const col0Sections = flowSecondarySections.filter((s) => s.flowColIndex === 0);
    const col1Sections = flowSecondarySections.filter((s) => s.flowColIndex === 1);
    const col0Height = col0Sections.reduce((sum, s) => sum + s.totalHeight, 0);
    const col1Height = col1Sections.reduce((sum, s) => sum + s.totalHeight, 0);
    const secondaryGridVisualHeight = Math.max(col0Height, col1Height);

    // A. If the entire secondary 2-column block fits on current page, keep all together
    if (secondaryGridVisualHeight + 4 <= currentPageRemaining) {
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
          const pairH = Math.max(sA.totalHeight, sB.totalHeight);
          if (pairH + 4 <= currentPageRemaining && pairH > bestPairHeight) {
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
          if (sec.totalHeight + 4 <= currentPageRemaining && sec.totalHeight > bestSingleHeight) {
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

  if (data.sections.declaration?.enabled && pages.length > 0) {
    const lastPageIdx = pages.length - 1;
    const declSec = measurements.sections.find((s) => s.type === 'declaration');
    const declHeight = declSec ? Math.max(declSec.totalHeight, 130) : 135;

    if (currentPageRemaining < declHeight + 8 && currentPageRemaining < maxContentHeight) {
      const nextPageIndex = lastPageIdx + 1;
      const newPage = getOrCreatePage(nextPageIndex);
      newPage.sections.declaration = data.sections.declaration;
    } else {
      pages[lastPageIdx].sections.declaration = data.sections.declaration;
    }

    for (let p = 0; p < pages.length - 1; p++) {
      pages[p].sections.declaration = undefined;
    }
  }

  return pages;
}
