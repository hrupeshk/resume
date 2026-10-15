import React, { useState, useEffect, useRef } from 'react';
import type {
  DocumentCategory,
  DocumentData,
  ResumeDocument,
  ResumePersonalInfo,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  CertificationEntry,
  AwardEntry,
  DeclarationSection,
  BiodataDocument,
  BiodataPersonalInfo,
  BiodataEducationEntry,
  BiodataOccupation,
  BiodataFamily,
  BiodataHoroscope,
  BiodataContact,
} from '../../lib/schema';
import { isBiodataDocument, isResumeDocument } from '../../lib/schema';
import { loadSavedDocument, saveDocument, clearSavedDocument } from '../../lib/storage';
import { getInitialDocument, createEmptyResume, createEmptyBiodata, getSampleDocument } from '../../lib/defaults';
import { getNextTemplateId, getTemplateById } from '../../lib/templateRegistry';
import { exportToPdf } from '../../lib/pdf';
import { exportToPng } from '../../lib/imageExport';
import { exportResumeToDocx } from '../../lib/docxExport';
import { parseResumePdf } from '../../lib/pdfParser';
import { compressAndResizeImage } from '../../lib/imageUtils';
import { sanitizeImportedDocument } from '../../lib/jsonSecurity';
import {
  INDIAN_RESUME_LANGUAGES,
  type IndianResumeLanguage,
  isLanguageSupported,
  getDefaultDeclarationText,
  isDefaultDeclaration,
} from '../../lib/translations';

import StepNavigator, { type StepItem } from '../forms/StepNavigator';
import PersonalForm from '../forms/PersonalForm';
import EducationForm from '../forms/EducationForm';
import ExperienceForm from '../forms/ExperienceForm';
import SkillsProjectsForm from '../forms/SkillsProjectsForm';
import BiodataPersonalForm from '../forms/biodata/BiodataPersonalForm';
import BiodataEducationOccupationForm from '../forms/biodata/BiodataEducationOccupationForm';
import BiodataFamilyForm from '../forms/biodata/BiodataFamilyForm';
import BiodataHoroscopePreferencesForm from '../forms/biodata/BiodataHoroscopePreferencesForm';
import PreviewPane from '../preview/PreviewPane';
import BiodataShareModal from '../modals/BiodataShareModal';
import ThemeToggle from '../navigation/ThemeToggle';

interface ResumeBuilderProps {
  category: DocumentCategory;
  initialTemplateId?: string;
}

const categoryLabels: Record<string, string> = {
  tech_resume: 'Tech Resume',
  non_tech_resume: 'Corporate & Non-Tech Resume',
  private_job_resume: 'Private Job Resume',
  marriage_biodata: 'Marriage Biodata',
};

