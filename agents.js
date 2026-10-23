/* Accessible agent detail panels. Read-only; no WordPress access. */
(() => {
  const descriptions = {
    technical: ['Technische SEO-agent', 'Controleert H1-koppen, titels, canonicals en crawlproblemen.'],
    content: ['Content-agent', 'Maakt concepten voor SEO-titels en metabeschrijvingen.'],
    wordpress: ['WordPress-agent', 'Publicatie is geblokkeerd tot een aparte beveiligde goedkeuringsflow bestaat.'],
    analytics: ['Rapportage-agent', 'Vat SEO-resultaten en prioriteiten samen.']
  };
  const detail = document.getElementById('agent-detail');
  const stationButtons = document.querySelectorAll('[data-agent]');
  if (!detail) return;
  function open(agent) {
    const [name, description] = descriptions[agent] || ['Agent', 'Geen informatie beschikbaar'];
    detail.replaceChildren();
    const heading = document.createElement('strong');
    heading.textContent = name;
    const body = document.createElement('p');
    body.textContent = description;
    body.style.cssText = 'font-size:11px;color:#c1d2e4;line-height:1.5';
    const close = document.createElement('button');
    close.textContent = 'Sluiten ×';
    close.className = 'btn';
    close.addEventListener('click', () => {detail.style.display = 'none'});
    detail.append(heading, body, close);
    detail.style.display = 'block';
  }
  for (const station of stationButtons) {
    station.addEventListener('click', () => open(station.dataset.agent));
    station.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();open(station.dataset.agent)}
    });
  }
})();
