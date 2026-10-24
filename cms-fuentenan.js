(async function () {
  try {
    const response=await fetch('cms-pages/fuentenan.json',{cache:'no-store'});
    if(!response.ok)return;
    const data=await response.json();
    const root=document.getElementById('page');
    if(!root)return;
    const update=()=>{
      if(!location.hash.includes('/sources'))return;
      const target=root.querySelector('.source-warning');
      const lang=document.documentElement.lang==='en'?'en':'pap';
      const value=data[lang+'_warning'];
      if(target&&typeof value==='string'&&value.trim()&&target.textContent!==value)target.textContent=value;
    };
    new MutationObserver(update).observe(root,{childList:true,subtree:true});
    window.addEventListener('hashchange',update);
    update();
  } catch(error){console.warn('Fuentenan content unavailable; using original text.',error);}
})();
