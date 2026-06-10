# APP VIAGGI — PROJECT.md
> Aggiornato: 10/06/2026 · Versione attuale: **v21**

---

## Contesto progetto

- **App**: App Viaggi — planning logistica settimanale per Pro Trasporti Srl
- **Stack**: HTML/CSS/JS vanilla, single-file, GitHub Pages
- **URL**: `firstlex55.github.io/TAB-VIAGGI-`
- **File lavoro**: caricare `app_viaggi_v21.html` all'inizio della sessione
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

## Workflow standard

1. Fil carica il file HTML a inizio sessione
2. Claude fa modifiche con `str_replace` chirurgico
3. Dopo ogni modifica: `node --check` su tutti i blocchi script
4. Backup prima di modifiche significative
5. Output: `cp /home/claude/index.html /mnt/user-data/outputs/app_viaggi_vN.html`

---

## Architettura dati

### localStorage keys
- `viaggiLogistica` — viaggi settimana corrente
- `viaggiLogisticaNext` — viaggi settimana prossima
- `weekArchive` — settimane archiviate
- `weekTitle` — titolo settimana corrente
- `learnedPartenze/Arrivi/Prodotti/Trasportatori` — 4 DB appresi
- `transportersList`, `preferredView`, `savedAt`, `driveConnected`

### Oggetto viaggio
```
{ data, trasportatore, partenza, arrivo, prodotto, note, daConfermare, confermato }
```
Partenza/arrivo includono il codice: `"Bientina (INCONTRATO)"`

---

## Colori fissi — NON CAMBIARE

```
Partenza:  #f0f4ff  bianco caldo
Arrivo:    #86efac  verde menta
Prodotto:  #b0bcd0  grigio-blu italic

Trasportatori:
CEVOLO #ff8c5a  COAP #7eb8ff  CONSAR #06d6a0  AVIO #38bdf8
ASCHIERI #e8821a  C.M TRASP #a78bfa  CONECO #f472b6
LINO BRA #c084fc  CLP #ca8a04

Badge codici:
INCONTRATO #60a5fa  AGROGI #fb923c  TRUCIOLI #a78bfa
SICEM SRL #f59e0b  CFP/CAI-BF/SICEM SAGA #fbbf24
VENDER #e879f9  ZIGNAGO #c084fc  MANCINI #fb923c
POGGIO DEL FARRO #fb923c  TACCHELLA #fb7185
```

---

## Viste disponibili

- `compact` — vista rapida mobile (default)
- `oggi` — solo viaggi di oggi
- `medium` — per trasportatore
- `next` — settimana prossima
- `desktop` — tabella PC
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

### Multi-tratta
- `openMultiTratta()` / `closeMultiTratta()` / `mtConfirm()`
- `mtAddRow()` / `mtRemoveRow(id)` / `_mtGetRows()`
- `mtRowDayTap(rid, d)` / `mtRowCntChange(rid, d, delta)`
- Checkbox da confermare: per-riga `mt-conf-{id}` (NON globale)

### Vista PC
- `pcSetWeek(mode)` — corrente / prossima / oggi
- `desktopSetField(idx, field, val)`, `desktopDel(idx)`, `desktopDup(idx)`
- `desktopToggleConf(idx)` — conferma + flash verde
- `desktopAddEmpty()`

### Ricerca archivio
- `toggleArchiveSearch()`, `runArchiveSearch()`
- `asToggleScope(which)`, `asSetPeriod(period)`
- `asSetTrasp(name)`, `asSetProd(name)`
- Filtri: scope / periodo / date custom / trasportatore / prodotto

### DB appresi
- `openDbClean()` / `closeDbClean()`
- `dbCleanRemove(key, idx)`, `dbCleanClearAll(key)`

### Statistiche rapide
- `toggleQuickStats()`, `renderQuickStats()`

### Nuova settimana
- `showNewWeekModalV2()` — ora mostra copia settimana precedente
- `archiveAndNewWeek()`, `nwv2CopyPrev()`

### Sintesi vocale (Web Speech API, Chrome only)
- `openVoiceInput()` — modal con campi live
- `voiceStop()`, `voiceRetry()`, `voiceCancel()`, `voiceSave()`
- `_voiceParse(text)` — parsing italiano con DB appresi
- `_voiceMatchDB(raw, db)` — fuzzy matching

### Stampa/Export
- `window.printPlanning()` — stampa premium stile D
- `downloadExcel()` — Excel multi-foglio
- `_printColor(name)` — colori pastello stampa

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
5. `_ccRow` usa `getTransporterColorVar` per sfondo sfumato cards

---

## Novità v16–v21 (non reimplementare)

**v16**: Vista Oggi mobile, colori partenza/arrivo uniformati, ricerca avanzata archivio
**v17**: Filtro prodotto in ricerca archivio
**v18**: Stampa premium stile D, badge pastello, rimossa "Pro Trasporti Srl"
**v19**: Bottoni prodotto auto-popolati nella ricerca
**v20**: Pulizia DB appresi, copia settimana precedente, PWA badge, statistiche rapide, flash conferma, vista Oggi su PC, sintesi vocale reale
**v21**: Card sfumata per trasportatore, barra giorni con dots, header compatto mobile, separatori giorno con dots, codici inline in tabella PC

---

## Backlog

- Sintesi vocale: multi-viaggio in una frase
- Click risultato ricerca → apre settimana archiviata
- Export PDF diretto (senza popup)
- Statistiche multi-settimana con grafico
- Service Worker per modalità offline
- Storico modifiche per viaggio
