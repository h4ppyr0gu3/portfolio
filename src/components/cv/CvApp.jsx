import React from 'react';
import { CvProvider, useCv } from './cvContext.jsx';
import CvToolbar from './CvToolbar.jsx';
import CvEditor from './CvEditor.jsx';
import CvPreview from './CvPreview.jsx';

function CvAppInner() {
  const { ready, status, doc } = useCv();

  if (!ready) {
    return <p className="text-ink-muted dark:text-ink-faint">Loading CV editor…</p>;
  }

  return (
    <div>
      {doc.meta.isExample ? (
        <div
          className="mb-4 rounded-md border border-tender-yellow/40 bg-tender-yellow/10 px-4 py-3 text-sm text-ink dark:text-ink-invert"
          role="status"
        >
          <strong>Example CV loaded.</strong> Everything below is editable — replace the name,
          contact, and sections with yours. Changes auto-save in this browser only.
        </div>
      ) : (
        <div
          className="mb-4 rounded-md border border-tender-green/40 bg-tender-green/10 px-4 py-3 text-sm text-ink dark:text-ink-invert"
          role="status"
        >
          Editing your CV — changes auto-save in this browser. Use <em>Copy share link</em> for a
          full web portfolio page, or export JSON as backup.
        </div>
      )}

      <CvToolbar />
      {status ? (
        <p className="mb-4 text-sm font-semibold text-tender-green" role="status">
          {status}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 className="mb-3 text-lg font-bold">Edit</h2>
          <CvEditor />
        </div>
        <div className="min-w-0">
          <h2 className="mb-3 text-lg font-bold">Preview</h2>
          <CvPreview />
        </div>
      </div>
    </div>
  );
}

export default function CvApp({ siteCv }) {
  return (
    <CvProvider siteCv={siteCv}>
      <CvAppInner />
    </CvProvider>
  );
}
