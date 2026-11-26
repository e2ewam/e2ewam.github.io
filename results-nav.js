'use strict';
const resultsNav = document.querySelector('.results-nav');
if (resultsNav) {
  const links = [...resultsNav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateResultsNav() {
    scheduled = false;
    const threshold = resultsNav.offsetHeight + 40;
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) current = index;
    });
    // A short final section cannot reach the top threshold on tall screens.
    const last = sections.length - 1;
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
        && sections[last]?.getBoundingClientRect().top < window.innerHeight) current = last;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateResultsNav); }
  }
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  updateResultsNav();
}
