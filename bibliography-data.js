/* BIBLIOGRAFIEGEGEVENS — laat de lijst leeg totdat geverifieerde gegevens beschikbaar zijn.
   Een record vertegenwoordigt één gedocumenteerde publicatie-uitgave of andere
   bibliografische eenheid, NIET automatisch één uniek literair werk.
   Voeg NOOIT ontbrekende delen toe zonder bewijs.

   VOORBEELDSTRUCTUUR (NIET ALS ECHTE REGISTRATIE GEBRUIKEN):
   { id: "record-001", title: "Titel zoals gedrukt", year: "onbekend",
     genre: "Roman", series: "Serienaam", volume: "1", edition: "",
     collections: ["Bibliotheeknaam"], source: "Bron of inventarisnummer",
     status: "geverifieerd", workId: "werk-001", notes: "" }
*/
window.BIBLIOGRAPHY_RECORDS = [];
