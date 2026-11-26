/* Apply the same display grade to a clip and its poster. Media bytes stay intact. */
(() => {
  'use strict';
  const namespace = 'http://www.w3.org/2000/svg';
  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(namespace, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }
  const svg = svgElement('svg', {class:'video-tone-defs','aria-hidden':'true',focusable:'false'});
  const defs = svgElement('defs');
  const filters = new Map();
  for (const [source, tables] of Object.entries(window.VIDEO_TONES)) {
    const name = 'share-video-grade-' + filters.size;
    const filter = svgElement('filter', {
      id:name, x:'0', y:'0', width:'100%', height:'100%', 'color-interpolation-filters':'sRGB'
    });
    const tone = svgElement('feComponentTransfer', {result:'exposure'});
    for (const [index, channel] of [...'RGB'].entries()) {
      tone.append(svgElement('feFunc'+channel, {type:'table', tableValues:tables[index].join(' ')}));
    }
    const shadowMask = svgElement('feComponentTransfer', {in:'inverseLight', result:'shadowMask'});
    shadowMask.append(svgElement('feFuncA', {type:'table', tableValues:'0 0 0 0 .06 .24 .61 .90 1'}));
    filter.append(tone,
      svgElement('feColorMatrix', {in:'exposure', type:'saturate', values:'.34', result:'neutralShadows'}),
      svgElement('feColorMatrix', {in:'exposure', type:'matrix', result:'inverseLight',
        values:'0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.2126 -.7152 -.0722 0 1'}),
      shadowMask,
      svgElement('feComposite', {in:'neutralShadows', in2:'shadowMask', operator:'in', result:'shadows'}),
      svgElement('feComposite', {in:'shadows', in2:'exposure', operator:'over'}));
    defs.append(filter);
    filters.set(source, name);
  }
  const heroProfiles = window.HERO_VIDEO_TONES;
  const heroFilterId = gamma => 'hero-video-tone-' + Math.round(gamma * 100);
  for (const gamma of new Set(Object.values(heroProfiles))) {
    if (gamma === 1) continue;
    const filter = svgElement('filter', {
      id:heroFilterId(gamma), x:'0', y:'0', width:'100%', height:'100%', 'color-interpolation-filters':'sRGB'
    });
    const transfer = svgElement('feComponentTransfer');
    for (const channel of 'RGB') {
      transfer.append(svgElement('feFunc' + channel, {
        type:'gamma', amplitude:'1', exponent:String(gamma), offset:'0'
      }));
    }
    filter.append(transfer);
    defs.append(filter);
  }
  svg.append(defs);
  document.body.append(svg);
  window.applyVideoTone = (element, source) => {
    if (element.classList.contains('video-tile')) {
      const gamma = heroProfiles[source] ?? 1;
      if (gamma === 1) element.style.removeProperty('filter');
      else element.style.filter = 'url("#' + heroFilterId(gamma) + '")';
      return;
    }
    const grade = filters.get(source);
    if (grade) {
      element.style.filter = 'url("#'+grade+'")';
      element.dataset.videoGrade=grade;
    } else {
      element.style.removeProperty('filter');
      delete element.dataset.videoGrade;
    }
  };
})();
