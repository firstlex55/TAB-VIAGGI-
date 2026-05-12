# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app **single-file HTML vanilla** per la pianificazione logistica settimanale dei viaggi di **Pro Trasporti**.
- Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`
- File principale: `index.html` (~10000 righe) — tutto in un file, HTML + CSS + JS
- Fil (utente) comunica in **italiano** e vuole risposte in italiano
- Usata quotidianamente su **mobile e desktop**

---

## Stack tecnico
- **HTML/CSS/JS vanilla** — nessun framework, nessun build step
- **ExcelJS 4.4.0** — export Excel (2 fogli: Viaggi + Riepilogo, landscape A4, Calibri)
- **XLSX 0.18.5** — import Excel
- **Google Drive API** — sync OAuth2 + fetch diretto (no gapi)
- **Google Fonts** — Outfit + JetBrains Mono
- **PWA** — manifest.json + sw.js (network-first) + logo.png

---

## Schema dati
```js
// Ogni viaggio:
{
  data: "2026-05-04",            // ISO YYYY-MM-DD — MAI toISOString() per oggi (timezone bug)
  trasportatore: "COAP",
  partenza: "Bientina (INCONTRATO)",   // nome (CODICE)
  arrivo: "Verolavecchia (AGROGI)",    // nome (CODICE)
  prodotto: "Segatura",          // opzionale
  note: "",                      // opzionale
  daConfermare: false,
  confermato: false
}

// Settimana corrente
let trips = [];                  // localStorage 'viaggiLogistica' — MAI dati hardcoded
// Settimana prossima — completamente separata
let tripsNext = [];              // localStorage 'viaggiLogisticaNext'
```

---

## Trasportatori e colori CSS
Variabili CSS: `--t-{key}` e `--t-{key}-bg`
```
CEVOLO  → #e8821a ambra        key: cevolo
COAP    → #5b8dd9 blu          key: coap
ConEco  → #e040a0 fucsia       key: coneco
CONSAR  → #06d6a0 verde acqua  key: consar
AVIO    → #38bdf8 azzurro      key: avio
LINO BRA→ #c084fc viola        key: linobra
C.M TRASP→ #34d399 verde       key: cmtrasp
CLP     → #CA8A04 oro          key: clp
ALB     → #f5a623 giallo       key: alb
Stegagno→ #94a3b8 grigio       key: stegagno
```
Funzioni: `getTransporterKey(name)`, `getTransporterColorClass(name)`

---

## Viste mobile (bottom nav)
| Vista | ID | Descrizione |
|-------|----|-------------|
| PROSSIMA | `#nextView` + `#nextBody` | tripsNext, sfondo viola `#a78bfa`, sostituisce la vecchia OGGI |
| TRASP. | `#mediumView` | Card per trasportatore, Concept C (header grande + righe 2 livelli) |
| RAPIDA | `#compactView` + `#compactBody` | Vista principale. Swipe destra → elimina. Banner "da confermare" in cima |
| PC | `#desktopView` + `#desktopBody` | Tabella editabile inline. Toggle Corrente/Prossima in toolbar |

`currentView` salvato in localStorage `preferredView`. Default: `compact`.

---

## Vista PROSSIMA (tripsNext)
- Mostra `tripsNext` separati da `trips` — **non appaiono mai nelle altre viste**
- Sfondo e accenti viola per distinguerla visivamente
- Premi `+` → form apre con data precompilata a **lunedì prossimo** + banner viola
- `_prefillNextWeekDate()` → calcola lunedì prossimo
- `filterApply()` — **skippa completamente** se `currentView==='next'`
- Swipe-delete usa `data-next-idx` (non `data-idx`)
- Modifica via `editNextTrip(idx)` → modal con `data-next-idx`
- `saveNextToLocalStorage()` → salva in `viaggiLogisticaNext`
- `loadNextFromLocalStorage()` → chiamata in `window.onload`

---

