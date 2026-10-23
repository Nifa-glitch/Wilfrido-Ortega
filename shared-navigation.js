/* Shared navigation for all six HTML files / seven main pages. */
(function(){
 'use strict';
 const keys=['home','life','work','bibliography','research','distribution','sources','about'];
 const pap=['Portada','Su historia','Su produktividat','Bibliografia','Investigashon','Distribushon','Fuentenan','Tokante'];
 const en=['Home','His life','His works','Bibliography','Research','Distribution','Sources','About'];
 const destinations=['index.html','su-bida.html','su-obra.html','catalogus.html#/bibliography','investigashon.html','catalogus.html#/distribution','catalogus.html#/sources','tokante.html'];
 function pageRoute(){let p=location.pathname.split('/').pop()||'index.html';if(p==='catalogus.html'){let r=(location.hash||'#/bibliography').slice(2).split('?')[0];return keys.includes(r)?r:'bibliography'}return {'index.html':'home','su-bida.html':'life','su-obra.html':'work','investigashon.html':'research','tokante.html':'about'}[p]||'home';}
 function currentLanguage(){return document.documentElement.lang.toLowerCase().startsWith('en')?'en':'pap';}
 function update(route,lang){let nav=document.getElementById('navigation');if(!nav)return;let names=lang==='en'?en:pap;let anchors=nav.querySelectorAll('a[data-nav-route]');if(anchors.length!==8){nav.innerHTML=keys.map((k,i)=>'<a data-nav-route="'+k+'" href="'+destinations[i]+'"></a>').join('');anchors=nav.querySelectorAll('a[data-nav-route]');}
  anchors.forEach((a,i)=>{a.textContent=names[i];a.href=destinations[i];a.classList.toggle('active',keys[i]===route);if(keys[i]===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 }
 window.WilfridoNavigation={update};
 document.addEventListener('DOMContentLoaded',function(){let nav=document.getElementById('navigation');if(!nav)return;update(pageRoute(),currentLanguage());
  const toggle=document.querySelector('.shared-menu-toggle');if(toggle)toggle.addEventListener('click',function(){const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  document.querySelectorAll('.lang [data-lang]').forEach(b=>b.addEventListener('click',()=>update(pageRoute(),b.dataset.lang)));
  window.addEventListener('hashchange',()=>update(pageRoute(),currentLanguage()));
 });
})();
