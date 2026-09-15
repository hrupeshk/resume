import React, { useState, useEffect, useRef } from 'react';
import type {
  DocumentCategory,
  ResumeDocument,
  ResumePersonalInfo,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  CertificationEntry,
} from '../../lib/schema';
import { loadSavedDocument, saveDocument, clearSavedDocument } from '../../lib/storage';
import { getInitialDocument, createEmptyTechResume, sampleTechResume } from '../../lib/defaults';
import { getNextTemplateId } from '../../lib/templateRegistry';
import { exportToPdf } from '../../lib/pdf';
import { parseResumePdf } from '../../lib/pdfParser';

import StepNavigator, { type StepItem } from '../forms/StepNavigator';
import PersonalForm from '../forms/PersonalForm';
import EducationForm from '../forms/EducationForm';
import ExperienceForm from '../forms/ExperienceForm';
import SkillsProjectsForm from '../forms/SkillsProjectsForm';
import PreviewPane from '../preview/PreviewPane';

interface ResumeBuilderProps {
  category: DocumentCategory;
}

const BUILDER_STEPS: StepItem[] = [
  { id: 'personal', title: 'Personal Info', description: 'Contact & Summary' },
  { id: 'experience', title: 'Experience', description: 'Roles & Impact' },
  { id: 'education', title: 'Education', description: 'Degrees & Schools' },
  { id: 'skills_projects', title: 'Skills & Projects', description: 'Stack & Work' },
];

export default function ResumeBuilder({ category }: ResumeBuilderProps) {
  // Initialize state from localStorage if available, or fall back to default
  const [doc, setDoc] = useState<ResumeDocument>(() => {
    const saved = loadSavedDocument(category);
    if (saved && saved.category === category) {
      return saved as ResumeDocument;
    }
    return getInitialDocument(category) as ResumeDocument;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastShortcutTimeRef = useRef<number>(0);

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

  // Section update handlers
  const handleUpdatePersonalInfo = (personalInfo: ResumePersonalInfo) => {
    setDoc((prev) => ({ ...prev, personalInfo }));
  };

  const handleUpdateSummary = (summary: string) => {
    setDoc((prev) => ({ ...prev, summary }));
  };

  const handleUpdateEducation = (education: EducationEntry[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, education },
    }));
  };

  const handleUpdateExperience = (experience: ExperienceEntry[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, experience },
    }));
  };

  const handleUpdateSkills = (skills: string[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, skills },
    }));
  };

  const handleUpdateProjects = (projects: ProjectEntry[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, projects },
    }));
  };

  const handleUpdateCertifications = (certifications: CertificationEntry[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, certifications },
    }));
  };

  const handleUpdateLanguages = (languages: any[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, languages },
    }));
  };

  const handleUpdateVolunteer = (volunteer: any[]) => {
    setDoc((prev) => ({
      ...prev,
      sections: { ...prev.sections, volunteer },
    }));
  };

  // Template handlers (zero data loss guarantee)
  const handleSelectTemplate = (templateId: string) => {
    setDoc((prev) => ({ ...prev, templateId }));
  };

  const handleCycleTemplate = () => {
    const nextId = getNextTemplateId(doc.category, doc.templateId);
    setDoc((prev) => ({ ...prev, templateId: nextId }));
  };

  // Reset / Sample handlers
  const handleClearAll = () => {
    if (window.confirm('Clear all fields and start with a blank document?')) {
      clearSavedDocument(category);
      setDoc(createEmptyTechResume());
    }
  };

  const handleLoadSample = () => {
    setDoc(sampleTechResume);
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
      setImportStatus('Extracting content from PDF...');
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

  // PDF Export
  const handleExportPdf = () => {
    const nameSlug = (doc.personalInfo.fullName || 'Resume')
      .trim()
      .replace(/\s+/g, '_');
    exportToPdf(`${nameSlug}_Resume.pdf`);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col print:bg-white print:min-h-0 print:block">
      {/* Toast Notification for PDF Import */}
      {importStatus && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-4 py-2 rounded-md shadow-lg border border-neutral-700 text-xs flex items-center gap-2 animate-bounce">
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
            Resume Builder <span className="font-mono text-mute text-xs">({category})</span>
          </h1>
        </div>

        {/* Center: View Mode Segmented Control */}
        <div className="flex items-center bg-canvas border border-hairline rounded-sm p-0.5 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
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
                ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
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
                ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
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
          {/* Import Resume Button */}
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[#008c9e] bg-teal-50/70 text-[#008c9e] hover:bg-teal-100 text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            title="Upload any existing resume PDF to automatically populate all form fields"
          >
            <svg className="w-3.5 h-3.5 text-[#008c9e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{isImporting ? 'Importing...' : 'Import PDF'}</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-mute">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            {saveStatus === 'saved' ? 'Autosaved' : 'Saving...'}
          </span>

          <div className="h-4 w-px bg-hairline hidden sm:block" />

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
        className={`flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 print:bg-white print:p-0 print:m-0 print:max-w-none print:w-full print:block ${
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
                steps={BUILDER_STEPS}
                currentStepIndex={currentStepIndex}
                onSelectStep={setCurrentStepIndex}
              />

              {/* Active Step Form View */}
              <div className="min-h-[380px]">
                {currentStepIndex === 0 && (
                  <PersonalForm
                    personalInfo={doc.personalInfo}
                    summary={doc.summary}
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
                    languages={doc.sections.languages || []}
                    volunteer={doc.sections.volunteer || []}
                    onChangeSkills={handleUpdateSkills}
                    onChangeProjects={handleUpdateProjects}
                    onChangeCertifications={handleUpdateCertifications}
                    onChangeLanguages={handleUpdateLanguages}
                    onChangeVolunteer={handleUpdateVolunteer}
                  />
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
                  Step {currentStepIndex + 1} of {BUILDER_STEPS.length}
                </span>

                {currentStepIndex < BUILDER_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStepIndex((i) => Math.min(i + 1, BUILDER_STEPS.length - 1))
                    }
                    className="px-4 py-2 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="px-4 py-2 rounded-sm bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Download Resume PDF ✓
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Live Synchronous Preview & Template Cycling */}
          {viewMode !== 'editor' && (
            <div
              className={`${
                viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7 xl:col-span-6'
              } lg:sticky lg:top-18 lg:h-[calc(100vh-5.5rem)] flex flex-col transition-all duration-300`}
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
                onPrint={handleExportPdf}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
