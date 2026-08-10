import React from 'react';
import { useCv } from './cvContext.jsx';
import CvDocumentView from './CvDocumentView.jsx';

export default function CvPreview() {
  const { doc } = useCv();
  const bg = doc.meta.bgColor || '#f5f1e8';

  return (
    <div id="cv-preview" className="overflow-hidden rounded-md border border-line dark:border-line-dark">
      <p className="border-b border-line px-3 py-2 text-sm text-ink-muted dark:border-line-dark dark:text-ink-faint">
        Live web preview — share link opens this as a full portfolio page.
      </p>
      <div style={{ backgroundColor: bg }}>
        <CvDocumentView doc={doc} />
      </div>
    </div>
  );
}
