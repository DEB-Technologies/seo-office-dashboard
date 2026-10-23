(() => {
  const panel = document.createElement('aside');
  panel.setAttribute('aria-live', 'polite');
  panel.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:1000;max-width:310px;padding:12px 16px;border:1px solid #35506c;border-radius:12px;background:#14263b;color:#e1efff;font:12px/1.5 system-ui;box-shadow:0 8px 24px #0005';
  panel.textContent = 'SEO-status wordt geladen...';
  document.body.appendChild(panel);
  async function refresh() {
    try {
      const response = await fetch('./status.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Geen status');
      const data = await response.json();
      if (data.mode !== 'public_summary_only' || !Number.isInteger(data.task_count) || data.task_count < 0) throw new Error('Ongeldige status');
      const date = Date.parse(data.generated_at);
      if (!Number.isFinite(date)) throw new Error('Ongeldige datum');
      panel.textContent = 'Laatste SEO-scan: ' + new Date(date).toLocaleString('nl-BE') + ' | Open taken: ' + data.task_count + ' | Alleen lezen';
    } catch (_) {
      panel.textContent = 'SEO-status: nog niet automatisch gekoppeld (demo)';
    }
  }
  refresh();
  setInterval(refresh, 300000);
})();
