import React from 'react';
import ExperienceItem from './experience_item.jsx';
import Skills from './skills.jsx';

/** Flatten a CV document into atomic blocks for page packing. */
export function getCvBlocks(doc) {
  const { meta, sections } = doc;
  const blocks = [];

  blocks.push({
    id: 'hero',
    keepWithNext: true,
    render: () => (
      <header className="cv-hero cv-hero--preview">
        {meta.photoUrl ? (
          <img
            className="cv-portrait"
            src={meta.photoUrl}
            width="144"
            height="144"
            alt={meta.name || 'Portrait'}
          />
        ) : null}
        <div className="cv-identity">
          <h1>{meta.name || 'Your name'}</h1>
          <p className="cv-role">{meta.role || 'Your role'}</p>
        </div>
      </header>
    ),
  });

  for (const section of sections || []) {
    const items = (section.items || []).filter((obj) => obj?.selected);
    if (!items.length) continue;

    if (section.type === 'skills') {
      const skills = items.map((obj) => obj.title).filter(Boolean);
      if (!skills.length) continue;
      blocks.push({
        id: `heading-${section.id}`,
        keepWithNext: true,
        render: () => <h2 className="cv-block-heading">{section.title}</h2>,
      });
      blocks.push({
        id: `skills-${section.id}`,
        keepWithNext: false,
        render: () => <Skills skills={skills} />,
      });
      continue;
    }

    if (section.type === 'about') {
      const paragraphs = items.filter((obj) => obj.description);
      if (!paragraphs.length) continue;
      blocks.push({
        id: `heading-${section.id}`,
        keepWithNext: true,
        render: () => <h2 className="cv-block-heading">{section.title}</h2>,
      });
      paragraphs.forEach((obj) => {
        blocks.push({
          id: `about-${obj.id}`,
          keepWithNext: false,
          render: () => (
            <div className="cv-prose">
              <p>{obj.description}</p>
            </div>
          ),
        });
      });
      continue;
    }

    blocks.push({
      id: `heading-${section.id}`,
      keepWithNext: true,
      render: () => <h2 className="cv-block-heading">{section.title}</h2>,
    });
    items.forEach((obj) => {
      blocks.push({
        id: `item-${section.id}-${obj.id}`,
        keepWithNext: false,
        render: () => <ExperienceItem parent={section.title} experience={obj} />,
      });
    });
  }

  const contacts = (meta.contact || []).filter((c) => c.label || c.value);
  if (contacts.length) {
    blocks.push({
      id: 'heading-contact',
      keepWithNext: true,
      render: () => <h2 className="cv-block-heading">Get in Touch</h2>,
    });
    contacts.forEach((c) => {
      blocks.push({
        id: `contact-${c.id}`,
        keepWithNext: false,
        render: () => (
          <div className="cv-prose cv-contact">
            <p>
              {c.label ? `${c.label}: ` : null}
              {c.href ? <a href={c.href}>{c.value || c.href}</a> : <span>{c.value}</span>}
            </p>
          </div>
        ),
      });
    });
  }

  return blocks;
}

/**
 * Pack measured blocks into pages. Never splits a block.
 * Headings (keepWithNext) stay with the following block when the pair fits.
 */
export function paginateBlocks(blocks, heights, maxContentHeight) {
  const pages = [];
  let page = [];
  let used = 0;

  const pushPage = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
  };

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    const h = Math.max(0, heights[i] || 0);

    if (block.keepWithNext && i + 1 < blocks.length) {
      const nextH = Math.max(0, heights[i + 1] || 0);
      const pairH = h + nextH;

      if (used > 0 && used + pairH > maxContentHeight) {
        pushPage();
      }

      if (pairH <= maxContentHeight) {
        page.push(block);
        page.push(blocks[i + 1]);
        used += pairH;
        i += 2;
        continue;
      }

      if (used > 0 && used + h > maxContentHeight) pushPage();
      page.push(block);
      used += h;
      i += 1;
      continue;
    }

    if (used > 0 && used + h > maxContentHeight) {
      pushPage();
    }
    page.push(block);
    used += h;
    i += 1;
  }

  pushPage();
  return pages.length ? pages : [[]];
}
