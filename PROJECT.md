# APP VIAGGI — PROJECT.md
> Aggiornato: 09/09/2026 · Versione attuale: **v39**

---

## Contesto progetto

- **App**: App Viaggi — planning logistica settimanale per Pro Trasporti Srl
- **Stack**: HTML/CSS/JS vanilla, single-file, GitHub Pages
- **URL**: `firstlex55.github.io/TAB-VIAGGI-`
- **File lavoro**: caricare `app_viaggi_v39.html` all'inizio della sessione
- **Output**: sempre `app_viaggi_vN.html` con numero crescente

---

## VINCOLI ANDROID — CRITICI

> Fil lavora su Android. Questi vincoli non si toccano mai.

- No arrow functions `() =>`
- No template literals
- No `let`/`const` a scope globale (solo dentro funzioni)
- No spread operator `...`
- No shorthand object properties
- Solo `var` globale, ES5 classico

---

## ACCESSIBILITÀ — FIL È ASTIGMATICO

> Regola fondamentale per qualsiasi UI: sfondo chiaro + testo scuro.
> Mai testo chiaro su sfondo scuro (causa effetto "alazione"/halo).
> Evitare colori neon, preferire pastello con testo scuro della stessa famiglia.
> La vista PC usa il Tema G (ardesia blu) — vedi sezione dedicata.

---

## Workflow standard

1. Fil carica il file HTML a inizio sessione
2. Claude fa modifiche con `str_replace` chirurgico
3. Dopo ogni modifica: `node --check` su tutti i blocchi script
4. Backup prima di modifiche significative
5. Output: `cp /home/claude/index.html /mnt/user-data/outputs/app_viaggi_vN.html`

> ⚠️ Quando la conversazione diventa lunga e i token si avvicinano al limite,
> avvertire Fil prima di perdere contesto: aprire nuova conversazione e
> ricaricare PROJECT.md + file HTML corrente.

---

## Architettura dati

### localStorage keys
- `viaggiLogistica` — viaggi settimana corrente
- `viaggiLogisticaNext` — viaggi settimana prossima
- `weekArchive` — settimane archiviate
- `weekTitle` — titolo settimana corrente
- `transportersList`, `partenzaList`, `arrivoList`, `prodottiList` — **database unico** per categoria (v30). `learnedPartenze/Arrivi/Prodotti/Trasportatori` sono legacy: caricate una volta e fuse nelle liste sopra (`_mergeInto`), non più scritte da nessuna funzione.
- `transportersList`, `preferredView`, `savedAt`, `driveConnected`

### Oggetto viaggio
```
{ data, trasportatore, partenza, arrivo, prodotto, note, daConfermare, confermato }
```
Partenza/arrivo includono il codice: `"Bientina (INCONTRATO)"`

---

## TEMA G — Vista PC (IMPLEMENTATO in v25)

Vista PC ridisegnata con il Tema G. Fil è astigmatico: sfondo chiaro, testo scuro, zero neon.
Implementazione: CSS var scoped su `.desktop-view-active` (--bg, --text, --text-dim, --success,
--warning, --t-*) + sostituzione mirata dei colori hardcoded dentro `renderDesktopView()` e
funzioni collegate (`_dpkUpdate`, `desktopToggleConf`, `desktopToggleConfermato`, `pcSetWeek`).
Nuova funzione `_locationCodeColorPC(code)` per i chip codice cliente/sito con palette fissa
opaca (sostituisce il vecchio `_locationCodeColor` solo dentro la tabella PC).
La vista mobile/compact NON è stata toccata — resta tema scuro come prima.

### Palette base
```
Sfondo generale:       #dde4ec
Toolbar:               #ccd4e0  bordo #b8c4d4
Intestazione colonne:  #c0cad8  testo #506080
Righe alternate:       #dde4ec / #d4dce8  bordo #ccd4e0
Legenda footer:        #c8d2e0
```

### Testo celle
```
Data piccola (LUN 07/09):  #2a4060  font monospace bold  ← era grigio su grigio, ora leggibile
Prodotto (Pula, Segatura): #2a4060  font bold             ← era grigio su grigio, ora leggibile
Testo luogo principale:    #1a2540  bold
Testo muted/secondario:    #506080
```

### Separatori giorno (colore per giorno della settimana)
```
Lun: bg #c8d8f0  bordo-sx #2050a0  testo #103070  badge bg #dce8f8 bordo #6090d0
Mar: bg #c0e8d8  bordo-sx #107858  testo #085040  badge bg #d0f0e4 bordo #50b880
Mer: bg #dcd0f0  bordo-sx #6030a8  testo #380870  badge bg #e8e0fc bordo #9070d0
Gio: bg #f0e8c0  bordo-sx #887010  testo #504000  badge bg #f8f4d8 bordo #b09030
Ven: bg #f0d0e0  bordo-sx #a02858  testo #601030  badge bg #f8e0ec bordo #c06080
```

