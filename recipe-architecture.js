(() => {
  'use strict';
  const figure = document.getElementById('recipe-architecture');
  if (!figure) return;

  const canvas = figure.querySelector('.recipe-architecture-canvas');
  const studies = figure.closest('#study').querySelector('.recipe-preview-grid');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const stageDuration = [1800, 1800, 2050, 900];
  let timer;
  let observer;
  let introFinished = false;

  function syncStudy() {
    if (!introFinished) return;
    const selected = studies.querySelector('[data-recipe-open][aria-expanded="true"]');
    figure.dataset.recipeStudy = selected?.dataset.recipeOpen ?? '';
  }

  function finishIntro() {
    clearTimeout(timer);
    observer?.disconnect();
    introFinished = true;
    figure.dataset.stage = '4';
    delete figure.dataset.recipeAnimating;
    syncStudy();
  }

  function playStage(index) {
    figure.dataset.stage = String(index + 1);
    const next = index + 1 < stageDuration.length ? () => playStage(index + 1) : finishIntro;
    timer = setTimeout(next, stageDuration[index]);
  }

  new MutationObserver(syncStudy).observe(studies, {subtree: true, attributeFilter: ['aria-expanded']});
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finishIntro();
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    finishIntro();
    return;
  }
  const threshold = .45;
  observer = new IntersectionObserver(entries => {
    if (introFinished || !entries.some(entry => entry.intersectionRatio >= threshold)) return;
    observer.disconnect();
    figure.dataset.recipeAnimating = '';
    playStage(0);
  }, {threshold, rootMargin: '0px 0px -25px'});
  figure.dataset.stage = '1';
  observer.observe(canvas);
})();
