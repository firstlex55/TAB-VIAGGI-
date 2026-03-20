# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app single-file HTML per la **pianificazione logistica settimanale dei viaggi** di un'azienda di trasporti (Pro Trasporti). Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`

Il file principale è **un unico `index.html`** (~8300 righe) che contiene tutto: HTML, CSS inline, JavaScript vanilla. Non usa framework, non ha build step, non ha dipendenze locali.

File aggiuntivi nel repo: `manifest.json`, `sw.js` (Service Worker PWA), `logo.png`.

---

## Stack tecnico
- **HTML/CSS/JS vanilla** — nessun framework
- **ExcelJS 4.4.0** — export Excel con stili reali (2 fogli: Viaggi + Riepilogo, landscape A4)
- **XLSX 0.18.5** — import Excel
- **Google Drive API** — sync dati via OAuth2 + fetch diretto (no gapi library)
- **Google Fonts** — Outfit + JetBrains Mono
- **PWA** — manifest.json + sw.js (Service Worker) + logo.png

---

## Struttura dati
```js
{
  data: "2026-03-17",          // ISO YYYY-MM-DD
  trasportatore: "COAP",
  partenza: "Bientina (INCONTRATO)",
  arrivo: "Verolavecchia (AGROGI)",
  prodotto: "Cippato",         // opzionale
  note: "",                    // opzionale
  daConfermare: false,
  confermato: false            // confermato al trasportatore
}
```
Salvato in localStorage chiave `viaggiLogistica`. **Sempre in ordine cronologico.**

---

## Trasportatori principali
CEVOLO, COAP, CONSAR, AVIO, ALB, LINO BRA, ConEco, Stegagno, Cirioni, CLP
Colori CSS: variabili `--t-{key}` e `--t-{key}-bg`.

---

## Viste disponibili (bottom nav mobile)
| Vista | ID | Descrizione |
|-------|----|-------------|
| OGGI | `#cardView` | Viaggi oggi + domani + prossimi |
| TRASP. | `#mediumView` | Raggruppa per trasportatore |
| RAPIDA | `#compactView` | Righe compatte per giorno — vista principale |
| PC | `#desktopView` | Tabella editabile inline |

La vecchia LISTA è ora TRASPORTATORE. La vecchia CARD è ora OGGI.
`currentView` salvato in localStorage come `preferredView`. Default: `compact`.

---

## Vista OGGI (ex-Card)
- Viaggi di oggi in primo piano, domani in secondo, prossimi sotto
- Se nessun viaggio nei 3 giorni → mostra prossimi della settimana
- Helper: `_renderTodayCard(trip, isToday)`

---

## Vista TRASPORTATORE (ex-Lista)
- Raggruppa per trasportatore, ordine alfabetico
- Righe viaggio ordinate per data dentro ogni gruppo
- Funzione: `renderMediumView()`

---

## Vista PC
- Tabella editabile inline, popup data per nuova riga (→ focus su trasportatore)
- Sidebar rotte rapide, filtri giorno Lun-Ven (Sab rimosso)
- Pulsante "Sett. prossima" → 5 righe vuote Lun→Ven
- Ctrl+D duplica riga, Export Excel filtrato, Stampa

---

## Form mobile — Opzione A
Flusso: Trasportatore → Rotta → Prodotto+Note → Quando

**Picker giorni:**
- Campo data primo viaggio → chip Lun/Mar/Mer/Gio/Ven mostrano date reali della settimana
- Logica "sempre avanti": chip già passati vanno alla settimana successiva
- Sabato rimosso ovunque
- Tap = seleziona, ritap = +1 copia, long press = azzera

---

## Top bar
- Logo 48px, glow arancio
- **VIAGGI** — gradiente arancio puro `#ff7a40→#ff5520`, letter-spacing 4px
- **Settimana** — formato `Lun 23/03 — Ven 27/03`, JetBrains Mono 12px bold
- Banner "Viaggi di oggi" **rimosso** (CSS + renderTodayBanner commentata)

---

## Export Excel
- Foglio Viaggi: separatori giorno colorati, zebra, totale per giorno, data `LUN 16/03`, freeze header
- Foglio Riepilogo: totali per trasportatore + per giorno
- Costanti: `_DAY_COLORS = {1:{bg,border,txt,label}, ...}`

---

