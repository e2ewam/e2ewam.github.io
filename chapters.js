(() => {
  'use strict';
  const flow = document.querySelector('.chapter-flow');
  if (!flow) return;

  const nav = flow.querySelector('.chapter-nav');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  let current = -1;
  let queued = false;

  function updateNav() {
    queued = false;
    const threshold = nav.getBoundingClientRect().bottom + Math.max(150, window.innerHeight * .2);
    let active = 0;

    sections.forEach((section, index) => {
      if (section?.getBoundingClientRect().top <= threshold) active = index;
    });

    if (active === current) return;
    links[current]?.removeAttribute('aria-current');
    const link = links[active];
    link.setAttribute('aria-current', 'location');
    current = active;

    const rail = link.closest('ul');
    const visible = rail.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.right > visible.right || item.left < visible.left) {
      rail.scrollLeft += item.left - visible.left - 20;
    }
  }

  function scheduleNav() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateNav);
  }

  window.addEventListener('scroll', scheduleNav, {passive: true});
  window.addEventListener('resize', scheduleNav);
  updateNav();

  if (!('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = flow.querySelectorAll(
    '.chapter-intro, .overview-teaser, .results-heading, #simulation, #real-robot, ' +
    '#study > .section-title, .recipe-hover-explorer, .evidence-heading, .evidence-lead, ' +
    '.encoder-comparisons, .rollouts-heading, .rollout-grid'
  );

  function show(target, animate) {
    if (!target.classList.contains('reveal-pending')) return;
    target.classList.remove('reveal-pending');
    if (animate) target.classList.add('reveal-entered');
    observer.unobserve(target);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) show(entry.target, !motion.matches);
    }
    scheduleNav();
  }, {rootMargin: '0px 0px -24px 0px'});

  function showAnchoredContent() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    for (const item of revealTargets) {
      if (target.contains(item) || item.contains(target)) show(item, false);
    }
    scheduleNav();
  }

  if (!motion.matches) {
    for (const target of revealTargets) {
      if (target.getBoundingClientRect().top < window.innerHeight) continue;
      target.classList.add('reveal-pending');
      observer.observe(target);
    }
  }

  flow.addEventListener('focusin', event => {
    const target = event.target.closest('.reveal-pending');
    if (target) show(target, false);
  });
  window.addEventListener('hashchange', showAnchoredContent);
  motion.addEventListener('change', () => {
    if (motion.matches) revealTargets.forEach(target => show(target, false));
  });
  showAnchoredContent();
})();
