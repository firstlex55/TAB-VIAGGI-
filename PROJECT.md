# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app single-file HTML per la **pianificazione logistica settimanale dei viaggi** di Pro Trasporti.
Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`

File principale: **`index.html`** (~9200 righe) — tutto in un file, HTML + CSS + JS vanilla.
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
{
  data: "2026-03-17",        // ISO YYYY-MM-DD
  trasportatore: "COAP",
  partenza: "Bientina (INCONTRATO)",
  arrivo: "Verolavecchia (AGROGI)",
  prodotto: "Cippato",       // opzionale
  note: "",                  // opzionale
  daConfermare: false,
  confermato: false          // confermato al trasportatore
}
```
Salvato in `localStorage` chiave `viaggiLogistica`. **Sempre in ordine cronologico.**
`trips = []` — array vuoto all'avvio, NO dati hardcoded.

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
| OGGI | `#cardView` | Viaggi oggi + domani + prossimi. Card con badge trasportatore verticale. |
| TRASP. | `#mediumView` | Raggruppa per trasportatore, ordine alfabetico. Stesso layout card di OGGI. |
| RAPIDA | `#compactView` | Righe compatte per giorno — **vista principale**. Swipe destra → elimina. |
| PC | `#desktopView` | Tabella editabile inline, sidebar rotte rapide |

`currentView` salvato in `localStorage` come `preferredView`. Default: `compact`.

---

## Card layout (OGGI + TRASP.)
Struttura card compatta con **due righe**:
- **Riga 1**: badge trasportatore colorato (verticale sinistra) + partenza → arrivo (13px bold)
- **Riga 2**: codici partenza/arrivo + prodotto (9px dimmed)
- **Colonna destra**: giorno (11px bold) + data (8px arancio) + stato ✓/⚠
- Funzione: `_renderTodayCard(trip, isToday)` — usata sia da OGGI che da TRASP.

---

## Vista OGGI
- Sezione **Oggi** arancio, **Domani** grigio, **Prossimi** sotto
- Se vuota nei 3 giorni → mostra prossimi della settimana
- **Data calcolata localmente** (no `toISOString()` che usa UTC) — fix timezone Italia
- Helper: `_renderTodayCard(trip, isToday)`

---

## Vista RAPIDA
- Righe raggruppate per giorno con separatori pill colorati
- **Swipe a destra** → elimina il viaggio (soglia 90px, sfondo rosso, animazione chiusura)
- Scroll automatico alla riga appena inserita + highlight arancio 1.5s
- Funzione: `renderCompactView()`

---

## Vista TRASPORTATORE
- Raggruppa per trasportatore, ordine alfabetico, righe ordinate per data
- Header per gruppo: badge colorato + linea + contatore
- Card stessa struttura di OGGI (`_renderTodayCard`)
- Funzione: `renderMediumView()`

---

## Vista PC
- Tabella editabile inline con input per ogni cella
- **Tab fluido**: Tab naviga Partenza → Arrivo → Prodotto → Note senza perdere focus
- **Colonna ✓ cliccabile** direttamente nella tabella senza aprire modal (aggiorna solo cella, no re-render)
- **Data e Trasportatore**: onchange senza re-render completo — aggiorna solo il testo visivo inline
- Sidebar rotte rapide (apprende dai viaggi esistenti + manuali salvate)
- **Popup "Nuovo viaggio" unificato**:
  - Rotte rapide cliccabili in cima (precompilano trasportatore+partenza+arrivo)
  - Campi tratta (Da, A, Trasportatore, Prodotto, Note)
  - Chip giorni Lun-Ven con +/− colorati per giorno
  - Anteprima riepilogo prima di confermare
  - Funzione: `desktopAddEmpty(prefill?)` — accetta oggetto rotta per precompilare
- **Ricerca multi-termine**: spazio come separatore (es. `coap bientina` = AND)
- **Bottone ⏱ Data**: toggle ordine cronologico fisso
- Filtri giorno Lun-Ven, Ctrl+D duplica riga
- **📦 Nuova sett.**: archivia + svuota, aggiorna tutte le viste inclusa PC
- Bottoni toolbar: Sett. prossima, Nuova sett., Cerca, ⏱ Data, ☁️ Salva, 📥 Carica, ⬇️ Excel, 🖨️, 📊
- Export Excel usa sempre `_getVisibleTrips()` rispettando filtri attivi

---

## Form mobile — Opzione A
Flusso: **Trasportatore → Rotta → Prodotto+Note → Quando**

- Tutti i campi con autocomplete + salvataggio automatico nuovi valori in localStorage
- Trasportatore, Partenza, Arrivo: scrittura libera + datalist — nuovo valore aggiunto automaticamente al submit
- **Bottone "✅ Aggiungi Viaggio"**: sticky sopra la bottom nav (`bottom: calc(80px + env(safe-area-inset-bottom))`)
- Checkbox "Da confermare": usa `<label>` che wrappa tutto — cliccabile su tutta la larghezza
- Step Quando: chip Lun-Ven con date reali, logica "sempre avanti", +7gg, Reset

---

