# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app single-file HTML per la **pianificazione logistica settimanale dei viaggi** di Pro Trasporti.
Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`

File principale: **`index.html`** (~9500 righe) — tutto in un file, HTML + CSS + JS vanilla.
File aggiuntivi nel repo: `manifest.json`, `sw.js`, `logo.png`.

---

## Stack tecnico
- **HTML/CSS/JS vanilla** — nessun framework, no build step
- **ExcelJS 4.4.0** — export Excel (2 fogli: Viaggi + Riepilogo, landscape A4)
- **XLSX 0.18.5** — import Excel
- **Google Drive API** — sync via OAuth2 + fetch diretto (no gapi library)
- **Google Fonts** — Outfit + JetBrains Mono
- **PWA** — manifest.json + sw.js (network-first, cache offline) + logo.png

---

## Struttura dati
```js
// Settimana corrente
{
  data: "2026-04-07",        // ISO YYYY-MM-DD
  trasportatore: "COAP",
  partenza: "Bientina (INCONTRATO)",
  arrivo: "Verolavecchia (AGROGI)",
  prodotto: "Segatura",      // opzionale
  note: "",                  // opzionale
  daConfermare: false,
  confermato: false
}
```
Salvato in `localStorage` chiave `viaggiLogistica`. **Sempre in ordine cronologico.**
`trips = []` — array vuoto all'avvio, NO dati hardcoded.

**Settimana prossima** salvata in chiave separata `viaggiLogisticaNext`.
`tripsNext = []` — stesso schema, vive separato da `trips`.

---

## Trasportatori e colori
CEVOLO `#e8821a` ambra, COAP `#5b8dd9` blu, CONECO `#e040a0` fucsia, CONSAR `#06d6a0` verde acqua,
AVIO `#38bdf8` azzurro, ALB `#f5a623` giallo, LINO BRA `#c084fc` viola, Stegagno `#94a3b8` grigio,
Cirioni `#34d399` verde smeraldo, CLP `#CA8A04` oro.
Colori CSS: variabili `--t-{key}` e `--t-{key}-bg`.

---

## Viste (bottom nav mobile + pc-view-switcher su desktop)
| Vista | ID | Descrizione |
|-------|----|-------------|
| PROSSIMA | `#nextView` | Viaggi settimana prossima (`tripsNext`). Stessa UI della RAPIDA ma in viola. |
| TRASP. | `#mediumView` | Card per trasportatore — Concept C: card con header num. grande + righe 2-livelli. |
| RAPIDA | `#compactView` | Righe compatte per giorno — **vista principale**. Swipe destra → elimina. |
| PC | `#desktopView` | Tabella editabile inline, sidebar rotte rapide, toggle Corrente/Prossima |

`currentView` salvato in `localStorage` come `preferredView`. Default: `compact`.
**OGGI è stata rimossa** — sostituita da PROSSIMA.

---

## Vista PROSSIMA (nuova in v49)
- Mostra `tripsNext` (settimana +1), completamente separata da `trips`
- Sfondo e accenti viola (`#a78bfa`) per distinguerla visivamente dalla corrente
- Swipe-to-delete funziona (usa `data-next-idx`)
- Modifica via modal editTrip — salva in `tripsNext` (modal tiene `data-next-idx`)
- Premi `+` → form apre con data precompilata a Lunedì prossimo + banner viola
- `filterApply()` in questa vista chiama solo `renderNextView()` e ritorna

---

## Toggle PC Corrente/Prossima
- Due bottoni in toolbar: `● Corrente` (arancio) e `◎ Prossima` (viola)
- Variabile globale: `let _pcWeekMode = 'current'` (dichiarata vicino a `_desktopSort`)
- Funzione: `pcSetWeek(mode, btn)` — aggiorna bottoni e chiama `renderDesktopView()`
- **Tutte le operazioni PC** (modifica, elimina, duplica, toggle conf, nuova riga, popup rotte) rispettano `_pcWeekMode`:
  - `desktopSetField`, `desktopDel`, `desktopDup`, `desktopToggleConf`, `desktopToggleConfermato`
  - `desktopAddEmptyConfirm`, `desktopConfirmAdd`, `desktopSetNextWeek`
- `renderDesktopView()` usa `_workingTrips = _pcWeekMode==='next' ? tripsNext : trips`
- Il toggle si resetta a 'current' quando si esce dalla vista PC

---

## Archiviazione smart (v49)
- `archiveAndNewWeek()`: dopo aver archiviato la settimana corrente, se `tripsNext.length > 0`:
  - Chiede con `confirm()`: *"Hai X viaggi per la prossima — vuoi usarli come base?"*
  - SÌ → `trips = deepCopy(tripsNext)`, `tripsNext = []`, salva entrambi
  - NO → `trips = []`, `tripsNext` rimane intatto nella vista Prossima