## Funzioni JS critiche
```
renderTrips()              → dispatcha alle viste
renderCardView()           → vista OGGI
_renderTodayCard(t,today)  → helper card oggi
renderMediumView()         → vista per trasportatore
renderCompactView()        → vista rapida
renderDesktopView()        → vista PC
filterApply()              → filtra + ordina + renderTrips()
saveToLocalStorage()       → ordina + salva + autoSaveDrive()
loadTripsFromLocalStorage()→ carica + ordina
_buildAndDownloadExcel()   → xlsx 2 fogli landscape A4
_getVisibleTrips()         → rispetta filtri desktop
switchView(view, el)       → cambia vista
desktopAddEmpty()          → popup data → nuova riga → focus trasportatore
desktopAddEmptyConfirm()   → conferma popup
desktopCloseDatePopup()    → chiude popup
desktopSetNextWeek()       → 5 righe vuote Lun→Ven
_setSyncBtnState(state)    → aggiorna sync buttons
mdpkUpdateFromDate()       → chip con date reali (logica sempre-avanti)
mobileDayTap(d)            → tap chip: 0→1→2...
_applyDriveData(data,s)    → applica dati Drive + ordina
fixSortOrder()             → riordina e salva
setText(id, value)         → helper safe textContent
```

---

## Variabili globali principali
```js
let trips = []              // sempre ordine cronologico
let filteredTrips = []
let weekTitle = "Lun 23/03 — Ven 27/03"
let currentView = 'compact'
let filterState = { today, date, transporter, partenza, arrivo, giorno }
let driveAccessToken = null
let driveFileId = null
const _mobileDayCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}  // NO sab
const _dayPickerCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}  // NO sab
const _mdayColors = {lun:'rgba(96,165,250,', ...}
const _DAY_COLORS = {1:{bg,border,txt,label}, ...}
```

---

## Elementi HTML critici
`#cardView`, `#compactView`, `#compactBody`, `#mediumView`, `#desktopView`, `#desktopBody`, `#addTripSection`, `#tripForm`, `#weekInfo`, `#syncBtn`, `#loadBtn`, `#desktopSyncBtn`, `#desktopLoadBtn`, `#mobileDayPicker`, `#mdpk-btn-{lun|mar|mer|gio|ven}`, `#mdpk-date-{lun|mar|mer|gio|ven}`, `#mobileDaySummary`, `#pcViewSwitcher`, `#desktopDatePopup`, `#todayBanner` (nascosto)

---

## Tema visivo
- Sfondo: `#070a10`, pannelli: `#0f1220` / `#161b2e`
- Accento: `#ff6b35`, successo: `#06d6a0`, warning: `#ffd23f`
- Card con glow colorato per trasportatore
- Separatori giorno: pill colorata (blu lun, verde mar, viola mer, giallo gio, rosa ven)
- Animazione card: fade+slide a cascata

---

## PWA
- `manifest.json` — display standalone, theme `#070a10`
- `sw.js` — network-first, cache offline, ignora Google API
- Installabile su Android/iOS

---

## Google Drive
- Scope: `drive.appdata`, file: `planning-viaggi-data.json`
- Conflict check su `savedAt`, auto-save debounce 2s, token refresh 50min

---

## Cosa NON fare
- Non usare framework — single-file HTML vanilla
- Non aggiungere dipendenze esterne
- Non usare template literals annidati (backtick in backtick)
- Non mettere apici singoli annidati in stringhe JS con apici singoli
- Non usare `getElementById().textContent=` senza null-check → usare `setText()`
- **Non aggiungere Sabato** ai picker — rimosso intenzionalmente
- **Non re-aggiungere** banner "Viaggi di oggi" — rimosso intenzionalmente
- **Non ri-abilitare** `renderTodayBanner()` — commentata intenzionalmente
- Non usare `ontouchstart` con apici annidati in stringhe JS
- Verificare ordine cronologico dopo ogni operazione che modifica `trips`

---

## File output
- Lavoro: `/home/claude/tab-viaggi/TAB-VIAGGI--main/index.html`
- GitHub: `/mnt/user-data/outputs/index.html`
- Versione corrente: **v41**

---

## Storico versioni
| v | Contenuto |
|---|-----------|
| v39 | Excel 2 fogli, stampa, ordinamento fix |
| v39_backup | Backup pre-abbellimenti |
| v40 | Tema scuro, glow card, badge trasportatori |
| v41 | Form Opzione A, date reali chip, Sab rimosso, vista Oggi, vista Trasportatore, banner rimosso, top bar, PWA sw.js |
