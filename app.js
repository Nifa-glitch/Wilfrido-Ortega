/* SITE LOGIC — edit content.js to change wording. No external frameworks required. */
(()=>{
 const routes=['home','life','work','bibliography','research','distribution','about'];
 const topicRoutes=['literatura','teatro','radio','musika'];
 let lang='pap';try{if(localStorage.getItem('wilfrido-language')==='en')lang='en'}catch(e){}
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const href=r=>`#/`+r;
 function getRoute(){const r=(location.hash||'#/home').slice(2).split('?')[0];return routes.includes(r)||topicRoutes.includes(r)?r:'home'}
 const card=(r,symbol,title,desc)=>`<a class="archive-card" href="${href(r)}"><span class="card-symbol" aria-hidden="true">${symbol}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></a>`;
 const heading=(k,title,lead)=>`<div class="page-heading container"><div class="eyebrow">${esc(k)}</div><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p></div>`;
 const pending=(label)=>`<div class="placeholder">${esc(label)}</div>`;
 const panel=(title,desc)=>`<article class="callout"><h3>${esc(title)}</h3><p>${esc(desc)}</p></article>`;
 function workCards(c){return card('literatura','✒','Literatura',c.work.literature)+card('teatro','◈','Teatro',c.work.theatre)+card('radio','◉','Radio Novela',c.work.radio)+card('musika','♫','Músika',c.work.music)}
 function partnerSection(c){return `<section class="partner-bar" id="partners"><div class="eyebrow">${esc(c.common.supported)}</div><div class="partners">${window.SITE_PARTNERS.map(p=>`<a class="partner" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.name)}<small>${esc(c.common.officialLogo)}</small></a>`).join('')}</div></section>`}
 function home(c){return `<section class="hero"><div><div class="eyebrow">${esc(c.home.kicker)}</div><h1>Wilfrido<br>Ortega</h1><p>${esc(c.home.intro)}</p><div class="btn-row"><a class="btn" href="#/work">${esc(c.home.explore)} →</a><a class="btn light" href="#/bibliography">${esc(c.home.browse)}</a></div></div><div class="hero-art"><span>${esc(c.home.picture)}</span></div></section><div class="ornament">✦ ✦ ✦</div><section class="section container"><div class="eyebrow">${esc(c.nav.work)}</div><h2>${esc(c.home.worktitle)}</h2><p class="lead">${esc(c.home.worklead)}</p><div class="grid four">${workCards(c)}</div></section><div class="band"><section class="section container feature-panel"><div><div class="eyebrow">${esc(c.nav.life)}</div><h2>${esc(c.home.story)}</h2><p>${esc(c.home.storylead)}</p><a class="btn" href="#/life">${esc(c.common.learn)} →</a></div>${pending(c.home.storypicture)}</section></div><section class="section container"><div class="eyebrow">${esc(c.nav.research)}</div><h2>${esc(c.home.researchtitle)}</h2><p class="lead">${esc(c.home.researchlead)}</p><div class="btn-row"><a class="btn light" href="#/bibliography">${esc(c.nav.bibliography)}</a><a class="btn light" href="#/distribution">${esc(c.nav.distribution)}</a></div></section>${partnerSection(c)}`}
 function bibliographyPage(c){
   const en=lang==='en';
   const ui=en?{search:'Search by title, series or reference',genre:'Genre',series:'Series',year:'Year',collection:'Collection',any:'All',reset:'Clear filters',empty:'No bibliography records have been published yet. The research catalogue is being prepared.',noMatch:'No records match these filters.',count:'records',source:'Source',status:'Verification',edition:'Edition / volume',collections:'Collections',method:'A holding in two libraries does not mean two different works. Editions, numbered parts and reprints will be documented separately.',waiting:'The search controls are ready; the verified inventory has not yet been imported.'}:{search:'Buska riba título, seri òf referensia',genre:'Género',series:'Seri',year:'Aña',collection:'Kolekshon',any:'Tur',reset:'Limpia filtro',empty:'Ainda no tin registronan bibliográfiko publiká. E katalogo ta den preparashon.',noMatch:'Ningun registro no ta kuadra ku e filternan.',count:'registro',source:'Fuente',status:'Verifikashon',edition:'Edishon / tomo',collections:'Kolekshonnan',method:'Un ehèmpel den dos biblioteka no ta nifiká dos obra diferente. Edishon, tomo i herdruk lo wòrdu dokumentá apart.',waiting:'E filternan ta kla; e inventario verifiká ainda no a wòrdu importá.'};
   return `${heading(c.bibliography.kicker,c.bibliography.title,c.bibliography.lead)}<section class="section container bib-section"><div class="bib-tools"><label class="bib-field bib-search"><span>${esc(ui.search)}</span><input type="search" id="bib-query" placeholder="${esc(ui.search)}…" autocomplete="off"></label>${[['genre',ui.genre],['series',ui.series],['year',ui.year],['collection',ui.collection]].map(([key,name])=>`<label class="bib-field"><span>${esc(name)}</span><select id="bib-${key}" data-filter="${key}"><option value="">${esc(ui.any)}</option></select></label>`).join('')}<button type="button" id="bib-clear" class="btn light">${esc(ui.reset)}</button></div><div class="bib-results-head"><span id="bib-count" aria-live="polite"></span></div><div id="bib-results" class="bib-results" aria-live="polite"></div><p class="notice">${esc(ui.method)}</p><p class="muted small">${esc(ui.waiting)}</p></section>`;
 }
 function initBibliography(){
   const raw=Array.isArray(window.BIBLIOGRAPHY_RECORDS)?window.BIBLIOGRAPHY_RECORDS:[];
   const records=raw.filter(r=>r&&typeof r==='object'&&String(r.title||'').trim());
   const query=document.getElementById('bib-query'),results=document.getElementById('bib-results'),count=document.getElementById('bib-count');
   if(!query||!results||!count)return;
   const en=lang==='en',label=en?{count:'records',empty:'No bibliography records have been published yet. The research catalogue is being prepared.',noMatch:'No records match these filters.',source:'Source',status:'Verification',collections:'Collections',edition:'Edition / volume'}:{count:'registro',empty:'Ainda no tin registronan bibliográfiko publiká. E katalogo ta den preparashon.',noMatch:'Ningun registro no ta kuadra ku e filternan.',source:'Fuente',status:'Verifikashon',collections:'Kolekshonnan',edition:'Edishon / tomo'};
   const selectors={genre:document.getElementById('bib-genre'),series:document.getElementById('bib-series'),year:document.getElementById('bib-year'),collection:document.getElementById('bib-collection')};
   const fields={genre:r=>[r.genre],series:r=>[r.series],year:r=>[r.year],collection:r=>Array.isArray(r.collections)?r.collections:[r.collections]};
   for(const [key,select] of Object.entries(selectors)){
     const values=[...new Set(records.flatMap(r=>fields[key](r).filter(Boolean).map(v=>String(v))))].sort((a,b)=>a.localeCompare(b,lang==='pap'?'nl':'en',{numeric:true}));
     for(const value of values){const opt=document.createElement('option');opt.value=value;opt.textContent=value;select.appendChild(opt)}
   }
   function refresh(){
     const q=query.value.trim().toLocaleLowerCase();
     const filtered=records.filter(r=>{
       const haystack=[r.title,r.series,r.genre,r.year,r.volume,r.edition,r.source,r.notes,...(Array.isArray(r.collections)?r.collections:[])].filter(Boolean).join(' ').toLocaleLowerCase();
       return (!q||haystack.includes(q))&&Object.entries(selectors).every(([key,select])=>!select.value||fields[key](r).map(String).includes(select.value))
     });
     count.textContent=`${filtered.length} ${label.count}`;
     results.innerHTML=filtered.length?filtered.map(r=>`<article class="bib-record"><div class="eyebrow">${esc([r.genre,r.year].filter(Boolean).join(' · '))}</div><h3>${esc(r.title)}</h3><div class="bib-meta">${[r.series,r.volume?('Tomo '+r.volume):'',r.edition].filter(Boolean).map(v=>`<span class="tag">${esc(v)}</span>`).join('')}</div>${r.collections?.length?`<p><strong>${esc(label.collections)}:</strong> ${esc(Array.isArray(r.collections)?r.collections.join(', '):r.collections)}</p>`:''}${r.source?`<p><strong>${esc(label.source)}:</strong> ${esc(r.source)}</p>`:''}${r.status?`<p><strong>${esc(label.status)}:</strong> ${esc(r.status)}</p>`:''}</article>`).join(''):`<div class="bib-empty">${esc(records.length?label.noMatch:label.empty)}</div>`;
   }
   query.addEventListener('input',refresh);
   Object.values(selectors).forEach(s=>s.addEventListener('change',refresh));
   document.getElementById('bib-clear').addEventListener('click',()=>{query.value='';Object.values(selectors).forEach(s=>s.value='');refresh();query.focus()});
   refresh();
 }
 function renderPage(route,c){if(route==='home')return home(c);
 if(topicRoutes.includes(route)){const t=c.topics[route];return `${heading(c.nav.work,t.title,t.lead)}<section class="section container"><div class="grid two">${panel(t.title,t.extra)}${route==='radio'?`<div class="audio-placeholder"><strong>Radio Novela</strong><p>${esc(t.audio)}</p><span>▶ ━━━━━━━━━━</span></div>`:pending(c.common.pending)}</div><p><a href="#/work">← ${esc(c.common.back)}</a></p></section>`}
 if(route==='work')return `${heading(c.work.kicker,c.work.title,c.work.lead)}<section class="section container"><div class="grid four">${workCards(c)}</div></section>`;
 if(route==='life')return `${heading(c.life.kicker,c.life.title,c.life.lead)}<section class="section container"><div class="grid two">${panel(c.life.timeline,c.life.timelineText)}${panel(c.life.photos,c.life.photosText)}</div><hr class="section-divider">${pending(c.common.pending)}</section>`;
 if(route==='bibliography')return bibliographyPage(c);
 if(route==='research')return `${heading(c.research.kicker,c.research.title,c.research.lead)}<section class="section container"><div class="grid three">${panel(c.research.sources,c.research.sourcesText)}${panel(c.research.connections,c.research.connectionsText)}${panel(c.research.uncertainty,c.research.uncertaintyText)}</div></section>`;
 if(route==='distribution')return `${heading(c.distribution.kicker,c.distribution.title,c.distribution.lead)}<section class="section container"><div class="map-placeholder"><strong>⌖</strong><div>${esc(c.distribution.map)}</div><span class="small">${esc(c.distribution.mapText)}</span></div><div class="section topic-head">${panel(c.distribution.sources,c.distribution.sourcesText)}</div></section>`;
 return `${heading(c.about.kicker,c.about.title,c.about.lead)}<section class="section container"><div class="grid two">${panel(c.about.credits,c.about.creditsText)}${pending(c.common.pending)}</div></section>${partnerSection(c)}`}
 function render(){const c=window.SITE_CONTENT[lang];document.documentElement.lang=lang;const route=getRoute();const nav=document.getElementById('navigation');nav.innerHTML=routes.map(r=>`<a ${r===route?'class="active" aria-current="page"':''} href="${href(r)}">${esc(c.nav[r])}</a>`).join('');document.getElementById('page').innerHTML=renderPage(route,c);if(route==='bibliography')initBibliography();document.getElementById('footer-copy').textContent=c.common.inDevelopment;document.getElementById('lang-pap').setAttribute('aria-pressed',String(lang==='pap'));document.getElementById('lang-en').setAttribute('aria-pressed',String(lang==='en'));document.getElementById('year').textContent=new Date().getFullYear();document.title=(route==='home'?'Wilfrido Ortega':(c.nav[route]||c.topics[route]?.title||'Wilfrido Ortega')+' | Wilfrido Ortega');nav.classList.remove('open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false')}
 document.getElementById('lang-pap').addEventListener('click',()=>setLang('pap'));document.getElementById('lang-en').addEventListener('click',()=>setLang('en'));
 function setLang(l){lang=l;try{localStorage.setItem('wilfrido-language',lang)}catch(e){}render()}
 document.getElementById('menu-toggle').addEventListener('click',()=>{const nav=document.getElementById('navigation');nav.classList.toggle('open');document.getElementById('menu-toggle').setAttribute('aria-expanded',String(nav.classList.contains('open')))});
 window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});render();
})();
