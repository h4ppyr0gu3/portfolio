#!/usr/bin/env node
/**
 * Pull essays from https://david-rogers.gitbook.io/philosophy into
 * lib/philosophy/*.md, src/pages/philosophy/*.astro, and blogs.json.
 *
 * Usage: node scripts/import-philosophy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://david-rogers.gitbook.io/philosophy';
const MD_DIR = path.join(ROOT, 'lib/philosophy');
const OUT_DIR = path.join(ROOT, 'src/pages/philosophy');
const BLOGS = path.join(ROOT, 'blogs.json');
const TODAY = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy fallback

function formatSiteDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return TODAY;
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** GitBook sitemap lastmod per slug (edit dates). Root URL maps to first essay. */
async function fetchLastmodBySlug() {
  const xml = await fetchText(`${BASE}/sitemap-pages.xml`);
  const map = new Map();
  const re = /<loc>([^<]+)<\/loc>\s*<priority>[^<]*<\/priority>\s*<lastmod>([^<]+)<\/lastmod>/g;
  let m;
  while ((m = re.exec(xml))) {
    const loc = m[1].replace(/\/$/, '');
    const lastmod = m[2];
    const pathPart = loc.replace(/^https?:\/\/[^/]+\/philosophy\/?/, '');
    const slug = pathPart || null;
    if (slug) map.set(slug, lastmod);
    else map.set('__root__', lastmod);
  }
  return map;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function excerptFrom(text, n = 220) {
  const one = text.replace(/\s+/g, ' ').trim();
  return one.length <= n ? one : `${one.slice(0, n).replace(/\s+\S*$/, '')}`;
}

/** Strip GitBook docs chrome (llms.txt / .md notice) and a leading H1. */
function cleanPhilosophyBody(md) {
  let body = String(md).replace(/\r\n/g, '\n').trim();
  body = body.replace(
    /^>\s*For the complete documentation index[\s\S]*?(?:\n{2,}|\n(?=#)|\s*$)/m,
    ''
  );
  body = body.replace(/^#\s+.+\n+/m, '');
  return body.trim();
}

/** Minimal markdown → HTML for GitBook essay bodies (headings, paragraphs, lists). */
function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = null; // 'ul' | 'ol'

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim();
    if (text) out.push(`<p>${inline(text)}</p>`);
    para = [];
  };

  const flushList = () => {
    if (!list) return;
    out.push(`</${list}>`);
    list = null;
  };

  const inline = (text) =>
    escapeHtml(text)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushPara();
      flushList();
      const depth = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      out.push(
        `<h${depth} id="user-content-${id}"><a class="anchor" href="#${id}" aria-hidden="true"></a>${escapeHtml(text)}</h${depth}>`
      );
      continue;
    }

    const ul = line.match(/^\s*[-*]\s+(.+)$/);
    if (ul) {
      flushPara();
      if (list !== 'ul') {
        flushList();
        out.push('<ul>');
        list = 'ul';
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }

    flushList();
    para.push(line.trim());
  }

  flushPara();
  flushList();
  return `${out.join('\n')}\n`;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function parseLlms(txt) {
  const pages = [];
  for (const line of txt.split('\n')) {
    const m = line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+\.md)\)(?::\s*(.*))?$/);
    if (!m) continue;
    const title = m[1].trim();
    const url = m[2].trim();
    const hint = (m[3] || '').trim();
    const slug = path.basename(url, '.md');
    if (slug === 'README' || slug === 'index') continue;
    pages.push({ title, url, slug, hint });
  }
  return pages;
}

async function main() {
  fs.mkdirSync(MD_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const [llms, lastmodBySlug] = await Promise.all([
    fetchText(`${BASE}/llms.txt`),
    fetchLastmodBySlug(),
  ]);
  const pages = parseLlms(llms);
  if (!pages.length) throw new Error('No pages found in llms.txt');

  const entries = [];

  for (const page of pages) {
    const md = await fetchText(page.url);
    const body = cleanPhilosophyBody(md);
    const title = page.title;
    const excerpt = page.hint || excerptFrom(body);
    const iso =
      lastmodBySlug.get(page.slug) ||
      (page.slug === pages[0]?.slug ? lastmodBySlug.get('__root__') : null);
    const siteDate = iso ? formatSiteDate(iso) : TODAY;
    const front = [
      '---',
      `href: "/philosophy/${page.slug}"`,
      `title: ${JSON.stringify(title)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      `date: ${JSON.stringify(siteDate)}`,
      'tags:',
      '  - philosophy',
      'published: true',
      `updated: ${JSON.stringify(siteDate)}`,
      'topics: Philosophy',
      '---',
      '',
      `# ${title}`,
      '',
      body,
      '',
    ].join('\n');

    fs.writeFileSync(path.join(MD_DIR, `${page.slug}.md`), front);

    const html = mdToHtml(`# ${title}\n\n${body}\n`);
    const astro = `---
import Blog from '../../layouts/Blog.astro';

const title = ${JSON.stringify(title)};
const description = ${JSON.stringify(excerpt)};
const date = ${JSON.stringify(siteDate)};
const updated = ${JSON.stringify(siteDate)};
---
<Blog title={title} description={description} date={date} updated={updated}>
${html.trim()}
</Blog>
`;
    fs.writeFileSync(path.join(OUT_DIR, `${page.slug}.astro`), astro);

    entries.push({
      href: `/philosophy/${page.slug}`,
      title,
      excerpt,
      date: siteDate,
      tags: ['philosophy'],
      published: true,
      updated: siteDate,
      topics: 'Philosophy',
    });
    console.log(`✓ ${page.slug} (${siteDate})`);
  }

  const blogs = JSON.parse(fs.readFileSync(BLOGS, 'utf8'));
  blogs.philosophy = entries;
  fs.writeFileSync(BLOGS, `${JSON.stringify(blogs, null, 2)}\n`);
  console.log(`Updated ${entries.length} philosophy entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
