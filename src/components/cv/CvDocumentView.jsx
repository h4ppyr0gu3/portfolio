import React from 'react';
import ExperienceItem from './experience_item.jsx';
import Skills from './skills.jsx';
import Title from './title.jsx';

/** Continuous web portfolio view from a CV document (no pagination / PDF). */
export default function CvDocumentView({ doc }) {
  if (!doc) return null;

  const { meta, sections } = doc;
  const contacts = (meta.contact || []).filter((c) => c.label || c.value);
  const text = meta.textColor || '#1c1917';

  return (
    <article className="mx-auto max-w-5xl p-6 sm:p-8" style={{ color: text }}>
      <header className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {meta.photoUrl ? (
          <img
            className="h-36 w-36 rounded object-cover object-center"
            src={meta.photoUrl}
            width="144"
            height="144"
            alt={meta.name || 'Portrait'}
          />
        ) : null}
        <div className="text-center sm:text-left">
          <h1 className="m-0 text-4xl font-bold" style={{ color: text }}>
            {meta.name || 'Your name'}
          </h1>
          <p className="mt-1 text-lg opacity-70">{meta.role || 'Your role'}</p>
        </div>
      </header>

      {(sections || []).map((section) => {
        const items = (section.items || []).filter((obj) => obj?.selected);
        if (!items.length) return null;

        if (section.type === 'skills') {
          const skills = items.map((obj) => obj.title).filter(Boolean);
          if (!skills.length) return null;
          return (
            <Title key={section.id} title={section.title}>
              <div className="opacity-80">
                <Skills skills={skills} />
              </div>
            </Title>
          );
        }

        if (section.type === 'about') {
          const paragraphs = items.filter((obj) => obj.description);
          if (!paragraphs.length) return null;
          return (
            <Title key={section.id} title={section.title}>
              <div className="space-y-3 text-lg leading-relaxed">
                {paragraphs.map((obj) => (
                  <p key={obj.id} className="m-0">
                    {obj.description}
                  </p>
                ))}
              </div>
            </Title>
          );
        }

        return (
          <Title key={section.id} title={section.title}>
            <div className="flex flex-col gap-4">
              {items.map((obj) => (
                <ExperienceItem key={obj.id} parent={section.title} experience={obj} />
              ))}
            </div>
          </Title>
        );
      })}

      {contacts.length ? (
        <Title title="Get in Touch">
          <div className="space-y-1 text-lg [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 hover:[&_a]:opacity-80">
            {contacts.map((c) => (
              <p key={c.id} className="m-0">
                {c.label ? `${c.label}: ` : null}
                {c.href ? <a href={c.href}>{c.value || c.href}</a> : <span>{c.value}</span>}
              </p>
            ))}
          </div>
        </Title>
      ) : null}
    </article>
  );
}
