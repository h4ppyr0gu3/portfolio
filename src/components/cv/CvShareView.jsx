import React, { useEffect, useState } from 'react';
import CvDocumentView from './CvDocumentView.jsx';
import { decodeShareHash } from './cvStorage.js';

/**
 * Public share target: decode `#cv=` and render a full web portfolio.
 * Does not write into the visitor's editor localStorage.
 */
export default function CvShareView() {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const parsed = decodeShareHash(window.location.hash);
    if (!parsed) {
      setError('This share link is missing or invalid.');
      setDoc(null);
      return;
    }
    setError('');
    setDoc(parsed);
    if (parsed.meta?.name) {
      document.title = `${parsed.meta.name} | Portfolio`;
    }
  }, []);

  useEffect(() => {
    if (!doc) return undefined;
    const bg = doc.meta.bgColor || '#f5f1e8';
    const prevBody = document.body.style.backgroundColor;
    const prevHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = prevBody;
      document.documentElement.style.backgroundColor = prevHtml;
    };
  }, [doc]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <p className="mb-4 text-ink-muted">{error}</p>
        <a href="/cv" className="font-semibold text-tender-green underline">
          Open the CV builder
        </a>
      </div>
    );
  }

  if (!doc) {
    return <p className="p-8 text-center text-ink-muted">Loading portfolio…</p>;
  }

  const bg = doc.meta.bgColor || '#f5f1e8';

  return (
    <div className="min-h-full" style={{ backgroundColor: bg }}>
      <CvDocumentView doc={doc} />
    </div>
  );
}
