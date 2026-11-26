'use strict';
const project = window.PROJECT;
project.tasks = project.tasks.filter(task => ['lwm', 'pi05'].includes(task.model) && task.label === 'success' && task.view === 'top');
if (!project.tasks.length) throw new Error('No selected success videos in configuration');
const $ = id => document.getElementById(id);
$('project-title').setAttribute('aria-label', project.title);

(project.titleLines || [project.title]).forEach(line => {
  const span = document.createElement('span');
  const parts = line.split(/(Design Space|End-to-end|World Action Models)/g);
  parts.forEach(part => {
    const word = document.createElement('span');
    if (part === 'World Action Models') {
      word.className = 'keep-together title-model';
      const core = document.createElement('span');
      core.className = 'title-anchor';
      core.dataset.introTarget = 'model';
      core.textContent = 'World Action Model';
      const plural = document.createElement('span');
      plural.className = 'title-plural';
      plural.textContent = 's';
      word.append(core, plural);
    } else {
      word.className = part === 'End-to-end' ? 'keep-together title-anchor' : 'title-copy';
      if (part === 'End-to-end') word.dataset.introTarget = 'end';
      if (part === 'Design Space') word.classList.add('keep-together');
      word.textContent = part;
    }
    span.append(word);
  });
  $('project-title').append(span, document.createTextNode(' '));
});
$('author-note').textContent = project.note;
project.authors.forEach(author => {
  const el = document.createElement(author.url ? 'a' : 'span');
  el.textContent = author.name;
  if (author.url) {
    el.href = author.url;
    el.target = '_blank';
    el.rel = 'noopener';
  }
  const marker = [author.affiliation, author.marker].filter(value => value != null && value !== '').join('');
  if (marker) {
    const sup = document.createElement('sup');
    sup.textContent = marker;
    el.append(sup);
  }
  $('authors').append(el);
});
const affiliations = project.affiliations || [];
$('affiliations').hidden = affiliations.length === 0;
affiliations.forEach((affiliation, index) => {
  const el = document.createElement('span');
  el.textContent = `${index + 1} ${affiliation}`;
  $('affiliations').append(el);
});
project.resources.forEach(resource => {
  const el = document.createElement(resource.url ? 'a' : 'span');
  el.textContent = resource.label;
  if (resource.url) el.href = resource.url;
  else {
    el.className = 'unavailable';
    const status = document.createElement('small');
    status.textContent = 'SOON';
    el.append(status);
  }
  $('resources').append(el);
});

