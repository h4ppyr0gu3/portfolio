import { jsPDF } from 'jspdf';

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const INK = [28, 25, 23];
const MUTED = [87, 83, 78];
const FAINT = [120, 113, 108];
const LINK = [30, 64, 175];
const RULE = [214, 211, 209];

/** jsPDF core fonts are WinAnsi — normalize punctuation that would otherwise vanish. */
function sanitize(text) {
  return String(text ?? '')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2018|\u2019|\u2032/g, "'")
    .replace(/\u201c|\u201d|\u2033/g, '"')
    .replace(/\u2022/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2192/g, '->')
    .replace(/[^\u0009\u000A\u000D\u0020-\u007E\u00A0-\u00FF]/g, '');
}

function pageScale(pageEl) {
  const rect = pageEl.getBoundingClientRect();
  return {
    rect,
    sx: PAGE_W_MM / Math.max(1, rect.width),
    sy: PAGE_H_MM / Math.max(1, rect.height),
  };
}

function boxOf(el, pageRect, sx, sy) {
  const r = el.getBoundingClientRect();
  return {
    x: (r.left - pageRect.left) * sx,
    y: (r.top - pageRect.top) * sy,
    w: Math.max(0.1, r.width * sx),
    h: Math.max(0.1, r.height * sy),
  };
}

function fontSizePt(el, sy) {
  const px = parseFloat(getComputedStyle(el).fontSize) || 12;
  // px → mm via page scale, then mm → pt
  return Math.max(7, px * sy * (72 / 25.4));
}

function baselineY(box, sizePt) {
  const sizeMm = sizePt * (25.4 / 72);
  return box.y + sizeMm * 0.9;
}

