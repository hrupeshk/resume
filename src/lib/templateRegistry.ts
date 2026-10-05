import React from 'react';
import type { DocumentCategory } from './schema';
import NovoresumeModern from '../components/templates/tech-resume/NovoresumeModern';
import FaangClassic from '../components/templates/tech-resume/FaangClassic';
import ExecutiveMba from '../components/templates/tech-resume/ExecutiveMba';
import FlowDeveloper from '../components/templates/tech-resume/FlowDeveloper';
import MinimalBlueTechResume from '../components/templates/tech-resume/MinimalBlueTechResume';
import CompactMonoTechResume from '../components/templates/tech-resume/CompactMonoTechResume';
import TraditionalMaroonBiodata from '../components/templates/marriage-biodata/TraditionalMaroonBiodata';
import IvoryGoldRoyalBiodata from '../components/templates/marriage-biodata/IvoryGoldRoyalBiodata';
import IndianClassicPrivateJob from '../components/templates/private-job/IndianClassicPrivateJob';
import HotelHospitalityPrivateJob from '../components/templates/private-job/HotelHospitalityPrivateJob';
import CommercialOperationsPrivateJob from '../components/templates/private-job/CommercialOperationsPrivateJob';

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
      name: 'Executive Leadership (MBA)',
      description: 'Dignified Harvard/Stanford layout with core competencies matrix, tailored for MBAs, PMs, and Directors.',
      badge: 'Popular',
      category: 'non_tech_resume',
      component: ExecutiveMba,
      supportsSpacingDensity: true,
    },
    {
      id: 'modern-split-01',
      name: 'Modern Professional',
      description: 'Versatile 2-column layout with clean skill chips, sidebar, and professional summary.',
      badge: 'Recommended',
      category: 'non_tech_resume',
      component: NovoresumeModern,
      supportsColumnSplit: true,
      supportsSpacingDensity: true,
    },
    {
      id: 'minimal-blue-01',
      name: 'Corporate Minimal',
      description: 'Clean typography with subtle corporate blue accents and clear section borders.',
      category: 'non_tech_resume',
      component: MinimalBlueTechResume,
      supportsSpacingDensity: true,
    },
    {
      id: 'compact-mono-01',
      name: 'Structured Compact',
      description: 'Dense, structured corporate layout with bulleted achievements and divider lines.',
      category: 'non_tech_resume',
      component: CompactMonoTechResume,
      supportsSpacingDensity: true,
    },
  ],
  private_job_resume: [
    {
      id: 'indian-classic-private-01',
      name: 'Classic Indian Private Job CV',
      description: 'Standard Indian private sector format with optional passport photo, personal particulars, education table, and formal declaration.',
      badge: 'Most Popular',
      category: 'private_job_resume',
      component: IndianClassicPrivateJob,
    },
    {
      id: 'hotel-hospitality-private-02',
      name: 'Hotel & Hospitality Service CV',
      description: 'Contemporary 2-column format with dark sidebar, photo frame, personal details, and customer service experience.',
      badge: 'Service Sector',
      category: 'private_job_resume',
      component: HotelHospitalityPrivateJob,
    },
    {
      id: 'commercial-operations-private-03',
      name: 'Commercial & Operations Standard',
      description: 'High-contrast single-column layout for logistics, office assistants, billing, and retail operations with declaration block.',
      badge: 'Operations',
      category: 'private_job_resume',
      component: CommercialOperationsPrivateJob,
    },
    {
      id: 'modern-split-01',
      name: 'Modern Corporate Split',
      description: 'Versatile 2-column layout with clean skill chips, sidebar, and professional summary.',
      category: 'private_job_resume',
      component: NovoresumeModern,
      supportsColumnSplit: true,
      supportsSpacingDensity: true,
    },
  ],
  marriage_biodata: [
    {
      id: 'traditional-maroon-01',
      name: 'Royal Maroon & Gold',
      description: 'Traditional Vedic layout with ornate double borders, sacred Devanagari invocation, and corner filigrees.',
      badge: 'Traditional',
      category: 'marriage_biodata',
      component: TraditionalMaroonBiodata,
    },
    {
      id: 'ivory-gold-royal-02',
      name: 'Ivory & Champagne Gold',
      description: 'Sophisticated modern-traditional layout with twin-column structure, Astro highlights, and royal gold trim.',
      badge: 'Popular',
      category: 'marriage_biodata',
      component: IvoryGoldRoyalBiodata,
    },
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
