import React from 'react';
import { CvProvider, useCv } from './cvContext.jsx';
import CvToolbar from './CvToolbar.jsx';
import CvEditor from './CvEditor.jsx';
import CvPreview from './CvPreview.jsx';

function CvAppInner() {
  const { ready, status, doc } = useCv();

  if (!ready) {
    return <p className="cv-loading">Loading CV editor…</p>;
  }

  return (
    <div className="cv-builder-app">
      {doc.meta.isExample ? (
        <div className="cv-banner" role="status">
          <strong>Example CV loaded.</strong> Everything below is editable — replace the name,
          contact, and sections with yours. Changes auto-save in this browser only.
        </div>
      ) : (
        <div className="cv-banner cv-banner--saved" role="status">
          Editing your CV — changes auto-save in this browser. Use <em>Copy share link</em> or
          export JSON/PDF to share.
        </div>
      )}

      <CvToolbar />
      {status ? <p className="cv-status" role="status">{status}</p> : null}

      <div className="cv-builder-grid">
        <div className="cv-builder-pane">
          <h2 className="cv-pane-title">Edit</h2>
          <CvEditor />
        </div>
        <div className="cv-builder-pane">
          <h2 className="cv-pane-title">Preview</h2>
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
