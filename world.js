/* 3D Office World controls. Presentation only: no WordPress writes or workflow changes. */
(() => {
  'use strict';
  const scene = document.querySelector('.scene');
  const world = document.querySelector('.world');
  if (!scene || !world) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let rotation = -45;
  let zoom = window.matchMedia('(max-width: 700px)').matches ? 0.65 : 0.94;
  let lighting = 0;
  const lights = ['day', 'evening', 'night'];
  const labels = ['☀ Daglicht', '◐ Avond', '☾ Nacht'];
  const controls = {
    left: document.getElementById('world-left'),
    right: document.getElementById('world-right'),
    in: document.getElementById('world-zoom-in'),
    out: document.getElementById('world-zoom-out'),
    expand: document.getElementById('world-expand'),
    light: document.getElementById('world-light')
  };
  function applyCamera() {
    world.style.transform = 'translate(-50%,-50%) rotateX(57deg) rotateZ(' + rotation + 'deg) scale(' + zoom.toFixed(2) + ')';
  }
  controls.left?.addEventListener('click', () => {rotation -= 15;applyCamera()});
  controls.right?.addEventListener('click', () => {rotation += 15;applyCamera()});
  controls.in?.addEventListener('click', () => {zoom = Math.min(1.2, zoom + 0.1);applyCamera()});
  controls.out?.addEventListener('click', () => {zoom = Math.max(0.45, zoom - 0.1);applyCamera()});
  controls.expand?.addEventListener('click', () => {
    const expanded = scene.classList.toggle('world-expanded');
    controls.expand.setAttribute('aria-pressed', String(expanded));
    controls.expand.textContent = expanded ? '⤡ Verklein' : '⤢ Vergroot';
  });
  controls.light?.addEventListener('click', () => {
    lighting = (lighting + 1) % lights.length;
    scene.classList.remove('evening', 'night');
    if (lighting) scene.classList.add(lights[lighting]);
    controls.light.textContent = labels[lighting];
  });
  // The badges remain marked as demo unless a verified, dated public status is available.
  const mode = document.getElementById('world-data-mode');
  const badges = {
    technical: document.querySelector('.agent-alert.a'),
    content: document.querySelector('.agent-alert.b'),
    wordpress: document.querySelector('.agent-alert.c'),
    analytics: document.querySelector('.agent-alert.d')
  };
  async function refreshBadges() {
    try {
      const response = await fetch('./status.json', {cache: 'no-store'});
      if (!response.ok) throw new Error('Missing status');
      const data = await response.json();
      const generated = Date.parse(data.generated_at);
      if (data.mode !== 'public_summary_only' || !Number.isFinite(generated) ||
          !data.agent_counts || typeof data.agent_counts !== 'object') throw new Error('Invalid status');
      const ageHours = (Date.now() - generated) / 3600000;
      if (ageHours < 0 || ageHours > 24 * 14) throw new Error('Stale status');
      for (const [agent, element] of Object.entries(badges)) {
        const count = data.agent_counts[agent];
        if (!element) continue;
        element.textContent = agent === 'wordpress'
          ? 'WordPress · publicatie uit'
          : Number.isInteger(count) && count >= 0
            ? ({technical:'Techniek',content:'Content',analytics:'Analytics'}[agent] + ' · ' + count + ' taken')
            : ({technical:'Techniek',content:'Content',analytics:'Analytics'}[agent] + ' · geen telling');
      }
      if (mode) mode.textContent = '● SEO-rapport · ' + new Date(generated).toLocaleDateString('nl-BE') + ' · alleen lezen';
    } catch (_) {
      if (mode) mode.textContent = '● Agentmeldingen · demo / geen recente data';
    }
  }
  refreshBadges();
  window.setInterval(refreshBadges, 300000);
  if (reducedMotion.matches) scene.classList.add('reduce-motion');
})();
