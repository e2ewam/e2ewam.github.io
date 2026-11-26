/* Fixed project palette; earlier comparison preferences no longer apply. */
(() => {
  'use strict';
  const settings = window.SITE_THEMES;
  if (!settings) return;
  const current = settings.default;
  document.documentElement.dataset.theme = current;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.themes[current].paper);
  // Remove the retired preview parameter without changing the current section.
  const url = new URL(location.href);
  if (url.searchParams.has('theme')) {
    url.searchParams.delete('theme');
    history.replaceState(null, '', url);
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-theme-chart]').forEach(image => {
      image.src = `assets/results-preview/themes/${current}/${image.dataset.themeChart}?v=20261118-paper`;
    });
  }, {once: true});
})();
