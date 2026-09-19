import React from 'react';
import type { DocumentCategory } from './schema';
import NovoresumeModern from '../components/templates/tech-resume/NovoresumeModern';
import FaangClassic from '../components/templates/tech-resume/FaangClassic';
import ExecutiveMba from '../components/templates/tech-resume/ExecutiveMba';
import FlowDeveloper from '../components/templates/tech-resume/FlowDeveloper';
import MinimalBlueTechResume from '../components/templates/tech-resume/MinimalBlueTechResume';
import CompactMonoTechResume from '../components/templates/tech-resume/CompactMonoTechResume';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  badge?: string;
  category: DocumentCategory;
  component: React.ComponentType<{ data: any }>;
  supportsColumnSplit?: boolean;
  supportsSpacingDensity?: boolean;
}

export const templates: Record<DocumentCategory, TemplateDefinition[]> = {
  tech_resume: [
    {
      id: 'modern-split-01',
      name: 'Novorésumé Modern',
      description: 'Signature 2-column tech layout with dark skill chips, project tech callouts, and clean sidebar.',
      badge: 'Popular',
      category: 'tech_resume',
      component: NovoresumeModern,
      supportsColumnSplit: true,
      supportsSpacingDensity: true,
    },
    {
      id: 'faang-classic-01',
      name: 'FAANG Classic (SWE)',
      description: 'Single-column Overleaf Jake’s standard used by Google, Meta, and Amazon engineers. 100% ATS score.',
      badge: 'ATS Gold',
      category: 'tech_resume',
      component: FaangClassic,
      supportsColumnSplit: false,
      supportsSpacingDensity: true,
    },
    {
      id: 'executive-mba-01',
      name: 'Executive MBA',
      description: 'Dignified Harvard/Stanford layout with core competencies matrix, tailored for MBAs, PMs, and Directors.',
      badge: 'Leadership',
      category: 'tech_resume',
      component: ExecutiveMba,
      supportsSpacingDensity: true,
    },
    {
      id: 'flow-developer-01',
      name: 'Flow Developer',
      description: 'Contemporary tech lead hybrid with inline tech-badge pills, external link indicators, and clean spacing.',
      badge: 'Modern',
      category: 'tech_resume',
      component: FlowDeveloper,
      supportsColumnSplit: true,
      supportsSpacingDensity: true,
    },
    {
      id: 'compact-mono-01',
      name: 'Compact Mono',
      description: 'Dense engineering monospace layout with bracketed tags and divider lines.',
      category: 'tech_resume',
      component: CompactMonoTechResume,
      supportsSpacingDensity: true,
    },
    {
      id: 'minimal-blue-01',
      name: 'Minimal Blue',
      description: 'Clean typography with subtle blue accents.',
      category: 'tech_resume',
      component: MinimalBlueTechResume,
      supportsSpacingDensity: true,
    },
  ],
  non_tech_resume: [
    {
      id: 'executive-mba-01',
      name: 'Executive Standard',
      description: 'Dignified Harvard/Stanford layout with core competencies matrix.',
      category: 'non_tech_resume',
      component: ExecutiveMba,
    },
    {
      id: 'compact-mono-01',
      name: 'Compact Mono',
      description: 'Dense, structured corporate layout.',
      category: 'non_tech_resume',
      component: CompactMonoTechResume,
    },
  ],
  private_job_resume: [
    {
      id: 'modern-split-01',
      name: 'Modern Professional',
      description: 'Versatile 2-column layout with clean skill chips.',
      category: 'private_job_resume',
      component: NovoresumeModern,
    },
    {
      id: 'executive-mba-01',
      name: 'Executive Standard',
      description: 'Clean, professional corporate layout.',
      category: 'private_job_resume',
      component: ExecutiveMba,
    },
  ],
  marriage_biodata: [
    // Will be populated in Phase 2
  ],
};

/**
 * Retrieves the registered templates for a given document category.
 */
export function getTemplatesForCategory(category: DocumentCategory): TemplateDefinition[] {
  return templates[category] || [];
}

/**
 * Finds a template definition by ID for a given category.
 * Falls back to the first available template if the ID is not found.
 */
export function getTemplateById(category: DocumentCategory, templateId: string): TemplateDefinition | undefined {
  const categoryTemplates = getTemplatesForCategory(category);
  return categoryTemplates.find((t) => t.id === templateId) || categoryTemplates[0];
}

/**
 * Gets the next template ID in the list to support cyclic "Next Template" / "Refresh" switching.
 */
export function getNextTemplateId(category: DocumentCategory, currentTemplateId: string): string {
  const list = getTemplatesForCategory(category);
  if (list.length <= 1) return currentTemplateId;

  const currentIndex = list.findIndex((t) => t.id === currentTemplateId);
  const nextIndex = (currentIndex + 1) % list.length;
  return list[nextIndex].id;
}
