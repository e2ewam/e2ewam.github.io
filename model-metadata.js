// Source: manuscript sections/04_experiments.tex, simulation comparison tables.
// Units and estimates are retained; 0 h refers to embodied pretraining only.
export const modelMetadata = {
  "π₀": {
    "size": "3.3B parameters",
    "pretrain": "10,000+ h",
    "extra": null
  },
  "π₀-FAST": {
    "size": "3.0B parameters",
    "pretrain": "10,000+ h",
    "extra": null
  },
  "RIPT-VLA": {
    "size": "7.6B parameters",
    "pretrain": "970K episodes",
    "extra": null
  },
  "OpenVLA-OFT": {
    "size": "7.6B parameters",
    "pretrain": "970K episodes",
    "extra": null
  },
  "X-VLA": {
    "size": "0.9B parameters",
    "pretrain": "290K episodes",
    "extra": null
  },
  "AVA-VLA": {
    "size": "7.7B parameters",
    "pretrain": "970K episodes",
    "extra": null
  },
  "VLA-JEPA": {
    "size": "2.3B parameters",
    "pretrain": "76K episodes",
    "extra": null
  },
  "ABot-M0": {
    "size": "4.6B parameters",
    "pretrain": "9,500+ h",
    "extra": null
  },
  "π₀.₅": {
    "size": "3.4B parameters",
    "pretrain": "10,000+ h",
    "extra": "VL: not reported"
  },
  "Qwen-RobotManip Context": {
    "size": "4.8B parameters",
    "pretrain": "38,100 h",
    "extra": "28M VL"
  },
  "WorldVLA": {
    "size": "7.0B parameters",
    "pretrain": "0 h",
    "extra": null
  },
  "Fast-WAM": {
    "size": "6.0B parameters",
    "pretrain": "0 h",
    "extra": null
  },
  "OpenWAM-α": {
    "size": "6.0B parameters",
    "pretrain": "6,369 h",
    "extra": null
  },
  "Faster-WAM (DoT)": {
    "size": "5.0B parameters",
    "pretrain": "0 h",
    "extra": null
  },
  "GE-Act": {
    "size": "2.2B parameters",
    "pretrain": "2,967 h",
    "extra": null
  },
  "Being-H0.7": {
    "size": "3.0B parameters",
    "pretrain": "215,000 h",
    "extra": "VL: not reported"
  },
  "Cosmos Policy": {
    "size": "2.0B parameters",
    "pretrain": "0 h",
    "extra": null
  },
  "InternW0-Δ": {
    "size": "8.4B parameters",
    "pretrain": "20,000+ h",
    "extra": null
  },
  "E2EWAM": {
    "size": "1.6B parameters",
    "pretrain": "6,382 h",
    "extra": null
  },
  "Xiaomi-Robotics-0": {
    "size": "4.7B parameters",
    "pretrain": "200M timesteps",
    "extra": "80M+ VL"
  },
  "Spatial Forcing": {
    "size": "3.4B parameters",
    "pretrain": "10,000+ h",
    "extra": "VL: not reported"
  },
  "GigaBrain-0.7 (S1)": {
    "size": "3.5B parameters",
    "pretrain": "37,257 h",
    "extra": "272M VL"
  },
  "AHA-WAM": {
    "size": "7.2B parameters",
    "pretrain": "0 h",
    "extra": null
  },
  "X-WAM": {
    "size": "6.7B parameters",
    "pretrain": "5,874 h",
    "extra": null
  },
  "LingBot-VA": {
    "size": "5.3B parameters",
    "pretrain": "16,000 h",
    "extra": null
  },
  "4D-WAM": {
    "size": "5.3B parameters",
    "pretrain": "16,000 h",
    "extra": null
  },
  "WorldScape Policy 2.0": {
    "size": "5.6B parameters",
    "pretrain": "4,983 h",
    "extra": null
  },
  "ME-DEX1.0": {
    "size": "6.3B parameters",
    "pretrain": "1.01M episodes (est.)",
    "extra": "23K tactile episodes (est.)"
  }
};

export function metadataList(method) {
  const data = modelMetadata[method];
  const list = document.createElement('dl');
  list.className = 'ir-tooltip-conditions';
  if (!data) return list;
  for (const [label, value] of [['Model size', data.size], ['Embodied pretrain', data.pretrain], ['Extra pretrain', data.extra]]) {
    if (!value) continue;
    const row = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    row.append(dt, dd); list.append(row);
  }
  return list;
}

export function simulationTooltip(id = 'simulation-model-tooltip') {
  const tip = document.createElement('div');
  tip.className = 'ir-tooltip'; tip.id = id;
  tip.setAttribute('role', 'tooltip'); tip.hidden = true;
  document.body.append(tip);
  let active;
  let keyboard = false;
  function hide() {
    active?.removeAttribute('aria-describedby'); active = null; tip.hidden = true;
  }
  function show(node, method, score, context) {
    hide(); active = node;
    const title = document.createElement('strong'); title.textContent = method + (score === undefined ? '' : ` · ${Number(score.toFixed(2))}%`);
    title.className = 'ir-tooltip-task';
    tip.replaceChildren(title);
    if (context) {
      const description = document.createElement('p');
      description.className = 'ir-tooltip-model';
      description.textContent = context;
      tip.append(description);
    }
    tip.append(metadataList(method)); tip.hidden = false;
    node.setAttribute('aria-describedby', tip.id);
    position(node);
  }
  function position(node) {
    const anchor = (node.querySelector('.bar-body, .pareto-hit') || node).getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(8, Math.min(anchor.left + anchor.width / 2 - box.width / 2, innerWidth - box.width - 8))}px`;
    tip.style.top = `${Math.max(8, anchor.top - box.height - 10)}px`;
  }
  window.addEventListener('scroll', () => {
    if (active && keyboard && active === document.activeElement) {
      const anchor = active.getBoundingClientRect();
      if (anchor.bottom > 0 && anchor.top < innerHeight) { position(active); return; }
    }
    hide();
  }, {capture:true, passive:true});
  window.addEventListener('resize', hide);
  document.addEventListener('keydown', e => {keyboard = true; if (e.key === 'Escape') hide();}, true);
  document.addEventListener('pointermove', e => {if (e.movementX || e.movementY) keyboard = false;}, {passive:true});
  document.addEventListener('pointerdown', e => {keyboard = false; if (!active?.contains(e.target)) hide();});
  return {hide, attach(node, method, score, context) {
    node.setAttribute('tabindex', '0');
    node.addEventListener('pointerenter', () => {if (!keyboard) show(node, method, score, context);});
    node.addEventListener('pointerleave', () => {if (!keyboard && active === node) hide();});
    node.addEventListener('focus', () => show(node, method, score, context));
    node.addEventListener('blur', hide);
    node.addEventListener('click', () => show(node, method, score, context));
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(node, method, score, context); }
    });
  }};
}
