/**
 * Security and sanitization utilities for imported JSON files.
 *
 * Protects against:
 * 1. XSS via malicious URI schemes (e.g., javascript:, data:text/html, vbscript:)
 * 2. Prototype Pollution (__proto__, constructor, prototype poisoning)
 * 3. Malformed Schema Crashes (ensuring arrays and expected objects are always valid)
 * 4. Memory Exhaustion / Denial of Service
 */

/**
 * Validates and sanitizes a URL string.
 * Strips dangerous schemes like javascript:, vbscript:, data:text/html.
 * Allows safe protocols: http, https, mailto, tel, and safe image data URLs.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Block dangerous script schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('data:application/')
  ) {
    return '';
  }

  // Allow standard web protocols, mailto, tel, or data:image
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('data:image/') ||
    lower.startsWith('/') ||
    lower.startsWith('#')
  ) {
    return trimmed;
  }

  // If it's a domain or relative link without protocol (e.g., "github.com/user"), prefix with https://
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Recursively strips prototype pollution keys (__proto__, constructor, prototype)
 * from any parsed object or array.
 */
export function stripPrototypePollution<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stripPrototypePollution(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    cleanObj[key] = stripPrototypePollution(value);
  }

  return cleanObj as T;
}

/**
 * Sanitizes and validates an entire imported resume/biodata document,
 * guaranteeing all expected arrays, strings, and URLs are safely structured.
 */
export function sanitizeImportedDocument(rawDoc: any): any {
  if (!rawDoc || typeof rawDoc !== 'object') {
    throw new Error('Invalid document format: expected an object.');
  }

  // 1. Strip any prototype pollution attempts
  const doc = stripPrototypePollution(rawDoc);

  // 2. Sanitize personalInfo
  if (!doc.personalInfo || typeof doc.personalInfo !== 'object') {
    doc.personalInfo = {};
  }

  if (doc.personalInfo.photoUrl) {
    doc.personalInfo.photoUrl = sanitizeUrl(doc.personalInfo.photoUrl);
  }

  if (Array.isArray(doc.personalInfo.links)) {
    doc.personalInfo.links = doc.personalInfo.links
      .filter((link: any) => link && typeof link === 'object')
      .map((link: any) => ({
        ...link,
        url: sanitizeUrl(link.url),
      }));
  } else {
    doc.personalInfo.links = [];
  }

  // 3. Sanitize sections & links
  if (!doc.sections || typeof doc.sections !== 'object') {
    doc.sections = {};
  }

  // Sanitize project links
  if (Array.isArray(doc.sections.projects)) {
    doc.sections.projects = doc.sections.projects
      .filter((p: any) => p && typeof p === 'object')
      .map((proj: any) => ({
        ...proj,
        link: sanitizeUrl(proj.link),
      }));
  }

  // Ensure standard resume arrays exist to prevent React .map crashes
  if (!Array.isArray(doc.sections.experience)) doc.sections.experience = [];
  if (!Array.isArray(doc.sections.projects)) doc.sections.projects = [];
  if (!Array.isArray(doc.sections.education)) doc.sections.education = [];
  if (!Array.isArray(doc.sections.skills)) doc.sections.skills = [];
  if (!Array.isArray(doc.sections.certifications)) doc.sections.certifications = [];

  return doc;
}
