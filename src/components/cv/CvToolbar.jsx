import React, { useRef } from 'react';
import { useCv } from './cvContext.jsx';
import {
  buildShareUrl,
  downloadJson,
  parseImportedJson,
} from './cvStorage.js';
import { exportCvPdf } from './pdfExport.js';

export default function CvToolbar() {
  const fileRef = useRef(null);
  const { doc, setDoc, loadExample, startBlank, resetAll, flash } = useCv();

  async function copyShareLink() {
    const { url, tooLong } = buildShareUrl(doc);
    window.history.replaceState(null, '', url);

    try {
      await navigator.clipboard.writeText(url);
      if (tooLong) {
        flash('Share link copied — it is long; JSON export is more reliable for big CVs.');
      } else {
        flash('Share link copied to clipboard.');
      }
    } catch {
      flash('Share link is in the address bar — copy it from there (clipboard blocked).');
    }
  }

  function exportPdf() {
    const pageCount = document.querySelectorAll('#cv-preview .cv-a4-page[data-cv-page]').length;
    if (!pageCount) {
      flash('Preview not found.');
      return;
    }
    const name = (doc.meta.name || 'cv').replace(/[^\w.-]+/g, '_');
    flash(`Building text PDF (${pageCount} page${pageCount === 1 ? '' : 's'})…`);
    exportCvPdf(`${name}.pdf`)
      .then(() => flash('PDF downloaded — selectable text with working links.'))
      .catch((err) => {
        console.error(err);
        flash('PDF export failed.');
      });
  }

  function exportJson() {
    const name = (doc.meta.name || 'my-cv').replace(/[^\w.-]+/g, '_');
    downloadJson(doc, `${name}.json`);
    flash('JSON downloaded.');
  }

  function onImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedJson(String(reader.result));
        imported.meta = { ...imported.meta, isExample: false };
        setDoc(imported);
        flash('Imported CV from JSON.');
      } catch {
        flash('Could not parse that JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirmImport() {
    if (
      !window.confirm(
        'Import JSON? This replaces the CV currently in this browser.'
      )
    ) {
      return;
    }
    fileRef.current?.click();
  }

  function confirmReset() {
    if (!window.confirm('Reset to the example CV and clear saved edits?')) return;
    resetAll();
  }

  function confirmBlank() {
    if (!window.confirm('Start a blank CV? Unsaved share links are unaffected.')) return;
    startBlank();
  }

  return (
    <div className="cv-toolbar">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={onImportFile}
      />
      <button type="button" className="cv-btn" onClick={loadExample}>
        Load example
      </button>
      <button type="button" className="cv-btn" onClick={confirmBlank}>
        Start blank
      </button>
      <button type="button" className="cv-btn" onClick={confirmImport}>
        Import JSON
      </button>
      <button type="button" className="cv-btn" onClick={exportJson}>
        Export JSON
      </button>
      <button type="button" className="cv-btn cv-btn--accent" onClick={copyShareLink}>
        Copy share link
      </button>
      <button type="button" className="cv-btn cv-btn--accent" onClick={exportPdf}>
        Export PDF
      </button>
      <button type="button" className="cv-btn cv-btn--danger" onClick={confirmReset}>
        Reset
      </button>
    </div>
  );
}
