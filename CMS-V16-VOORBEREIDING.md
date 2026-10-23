# CMS v16 voorbereiding — inventaris

Werkbranch: `cms-v16-preparation` (afgeleid van `main`). De publieke website op `main` is ongewijzigd.

**Waarschuwing:** Deze branch bevat voorlopig nog de oude GitHub-site; v16 is bewust nog niet vervangen of gepubliceerd.

## Vastgesteld
- GitHub `main`: 6 bestanden (`README.md`, `app.js`, `bibliography-data.js`, `content.js`, `index.html`, `style.css`). De bibliografielijst in de GitHub-versie is leeg.
- v16 (lokaal gecontroleerd): 54 bestanden: 6 HTML, 8 JS, 9 CSS, 14 TXT en 17 afbeeldingen (PNG/JPEG).
- v16 `bibliography-data.js`: 212 bibliografische records.
- Catalogus bevat ingesloten code en verwijzingen naar bibliografie- en redactiedata. Ontkoppelen vereist regressietests.

## Bewaren
Alle teksten in Papiamentu en Engels, alle 212 records met alle velden, originele foto's/documenten, de 14 distributielocaties, kaart, zoek- en filterfuncties en de huidige navigatie.

## Kandidaten voor opschoning, NIET verwijderen zonder controle
- Oude `VERSION-*` / `LEES-MIJ-*` instructiedocumenten.
- Opeenvolgende oude CSS-lagen: `v9-*`, `v12-*`, `v13-*`, `v15-*`, `v16-*`, plus bestaande globale CSS.
- Oude navigatiecode `v6-navigation.js` (alleen als ongebruikt).
- Gedupliceerde datadefinities in `catalogus.html` na gecontroleerde migratie.

## Volgende stappen
1. Alle v16-bestanden op de werkbranch plaatsen, zonder `main` te wijzigen.
2. Bestands- en inhoudsvergelijking plus visuele/regressietests uitvoeren.
3. Redundante code gefaseerd consolideren.
4. Pages CMS voorbereiden met formulieren voor bibliografie, pagina's, talen en afbeeldingen.
5. Review via pull request; alleen na akkoord publiceren.

Er zijn nog geen sitebestanden verwijderd, CMS geïnstalleerd of veranderingen op `main` toegepast.
