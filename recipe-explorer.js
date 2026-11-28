/* Browsing a study leaves the architecture and topic buttons in view. */
(() => {
  'use strict';

  const section = document.getElementById('study');
  if (!section) return;

  const details = section.querySelector('.recipe-hover-detail');
  const close = section.querySelector('[data-recipe-close]');
  if (!details || !close) return;
  const overview = section.querySelector('#recipe-overview');

  const entries = new Map();
  for (const button of section.querySelectorAll('[data-recipe-open]')) {
    const id = button.dataset.recipeOpen;
    const panel = document.getElementById(id);
    if (panel) entries.set(id, { button, panel });
  }

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let activeId = null;
  let pinned = false;
  let hoverTimer;

  function openStudy(id, focus = false) {
    const next = entries.get(id);
    if (!next) return;

    activeId = id;
    details.hidden = false;
    if (overview) overview.dataset.focus = id;
    for (const [entryId, entry] of entries) {
      const selected = entryId === id;
      entry.panel.hidden = !selected;
      entry.button.setAttribute('aria-expanded', String(selected));
    }
    if (focus) {
      next.panel.focus({ preventScroll: true });
      details.scrollIntoView({ block: 'start' });
    }
  }

  function closeStudy() {
    clearTimeout(hoverTimer);
    if (!activeId) return;

    const entry = entries.get(activeId);
    activeId = null;
    pinned = false;
    entry.panel.hidden = true;
    entry.button.setAttribute('aria-expanded', 'false');
    details.hidden = true;
    if (overview) delete overview.dataset.focus;
    entry.button.focus();

    if (entries.has(location.hash.slice(1))) {
      history.replaceState(null, '', `${location.pathname}${location.search}#study`);
    }
  }

  for (const [id, { button }] of entries) {
    button.addEventListener('mouseenter', () => {
      if (!finePointer.matches || pinned) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => openStudy(id), 180);
    });
    button.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
    button.addEventListener('click', () => {
      clearTimeout(hoverTimer);
      if (activeId === id && pinned) {
        closeStudy();
        return;
      }
      pinned = true;
      openStudy(id, true);
      if (entries.has(location.hash.slice(1))) {
        history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
      }
    });
  }

  for (const group of section.querySelectorAll('.recipe-view-switch')) {
    const switches = [...group.querySelectorAll('button[aria-controls]')];
    for (const button of switches) {
      button.addEventListener('click', () => {
        for (const choice of switches) {
          const selected = choice === button;
          const panel = document.getElementById(choice.getAttribute('aria-controls'));
          choice.setAttribute('aria-pressed', String(selected));
          if (panel) panel.hidden = !selected;
        }
      });
    }
  }

  close.addEventListener('click', closeStudy);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeId) {
      event.preventDefault();
      closeStudy();
    }
  });

  function fromHash() {
    const id = location.hash.slice(1);
    if (!entries.has(id)) return;
    clearTimeout(hoverTimer);
    pinned = true;
    openStudy(id);
    entries.get(id).panel.scrollIntoView({ behavior: 'instant' });
  }

  fromHash();
  window.addEventListener('hashchange', fromHash);
})();
