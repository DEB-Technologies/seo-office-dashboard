/* Read-only importer for SEO Manager approval inbox artifacts. */
(() => {
  const fileInput = document.getElementById('report-file');
  const info = document.getElementById('report-info');
  const root = document.getElementById('tasks');
  const reset = document.getElementById('reset');
  if (!fileInput || !root) return;
  const safeText = value => value == null ? 'Niet beschikbaar' : String(value);
  function line(parent, label, value) {
    const p = document.createElement('p');
    const b = document.createElement('strong');
    b.textContent = label + ': ';
    p.append(b, document.createTextNode(safeText(value)));
    parent.append(p);
  }
  function renderReport(data) {
    root.replaceChildren();
    for (const task of data.tasks) {
      const card = document.createElement('article');
      card.className = 'task';
      const heading = document.createElement('h3');
      heading.textContent = safeText(task.agent) + ' · ' + safeText(task.issue);
      card.append(heading);
      line(card, 'Pagina', task.page_url);
      line(card, 'Actie', task.proposed_action);
      line(card, 'Status', task.status);
      if (task.issue === 'h1_count_not_one') {
        line(card, 'H1-aantal', task.evidence?.h1_count);
        line(card, 'H1-teksten', (task.evidence?.h1_texts || []).join(' | ') || 'Geen');
      }
      if (task.proposed_changes) {
        line(card, 'Veld', task.proposed_changes.field);
        line(card, 'Huidig', task.proposed_changes.before);
        line(card, 'Voorstel', task.proposed_changes.after);
      }
      const notice = document.createElement('p');
      notice.className = 'result';
      notice.textContent = '🔒 Alleen lezen · echte goedkeuring en publicatie niet beschikbaar';
      card.append(notice);
      root.append(card);
    }
    if (!data.tasks.length) {
      const p = document.createElement('p');
      p.textContent = 'Geen taken in dit rapport.';
      root.append(p);
    }
    reset.disabled = true;
    info.textContent = data.tasks.length + ' echte taken geladen uit lokaal JSON-rapport. Geen data verstuurd.';
    const counter = document.getElementById('task-counter');
    if (counter) counter.textContent = String(data.tasks.length).padStart(2, '0');
  }
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error('Bestand is groter dan 2 MB.');
      const data = JSON.parse(await file.text());
      if (!data || data.site !== 'autodaktenten.be' || data.mode !== 'review_only' ||
          !Array.isArray(data.tasks) || data.tasks.length > 500 ||
          data.tasks.some(t => !t || typeof t.page_url !== 'string' ||
            !t.page_url.startsWith('https://autodaktenten.be/') ||
            typeof t.issue !== 'string')) {
        throw new Error('Dit is geen geldig SEO-goedkeuringsrapport.');
      }
      renderReport(data);
    } catch (err) {
      info.textContent = 'Import mislukt: ' + err.message;
    }
  });
})();