### Badge trasportatori — colori FISSI univoci
Sfondo pastello medio + testo scuro della stessa famiglia.
```
ConEco:   bg #b8a8e0  testo #1a0858
COAP:     bg #90b8e8  testo #021848
CEVOLO:   bg #e8b870  testo #402000
Aschieri: bg #80d0a8  testo #022818
LINO BRA: bg #e890b8  testo #400028
AVIO:     bg #d8c840  testo #302800
CONSAR:   bg #e08888  testo #380008
STEGAGNO: bg #60c8d8  testo #003040
CIRIONI:  bg #a0d870  testo #183000
CLP:      bg #c090d8  testo #280848
```

### Codici cliente/sito — colori FISSI univoci
Sfondo chiaro + bordo colorato + testo scuro. Sempre uguali ovunque appaiono.
```
CAI-BF:      bg #f0e898  bordo #908000  testo #3a3000
SICEM SRL:   bg #f8d8b0  bordo #b05000  testo #401800
AGROGI:      bg #f8c8a8  bordo #b03808  testo #401000
INCONTRATO:  bg #b8d0f8  bordo #1848b0  testo #041840
ZIGNAGO:     bg #e0c0f8  bordo #7018b0  testo #280058
ASSOFRUTTI:  bg #b0e8c8  bordo #107030  testo #043018
CFP:         bg #ccc0f8  bordo #5020b0  testo #180050
ARDENGHI:    bg #f8b8d8  bordo #b01860  testo #500020
SICEM SAGA:  bg #f8d890  bordo #a06000  testo #402000
TACCHELLA:   bg #f8b8b8  bordo #b00818  testo #500000
TRUCIOLI:    bg #a8d8f8  bordo #0660b0  testo #001848
VENDER:      bg #e8b8f8  bordo #8808a8  testo #380058
```

### Stato conferma
```
Da confermare: testo #806000  simbolo "⚠ conf."
Confermato:    testo #085040  simbolo "✓ ok"
```

---

## Novità v39 (non reimplementare)

**Export Excel — foglio "Viaggi" reso più pulito e premium**, su richiesta di Fil:
- Rimosso ANCHE il conteggio viaggi dal banner colorato del giorno (Fil: "guardiamo
  dopo se serve altrove") — il banner ora è una fascia piena A:J, senza testo a destra
  in colonna I. Altezza banner 24→28, font 11→12.
- **Trasportatore ora è un badge pieno colorato** (sfondo = colore identità
  trasportatore da `_xlsColors()`, testo bianco) invece di solo testo colorato su
  sfondo bianco — riconoscibile a colpo d'occhio scorrendo la colonna, stesso
  principio già usato nell'app per i trasportatori.
- Zebra striping più coerente con la palette dell'app: righe alterne `#EEF2F7` (era
  `#F8FAFC`, grigio neutro) invece di grigio puro.
- Altezza righe dati 19→21 per un po' più di respiro.

## Novità v38 (non reimplementare)

**Separatori giorno tabella PC ingranditi** — coerenti con la scala più grande
introdotta in v37 (padding, font, badge conteggio).

**Rimossa funzione morta `desktopAddEmpty_OLD`** e le 4 funzioni collegate
(`desktopPopupUpdateChips`, `desktopPopupToggleDay`, `desktopCloseDatePopup`,
`desktopAddEmptyConfirm`) più le variabili `_deskPopupDays`/`_deskPopupDayColors` —
tutte irraggiungibili (nessun pulsante le chiamava più). **Occhio**: durante la
rimozione è stato introdotto per un attimo un `_fmtDesktopDate` duplicato/spezzato —
capitato perché la sostituzione ha tagliato a metà una funzione invece che alla fine
esatta. Controllare sempre con `grep -n "function nomeFunzione"` che compaia UNA sola
volta dopo una rimozione di più funzioni consecutive, non fidarsi solo di `node --check`
(la sintassi può restare valida anche con codice duplicato/spezzato in modo innocuo).