## Popup Riepilogo viaggi aggiunti
- Lista viaggi appena creati con giorno colorato + trasportatore + rotta
- Bottone ✕ e "OK, ho controllato" per chiudere
- Funzioni: `showSummaryModal(newTrips)`, `closeSummaryModal()`

---

## Modal Modifica (mobile)
- Bottom sheet su mobile: `border-radius: 20px 20px 0 0`, `max-height: 85vh`
- Bottone "💾 Salva Modifiche": `position: sticky; bottom: 0` — sempre visibile
- Auto-aggiorna liste trasportatore/partenza/arrivo al salvataggio

---

## Top bar
- Logo 48px con glow arancio, `image-rendering: crisp-edges`
- **VIAGGI** — gradiente arancio puro `#ff7a40→#ff5520`, letter-spacing 4px
- **Settimana** — formato `Lun 23/03 — Ven 27/03`, JetBrains Mono 12px bold, no-wrap
- Drive status: pill con dot colorato + testo

---

## Barra giorni (week-progress-bar)
- 5 segmenti Lun-Ven, altezza 38px, etichetta 11px bold + contatore
- Verde = passato, arancio = oggi, grigio = futuro
- Click → filtra per giorno

---

## Export Excel — Foglio Viaggi
- Font: **Calibri** ovunque (no Arial)
- Intestazione: sfondo `#0F172A` con bordo arancio, titolo "PLANNING VIAGGI · Pro Trasporti"
- Header colonne: sfondo navy `#1E3A5F`, 10px bold bianco
- **Data**: bold Calibri blu navy `#1E3A5F`
- **Partenza**: bold nero
- **Arrivo**: bold verde scuro `#065F46`
- **Prodotto**: bold grigio scuro
- **Trasportatore**: bold colorato centrato
- Separatori giorno: sfondo scuro per giorno (navy lun, verde scuro mar, viola scuro mer, marrone gio, rosa scuro ven) + testo colorato vivido
- Zebra chiaro, freeze header riga 3, landscape A4

## Export Excel — Foglio Riepilogo
5 sezioni con helper functions (`addR2Title`, `addR2Header`, `addR2DataRow`, `addR2TotalRow`):
1. **Totali per trasportatore** (viaggi, conf., da conf.)
2. **Totali per giorno** (con sfondo colorato per giorno)
3. **Partenze per luogo** (ordinate per frequenza)
4. **Arrivi per luogo** (ordinate per frequenza)
5. **Prodotti trasportati** (solo se presenti, ordinate per frequenza)

## Export unificato
`downloadExcel()` usa sempre la stessa `_buildAndDownloadExcel()`:
- Vista PC: rispetta filtro giorno + ordinamento attivo
- Altre viste: rispetta filtri attivi (search, trasportatore, data...)

---

## Google Drive
- Scope: `drive.appdata`, file: `planning-viaggi-data.json`
- **Auto-save sempre silenzioso** (`driveSave(true)`) — nessun conflict modal automatico
- Conflict modal solo su salvataggio **manuale** (`driveSave()` senza parametri)
- Auto-reconnect token ogni 50min silenzioso
- Bottoni sincronizzati: `syncBtn` (mobile) + `desktopSyncBtn` (PC)

---

## Sincronizzazione viste
- Dopo ogni operazione su `trips` (aggiunta, modifica, nuova settimana, archivia) → chiamare `renderTrips()` oltre a `filterApply()`
- `renderTrips()` dispatcha alla vista corrente — garantisce che PC e mobile vedano sempre gli stessi dati
- `trips = []` all'avvio — NO dati hardcoded campione

---

