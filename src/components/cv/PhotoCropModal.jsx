import { useEffect, useRef, useState } from 'react';
import { cropImageToStoredPhoto } from './photoStorage.js';

const FRAME = 280;

/**
 * Drag-to-center + zoom cropper. Outputs a square JPEG via onConfirm(dataUrl).
 * @param {{ src: string, onConfirm: (dataUrl: string) => void, onCancel: () => void }} props
 */
export default function PhotoCropModal({ src, onConfirm, onCancel }) {
  const imgRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');
  const dragRef = useRef(null);

  const img = imgRef.current;
  const nw = img?.naturalWidth || 0;
  const nh = img?.naturalHeight || 0;

  const coverScale = ready ? Math.max(FRAME / nw, FRAME / nh) * zoom : 1;
  const drawW = nw * coverScale;
  const drawH = nh * coverScale;
  const maxPanPxX = Math.max(0, (drawW - FRAME) / 2);
  const maxPanPxY = Math.max(0, (drawH - FRAME) / 2);
  const offsetX = -maxPanPxX * panX;
  const offsetY = -maxPanPxY * panY;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, panX, panY };
  }

  function onPointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    setPanX(maxPanPxX > 0 ? clamp(drag.panX - dx / maxPanPxX, -1, 1) : 0);
    setPanY(maxPanPxY > 0 ? clamp(drag.panY - dy / maxPanPxY, -1, 1) : 0);
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function apply() {
    const el = imgRef.current;
    if (!el?.naturalWidth) return;
    try {
      const dataUrl = cropImageToStoredPhoto(el, { panX, panY, zoom });
      onConfirm(dataUrl);
    } catch (err) {
      setError(err?.message || 'Could not crop photo.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/50 p-4 dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Crop photo"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border border-line bg-paper p-4 shadow-lg dark:border-line-dark dark:bg-paper-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 font-serif text-lg font-bold text-ink dark:text-ink-invert">
          Crop photo
        </h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">
          Drag to center, then zoom for a tighter crop. Saved as a square portrait.
        </p>

        <div
          className="relative mx-auto overflow-hidden rounded-md border border-line bg-ink/[0.06] touch-none dark:border-line-dark"
          style={{ width: FRAME, height: FRAME, cursor: ready ? 'grab' : 'default' }}
          onPointerDown={ready ? onPointerDown : undefined}
          onPointerMove={ready ? onPointerMove : undefined}
          onPointerUp={ready ? onPointerUp : undefined}
          onPointerCancel={ready ? onPointerUp : undefined}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none"
            style={{
              width: ready ? drawW : FRAME,
              height: ready ? drawH : FRAME,
              left: '50%',
              top: '50%',
              transform: ready
                ? `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
                : 'translate(-50%, -50%)',
              opacity: ready ? 1 : 0,
            }}
            onLoad={() => setReady(true)}
            onError={() => setError('Could not read that image.')}
          />
          {!ready && !error ? (
            <p className="absolute inset-0 m-0 flex items-center justify-center text-sm text-ink-faint">
              Loading…
            </p>
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-ink/20 dark:ring-white/25"
            aria-hidden="true"
          />
        </div>

        <label className="mt-3 flex flex-col gap-1 text-sm text-ink-muted">
          <span className="flex justify-between">
            Zoom <span className="tabular-nums text-ink-faint">{zoom.toFixed(1)}×</span>
          </span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            disabled={!ready}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>

        {error ? <p className="mb-0 mt-2 text-sm text-red-700 dark:text-red-300">{error}</p> : null}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded border border-line bg-transparent px-3 py-1.5 text-sm text-ink hover:bg-ink/[0.04] dark:border-line-dark dark:text-ink-invert"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded border border-tender-ink/30 bg-tender-mist px-3 py-1.5 text-sm font-medium text-tender-ink hover:bg-tender-soft disabled:opacity-50 dark:border-tender-soft/40 dark:bg-tender-ink/40 dark:text-tender-mist"
            disabled={!ready || !!error}
            onClick={apply}
          >
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
