/* Run in the head to avoid flashing the finished hero before the opening. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (reduced.matches || (location.hash && location.hash !== '#top') ||
      navigation?.type === 'back_forward' || scrollY > 20) return;

  let finished = false;
  const animations = [];
  const listeners = [];
  let watchdog;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    root.classList.remove('intro-pending', 'intro-running');
    animations.forEach(animation => animation.cancel());
    document.getElementById('hero-intro')?.remove();
    listeners.forEach(([target, name, callback]) => target.removeEventListener(name, callback));
  }
  function listen(target, name, callback) {
    target.addEventListener(name, callback, {passive:true});
    listeners.push([target, name, callback]);
  }
  function animate(element, frames, options) {
    const animation = element.animate(frames, {fill:'both', ...options});
    // Cancellation can happen between the two phases, before their shared await.
    animation.finished.catch(() => {});
    animations.push(animation);
    return animation;
  }
  function sliceWord(source, pieces) {
    const text = source.firstChild;
    const phrase = document.createElement('span');
    phrase.className = 'intro-composed';
    text.replaceWith(phrase);
    phrase.append(text);
    source.classList.add('intro-slicing');

    // Measure and paint slices of the fully shaped phrase so the spacing does not
    // change when the individual letters become the finished title.
    const box = source.getBoundingClientRect();
    const range = document.createRange();
    let offset = 0;
    return pieces.map(([content, initial]) => {
      const start = offset;
      offset += content.length;
      range.setStart(text, start);
      range.setEnd(text, offset);
      const {left, right, width} = range.getBoundingClientRect();
      const clipStart = start === 0 ? '-.16em' : `${left - box.left}px`;
      const clipEnd = offset === text.length ? '-.16em' : `${box.right - right}px`;
      const fragment = document.createElement('span');
      fragment.className = 'intro-fragment';
      fragment.textContent = text.data;
      const clip = `inset(-.2em ${clipEnd} -.2em ${clipStart})`;
      const closed = `inset(-.2em ${box.right - left}px -.2em ${clipStart})`;
      fragment.style.clipPath = clip;
      source.append(fragment);
      return {fragment, initial, clip, closed, left, width, top:box.top, height:box.height};
    });
  }
  async function expandName(overlay, pairs) {
    const acronym = document.createElement('div');
    acronym.className = 'intro-acronym';
    acronym.setAttribute('aria-hidden', 'true');
    const letters = ['E', '2', 'E', 'W', 'A', 'M'].map(text => {
      const letter = document.createElement('span');
      letter.textContent = text;
      acronym.append(letter);
      return letter;
    });
    overlay.append(acronym);

    // Keep the five surviving initials as the visual anchors of the expansion.
    // The numeral becomes the connecting “-to-”; the second E settles into e.
    const anchors = [];
    const fragments = [];
    const words = [
      [['E', 0], ['nd'], ['-to-', 1], ['e', 2], ['nd']],
      [['W', 3], ['orld '], ['A', 4], ['ction '], ['M', 5], ['odel']]
    ];
    pairs.forEach(({source}, index) => {
      sliceWord(source, words[index]).forEach(slice => {
        if (slice.initial === undefined) fragments.push(slice);
        else anchors[slice.initial] = slice;
      });
    });
    // Make the runtime glyphs replace the CSS first-paint acronym in one frame.
    overlay.classList.add('intro-lettered');
    const starts = letters.map(letter => letter.getBoundingClientRect());
    if (anchors.some(rect => !rect.width || !rect.height)) throw new Error('Opening name has no layout');
    const stage = [];
    const hold = 330;
    const expand = 850;
    const ease = 'cubic-bezier(.22,.68,.18,1)';
    letters.forEach((letter, index) => {
      const start = starts[index], end = anchors[index];
      const connector = index === 1;
      // The numeral travels to the middle of its written-out connector, then contracts.
      const left = connector ? end.left + end.width / 2 - start.width / 2 : end.left;
      const scale = connector ? .58 : end.height / start.height;
      const landing = `translate(${left-start.left}px,${end.top-start.top}px) scale(${scale})`;
      stage.push(animate(letter, [
        {transform:'translate(0,0) scale(1)', opacity:1, offset:0},
        {transform:landing, opacity:1, offset:connector ? .66 : .84},
        {transform:landing, opacity:0, offset:1}
      ], {delay:hold, duration:expand, easing:ease}));
      stage.push(animate(end.fragment, [{opacity:0}, {opacity:1}], {
        delay:hold+(connector ? 380 : 680), duration:connector ? 400 : 170, easing:'ease-out'
      }));
    });
    fragments.forEach(({fragment, clip, closed}, index) => {
      stage.push(animate(fragment, [
        {clipPath:closed, opacity:0, transform:'translateX(-.16em)'},
        {clipPath:clip, opacity:1, transform:'translateX(0)'}
      ], {delay:hold+190+Math.min(index, 3)*40, duration:600, easing:ease}));
    });
    await Promise.all(stage.map(animation => animation.finished));
    pairs.forEach(({source}) => source.classList.remove('intro-slicing'));
    [...anchors, ...fragments].forEach(({fragment}) => fragment.remove());
    acronym.remove();
  }
  root.classList.add('intro-pending');
  // A failed script, missing font or background tab must never cover the site indefinitely.
  watchdog = setTimeout(finish, 5500);
  listen(window, 'pagehide', finish);
  listen(window, 'pageshow', event => { if (event.persisted) finish(); });
  listen(window, 'resize', finish);
  listen(window, 'hashchange', finish);
  listen(window, 'wheel', finish);
  listen(window, 'touchstart', finish);
  listen(window, 'scroll', () => { if (scrollY > 20) finish(); });
  listen(document, 'focusin', finish);
  listen(document, 'keydown', event => {
    if (['Tab', 'Escape', ' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) finish();
  });
  listen(document, 'visibilitychange', () => { if (document.hidden) finish(); });
  listen(reduced, 'change', event => { if (event.matches) finish(); });

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await document.fonts.ready;
      if (finished) return;
      if (scrollY > 20 || document.hidden) return finish();
      const overlay = document.getElementById('hero-intro');
      const pairs = ['end', 'model'].map(name => ({
        source: overlay?.querySelector(`[data-intro-word="${name}"]`),
        target: document.querySelector(`[data-intro-target="${name}"]`)
      }));
      if (pairs.some(pair => !pair.source || !pair.target)) return finish();

      root.classList.add('intro-running');
      await expandName(overlay, pairs);
      if (finished) return;

      // Measure after the real title has been laid out, including its invisible plural s.
      const measured = pairs.map(({source, target}) => ({source,
        start:source.getBoundingClientRect(), end:target.getBoundingClientRect(),
        font:getComputedStyle(target)}));
      if (measured.some(({end}) => !end.width || !end.height)) return finish();
      const hold = 350;
      const travel = 1450;
      const ease = 'cubic-bezier(.65,0,.25,1)';
      measured.forEach(({source, start, end, font}) => {
        // Relocate the original opening words, rather than crossfading two separate titles.
        overlay.append(source);
        Object.assign(source.style, {position:'absolute', left:`${end.left}px`, top:`${end.top}px`,
          fontFamily:font.fontFamily, fontSize:font.fontSize, fontWeight:font.fontWeight,
          lineHeight:font.lineHeight, letterSpacing:font.letterSpacing, wordSpacing:font.wordSpacing,
          fontKerning:font.fontKerning, fontOpticalSizing:font.fontOpticalSizing});
        animate(source, [
          {transform:`translate(${start.left-end.left}px,${start.top-end.top}px) scale(${start.width/end.width},${start.height/end.height})`},
          {transform:'translate(0,0) scale(1)'}
        ], {delay:hold, duration:travel, easing:ease});
      });
      overlay.querySelector('.intro-lockup').remove();
      animate(overlay.querySelector('.intro-plural'), [{opacity:0}, {opacity:1}],
        {delay:hold+450, duration:650});
      animate(overlay.querySelector('.hero-intro-curtain'), [{opacity:1}, {opacity:0}],
        {delay:hold+150, duration:1300, easing:'ease-in-out'});
      document.querySelectorAll('.title-copy').forEach(element => {
        // Reveal the first line early; adjacent words wait until the moving name clears them.
        const firstLine = document.getElementById('project-title').firstElementChild.contains(element);
        animate(element, [{opacity:0}, {opacity:1}], {
          delay:hold+(firstLine ? 350 : 1150), duration:firstLine ? 950 : 450, easing:'ease-in-out'
        });
      });
      document.querySelectorAll('.nav,.hero-content>:not(h1),.hero-bottom').forEach(element => {
        animate(element, [{opacity:0}, {opacity:1}], {delay:hold+1050, duration:750, easing:'ease-out'});
      });
      // Swap identical, aligned glyphs only after every part of the homepage has arrived.
      await Promise.all(animations.map(animation => animation.finished));
      finish();
    } catch {
      finish();
    }
  }, {once:true});
})();
