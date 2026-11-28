(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mediaByTarget = new Map();
  const svgByTarget = new Map();
  const supportsObserver = 'IntersectionObserver' in window;

  function play(clip) {
    if (clip.ended) return;
    if (!clip.getAttribute('src')) clip.src = clip.dataset.src;
    clip.muted = true;
    clip.play().catch(() => {});
  }

  function setPlayback(target, inView) {
    const clip = mediaByTarget.get(target);
    if (clip) {
      if (inView) play(clip);
      else clip.pause();
    }
    if (target.hasAttribute('data-story-sequence')) {
      const animation = svgByTarget.get(target);
      const svg = animation?.ownerSVGElement;
      target.classList.toggle('is-paused', !inView);
      if (inView) svg?.unpauseAnimations?.();
      else svg?.pauseAnimations?.();
      if (inView && !clip && !target.classList.contains('is-playing')) {
        target.classList.add('is-playing');
        animation?.beginElement?.();
      }
    }
  }

  const motionInView = supportsObserver ? new IntersectionObserver(entries => {
    for (const {target, isIntersecting, intersectionRatio} of entries) {
      setPlayback(target, isIntersecting && intersectionRatio >= .26 && !motion.matches);
    }
  }, {threshold: [0, .26]}) : null;

  for (const group of document.querySelectorAll('[data-story-motion]')) {
    const sequences = [...group.querySelectorAll('[data-story-sequence]')];
    const clips = [...group.querySelectorAll('video[data-src]')];
    const targets = [...sequences];
    for (const sequence of sequences) {
      const animation = sequence.querySelector('[data-story-svg-animation]');
      if (animation) svgByTarget.set(sequence, animation);
    }
    for (const clip of clips) {
      const sequence = clip.closest('[data-story-sequence]');
      mediaByTarget.set(sequence || clip, clip);
      if (sequence) {
        clip.addEventListener('playing', () => {
          if (!motion.matches) sequence.classList.add('is-playing');
        });
      } else {
        targets.push(clip);
      }
    }
    const replay = group.querySelector('.story-replay');
    targets.forEach(target => motionInView?.observe(target));
    if (!replay || !targets.length) continue;
    replay.hidden = false;
    replay.addEventListener('click', () => {
      for (const target of targets) {
        if (!target.getClientRects().length) continue;
        const clip = mediaByTarget.get(target);
        if (clip) {
          clip.pause();
          if (clip.readyState) clip.currentTime = 0;
        }
        if (target.classList.contains('is-playing')) {
          target.classList.remove('is-playing');
          void target.offsetWidth;
        }
        if (motionInView && !motion.matches) {
          motionInView.unobserve(target);
          motionInView.observe(target);
        } else if (clip) {
          play(clip);
        } else if (!motion.matches) {
          setPlayback(target, true);
        }
      }
    });
  }
  motion.addEventListener('change', () => {
    if (motion.matches) {
      mediaByTarget.forEach(clip => clip.pause());
      svgByTarget.forEach(animation => animation.ownerSVGElement?.pauseAnimations?.());
    } else {
      for (const target of svgByTarget.keys()) {
        motionInView?.unobserve(target);
        motionInView?.observe(target);
      }
    }
  });

  const scale = document.getElementById('scaled-evaluation');
  if (!scale || motion.matches || !supportsObserver) return;
  const scaleInView = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    scale.dataset.animate = '';
    scaleInView.disconnect();
  }, {threshold: .25});
  scaleInView.observe(scale);
})();
