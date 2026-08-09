/**
 * Robust copy-to-clipboard for code blocks.
 * Supports Clipboard API + textarea fallback, with success/error feedback.
 */

const LABEL = 'Copy';
const OK = 'Copied';
const FAIL = 'Copy failed';
const FEEDBACK_MS = 1800;

function copyWithExecCommand(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '0';
  ta.style.left = '0';
  ta.style.width = '1px';
  ta.style.height = '1px';
  ta.style.padding = '0';
  ta.style.border = 'none';
  ta.style.outline = 'none';
  ta.style.boxShadow = 'none';
  ta.style.background = 'transparent';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length);

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }

  if (!ok) {
    throw new Error('Clipboard unavailable');
  }
}

async function writeClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Permission / secure-context failures: fall through to legacy copy.
    }
  }

  copyWithExecCommand(text);
}

function codeTextFrom(pre) {
  const code = pre.querySelector('code');
  const raw = code ? code.innerText : pre.innerText;
  return raw.replace(/\n$/, '');
}

function setState(button, state) {
  button.classList.remove('is-success', 'is-error');
  if (state === 'success') {
    button.classList.add('is-success');
    button.textContent = OK;
    button.setAttribute('aria-label', 'Code copied to clipboard');
  } else if (state === 'error') {
    button.classList.add('is-error');
    button.textContent = FAIL;
    button.setAttribute('aria-label', 'Failed to copy code');
  } else {
    button.textContent = LABEL;
    button.setAttribute('aria-label', 'Copy code to clipboard');
  }
}

function attachButton(pre) {
  if (!pre || pre.classList.contains('mermaid')) return;
  if (pre.querySelector(':scope > .copy-code-button')) return;

  if (getComputedStyle(pre).position === 'static') {
    pre.style.position = 'relative';
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code-button';
  setState(button, 'idle');

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      await writeClipboard(codeTextFrom(pre));
      setState(button, 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      setState(button, 'error');
    } finally {
      window.setTimeout(() => {
        setState(button, 'idle');
        button.disabled = false;
      }, FEEDBACK_MS);
    }
  });

  pre.appendChild(button);
}

function enhanceAll() {
  document
    .querySelectorAll('pre.code.highlight, pre[class*="language-"], .markdown-code-block > pre')
    .forEach(attachButton);
}

class CopyCode extends HTMLElement {
  connectedCallback() {
    const block = this.closest('.markdown-code-block, .js-markdown-code');
    let pre = block?.querySelector('pre') ?? null;
    if (!pre && this.previousElementSibling?.matches?.('pre')) {
      pre = this.previousElementSibling;
    }
    if (pre) attachButton(pre);
  }
}

if (!customElements.get('copy-code')) {
  customElements.define('copy-code', CopyCode);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceAll);
} else {
  enhanceAll();
}
