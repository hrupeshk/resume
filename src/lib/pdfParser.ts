import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeDocument, ExperienceEntry, ProjectEntry, EducationEntry, CertificationEntry, VolunteerEntry } from './schema';

// Configure worker for in-browser PDF parsing
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface ParsedResumeResult {
  document: Partial<ResumeDocument>;
  detectedSections: string[];
  rawText: string;
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Extracts structured text lines from an uploaded PDF file,
 * intelligently detecting multi-column layouts so content is read
 * in true semantic reading order (e.g. Left column then Right column)
 * instead of jumbling columns horizontally.
 */
export async function extractLinesFromPdf(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const lines: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    const items: TextItem[] = (content.items as any[])
      .filter((item) => item.str && item.str.trim().length > 0)
      .map((item) => ({
        str: item.str,
        x: item.transform[4],
        // Invert Y so that top of page has smaller Y
        y: viewport.height - item.transform[5],
        width: item.width || 0,
        height: item.height || 10,
      }));

    // Detect 2-column split point in the body (between 40% and 65% of width)
    const bodyItems = items.filter((it) => it.y > viewport.height * 0.20);
    let splitX = 0;
    for (let checkX = Math.round(viewport.width * 0.42); checkX <= Math.round(viewport.width * 0.65); checkX += 4) {
      const crossing = bodyItems.filter((it) => it.x < checkX && (it.x + it.width) > checkX);
      if (crossing.length === 0) {
        const hasLeft = bodyItems.some((it) => it.x < checkX);
        const hasRight = bodyItems.some((it) => it.x >= checkX);
        if (hasLeft && hasRight) {
          splitX = checkX;
          break;
        }
      }
    }

    const groupItemsToLines = (itemList: TextItem[]): string[] => {
      const sorted = [...itemList].sort((a, b) => a.y - b.y || a.x - b.x);
      const lineGroups: TextItem[][] = [];
      for (const item of sorted) {
        const existing = lineGroups.find((g) => Math.abs(g[0].y - item.y) <= Math.max(3, item.height * 0.45));
        if (existing) {
          existing.push(item);
        } else {
          lineGroups.push([item]);
        }
      }
      return lineGroups
        .sort((a, b) => a[0].y - b[0].y)
        .map((g) => g.sort((a, b) => a.x - b.x).map((i) => i.str.trim()).join(' ').replace(/\s+/g, ' ').trim())
        .filter((l) => l.length > 0);
    };

    if (splitX > 0) {
      // 2-Column layout detected
      const headerLeft = items.filter((it) => it.y <= viewport.height * 0.20 && it.x < splitX);
      const headerRight = items.filter((it) => it.y <= viewport.height * 0.20 && it.x >= splitX);
      const leftBody = bodyItems.filter((it) => it.x < splitX);
      const rightBody = bodyItems.filter((it) => it.x >= splitX);

      lines.push(...groupItemsToLines(headerLeft));
      lines.push(...groupItemsToLines(headerRight));
      lines.push(...groupItemsToLines(leftBody));
      lines.push(...groupItemsToLines(rightBody));
    } else {
      lines.push(...groupItemsToLines(items));
    }
  }

  return lines;
}

/**
 * Extracts candidate headshot photo from PDF page 1 if present.
 * Renders page 1 to an offscreen canvas to decode images in worker,
 * then extracts portrait/square candidate images supporting both
 * modern PDF.js ImageBitmap and raw pixel buffers.
 */
