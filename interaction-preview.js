(async () => {
  'use strict';
  // These anchors sit below the asynchronously rendered simulation chart.
  // Restore an initial deep link once the chart has its final height, unless
  // the reader has already started navigating.
  const initialHash = location.hash;
  const target = document.getElementById(initialHash.slice(1));
  const simulationSection = document.getElementById('simulation');
  const followAnchor = target && (simulationSection.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
  const navigation = new AbortController();
  if (followAnchor) {
    for (const event of ['pointerdown', 'touchstart', 'wheel', 'keydown', 'hashchange']) {
      window.addEventListener(event, () => navigation.abort(), {passive:true, signal:navigation.signal});
    }
  }
  const {modelMetadata, simulationTooltip} = await import('./model-metadata.js?v=20261125-gigabrain-hours');
  const tooltip = simulationTooltip();
  const response = await fetch('assets/results-preview/results-data.json?v=20261124-robotwin-comparison');
  if (!response.ok) throw new Error('Results unavailable');
  const {simulation} = await response.json();
  const panelOrder=['simulation-libero-random','simulation-robotwin-random'];
  const panels=panelOrder.map(id=>simulation.find(panel=>panel.id===id));
  const root = document.querySelector('#simulation');
  // The same renderer serves the homepage and the standalone preview.
  root.querySelectorAll('#benchmark-nav,.chart-toolbar,.chart-scroll,.pareto-grid,.pareto-legend,.pareto-note').forEach(n => n.remove());
  const nav = document.createElement('div'); nav.id = 'benchmark-nav'; nav.className = 'benchmark-nav';
  nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Simulation benchmark'); root.append(nav);
  const grid = document.createElement('div'); grid.className = 'pareto-grid'; root.append(grid);
  const cards = [], tabs = [];
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const entranceThreshold = 0.42;
  const chartObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const {target, intersectionRatio} of entries) {
      if (intersectionRatio < entranceThreshold || target.dataset.paretoState !== 'waiting') continue;
      target.dataset.paretoState = 'playing';
      chartObserver.unobserve(target);
    }
  }, {threshold: entranceThreshold, rootMargin: '0px 0px -24px'}): null;

  function finishEntrance(chart) {
    if (!chart) return;
    chartObserver?.unobserve(chart);
    delete chart.dataset.paretoState;
  }

  motion.addEventListener('change', () => {
    if (!motion.matches) grid.querySelectorAll('[data-pareto-state]').forEach(finishEntrance);
  });

  function select(index, focus=false) {
    tooltip.hide();
    cards.forEach((card,i) => {
      if (i !== index && !card.hidden) finishEntrance(card.querySelector('[data-pareto-state="playing"]'));
      card.hidden = i !== index;
    });
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===index)); tab.tabIndex = i===index ? 0 : -1; });
    if(focus) tabs[index].focus();
  }
  const NS='http://www.w3.org/2000/svg';
  function el(tag,attrs={},text){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
  const fmt=v=>Number(v.toFixed(2)).toString();
  const short={'Qwen-RobotManip Context':['Qwen-RobotManip'],'GigaBrain-0.7 (S1)':['GigaBrain-0.7'],'WorldScape Policy 2.0':['WorldScape 2.0'],'Xiaomi-Robotics-0':['Xiaomi-Robotics-0'],'Faster-WAM (DoT)':['Faster-WAM'],'Spatial Forcing':['Spatial Forcing']};
  await document.fonts.ready;
  const labelMeasure=document.createElement('canvas').getContext('2d');
  const fontFamily=getComputedStyle(root).fontFamily;
  const robotwinHours = {
    samples: [5000, 20000, 40000],
    radius: hours => 10 * Math.sqrt(hours / 10000),
    description: 'Circle area is proportional to embodied pretraining hours.'
  };
  const liberoHours = {
    samples: [10000, 40000, 100000],
    radius(hours) {
      // The manuscript compresses the high-hour tail and caps its largest marker.
      const scaledHours = Math.min(hours, 40000) + 0.35 * Math.max(hours - 40000, 0);
      return 8 * Math.min(Math.sqrt(scaledHours / 10000), 12.7 / 4.6);
    },
    description: 'Circle area grows in proportion to hours up to 40k, then at 35% of that rate. The largest marker (Being-H0.7) is capped.'
  };
  const axes = {
    'simulation-robotwin-random': {xmin:1, xmax:9, xticks:[1,2,4,6,8], ymin:-1, ymax:83, yticks:[0,20,40,60,80], hours:robotwinHours, tableOnly:['ME-DEX1.0']},
    'simulation-libero-random': {xmin:1, xmax:9, xticks:[2,4,6,8], ymin:48, ymax:101, yticks:[50,60,70,80,90,100], hours:liberoHours, tableOnly:['Cosmos Policy','WorldVLA','GE-Act']}
  };
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

  function zeroMark(cx, cy) {
    return el('path', {d:`M ${cx-4} ${cy-4} l8 8 m0 -8 l-8 8`, class:'pareto-zero'});
  }
  function drawComparison(card, panel, rows) {
    const svg=el('svg',{viewBox:'0 27 980 509',role:'group','aria-label':`${panel.benchmark}, ${panel.protocol}: model parameters versus success rate`});
    const scroller = document.createElement('div');
    scroller.className = 'pareto-scroll';
    scroller.append(svg);
    card.append(scroller);
    const originalAxis = axes[panel.id];
    const ymax = 5 * Math.ceil(Math.max(...rows.map(row => row.success_rate)) / 5);
    const axis = {...originalAxis, ymax, yticks: [...originalAxis.yticks.filter(tick => tick < ymax), ymax]};
    svg.dataset.yMax = String(ymax);
    const {radius, samples, description} = axis.hours;
    const x=v=>66+(v-axis.xmin)/(axis.xmax-axis.xmin)*880;
    const y=v=>436-(v-axis.ymin)/(axis.ymax-axis.ymin)*380;
    for(const r of rows)if(r.params<axis.xmin||r.params>axis.xmax||r.success_rate<axis.ymin||r.success_rate>axis.ymax)throw new Error(`Point outside axes: ${r.method}`);
    const oursRow=rows.find(r=>r.method==='E2EWAM');
    const ox=x(oursRow.params),oy=y(oursRow.success_rate);
    const distanceFromOurs = row => Math.hypot(x(row.params) - ox, y(row.success_rate) - oy);
    const peers = rows.filter(row => row !== oursRow).sort((a,b) => distanceFromOurs(a) - distanceFromOurs(b));
    const peerOrder = new Map(peers.map((row,index) => [row.method,index]));
    const patternId=`vl-hatch-${panel.id}`;
    const guideClipId=`pareto-guides-${panel.id}`;
    const defs=el('defs'),pattern=el('pattern',{id:patternId,width:6,height:6,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'});
    pattern.append(el('rect',{width:6,height:6,class:'pareto-hatch-bg'}),el('line',{x1:0,x2:0,y1:0,y2:6,class:'pareto-hatch-line','stroke-width':2}));
    const guideClip = el('clipPath',{id:guideClipId});
    guideClip.append(el('rect',{x:ox-2,y:oy-2,width:950-ox,height:440-oy,class:'pareto-guide-window'}));
    defs.append(pattern,guideClip);svg.append(defs);
    svg.append(el('text',{x:23,y:246,transform:'rotate(-90 23 246)','text-anchor':'middle',class:'pareto-axis-title'},'Success rate (%)'));
    for(const value of axis.yticks){svg.append(el('line',{x1:66,x2:946,y1:y(value),y2:y(value),class:'pareto-gridline'}));svg.append(el('text',{x:54,y:y(value)+5,'text-anchor':'end',class:'pareto-tick'},value));}
    for(const value of axis.xticks)svg.append(el('text',{x:x(value),y:462,'text-anchor':'middle',class:'pareto-tick'},`${value}B`));
    svg.append(el('text',{x:506,y:480,'text-anchor':'middle',class:'pareto-axis-title'},'Model parameters'));
    // Match the teaser: our operating point and its lower-right comparison region,
    // not a staircase connecting all non-dominated methods.
    const guides = el('g',{'clip-path':`url(#${guideClipId})`});
    guides.append(el('rect',{x:ox,y:oy,width:946-ox,height:436-oy,class:'pareto-domain-glow','aria-hidden':'true'}),
                  el('path',{d:`M ${ox} 436 V ${oy} H 946`,class:'pareto-reference','aria-label':'E2EWAM parameter and success reference'}));
    svg.append(guides);
    const pointGroup=el('g');svg.append(pointGroup);
    const pointBoxes=rows.map(r=>{const pad=(r.hours>0?radius(r.hours):5)+3;return {x:x(r.params)-pad,y:y(r.success_rate)-pad,w:pad*2,h:pad*2};});
    const labels=[];
    const ordered=[...rows].sort((a,b)=>(b.method==='E2EWAM')-(a.method==='E2EWAM')||b.success_rate-a.success_rate);
    for(const r of ordered){
      const cx=x(r.params),cy=y(r.success_rate),ours=r.method==='E2EWAM';
      const group=el('g',{class:`pareto-point${ours?' ours':''}`,'data-method':r.method,'data-radius':r.hours>0?radius(r.hours):4,role:'button','aria-label':`${r.method}: ${fmt(r.success_rate)}% success, ${r.params}B parameters. ${modelMetadata[r.method].pretrain} embodied pretraining.`});
      if (!ours) {
        const order = peerOrder.get(r.method);
        group.style.setProperty('--pareto-point-order', order);
        if (order === peers.length - 1) group.addEventListener('animationend', () => finishEntrance(scroller), {once:true});
      }
      group.append(el('circle',{cx,cy,r:12,fill:'transparent',class:'pareto-hit'}));
      if(r.hours===null)group.append(el('path',{d:`M ${cx} ${cy-6} l6 6 l-6 6 l-6 -6 Z`,class:'pareto-symbol'}));
      else if(r.hours===0)group.append(zeroMark(cx,cy));
      else{
        const bubble=el('circle',{cx,cy,r:radius(r.hours),class:'pareto-bubble'});
        // Hatching denotes explicitly quantified image–text data, as in the teaser.
        if(/M.*VL/.test(modelMetadata[r.method].extra||''))bubble.style.fill=`url(#${patternId})`;
        group.append(bubble);group.append(el('circle',{cx,cy,r:2.5,class:'pareto-center'}));
      }
      group.append(el('title',{},`${r.method} · ${fmt(r.success_rate)}% · ${r.params}B · ${modelMetadata[r.method].pretrain}`));
      // Place every label, avoiding other labels and data-point centers.
      const lines=ours ? [r.method, `${fmt(r.success_rate)}%`] : short[r.method]||[r.method];
      labelMeasure.font=`${ours?'700 16px':'400 15px'} ${fontFamily}`;
      const w=Math.max(...lines.map(line=>labelMeasure.measureText(line).width))+12,h=21*lines.length;
      let chosen=null,best=Infinity;
      const rr=r.hours>0?radius(r.hours):4;
      // Prefer adjacent horizontal labels; search farther only to resolve collisions.
      const offsets=[0,-h/2-rr-6,h/2+rr+6,-24,24,-48,48,-72,72,-96,96,-120,120,-144,144,-168,168,-192,192,-216,216];
      for(const sy of offsets)for(const dx of [rr+6,-w-rr-6,-w/2,30,-w-30,60,-w-60]){
        const box={x:cx+dx,y:cy+sy-h/2,w,h};
        if(box.x<70||box.x+w>940||box.y<20||box.y+h>434)continue;
        const conflicts=labels.filter(b=>overlap(box,b)).length;
        const covers=pointBoxes.filter(b=>overlap(box,b)).length;
        const edgeDistance=Math.hypot(Math.max(box.x-cx,0,cx-box.x-w),Math.max(box.y-cy,0,cy-box.y-h));
        const score=conflicts*1e6+covers*1e5+edgeDistance+Math.abs(sy)*.15;
        if(score<best){chosen=box;best=score;}
      }
      if(chosen){labels.push(chosen);const lx=chosen.x+4,ly=chosen.y+16;
        const anchorX=Math.max(chosen.x,Math.min(cx,chosen.x+w)),anchorY=Math.max(chosen.y,Math.min(cy,chosen.y+h));
        const distance=Math.hypot(anchorX-cx,anchorY-cy);
        if(distance>rr+9){const inset=Math.min(rr+2,distance);group.append(el('line',{x1:cx+(anchorX-cx)*inset/distance,y1:cy+(anchorY-cy)*inset/distance,x2:anchorX,y2:anchorY,class:'pareto-leader'}));}
        const text=el('text',{x:lx,y:ly,class:'pareto-label'});lines.forEach((line,i)=>text.append(el('tspan',{x:lx,dy:i?21:0},line)));group.append(text);
      }
      tooltip.attach(group,r.method,r.success_rate);
      pointGroup.append(group);
    }
    // Paint large bubbles first so small ones remain visible at overlapping coordinates.
    [...pointGroup.children].sort((a,b)=>Number(b.dataset.radius)-Number(a.dataset.radius)).forEach(node=>pointGroup.append(node));
    const oursNode=pointGroup.querySelector('.ours'); if(oursNode)pointGroup.append(oursNode);
    const hourKey = el('g', {role:'group', 'aria-label':description});
    hourKey.append(el('title', {}, description));
    hourKey.append(el('text',{x:66,y:517,class:'pareto-key-label'},'Embodied pretraining'));
    samples.forEach((hours, index) => {
      const cx = 286 + 104 * index;
      const r = radius(hours);
      hourKey.append(el('circle',{cx,cy:512,r,class:'pareto-area-key'}));
      hourKey.append(el('text',{x:cx+r+7,y:517,class:'pareto-key-label'},`${hours/1000}k h`));
    });
    svg.append(hourKey);
    svg.append(el('circle',{cx:624,cy:512,r:10,fill:`url(#${patternId})`,stroke:'var(--accent)'}),el('text',{x:642,y:517,class:'pareto-key-label'},'Extra pretraining'));
    svg.append(zeroMark(780,512),el('text',{x:794,y:517,class:'pareto-key-label'},'0 h'));
    if(rows.some(r=>r.hours===null))svg.append(el('path',{d:'M 861 506 l6 6 l-6 6 l-6 -6 Z',class:'pareto-symbol'}),el('text',{x:875,y:517,class:'pareto-key-label'},'Episodes'));

    if (chartObserver && motion.matches) {
      scroller.dataset.paretoState = 'waiting';
      // Observe the scroller so a wide, horizontally clipped plot still enters on mobile.
      chartObserver.observe(scroller);
      scroller.addEventListener('focusin', () => finishEntrance(scroller), {once:true});
    }
  }

  for(const panel of panels){
    const rows=panel.methods.map(row=>{
      const meta=modelMetadata[row.method]; if(!meta)throw new Error(`Missing model metadata: ${row.method}`);
      const params=Number.parseFloat(meta.size);
      const match=meta.pretrain.match(/^([\d,]+)(\+)? h$/);
      const hours=match?Number(match[1].replaceAll(',','')):null;
      if(!Number.isFinite(params)||params<0)throw new Error('Invalid model size');
      return {...row,params,hours};
    }).filter(row=>row.hours!==null || (panel.id==='simulation-robotwin-random' && row.method==='ME-DEX1.0')); // Explicitly requested episode-based comparison; never infer hours.

    const index = cards.length;
    const tab = document.createElement('button'); tab.className='bench'; tab.type='button'; tab.id=`tab-${panel.id}`;
    tab.setAttribute('role','tab'); tab.setAttribute('aria-controls',panel.id);
    for(const [name,text] of [['bench-name',panel.benchmark],['bench-protocol',panel.protocol]]) {
      const span=document.createElement('span'); span.className=name; span.textContent=text; tab.append(span);
    }
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      let target;
      if(event.key==='ArrowRight') target=(index+1)%panels.length;
      if(event.key==='ArrowLeft') target=(index+panels.length-1)%panels.length;
      if(event.key==='Home') target=0;
      if(event.key==='End') target=panels.length-1;
      if(target!==undefined){event.preventDefault();select(target,true);}
    });
    nav.append(tab);tabs.push(tab);
    const card=document.createElement('article');card.className='pareto-panel';card.id=panel.id;
    card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);cards.push(card);
    grid.append(card);
    drawComparison(card, panel, rows.filter(row => !axes[panel.id].tableOnly.includes(row.method)));
    const detail=document.createElement('details');detail.className='pareto-data';
    const summary=document.createElement('summary');summary.textContent='Compare all model scores';detail.append(summary);
    const table=document.createElement('table');table.innerHTML='<thead><tr><th>Model</th><th>Parameters</th><th>Success</th><th>Pretraining</th></tr></thead>';
    const body = document.createElement('tbody');
    for (const row of rows) {
      const tr = document.createElement('tr');
      const name = tr.insertCell();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'model-details-link';
      button.textContent = row.method;
      tooltip.attach(button, row.method, row.success_rate);
      name.append(button);
      for (const value of [`${row.params}B`, `${fmt(row.success_rate)}%`, modelMetadata[row.method].pretrain]) {
        tr.insertCell().textContent = value;
      }
      body.append(tr);
    }
    table.append(body); detail.append(table); card.append(detail);
  }
  select(0);
  if (followAnchor) {
    const align = () => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!navigation.signal.aborted && location.hash === initialHash) {
        target.scrollIntoView({block:'start', behavior:'instant'});
      }
      navigation.abort();
    }));
    if (document.readyState === 'complete') align();
    else window.addEventListener('load', align, {once:true});
  }

})().catch(error=>{console.error(error);document.querySelector('#simulation').append(Object.assign(document.createElement('p'),{textContent:'The local result data could not be loaded. Please refresh the preview.'}));});
