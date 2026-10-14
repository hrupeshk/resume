import { toPng, toBlob } from 'html-to-image';
import type { BiodataDocument } from './schema';

export interface ImageExportOptions {
  pixelRatio?: number;
  quality?: number;
}

/**
 * Finds the primary A4 sheet container in the document preview.
 */
export function getPreviewSheetElement(): HTMLElement | null {
  if (typeof document === 'undefined') return null;

  // Try finding by explicit data attribute on the A4 page container
  const pageContainer = document.querySelector('[data-page-container="1"]') as HTMLElement | null;
  if (pageContainer) return pageContainer;

  // Fallback to resume page sheet
  const sheet = document.querySelector('.resume-page-sheet') as HTMLElement | null;
  if (sheet) return sheet;

  // Fallback to wrapper
  const wrapper = document.querySelector('[data-resume-sheet="1"]') as HTMLElement | null;
  if (wrapper) return wrapper;

  return null;
}

/**
 * Captures the given DOM element (or default preview sheet) to a high-resolution PNG Data URL.
 * Default pixelRatio: 2 gives razor-sharp 1588x2246 px resolution (ideal for WhatsApp & print).
 */
export async function captureElementToPng(
  targetElement?: HTMLElement | null,
  options?: ImageExportOptions
): Promise<string> {
  const element = targetElement || getPreviewSheetElement();
  if (!element) {
    throw new Error('Preview document element could not be found for image capture.');
  }

  const pixelRatio = options?.pixelRatio ?? 2;

  // Capture with html-to-image
  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: true,
    filter: (node) => {
      // Exclude screen-only badges or buttons
      if (node instanceof HTMLElement && node.classList.contains('no-print')) {
        return false;
      }
      return true;
    },
  });

  return dataUrl;
}

/**
 * Captures the target element directly to a PNG Blob.
 */
export async function captureElementToBlob(
  targetElement?: HTMLElement | null,
  options?: ImageExportOptions
): Promise<Blob> {
  const element = targetElement || getPreviewSheetElement();
  if (!element) {
    throw new Error('Preview document element could not be found for image capture.');
  }

  const pixelRatio = options?.pixelRatio ?? 2;

  const blob = await toBlob(element, {
    pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: true,
    filter: (node) => {
      if (node instanceof HTMLElement && node.classList.contains('no-print')) {
        return false;
      }
      return true;
    },
  });

  if (!blob) {
    throw new Error('Failed to generate PNG blob from preview element.');
  }

  return blob;
}

/**
 * Triggers a browser file download of a PNG image.
 */