export async function extractPhotoFromPdf(file: File): Promise<string | undefined> {
  if (typeof document === 'undefined') return undefined;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    if (pdf.numPages === 0) return undefined;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });

    // Render page 1 to an offscreen canvas to trigger image decoding
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = Math.round(viewport.width);
    offscreenCanvas.height = Math.round(viewport.height);
    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) return undefined;

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const candidates: { width: number; height: number; toDataUrl: () => string }[] = [];

    const inspectObject = (obj: any) => {
      if (!obj) return;
      // Case 1: ImageBitmap (modern pdfjs-dist)
      if (obj.bitmap && typeof obj.bitmap.width === 'number') {
        const w = obj.bitmap.width;
        const h = obj.bitmap.height;
        const aspect = w / h;
        if (w >= 60 && h >= 60 && aspect >= 0.5 && aspect <= 2.0) {
          candidates.push({
            width: w,
            height: h,
            toDataUrl: () => {
              const c = document.createElement('canvas');
              c.width = w;
              c.height = h;
              const cCtx = c.getContext('2d');
              if (cCtx) {
                cCtx.drawImage(obj.bitmap, 0, 0);
                return c.toDataURL('image/jpeg', 0.92);
              }
              return '';
            },
          });
        }
      }
      // Case 2: ImageData / Uint8ClampedArray pixel buffer
      else if (obj.data && obj.width && obj.height) {
        const w = obj.width;
        const h = obj.height;
        const aspect = w / h;
        if (w >= 60 && h >= 60 && aspect >= 0.5 && aspect <= 2.0) {
          candidates.push({
            width: w,
            height: h,
            toDataUrl: () => {
              const c = document.createElement('canvas');
              c.width = w;
              c.height = h;
              const cCtx = c.getContext('2d');
              if (!cCtx) return '';
              const imgData = cCtx.createImageData(w, h);
              if (obj.data.length === w * h * 3) {
                let src = 0;
                let dst = 0;
                for (let i = 0; i < w * h; i++) {
                  imgData.data[dst++] = obj.data[src++];
                  imgData.data[dst++] = obj.data[src++];
                  imgData.data[dst++] = obj.data[src++];
                  imgData.data[dst++] = 255;
                }
              } else if (obj.data.length === w * h * 4) {
                imgData.data.set(obj.data);
              } else {
                return '';
              }
              cCtx.putImageData(imgData, 0, 0);
              return c.toDataURL('image/jpeg', 0.92);
            },
          });
        }
      }
    };

    // Inspect page.objs
    if (page.objs) {
      try {
        for (const [, data] of (page.objs as any)) {
          inspectObject(data);
        }
      } catch {
        // Fallback
      }
    }

    // Inspect page.commonObjs
    if (page.commonObjs) {
      try {
        for (const [, data] of (page.commonObjs as any)) {
          inspectObject(data);
        }
      } catch {
        // Fallback
      }
    }

    if (candidates.length > 0) {
      // Sort to find candidate closest to 1:1 aspect ratio with high resolution
      candidates.sort((a, b) => {
        const diffA = Math.abs(1 - a.width / a.height);
        const diffB = Math.abs(1 - b.width / b.height);
        return diffA - diffB;
      });
      const dataUrl = candidates[0].toDataUrl();
      if (dataUrl) return dataUrl;
    }
  } catch (err) {
    console.warn('Could not extract photo from PDF:', err);
  }
  return undefined;
}

/**
 * Parses lines into structured resume fields.
 */
