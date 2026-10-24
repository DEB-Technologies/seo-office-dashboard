/* Read-only importer for SEO Manager approval inbox artifacts. */
(() => {
  const fileInput = document.getElementById('report-file');
  const info = document.getElementById('report-info');
  const root = document.getElementById('tasks');
  const reset = document.getElementById('reset');
  if (!fileInput || !root) return;
  const dismissKey = 'seo-office-dismissed-v1';
  let dismissed = {};
  try { dismissed = JSON.parse(localStorage.getItem(dismissKey) || '{}') || {}; } catch { dismissed = {}; }
  let activeReport = null;
  function taskKey(prefix, url, issues) { return prefix + ':' + url + ':' + [...issues].sort().join('|'); }
  function dismissCard(card, key, rerender) {
    dismissed[key] = true;
    try { localStorage.setItem(dismissKey, JSON.stringify(dismissed)); } catch {}
    rerender();
  }
  function closeButton(card, key, rerender) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '×';
    button.title = 'Taak verbergen op dit apparaat';
    button.setAttribute('aria-label', 'Taak verbergen');
    button.style.cssText = 'position:absolute;top:10px;right:12px;border:0;background:transparent;color:#64748b;font-size:26px;line-height:1;cursor:pointer;padding:4px 9px';
    card.style.position = 'relative';
    card.style.paddingRight = '46px';
    button.addEventListener('click', () => dismissCard(card, key, rerender));
    card.append(button);
  }
  function restoreButton(rerender) {
    if (!Object.keys(dismissed).some(k => dismissed[k])) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'btn';
    button.textContent = '↶ Verborgen taken terugzetten';
    button.addEventListener('click', () => {
      dismissed = {};
      try { localStorage.removeItem(dismissKey); } catch {}
      rerender();
    });
    root.append(button);
  }
  const safeText = value => value == null ? 'Niet beschikbaar' : String(value);
  function line(parent, label, value) {
    const p = document.createElement('p');
    const b = document.createElement('strong');
    b.textContent = label + ': ';
    p.append(b, document.createTextNode(safeText(value)));
    parent.append(p);
  }
  function copyButton(parent, label, value) {
    if (typeof value !== 'string' || !value.trim()) return;
    const button = document.createElement('button');
    button.type = 'button';button.className = 'btn';
    button.textContent = '📋 Kopieer ' + label;
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(value); button.textContent = '✓ Gekopieerd'; }
      catch { button.textContent = 'Kopiëren mislukt · selecteer de tekst'; }
    });
    parent.append(button);
  }
  function renderCopyReport(data) {
    activeReport = data;
    root.replaceChildren();
    let visible = 0;
    for (const item of data.suggestions.filter(item => item.issues.some(x => ['long_title','missing_title','duplicate_title','long_meta_description','missing_meta_description','duplicate_meta_description'].includes(x)))) {
      const key = taskKey('copy', item.url, item.issues);
      if (dismissed[key]) continue;
      visible++;
      const card = document.createElement('article');card.className='task';
      closeButton(card, key, () => renderCopyReport(data));
      const heading=document.createElement('h3');heading.textContent='SEO-voorstel · '+item.url;card.append(heading);
      line(card,'Gevonden problemen',(item.issues||[]).join(', '));
      const issues = item.issues || [];
      const titleIssue = issues.some(x => ['long_title','missing_title','duplicate_title'].includes(x));
      const descIssue = issues.some(x => ['long_meta_description','missing_meta_description','duplicate_meta_description'].includes(x));
      if (titleIssue) {
        line(card,'Huidige SEO-titel',item.current_title||'Ontbreekt');
        line(card,'Voorgestelde SEO-titel',item.proposed_title||'Nog handmatig opstellen');
        copyButton(card,'SEO-titel',item.proposed_title);
      }
      if (descIssue) {
        line(card,'Huidige metabeschrijving',item.current_meta_description||'Ontbreekt');
        line(card,'Voorgestelde metabeschrijving',item.proposed_meta_description||'Nog handmatig opstellen');
        copyButton(card,'metabeschrijving',item.proposed_meta_description);
      }
      const notice=document.createElement('p');notice.className='result';
      notice.textContent='Alleen een concept op basis van bestaande metadata. Controleer inhoud en zoekintentie; plak zelf in WordPress/AIOSEO.';
      card.append(notice);root.append(card);
    }
    if(!visible){const p=document.createElement('p');p.textContent='Geen zichtbare SEO-voorstellen. Verborgen taken kun je hieronder terugzetten.';root.append(p)}
    restoreButton(() => renderCopyReport(data));
    if (reset) reset.disabled=true;
    info.textContent=visible+' SEO-voorstellen zichtbaar. Kruisje verbergt een taak alleen op dit apparaat.';
    const counter=document.getElementById('task-counter');if(counter)counter.textContent=String(visible).padStart(2,'0');
  }
  function renderReport(data) {
    root.replaceChildren();
    let visible = 0;
    for (const task of data.tasks) {
      const key = taskKey('inbox', task.page_url, [task.issue, task.proposed_changes?.field || '']);
      if (dismissed[key]) continue;
      visible++;
      const card = document.createElement('article');
      card.className = 'task';
      closeButton(card, key, () => renderReport(data));
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
        copyButton(card, task.proposed_changes.field === 'title' ? 'SEO-titel' : task.proposed_changes.field === 'meta_description' ? 'metabeschrijving' : 'voorstel', task.proposed_changes.after);
      }
      const notice = document.createElement('p');
      notice.className = 'result';
      notice.textContent = '🔒 Alleen lezen · echte goedkeuring en publicatie niet beschikbaar';
      card.append(notice);
      root.append(card);
    }
    if (!visible) {
      const p = document.createElement('p');
      p.textContent = 'Geen taken in dit rapport.';
      root.append(p);
    }
    restoreButton(() => renderReport(data));
    if (reset) reset.disabled = true;
    info.textContent = visible + ' echte taken geladen uit lokaal JSON-rapport. Geen data verstuurd.';
    const counter = document.getElementById('task-counter');
    if (counter) counter.textContent = String(visible).padStart(2, '0');
  }
  // Automatically show the latest sanitized public SEO proposals. Manual upload remains a fallback.
  async function loadLatestSuggestions() {
    try {
      const response = await fetch('seo-suggestions.json?ts=' + Date.now(), {cache: 'no-store'});
      if (!response.ok) throw new Error('Nog geen automatisch gepubliceerd rapport');
      const data = await response.json();
      if (!data || data.site_id !== 'autodaktenten' || data.mode !== 'read_only' ||
          !Array.isArray(data.suggestions) || data.suggestions.length > 500 ||
          data.suggestions.some(item => !item || typeof item.url !== 'string' ||
            !item.url.startsWith('https://autodaktenten.be/') ||
            !Array.isArray(item.issues) ||
            ['proposed_title', 'proposed_meta_description'].some(k => item[k] != null && typeof item[k] !== 'string'))) {
        throw new Error('Ongeldig automatisch rapport');
      }
      renderCopyReport(data);
      const updated = data.generated_at ? new Date(data.generated_at).toLocaleString('nl-BE') : 'onbekend';
      info.textContent = 'Automatisch SEO-rapport van ' + updated + ' · kruisje verbergt een taak op dit apparaat · geen WordPress-wijzigingen.';
    } catch (error) {
      info.textContent = 'Automatisch rapport nog niet beschikbaar. Je kunt voorlopig een JSON-bestand uploaden.';
    }
  }
  loadLatestSuggestions();
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error('Bestand is groter dan 2 MB.');
      const data = JSON.parse(await file.text());
      if (data && data.site_id === 'autodaktenten' && data.mode === 'read_only' && Array.isArray(data.suggestions)) {
        if (data.suggestions.length > 500 || data.suggestions.some(item => !item || typeof item.url !== 'string' ||
          !item.url.startsWith('https://autodaktenten.be/') ||
          !Array.isArray(item.issues) || ['proposed_title','proposed_meta_description'].some(k => item[k] != null && typeof item[k] !== 'string'))) {
          throw new Error('Ongeldig SEO-voorstellenrapport.');
        }
        renderCopyReport(data);return;
      }
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