---

## Card layout — Vista TRASP. (Concept C, v48)
Struttura card per trasportatore:
- **Header**: badge colorato + numero grande + badge "N ✓" / "N ⚠"
- **Righe viaggio a 2 livelli**:
  - Riga 1: giorno (colore trasportatore) + partenza (per esteso) `›` arrivo (per esteso) + stato
  - Riga 2: codice partenza · codice arrivo · prodotto (font 10px)
- Funzione: `renderMediumView()`

---

## Vista OGGI (rimossa in v48/v49)
- Sostituita da PROSSIMA
- `renderCardView()` e `_renderTodayCard()` ancora presenti nel codice ma non raggiunte dalla nav
- Il CSS `.trip-card.today-card::after { content: "OGGI" }` rimane ma non usato

---

## Vista RAPIDA
- Righe raggruppate per giorno con separatori pill colorati (Concept C)
- **Swipe a destra** → elimina (soglia 90px, sfondo rosso)
- Ogni riga: badge trasportatore + partenza › arrivo (2 righe) + codici sottotitolo
- Funzione: `renderCompactView()`

---

## Vista PC
- `renderDesktopView()` — usa `_workingTrips` (corrente o prossima)
- Grid: sidebar 270px + tabella principale
- **Tab fluido**: Tab naviga Partenza → Arrivo → Prodotto → Note
- **Colonna ✓ cliccabile** direttamente senza re-render
- **Toggle Corrente/Prossima** in toolbar (vedi sopra)
- **Ricerca multi-termine**: spazio come AND
- **Bottone ⏱ Data**: toggle ordine cronologico fisso
- Filtri giorno Lun-Ven, Ctrl+D duplica, **Ctrl+Z undo** (stack 20 operazioni)
- **📦 Nuova sett.**: archivia + svuota + chiede importazione tripsNext
- **🗓 Sett. prossima**: aggiunge 5 righe vuote — rispetta `_pcWeekMode`
- Export Excel usa sempre `_getVisibleTrips()` (settimana corrente)

---

## Form mobile aggiunta viaggio
Flusso: **Trasportatore → Rotta → Prodotto+Note → Quando**

- **Contestuale**: se `currentView === 'next'` → aggiunge a `tripsNext`, altrimenti a `trips`
- Banner viola in cima al form quando si aggiunge alla prossima settimana
- Data precompilata: Lunedì prossimo se vista PROSSIMA, oggi se vista RAPIDA/TRASP.
- Chip Lun-Ven con date reali, logica "sempre avanti", +7gg, Reset
- Bottone "✅ Aggiungi Viaggio": sticky sopra la bottom nav

---

## Storage localStorage
| Chiave | Contenuto |
|--------|-----------|
| `viaggiLogistica` | `trips[]` — settimana corrente |
| `viaggiLogisticaNext` | `tripsNext[]` — settimana prossima |
| `weekTitle` | Titolo settimana corrente |
| `transportersList` | Lista trasportatori autocomplete |
| `partenzaList` | Lista partenze autocomplete |
| `arrivoList` | Lista arrivi autocomplete |
| `preferredView` | Vista attiva al riavvio |
| `pcb_routes` | Rotte manuali sidebar PC |
| `archiveData` | Archivio settimane passate |
| `appVersion` | Versione per migration (attuale: v49b) |

---

## Google Drive
- Scope: `drive.appdata`, file: `planning-viaggi-data.json`
- **Auto-save sempre silenzioso** (`driveSave(true)`)
- Conflict modal solo su salvataggio **manuale**
- Auto-reconnect token ogni 50min silenzioso
- Bottoni: `syncBtn` (mobile) + `desktopSyncBtn` (PC)
- **tripsNext NON viene sincronizzato su Drive** (locale only per ora)

---

