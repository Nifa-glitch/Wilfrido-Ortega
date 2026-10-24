const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[];
 const missingImages=[];
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',response=>{if(response.status()===404 && /\.(png|jpe?g|webp|svg)(\?|$)/i.test(response.url()))missingImages.push(response.url())});
 const base='http://127.0.0.1:8765/';
 await page.goto(base+'catalogus.html#/bibliography',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1200);
 const search=page.locator('#bib-query');
 assert.equal(await search.count(),1,'Bibliography search missing');
 const count=page.locator('.bib-record');
 assert.equal(await count.count(),212,'Expected 212 catalog records');
 await search.fill('AIDS');
 assert((await count.count())>=1,'Search AIDS found no books');
 await search.fill('unlikely_nonexistent_bibliography_keyword_555');
 assert.equal(await count.count(),0,'Search no-results state incorrect');
 await search.fill('');
 const genre=page.locator('#bib-genre');
 assert(await genre.locator('option').count()>1,'Genre options missing');
 const opt=await genre.locator('option').nth(1).getAttribute('value');
 await genre.selectOption(opt);
 assert((await count.count())>0&&(await count.count())<212,'Genre filter not applied');
 await page.locator('#bib-clear').click();
 assert.equal(await count.count(),212,'Clear filters did not restore all records');
 const en=page.locator('#lang-en');
 assert.equal(await en.count(),1,'English language switch missing');
 await en.click();
 assert.equal(await page.locator('#lang-en').getAttribute('aria-pressed'),'true');
 assert((await page.locator('#bib-query').getAttribute('placeholder')||'').includes('Search'),'English catalog missing');
 await page.locator('#lang-pap').click();
 assert.equal(await page.locator('#lang-pap').getAttribute('aria-pressed'),'true');
 await page.screenshot({path:'/tmp/catalog-desktop.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(700);
 assert.equal(await count.count(),212,'Mobile catalog did not load');
 await page.screenshot({path:'/tmp/catalog-mobile.png',fullPage:false});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert(overflow<20,'Mobile horizontal overflow '+overflow);
 await page.goto(base+'index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(() => document.querySelector('main[data-content="pap"] .hero p.lead')?.textContent.includes('26 Oktober 1932'));
 assert(await page.locator('main[data-content="pap"] .hero p.lead').count()===1,'Portada pap introduction missing');
 assert(await page.locator('main[data-content="en"] .hero p.lead').count()===1,'Portada English introduction missing');
 for (const lang of ['pap','en']) {
   const json = require('../cms-pages/portada.json');
   for (const [key,selector] of [['archive_heading','.sec.alt h2'],['destino_description','.destino-feature h2 + p']]) {
     const value=await page.locator('main[data-content="'+lang+'"] '+selector).textContent();
     assert.equal(value,json[lang+'_'+key],'CMS value mismatch: '+lang+' '+key);
   }
 }
 await page.goto(base+'su-bida.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('main[data-content="en"] .hero p.lead')?.textContent.includes('26 October 1932'));
 assert.equal(await page.locator('main[data-content="pap"] .hero p.lead').textContent(),require('../cms-pages/su-historia.json').pap_hero_lead);
 assert.equal(await page.locator('main[data-content="en"] .hero p.lead').textContent(),require('../cms-pages/su-historia.json').en_hero_lead);
 await page.goto(base+'catalogus.html#/distribution',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#page .v5-dist .v5-intro > p')?.textContent.includes('Wilfrido'));
 assert.equal(await page.locator('#page .v5-dist .v5-intro > p').textContent(),require('../cms-pages/distribushon.json').pap_first_paragraph,'Distribushon CMS Papiamentu mismatch');
 await page.goto(base+'catalogus.html#/sources',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#page .source-warning')?.textContent.includes('October 2026')||document.querySelector('#page .source-warning')?.textContent.includes('òktober 2026'));
 const warning=await page.locator('#page .source-warning').textContent();
 assert([require('../cms-pages/fuentenan.json').pap_warning,require('../cms-pages/fuentenan.json').en_warning].includes(warning),'Fuentenan CMS content mismatch');
 for(const p of ['index.html','su-bida.html','su-obra.html','investigashon.html','tokante.html']) {
    await page.goto(base+p,{waitUntil:'domcontentloaded'});
    assert((await page.locator('body').innerText()).trim().length>100,p+' is blank');
 }
 // A CMS editing preview must update text without modifying the original HTML.
 const testPath='cms-pages/portada-full.json';
 const baseline=require('../'+testPath);
 await page.route('**/'+testPath,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...baseline,text_001:'CMS LIVE EDIT TEST — homepage text'})}));
 await page.goto(base+'index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('main')?.innerText.includes('CMS LIVE EDIT TEST'));
 assert((await page.locator('main[data-content="pap"]').innerText()).includes('CMS LIVE EDIT TEST'),'Full CMS text override did not appear');
 await page.unroute('**/'+testPath);
 assert.equal(missingImages.length,0,'Missing images: '+missingImages.join(' | '));
 // Verify contrast in dark sections; a light foreground must be computed
 // even when the design system imposes a dark heading or paragraph color.
 for (const route of ['index.html','tokante.html']) {
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   const samples=await page.locator('.sec.blue p, .sec.blue h2, .overview p, .overview h2, .question p').evaluateAll(nodes=>nodes.map(el=>{
     const c=getComputedStyle(el).color.match(/\d+(?:\.\d+)?/g)?.slice(0,3).map(Number)||[];
     return {text:el.textContent.trim().slice(0,45),brightness:c.reduce((a,b)=>a+b,0)/3,color:getComputedStyle(el).color};
   }));
   if(route==='tokante.html') assert(samples.length>0,route+' missing dark-section contrast samples');
   assert(samples.every(item=>item.brightness>155),route+' contains dark text on dark background: '+JSON.stringify(samples.filter(x=>x.brightness<=155)));
 }
 assert.equal(errors.length,0,'Browser JS errors: '+errors.join(' | '));
 await browser.close();
 console.log('PASS: desktop/mobile catalog, 212 records, search, no-results, genre filter, reset, language switch, six pages, no JS exceptions.');
})().catch(e=>{console.error(e);process.exit(1)});