export function triggerImageDownload(dataUrlOrBlob: string | Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const url =
    typeof dataUrlOrBlob === 'string'
      ? dataUrlOrBlob
      : URL.createObjectURL(dataUrlOrBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof dataUrlOrBlob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * High-level function to export the active document preview to a PNG file and trigger download.
 */
export async function exportToPng(filename = 'Marriage_Biodata.png'): Promise<string> {
  const dataUrl = await captureElementToPng(undefined, { pixelRatio: 2 });
  triggerImageDownload(dataUrl, filename);
  return dataUrl;
}

/**
 * Generates a traditional, polite matrimonial text summary formatted for WhatsApp messages.
 */
export function generateMatrimonialTextSummary(doc: BiodataDocument): string {
  const { personalInfo, sections } = doc;
  const lines: string[] = [];

  const name = personalInfo.fullName.trim() || 'Candidate';
  lines.push(`🌸 *Marriage Biodata: ${name}* 🌸\n`);

  if (personalInfo.dateOfBirth || personalInfo.timeOfBirth || personalInfo.placeOfBirth) {
    const dobParts = [
      personalInfo.dateOfBirth,
      personalInfo.timeOfBirth ? `at ${personalInfo.timeOfBirth}` : '',
      personalInfo.placeOfBirth ? `in ${personalInfo.placeOfBirth}` : '',
    ].filter(Boolean);
    lines.push(`• *Date of Birth:* ${dobParts.join(' ')}`);
  }

  if (personalInfo.height) {
    lines.push(`• *Height:* ${personalInfo.height}`);
  }

  if (personalInfo.complexion) {
    lines.push(`• *Complexion:* ${personalInfo.complexion}`);
  }

  if (personalInfo.diet) {
    lines.push(`• *Diet:* ${personalInfo.diet}`);
  }

  if (personalInfo.religion || personalInfo.caste) {
    const religionStr = [
      personalInfo.religion,
      personalInfo.caste ? `(${personalInfo.caste}${personalInfo.subCaste ? ` - ${personalInfo.subCaste}` : ''})` : '',
    ].filter(Boolean).join(' ');
    lines.push(`• *Community:* ${religionStr}`);
  }

  // Education
  const eduList = sections.education?.filter((e) => e.degree.trim() || e.institution.trim());
  if (eduList && eduList.length > 0) {
    const eduSummary = eduList.map((e) => [e.degree, e.institution].filter(Boolean).join(' - ')).join(' | ');
    lines.push(`• *Education:* ${eduSummary}`);
  }

  // Occupation
  if (sections.occupation?.designation || sections.occupation?.company) {
    const occParts = [
      sections.occupation.designation,
      sections.occupation.company ? `at ${sections.occupation.company}` : '',
      sections.occupation.income ? `(Annual Income: ${sections.occupation.income})` : '',
    ].filter(Boolean);
    lines.push(`• *Occupation:* ${occParts.join(' ')}`);
  }

  // Family
  if (sections.family?.fatherName || sections.family?.motherName || sections.family?.nativePlace) {
    if (sections.family.fatherName) {
      lines.push(`• *Father:* ${sections.family.fatherName}${sections.family.fatherOccupation ? ` (${sections.family.fatherOccupation})` : ''}`);
    }
    if (sections.family.motherName) {
      lines.push(`• *Mother:* ${sections.family.motherName}${sections.family.motherOccupation ? ` (${sections.family.motherOccupation})` : ''}`);
    }
    if (sections.family.nativePlace) {
      lines.push(`• *Native Place:* ${sections.family.nativePlace}`);
    }
  }

  // Horoscope
  if (sections.horoscope?.rashi || sections.horoscope?.nakshatra || sections.horoscope?.gothra || sections.horoscope?.manglik) {
    const astroParts = [
      sections.horoscope.rashi ? `Rashi: ${sections.horoscope.rashi}` : '',
      sections.horoscope.nakshatra ? `Nakshatra: ${sections.horoscope.nakshatra}` : '',
      sections.horoscope.gothra ? `Gothra: ${sections.horoscope.gothra}` : '',
      sections.horoscope.manglik ? `Manglik: ${sections.horoscope.manglik}` : '',
    ].filter(Boolean);
    lines.push(`• *Kundali/Astro:* ${astroParts.join(', ')}`);
  }

  // Contact
  if (personalInfo.phone || personalInfo.email || sections.contact?.referencePhone) {
    const contactParts = [
      personalInfo.phone ? `Mob: ${personalInfo.phone}` : '',
      sections.contact?.referencePhone ? `Family Ref: ${sections.contact.referencePhone}` : '',
      personalInfo.email ? `Email: ${personalInfo.email}` : '',
    ].filter(Boolean);
    lines.push(`• *Contact:* ${contactParts.join(' | ')}`);
  }

  lines.push('\n_Created using Free Marriage Biodata Builder (Resume.com)_');

  return lines.join('\n');
}

/**
 * Shares the biodata image directly via Web Share API if supported by the browser (mobile WhatsApp share),
 * or provides fallback URL for WhatsApp Web / direct message.
 */
export async function shareBiodataToWhatsApp(
  doc: BiodataDocument,
  filename: string
): Promise<{ success: boolean; sharedDirectly: boolean; message: string }> {
  const summaryText = generateMatrimonialTextSummary(doc);

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      const blob = await captureElementToBlob();
      const file = new File([blob], filename.endsWith('.png') ? filename : `${filename}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${doc.personalInfo.fullName || 'Candidate'} - Marriage Biodata`,
          text: summaryText,
        });
        return {
          success: true,
          sharedDirectly: true,
          message: 'Shared successfully via native share sheet!',
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          sharedDirectly: false,
          message: 'Share dismissed by user.',
        };
      }
      console.warn('Native file share failed, falling back to WhatsApp link:', err);
    }
  }

  // Desktop or non-supported browser fallback:
  // Open WhatsApp Web with summary text and auto-download the image
  const encodedText = encodeURIComponent(summaryText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

  // Also auto-trigger image download so the user can easily attach it in WhatsApp Web
  try {
    await exportToPng(filename);
  } catch (err) {
    console.warn('Image auto-download during WhatsApp fallback encountered an issue:', err);
  }

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return {
    success: true,
    sharedDirectly: false,
    message: 'Opened WhatsApp with matrimonial summary and downloaded high-resolution image to your device.',
  };
}