## Banner "Da confermare" (Vista RAPIDA)
Appare in cima alla lista RAPIDA quando `trips.filter(t => t.daConfermare).length > 0`

**Struttura ogni riga del banner:**
- Checkbox 18×18px
- Data: giorno abbreviato piccolo + numero grande giallo (es. `Lun` / `13`)
- Badge trasportatore compatto
- Partenza (bianco) su riga 1, Arrivo (verde) su riga 2

**Funzioni:**
- `_toggleDaConfBanner()` → collassa/espande body
- `_compactConfirm(idx)` → anima checkbox, poi `renderCompactView()` dopo 380ms
- `_confirmAllCompact()` → conferma tutti in un colpo, salva, ri-renderizza

**Importante:** cerca sempre in `trips[]` completo, non in `displayTrips` filtrato.

**Badge micro nella lista:** ogni riga con `daConfermare=true` mostra `⚠ conf.` sotto il badge trasportatore (nella colonna sinistra). Click → `stopPropagation` + `_compactConfirm(idx)`. Click riga → apre modal modifica.

---

## Vista PC — tabella editabile

### Toggle Corrente/Prossima
```js
let _pcWeekMode = 'current'; // 'current' | 'next'
// DICHIARATA insieme a _desktopSort (non dopo desktopSetField!)
let _desktopSort = { field:'data', dir:'asc' };
let _pcWeekMode = 'current';
```
- `pcSetWeek(mode, btn)` → aggiorna stile bottoni + chiama `renderDesktopView()`
- Si resetta a `'current'` quando esci dalla vista PC (`switchView`)
- **Tutte le operazioni PC** usano `_workingTrips = _pcWeekMode==='next' ? tripsNext : trips`:
  - `desktopSetField`, `desktopDel`, `desktopDup`
  - `desktopToggleConf`, `desktopToggleConfermato`
  - `desktopAddEmptyConfirm`, `desktopConfirmAdd`, `desktopSetNextWeek`

### Separatori di giorno (renderDesktopView)
Inseriti automaticamente tra gruppi di date. Colori fissi per giorno:
```js
const dayColors = {
  1:{col:'#60a5fa',rgb:'96,165,250',  name:'LUNEDÌ'},
  2:{col:'#34d399',rgb:'52,211,153',  name:'MARTEDÌ'},
  3:{col:'#a78bfa',rgb:'167,139,250', name:'MERCOLEDÌ'},
  4:{col:'#fbbf24',rgb:'251,191,36',  name:'GIOVEDÌ'},
  5:{col:'#f472b6',rgb:'244,114,182', name:'VENERDÌ'},
};
```
Ogni riga viaggio ha `background: rgba(rgb, 0.03)` del giorno + colore data.

### tripRow(trip, realIdx, dayRgb)
- Terzo parametro `dayRgb` → sfondo alternato per giorno
- Colonna DATA: testo grande cliccabile, picker nativo nascosto (opacity:0)
- Colonna TRASP: barra verticale 3px colorata + input
- Partenza/Arrivo: input 14px + chip codice `_codeChip(code)` sotto
- Stato: solo badge `⚠ Da conf.` (pill giallo), niente ✓ confermato
- Click badge → `desktopToggleConf(idx)` → imposta `daConfermare=false` (NON toggle)
- Tab+Enter → campo successivo in tutta la tabella
- `inpStyle`: `font-size:14px; padding:9px 10px`

### Ricerca PC — desktopQuickFilter()
- **Cerca su `input[type="text"]` values** — non su textContent (che include chip e separatori)
- Dopo aver filtrato le righe, nasconde i separatori di giorno se non hanno righe visibili
- Termini separati da spazio = AND

### Mini totali per trasportatore (toolbar)
Inline nella toolbar, chips `COAP 4 | CEVOLO 3 | ...` calcolati da `_workingTrips`.

