/* Text-only editorial override; original historical sources and page layout remain unchanged. */
(async function(){
 try {
  const response=await fetch('cms-pages/distribushon.json',{cache:'no-store'});
  if(!response.ok)return;
  const data=await response.json();
  const apply=()=>{
   if(!location.hash.includes('/distribution'))return;
   const target=document.querySelector('#page .v5-dist .v5-intro > p');
   const lang=document.documentElement.lang==='en'?'en':'pap';
   const value=data[lang+'_first_paragraph'];
   if(target&&typeof value==='string'&&value.trim()&&target.textContent!==value)target.textContent=value;
  };
  const root=document.getElementById('page');
  if(!root)return;
  const observer=new MutationObserver(apply);
  observer.observe(root,{childList:true,subtree:true});
  window.addEventListener('hashchange',apply);
  apply();
 } catch(e) { console.warn('Distribushon CMS unavailable: original content retained',e); }
})();
