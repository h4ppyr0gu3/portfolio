import LZString from 'lz-string';
import { normalizeDocument, migrateLegacyElements, seedFromSiteCv } from './cvModel.js';

export const STORAGE_KEY = 'cvDocument';
export const LEGACY_KEY = 'cvElements';
export const HASH_PREFIX = '#cv=';
/** Soft warn threshold for share URLs (browsers vary; keep links usable). */
export const SHARE_WARN_LENGTH = 6000;

export function readLocal(siteCv) {
  if (typeof window === 'undefined') return seedFromSiteCv(siteCv);

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeDocument(JSON.parse(raw));
    }

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateLegacyElements(JSON.parse(legacy), siteCv);
      writeLocal(migrated);
      localStorage.removeItem(LEGACY_KEY);
      return migrated;
    }
  } catch {
    /* fall through */
  }

  return seedFromSiteCv(siteCv);
}

export function writeLocal(doc) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch (err) {
    console.warn('Could not save CV to localStorage', err);
  }
}

export function clearLocal() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function encodeShareHash(doc) {
  const json = JSON.stringify(doc);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return `${HASH_PREFIX}${compressed}`;
}

export function decodeShareHash(hash) {
  if (!hash || typeof hash !== 'string') return null;
  let payload = hash;
  if (payload.startsWith('#')) payload = payload.slice(1);
  if (payload.startsWith('cv=')) payload = payload.slice(3);
  else return null;

  try {
    const json = LZString.decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    return normalizeDocument(JSON.parse(json));
  } catch {
    return null;
  }
}

export function readFromLocation(siteCv) {
  if (typeof window === 'undefined') return null;
  const fromHash = decodeShareHash(window.location.hash);
  if (fromHash) {
    const cleaned = {
      ...fromHash,
      meta: { ...fromHash.meta, isExample: false },
    };
    writeLocal(cleaned);
    return cleaned;
  }
  return readLocal(siteCv);
}

export function buildShareUrl(doc) {
  if (typeof window === 'undefined') return { url: '', tooLong: false };
  const hash = encodeShareHash(doc);
  const url = `${window.location.origin}${window.location.pathname}${hash}`;
  return { url, tooLong: url.length > SHARE_WARN_LENGTH, length: url.length };
}

export function downloadJson(doc, filename = 'my-cv.json') {
  const data = JSON.stringify(doc, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

export function parseImportedJson(text) {
  const data = JSON.parse(text);
  if (data?.meta && Array.isArray(data?.sections)) {
    return normalizeDocument(data);
  }
  // Accept legacy section map
  return migrateLegacyElements(data, null);
}
