import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCv } from './cvContext.jsx';
import { getCvBlocks, paginateBlocks } from './cvBlocks.jsx';

function measureBlockHeight(el) {
  const cs = getComputedStyle(el);
  const mt = parseFloat(cs.marginTop) || 0;
  const mb = parseFloat(cs.marginBottom) || 0;
  const h = Math.max(el.offsetHeight, el.scrollHeight, el.getBoundingClientRect().height);
  return h + mt + mb;
}

function measurePageContentHeight() {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none;' +
    'box-sizing:border-box;width:210mm;height:297mm;padding:8mm 9mm;';
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const padY =
    (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
  const pageH = probe.clientHeight || probe.offsetHeight;
  document.body.removeChild(probe);
  // Safety inset so packing never crowds the page edge / label
  return Math.max(120, pageH - padY - 12);
}

export default function CvPreview() {
  const { doc } = useCv();
  const blocks = useMemo(() => getCvBlocks(doc), [doc]);
  const measureRef = useRef(null);
  const [pages, setPages] = useState(() => [blocks]);

  useLayoutEffect(() => {
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const pack = () => {
      if (cancelled) return;
      const host = measureRef.current;
      if (!host) return;

      const blockEls = [...host.querySelectorAll('[data-cv-block]')];
      if (blockEls.length !== blocks.length) {
        setPages([blocks]);
        return;
      }

      const maxContent = measurePageContentHeight();
      const heights = blockEls.map((el) => measureBlockHeight(el) + 2);
      setPages(paginateBlocks(blocks, heights, maxContent));
    };

    // Sync pass first (avoids one-page overflow flash / stuck state)
    pack();

    // Re-pack after fonts and a settled paint (flex wraps / webfont metrics)
    const schedule = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(pack);
      });
    };

    schedule();
    const fontsReady = document.fonts?.ready;
    if (fontsReady?.then) {
      fontsReady.then(() => {
        if (!cancelled) schedule();
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [blocks]);

  return (
    <div className="cv-preview-shell" id="cv-preview">
      <p className="cv-preview-guide-note">
        Each card is one A4 page. Breaks fall between headings, paragraphs, and job
        entries — never through a line of text.
      </p>

      <div className="cv-measure-host" ref={measureRef} aria-hidden="true">
        <div className="cv-a4-page cv-doc">
          {blocks.map((block) => (
            <div key={block.id} data-cv-block={block.id} className="cv-block">
              {block.render()}
            </div>
          ))}
        </div>
      </div>

      <div className="cv-pages">
        {pages.map((pageBlocks, pageIndex) => (
          <article
            key={`page-${pageIndex}`}
            className="cv-a4-page cv-doc"
            data-cv-page={pageIndex + 1}
          >
            {pageBlocks.map((block) => (
              <div key={block.id} className="cv-block">
                {block.render()}
              </div>
            ))}
            <span className="cv-page-label">
              {pageIndex + 1} / {pages.length}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