### Codici azienda colorati
```js
function _locationCodeColor(code) { ... }  // ritorna {bg, bd, tx}
function _codeChip(code) { ... }           // ritorna HTML badge
```
Mappa colori fissi per codice noto (INCONTRATO=blu, AGROGI=verde, SICEM=ambra, ARDENGHI=viola, TACCHELLA=rosa, TRUCIOLI=azzurro, VENDER=lilla, CAI-BF=giallo, MANCINI=verde chiaro, LEGNO VIVO=rosa, PUNTO VERDE=verde, ILT=arancio).
Fallback: hash deterministico → colore HSL sempre uguale per lo stesso nome.
`desktopSetField` aggiorna il chip inline senza re-render quando cambia partenza/arrivo.

---

## desktopGetNextWeekday(dayName) — BUGFIX v58b
**Problema storico:** dopo "Nuova settimana" `trips[]` era vuoto → date sbagliate.

**Priorità corretta:**
1. Se `_pcWeekMode==='next'` → usa `tripsNext[0]` o calcola lunedì prossimo
2. Se `weekTitle` contiene "Lun. DD/MM" → **legge dal titolo** (fonte più affidabile)
3. Se `trips[0]` esiste → usa come riferimento
4. Fallback → lunedì di questa settimana

```js
// Il weekTitle ha formato: "Settimana 18/2026 (Lun. 27/04 - Ven. 01/05)"
const m = weekTitle.match(/Lun\.\s*(\d{2})\/(\d{2})/);
```

---

## desktopSetNextWeek() — BUGFIX v53
Calcola sempre il **lunedì della settimana SUCCESSIVA** a quella corrente:
```js
const daysToThisMon = day === 0 ? -6 : (1 - day);
const nextMon = new Date(now);
nextMon.setDate(now.getDate() + daysToThisMon + 7); // +7 = sempre settimana prossima
```

---

## Archiviazione smart — archiveAndNewWeek()
1. Archivia `trips[]` in `weekArchive`
2. Se `tripsNext.length > 0` → `confirm()`:
   - **SÌ** → `trips = deepCopy(tripsNext)`, `tripsNext = []`, salva entrambi
   - **NO** → `trips = []`, `tripsNext` rimane intatto
3. Aggiorna `filteredTrips = [...trips]` prima di `filterApply()`

**IMPORTANTE:** Il bottone mobile "Nuova settimana" chiama `showNewWeekModalV2()` — **NON** il vecchio `showNewWeekModal()` che aveva comportamento diverso e causava doppioni.

---

## Import Excel — importaExcel(file) — BUGFIX v58c/d

### Formato file prodotto dall'app:
```
Riga 1: PLANNING VIAGGI
Riga 2: Settimana 19/2026 (Lun.04/05 - Ven. 08/05)
Riga 3: [vuoto] | Data | Trasportatore | Partenza da | Arrivo a | Eseguito/DDT
Riga 4: [vuoto] | LUN. 04/05/2026 | COAP | Bientina (INCONTRATO) | Verolavecchia (AGROGI) | 396
```

### Fix implementati:
- **Parsing data robusto**: rimuove prefisso giorno (`LUN.`, `MAR.`, `MERC.`, `GIOV.`, `VEN.`) prima di parsare
- Supporta: `dd/mm/yyyy`, ISO `yyyy-mm-dd`, formato corto `dd/mm`, seriale numerico Excel
- **Colonna Data in posizione 1** (non 0) — prima colonna del foglio è vuota
- Cerca foglio "Viaggi" o "Planning" prima del foglio 0
- Header detection permissiva (fino a riga 15), fallback su "trasportatore" come ancora
- Importa anche il campo **prodotto** (prima era sempre vuoto)
- Normalizza: `"LINO BRANCHINI"` → `"LINO BRA"`, `"Con.Eco"` rimane invariato
- `cellDates: true` in XLSX.read per date native

---