## Cosa NON fare
- **Non usare framework** — single-file HTML vanilla, no dipendenze aggiuntive
- **Non usare template literal** (`` ` ``) in `renderArchive()` — usa concatenazione stringa
- **Non annidare apici singoli** in stringhe JS — causa SyntaxError
- **Non usare** `getElementById().textContent=` senza null-check → usa `setText()`
- **Non aggiungere Sabato** — rimosso intenzionalmente da tutti i picker e filtri
- **Non usare `toISOString().split('T')[0]`** per la data di oggi — sfasa di fuso orario. Usare:
  ```js
  var d = new Date();
  var today = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  ```
- **Non mettere dati hardcoded** in `let trips = [...]` — deve essere `let trips = []`
- **Non fare re-render completo** per operazioni piccole (toggle confermato, update campo inline)
- Per il plurale usare sempre `_pv(n)` — mai `'viaggio'+(n!==1?'i':'')`
- Verificare **tutti gli script tag** con `node --check` — script indice 3, 4, 5
- Non usare regex Python per sostituire JS con apici — usare `python3 - << 'PYEOF'` con heredoc

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

## Funzioni JS critiche
```
_pv(n)                      → plurale: n===1 ? 'viaggio' : 'viaggi'
renderTrips()               → dispatcha alla vista corrente (SEMPRE chiamare dopo modifiche)
renderCardView()            → vista OGGI
_renderTodayCard(t, today)  → card condivisa OGGI + TRASP.
renderMediumView()          → vista TRASPORTATORE
renderCompactView()         → vista RAPIDA (swipe-to-delete)
renderDesktopView()         → vista PC tabella
filterApply()               → filtra + ordina + renderTrips()
saveToLocalStorage()        → ordina + salva + autoSaveDrive()
loadTripsFromLocalStorage() → carica + ordina
_buildAndDownloadExcel()    → xlsx 2 fogli landscape A4
_getVisibleTrips()          → rispetta filtri desktop attivi
downloadExcel()             → unificato: usa filtri vista corrente
window.printPlanning()      → stampa con filtri
switchView(view, el)        → cambia vista, aggiorna classi
desktopAddEmpty(prefill?)   → popup nuovo viaggio PC unificato (accetta rotta precompilata)
_dmPopulateRoutes()         → popola chip rotte rapide nel popup
_dmApplyRoute(r)            → precompila campi dal click rotta rapida
desktopConfirmAdd()         → crea viaggi dal popup PC
desktopToggleConfermato(i)  → toggle ✓ senza re-render (aggiorna solo cella)
desktopSetField(i,f,v)      → modifica campo inline con debounce Drive
desktopQuickFilter()        → ricerca multi-termine (split spazio = AND)
desktopToggleChrono()       → toggle ordine cronologico fisso
desktopSetNextWeek()        → 5 righe vuote Lun→Ven
driveSave(silent?)          → salva Drive; silent=true → no conflict modal
autoSaveDrive()             → chiama driveSave(true)
archiveAndNewWeek()         → archivia + svuota + renderTrips()
showSummaryModal(trips)     → popup riepilogo viaggi aggiunti
renderArchive()             → lista archivio (NO template literal)
setText(id, value)          → helper safe textContent
_dpkUpdate(d)               → aggiorna chip giorno picker PC (colori per giorno)
addLocationToList(loc,type) → aggiunge partenza/arrivo alle liste autocomplete
```

---

## Variabili globali principali
```js
let trips = []                    // sempre ordine cronologico, NO dati hardcoded
let filteredTrips = []
let weekTitle = "Lun 23/03 — Ven 27/03"
let currentView = 'compact'       // default
let searchQuery = ''
let importMode = 'add'            // 'add' | 'replace'
let filterState = { today, date, transporter, partenza, arrivo, giorno }
let driveAccessToken = null
let driveFileId = null
let _desktopSort = { field:'data', dir:'asc' }
let _desktopDayFilter = 'Tutti'
let _desktopQuickQuery = ''
let _desktopChrono = false
const _dayPickerCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}
const _dpkColors = {lun:'96,165,250', mar:'52,211,153', mer:'167,139,250', gio:'251,191,36', ven:'244,114,182'}
const _DAY_COLORS = {1:{bg,border,txt,label}, ...}  // sfondo scuro + testo colorato per giorno
let transportersList = [...]
let partenzaList = [...]
let arrivoList = [...]
```

---

## Elementi HTML critici
`#cardView`, `#compactView`, `#compactBody`, `#mediumView`, `#desktopView`, `#desktopBody`,
`#addTripSection`, `#tripForm`, `#editModal`, `#editForm`,
`#weekInfo`, `#syncBtn`, `#loadBtn`, `#desktopSyncBtn`, `#desktopLoadBtn`,
`#mobileDayPicker`, `#mdpk-btn-{lun|mar|mer|gio|ven}`, `#mdpk-date-{lun|mar|mer|gio|ven}`,
`#mobileDaySummary`, `#pcViewSwitcher`, `#archiveSection`, `#archiveList`,
`#desktopAddModal`, `#dmTransp`, `#dmFrom`, `#dmTo`, `#dmProd`, `#dmNote`, `#dmDate`, `#dmDaConf`, `#dmSummary`, `#dmRouteChips`,
`#desktopQuickSearch`, `#desktopSortChronoBtn`, `#desktopFilterCount`,
`#dpk-{lun|mar|mer|gio|ven}`, `#dpk-cnt-{lun|mar|mer|gio|ven}`

---

## Tema visivo
- Sfondo: `#070a10`, pannelli: `#0f1220` / `#161b2e`, card: `#12161f`
- Accento: `#ff6b35`, successo: `#06d6a0`, warning: `#ffd23f`
- Testo: `#e8edf5`, testo-dim: `#8892a4`
- Easing: `--spring: cubic-bezier(0.34,1.56,0.64,1)`

---

## File output
- Lavoro: `/home/claude/index.html`
- Output versionate: `/mnt/user-data/outputs/app_viaggi_vN.html`
- Versione corrente: **v46**
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
| v45 | Card OGGI/TRASP. redesign compatto, colori CEVOLO/CONECO, Excel premium Calibri, foglio Riepilogo 5 sezioni, auto-save silenzioso Drive, ricerca multi-termine PC, Tab fluido PC, ✓ click diretto senza re-render, bottone sticky submit mobile, fix daConfermare checkbox, autocomplete salva nuovi valori |
| v46 | Popup PC unificato (rotte rapide + tratta + chip giorni in un'unica schermata), versioning esplicito, fix timezone data oggi (locale vs UTC), rimosse date hardcoded campione, bottone 📦 Nuova sett. in toolbar PC, renderTrips() dopo ogni nuova settimana |