## Funzioni JS critiche
```
_pv(n)                        → plurale: n===1 ? 'viaggio' : 'viaggi'
renderTrips()                 → dispatcha alla vista corrente (SEMPRE chiamare dopo modifiche)
renderCardView()              → vista OGGI (legacy, non raggiunta dalla nav)
_renderTodayCard(t, today)    → card legacy
renderMediumView()            → vista TRASP. — Concept C con card per trasportatore
renderCompactView()           → vista RAPIDA (swipe-to-delete)
renderNextView()              → vista PROSSIMA SETTIMANA (tripsNext)
renderDesktopView()           → vista PC tabella — usa _workingTrips
filterApply()                 → filtra + ordina + renderTrips(); skip se currentView==='next'
saveToLocalStorage()          → ordina trips + salva + autoSaveDrive()
saveNextToLocalStorage()      → ordina tripsNext + salva in viaggiLogisticaNext
loadTripsFromLocalStorage()   → carica + ordina trips
loadNextFromLocalStorage()    → carica + ordina tripsNext
_buildAndDownloadExcel()      → xlsx 2 fogli landscape A4 (solo settimana corrente)
_getVisibleTrips()            → rispetta filtri desktop attivi
downloadExcel()               → unificato
window.printPlanning()        → stampa con filtri
switchView(view, el)          → cambia vista; se view!='desktop' resetta _pcWeekMode a 'current'
pcSetWeek(mode, btn)          → toggle PC corrente/prossima; aggiorna _pcWeekMode
desktopAddEmpty(prefill?)     → popup nuovo viaggio PC
desktopConfirmAdd()           → crea viaggi dal popup rotte; routing su _wt2
desktopAddEmptyConfirm()      → crea righe vuote dal popup date; routing su _workingTrips
desktopSetNextWeek()          → 5 righe vuote Lun→Ven; routing su _pcWeekMode
desktopToggleConf(i)          → toggle ⚠ senza re-render
desktopToggleConfermato(i)    → toggle ✓; routing su _pcWeekMode
desktopSetField(i,f,v)        → modifica campo inline; routing su _pcWeekMode
desktopDel(i)                 → elimina riga; routing su _pcWeekMode
desktopDup(i)                 → duplica riga; routing su _pcWeekMode
desktopQuickFilter()          → ricerca multi-termine AND su input values
desktopToggleChrono()         → toggle ordine cronologico fisso
driveSave(silent?)            → salva Drive
autoSaveDrive()               → chiama driveSave(true)
archiveAndNewWeek()           → archivia + svuota + chiede importazione tripsNext
editTrip(idx)                 → apre modal modifica per trips[idx]
editNextTrip(idx)             → apre modal modifica per tripsNext[idx] (data-next-idx)
showSummaryModal(trips)       → popup riepilogo viaggi aggiunti
renderArchive()               → lista archivio
setText(id, value)            → helper safe textContent
toggleAddForm()               → apre/chiude form; contestuale a currentView
_prefillNextWeekDate()        → precompila data al lunedì prossimo
_undoPush(idx,field,oldVal)   → push undo stack (max 20)
_hov(el) / _hout(el)         → helper hover senza apici annidati
```

---

## Variabili globali principali
```js
let trips = []                    // settimana corrente, ordine cronologico
let tripsNext = []                // settimana prossima, separata
let filteredTrips = []
let weekTitle = "Sett. 15/2026..."
let currentView = 'compact'       // default
let searchQuery = ''
let importMode = 'add'
let filterState = { today, date, transporter, partenza, arrivo, giorno }
let driveAccessToken = null
let driveFileId = null
let _desktopSort = { field:'data', dir:'asc' }
let _desktopDayFilter = 'Tutti'
let _desktopQuickQuery = ''
let _desktopChrono = false
let _pcWeekMode = 'current'       // 'current' | 'next' — toggle PC settimana
let _undoStack = []               // max 20 entries: {idx, field, val}
const _dayPickerCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}
const _dpkColors = {lun:'96,165,250', mar:'52,211,153', mer:'167,139,250', gio:'251,191,36', ven:'244,114,182'}
const _DAY_COLORS = {1:{bg,border,txt,label}, ...}
let transportersList = [...]
let partenzaList = [...]
let arrivoList = [...]
```

---

## Elementi HTML critici
`#nextView`, `#nextBody`,
`#cardView`, `#compactView`, `#compactBody`, `#mediumView`, `#desktopView`, `#desktopBody`,
`#addTripSection`, `#tripForm`, `#editModal`, `#editForm`,
`#weekInfo`, `#syncBtn`, `#loadBtn`, `#desktopSyncBtn`, `#desktopLoadBtn`,
`#mobileDayPicker`, `#mdpk-btn-{lun|mar|mer|gio|ven}`, `#mdpk-date-{lun|mar|mer|gio|ven}`,
`#mobileDaySummary`, `#pcViewSwitcher`, `#archiveSection`, `#archiveList`,
`#desktopAddModal`, `#dmTransp`, `#dmFrom`, `#dmTo`, `#dmProd`, `#dmNote`, `#dmDate`, `#dmDaConf`, `#dmSummary`, `#dmRouteChips`,
`#desktopQuickSearch`, `#desktopSortChronoBtn`, `#desktopFilterCount`,
`#dpk-{lun|mar|mer|gio|ven}`, `#dpk-cnt-{lun|mar|mer|gio|ven}`,
`#addFormContextBanner`,
`#pcWeekToggle`, `#pcToggleCurrent`, `#pcToggleNext`,
`#newWeekModalV2`, `#nwv2CurrentTitle`, `#nwv2CurrentCount`, `#nwv2NewTitle`

