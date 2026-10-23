/* Portada bilingual editorial overlay. Missing CMS content leaves the original approved HTML untouched. */
(async function () {
  try {
    const response = await fetch('cms-pages/portada.json', {cache:'no-store'});
    if (!response.ok) return;
    const data = await response.json();
    for (const [lang,key] of [['pap','pap_hero_intro'],['en','en_hero_intro']]) {
      const content = data[key];
      const element = document.querySelector('main[data-content="'+lang+'"] .hero p.lead');
      if (element && typeof content === 'string' && content.trim()) {
        element.textContent = content;
      }
    }
  } catch (error) {
    console.warn('Portada CMS unavailable; using original embedded text.', error);
  }
})();
