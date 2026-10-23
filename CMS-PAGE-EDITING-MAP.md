# Pages CMS — Safe editing map (Version 16)
    
## Status
- **Bibliography:** 212 editable JSON overlays in `cms-editable/`. Original research records in `cms/bibliography/` remain protected. GitHub Actions merges supported fields into `bibliography-data.js` and the embedded catalog array in `catalogus.html`.
- **Ordinary page content:** NOT YET EDITABLE IN PAGES CMS. Do not enable direct HTML editing: page layout and text are intertwined.
- **Main/public GitHub branch:** must not be changed until editorial and visual approval.

## Existing page architecture
| Visible page | Source file | Editing implications |
|---|---|---|
| Portada | `index.html` | Bilingual content and layout embedded in HTML |
| Su historia | `su-bida.html` | Bilingual content and layout embedded in HTML |
| Su produktividat | `su-obra.html` | Bilingual content and layout embedded in HTML |
| Investigashon | `investigashon.html` | Bilingual content and layout embedded in HTML |
| Tokante | `tokante.html` | Bilingual content and layout embedded in HTML |
| Bibliografia, Distribushon, Fuentenan | `catalogus.html` | Embedded app, bibliography and data; some editorial text in `editorial-data.js` |

## Safe next implementation
1. Extract editable text and image paths for each page to separate Papiamentu/English JSON records, **without rewriting approved wording**.
2. Keep a complete unchanged baseline copy of source values. CMS edits should be separate overlays, not destructive rewrites.
3. Define explicit editable keys (paragraphs, headings, captions, image filenames) rather than raw HTML/CSS.
4. Build an automatic generator that updates only identified content slots; reject missing slots and source mismatches.
5. Run GitHub Actions build + desktop/mobile browser tests after edits; make sure original design and content not touched unexpectedly.
6. Only then add the five ordinary pages to Pages CMS. Keep the source records and layout read-only.
7. Test one editorial change, confirm it appears in the preview, and restore the original value before broader rollout.

## Notes
- `content.js` includes provisional app content but is **not a complete single source of truth** for all six pages.
- `editorial-data.js` contains the Distribushon source paragraphs, which must not be overwritten by empty form fields.
- The `cms-editable/` bibliography collection is already active; do not point a CMS collection at the protected rich original records.
- Porkbun and the public `main` branch are out of scope until final approval.
