/* Share the current page. Prefer the device's native Share sheet when available. */
(function(){
'use strict';
const root=document.createElement('section');
root.className='wo-share';
root.setAttribute('aria-label','Share this page');
root.innerHTML='<div class="wo-share-inner"><h2 class="wo-share-heading"></h2><div class="wo-share-actions"><button class="wo-share-action" data-service="share" type="button"><span class="wo-share-icon" aria-hidden="true">↗</span><span class="wo-share-main-label"></span></button><a class="wo-share-action" data-service="facebook" target="_blank" rel="noopener noreferrer"><span class="wo-share-icon" aria-hidden="true">f</span><span>Facebook</span></a><a class="wo-share-action" data-service="linkedin" target="_blank" rel="noopener noreferrer"><span class="wo-share-icon" aria-hidden="true">in</span><span>LinkedIn</span></a><button class="wo-share-action" data-service="instagram" type="button"><span class="wo-share-icon" aria-hidden="true">◎</span><span>Instagram</span></button><button class="wo-share-action" data-service="copy" type="button"><span class="wo-share-icon" aria-hidden="true">⧉</span><span class="wo-copy-label"></span></button></div><p class="wo-share-note"></p><p class="wo-share-status" role="status" aria-live="polite"></p></div>';
const el=(selector)=>root.querySelector(selector);
const en=()=>document.documentElement.lang.toLowerCase().startsWith('en');
const url=()=>window.location.href;
const status=(english,papiamentu)=>{el('.wo-share-status').textContent=en()?english:papiamentu;};
function update(){
 root.setAttribute('aria-label',en()?'Share this page':'Kompartí e página aki');
 el('.wo-share-heading').textContent=en()?'Share this page':'Kompartí e página aki';
 el('.wo-share-main-label').textContent=en()?'Share…':'Kompartí…';
 el('.wo-copy-label').textContent=en()?'Copy link':'Kopia link';
 el('.wo-share-note').textContent=en()
  ?'On a phone, Share opens your device’s sharing options. Instagram does not support direct website sharing; you can copy the link.'
  :'Riba telefòn, Kompartí ta habri e opshonnan di bo aparato. Instagram no tin un opshon direkt pa kompartí wèpsait; bo por kopia e link.';
 const encoded=encodeURIComponent(url());
 el('[data-service="facebook"]').href='https://www.facebook.com/sharer/sharer.php?u='+encoded;
 el('[data-service="linkedin"]').href='https://www.linkedin.com/sharing/share-offsite/?url='+encoded;
 el('[data-service="instagram"]').setAttribute('aria-label',en()?'Open share options or copy the link for Instagram':'Habri opshonnan di kompartí òf kopia e link pa Instagram');
 el('.wo-share-status').textContent='';
}
async function copyLink(){
 const link=url();
 try{
  if(navigator.clipboard && window.isSecureContext)await navigator.clipboard.writeText(link);
  else{
   const field=document.createElement('textarea');
   field.value=link;field.setAttribute('readonly','');
   field.style.position='fixed';field.style.opacity='0';
   document.body.appendChild(field);field.select();
   const copied=document.execCommand('copy');field.remove();
   if(!copied)throw Error('copy unavailable');
  }
  status('Link copied. Paste it into the app where you want to share.','Link kopiá. Pega e den e app kaminda bo ke kompartié.');
 }catch(error){
  status('Copy the address from your browser to share it.','Kopia e adrès for di bo browser pa kompartié.');
 }
}
/* Must be called immediately inside a user click for iOS/Safari permission. */
function nativeShare(){
 if(typeof navigator.share!=='function')return false;
 try{
  const result=navigator.share({title:document.title,url:url()});
  Promise.resolve(result).catch(error=>{
   if(error && error.name==='AbortError')return;
   copyLink();
  });
  return true;
 }catch(error){return false;}
}
el('[data-service="share"]').addEventListener('click',()=>{
 if(!nativeShare())copyLink();
});
/* On devices with native sharing, use the real Share menu instead of navigating
   to a Facebook/LinkedIn URL that may redirect in an in-app browser.
   On desktop without native sharing, the anchors open the platform's web dialog. */
for(const service of ['facebook','linkedin']){
 el('[data-service="'+service+'"]').addEventListener('click',event=>{
  if(typeof navigator.share==='function'){
   event.preventDefault();
   if(!nativeShare())copyLink();
  }
 });
}
el('[data-service="instagram"]').addEventListener('click',()=>{
 if(!nativeShare())copyLink();
});
el('[data-service="copy"]').addEventListener('click',copyLink);
function init(){
 const footer=document.querySelector('footer');
 if(!footer||!footer.parentNode)return;
 footer.parentNode.insertBefore(root,footer);
 update();
 window.addEventListener('hashchange',update);
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
