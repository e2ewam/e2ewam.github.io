(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  const charts = new Map();
  for (const chart of document.querySelectorAll('.scaling-panel > svg')) {
    const fit = chart.querySelector('.scaling-fit');
    const points = [...chart.querySelectorAll('.scaling-point')];
    if (!fit || points.length === 0) continue;

    const x1 = Number(fit.getAttribute('x1'));
    const x2 = Number(fit.getAttribute('x2'));
    const y1 = Number(fit.getAttribute('y1'));
    const y2 = Number(fit.getAttribute('y2'));
    if (x2 <= x1) continue;

    const drawTime = 1350;
    const fadeTime = 155;
    const observations = points.map(point => {
      const x = Number(point.querySelector('circle').getAttribute('cx'));
      return {point, arrive: drawTime * (x - x1) / (x2 - x1)};
    });
    const originalX2 = fit.getAttribute('x2');
    const originalY2 = fit.getAttribute('y2');
    let frame;
    let start;

    function finish() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      fit.setAttribute('x2', originalX2);
      fit.setAttribute('y2', originalY2);
      fit.style.removeProperty('opacity');
      points.forEach(point => point.style.removeProperty('opacity'));
      charts.delete(chart);
    }

    function draw(timestamp) {
      start ??= timestamp;
      const elapsed = timestamp - start;
      const fraction = Math.min(1, elapsed / drawTime);
      fit.style.opacity = fraction > 0 ? '1' : '0';
      fit.setAttribute('x2', x1 + fraction * (x2 - x1));
      fit.setAttribute('y2', y1 + fraction * (y2 - y1));

      for (const {point, arrive} of observations) {
        const phase = Math.max(0, Math.min(1, (elapsed - arrive) / fadeTime));
        point.style.opacity = 1 - (1 - phase) ** 2;
      }

      if (elapsed >= drawTime + fadeTime) finish();
      else frame = requestAnimationFrame(draw);
    }

    fit.style.opacity = '0';
    points.forEach(point => { point.style.opacity = '0'; });
    charts.set(chart, {start: () => { frame = requestAnimationFrame(draw); }, finish});
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const chart = entry.target;
      const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
      const minimumHeight = Math.min(.7 * entry.boundingClientRect.height, .65 * viewportHeight);
      if (!entry.isIntersecting || entry.intersectionRect.height < minimumHeight || !charts.has(chart)) continue;

      // Panels sharing a row use the same clock; stacked panels start independently.
      const rowTop = chart.closest('figure').getBoundingClientRect().top;
      for (const [peer, state] of charts) {
        if (state.playing || Math.abs(peer.closest('figure').getBoundingClientRect().top - rowTop) > 1) continue;
        state.playing = true;
        observer.unobserve(peer);
        state.start();
      }
    }
  }, {threshold: [0, .15, .25, .4, .55, .7], rootMargin: '0px 0px -24px'});

  charts.forEach((_, chart) => observer.observe(chart));
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    charts.forEach(state => state.finish());
  });
})();
