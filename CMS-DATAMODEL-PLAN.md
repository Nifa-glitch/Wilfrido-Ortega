# Pages CMS — migratieontwerp (werkbranch)

Status: **voorbereiding; Pages CMS is nog niet actief**. De publieke `main`-branch wordt niet gewijzigd.

## Huidige opbouw (gecontroleerd op cms-v16-preparation)
- `bibliography-data.js` bevat `window.BIBLIOGRAPHY_RECORDS` met 212 records.
- Records bevatten onder meer `id`, `title`, `variant`, `genre`, `year`, `series`, `volume`, `image`, `references`, `collections`, `holdings`, `inventoryRecords`, `historicalRecords` en andere onderzoeksvelden.
- `editorial-data.js` bevat tweetalige redactionele tekst, inclusief Distribushon.
- De website is grotendeels statische HTML + JavaScript; veel tekst staat ingebed in HTML.

## Veilig CMS-datamodel
1. Bewaar altijd een onveranderde export van alle 212 originele records voor controle.
2. Gebruik een per-record JSON-collectie (`cms/bibliography/<id>.json`), met stabiele `id` en behoud van **alle** originele velden.
3. Maak het reguliere redacteursformulier overzichtelijk: titel, auteur, serie, deel, jaar, genre, uitgever, vindplaats/collectie, beschrijving, omslag.
4. Behandel bronvermeldingen, holdings en originele inventarisrecords als beschermde onderzoeksgegevens totdat een verliesvrije bewerkworkflow is getest.
5. Laat de bestaande zoek- en filterfuncties uit dezelfde databron lezen of genereer deterministisch het huidige `bibliography-data.js` vanuit de CMS-records.
6. Zet statische paginacontent per taal over zonder enige vertaling of tekstcorrectie; behoud alle links en afbeeldingsreferenties.
7. Richt concept/publicatie in via een werkbranch en pull request; Pages CMS-opslag is niet automatisch een live-websitevoorvertoning.
8. Gebruik de officiële `.pages.yml` in de repository-root na migratie, met `media` en `content`-collecties.

## Voorwaarden voordat de editor mag publiceren
- Alle 212 IDs blijven uniek, recordaantal en geneste brondata blijven exact behouden.
- Geen wijzigingen aan paginaontwerpen, CSS, navigatie of historische afbeeldingen.
- PAP/EN en bibliografie: zoeken/filteren/vertoning getest.
- Werkbranch blijft los van `main` tot goedkeuring.

Bron: Pages CMS documentatie https://pagescms.org/docs/configuration/ en https://pagescms.org/docs/configuration/content/ 