**Scansione mirata sfondi scuri scritti a mano** — cercati tutti gli hex molto scuri
usati come `background` nel file. Trovate 2 righe a rischio non ancora coperte:
`select option` e `.filter-select option` (regole CSS globali per dropdown nativi)
usavano `color:var(--text)` su sfondo scuro fisso `#1c2430` — in vista PC sarebbe
diventato testo scuro su sfondo scuro. Scollegate da `var(--text)`, ora `color:#f2f4f8`
fisso. Tutto il resto trovato dalla scansione era già coperto dai fix precedenti
(modali v25/v29/v33/v37) o in zone sicure: viste mobile-only, la finestra di stampa
isolata (`window.open` con proprio `<style>`, non eredita le CSS var dell'app), o
elementi già nascosti in modalità PC (`.pc-view-switcher`, `.stats`, ecc.).

**Export Excel — rimossa riga "Totale: X viaggi" dopo ogni giorno** nel foglio
"Viaggi" (Fil: rompeva editing/tracking manuale nel file scaricato, le righe si
spostavano). L'informazione non si perde: il conteggio resta nell'intestazione
colorata del giorno stesso, e nel Foglio 2 "Riepilogo" esiste già una sezione
dedicata "TOTALI PER GIORNO". Mobile e PC usano la STESSA funzione di esportazione
(`downloadExcel()` → `_buildAndDownloadExcel()`) — non sono due sistemi diversi,
solo la fonte dei viaggi da esportare cambia in base a filtri/vista attiva.

## Novità v37 (non reimplementare)

**Sidebar "Rotte Rapide" rimossa** — su richiesta di Fil (ridondante con Multi-Tratta).
Layout `renderDesktopView()` da grid `270px 1fr` a `1fr` (colonna singola, piena
larghezza). Rimosso insieme tutto il codice diventato morto:
- `routeCard()`, calcolo `routeMap`/`allRoutes`/`manualRoutes` dentro `renderDesktopView`
- `desktopOpenAddModal(ri)`, `desktopFilterRoutes()`, `desktopNewRouteModal()`,
  `desktopSaveRoute()`, `desktopCloseRouteModal()` — tutte raggiungibili SOLO dai
  pulsanti della sidebar rimossa
- Modale HTML `#desktopRouteModal` ("Nuova rotta manuale")
- **Nota**: `_dmPopulateRoutes()`/`_dmApplyRoute()` (chip rotte rapide dentro al modale
  "Aggiungi viaggio") sono un sistema SEPARATO e restano intatti — non centrano con
  la sidebar, non toccare per errore in futuro pensando siano la stessa cosa.

**Bug critico trovato ed evitato durante la rimozione**: restava un `window.
_desktopRoutes = allRoutes;` a fine funzione — con `allRoutes` non più dichiarata
avrebbe lanciato un errore JS ad ogni render della vista PC, rompendola per intero.
Rimosso insieme al resto.

**Bug "testo invisibile" trovato per la seconda volta**: `#desktopTotalsPanel` (pannello
"Totali per trasportatore") aveva sfondo scritto a mano `#090c14` (praticamente nero),
mai passato a `var(--primary)`/`var(--secondary)` quando abbiamo introdotto Tema G —
stesso bug di v29/v33 ma in un pannello diverso, sfuggito ai controlli precedenti
perché non fa parte della lista di modali già verificata. **Prima di dichiarare "tutto
ok" su un giro di controllo del genere, cercare ANCHE hex scuri scritti a mano fuori
dalla lista nota di modali** — non fidarsi solo della lista già controllata.
Sistemato: sfondo portato a `#e4e9f0` (chiaro, coerente).

**Tutto ingrandito** (toolbar, tabs, pulsanti, ricerca, intestazioni tabella, colonne,
celle Trasportatore/Prodotto/Stato/Azioni, filtri giorno) — respiro maggiore ovunque
ora che la sidebar non occupa più spazio. Larghezze colonna aggiornate: data 100px,
trasportatore 150px, partenza/arrivo 190px, prodotto 130px, note 110px; `<table
min-width>` da 1050px a 1150px.

Verifiche fatte dopo tutte le modifiche: `node --check` su tutti i blocchi script,
bilanciamento parentesi CSS, bilanciamento tag HTML, funzioni duplicate, `onclick`
orfani, `getElementById` verso ID inesistenti — tutto pulito.

## Novità v36 (non reimplementare)

**Etichette Fornitore/Cliente evidenziate** — scelta tra 4 varianti (pillola colorata /
icona+colore ruolo / sottolineatura / sfondo blocco colorato), Fil ha scelto "D1":
pillola piena. "Fornitore" ora è testo bianco su sfondo blu (#4a6ed4), "Cliente" testo
bianco su sfondo corallo (#c8501a) — colore FISSO per ruolo (non per singolo
fornitore/cliente, quello resta il colore del codice sotto). "Località" resta
invariata (etichetta grigia semplice) — la richiesta era solo su Fornitore/Cliente,
"il cuore di tutto".

**Nota per la prossima sessione — redesign più ampio in corso**: Fil ha chiesto di
togliere la sidebar "Rotte Rapide" (ridondante con Multi-Tratta) e dare più spazio/
impatto al resto (toolbar riorganizzata a gruppi, righe viaggio più grandi). Concetto
approvato a livello di mockup ma **non ancora portato nel codice** — solo l'etichetta
D1 di questa voce è stata implementata finora. Da fare: rimuovere il pannello sidebar
sinistro in `renderDesktopView()`/CSS `.desktop-layout`, allargare `#desktopView`,
riorganizzare la toolbar in gruppi (vista / azioni settimana / strumenti), ingrandire
padding e font delle righe tabella.

## Novità v35 (non reimplementare)

Due correzioni al layout "C" (v34) su feedback di Fil da screenshot:
- **"Fornitore" invece di "Cliente" sul lato Partenza** — semanticamente corretto
  (partenza = da dove ritiri/fornitore, arrivo = a chi consegni/cliente). Il lato
  Arrivo resta "Cliente".
- **Colori codice troppo simili tra loro** ("è tutto uguale") — la colonna Cliente/
  Fornitore usava `_locationCodeColorPC(code).tx`, pensato per stare come testo scuro
  SOPRA uno sfondo pastello colorato (contrasto), quindi tutti i codici risultavano
  tonalità scure simili (marrone/verde scuro/blu scuro) senza sfondo a differenziarli.
  Cambiato in `.bd` (il colore pieno/vivace, es. rame per SICEM, verde per AGROGI,
  ciano per TRUCIOLI) usato direttamente come colore del testo — molto più
  distinguibile a colpo d'occhio senza bisogno di uno sfondo colorato.

## Novità v34 (non reimplementare)

**Layout Partenza/Arrivo in tabella PC — opzione "C" scelta da Fil** dopo preview di
3 alternative (due righe impilate / pallino colorato / sotto-etichette esplicite).
Ogni cella ora è divisa in due sotto-blocchi affiancati con etichette piccole:
"CLIENTE" (codice, colorato con `_locationCodeColorPC`, sola lettura — "—" se assente)
a sinistra, separatore verticale, "LOCALITÀ" (input editabile, invariato nella logica:
`_pcShortName`, `data-fullname`/`data-fullval`, autocompletamento datalist) a destra.
L'input non ha più bordo/sfondo proprio (trasparente, eredita dal contenitore) —
il bordo marcato (v31) ora è sul contenitore dell'intera cella, non sull'input.
Il focus-highlight della riga (`tr.style.outline`) è gestito a mano nell'onfocus/onblur
dell'input dato che non usa più `inpFocus`/`inpBlur` condivisi.
Occhio in futuro: quando si tocca questo blocco, gli apici dentro `onfocus`/`onblur`
vanno escapati con `\'` perché sono annidati dentro una stringa JS con apici singoli
(bug preso e corretto in questa stessa versione).

## Novità v33 (non reimplementare)

**Archivio introvabile da PC — mancava del tutto** — Fil non riusciva a trovare il
pulsante archivio in vista PC perché non esisteva: `archiveSection` (lista archivio)
è dentro `.section`, nascosta in blocco da `.desktop-view-active .section:not(:has
(#desktopView))`. Da PC l'archivio era semplicemente irraggiungibile, non un problema
di posizione del pulsante.
- Nuovo pulsante `🗄️ Archivio` nella toolbar PC (gruppo `pcvs-add`, accanto a 📊)
- Nuovo pannello `#pcArchiveModal` in stile Tema G (chiaro, coerente col resto della
  vista PC) — funzioni `openPcArchive()` / `closePcArchive()` / `_pcArchiveRender()`
- Riusa le funzioni già esistenti invariate: `loadArchive()`, `archiveDownloadExcel(idx)`,
  `archiveRestore(idx)`, `archiveDelete(idx)` — stessa logica del pannello mobile,
  solo presentazione diversa. Dopo "Riapri" forza anche `renderDesktopView()` per
  aggiornare subito la tabella PC (il pannello mobile non ne aveva bisogno).
- `archiveDelete`/`archiveRestore` chiedono già conferma internamente — il pannello PC
  non duplica il `confirm()`.

## Novità v32 (non reimplementare)

**Nomi ancora tagliati in tabella PC nonostante `_pcShortName` (v29)** — causa reale:
le colonne Partenza/Arrivo non avevano una larghezza minima garantita (`widths.partenza`/
`widths.arrivo` erano vuote in `renderDesktopView`), quindi su schermo stretto o con
zoom di Windows alto si strizzavano sotto la soglia utile — anche nomi corti a una
parola ("Tarmassia") finivano tagliati, perché il problema non era la lunghezza del
nome ma lo spazio della colonna.
- `widths.partenza`/`widths.arrivo`: da `''` a `'170px'` (minimo garantito)
- Input partenza/arrivo: `min-width` da `80px` a `150px`
- `<table>`: `min-width` da `800px` a `1050px` — se la finestra è più stretta di così,
  ora compare lo scroll orizzontale sul contenitore (`#desktopTableScroll`, già
  `overflow-x:auto`) invece di tagliare il testo — molto meglio di un nome illeggibile.
- `_pcShortName()`: soglia di troncamento da 13 a 16 caratteri (coerente con le colonne
  più larghe — tronca solo i nomi davvero lunghi, es. "Castel S. Nicolò").

## Novità v31 (non reimplementare)

**Bordi celle tabella PC più marcati** — su richiesta di Fil dopo preview di 3 opzioni
(bordo attuale / bordo marcato / bordo marcato+sfondo bianco), scelta l'opzione
intermedia. `inpStyle` condiviso (trasportatore/partenza/arrivo/prodotto/note nella
tabella PC): sfondo `#eef2f7`, bordo `1.5px solid #a8b4c4` (era `rgba(16,32,64,0.05)`
bg + `1px solid rgba(16,32,64,0.10)` bordo — quasi invisibile). Aggiornato anche
`inpBlur` per ripristinare questi stessi colori dopo il focus.

**Icona app rifatta** — `logo.png` (usato da favicon + apple-touch-icon via manifest),
camion stilizzato piatto, sfondo scuro con leggero sheen premium + bordo sottile,
ombra morbida sotto il camion. File consegnati a parte (non nell'HTML): `logo.png`
512×512 da sostituire nel repo GitHub (stesso nome, nessuna modifica al codice
necessaria), più `logo_1024.png` (sorgente alta risoluzione) e `logo_192.png`.

## Novità v30 (non reimplementare)

Fil segnalava: "tante partenze/arrivi non li trova più". Causa trovata: **tre sistemi
paralleli e scollegati** che gestivano le stesse liste (trasportatori/partenze/arrivi/
prodotti), sincronizzati male tra loro:
1. `transportersList`/`partenzaList`/`arrivoList` — persistite, auto-crescono dai viaggi
2. `learnedPartenze/Arrivi/Prodotti/Trasportatori` — i "4 database appresi", persistiti
   separatamente, gestibili dal pannello 🗃️ (solo questi erano editabili)
3. Dentro `renderDesktopView()` stesso: una **quarta copia hardcoded** dei nomi via
   arrivoList/partenzaList seed, usata SOLO per i datalist della tabella PC — se
   modificavi qualcosa dal pannello 🗃️, la tabella PC continuava a suggerire i vecchi
   nomi hardcoded lo stesso.

**Fix — database unico**: ora esiste UNA sola lista per categoria
(`transportersList`, `partenzaList`, `arrivoList`, nuova `prodottiList` — quest'ultima
prima non esisteva come lista persistita, solo 4 valori hardcoded + learnedProdotti).
- Al caricamento, `_mergeInto()` fonde una volta le vecchie liste "learnedXxx" dentro
  quelle canoniche (recupera qualsiasi voce rimasta intrappolata nel sistema secondario
  — non si perde nulla di quanto già salvato).
- `learnPartenza/Arrivo/Prodotto/Trasportatore`, `learnFromTrip`, `bulkLearnFromAllTrips`
  ora scrivono TUTTI nella stessa lista canonica (helper `_addToDb`), non più nei
  `learnedXxx` separati.
- `renderDesktopView()`: rimossa la quarta copia hardcoded — la tabella PC ora legge
  `partenzaList`/`arrivoList`/`prodottiList`/`transportersList`, le stesse di tutto
  il resto dell'app.
- `_refreshAllDatalistsLearn()` semplificata: aggiorna tutti i datalist (mobile + PC)
  dalle stesse 4 liste, niente più merge/filter tra due fonti.

**Pannello Database rifatto** (era "Pulizia DB appresi", bottone 🗃️ in toolbar PC):
- **Aggiunta manuale** — campo di testo + bottone "+ Aggiungi" per ogni categoria
  (prima si poteva solo rimuovere).
- **Doppioni evidenziati** — se due voci nella stessa lista risultano uguali ignorando
  maiuscole/spazi, vengono segnalate con bordo giallo + ⚠ e contate nell'intestazione
  ("⚠ 2 doppioni"), così Fil può vederle e decidere quale tenere.
- Restano: rimozione singola voce (×), svuota categoria.
- Il pannello ora mostra le 4 liste canoniche (Trasportatori/Partenze/Arrivi/Prodotti),
  non più i 4 "appresi" separati.

## Novità v29 (non reimplementare)

Due bug segnalati da Fil con screenshot da PC:

1. **Testo invisibile nei popup condivisi (bug di v25/Tema G)** — quando la vista PC è
   attiva, `.desktop-view-active` scurisce `--text`/`--text-dim` (Tema G) ma i popup
   condivisi (Nuova Settimana, Multi-Tratta, DB appresi, conferma Excel, popup data,
   conflitto Drive) usavano ancora lo sfondo scuro della vista mobile → testo scuro su
   sfondo scuro, illeggibile. Due cause distinte, due fix:
   - Popup che usano `var(--primary)`/`var(--secondary)` come sfondo (es. Nuova Settimana):
     aggiunte le stesse variabili a `.desktop-view-active` con valori chiari coerenti col
     Tema G (`--primary:#eef2f7`, `--secondary:#e4e9f0`, `--border:rgba(16,32,64,0.16)`),
     così si schiariscono automaticamente in vista PC.
   - Popup con sfondo scuro scritto a mano (`#0f1220`/`#1c2430`, non una variabile) — es.
     **Multi-Tratta, apribile anche da PC** — non beneficiano del fix sopra. Per questi
     (`#multiTrattaModal`, `#dbCleanModal`, `#summaryModal`, `#excelConfirmModal`,
     `#desktopDatePopup`, `#driveConflictModal`) è stata aggiunta una regola scoped che
     ripristina i valori scuri di `--text`/`--text-dim`/`--success`/`--warning` SOLO al
     loro interno, indipendentemente dalla vista attiva — restano scuri e leggibili sempre.
   - Prima di aggiungere qualunque nuovo popup/modale condiviso: se ha sfondo scuro scritto
     a mano invece di `var(--primary)`, va aggiunto alla lista scoped sopra o rischia lo
     stesso bug.

2. **Nomi troppo lunghi tagliati a metà in tabella PC** (es. "Ponzano Romano" mostrato come
   "Ponzano Rom" illeggibile) — l'input HTML non mostra i "..." quando il testo non ci
   sta, taglia e basta. Aggiunta `_pcShortName(name, maxLen=13)`: se il nome supera 13
   caratteri prova a tenere solo la prima parola (es. "Ponzano Romano" → "Ponzano"); se
   anche la prima parola è troppo lunga, taglia a 12 caratteri + "…". Il nome completo
   resta sempre disponibile per la modifica (attributo `data-fullname`, ripristinato
   al focus dell'input) e al passaggio del mouse (`title`). Nessuna perdita di dati:
   l'`onchange` che salva il viaggio scatta sempre col valore intero digitato dall'utente,
   la versione corta si applica solo dopo, sul blur.

## Novità v28 (non reimplementare)

**Controllo generale + pulizia**, su richiesta di Fil dopo un audit completo del codice:

1. **Coerenza colori tema (fix regressione v27)** — `--success`/`--warning` erano stati
   ammorbiditi in v27 ma ~90 punti del codice avevano il vecchio colore scritto a mano
   (`#06d6a0`, `#ffd23f` e le rgba corrispondenti: toast di salvataggio, spunte conferma,
   pulsanti sync Drive, modale Excel, modale conflitto sync, riepilogo Multi-Tratta).
   Sostituiti tutti con `var(--success)`/`var(--warning)` o le rgba nuove (62,203,150 /
   224,192,90). **Attenzione**: il trasportatore CONSAR aveva per puro caso lo stesso hex
   del vecchio successo (#06d6a0) — la sostituzione automatica lo agganciava a `var(--success)`
   in 3 punti (`--t-consar` in root, mappa `getTransporterColorVar`, `_printColor`). Corretto
   riportando CONSAR a `#06d6a0` letterale in tutti e 3 (identità trasportatore, NON legata al
   tema). `_printColor()` in particolare scrive in una finestra `window.open('','_blank')` con
   `<style>` proprio senza le CSS var del `:root` — un `var(--success)` lì non si sarebbe MAI
   risolto in stampa.

2. **Rimossa sintesi vocale (v22/v23)** — su richiesta esplicita di Fil ("non mi interessa
   più", "codice appesantito che non serve"). Eliminati: `_VF_STEPS`, `_vfRecognition`,
   `_vfStep`, `_vfData`, `_vfListening`, `openVoiceInput`, `_vfRenderStep`,
   `_vfHandleTranscript`, `_vfParseField`, `_vfMatchDB`, `_vfAccept`, `vfSkip`, `voiceSave`,
   `voiceCancel`, `vfManualChange`, `vfManualConfirm`, `_vfRenderSummary`,
   `_vfShowSaveState`, `_vfBarsAnimate`, `_vfStartListening`, il modal `voiceModal` e il
   pulsante "🎤 Voce" nell'header "Nuovo Viaggio". ~410 righe rimosse. Le note v22/v23 più
   sotto restano solo come storico — la funzionalità non esiste più, non reimplementarla.

3. **Rimosso codice morto — riepilogo settimanale mai collegato** — `updateWeekSummary()`
   (chiamata a ogni update) cercava `#weekSummaryTransporters`/`#weekSummaryCount`, elementi
   mai esistiti nell'HTML (probabile feature tolta dalla UI senza ripulire il JS). CSS
   `.week-summary*` rimosso insieme alla funzione. Non è mai stato visibile a Fil — nessuna
   funzionalità persa.

Verifiche fatte dopo ogni fix: `node --check` su tutti i blocchi script, bilanciamento
parentesi CSS, bilanciamento tag HTML, funzioni duplicate, `onclick` orfani, `getElementById`
verso ID inesistenti — tutto pulito.

## Novità v27 (non reimplementare)

**Tema mobile scuro anti-alone** — colori base (`:root`) aggiornati:
- `--bg` #1c222c (era #141922), `--primary` #252c38 (header/tab/nav), `--secondary` #242b36 (card)
- `--text` #eeece4 (bianco caldo, era quasi-bianco puro), `--text-dim` #9aa2b0, `--text-muted` #6b7484
- Vista PC (`.desktop-view-active`) NON toccata, resta Tema G indipendente.

**Badge trasportatori "premium"** — nuove coppie `--t-*-fill` / `--t-*-ink` (10 trasportatori,
toni gioiello vivaci) usate dalle classi `.transporter-*`; pallino `::before` con `currentColor`,
font JetBrains Mono, niente più bordo/glow. Le vecchie `--t-*` / `--t-*-bg` restano invariate
(usate altrove: bordo card — il badge riepilogo settimana che le usava è stato rimosso in v28).
Il pallino è disattivato dentro `.desktop-view-active` (PC ha il suo stile, invariato).

**Codici cliente/sito — palette morbida + "colore impatto"**:
- `_locationCodeColor(code)` riscritta: nuova palette pastello-gioiello (AGROGI ora verde,
  INCONTRATO spostato su blu indaco — prima erano troppo simili a SICEM/TRUCIOLI). Aggiunte
  `_hexToHsl`/`_hslToHex`/`_liftColor` (helper ES5) per derivare programmaticamente varianti
  di un colore.
- Nuova `_impactColor(code)`: versione più accesa dello stesso colore, applicata al NOME del
  luogo di arrivo (non al codice tra parentesi) in tutte le viste mobile — così il posto si
  riconosce dal colore della scritta grande, non serve leggere l'etichettina piccola.
  Applicato in: `_ccRow` (compatta), tabella "Oggi", `_renderTodayCard`, vista Medium
  (per trasportatore), `renderNextView`, risultati ricerca archivio. La partenza resta neutra.
- Chip codice: da "testo con glow" (`text-shadow`) a sottolineatura pulita
  (`box-shadow: inset 0 -2px 0 0 <colore>`) — niente più alone.

**Backup**: `app_viaggi_v26_backup.html` conservato prima di queste modifiche.

**Non ancora fatto (prossima sessione)**: restyling strutturale del layout (header con pulsanti
a icona "pillola", tab viste a segmento scorrevole, nav in basso con "+" flottante, divisore
tra rotta/prodotto nelle card, separatore giorno con linea di riempimento) — discusso e
approvato nei mockup ma non ancora portato nel codice reale. Anche il banner "Da confermare"
condiviso (righe ~6200) non ha ancora il colore impatto sull'arrivo (non estrae toCode).

## Novità v25–v26 (non reimplementare)

**v25**: Tema G implementato in vista PC (vedi sezione TEMA G sopra)

**v26**: Fix data Multi-Tratta
- Bug: `openMultiTratta()`/`mtResetDays()` calcolavano il lunedì della settimana
  corrente con la formula VECCHIA (pre-v24): domenica → -6gg (indietro), invece
  della formula fissata in v24: domenica → +1gg (avanti, prossimo lunedì).
  Risultato: se usato di domenica, la Multi-Tratta creava i viaggi sulla
  settimana appena conclusa invece che su quella in arrivo.
- Fix: nuova funzione condivisa `_mtCurrentWeekMonday()` con la stessa logica
  a priorità di `desktopGetNextWeekday` (1. viaggi esistenti in settimana
  corrente → 2. weekTitle valido → 3. fallback calendariale con `getMondayOf`
  corretto). Usata sia in `openMultiTratta()` che in `mtResetDays()`.

## Novità v22–v24 (non reimplementare)

**v22**: Sintesi vocale riscritta campo per campo (stile Gboard)
- Modal campo-per-campo: Trasportatore → Giorno → Partenza → Arrivo → Prodotto
- Trascrizione live, conferma per campo, riavvio automatico mic
- Parsing separato per ogni campo, matching DB appresi
- Funzioni: `openVoiceInput`, `_vfRenderStep`, `_vfHandleTranscript`,
  `_vfParseField`, `_vfMatchDB`, `_vfAccept`, `vfSkip`, `voiceSave`, `voiceCancel`

**v23**: Input manuale nel modal vocale
- Campo testo sempre visibile sotto il transcript
- Se la voce sbaglia: scrivi a mano → "✓ Ok" → usa DB appresi come la voce
- Funzioni: `vfManualChange`, `vfManualConfirm`
- `_vfRenderStep` pulisce il campo ad ogni step

**v24**: Fix date modal "Aggiungi viaggio PC"
- `desktopGetNextWeekday` riscritta: priorità ai viaggi della settimana corrente
- Fix bug domenica in `getMondayOf`: ora va avanti (+1) invece che indietro (-6)
- Logica priorità: 1) viaggi settimana corrente → 2) weekTitle se valido → 3) fallback calendariale

---

## Backlog (prossime sessioni)

- PIN/password di accesso lato client (localStorage con hash)
- Click risultato ricerca → apre settimana archiviata
- Export PDF diretto (senza popup)
- Statistiche multi-settimana con grafico
- Service Worker per modalità offline

---

## Viste disponibili

- `compact` — vista rapida mobile (default)
- `oggi` — solo viaggi di oggi
- `medium` — per trasportatore
- `next` — settimana prossima
- `desktop` — tabella PC ← TEMA G DA IMPLEMENTARE
- `card` — vista card

In vista PC: `body` ha classe `desktop-view-active` che nasconde barra giorni e nav mobile.

---

## Funzioni principali

### Render
- `renderTrips()` — dispatcher
- `renderCompactView()`, `renderOggiView()`, `renderMediumView()`
- `renderNextView()`, `renderDesktopView()`, `renderArchive()`
- `updateWeekProgress()` — barra giorni con dots trasportatori (legge `t.data`)
- `updateStats()` — stats + PWA badge + punto arancio su Oggi

### Dati
- `saveToLocalStorage()`, `saveNextToLocalStorage()`, `autoSaveDrive()`
- `learnFromTrip(t)`, `bulkLearnFromAllTrips()`
- `filterApply()`, `filterPopulateDropdowns()`

### Sintesi vocale campo-per-campo (v22+)
- `openVoiceInput()` — apre modal step-by-step
- `_vfRenderStep()` — aggiorna UI per campo corrente
- `_vfStartListening()` — avvia/riavvia riconoscimento
- `_vfHandleTranscript(text)` — gestisce testo riconosciuto
- `_vfParseField(key, text)` — parsing per campo specifico
- `_vfMatchDB(raw, db)` — fuzzy match su DB appresi
- `_vfAccept(value)` — conferma valore e avanza
- `vfSkip()`, `voiceSave()`, `voiceCancel()`
- `vfManualChange(val)`, `vfManualConfirm()` — input manuale

### Multi-tratta
- `openMultiTratta()` / `closeMultiTratta()` / `mtConfirm()`
- `mtAddRow()` / `mtRemoveRow(id)` / `_mtGetRows()`
- Checkbox da confermare: per-riga `mt-conf-{id}` (NON globale)

### Vista PC
- `pcSetWeek(mode)` — corrente / prossima / oggi
- `desktopSetField(idx, field, val)`, `desktopDel(idx)`, `desktopDup(idx)`
- `desktopToggleConf(idx)` — conferma + flash verde
- `desktopAddEmpty()`, `desktopGetNextWeekday(dayName)` (fix v24)
- `desktopConfirmAdd()`, `desktopCloseAddModal()`

### Ricerca archivio
- `toggleArchiveSearch()`, `runArchiveSearch()`
- `asToggleScope(which)`, `asSetPeriod(period)`

### Database (v30 — unico, non più "appresi" separato)
- `openDbClean()` / `closeDbClean()` — apre/chiude il pannello (bottone 🗃️ in toolbar PC)
- `dbCleanAdd(key)` — aggiunge una voce manualmente
- `dbCleanRemove(key, idx)`, `dbCleanClearAll(key)` — rimuovi singola voce / svuota categoria
- `_addToDb(arr, key, val)` — helper add+dedup+persist condiviso da `learnPartenza/Arrivo/Prodotto/Trasportatore` e da `dbCleanAdd`
- `key` è uno tra: `transportersList`, `partenzaList`, `arrivoList`, `prodottiList`

### Stampa/Export
- `window.printPlanning()` — stampa premium
- `downloadExcel()` — Excel multi-foglio

### Utilità
- `showStatus(msg, type)`, `haptic(type)`
- `getTransporterColorVar(name)`, `getTransporterColorClass(name)`
- `_locationCodeColor(code)`, `_pv(n)`

---

## Attenzioni critiche

1. `renderArchive()` — ZERO template literals, solo string concatenation
2. `window.printPlanning` — proprietà di window, non funzione normale
3. `updateWeekProgress()` — legge `t.data` (non `t.giorno`)
4. `mtDaConf` — RIMOSSO, ora per-riga con `mt-conf-{id}`
5. Vista PC usa `_pcWeekMode` ('current'/'next') per switching settimana
6. Colori trasportatori e clienti nella vista PC devono seguire TEMA G (v25+)
