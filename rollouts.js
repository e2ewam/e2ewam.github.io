(() => {
  'use strict';
  const root = document.getElementById('rollouts');
  const data = window.ROLLOUTS;
  if (!root || !data) return;

  const tasks = root.querySelector('.rollout-tasks');
  const conditions = root.querySelector('.rollout-conditions');
  const grid = root.querySelector('.rollout-grid');
  const notice = root.querySelector('.rollout-selection');
  const selection = {task: data.defaultTask || data.tasks[0].id, condition: 'indomain'};
  const records = new Map(data.episodes.map(e => [[e.task, e.condition, e.model, e.outcome].join('|'), e]));
  const unavailable = new Map((data.unavailable || []).map(e => [[e.task, e.condition, e.model, e.outcome].join('|'), e]));
  const cards = [];
  const playbackHelp = document.createElement('p');
  playbackHelp.id = 'rollout-playback-help';
  playbackHelp.className = 'rollout-playback-help';
  playbackHelp.textContent = 'Hover to play. Press Enter or Space, or tap, to play or pause.';
  root.append(playbackHelp);

  function button(label, selected, action) {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = label;
    el.setAttribute('aria-pressed', String(selected));
    el.addEventListener('click', action);
    return el;
  }
  function selectButton(container, value, getter) {
    [...container.children].forEach(el => el.setAttribute('aria-pressed', String(getter(el) === value)));
  }
  function release(card) {
    card.playAttempt = null;
    card.video.pause();
    card.video.removeAttribute('src');
    card.video.load();
    card.video.playbackRate = 1;
    card.speed.hidden = true;
    card.error.hidden = true;
  }
  function load(card) {
    if (!card.inView || document.hidden || !card.source || card.video.getAttribute('src')) return;
    card.video.src = card.source;
    card.video.preload = 'metadata';
    card.video.load();
  }
  function wantsPlayback(card) {
    return Boolean(card.episode && card.inView && !document.hidden && !card.userPaused && (card.hovered || card.manualPlaying));
  }
  function playbackState(card) {
    card.frame.setAttribute('aria-pressed', String(wantsPlayback(card) && !card.video.paused));
  }
  function updateSpeed(card) {
    const {video} = card;
    const segment = card.episode?.speed?.find(([from, until]) => video.currentTime >= from && video.currentTime < until);
    const rate = segment?.[2] ?? 1;
    if (video.playbackRate !== rate) video.playbackRate = rate;
    card.speed.textContent = `${rate}×`;
    card.speed.hidden = rate === 1 || video.paused;
  }
  function syncPlayback(card) {
    load(card);
    if (!wantsPlayback(card)) {
      card.playAttempt = null;
      card.video.pause();
      playbackState(card);
      return;
    }
    // A camera change must seek before playing its replacement source.
    if (!card.video.getAttribute('src') || (card.resumeAt > 0 && card.video.readyState < 1) || card.playAttempt || !card.video.paused) return;
    const attempt = {};
    card.playAttempt = attempt;
    const settled = () => {
      if (card.playAttempt !== attempt) return;
      card.playAttempt = null;
      if (!wantsPlayback(card)) card.video.pause();
      playbackState(card);
    };
    try { Promise.resolve(card.video.play()).then(settled, settled); }
    catch { settled(); }
  }
  function togglePlayback(card) {
    if (!card.episode) return;
    const pause = wantsPlayback(card) && (card.manualPlaying || !card.video.paused || Boolean(card.playAttempt) || card.resumeAt > 0);
    card.userPaused = pause;
    card.manualPlaying = !pause;
    syncPlayback(card);
  }
  function refreshHover(card) {
    card.hovered = window.matchMedia('(any-hover: hover)').matches && card.figure.matches(':hover');
  }
  function sourceFor(card, preserveTime = false) {
    const time = preserveTime ? card.resumeAt || card.video.currentTime : 0;
    release(card);
    card.source = '';
    window.applyVideoTone?.(card.video, '');
    card.resumeAt = 0;
    if (!preserveTime) {
      card.manualPlaying = false;
      card.userPaused = false;
    }
    delete card.video.dataset.source;
    card.video.removeAttribute('poster');
    card.video.hidden = !card.episode;
    card.empty.hidden = Boolean(card.episode);
    card.frame.classList.toggle('is-empty', !card.episode);
    card.frame.tabIndex = card.episode ? 0 : -1;
    card.frame.setAttribute('aria-disabled', String(!card.episode));
    card.frame.setAttribute('aria-pressed', 'false');
    card.viewLabel.hidden = !card.episode || Object.keys(card.episode.views).length === 1;
    card.viewButtons.forEach(el => {
      el.hidden = !card.episode?.views[el.dataset.view];
      el.disabled = el.hidden;
    });
    if (!card.episode) {
      const key = [selection.task, selection.condition, card.model.id, card.model.outcome].join('|');
      card.emptyTitle.textContent = unavailable.get(key)?.label || 'No rollout selected';
      card.frame.setAttribute('aria-label', `${card.model.label}: ${card.emptyTitle.textContent}`);
      return;
    }
    const poster = card.episode.posters?.[card.view] || (card.view === 'top' && card.episode.poster);
    if (poster) card.video.poster = poster;
    card.frame.setAttribute('aria-label', `${card.model.label}: ${task().label}, ${condition().label}, ${card.view[0].toUpperCase() + card.view.slice(1)} camera playback`);
    card.source = card.episode.views[card.view];
    window.applyVideoTone?.(card.video, card.source);
    card.video.dataset.source = card.source;
    card.resumeAt = Number.isFinite(time) ? time : 0;
    syncPlayback(card);
  }
  function task() { return data.tasks.find(t => t.id === selection.task); }
  function condition() { return task().conditions.find(c => c.id === selection.condition); }
  function renderConditions() {
    conditions.replaceChildren();
    task().conditions.forEach(c => {
      const el = button(c.label, c.id === selection.condition, () => {
        selection.condition = c.id;
        selectButton(conditions, c.id, b => b.dataset.condition);
        updateVideos();
      });
      el.dataset.condition = c.id;
      conditions.append(el);
    });
  }
  function updateVideos() {
    notice.textContent = `${task().label} · ${condition().label}`;
    cards.forEach(card => {
      const selectionKey = [selection.task, selection.condition, card.model.id].join('|');
      const record = records.get(`${selectionKey}|${card.model.outcome}`);
      card.episode = record && {...record, ...data.edits?.[selectionKey]};
      const preferred = card.episode?.defaultView || task().defaultView || 'top';
      card.view = card.episode?.views[preferred] ? preferred : Object.keys(card.episode?.views || {})[0];
      card.viewButtons.forEach(el => el.setAttribute('aria-pressed', String(el.dataset.view === card.view)));
      sourceFor(card);
    });
  }

  data.tasks.forEach(t => {
    const el = button(t.label, t.id === selection.task, () => {
      selection.task = t.id;
      if (!t.conditions.some(c => c.id === selection.condition)) selection.condition = 'indomain';
      selectButton(tasks, t.id, b => b.dataset.task);
      renderConditions();
      updateVideos();
    });
    el.dataset.task = t.id;
    tasks.append(el);
  });
  data.models.forEach(model => {
    const figure = document.createElement('figure');
    figure.className = 'rollout-player';
    figure.dataset.model = model.id;
    const title = document.createElement('figcaption');
    title.textContent = model.label;
    const frame = document.createElement('div');
    frame.className = 'rollout-frame';
    frame.setAttribute('role', 'button');
    frame.setAttribute('aria-describedby', playbackHelp.id);
    const video = document.createElement('video');
    video.controls = false;
    video.loop = true;
    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    video.preload = 'none';
    video.tabIndex = -1;
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    const speed = document.createElement('span');
    speed.className = 'rollout-speed';
    speed.setAttribute('aria-hidden', 'true');
    speed.hidden = true;
    const error = document.createElement('p');
    error.className = 'rollout-error';
    error.hidden = true;
    error.setAttribute('role', 'status');
    error.textContent = 'This video could not be loaded.';
    const empty = document.createElement('div');
    empty.className = 'rollout-empty';
    empty.hidden = true;
    empty.setAttribute('role', 'status');
    const emptyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    emptyIcon.setAttribute('viewBox', '0 0 40 40');
    emptyIcon.setAttribute('aria-hidden', 'true');
    emptyIcon.innerHTML = '<rect x="5" y="8" width="30" height="24" rx="5"/><path d="M15 20h10"/>';
    const emptyTitle = document.createElement('span');
    empty.append(emptyIcon, emptyTitle);
    const label = document.createElement('div');
    label.className = 'rollout-view';
    const viewCaption = document.createElement('span');
    viewCaption.className = 'rollout-view-label';
    viewCaption.textContent = 'View';
    const viewGroup = document.createElement('div');
    viewGroup.className = 'rollout-view-options';
    viewGroup.setAttribute('role', 'group');
    viewGroup.setAttribute('aria-label', `${model.label} camera view`);
    label.append(viewCaption, viewGroup);
    frame.append(video, speed, error, empty);
    figure.append(title, frame, label);
    grid.append(figure);
    const card = {model, figure, video, speed, view: 'top', viewButtons: [], error, empty, emptyTitle, frame, viewLabel: label, source: '', resumeAt: 0, inView: false, hovered: false, manualPlaying: false, userPaused: false, playAttempt: null};
    cards.push(card);
    figure.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      card.hovered = true;
      card.userPaused = false;
      syncPlayback(card);
    });
    figure.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      card.hovered = false;
      card.manualPlaying = false;
      card.userPaused = false;
      syncPlayback(card);
    });
    figure.addEventListener('pointercancel', () => {
      card.hovered = false;
      card.manualPlaying = false;
      syncPlayback(card);
    });
    figure.addEventListener('focusout', event => {
      if (figure.contains(event.relatedTarget)) return;
      card.manualPlaying = false;
      syncPlayback(card);
    });
    frame.addEventListener('click', () => togglePlayback(card));
    frame.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!event.repeat) togglePlayback(card);
    });
    [['top', 'Top'], ['left', 'Left'], ['right', 'Right']].forEach(([value, text]) => {
      const el = button(text, value === 'top', () => {
        if (card.view === value) return;
        card.view = value;
        card.viewButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === value)));
        sourceFor(card, true);
      });
      el.dataset.view = value;
      card.viewButtons.push(el);
      viewGroup.append(el);
    });
    video.addEventListener('loadedmetadata', () => {
      if (card.resumeAt > 0) video.currentTime = Number.isFinite(video.duration) ? Math.min(card.resumeAt, Math.max(0, video.duration - 0.1)) : card.resumeAt;
      card.resumeAt = 0;
      updateSpeed(card);
      syncPlayback(card);
    });
    video.addEventListener('timeupdate', () => updateSpeed(card));
    video.addEventListener('seeked', () => updateSpeed(card));
    video.addEventListener('error', () => { if (video.getAttribute('src')) error.hidden = false; });
    video.addEventListener('playing', () => {
      error.hidden = true;
      if (!wantsPlayback(card)) video.pause();
      playbackState(card);
    });
    for (const event of ['play', 'pause']) {
      video.addEventListener(event, () => { playbackState(card); updateSpeed(card); });
    }
  });
  renderConditions();
  updateVideos();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = cards.find(item => item.frame === entry.target);
        card.inView = entry.isIntersecting && entry.intersectionRatio > 0;
        refreshHover(card);
        syncPlayback(card);
      });
    }, {threshold: 0});
    cards.forEach(card => observer.observe(card.frame));
  } else {
    cards.forEach(card => {
      card.inView = true;
      refreshHover(card);
      syncPlayback(card);
    });
  }
  document.addEventListener('visibilitychange', () => {
    cards.forEach(card => {
      refreshHover(card);
      syncPlayback(card);
    });
  });
})();