export default function ResumeBuilder({ category, initialTemplateId }: ResumeBuilderProps) {
  const isBio = category === 'marriage_biodata';

  const builderSteps: StepItem[] = isBio
    ? [
        { id: 'bio_personal', title: 'Personal Info', description: 'Birth & Identity' },
        { id: 'bio_education', title: 'Education & Career', description: 'Degrees & Profession' },
        { id: 'bio_family', title: 'Family Details', description: 'Parents & Siblings' },
        { id: 'bio_horoscope', title: 'Horoscope & Contact', description: 'Kundali & Residence' },
      ]
    : [
        { id: 'personal', title: 'Personal Info', description: 'Contact & Summary' },
        { id: 'experience', title: 'Experience', description: 'Roles & Impact' },
        { id: 'education', title: 'Education', description: 'Degrees & Schools' },
        {
          id: 'skills_projects',
          title: category === 'tech_resume' ? 'Skills & Projects' : 'Skills & References',
          description: category === 'tech_resume' ? 'Stack & Work' : 'Skills & Credentials',
        },
      ];

  // Initialize state from localStorage if available, or fall back to default
  const [doc, setDoc] = useState<DocumentData>(() => {
    const saved = loadSavedDocument(category);
    const initialDoc = saved && saved.category === category ? saved : getInitialDocument(category);

    // Check for explicit template parameter from prop or URL query parameter
    let targetTemplateId = initialTemplateId;
    if (typeof window !== 'undefined' && !targetTemplateId) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTemplate = urlParams.get('template');
      if (urlTemplate) {
        targetTemplateId = urlTemplate;
      }
    }

    if (targetTemplateId && getTemplateById(category, targetTemplateId)) {
      return { ...initialDoc, templateId: targetTemplateId };
    }
    return initialDoc;
  });

  // Synchronize template if URL query parameter ?template=... or initialTemplateId is provided
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTemplate = initialTemplateId || urlParams.get('template');
    if (requestedTemplate && getTemplateById(category, requestedTemplate)) {
      setDoc((prev) => {
        if (prev.templateId !== requestedTemplate) {
          const updated = { ...prev, templateId: requestedTemplate };
          saveDocument(updated);
          return updated;
        }
        return prev;
      });
    }
  }, [category, initialTemplateId]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const lastShortcutTimeRef = useRef<number>(0);
  const [undoBackup, setUndoBackup] = useState<DocumentData | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Universal keyboard shortcut Alt+P (Left Alt or Right Alt / AltGr), Mac Option+P, or Ctrl+\
  // capture: true prevents Edge and Chrome from consuming Alt+P before our app receives it
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Support 'p' in all environments: physical KeyP, 'p', 'P', or 'π' (Mac Option+P)
      const isP =
        e.code === 'KeyP' ||
        e.key.toLowerCase() === 'p' ||
        e.key === 'π' ||
        e.key === 'Π' ||
        e.keyCode === 80;

      // Detect Alt: Left Alt (AltLeft), Right Alt (AltRight / AltGraph), or e.altKey
      const hasAlt =
        Boolean(e.altKey) ||
        e.code === 'AltRight' ||
        e.code === 'AltLeft' ||
        (typeof e.getModifierState === 'function' &&
          (e.getModifierState('Alt') || e.getModifierState('AltGraph')));

      // Support Ctrl+\ as alternative
      const isCtrlSlash = (e.ctrlKey || e.metaKey) && (e.key === '\\' || e.code === 'Backslash');

      if ((hasAlt && isP) || isCtrlSlash) {
        // Prevent double toggles from rapid key repeat or browser event synthesizer
        const now = Date.now();
        if (now - lastShortcutTimeRef.current < 250) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        lastShortcutTimeRef.current = now;

        e.preventDefault();
        e.stopImmediatePropagation();
        setViewMode((prev) => (prev === 'preview' ? 'split' : 'preview'));
        return;
      } else if (e.key === 'Escape') {
        setViewMode((prev) => (prev === 'preview' ? 'split' : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  // Autosave to localStorage on doc updates
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveDocument(doc);
      setSaveStatus('saved');
    }, 250);

    return () => clearTimeout(timer);
  }, [doc]);

  // Listen for direct photo uploads from the canvas
  useEffect(() => {
    const handlePhotoEvent = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setDoc((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, photoUrl: custom.detail },
        }));
      }
    };
    window.addEventListener('resume:update-photo', handlePhotoEvent);
    return () => window.removeEventListener('resume:update-photo', handlePhotoEvent);
  }, []);

  // Auto-compress legacy oversized photo in localStorage on mount (> 60KB)
  useEffect(() => {
    if (doc.personalInfo?.photoUrl && doc.personalInfo.photoUrl.length > 60000) {
      compressAndResizeImage(doc.personalInfo.photoUrl, 500, 0.85)
        .then((optimized) => {
          setDoc((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, photoUrl: optimized },
          }));
        })
        .catch((err) => console.warn('Could not auto-compress legacy photo in localStorage:', err));
    }
  }, []);

  // Section update handlers for Biodata
  const handleUpdateBiodataPersonal = (personalInfo: BiodataPersonalInfo) => {
    setDoc((prev) => ({ ...(prev as BiodataDocument), personalInfo }));
  };

  const handleUpdateBiodataEducation = (education: BiodataEducationEntry[]) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, education },
      };
    });
  };

  const handleUpdateBiodataOccupation = (occupation: BiodataOccupation) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, occupation },
      };
    });
  };

  const handleUpdateBiodataFamily = (family: BiodataFamily) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, family },
      };
    });
  };

  const handleUpdateBiodataHoroscope = (horoscope: BiodataHoroscope) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, horoscope },
      };
    });
  };

  const handleUpdateBiodataContact = (contact: BiodataContact) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, contact },
      };
    });
  };

  const handleUpdatePartnerPreferences = (partnerPreferences: string) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, partnerPreferences },
      };
    });
  };

  const handleUpdateBiodataAchievements = (achievements: string[]) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, achievements },
      };
    });
  };

  const handleUpdateBiodataHobbies = (hobbies: string[]) => {
    setDoc((prev) => {
      const b = prev as BiodataDocument;
      return {
        ...b,
        sections: { ...b.sections, hobbies },
      };
    });
  };

  // Section update handlers for Resume
  const handleUpdatePersonalInfo = (personalInfo: ResumePersonalInfo) => {
    setDoc((prev) => ({ ...(prev as ResumeDocument), personalInfo }));
  };

  const handleUpdateSummary = (summary: string) => {
    setDoc((prev) => ({ ...(prev as ResumeDocument), summary }));
  };

  const handleUpdateEducation = (education: EducationEntry[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, education },
      };
    });
  };

  const handleUpdateExperience = (experience: ExperienceEntry[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, experience },
      };
    });
  };

  const handleUpdateSkills = (skills: string[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, skills },
      };
    });
  };

  const handleUpdateProjects = (projects: ProjectEntry[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, projects },
      };
    });
  };

  const handleUpdateCertifications = (certifications: CertificationEntry[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, certifications },
      };
    });
  };

  const handleUpdateAwards = (awards: AwardEntry[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, awards },
      };
    });
  };

  const handleUpdateLanguages = (languages: any[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, languages },
      };
    });
  };

  const handleUpdateVolunteer = (volunteer: any[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, volunteer },
      };
    });
  };

  const handleUpdateReferences = (references: any[]) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, references },
      };
    });
  };

  const handleUpdateDeclaration = (declaration: DeclarationSection) => {
    setDoc((prev) => {
      const r = prev as ResumeDocument;
      return {
        ...r,
        sections: { ...r.sections, declaration },
      };
    });
  };

  // Template handlers (zero data loss guarantee)
  const handleSelectTemplate = (templateId: string) => {
    setDoc((prev) => ({ ...prev, templateId }));
  };

  const handleCycleTemplate = () => {
    const nextId = getNextTemplateId(doc.category, doc.templateId);
    setDoc((prev) => ({ ...prev, templateId: nextId }));
  };

  // Language handler for Private Job Resume & Marriage Biodata
  const handleSelectLanguage = (language: IndianResumeLanguage) => {
    setDoc((prev) => {
      // If private job resume with declaration, update default declaration text if unmodified
      if (!isBiodataDocument(prev) && prev.sections.declaration) {
        const currentDeclText = prev.sections.declaration.text;
        const isDefault = !currentDeclText || isDefaultDeclaration(currentDeclText);
        if (isDefault) {
          return {
            ...prev,
            language,
            sections: {
              ...prev.sections,
              declaration: {
                ...prev.sections.declaration,
                text: getDefaultDeclarationText(language),
              },
            },
          };
        }
      }
      return { ...prev, language };
    });
  };

  // Reset / Sample handlers with Undo Safeguard
  const handleClearAll = () => {
    if (isBiodataDocument(doc)) {
      const hasBioContent = Boolean(
        doc.personalInfo.fullName.trim() ||
        doc.personalInfo.dateOfBirth.trim() ||
        doc.sections.education.length > 0 ||
        doc.sections.occupation?.designation?.trim() ||
        doc.sections.family?.fatherName?.trim() ||
        doc.sections.horoscope?.gothra?.trim()
      );

      if (!hasBioContent) return;

      if (window.confirm('Clear all fields and start with a blank biodata? (You can Undo if needed)')) {
        setUndoBackup({ ...doc });
        clearSavedDocument(category);
        setDoc(createEmptyBiodata());

        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => {
          setUndoBackup(null);
        }, 10000);
      }
      return;
    }

    // Check if resume document has any meaningful content before prompting
    const hasContent = Boolean(
      doc.personalInfo.fullName.trim() ||
      doc.personalInfo.email.trim() ||
      doc.personalInfo.phone.trim() ||
      doc.summary.trim() ||
      (doc.sections.experience && doc.sections.experience.length > 0) ||
      (doc.sections.education && doc.sections.education.length > 0) ||
      (doc.sections.skills && doc.sections.skills.length > 0) ||
      (doc.sections.projects && doc.sections.projects.length > 0)
    );

    if (!hasContent) return;

    if (window.confirm('Clear all fields and start with a blank document? (You can Undo if needed)')) {
      // Snapshot current document to memory before wiping
      setUndoBackup({ ...doc });
      clearSavedDocument(category);
      setDoc(createEmptyResume(category as any));

      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => {
        setUndoBackup(null);
      }, 10000);
    }
  };

  const handleUndoClear = () => {
    if (undoBackup) {
      setDoc(undoBackup);
      saveDocument(undoBackup);
      setUndoBackup(null);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  };

  const handleLoadSample = () => {
    setDoc(getSampleDocument(category));
  };

  // PDF Resume Importer
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    try {
      setIsImporting(true);
      setImportStatus('Extracting content from PDF…');
      const result = await parseResumePdf(file);

      // Deep merge parsed document into current document
      setDoc((prev) => {
        const next = { ...prev };

        if (result.document.personalInfo) {
          const incoming = result.document.personalInfo;
          next.personalInfo = {
            ...next.personalInfo,
            ...incoming,
            fullName: incoming.fullName || next.personalInfo.fullName,
            title: incoming.title || next.personalInfo.title,
            email: incoming.email || next.personalInfo.email,
            phone: incoming.phone || next.personalInfo.phone,
            location: incoming.location || next.personalInfo.location,
            photoUrl: incoming.photoUrl ? incoming.photoUrl : next.personalInfo.photoUrl,
            links: incoming.links?.length ? incoming.links : next.personalInfo.links,
          };
        }

        if (result.document.summary) {
          next.summary = result.document.summary;
        }

        if (result.document.sections) {
          next.sections = {
            ...next.sections,
            experience: result.document.sections.experience?.length ? result.document.sections.experience : next.sections.experience,
            projects: result.document.sections.projects?.length ? result.document.sections.projects : next.sections.projects,
            skills: result.document.sections.skills?.length ? result.document.sections.skills : next.sections.skills,
            education: result.document.sections.education?.length ? result.document.sections.education : next.sections.education,
            certifications: result.document.sections.certifications?.length ? result.document.sections.certifications : next.sections.certifications,
            volunteer: result.document.sections.volunteer?.length ? result.document.sections.volunteer : next.sections.volunteer,
            languages: result.document.sections.languages?.length ? result.document.sections.languages : next.sections.languages,
          };
        }

        return next;
      });

      const sectionCount = result.detectedSections.length;
      setImportStatus(`✓ Imported successfully! (${sectionCount} sections detected)`);
      setTimeout(() => {
        setImportStatus(null);
        setIsImporting(false);
      }, 4000);
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      alert('Could not parse resume from this PDF. Error: ' + (err.message || 'Unknown error'));
      setIsImporting(false);
      setImportStatus(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => {
        window.focus();
        document.body.focus();
      }, 50);
    }
  };

  // JSON Data Backup & Restore (Full Data Ownership & Offline Portability)
  const handleExportJson = () => {
    const isBio = doc.category === 'marriage_biodata';
    const fallback = isBio ? 'Biodata' : 'Resume';
    const nameSlug = (doc.personalInfo.fullName || fallback)
      .trim()
      .replace(/\s+/g, '_');
    const jsonString = JSON.stringify(doc, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nameSlug}_${doc.category}_backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guard against large file denial-of-service / memory exhaustion
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please upload a valid document backup JSON.');
      if (jsonInputRef.current) jsonInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawJson = event.target?.result as string;
        const parsed = JSON.parse(rawJson);
        if (!parsed || typeof parsed !== 'object' || !parsed.personalInfo) {
          alert('Invalid backup file. Please select a valid document backup JSON.');
          return;
        }

        // Sanitize imported document: strip prototype pollution, neutralize malicious URLs, ensure arrays
        const safeDoc = sanitizeImportedDocument(parsed);

        // Auto-compress legacy oversized photos in restored backup (> 60KB)
        if (safeDoc.personalInfo.photoUrl && safeDoc.personalInfo.photoUrl.length > 60000) {
          try {
            safeDoc.personalInfo.photoUrl = await compressAndResizeImage(safeDoc.personalInfo.photoUrl, 500, 0.85);
          } catch (compressErr) {
            console.warn('Failed to auto-compress restored photo:', compressErr);
          }
        }

        // Snapshot current doc for undo
        setUndoBackup({ ...doc });
        setDoc({
          ...safeDoc,
          category: doc.category, // maintain current category route
        });
        setImportStatus('✓ Backup data restored successfully!');
        setTimeout(() => setImportStatus(null), 3500);
      } catch (err: any) {
        alert('Could not read backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  // PDF Export
  const handleExportPdf = () => {
    const isBio = doc.category === 'marriage_biodata';
    const fallback = isBio ? 'Biodata' : 'Resume';
    const suffix = isBio ? 'Marriage_Biodata' : 'Resume';
    const nameSlug = (doc.personalInfo.fullName || fallback)
      .trim()
      .replace(/\s+/g, '_');
    exportToPdf(`${nameSlug}_${suffix}.pdf`);
  };

  // High-Resolution PNG Image Export
  const handleExportPng = async () => {
    const isBio = doc.category === 'marriage_biodata';
    const fallback = isBio ? 'Biodata' : 'Resume';
    const suffix = isBio ? 'Marriage_Biodata' : 'Resume';
    const nameSlug = (doc.personalInfo.fullName || fallback)
      .trim()
      .replace(/\s+/g, '_');
    try {
      await exportToPng(`${nameSlug}_${suffix}.png`);
    } catch (err: any) {
      console.error('PNG export error:', err);
      alert('Could not export PNG image: ' + (err.message || 'Unknown error'));
    }
  };

  // DOCX Word Export (Tech, Non-Tech, and Private Job Resumes only)
  const handleExportDocx = async () => {
    if (doc.category === 'marriage_biodata') {
      alert('DOCX export is available for tech and non-tech resume categories only.');
      return;
    }
    const fallback = doc.category === 'private_job_resume' ? 'Biodata_CV' : 'Resume';
    const suffix = doc.category === 'private_job_resume' ? 'Job_CV' : 'Resume';
    const nameSlug = (doc.personalInfo.fullName || fallback)
      .trim()
      .replace(/\s+/g, '_');
    try {
      await exportResumeToDocx(doc, `${nameSlug}_${suffix}.docx`);
    } catch (err: any) {
      console.error('DOCX export error:', err);
      alert('Could not export DOCX document: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col print:!bg-white print:min-h-0 print:block">
      {/* Toast Notification for Undo Safeguard */}
      {undoBackup && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-4 py-2.5 rounded-md shadow-2xl border border-neutral-700 text-xs flex items-center gap-3 animate-bounce"
        >
          <span className="text-neutral-200">
            {category === 'marriage_biodata' ? 'Biodata' : 'Resume'} cleared.
          </span>
          <button
            type="button"
            onClick={handleUndoClear}
            className="px-2.5 py-1 bg-white text-black font-semibold rounded-xs text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
          >
            Undo (Restore)
          </button>
          <button
            type="button"
            onClick={() => {
              setUndoBackup(null);
              if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
            }}
            className="text-neutral-400 hover:text-white text-xs cursor-pointer ml-1 p-0.5"
            aria-label="Dismiss undo notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toast Notification for PDF Import */}
      {importStatus && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-4 py-2 rounded-md shadow-lg border border-neutral-700 text-xs flex items-center gap-2 animate-bounce"
        >
          {isImporting ? (
            <svg className="w-4 h-4 animate-spin text-teal-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <span className="text-emerald-400 font-bold">✓</span>
          )}
          <span>{importStatus}</span>
        </div>
      )}

      {/* Chrome Navigation Header */}
      <header id="builder-header" className="no-print border-b border-hairline bg-canvas-elevated px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            className="text-xs sm:text-sm font-semibold tracking-tight text-ink hover:text-body transition-colors"
          >
            ← Home
          </a>
          <span className="text-hairline">/</span>
          <h1 className="text-xs sm:text-sm font-medium text-ink">
            {categoryLabels[category] || 'Resume Builder'}
          </h1>
          {isLanguageSupported(category) && (
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-hairline">
              <label htmlFor="builder-header-lang" className="text-xs font-medium text-mute hidden sm:inline">
                Language:
              </label>
              <select
                id="builder-header-lang"
                value={doc.language || 'en'}
                onChange={(e) => handleSelectLanguage(e.target.value as IndianResumeLanguage)}
                className="text-xs px-2 py-1 rounded-sm border border-hairline bg-canvas text-ink font-semibold focus:outline-none focus:border-ink cursor-pointer"
                title="Select resume language (English or 12 Indian Languages)"
              >
                {INDIAN_RESUME_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} {lang.code !== 'en' ? `(${lang.nativeName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Center: View Mode Segmented Control */}
        <div className="flex items-center bg-canvas border border-hairline rounded-sm p-0.5 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                : 'text-mute hover:text-ink'
            }`}
            title="Focus on form editor"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                : 'text-mute hover:text-ink'
            }`}
            title="Side-by-side editing and preview (Alt+P)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                : 'text-mute hover:text-ink'
            }`}
            title="Full preview mode with expanded canvas (Alt+P)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Full Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Import Resume Button (resumes only) */}
          {category !== 'marriage_biodata' && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf,.pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[#008c9e] bg-teal-50/70 dark:bg-teal-950/40 text-[#008c9e] dark:text-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                title="Upload any existing resume PDF to automatically populate all form fields"
              >
                <svg className="w-3.5 h-3.5 text-[#008c9e] dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{isImporting ? 'Importing…' : 'Import PDF'}</span>
              </button>
            </>
          )}

          {/* JSON Backup & Restore (Universal Data Ownership & Unlimited Offline Resumes) */}
          <input
            type="file"
            ref={jsonInputRef}
            accept=".json,application/json"
            onChange={handleJsonUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleExportJson}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-mute hover:text-ink transition-colors cursor-pointer"
            title="Download full JSON backup of your document to keep unlimited resumes offline"
          >
            <span>Backup JSON</span>
          </button>
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-mute hover:text-ink transition-colors cursor-pointer"
            title="Restore a previously downloaded JSON backup file"
          >
            <span>Restore</span>
          </button>

          <span
            role="status"
            aria-live="polite"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-mute"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            {saveStatus === 'saved' ? 'Autosaved' : 'Saving…'}
          </span>

          {category === 'marriage_biodata' && (
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Share high-resolution biodata on WhatsApp, download PNG image, or scan QR code"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.761.815 2.79.815 3.183 0 5.769-2.587 5.77-5.768.001-3.181-2.585-5.799-5.768-5.799zm8.567 5.769c-.002 4.743-3.858 8.598-8.599 8.598-1.503 0-2.912-.39-4.143-1.071l-4.596 1.205 1.229-4.482c-.752-1.285-1.189-2.776-1.19-4.25.002-4.742 3.859-8.599 8.6-8.599 4.742 0 8.599 3.857 8.599 8.599z"/>
              </svg>
              <span>Share / WhatsApp</span>
            </button>
          )}

          <div className="h-4 w-px bg-hairline hidden sm:block" />

          {/* Theme Toggle (Three-way mode inside builder) */}
          <ThemeToggle compact={true} />

          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-mute hover:text-ink transition-colors cursor-pointer"
            title="Load realistic sample data"
          >
            Sample
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-mute hover:text-error transition-colors cursor-pointer"
            title="Clear all fields"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Main Dual-Column Builder Workspace */}
      <main
        className={`flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 print:!bg-white print:p-0 print:m-0 print:max-w-none print:w-full print:block ${
          viewMode === 'preview' ? 'max-w-5xl' : viewMode === 'editor' ? 'max-w-4xl' : 'max-w-7xl'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form Editor & Steps */}
          {viewMode !== 'preview' && (
            <div
              id="builder-editor-column"
              className={`${
                viewMode === 'editor' ? 'lg:col-span-12' : 'lg:col-span-5 xl:col-span-6'
              } bg-canvas-elevated rounded-md border border-hairline p-4 sm:p-6 shadow-xs space-y-6 transition-all duration-300`}
            >
              {/* Step Navigation Bar */}
              <StepNavigator
                steps={builderSteps}
                currentStepIndex={currentStepIndex}
                onSelectStep={setCurrentStepIndex}
              />

              {/* Active Step Form View */}
              <div className="min-h-[380px]">
                {isBiodataDocument(doc) ? (
                  <>
                    {currentStepIndex === 0 && (
                      <BiodataPersonalForm
                        personalInfo={doc.personalInfo}
                        onChangePersonalInfo={handleUpdateBiodataPersonal}
                      />
                    )}

                    {currentStepIndex === 1 && (
                      <BiodataEducationOccupationForm
                        education={doc.sections.education || []}
                        occupation={
                          doc.sections.occupation || { designation: '', company: '', income: '' }
                        }
                        achievements={doc.sections.achievements || []}
                        onChangeEducation={handleUpdateBiodataEducation}
                        onChangeOccupation={handleUpdateBiodataOccupation}
                        onChangeAchievements={handleUpdateBiodataAchievements}
                      />
                    )}

                    {currentStepIndex === 2 && (
                      <BiodataFamilyForm
                        family={
                          doc.sections.family || {
                            fatherName: '',
                            fatherOccupation: '',
                            motherName: '',
                            motherOccupation: '',
                            siblings: [],
                            relatives: [],
                            nativePlace: '',
                          }
                        }
                        onChangeFamily={handleUpdateBiodataFamily}
                      />
                    )}

                    {currentStepIndex === 3 && (
                      <BiodataHoroscopePreferencesForm
                        horoscope={
                          doc.sections.horoscope || {
                            gothra: '',
                            nakshatra: '',
                            rashi: '',
                            manglik: '',
                            kuldevta: '',
                          }
                        }
                        contact={
                          doc.sections.contact || { address: '', referencePhone: '' }
                        }
                        partnerPreferences={doc.sections.partnerPreferences || ''}
                        hobbies={doc.sections.hobbies || []}
                        onChangeHoroscope={handleUpdateBiodataHoroscope}
                        onChangeContact={handleUpdateBiodataContact}
                        onChangePartnerPreferences={handleUpdatePartnerPreferences}
                        onChangeHobbies={handleUpdateBiodataHobbies}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {currentStepIndex === 0 && (
                      <PersonalForm
                        personalInfo={doc.personalInfo}
                        summary={doc.summary}
                        category={doc.category}
                        onChangePersonalInfo={handleUpdatePersonalInfo}
                        onChangeSummary={handleUpdateSummary}
                      />
                    )}

                    {currentStepIndex === 1 && (
                      <ExperienceForm
                        experience={doc.sections.experience}
                        onChangeExperience={handleUpdateExperience}
                      />
                    )}

                    {currentStepIndex === 2 && (
                      <EducationForm
                        education={doc.sections.education}
                        onChangeEducation={handleUpdateEducation}
                      />
                    )}

                    {currentStepIndex === 3 && (
                      <SkillsProjectsForm
                        skills={doc.sections.skills}
                        projects={doc.sections.projects || []}
                        certifications={doc.sections.certifications || []}
                        awards={doc.sections.awards || []}
                        languages={doc.sections.languages || []}
                        volunteer={doc.sections.volunteer || []}
                        references={doc.sections.references || []}
                        declaration={doc.sections.declaration}
                        category={doc.category}
                        onChangeSkills={handleUpdateSkills}
                        onChangeProjects={handleUpdateProjects}
                        onChangeCertifications={handleUpdateCertifications}
                        onChangeAwards={handleUpdateAwards}
                        onChangeLanguages={handleUpdateLanguages}
                        onChangeVolunteer={handleUpdateVolunteer}
                        onChangeReferences={handleUpdateReferences}
                        onChangeDeclaration={handleUpdateDeclaration}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Step Navigation Buttons (Prev / Next) */}
              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
                  className="px-4 py-2 rounded-sm border border-hairline text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <span className="text-xs font-mono text-mute">
                  Step {currentStepIndex + 1} of {builderSteps.length}
                </span>

                {currentStepIndex < builderSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStepIndex((i) => Math.min(i + 1, builderSteps.length - 1))
                    }
                    className="px-4 py-2 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Next Step →
                  </button>
                ) : doc.category === 'marriage_biodata' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="px-3.5 py-2 rounded-sm bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.761.815 2.79.815 3.183 0 5.769-2.587 5.77-5.768.001-3.181-2.585-5.799-5.768-5.799zm8.567 5.769c-.002 4.743-3.858 8.598-8.599 8.598-1.503 0-2.912-.39-4.143-1.071l-4.596 1.205 1.229-4.482c-.752-1.285-1.189-2.776-1.19-4.25.002-4.742 3.859-8.599 8.6-8.599 4.742 0 8.599 3.857 8.599 8.599z"/>
                      </svg>
                      <span>Share / WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="px-3.5 py-2 rounded-sm bg-[#800020] hover:bg-[#66001a] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                    >
                      Download PDF ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportDocx}
                      className="px-3.5 py-2 rounded-sm border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                      title="Download editable Microsoft Word (.docx) file"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                      <span>Download Word (.docx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="px-4 py-2 rounded-sm bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                    >
                      Download Resume PDF ✓
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Live Synchronous Preview & Template Cycling */}
          {viewMode !== 'editor' && (
            <div
              className={`${
                viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7 xl:col-span-6'
              } lg:sticky lg:top-18 lg:h-[calc(100vh-5.5rem)] flex flex-col transition-all duration-300 print:!w-full print:!block print:!static print:!p-0 print:!m-0 print:!bg-white`}
            >
              {viewMode === 'preview' && (
                <div className="mb-2 flex items-center justify-between no-print px-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-sm text-xs font-semibold shadow-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>← Reopen Form Editor</span>
                  </button>
                  <span className="text-[11px] text-mute font-mono">
                    Full Preview Mode • Press <kbd className="px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 rounded text-[10px]">Alt+P</kbd> to return to Split View
                  </span>
                </div>
              )}
              <PreviewPane
                data={doc}
                onCycleTemplate={handleCycleTemplate}
                onSelectTemplate={handleSelectTemplate}
                onSelectLanguage={handleSelectLanguage}
                onPrint={handleExportPdf}
                onOpenShare={() => setIsShareModalOpen(true)}
                onExportPng={handleExportPng}
                onExportDocx={doc.category !== 'marriage_biodata' ? handleExportDocx : undefined}
              />
            </div>
          )}
        </div>
      </main>

      {/* Marriage Biodata Export & Share Modal */}
      {isBiodataDocument(doc) && (
        <BiodataShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          doc={doc}
          templateName={getTemplateById(doc.category, doc.templateId)?.name}
        />
      )}
    </div>
  );
}