export async function parseResumePdf(file: File): Promise<ParsedResumeResult> {
  const lines = await extractLinesFromPdf(file);
  const photoUrl = await extractPhotoFromPdf(file);
  const detectedSections: string[] = [];

  const partialDoc: Partial<ResumeDocument> = {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      photoUrl: photoUrl || '',
      links: [],
    },
    summary: '',
    sections: {
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      volunteer: [],
      education: [],
      languages: [],
    },
  };

  // 1. Contact & Socials RegEx
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}|\b\d{10}\b)/;
  const linkedInRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const gitHubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;

  const links: { label: string; url: string }[] = [];

  // Extract contact info across all lines
  for (const line of lines) {
    const emailMatch = line.match(emailRegex);
    if (emailMatch && !partialDoc.personalInfo!.email) {
      partialDoc.personalInfo!.email = emailMatch[1];
    }

    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch && !partialDoc.personalInfo!.phone && phoneMatch[0].replace(/\D/g, '').length >= 10) {
      partialDoc.personalInfo!.phone = phoneMatch[0].trim();
    }

    const linkedInMatch = line.match(linkedInRegex);
    if (linkedInMatch && !links.some((l) => l.label === 'LinkedIn')) {
      links.push({ label: 'LinkedIn', url: `https://linkedin.com/in/${linkedInMatch[1]}` });
    }

    const gitHubMatch = line.match(gitHubRegex);
    if (gitHubMatch && !links.some((l) => l.label === 'GitHub')) {
      links.push({ label: 'GitHub', url: `https://github.com/${gitHubMatch[1]}` });
    }
  }

  partialDoc.personalInfo!.links = links;

  // 2. Section Partitioning
  type SectionType =
    | 'HEADER'
    | 'EXPERIENCE'
    | 'PROJECTS'
    | 'SKILLS'
    | 'CERTIFICATIONS'
    | 'VOLUNTEER'
    | 'EDUCATION'
    | 'LANGUAGES';

  const sectionHeaders: Record<string, SectionType> = {
    'work experience': 'EXPERIENCE',
    'experience': 'EXPERIENCE',
    'employment': 'EXPERIENCE',
    'personal projects': 'PROJECTS',
    'projects': 'PROJECTS',
    'skills': 'SKILLS',
    'technical skills': 'SKILLS',
    'certificates': 'CERTIFICATIONS',
    'certifications': 'CERTIFICATIONS',
    'volunteer experience': 'VOLUNTEER',
    'volunteer': 'VOLUNTEER',
    'leadership volunteer experience': 'VOLUNTEER',
    'education': 'EDUCATION',
    'languages': 'LANGUAGES',
  };

  const sections: Record<SectionType, string[]> = {
    HEADER: [],
    EXPERIENCE: [],
    PROJECTS: [],
    SKILLS: [],
    CERTIFICATIONS: [],
    VOLUNTEER: [],
    EDUCATION: [],
    LANGUAGES: [],
  };

  let currentSection: SectionType = 'HEADER';

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    if (sectionHeaders[lower]) {
      currentSection = sectionHeaders[lower];
      if (!detectedSections.includes(currentSection)) {
        detectedSections.push(currentSection);
      }
      continue;
    }
    sections[currentSection].push(line);
  }

  // 3. Parse Header: Name, Title, Summary, Location
  const contactLines = sections.HEADER;

  // Extract Name (first short line in header)
  for (const line of contactLines) {
    const trimmed = line.trim();
    if (
      trimmed.length > 1 &&
      trimmed.length < 40 &&
      !trimmed.match(emailRegex) &&
      !trimmed.match(phoneRegex) &&
      !trimmed.toLowerCase().includes('http') &&
      !trimmed.toLowerCase().includes('@') &&
      !partialDoc.personalInfo!.fullName
    ) {
      partialDoc.personalInfo!.fullName = trimmed;
      break;
    }
  }

  // Extract Title (next short line after name)
  for (const line of contactLines) {
    const trimmed = line.trim();
    if (
      trimmed !== partialDoc.personalInfo!.fullName &&
      trimmed.length > 2 &&
      trimmed.length < 50 &&
      !trimmed.match(emailRegex) &&
      !trimmed.match(phoneRegex) &&
      !trimmed.toLowerCase().includes('http') &&
      !trimmed.includes(',') &&
      !partialDoc.personalInfo!.title
    ) {
      partialDoc.personalInfo!.title = trimmed;
      break;
    }
  }

  // Extract Location (e.g. "Darbhanga, India" or "San Francisco, CA")
  for (const line of contactLines) {
    const trimmed = line.trim();
    if (
      trimmed.includes(',') &&
      !trimmed.endsWith('.') &&
      !trimmed.toLowerCase().includes(' and ') &&
      trimmed.length > 2 &&
      trimmed.length < 35 &&
      !trimmed.match(emailRegex) &&
      !trimmed.match(phoneRegex) &&
      !trimmed.toLowerCase().includes('http') &&
      !trimmed.toLowerCase().includes('using') &&
      !trimmed.toLowerCase().includes('developer') &&
      !partialDoc.personalInfo!.location
    ) {
      partialDoc.personalInfo!.location = trimmed;
      break;
    }
  }

  // Summary: Long descriptive sentences in header
  const summaryLines = contactLines.filter((l) => {
    const trimmed = l.trim();
    if (trimmed === partialDoc.personalInfo!.fullName) return false;
    if (trimmed === partialDoc.personalInfo!.title) return false;
    if (trimmed === partialDoc.personalInfo!.location) return false;
    if (trimmed.match(emailRegex) || trimmed.match(phoneRegex) || trimmed.match(linkedInRegex) || trimmed.match(gitHubRegex)) return false;
    return trimmed.length > 25;
  });
  if (summaryLines.length > 0) {
    partialDoc.summary = summaryLines.join(' ').replace(/\s+/g, ' ').trim();
  }

  // 4. Parse Work Experience
  const expLines = sections.EXPERIENCE;
  const expEntries: ExperienceEntry[] = [];
  let currentExp: Partial<ExperienceEntry> | null = null;

  for (const line of expLines) {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
    if (!cleanLine || cleanLine.toLowerCase() === 'responsibilities') continue;

    // Check if line looks like dates (e.g. 08/2025 - Present)
    const dateMatch = cleanLine.match(/(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Present|\d{1,2}\/\d{4}|\d{4})/i);

    if (dateMatch && currentExp) {
      currentExp.startDate = dateMatch[1];
      currentExp.endDate = dateMatch[2];
      continue;
    }

    if (!isBullet && cleanLine.length < 65 && !currentExp?.role) {
      currentExp = { role: cleanLine, company: '', bullets: [] };
    } else if (!isBullet && cleanLine.length < 65 && currentExp && !currentExp.company) {
      currentExp.company = cleanLine;
    } else {
      if (!currentExp) {
        currentExp = { role: 'Position', company: '', bullets: [] };
      }
      if (!currentExp.bullets) currentExp.bullets = [];
      currentExp.bullets.push(cleanLine);
    }
  }
  if (currentExp && (currentExp.role || currentExp.company)) {
    expEntries.push(currentExp as ExperienceEntry);
  }
  if (expEntries.length > 0) {
    partialDoc.sections!.experience = expEntries;
  }

  // 5. Parse Projects
  const projLines = sections.PROJECTS;
  const projEntries: ProjectEntry[] = [];
  let currentProj: Partial<ProjectEntry> | null = null;

  const isLikelyProjectTitle = (line: string, nextLine?: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.toLowerCase().startsWith('tech:')) return false;
    if (trimmed.endsWith('.')) return false;
    if (/^[a-z]/.test(trimmed)) return false;
    // Exclude bullet points or continuation clauses
    if (/^(built|designed|developed|implemented|created|integrated|managed|collaborated|engineered|coordinated|conducted|achieved|features|responsibilities|research|tech|and|with|for|using)\b/i.test(trimmed)) {
      return false;
    }
    if (trimmed.includes(',') && !trimmed.includes('–') && !trimmed.includes('-')) {
      return false;
    }
    if (trimmed.length > 75) return false;
    if (/\(\d{1,2}\/\d{4}.*?\)/.test(trimmed)) return true;
    if (nextLine && (nextLine.toLowerCase().startsWith('tech:') || /\(\d{1,2}\/\d{4}/.test(nextLine) || nextLine.startsWith('•') || nextLine.startsWith('-'))) {
      return true;
    }
    if (/\b(System|Platform|Website|Application|App|Tool|Portal|Engine)\b/i.test(trimmed)) {
      return true;
    }
    return false;
  };

  for (let i = 0; i < projLines.length; i++) {
    const line = projLines[i].replace(/^[•\-*]\s*/, '').trim();
    const nextLine = projLines[i + 1] ? projLines[i + 1].replace(/^[•\-*]\s*/, '').trim() : '';
    if (!line) continue;

    if (isLikelyProjectTitle(line, nextLine)) {
      if (currentProj && currentProj.name) {
        projEntries.push(currentProj as ProjectEntry);
      }
      let fullTitle = line;
      if (nextLine && !nextLine.toLowerCase().startsWith('tech:') && /\(\d{1,2}\/\d{4}/.test(nextLine)) {
        fullTitle += ' ' + nextLine;
        i++;
      }
      const cleanName = fullTitle.replace(/\s*\(\d{1,2}\/\d{4}.*?\)/, '').trim();
      currentProj = { name: cleanName, description: '' };
    } else if (!currentProj && line.length < 65 && !line.startsWith('•') && !line.startsWith('-')) {
      currentProj = { name: line, description: '' };
    } else if (currentProj) {
      if (line.toLowerCase().startsWith('tech:')) {
        const verbMatch = line.match(/\b(Developed|Built|Designed|Implemented|Created|Integrated|Engineered|Architected|Conducted)\b/);
        if (verbMatch && verbMatch.index && verbMatch.index > 5) {
          const techPart = line.substring(0, verbMatch.index).trim();
          const descPart = line.substring(verbMatch.index).trim();
          currentProj.description = (currentProj.description ? currentProj.description + '\n' : '') + techPart + '\n' + descPart;
        } else {
          currentProj.description = (currentProj.description ? currentProj.description + '\n' : '') + line;
        }
      } else {
        const prevDesc = currentProj.description ? currentProj.description.trim() : '';
        const prevEndsWithPunctuation = /[.!?:;]$/.test(prevDesc);
        if (!prevEndsWithPunctuation && prevDesc.length > 0 && !line.startsWith('•') && !line.startsWith('-')) {
          currentProj.description = prevDesc + ' ' + line;
        } else {
          currentProj.description = (currentProj.description ? currentProj.description + '\n' : '') + line;
        }
      }
    }
  }
  if (currentProj && currentProj.name) {
    projEntries.push(currentProj as ProjectEntry);
  }
  if (projEntries.length > 0) {
    partialDoc.sections!.projects = projEntries;
  }

  // 6. Parse Skills
  const skillLines = sections.SKILLS;
  const skillsSet = new Set<string>();
  const multiWordTech = ['Tailwind CSS', 'Node.js', 'REST API', 'REST APIs', 'Spring Boot', 'Next.js', 'Vue.js', 'Cloud Computing'];

  for (let line of skillLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes(',') || trimmed.includes('•') || trimmed.includes('|')) {
      const parts = trimmed.split(/[,•|·]|\s{2,}/);
      for (const part of parts) {
        const s = part.trim();
        if (s.length > 0 && s.length < 30) skillsSet.add(s);
      }
    } else {
      let working = trimmed;
      const extracted: string[] = [];
      for (const phrase of multiWordTech) {
        const regex = new RegExp(`\\b${phrase.replace('.', '\\.')}\\b`, 'gi');
        if (regex.test(working)) {
          extracted.push(phrase);
          working = working.replace(regex, ' ');
        }
      }
      const words = working.split(/\s+/).map((w) => w.trim()).filter((w) => w.length > 0);
      for (const w of words) skillsSet.add(w);
      for (const p of extracted) skillsSet.add(p);
    }
  }
  if (skillsSet.size > 0) {
    partialDoc.sections!.skills = Array.from(skillsSet);
  }

  // 7. Parse Education
  const eduLines = sections.EDUCATION;
  const eduEntries: EducationEntry[] = [];
  let currentEdu: Partial<EducationEntry> | null = null;

  for (const line of eduLines) {
    const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
    if (!cleanLine) continue;

    const dateMatch = cleanLine.match(/(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Present|\d{1,2}\/\d{4}|\d{4})/i);

    if (dateMatch && currentEdu) {
      currentEdu.startDate = dateMatch[1];
      currentEdu.endDate = dateMatch[2];
      continue;
    }

    if (cleanLine.toLowerCase().includes('grade:') && currentEdu) {
      currentEdu.grade = cleanLine.replace(/grade:\s*/i, '').trim();
      continue;
    }

    const isInst = /\b(University|College|Institute|School|Academy|Polytechnic|Vidya|Campus)\b/i.test(cleanLine);
    const isDeg = /\b(Bachelor|Master|B\.?Tech|M\.?Tech|B\.?S\.?|M\.?S\.?|B\.?Sc|M\.?Sc|Ph\.?D|Diploma|Degree|Secondary|Senior|Matriculation|CBSE|ICSE|Higher Secondary)\b/i.test(cleanLine);

    if (isInst) {
      if (currentEdu && !currentEdu.institution) {
        currentEdu.institution = cleanLine;
      } else {
        if (currentEdu && (currentEdu.institution || currentEdu.degree)) {
          eduEntries.push(currentEdu as EducationEntry);
        }
        currentEdu = { institution: cleanLine, degree: '' };
      }
    } else if (isDeg) {
      if (currentEdu && !currentEdu.degree) {
        currentEdu.degree = cleanLine;
      } else {
        if (currentEdu && (currentEdu.institution || currentEdu.degree)) {
          eduEntries.push(currentEdu as EducationEntry);
        }
        currentEdu = { institution: '', degree: cleanLine };
      }
    } else {
      if (!currentEdu) {
        currentEdu = { degree: cleanLine, institution: '' };
      } else if (!currentEdu.institution && currentEdu.degree) {
        currentEdu.institution = cleanLine;
      } else if (!currentEdu.degree && currentEdu.institution) {
        currentEdu.degree = cleanLine;
      } else {
        eduEntries.push(currentEdu as EducationEntry);
        currentEdu = { degree: cleanLine, institution: '' };
      }
    }
  }

  if (currentEdu && (currentEdu.degree || currentEdu.institution)) {
    eduEntries.push(currentEdu as EducationEntry);
  }
  if (eduEntries.length > 0) {
    partialDoc.sections!.education = eduEntries;
  }

  // 8. Parse Certifications
  // Avoid treating split description lines as separate bold certificate titles
  const certLines = sections.CERTIFICATIONS;
  const certEntries: CertificationEntry[] = [];
  let currentCert: CertificationEntry | null = null;

  const isCertHeader = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.includes('–') || trimmed.includes(' - ')) return true;
    if (/\b(certificate|certification|certified|course|specialization|nanodegree|license|diploma|nptel|coursera|udemy|aws|azure|gcp|distributed systems)\b/i.test(trimmed)) {
      return true;
    }
    return false;
  };

  for (const rawLine of certLines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isCertHeader(line)) {
      if (currentCert) certEntries.push(currentCert);
      if (line.includes('–') || line.includes(' - ')) {
        const [name, ...rest] = line.split(/[–-]/).map((s) => s.trim());
        currentCert = { name, issuer: rest.join(' - '), year: '', description: '' };
      } else {
        currentCert = { name: line, issuer: '', year: '', description: '' };
      }
    } else if (currentCert) {
      const prevDesc = currentCert.description ? currentCert.description.trim() : '';
      currentCert.description = prevDesc ? `${prevDesc} ${line}` : line;
    } else {
      currentCert = { name: line, issuer: '', year: '', description: '' };
    }
  }
  if (currentCert && currentCert.name) {
    certEntries.push(currentCert);
  }
  if (certEntries.length > 0) {
    partialDoc.sections!.certifications = certEntries;
  }

  // 8.5 Parse Volunteer Experience
  const volLines = sections.VOLUNTEER;
  const volEntries: VolunteerEntry[] = [];
  let currentVol: VolunteerEntry | null = null;

  for (const rawLine of volLines) {
    const line = rawLine.trim();
    if (!line) continue;

    const clean = line.replace(/^[•\-*]\s*/, '').trim();

    // Skip section header echoes like "Leadership & Volunteer Experience"
    if (
      clean.toLowerCase().includes('volunteer') &&
      clean.toLowerCase().includes('leadership')
    ) {
      continue;
    }
    if (/^(leadership|volunteer)\s+(&\s+)?experience$/i.test(clean)) {
      continue;
    }

    const dateMatch = clean.match(/\(?(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Present|\d{1,2}\/\d{4}|\d{4})\)?/i);

    if (dateMatch && currentVol) {
      currentVol.startDate = dateMatch[1];
      currentVol.endDate = dateMatch[2];
      continue;
    }

    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const isActionDesc = /^(Organized|Coordinated|Led|Managed|Assisted|Volunteered|Conducted|Helped|Participated|Supported|Contributed|Planned|Executed|Worked|Served|Actively)\b/i.test(clean);
    const isContinuationClause =
      /^[a-z]/.test(clean) ||
      /^(contributing|organizing|coordinating|helping|supporting|assisting|managing|providing|learning|participating|working)\b/i.test(clean);

    if (isBullet || isActionDesc || isContinuationClause || clean.length > 55) {
      if (currentVol) {
        const prev = currentVol.description ? currentVol.description.trim() : '';
        currentVol.description = prev ? `${prev}\n${clean}` : clean;
      }
    } else if (!currentVol) {
      currentVol = { organization: clean, role: '', description: '' };
    } else if (!currentVol.role && clean.length < 35 && !clean.includes('.') && !/^[a-z]/.test(clean)) {
      currentVol.role = clean;
    } else {
      if (currentVol.organization) {
        volEntries.push(currentVol);
      }
      currentVol = { organization: clean, role: '', description: '' };
    }
  }

  if (currentVol && currentVol.organization) {
    volEntries.push(currentVol);
  }
  if (volEntries.length > 0) {
    partialDoc.sections!.volunteer = volEntries;
  }

  // 9. Parse Languages
  const langLines = sections.LANGUAGES;
  const langEntries: { language: string; proficiency: string }[] = [];
  for (let i = 0; i < langLines.length; i++) {
    const line = langLines[i].trim();
    if (!line) continue;
    if (line.length < 25) {
      const next = langLines[i + 1] ? langLines[i + 1].trim() : '';
      if (next && (next.toLowerCase().includes('proficiency') || next.toLowerCase().includes('native') || next.toLowerCase().includes('fluent'))) {
        langEntries.push({ language: line, proficiency: next });
        i++;
      } else {
        langEntries.push({ language: line, proficiency: 'Professional' });
      }
    }
  }
  if (langEntries.length > 0) {
    partialDoc.sections!.languages = langEntries;
  }

  return {
    document: partialDoc,
    detectedSections,
    rawText: lines.join('\n'),
  };
}
