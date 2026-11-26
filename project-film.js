(() => {
  'use strict';

  const player = document.querySelector('.project-film-player');
  if (!player) return;

  const playButton = player.querySelector('.project-film-play');
  const video = player.querySelector('video');
  playButton.hidden = false;

  playButton.addEventListener('click', () => {
    playButton.hidden = true;
    video.focus({preventScroll: true});
    video.play().catch(() => {
      // The native controls are available for another playback attempt.
    });
  });
})();