function setFill(pdf, rgb) {
  pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function drawWrapped(pdf, text, x, y, maxWidth, sizePt, lineHeight = 1.35) {
  const lines = pdf.splitTextToSize(sanitize(text), Math.max(5, maxWidth));
  const leading = sizePt * (25.4 / 72) * lineHeight;
  pdf.text(lines, x, y);
  return lines.length * leading;
}

function drawImage(pdf, img, pageRect, sx, sy) {
  const box = boxOf(img, pageRect, sx, sy);
  const src = img.currentSrc || img.src;
  if (!src) return;
  let format = 'JPEG';
  if (/^data:image\/png/i.test(src) || /\.png(\?|$)/i.test(src)) format = 'PNG';
  else if (/^data:image\/webp/i.test(src)) format = 'PNG';
  try {
    pdf.addImage(src, format, box.x, box.y, box.w, box.h);
  } catch (err) {
    console.warn('CV PDF: skipped photo', err);
  }
}

function drawLinkLine(pdf, el, pageRect, sx, sy) {
  const box = boxOf(el, pageRect, sx, sy);
  const size = fontSizePt(el, sy);
  const y = baselineY(box, size);
  const a = el.querySelector('a[href]');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(size);

  if (!a) {
    setFill(pdf, INK);
    drawWrapped(pdf, el.textContent || '', box.x, y, box.w, size, 1.4);
    return;
  }

  const value = a.textContent || a.getAttribute('href') || '';
  const full = el.textContent || '';
  const idx = full.indexOf(value);
  const label = idx >= 0 ? full.slice(0, idx) : full.replace(value, '');
  const href = a.href || a.getAttribute('href') || '';

  setFill(pdf, INK);
  let x = box.x;
  if (label) {
    const safeLabel = sanitize(label);
    pdf.text(safeLabel, x, y);
    x += pdf.getTextWidth(safeLabel);
  }

  const safeValue = sanitize(value);
  setFill(pdf, LINK);
  pdf.textWithLink(safeValue, x, y, { url: href });
  const vw = pdf.getTextWidth(safeValue);
  pdf.setDrawColor(LINK[0], LINK[1], LINK[2]);
  pdf.setLineWidth(0.15);
  pdf.line(x, y + 0.4, x + vw, y + 0.4);
}

function drawExperienceSkills(pdf, el, pageRect, sx, sy) {
  const box = boxOf(el, pageRect, sx, sy);
  const size = fontSizePt(el, sy);
  const y = baselineY(box, size);
  const pad = 2.2;

  pdf.setDrawColor(RULE[0], RULE[1], RULE[2]);
  pdf.setLineWidth(0.45);
  pdf.line(box.x, box.y + 0.3, box.x, box.y + box.h - 0.2);

  const labelEl = el.querySelector('.cv-experience-skills-label');
  const label = labelEl?.textContent || '';
  const rest = (el.textContent || '').slice(label.length);
  let x = box.x + pad;

  pdf.setFontSize(size);
  if (label) {
    pdf.setFont('helvetica', 'bold');
    setFill(pdf, INK);
    const safe = sanitize(label);
    pdf.text(safe, x, y);
    x += pdf.getTextWidth(safe);
  }
  pdf.setFont('helvetica', 'normal');
  setFill(pdf, MUTED);
  drawWrapped(pdf, rest, x, y, box.w - pad - (x - box.x), size, 1.35);
}

function drawTextEl(pdf, el, pageRect, sx, sy, { font = 'helvetica', style = 'normal', color = INK, lineHeight = 1.4 } = {}) {
  const box = boxOf(el, pageRect, sx, sy);
  const size = fontSizePt(el, sy);
  const y = baselineY(box, size);
  pdf.setFont(font, style);
  pdf.setFontSize(size);
  setFill(pdf, color);
  drawWrapped(pdf, el.textContent || '', box.x, y, box.w, size, lineHeight);
}

function renderPage(pdf, pageEl) {
  const { rect, sx, sy } = pageScale(pageEl);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, PAGE_W_MM, PAGE_H_MM, 'F');

  pageEl.querySelectorAll('img.cv-portrait').forEach((img) => {
    drawImage(pdf, img, rect, sx, sy);
  });

  pageEl.querySelectorAll('h1').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { font: 'times', style: 'bold', color: INK, lineHeight: 1.2 });
  });

  pageEl.querySelectorAll('.cv-role').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { style: 'normal', color: MUTED, lineHeight: 1.3 });
  });

  pageEl.querySelectorAll('.cv-block-heading').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { font: 'times', style: 'bold', color: INK, lineHeight: 1.2 });
  });

  pageEl.querySelectorAll('.cv-prose p').forEach((el) => {
    if (el.closest('.cv-contact')) return;
    drawTextEl(pdf, el, rect, sx, sy, { color: INK, lineHeight: 1.5 });
  });

  pageEl.querySelectorAll('.cv-skills-grid li').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { color: MUTED, lineHeight: 1.3 });
  });

  pageEl.querySelectorAll('.cv-experience-title').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { style: 'bold', color: INK, lineHeight: 1.3 });
  });

  pageEl.querySelectorAll('.cv-experience-meta').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { color: FAINT, lineHeight: 1.3 });
  });

  pageEl.querySelectorAll('.cv-experience-desc').forEach((el) => {
    drawTextEl(pdf, el, rect, sx, sy, { color: INK, lineHeight: 1.45 });
  });

  pageEl.querySelectorAll('.cv-experience-skills').forEach((el) => {
    drawExperienceSkills(pdf, el, rect, sx, sy);
  });

  pageEl.querySelectorAll('.cv-contact p').forEach((el) => {
    drawLinkLine(pdf, el, rect, sx, sy);
  });
}

/**
 * Export each pre-paginated A4 page as a real text PDF (selectable + clickable links).
 * Photo remains an embedded image; everything else is drawn as PDF text.
 */
export async function exportCvPdf(filename) {
  const pages = [...document.querySelectorAll('#cv-preview .cv-a4-page[data-cv-page]')];
  if (!pages.length) {
    throw new Error('No CV pages found');
  }

  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* ignore */
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  for (let i = 0; i < pages.length; i += 1) {
    if (i > 0) pdf.addPage();
    renderPage(pdf, pages[i]);
  }

  pdf.save(filename);
}
