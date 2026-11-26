(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;

  const plots = document.querySelectorAll('.encoder-panel > svg, [data-real-robot-plot], .recipe-plot-panel');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.target.dataset.barGrowth !== 'waiting') continue;
      // The robot plot is horizontally scrollable on narrow screens, so judge vertical entry separately.
      const viewportHeight = entry.rootBounds?.height ?? innerHeight;
      const minimumHeight = Math.min(.62 * entry.boundingClientRect.height, .52 * viewportHeight);
      if (entry.intersectionRect.height < minimumHeight) continue;
      entry.target.dataset.barGrowth = 'playing';
      observer.unobserve(entry.target);
    }
  }, {threshold: [.1, .2, .3, .4, .5, .6, .7, .8, .9], rootMargin: '0px 0px -44px'});

  for (const plot of plots) {
    plot.dataset.barGrowth = 'waiting';
    observer.observe(plot);
  }

  // Keyboard users should get the final bars and working tooltips immediately.
  document.addEventListener('focus', event => {
    const target = event.target.closest?.('.ir-paper-bar');
    if (!target) return;
    const plot = target.closest('.ir-paper-chart')
      .querySelector(`[data-real-robot-plot="${target.dataset.domain}"]`);
    if (!plot) return;
    delete plot.dataset.barGrowth;
    observer.unobserve(plot);
  }, {capture: true});

  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    for (const plot of plots) delete plot.dataset.barGrowth;
  });
})();