## Export Excel — _buildAndDownloadExcel()
- 2 fogli: **Viaggi** (landscape A4, Calibri, bordi, celle colorate) + **Riepilogo** (5 sezioni)
- Intestazione colonne: `['', 'Data', 'Trasportatore', 'Partenza da', 'Arrivo a', 'Eseguito/DDT']`
- Formato data nelle celle: `"LUN. DD/MM/YYYY"` (es. `"LUN. 04/05/2026"`)
- Usa `_getVisibleTrips()` per rispettare filtri PC attivi
- Foglio Riepilogo: totali per trasportatore, per giorno, per partenza, per arrivo, per prodotto

---

## Stampa — window.printPlanning()
Layout professionale in nuova finestra (A4 landscape):
- Font **Inter** (importato da Google Fonts)
- Header: brand "Pro Trasporti · Planning Logistica" + titolo + data stampa a destra
- Separatori di giorno colorati per giorno (stessi colori della vista PC)
- Righe alternate grigio chiarissimo
- Righe `daConfermare` con sfondo giallo e bordo sinistro arancio
- Codici partenza/arrivo in piccolo sotto il nome
- Chips totali per trasportatore + totale complessivo
- Footer: brand + settimana + data
- Bottone "🖨️ Stampa / Salva PDF" nascosto in stampa (`class="no-print"`)

---

## Autocomplete trasportatori
`loadTransportersList()` raccoglie **tutti** i trasportatori mai usati:
1. `localStorage.transportersList`
2. Archivio storico `weekArchive` (tutte le settimane passate)
3. `trips[]` corrente e `tripsNext[]`
→ Un trasportatore non usato questa settimana **rimane sempre disponibile** nell'autocomplete.

Il datalist PC (`allT`) usa `transportersList` completa invece di una lista hardcoded.

---

## Modal modifica viaggio
- Struttura flex con 3 zone fisse: header + form scrollabile + bottone sticky
- `z-index: 2000` (sopra la bottom nav che è 1000)
- `max-height: calc(100vh - 72px - env(safe-area-inset-bottom))` su mobile
- Bottone "Salva Modifiche": outline arancio `border:1.5px solid #ff6b35`, `background:rgba(255,107,53,0.08)`, `color:#ff6b35`
- Per `tripsNext`: il modal riceve `data-next-idx`, salvato in tripsNext, rimosso in `closeEditModal()`

---

## Colori tema (CSS root)
```css
--bg: #080a10;
--primary: #0f1117;
--secondary: #161922;
--accent: #ff6b35;
--success: #06d6a0;
--warning: #ffd23f;
--text: #f2f4f8;
--text-dim: #9aa3b2;
--text-muted: #5a6272;
--border: rgba(255,255,255,0.10);
```

---

## localStorage — tutte le chiavi
| Chiave | Contenuto |
|--------|-----------|
| `viaggiLogistica` | trips[] corrente |
| `viaggiLogisticaNext` | tripsNext[] prossima |
| `weekTitle` | Titolo settimana corrente |
| `transportersList` | Lista trasportatori per autocomplete |
| `partenzaList` | Lista partenze |
| `arrivoList` | Lista arrivi |
| `preferredView` | Vista attiva al riavvio |
| `pcb_routes` | Rotte manuali sidebar PC |
| `weekArchive` | Archivio settimane passate |
| `appVersion` | Versione app (v58d) |

---

