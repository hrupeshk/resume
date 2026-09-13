/**
 * TypeScript types and models matching Section 3 of ROADMAP.md
 * Source of truth for Resume & Biodata Builder data.
 */

// Category Definitions
export type ResumeCategory = 'tech_resume' | 'non_tech_resume' | 'private_job_resume';
export type BiodataCategory = 'marriage_biodata';
export type DocumentCategory = ResumeCategory | BiodataCategory;

export const RESUME_CATEGORIES: ResumeCategory[] = [
  'tech_resume',
  'non_tech_resume',
  'private_job_resume',
];

export const VALID_CATEGORIES: DocumentCategory[] = [
  ...RESUME_CATEGORIES,
  'marriage_biodata',
];

export function isValidCategory(category: string): category is DocumentCategory {
  return VALID_CATEGORIES.includes(category as DocumentCategory);
}

// Base Document Envelope
export interface BaseDocument {
  id: string;
  category: DocumentCategory;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 1. Resume Schema (tech_resume, non_tech_resume, private_job_resume)
// ---------------------------------------------------------------------------

export interface SocialLink {
  label: string;
  url: string;
}

export interface ResumePersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone: string;
  location: string;
  photoUrl?: string;
  links: SocialLink[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  link?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface ReferenceEntry {
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: string;
}

export interface VolunteerEntry {
  organization: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumeSections {
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  projects?: ProjectEntry[];
  certifications?: CertificationEntry[];
  references?: ReferenceEntry[];
  languages?: LanguageEntry[];
  volunteer?: VolunteerEntry[];
}

export interface ResumeDocument extends BaseDocument {
  category: ResumeCategory;
  personalInfo: ResumePersonalInfo;
  summary: string;
  sections: ResumeSections;
}

// ---------------------------------------------------------------------------
// 2. Marriage Biodata Schema (marriage_biodata)
// ---------------------------------------------------------------------------

export interface BiodataPersonalInfo {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  height: string;
  complexion: string;
  diet: string;
  photoUrl?: string;
  phone: string;
  email: string;
}

export interface BiodataEducationEntry {
  degree: string;
  institution: string;
}

export interface BiodataOccupation {
  designation: string;
  company: string;
  income: string;
}

export interface SiblingEntry {
  name: string;
  relation: string;
  occupation: string;
}

export interface BiodataFamily {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: SiblingEntry[];
  nativePlace: string;
}

export interface BiodataHoroscope {
  gothra: string;
  nakshatra: string;
  rashi: string;
  manglik: string;
}

export interface BiodataContact {
  address: string;
  referencePhone: string;
}

export interface BiodataSections {
  education: BiodataEducationEntry[];
  occupation: BiodataOccupation;
  family: BiodataFamily;
  horoscope: BiodataHoroscope;
  contact: BiodataContact;
  partnerPreferences: string;
}

export interface BiodataDocument extends BaseDocument {
  category: BiodataCategory;
  personalInfo: BiodataPersonalInfo;
  sections: BiodataSections;
}

// ---------------------------------------------------------------------------
// Unified Document Type & Type Guards
// ---------------------------------------------------------------------------

export type DocumentData = ResumeDocument | BiodataDocument;

export function isResumeDocument(doc: DocumentData): doc is ResumeDocument {
  return doc.category !== 'marriage_biodata';
}

export function isBiodataDocument(doc: DocumentData): doc is BiodataDocument {
  return doc.category === 'marriage_biodata';
}
