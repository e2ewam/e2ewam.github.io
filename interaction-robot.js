// Keep hit targets aligned with the rendered chart's bar rectangles.
(async () => {
  const chart = document.querySelector('#real-robot .ir-paper-chart');
  if (!chart) return;
  const {simulationTooltip} = await import('./model-metadata.js?v=20261123-pretrain-6382');
  const response = await fetch(chart.dataset.barBounds || 'assets/paper-20261118/fig14-bars.json');
  if (!response.ok) throw new Error('Figure 14 model details unavailable');
  const bars = await response.json();
  const tooltip = simulationTooltip('realrobot-ood-tooltip');
  for (const {model, task, condition, score, bounds} of bars) {
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'ir-paper-bar';
    bar.dataset.domain = condition === 'ID' ? 'ID' : 'OOD';
    const label = condition === 'ID' ? 'In-distribution' : condition;
    const context = `${task} · ${label}`;
    bar.setAttribute('aria-label', `${context}, ${model}, ${score}% success`);
    const [left, top, width, height] = bounds;
    Object.assign(bar.style, {left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`});
    tooltip.attach(bar, model, score, context);
    chart.append(bar);
  }
})().catch(console.error);