## Funzioni JS critiche
```
renderNextView()              → vista PROSSIMA (tripsNext)
renderCompactView()           → RAPIDA con banner da confermare
renderDesktopView()           → tabella PC, usa _workingTrips
renderMediumView()            → TRASP. Concept C

_compactConfirm(idx)          → conferma da RAPIDA/banner (anima, poi re-render)
_confirmAllCompact()          → conferma tutti dalla RAPIDA
_toggleDaConfBanner()         → collassa/espande banner da confermare
_prefillNextWeekDate()        → precompila lunedì prossimo nel form
_locationCodeColor(code)      → {bg,bd,tx} colore fisso per codice azienda
_codeChip(code)               → HTML badge colorato per codice
_pv(n)                        → plurale: n===1 ? 'viaggio' : 'viaggi'
_hov(el) / _hout(el)         → helper hover senza apici annidati
_undoPush(idx,field,val)      → push undo stack (max 20)

filterApply()                 → SALTA se currentView==='next'
saveToLocalStorage()          → ordina + salva + autoSaveDrive
saveNextToLocalStorage()      → ordina tripsNext + salva
loadTripsFromLocalStorage()   → chiamata in onload
loadNextFromLocalStorage()    → chiamata in onload
loadTransportersList()        → raccoglie da archivio storico

switchView(view, el)          → se view!='desktop': resetta _pcWeekMode='current'
pcSetWeek(mode, btn)          → toggle PC, aggiorna bottoni
desktopSetField(i,f,v)        → modifica inline + aggiorna chip codice
desktopDel(i)                 → elimina, routing _pcWeekMode
desktopDup(i)                 → duplica, routing _pcWeekMode
desktopToggleConf(i)          → imposta daConfermare=FALSE (non toggle!), no re-render
desktopToggleConfermato(i)    → toggle confermato, routing _pcWeekMode
desktopAddEmptyConfirm()      → nuove righe vuote, routing _wt
desktopConfirmAdd()           → da popup rotte, routing _wt2
desktopSetNextWeek()          → 5 righe Lun-Ven settimana PROSSIMA, routing _pcWeekMode
desktopGetNextWeekday(day)    → data corretta da weekTitle (priorità)
desktopQuickFilter()          → ricerca su input values, nasconde separatori vuoti

archiveAndNewWeek()           → archivia + confirm import tripsNext + filteredTrips sync
showNewWeekModalV2()          → modal nuova settimana (USARE QUESTO, non showNewWeekModal!)
editNextTrip(idx)             → apre modal per tripsNext[idx]
importaExcel(file)            → import robusto con parsing data prefisso giorno
window.printPlanning()        → stampa premium in nuova finestra
downloadExcel()               → export Excel 2 fogli
_buildAndDownloadExcel(trips, title, suffix) → core export
getTransporterKey(name)       → chiave CSS colore trasportatore
getTransporterColorClass(name)→ classe CSS badge
```

---

## Variabili globali principali
```js
let trips = []                    // settimana corrente — MAI hardcoded
let tripsNext = []                // settimana prossima — separata
let filteredTrips = []
let weekTitle = "Sett. 19/2026 (Lun. 04/05 - Ven. 08/05)"
let currentView = 'compact'
let transportersList = [...]      // include storico archivio
let partenzaList = []
let arrivoList = []
let driveAccessToken = null
let driveFileId = null
let importMode = 'add'            // 'add' | 'replace'
let _desktopSort = { field:'data', dir:'asc' }
let _desktopDayFilter = 'Tutti'
let _desktopQuickQuery = ''
let _desktopChrono = false
let _pcWeekMode = 'current'       // dichiarata CON _desktopSort, prima di desktopSetField
let _undoStack = []               // max 20: {idx, field, val}
const _dayPickerCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}
```

---

## Elementi HTML critici (ID)
```
#nextView, #nextBody
#compactView, #compactBody
#mediumView
#desktopView, #desktopBody
#cardView (legacy, non raggiunta dalla nav)

#daConfBanner, #daConfBody, #daConfArr    ← banner da confermare RAPIDA
#addTripSection, #tripForm
#addFormContextBanner                      ← banner viola form aggiunta prossima sett.
#editModal, #editForm

#pcWeekToggle, #pcToggleCurrent, #pcToggleNext
#desktopQuickSearch                        ← ricerca PC 240px
#newWeekModalV2, #nwv2CurrentTitle, #nwv2NewTitle, #nwv2CurrentCount

#weekInfo                                  ← titolo settimana
#syncBtn, #desktopSyncBtn
#loadBtn, #desktopLoadBtn
#fileInput                                 ← input file import Excel

#desktopAddModal, #dmTransp, #dmFrom, #dmTo, #dmProd, #dmNote, #dmDate, #dmDaConf
#dpk-{lun|mar|mer|gio|ven}, #dpk-cnt-{...} ← day picker PC
```

