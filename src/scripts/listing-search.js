/**
 * Instant client-side filter for SSR listing pages (blog / TIL).
 * No React, no Fuse — filters already-rendered DOM nodes.
 */

function bindListingSearch(root = document) {
  root.querySelectorAll('[data-listing-search]').forEach((form) => {
    if (form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    const input = form.querySelector('[data-listing-input]');
    const list = form.parentElement?.querySelector('[data-listing-list]');
    if (!input || !list) return;

    const items = [...list.querySelectorAll('[data-listing-item]')];
    const groups = [...list.querySelectorAll('[data-listing-group]')];
    const empty = list.querySelector('[data-listing-empty]');

    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;

      items.forEach((item) => {
        const hay = (item.dataset.search || item.textContent || '').toLowerCase();
        const show = !q || hay.includes(q);
        item.hidden = !show;
        if (show) visible += 1;
      });

      groups.forEach((group) => {
        let el = group.nextElementSibling;
        let hasVisible = false;
        while (el && !el.hasAttribute('data-listing-group')) {
          if (el.hasAttribute('data-listing-item') && !el.hidden) {
            hasVisible = true;
            break;
          }
          el = el.nextElementSibling;
        }
        group.hidden = !hasVisible;
      });

      if (empty) empty.hidden = visible > 0;
    };

    input.addEventListener('input', apply);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      apply();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bindListingSearch());
} else {
  bindListingSearch();
}
