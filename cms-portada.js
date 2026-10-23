/* Portada bilingual editorial overlay. Missing CMS content leaves the original approved HTML untouched. */
(async function () {
  try {
    const response = await fetch('cms-pages/portada.json', {cache:'no-store'});
    if (!response.ok) return;
    const data = await response.json();
    const editable = [
      ['hero_intro', '.hero p.lead'],
      ['archive_heading', '.sec.alt h2'],
      ['destino_description', '.destino-feature h2 + p']
    ];
    for (const lang of ['pap','en']) {
      for (const [key,selector] of editable) {
        const content = data[lang+'_'+key];
        const element = document.querySelector('main[data-content="'+lang+'"] '+selector);
        if (element && typeof content === 'string' && content.trim()) {
          element.textContent = content;
        }
      }
    }
  } catch (error) {
    console.warn('Portada CMS unavailable; using original embedded text.', error);
  }
})();
