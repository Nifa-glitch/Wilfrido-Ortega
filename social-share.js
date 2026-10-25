/* Page-level social sharing; no analytics, external widgets or dependencies. */
(function(){
'use strict';
const root=document.createElement('section');
root.className='wo-share';
root.setAttribute('aria-label','Share this page');
root.innerHTML='<div class="wo-share-inner"><h2 class="wo-share-heading"></h2><div class="wo-share-actions"><a class="wo-share-action" data-service="facebook" target="_blank" rel="noopener noreferrer"><span class="wo-share-icon" aria-hidden="true">f</span><span>Facebook</span></a><a class="wo-share-action" data-service="linkedin" target="_blank" rel="noopener noreferrer"><span class="wo-share-icon" aria-hidden="true">in</span><span>LinkedIn</span></a><button class="wo-share-action" data-service="instagram" type="button"><span class="wo-share-icon" aria-hidden="true">◎</span><span>Instagram</span></button><button class="wo-share-action" data-service="copy" type="button"><span class="wo-share-icon" aria-hidden="true">↗</span><span class="wo-copy-label"></span></button></div><p class="wo-share-note"></p><p class="wo-share-status" role="status" aria-live="polite"></p></div>';
function isEnglish(){return document.documentElement.lang.toLowerCase().startsWith('en')}
function url(){return window.location.href}
function update(){
 const en=isEnglish();
 root.setAttribute('aria-label',en?'Share this page':'Kompartí e página aki');
 root.querySelector('.wo-share-heading').textContent=en?'Share this page':'Kompartí e página aki';
 root.querySelector('.wo-copy-label').textContent=en?'Copy link':'Kopia link';
 root.querySelector('.wo-share-note').textContent=en?'Instagram: use your device’s share menu, or copy the link to share it in the app.':'Instagram: usa e menú di kompartí di bo aparato, òf kopia e link pa kompartié den e app.';
 const u=encodeURIComponent(url());
 root.querySelector('[data-service="facebook"]').href='https://www.facebook.com/sharer/sharer.php?u='+u;
 root.querySelector('[data-service="linkedin"]').href='https://www.linkedin.com/sharing/share-offsite/?url='+u;
 root.querySelector('[data-service="instagram"]').setAttribute('aria-label',en?'Share with device or copy link for Instagram':'Kompartí ku bo aparato òf kopia link pa Instagram');
 root.querySelector('.wo-share-status').textContent='';
}
async function copyLink(){
 const link=url();
 try{
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(link)}
  else{const field=document.createElement('textarea');field.value=link;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();if(!document.execCommand('copy'))throw Error('copy unavailable');field.remove()}
  root.querySelector('.wo-share-status').textContent=isEnglish()?'Link copied. Paste it into Instagram or another app.':'Link kopiá. Pega e den Instagram òf un otro app.';
 }catch(e){root.querySelector('.wo-share-status').textContent=isEnglish()?'Copy this page’s address from your browser.':'Kopia e adrès di e página for di bo browser.'}
}
root.querySelector('[data-service="copy"]').addEventListener('click',copyLink);
root.querySelector('[data-service="instagram"]').addEventListener('click',async function(){
 if(typeof navigator.share==='function'){
  try{await navigator.share({title:document.title,url:url()});return}
  catch(e){if(e.name==='AbortError')return}
 }
 await copyLink();
});
function init(){
 const footer=document.querySelector('footer');
 if(!footer||!footer.parentNode)return;
 footer.parentNode.insertBefore(root,footer);
 update();
 window.addEventListener('hashchange',update);
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
