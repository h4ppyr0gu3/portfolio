import React, { useRef, useState } from 'react';
import { useCv } from './cvContext.jsx';
import { fileToStoredPhoto, isStoredPhoto } from './photoStorage.js';

const SECTION_TYPES = [
  { value: 'about', label: 'About (paragraphs)' },
  { value: 'skills', label: 'Skills (tags)' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'custom', label: 'Custom list' },
];

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
    <div className={`cv-item-card ${item.selected ? 'is-included' : 'is-excluded'}`}>
      <div className="cv-item-card-bar">
        <label className="cv-check">
          <input
            type="checkbox"
            checked={Boolean(item.selected)}
            onChange={() => updateItem(section.id, item.id, { selected: !item.selected })}
          />
          <span>Include</span>
        </label>
        <div className="cv-item-card-actions">
          <button type="button" className="cv-btn cv-btn--small" onClick={() => moveItem(section.id, item.id, -1)}>
            ↑
          </button>
          <button type="button" className="cv-btn cv-btn--small" onClick={() => moveItem(section.id, item.id, 1)}>
            ↓
          </button>
          <button type="button" className="cv-btn cv-btn--small" onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Edit'}
          </button>
          <button
            type="button"
            className="cv-btn cv-btn--small cv-btn--danger"
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
          className="cv-item-summary"
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
        <div className="cv-fields">
          {isAbout ? (
            <label className="cv-field">
              <span>Paragraph</span>
              <textarea
                rows={4}
                value={item.description}
                placeholder="Write about yourself…"
                onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
              />
            </label>
          ) : isSkills ? (
            <label className="cv-field">
              <span>Skill</span>
              <input
                type="text"
                value={item.title}
                placeholder="e.g. Ruby"
                onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
              />
            </label>
          ) : (
            <>
              <div className="cv-fields-row">
                <label className="cv-field">
                  <span>Title</span>
                  <input
                    type="text"
                    value={item.title}
                    placeholder="Role / degree"
                    onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
                  />
                </label>
                <label className="cv-field">
                  <span>Company / school</span>
                  <input
                    type="text"
                    value={item.company}
                    placeholder="Organization"
                    onChange={(e) => updateItem(section.id, item.id, { company: e.target.value })}
                  />
                </label>
              </div>
              <div className="cv-fields-row">
                <label className="cv-field">
                  <span>From</span>
                  <input
                    type="text"
                    value={item.start}
                    placeholder="Start"
                    onChange={(e) => updateItem(section.id, item.id, { start: e.target.value })}
                  />
                </label>
                <label className="cv-field">
                  <span>To</span>
                  <input
                    type="text"
                    value={item.end}
                    placeholder="End"
                    onChange={(e) => updateItem(section.id, item.id, { end: e.target.value })}
                  />
                </label>
                <label className="cv-field">
                  <span>Location</span>
                  <input
                    type="text"
                    value={item.location}
                    placeholder="City / remote"
                    onChange={(e) => updateItem(section.id, item.id, { location: e.target.value })}
                  />
                </label>
              </div>
              <label className="cv-field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={item.description}
                  placeholder="What did you do?"
                  onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
                />
              </label>
              <label className="cv-field">
                <span>{section.type === 'education' ? 'Grades (comma-separated)' : 'Skills (comma-separated)'}</span>
                <input
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
    <section className="cv-edit-section">
      <div className="cv-edit-section-head">
        <label className="cv-field cv-field--grow">
          <span>Section title</span>
          <input
            type="text"
            value={section.title}
            placeholder={defaultTitle}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            onBlur={commitSectionTitle}
          />
        </label>
        <label className="cv-field">
          <span>Type</span>
          <select
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
        <div className="cv-edit-section-actions">
          <button type="button" className="cv-btn cv-btn--small" onClick={() => moveSection(section.id, -1)}>
            ↑
          </button>
          <button type="button" className="cv-btn cv-btn--small" onClick={() => moveSection(section.id, 1)}>
            ↓
          </button>
          <button
            type="button"
            className="cv-btn cv-btn--small cv-btn--danger"
            onClick={() => {
              if (window.confirm(`Delete section “${section.title}”?`)) removeSection(section.id);
            }}
          >
            Delete section
          </button>
        </div>
      </div>

      <div className="cv-item-list">
        {section.items.map((item) => (
          <ItemEditor key={item.id} section={section} item={item} />
        ))}
      </div>

      <button
        type="button"
        className="cv-btn cv-btn--block"
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
  const [photoBusy, setPhotoBusy] = useState(false);

  async function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoBusy(true);
    try {
      const dataUrl = await fileToStoredPhoto(file);
      updateMeta({ photoUrl: dataUrl });
      flash('Photo saved in this browser.');
    } catch (err) {
      flash(err?.message || 'Could not save photo.');
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <div className="cv-editor">
      <section className="cv-edit-section">
        <h2 className="cv-edit-heading">Identity — edit me</h2>
        <p className="cv-edit-hint">
          These fields show at the top of your CV. Replace the example details with yours.
        </p>
        <div className="cv-fields">
          <div className="cv-fields-row">
            <label className="cv-field">
              <span>Name</span>
              <input
                type="text"
                value={meta.name}
                placeholder="Your full name"
                onChange={(e) => updateMeta({ name: e.target.value })}
              />
            </label>
            <label className="cv-field">
              <span>Role / headline</span>
              <input
                type="text"
                value={meta.role}
                placeholder="e.g. Software Engineer"
                onChange={(e) => updateMeta({ role: e.target.value })}
              />
            </label>
          </div>

          <div className="cv-photo-field">
            <span className="cv-photo-label">Photo</span>
            <div className="cv-photo-row">
              {meta.photoUrl ? (
                <img
                  className="cv-photo-thumb"
                  src={meta.photoUrl}
                  alt=""
                  width="64"
                  height="64"
                />
              ) : (
                <div className="cv-photo-thumb cv-photo-thumb--empty" aria-hidden="true" />
              )}
              <div className="cv-photo-actions">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onPhotoSelected}
                />
                <button
                  type="button"
                  className="cv-btn"
                  disabled={photoBusy}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoBusy ? 'Saving…' : 'Upload photo'}
                </button>
                {meta.photoUrl ? (
                  <button
                    type="button"
                    className="cv-btn cv-btn--danger"
                    onClick={() => updateMeta({ photoUrl: '' })}
                  >
                    Remove
                  </button>
                ) : null}
                <p className="cv-photo-hint">
                  {isStoredPhoto(meta.photoUrl)
                    ? 'Stored in this browser with your CV.'
                    : 'Upload stores a compressed copy in local storage (or paste a URL below).'}
                </p>
              </div>
            </div>
            <label className="cv-field">
              <span>Or photo URL</span>
              <input
                type="text"
                value={isStoredPhoto(meta.photoUrl) ? '' : meta.photoUrl}
                placeholder="/portrait.jpg or https://…"
                onChange={(e) => updateMeta({ photoUrl: e.target.value })}
              />
            </label>
          </div>
        </div>

        <h3 className="cv-edit-subheading">Contact</h3>
        <div className="cv-item-list">
          {meta.contact.map((c) => (
            <div key={c.id} className="cv-contact-row">
              <input
                type="text"
                value={c.label}
                placeholder="Label"
                aria-label="Contact label"
                onChange={(e) => updateContact(c.id, { label: e.target.value })}
              />
              <input
                type="text"
                value={c.value}
                placeholder="Value"
                aria-label="Contact value"
                onChange={(e) => updateContact(c.id, { value: e.target.value })}
              />
              <input
                type="text"
                value={c.href}
                placeholder="Link (optional)"
                aria-label="Contact link"
                onChange={(e) => updateContact(c.id, { href: e.target.value })}
              />
              <button
                type="button"
                className="cv-btn cv-btn--small cv-btn--danger"
                onClick={() => removeContact(c.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="cv-btn cv-btn--block" onClick={addContact}>
          + Add contact row
        </button>
      </section>

      {doc.sections.map((section) => (
        <SectionEditor key={section.id} section={section} />
      ))}

      <button
        type="button"
        className="cv-btn cv-btn--block"
        onClick={() => addSection('custom', 'New section')}
      >
        + Add section
      </button>
    </div>
  );
}
