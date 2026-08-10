import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useCv } from './cvContext.jsx';
import { isStoredPhoto } from './photoStorage.js';

const PhotoCropModal = lazy(() => import('./PhotoCropModal.jsx'));

const SECTION_TYPES = [
  { value: 'about', label: 'About (paragraphs)' },
  { value: 'skills', label: 'Skills (tags)' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'custom', label: 'Custom list' },
];

const BTN =
  'inline-flex items-center justify-center rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-ink dark:border-line-dark dark:text-ink-invert';
const BTN_SMALL =
  'inline-flex items-center justify-center rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink dark:border-line-dark dark:text-ink-invert';
const BTN_DANGER =
  'inline-flex items-center justify-center rounded-md border border-tender-red/60 px-3 py-1.5 text-sm font-semibold text-tender-red';
const BTN_SMALL_DANGER =
  'inline-flex items-center justify-center rounded-md border border-tender-red/60 px-2 py-1 text-xs font-semibold text-tender-red';
const BTN_BLOCK = 'mt-3 w-full';
const INPUT =
  'w-full border-0 border-b border-line bg-transparent px-2 py-1.5 text-ink focus:border-tender-green focus:outline-none dark:border-line-dark dark:text-ink-invert';
const SECTION =
  'mb-4 rounded-md border border-line bg-ink/[0.02] p-3 dark:border-line-dark';
const FIELD = 'flex min-w-0 flex-col gap-1 text-sm text-ink-muted';
const FIELDS = 'flex flex-col gap-2.5';
const FIELDS_ROW = 'grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2.5';

function skillsToText(skills) {
  return Array.isArray(skills) ? skills.join(', ') : '';
}

