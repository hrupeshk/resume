import type { DocumentCategory, DocumentData } from './schema';
import { isValidCategory } from './schema';

const STORAGE_PREFIX = 'resume_builder_doc_';

/**
 * Returns the localStorage key for a specific category.
 */
function getStorageKey(category: DocumentCategory): string {
  return `${STORAGE_PREFIX}${category}`;
}

/**
 * Loads a saved document for a category from localStorage.
 * Returns null if not found or if stored data is corrupted.
 */
export function loadSavedDocument(category: DocumentCategory): DocumentData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getStorageKey(category));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.category) {
      return null;
    }

    if (!isValidCategory(parsed.category)) {
      return null;
    }

    return parsed as DocumentData;
  } catch (err) {
    console.warn('[Storage] Failed to read document from localStorage:', err);
    return null;
  }
}

/**
 * Saves a document to localStorage.
 * Updates the updatedAt timestamp automatically.
 */
export function saveDocument(doc: DocumentData): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const toSave: DocumentData = {
      ...doc,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(getStorageKey(doc.category), JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.error('[Storage] Failed to save document to localStorage:', err);
    return false;
  }
}

/**
 * Deletes the saved document for a specific category.
 */
export function clearSavedDocument(category: DocumentCategory): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(getStorageKey(category));
  } catch (err) {
    console.warn('[Storage] Failed to clear document from localStorage:', err);
  }
}
