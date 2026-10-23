(function(){
 const linkmap={home:'index.html',life:'su-bida.html',work:'su-obra.html',bibliography:'catalogus.html#/bibliography',distribution:'catalogus.html#/distribution',research:'investigashon.html',sources:'catalogus.html#/sources',about:'tokante.html'};
 function adjust(){const nav=document.getElementById('navigation');if(!nav)return;
 for(const a of nav.querySelectorAll('a[href^="#/"]')){const key=a.getAttribute('href').slice(2).split('?')[0];if(linkmap[key])a.href=linkmap[key];}
 }
 document.addEventListener('DOMContentLoaded',()=>{adjust();const nav=document.getElementById('navigation');if(nav)new MutationObserver(adjust).observe(nav,{childList:true,subtree:true});});
})();