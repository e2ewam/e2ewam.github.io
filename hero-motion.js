/* Muted hero players with lifecycle-safe recovery. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const wall = hero.querySelector('.video-wall');
  const featuredClip = wall.classList.contains('video-wall--single') ? window.PROJECT.hero : null;
  const clips = featuredClip ? [featuredClip] : window.PROJECT.tasks;
  const toggle = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Browser rejection is not a user pause. Keep those states separate.
  let userPaused = null;
  let suspended = false;
  const bounds = hero.getBoundingClientRect();
  let visible = bounds.bottom > 0 && bounds.top < innerHeight;
  const paused = () => userPaused ?? reduced.matches;
  const running = () => !paused() && !suspended && !document.hidden && visible;
  const stages = [];
  const startupLimit = 1600;
  let awaitingFirstPlayback = true;
  let startupTimer = null;
  const eligible = s => running() && s.visible;
  const needsPlay = () => {
    const shown = stages.filter(s => s.visible);
    return paused() || (shown.length > 0 && shown.every(s => s.blocked || s.failed));
  };

  function updateButton() {
    const stopped = needsPlay();
    toggle.textContent = stopped ? 'Play background ▷' : 'Pause background Ⅱ';
    toggle.setAttribute('aria-pressed', String(stopped));
  }
  function showFrame(s) {
    if (!awaitingFirstPlayback && s.video.readyState >= 2 && !s.video.seeking) s.tile.classList.add('has-frame');
  }
  function stop(s) {
    // Invalidate callbacks before pause() rejects an outstanding play promise.
    s.generation++;
    s.pending = null;
    s.video.autoplay = false;
    s.video.pause();
    s.stalledFor = 0;
  }
  function clearStartupTimer() {
    if (startupTimer !== null) clearTimeout(startupTimer);
    startupTimer = null;
  }
  function finishStartup() {
    clearStartupTimer();
    if (!running()) return;
    awaitingFirstPlayback = false;
    stages.forEach(play);
  }
  function checkStartupReadiness() {
    if (!awaitingFirstPlayback || !running()) return;
    const visiblePlayers = stages.filter(s => eligible(s) && !s.failed);
    if (!visiblePlayers.length) return;
    if (visiblePlayers.every(s => s.video.readyState >= 2)) finishStartup();
    else if (startupTimer === null) startupTimer = setTimeout(finishStartup, startupLimit);
  }
  function play(s) {
    if (!eligible(s) || s.failed || s.blocked || s.pending || !s.video.paused) return;
    if (!s.video.getAttribute('src')) s.video.src = s.task.heroVideo ?? s.task.video;
    if (awaitingFirstPlayback) return;
    s.video.muted = true;
    s.video.autoplay = true;
    const request = ++s.generation;
    s.pending = request;
    s.video.play().then(() => {
      if (request !== s.generation) return;
      s.blocked = false;
      showFrame(s);
    }).catch(error => {
      if (request !== s.generation) return;
      if (error.name === 'NotAllowedError') s.blocked = true;
      // AbortError is expected when leaving the hero or switching tabs.
    }).finally(() => {
      if (request !== s.generation) return;
      s.pending = null;
      retryWhenReady(s);
      updateButton();
    });
  }
  function retryWhenReady(s) {
    if (s.pending || s.readyRetried || !s.blocked || s.video.readyState < 3 || !eligible(s)) return;
    s.readyRetried = true;
    s.blocked = false;
    play(s);
  }
  function retry(s) {
    stop(s);
    if (s.retries++ < 2) {
      s.video.load();
      play(s);
    } else {
      s.failed = true;
      s.tile.classList.remove('has-frame');
    }
    updateButton();
  }
  function sync(recover = false) {
    stages.forEach(s => {
      s.stalledFor = 0;
      s.lastTime = s.video.currentTime;
      if (recover) s.blocked = false;
      if (eligible(s)) play(s);
      else stop(s);
    });
    if (running()) checkStartupReadiness();
    else clearStartupTimer();
    updateButton();
  }

  clips.forEach(task => {
    const slot = document.createElement('div');
    slot.className = 'video-slot';
    const tile = document.createElement('div');
    tile.className = 'video-tile';
    tile.style.backgroundImage = `url(${JSON.stringify(task.poster)})`;
    if (task.displayTreatment) tile.dataset.displayTreatment = task.displayTreatment;
    window.applyVideoTone?.(tile, task.video);
    const video = document.createElement('video');
    video.poster = task.poster;
    video.preload = 'metadata';
    video.loop = true;
    video.defaultPlaybackRate = featuredClip ? 1 : 1.4;
    video.playbackRate = video.defaultPlaybackRate;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.tabIndex = -1;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.dataset.source = task.heroVideo ?? task.video;
    const s = {task, slot, tile, video, visible:true, failed:false, blocked:false,
      retries:0, generation:0, pending:null, lastTime:0, stalledFor:0, readyRetried:false};
    video.addEventListener('playing', () => {
      if (!eligible(s)) stop(s);
      else if (!video.paused) { showFrame(s); updateButton(); }
    });
    video.addEventListener('timeupdate', () => {
      if (!video.paused && video.currentTime > 0) { s.blocked = false; updateButton(); }
      showFrame(s);
    });
    video.addEventListener('loadeddata', () => {
      checkStartupReadiness();
      showFrame(s);
    });
    video.addEventListener('seeked', () => showFrame(s));
    video.addEventListener('canplay', () => {
      // One retry once metadata and layout are ready; never policy-poll forever.
      retryWhenReady(s);
      play(s);
      checkStartupReadiness();
    });
    video.addEventListener('error', () => {
      if (eligible(s) && !s.failed && !s.blocked) retry(s);
    });
    tile.append(video);
    slot.append(tile);
    wall.append(slot);
    stages.push(s);
  });

  toggle.addEventListener('click', () => {
    userPaused = !needsPlay();
    if (!userPaused) {
      clearStartupTimer();
      awaitingFirstPlayback = false;
      stages.forEach(s => { s.failed = false; s.retries = 0; });
    }
    // play() must run in the click stack to retain browser user activation.
    sync(!userPaused);
  });
  document.addEventListener('click', event => {
    if (event.target === toggle || !running()) return;
    stages.forEach(s => { if (s.blocked) { s.blocked = false; play(s); } });
  });
  document.addEventListener('visibilitychange', () => sync(!document.hidden));
  window.addEventListener('pagehide', () => { suspended = true; sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(true); });
  const observer = new IntersectionObserver(entries => {
    let entering = false;
    entries.forEach(entry => {
      if (entry.target === hero) {
        entering ||= !visible && entry.isIntersecting;
        visible = entry.isIntersecting;
      } else {
        const s = stages.find(stage => stage.slot === entry.target);
        if (!s) return;
        if (!s.visible && entry.isIntersecting) s.blocked = false;
        s.visible = entry.isIntersecting;
      }
    });
    sync(entering);
  }, {threshold:0});
  observer.observe(hero);
  stages.forEach(s => observer.observe(s.slot));
  reduced.addEventListener('change', () => sync());

  setInterval(() => {
    stages.forEach(s => {
      // Safari may suspend off-screen media. Neither that nor a policy block
      // is a corrupt video, so do not burn through reload attempts for them.
      if (!eligible(s) || s.failed || s.blocked) return;
      if (s.video.currentTime !== s.lastTime) s.stalledFor = 0;
      else s.stalledFor += 2;
      s.lastTime = s.video.currentTime;
      if (s.video.paused && !s.pending) play(s);
      if (s.stalledFor > (s.video.readyState === 0 ? 35 : 12)) retry(s);
    });
  }, 2000);
  sync();
})();