function textToSkills(text) {
  return String(text || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const DEFAULT_SECTION_TITLE = {
  about: 'About Me',
  skills: 'Skills Summary',
  experience: 'Experience',
  education: 'Education',
  custom: 'New section',
};

function ItemEditor({ section, item }) {
  const { updateItem, removeItem, moveItem } = useCv();
  const [open, setOpen] = useState(false);
  const isAbout = section.type === 'about';
  const isSkills = section.type === 'skills';

  return (
    <div
      className={`rounded-[0.3rem] border bg-paper p-2 dark:bg-paper-dark ${
        item.selected
          ? 'border-tender-green/45 dark:border-tender-green/45'
          : 'border-line opacity-[0.72] dark:border-line-dark'
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-1.5">
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink dark:text-ink-invert">
          <input
            type="checkbox"
            checked={Boolean(item.selected)}
            onChange={() => updateItem(section.id, item.id, { selected: !item.selected })}
          />
          <span>Include</span>
        </label>
        <div className="flex flex-wrap gap-1">
          <button type="button" className={BTN_SMALL} onClick={() => moveItem(section.id, item.id, -1)}>
            ↑
          </button>
          <button type="button" className={BTN_SMALL} onClick={() => moveItem(section.id, item.id, 1)}>
            ↓
          </button>
          <button type="button" className={BTN_SMALL} onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Edit'}
          </button>
          <button
            type="button"
            className={BTN_SMALL_DANGER}
            onClick={() => {
              if (window.confirm('Delete this entry?')) removeItem(section.id, item.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {!open ? (
        <p
          className="m-0 cursor-text select-none text-[0.88rem] leading-snug text-ink-muted hover:text-ink dark:hover:text-ink-invert"
          title="Double-click to edit"
          onDoubleClick={() => setOpen(true)}
        >
          {isAbout
            ? item.description || 'Empty paragraph — double-click to edit'
            : isSkills
              ? item.title || 'Empty skill — double-click to edit'
              : [item.title, item.company].filter(Boolean).join(' — ') ||
                'Empty entry — double-click to edit'}
        </p>
      ) : (
        <div className={FIELDS}>
          {isAbout ? (
            <label className={FIELD}>
              <span>Paragraph</span>
              <textarea
                className={`${INPUT} min-h-[4.5rem] resize-y`}
                rows={4}
                value={item.description}
                placeholder="Write about yourself…"
                onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
              />
            </label>
          ) : isSkills ? (
            <label className={FIELD}>
              <span>Skill</span>
              <input
                className={INPUT}
                type="text"
                value={item.title}
                placeholder="e.g. Ruby"
                onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
              />
            </label>
          ) : (
            <>
              <div className={FIELDS_ROW}>
                <label className={FIELD}>
                  <span>Title</span>
                  <input
                    className={INPUT}
                    type="text"
                    value={item.title}
                    placeholder="Role / degree"
                    onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
                  />
                </label>
                <label className={FIELD}>
                  <span>Company / school</span>
                  <input
                    className={INPUT}
                    type="text"
                    value={item.company}
                    placeholder="Organization"
                    onChange={(e) => updateItem(section.id, item.id, { company: e.target.value })}
                  />
                </label>
              </div>
              <div className={FIELDS_ROW}>
                <label className={FIELD}>
                  <span>From</span>
                  <input
                    className={INPUT}
                    type="text"
                    value={item.start}
                    placeholder="Start"
                    onChange={(e) => updateItem(section.id, item.id, { start: e.target.value })}
                  />
                </label>
                <label className={FIELD}>
                  <span>To</span>
                  <input
                    className={INPUT}
                    type="text"
                    value={item.end}
                    placeholder="End"
                    onChange={(e) => updateItem(section.id, item.id, { end: e.target.value })}
                  />
                </label>
                <label className={FIELD}>
                  <span>Location</span>
                  <input
                    className={INPUT}
                    type="text"
                    value={item.location}
                    placeholder="City / remote"
                    onChange={(e) => updateItem(section.id, item.id, { location: e.target.value })}
                  />
                </label>
              </div>
              <label className={FIELD}>
                <span>Description</span>
                <textarea
                  className={`${INPUT} min-h-[4.5rem] resize-y`}
                  rows={3}
                  value={item.description}
                  placeholder="What did you do?"
                  onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
                />
              </label>
              <label className={FIELD}>
                <span>{section.type === 'education' ? 'Grades (comma-separated)' : 'Skills (comma-separated)'}</span>
                <input
                  className={INPUT}
                  type="text"
                  value={skillsToText(item.skills)}
                  placeholder="Ruby, Rails, Postgres"
                  onChange={(e) =>
                    updateItem(section.id, item.id, { skills: textToSkills(e.target.value) })
                  }
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SectionEditor({ section }) {
  const { updateSection, removeSection, moveSection, addItem } = useCv();
  const defaultTitle = DEFAULT_SECTION_TITLE[section.type] || DEFAULT_SECTION_TITLE.custom;

  function commitSectionTitle() {
    if (section.title.trim()) return;
    updateSection(section.id, { title: defaultTitle });
  }

  return (
    <section className={SECTION}>
      <div className="mb-3.5 flex flex-wrap items-end gap-2.5">
        <label className={`${FIELD} min-w-[10rem] flex-1`}>
          <span>Section title</span>
          <input
            className={INPUT}
            type="text"
            value={section.title}
            placeholder={defaultTitle}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            onBlur={commitSectionTitle}
          />
        </label>
        <label className={FIELD}>
          <span>Type</span>
          <select
            className={INPUT}
            value={section.type}
            onChange={(e) => updateSection(section.id, { type: e.target.value })}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={BTN_SMALL} onClick={() => moveSection(section.id, -1)}>
            ↑
          </button>
          <button type="button" className={BTN_SMALL} onClick={() => moveSection(section.id, 1)}>
            ↓
          </button>
          <button
            type="button"
            className={BTN_SMALL_DANGER}
            onClick={() => {
              if (window.confirm(`Delete section “${section.title}”?`)) removeSection(section.id);
            }}
          >
            Delete section
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {section.items.map((item) => (
          <ItemEditor key={item.id} section={section} item={item} />
        ))}
      </div>

      <button
        type="button"
        className={`${BTN} ${BTN_BLOCK}`}
        onClick={() => addItem(section.id, {})}
      >
        + Add entry to {section.title}
      </button>
    </section>
  );
}

export default function CvEditor() {
  const {
    doc,
    updateMeta,
    updateContact,
    addContact,
    removeContact,
    addSection,
    flash,
  } = useCv();
  const { meta } = doc;
  const photoInputRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);

  useEffect(() => {
    return () => {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
    };
  }, [cropSrc]);

  function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      flash('Please choose an image file.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      flash('Image is too large (max 12MB before resize).');
      return;
    }
    setCropSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function onCropConfirm(dataUrl) {
    setCropSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    updateMeta({ photoUrl: dataUrl });
    flash('Photo saved in this browser.');
  }

  function onCropCancel() {
    setCropSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  return (
    <div>
      {cropSrc ? (
        <Suspense fallback={null}>
          <PhotoCropModal src={cropSrc} onConfirm={onCropConfirm} onCancel={onCropCancel} />
        </Suspense>
      ) : null}
      <section className={SECTION}>
        <h2 className="mb-1.5 mt-0 font-serif text-[1.1rem] font-bold text-ink dark:text-ink-invert">
          Identity — edit me
        </h2>
        <p className="mb-3.5 mt-0 text-[0.9rem] leading-snug text-ink-muted">
          These fields show at the top of your CV. Replace the example details with yours.
        </p>
        <div className={FIELDS}>
          <div className={FIELDS_ROW}>
            <label className={FIELD}>
              <span>Name</span>
              <input
                className={INPUT}
                type="text"
                value={meta.name}
                placeholder="Your full name"
                onChange={(e) => updateMeta({ name: e.target.value })}
              />
            </label>
            <label className={FIELD}>
              <span>Role / headline</span>
              <input
                className={INPUT}
                type="text"
                value={meta.role}
                placeholder="e.g. Software Engineer"
                onChange={(e) => updateMeta({ role: e.target.value })}
              />
            </label>
          </div>

          <div className={FIELDS_ROW}>
            <label className={FIELD}>
              <span>Page background</span>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-14 cursor-pointer rounded border border-line bg-transparent p-1 dark:border-line-dark"
                  value={meta.bgColor || '#f5f1e8'}
                  onChange={(e) => updateMeta({ bgColor: e.target.value })}
                  aria-label="Portfolio background color"
                />
                <input
                  className={`${INPUT} max-w-[10rem]`}
                  type="text"
                  value={meta.bgColor || '#f5f1e8'}
                  onChange={(e) => updateMeta({ bgColor: e.target.value })}
                  placeholder="#f5f1e8"
                />
              </div>
            </label>
            <label className={FIELD}>
              <span>Text colour</span>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-14 cursor-pointer rounded border border-line bg-transparent p-1 dark:border-line-dark"
                  value={meta.textColor || '#1c1917'}
                  onChange={(e) => updateMeta({ textColor: e.target.value })}
                  aria-label="Portfolio text colour"
                />
                <input
                  className={`${INPUT} max-w-[10rem]`}
                  type="text"
                  value={meta.textColor || '#1c1917'}
                  onChange={(e) => updateMeta({ textColor: e.target.value })}
                  placeholder="#1c1917"
                />
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-sm text-ink-muted">Photo</span>
            <div className="flex flex-wrap items-center gap-3">
              {meta.photoUrl ? (
                <img
                  className="h-16 w-16 shrink-0 rounded-md border border-line object-cover object-center bg-ink/[0.04] dark:border-line-dark"
                  src={meta.photoUrl}
                  alt=""
                  width="64"
                  height="64"
                />
              ) : (
                <div
                  className="h-16 w-16 shrink-0 rounded-md border border-line bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgb(28_25_23_/_0.06)_6px,rgb(28_25_23_/_0.06)_12px)] dark:border-line-dark"
                  aria-hidden="true"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onPhotoSelected}
                />
                <button
                  type="button"
                  className={BTN}
                  onClick={() => photoInputRef.current?.click()}
                >
                  Upload photo
                </button>
                {meta.photoUrl ? (
                  <button
                    type="button"
                    className={BTN_DANGER}
                    onClick={() => updateMeta({ photoUrl: '' })}
                  >
                    Remove
                  </button>
                ) : null}
                <p className="m-0 basis-full text-xs leading-snug text-ink-faint">
                  {isStoredPhoto(meta.photoUrl)
                    ? 'Stored in this browser and encoded into share links (square crop).'
                    : 'Upload opens a cropper; the portrait is stored here and packed into share links (or paste a URL below).'}
                </p>
              </div>
            </div>
            <label className={FIELD}>
              <span>Or photo URL</span>
              <input
                className={INPUT}
                type="text"
                value={isStoredPhoto(meta.photoUrl) ? '' : meta.photoUrl}
                placeholder="/portrait.jpg or https://…"
                onChange={(e) => updateMeta({ photoUrl: e.target.value })}
              />
            </label>
          </div>
        </div>

        <h3 className="mb-2 mt-4 text-[0.95rem] font-bold text-ink dark:text-ink-invert">Contact</h3>
        <div className="flex flex-col gap-1.5">
          {meta.contact.map((c) => (
            <div
              key={c.id}
              className="mb-1.5 grid grid-cols-1 items-center gap-1.5 sm:grid-cols-[1fr_1.2fr_1.2fr_auto]"
            >
              <input
                className={INPUT}
                type="text"
                value={c.label}
                placeholder="Label"
                aria-label="Contact label"
                onChange={(e) => updateContact(c.id, { label: e.target.value })}
              />
              <input
                className={INPUT}
                type="text"
                value={c.value}
                placeholder="Value"
                aria-label="Contact value"
                onChange={(e) => updateContact(c.id, { value: e.target.value })}
              />
              <input
                className={INPUT}
                type="text"
                value={c.href}
                placeholder="Link (optional)"
                aria-label="Contact link"
                onChange={(e) => updateContact(c.id, { href: e.target.value })}
              />
              <button
                type="button"
                className={BTN_SMALL_DANGER}
                onClick={() => removeContact(c.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={`${BTN} ${BTN_BLOCK}`} onClick={addContact}>
          + Add contact row
        </button>
      </section>

      {doc.sections.map((section) => (
        <SectionEditor key={section.id} section={section} />
      ))}

      <button
        type="button"
        className={`${BTN} ${BTN_BLOCK}`}
        onClick={() => addSection('custom', 'New section')}
      >
        + Add section
      </button>
    </div>
  );
}
