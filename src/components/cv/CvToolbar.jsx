import React, { useEffect, useRef, useState } from 'react';
import { useCv } from './cvContext.jsx';
import {
  buildShareUrl,
  downloadJson,
  parseImportedJson,
} from './cvStorage.js';

const btn =
  'inline-flex items-center justify-center rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-tender-green hover:text-tender-green dark:border-line-dark dark:text-ink-invert';

export default function CvToolbar() {
  const fileRef = useRef(null);
  const moreRef = useRef(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const { doc, setDoc, loadExample, startBlank, resetAll, flash, persistNow } = useCv();

  useEffect(() => {
    if (!moreOpen) return undefined;

    function onPointerDown(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') setMoreOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen]);

  async function copyShareLink() {
    persistNow();
    const { url, tooLong } = buildShareUrl(doc);

    try {
      await navigator.clipboard.writeText(url);
      if (tooLong) {
        flash('Share link copied — it is long; JSON export is more reliable for big CVs.');
      } else {
        flash('Share link copied — opens a full web portfolio page.');
      }
    } catch {
      flash('Could not copy — open portfolio and copy from the address bar.');
    }
  }

  function openPortfolio() {
    persistNow();
    const { url } = buildShareUrl(doc);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function exportJson() {
    const name = (doc.meta.name || 'my-cv').replace(/[^\w.-]+/g, '_');
    downloadJson(doc, `${name}.json`);
    flash('JSON downloaded.');
    setMoreOpen(false);
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
    setMoreOpen(false);
    fileRef.current?.click();
  }

  function confirmReset() {
    if (!window.confirm('Reset to the example CV and clear saved edits?')) return;
    setMoreOpen(false);
    resetAll();
  }

  function confirmBlank() {
    if (!window.confirm('Start a blank CV? Unsaved share links are unaffected.')) return;
    setMoreOpen(false);
    startBlank();
  }

  function onLoadExample() {
    setMoreOpen(false);
    loadExample();
  }

  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={onImportFile}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`${btn} border-tender-green bg-tender-green/20`}
          onClick={openPortfolio}
        >
          Open portfolio
        </button>
        <button
          type="button"
          className={`${btn} border-tender-green/50`}
          onClick={copyShareLink}
        >
          Copy share link
        </button>
      </div>

      <div className="relative" ref={moreRef}>
        <button
          type="button"
          className={btn}
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
        >
          More
          <span className="ml-1 text-xs opacity-75" aria-hidden="true">
            ▾
          </span>
        </button>
        {moreOpen ? (
          <div
            className="absolute right-0 top-[calc(100%+0.3rem)] z-20 min-w-[11.5rem] rounded-md border border-line bg-paper p-1 shadow-lg dark:border-line-dark dark:bg-paper-dark"
            role="menu"
          >
            {[
              ['Load example', onLoadExample],
              ['Start blank', confirmBlank],
              ['Import JSON', confirmImport],
              ['Export JSON', exportJson],
            ].map(([label, onClick]) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                className="block w-full rounded px-2.5 py-1.5 text-left text-sm font-semibold hover:bg-tender-green/15 hover:text-tender-green"
                onClick={onClick}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              className="block w-full rounded px-2.5 py-1.5 text-left text-sm font-semibold text-tender-red hover:bg-tender-red/10"
              onClick={confirmReset}
            >
              Reset
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