---

## Regole critiche — NON fare mai
1. **No framework** — single-file HTML vanilla
2. **No template literal** (backtick) in `renderArchive()` — usa concatenazione `+`
3. **No apici singoli annidati** in stringhe JS — usa `_hov(el)/_hout(el)` per mouseover inline
4. **No `toISOString().split('T')[0]`** per la data di oggi — sfasa timezone; usa getFullYear/getMonth/getDate
5. **No dati hardcoded** in `let trips = [...]` — deve essere `let trips = []`
6. **No `filterApply()`** dalla vista PROSSIMA — la funzione ha il suo skip per `currentView==='next'`
7. **No `trips[]` diretto** nelle funzioni desktop — usare `_workingTrips` o `_wt`
8. **No vecchio `showNewWeekModal()`** — usare `showNewWeekModalV2()`
9. **No Sabato** nei filtri — rimosso intenzionalmente
10. Plurale: sempre `_pv(n)`, mai hardcoded

---

## Workflow sviluppo
```bash
# Claude scarica il file direttamente da GitHub:
# https://raw.githubusercontent.com/firstlex55/TAB-VIAGGI-/refs/heads/main/index.html

# Modifiche: usa bash_tool + python3 per str.replace chirurgici
# Dopo ogni modifica → verifica sintassi JS:
python3 -c "
import re
with open('/home/claude/index.html') as f: content = f.read()
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL)
for i, sc in enumerate(scripts):
    if sc.strip():
        with open(f'/tmp/sc_{i}.js','w') as f: f.write(sc)
"
for i in 3 4 5; do node --check /tmp/sc_$i.js && echo "OK $i" || echo "ERRORE $i"; done

# Output finale:
cp /home/claude/index.html /mnt/user-data/outputs/app_viaggi_vXX.html
```

**Script indices rilevanti:** 3, 4, 5 (gli altri sono librerie esterne)

**Fallback str.replace:** se `str.replace()` fallisce per whitespace/escape diversi:
```python
idx = content.find('testo_da_trovare')
end = content.find('fine_del_blocco', idx) + len('fine_del_blocco')
content = content[:idx] + nuovo_testo + content[end:]
```

---

## Versione corrente: **v58d**
GitHub raw: `https://raw.githubusercontent.com/firstlex55/TAB-VIAGGI-/refs/heads/main/index.html`

## Storico versioni
| v | Contenuto principale |
|---|---------------------|
| v49b | Vista PROSSIMA (tripsNext), toggle PC Corrente/Prossima, archiviazione smart |
| v50b | Redesign tabella PC, colonna DATA solo testo cliccabile |
| v51-v51g | Badge ⚠ Da conf. pill, _compactConfirm RAPIDA, modal z-index fix, bottone salva outline |
| v52 | Codici azienda colorati (_codeChip, _locationCodeColor) |
| v53-v53d | Separatori giorno PC colorati, fix ricerca PC (input values), fix date settimana PC, fix mobile nuova settimana |
| v54 | Badge ⚠ conf. micro sotto trasportatore (Concept C) |
| v55-v55e | Banner "Da confermare" collassabile in RAPIDA, rotte 2 righe nel banner |
| v56 | Autocomplete trasportatori da archivio storico, totali inline toolbar, routeCard redesign |
| v57-v57c | Leggibilità PC: font 14px, padding righe, label colonne 10px, ricerca 240px, hover/focus migliorati |
| v58 | Stampa premium (Inter, separatori colorati, chips totali, footer) |
| v58b | Fix desktopGetNextWeekday: usa weekTitle come fonte primaria (non trips[0]) |
| v58c | Fix import Excel: parsing "LUN. DD/MM/YYYY", header detection permissiva, prodotto importato |
| v58d | Fix parsing data con prefisso giorno (MERC., GIOV. ecc.) |
