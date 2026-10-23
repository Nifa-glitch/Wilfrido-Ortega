/* Read-only original HTML fallback, CMS changes affect text only. */
(async function () {
  try {
    const result = await fetch('cms-pages/su-historia.json', {cache:'no-store'});
    if (!result.ok) return;
    const content = await result.json();
    for (const lang of ['pap','en']) {
      const text = content[lang+'_hero_lead'];
      const target = document.querySelector('main[data-content="'+lang+'"] .hero p.lead');
      if (target && typeof text === 'string' && text.trim()) target.textContent=text;
    }
  } catch (error) { console.warn('Su historia CMS unavailable; original text retained.', error); }
})();