---

## Tema visivo
- Sfondo: `#070a10`, pannelli: `#0f1220` / `#161b2e`, card: `#12161f`
- Accento corrente: `#ff6b35` (arancio)
- Accento prossima: `#a78bfa` (viola)
- Successo: `#06d6a0`, warning: `#ffd23f`
- Testo: `#e8edf5`, testo-dim: `#8892a4`
- Easing: `--spring: cubic-bezier(0.34,1.56,0.64,1)`

---

## Cosa NON fare
- **Non usare framework** — single-file HTML vanilla
- **Non usare template literal** (`` ` ``) in `renderArchive()` — usa concatenazione
- **Non annidare apici singoli** in stringhe JS — usa `_hov(el)` / `_hout(el)` per mouseover
- **Non aggiungere Sabato** — rimosso intenzionalmente
- **Non usare `toISOString().split('T')[0]`** per la data di oggi — sfasa timezone
- **Non mettere dati hardcoded** in `let trips` — deve essere `let trips = []`
- **Non fare re-render completo** per operazioni piccole
- **Non chiamare `filterApply()`** dalla vista PROSSIMA — ha il suo skip
- **Non modificare `trips[]` direttamente** nelle funzioni desktop — usare `_workingTrips` o `_wt`
- Per il plurale usare sempre `_pv(n)`
- Verificare **tutti gli script tag** con `node --check` — script indice 3, 4, 5

---

## Verifica codice (da fare dopo ogni modifica)
```bash
python3 -c "
import re
with open('/home/claude/index.html') as f: content = f.read()
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL)
for i, sc in enumerate(scripts):
    if sc.strip():
        with open(f'/tmp/sc_{i}.js','w') as f: f.write(sc)
"
for i in 3 4 5; do node --check /tmp/sc_$i.js && echo "OK $i" || echo "ERRORE $i"; done
```

---

## File output
- Lavoro: `/home/claude/index.html`
- Output versionate: `/mnt/user-data/outputs/app_viaggi_vN.html`
- Versione corrente: **v49b**
- Link GitHub raw: `https://raw.githubusercontent.com/firstlex55/TAB-VIAGGI-/refs/heads/main/index.html`

---

## Storico versioni
| v | Contenuto |
|---|-----------|
| v39 | Excel 2 fogli, stampa, ordinamento fix |
| v40 | Tema scuro, glow card, badge trasportatori |
| v41 | Form Opzione A, chip date reali, vista Oggi, vista Trasportatore, banner rimosso, PWA |
| v42 | Swipe-to-delete rapida, popup PC chip giorni, popup riepilogo, scroll auto |
| v43 | Spring physics, scroll 120Hz, font smoothing, GPU layers, azioni compatte, archivio |
| v44 | Fix SyntaxError renderArchive, fix plurale _pv(n), fix modal tagliato |
| v45 | Card OGGI/TRASP. redesign compatto, colori CEVOLO/CONECO, Excel premium Calibri, foglio Riepilogo 5 sezioni, auto-save silenzioso Drive, ricerca multi-termine PC, Tab fluido PC, ✓ click diretto, bottone sticky submit mobile |
| v46 | Popup PC unificato, versioning, fix timezone, rimosse date hardcoded, bottone 📦 Nuova sett. |
| v47 | Fix ricerca multi-termine (tutti i campi), contatori barra giorni corretti, badge trasportatore update inline, Ctrl+Z undo, separatori giorno PC premium, badge "da conf" pulse, filtro sidebar rotte multi-termine, hint Ctrl+Z/D |
| v48 | Vista OGGI → PROSSIMA (poi v48b fix opacity), Concept C per OGGI e TRASP., rotte 2 righe con nomi completi, tripRow bordo sinistro colorato, header tabella PC premium, routeCard redesign |
| v48b | Fix sbiadimento viste: giorni futuri a piena opacità |
| v48c | Fix troncamento nomi: _ccRow e renderMediumView a 2 righe |
| v49 | Vista PROSSIMA SETTIMANA (tripsNext), toggle PC Corrente/Prossima, archiviazione smart con importazione tripsNext, form contestuale, swipe-delete next |
| v49b | Fix bug: _pcWeekMode posizione, desktopSetNextWeek/ConfirmAdd routing, filterApply skip next, reset toggle su switchView, controllo generale codice |
