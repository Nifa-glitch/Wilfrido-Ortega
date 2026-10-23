const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

const read = p => fs.readFileSync(p, 'utf8');
const js = read('bibliography-data.js');
const html = read('catalogus.html');
function extract(text) {
  const prefix = 'window.BIBLIOGRAPHY_RECORDS = ';
  const i = text.indexOf(prefix);
  assert(i >= 0, 'Bibliography assignment missing');
  const fragment = text.slice(i + prefix.length);
  const end = fragment.indexOf('];');
  assert(end >= 0, 'Bibliography array terminator missing');
  return JSON.parse(fragment.slice(0, end + 1));
}
const records = extract(js);
const embedded = extract(html);
assert.equal(records.length,212);
assert.deepEqual(records,embedded,'Standalone and embedded bibliographies differ');
assert.equal(new Set(records.map(r=>r.id)).size,212);
for(const r of records) {
  assert(r.id && r.title,'Record ID/title missing');
  assert(Array.isArray(r.holdings),'Missing research holdings');
  assert(Array.isArray(r.inventoryRecords),'Missing original inventory');
  assert(Array.isArray(r.historicalRecords),'Missing historical record list');
}
const catalogCode = read('app.js');
for(const marker of ['function initBibliography()', "query.addEventListener('input'", 'Object.entries(filters)', "lang==='en'", "setLang('pap')", "setLang('en')"]) {
  assert(catalogCode.includes(marker), 'Missing catalog feature: '+marker);
}
for(const path of ['index.html','su-bida.html','su-obra.html','investigashon.html','tokante.html','catalogus.html']) {
  const page=read(path);
  assert(page.includes('shared-navigation.js'),path+' missing shared navigation');
  assert(page.includes('site-design.css'),path+' missing design system');
}
console.log('Static checks passed: 212 source records, two identical catalog data sources, search/filter/language handlers and 6 HTML page dependencies.');
console.log('NOTE: Browser-based interaction, responsive layout, and image rendering are not verified by this check.');
