# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app single-file HTML per la **pianificazione logistica settimanale dei viaggi** di Pro Trasporti.
Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`

File principale: **`index.html`** (~8800 righe) — tutto in un file, HTML + CSS + JS vanilla.
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

---

## Trasportatori principali
CEVOLO, COAP, CONSAR, AVIO, ALB, LINO BRA, ConEco, Stegagno, Cirioni, CLP
Colori CSS: variabili `--t-{key}` e `--t-{key}-bg`.

---

## Viste (bottom nav mobile + pc-view-switcher su desktop)
| Vista | ID | Descrizione |
|-------|----|-------------|
| OGGI | `#cardView` | Viaggi oggi + domani + prossimi. Empty state curato. |
| TRASP. | `#mediumView` | Raggruppa per trasportatore, ordine alfabetico |
| RAPIDA | `#compactView` | Righe compatte per giorno — **vista principale**. Swipe destra → elimina. |
| PC | `#desktopView` | Tabella editabile inline, sidebar rotte rapide |

`currentView` salvato in `localStorage` come `preferredView`. Default: `compact`.

---

## Vista OGGI
- Sezione **Oggi** grande, **Domani** in secondo piano, **Prossimi** sotto
- Se vuota nei 3 giorni → mostra prossimi della settimana
- Empty state: ✌️ "Nessun viaggio oggi / Giornata libera"
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
- Funzione: `renderMediumView()`

---

## Vista PC
- Tabella editabile inline con input/select per ogni cella
- **Popup "Nuova riga"** — scegli data base + chip Lun/Mar/Mer/Gio/Ven → crea N righe
- Highlight arancio sulle righe appena aggiunte, scroll automatico + focus trasportatore
- Sidebar rotte rapide (apprende dalle rotte esistenti)
- Filtri giorno Lun-Ven (Sab rimosso), Ctrl+D duplica riga
- Pulsante "Sett. prossima" → 5 righe vuote Lun→Ven
- Export Excel filtrato, Stampa

---

## Form mobile — Opzione A
Flusso: **Trasportatore → Rotta → Prodotto+Note → Quando**

**Step Quando:**
- Campo data primo viaggio → chip Lun/Mar/Mer/Gio/Ven mostrano date reali della settimana
- Logica "sempre avanti": chip già passati saltano alla settimana successiva
- Tap = seleziona/incrementa, long press = azzera
- **`+7gg →`** — sposta la data di +7 giorni (settimana prossima), azzera chip
- **`↺ Reset`** — azzera data e tutti i chip
- Sabato rimosso ovunque

---

## Popup Riepilogo viaggi aggiunti
Appare dopo ogni inserimento (sia da form mobile che da popup PC):
- Lista viaggi appena creati con giorno colorato + trasportatore + rotta
- Bottone ✕ e "OK, ho controllato" per chiudere
- Funzioni: `showSummaryModal(newTrips)`, `closeSummaryModal()`

---

## Top bar
- Logo 48px con glow arancio, `image-rendering: crisp-edges`
- **VIAGGI** — gradiente arancio puro `#ff7a40→#ff5520`, letter-spacing 4px
- **Settimana** — formato `Lun 23/03 — Ven 27/03`, JetBrains Mono 12px bold, no-wrap
- Drive status: pill con dot colorato + testo
- Banner "Viaggi di oggi" **rimosso** — CSS `display:none!important` + `renderTodayBanner()` commentata

---

## Barra giorni (week-progress-bar)
- 5 segmenti Lun-Ven, altezza 34px, etichetta + contatore viaggi
- Verde = passato, arancio = oggi, grigio = futuro
- Click → filtra per giorno (`filterByWeekDay(dayName)`)

---

## Sezione Azioni (mobile)
Tre righe compatte in stile pill:
1. ☁️ Salva + 📥 Carica (Drive)
2. ⬇️ Excel + 📅 Nuova sett.
3. 🗑 Cancella tutti (discreto, rosso tenue)

---

## Sezione Import Excel
- Toggle Aggiungi/Sostituisci (pill compatte)
- Upload area orizzontale compatta con icona + testo
- Input `#fileInput` hidden, gestito da `handleFileSelect(event)`

---

## Archivio Settimane
- Righe compatte: titolo breve (es. `23/03 — 27/03`), contatore, data archivio
- Tre bottoni: ⬇️ Excel · ↩ Riapri · 🗑 Elimina
- Salvato in `localStorage` chiave `weekArchive` come `{title, trips, archivedAt}[]`
- Funzione: `renderArchive()` — usa concatenazione stringa (NO template literal)

---

## Export Excel
- **Foglio Viaggi**: separatori giorno colorati, zebra, totale per giorno, data `LUN 16/03`, freeze header riga 3
- **Foglio Riepilogo**: totali per trasportatore + per giorno
- Colonna Data allargata (width 14), Trasportatore (16), Partenza (28), Arrivo (26)
- **Popup conferma** dopo download: 📥 nome file + contatore + OK auto-chiude in 4s
- Funzioni: `showExcelDownloadConfirm(filename, count)`, `closeExcelConfirm()`
- Costanti: `_DAY_COLORS = {1:{bg,border,txt,label}, ...}`

---

## Performance & Qualità
- **Font smoothing**: `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility`
- **Scroll 120Hz**: classe `is-scrolling` aggiunta al body durante scroll → riduce `backdrop-filter` da 24px a 6px
- **GPU layers**: `will-change: transform` + `translateZ(0)` su top bar e bottom nav
- **Spring physics**: `cubic-bezier(0.34,1.56,0.64,1)` su card, bottoni, swipe, nav
- **Variabili easing**: `--spring`, `--spring-soft`, `--ease-out-expo`
- **Logo**: `image-rendering: crisp-edges` per nitidezza retina
- **Numeri tabulari**: `font-variant-numeric: tabular-nums` sulla settimana

---

## Funzioni JS critiche
```
_pv(n)                     → plurale: n===1 ? 'viaggio' : 'viaggi'
_pvAdded(n)                → n===1 ? 'viaggio aggiunto' : 'viaggi aggiunti'
renderTrips()              → dispatcha alle viste
renderCardView()           → vista OGGI
_renderTodayCard(t,today)  → helper card oggi
renderMediumView()         → vista trasportatore
renderCompactView()        → vista rapida (con swipe-to-delete)
renderDesktopView()        → vista PC tabella
filterApply()              → filtra + ordina + renderTrips()
saveToLocalStorage()       → ordina + salva + autoSaveDrive()
loadTripsFromLocalStorage()→ carica + ordina
_buildAndDownloadExcel()   → xlsx 2 fogli landscape A4
_getVisibleTrips()         → rispetta filtri desktop attivi
window.printPlanning()     → stampa con filtri
switchView(view, el)       → cambia vista, aggiorna classi
desktopAddEmpty()          → popup nuova riga PC con chip giorni
desktopAddEmptyConfirm()   → crea righe, scroll+highlight
desktopPopupUpdateChips()  → aggiorna date chip nel popup PC
desktopPopupToggleDay(d)   → toggle chip giorno nel popup PC
desktopCloseDatePopup()    → chiude popup
desktopSetNextWeek()       → 5 righe vuote Lun→Ven
desktopToggleConfermato(i) → toggle campo confermato
_setSyncBtnState(state)    → aggiorna syncBtn + desktopSyncBtn
mdpkUpdateFromDate()       → chip con date reali (logica sempre-avanti)
mdpkNextWeek()             → sposta data +7gg, azzera chip
mdpkFullReset()            → azzera data + chip + summary
mobileDayTap(d)            → tap chip: 0→1→2...
_applyDriveData(data,s)    → applica dati Drive + ordina
fixSortOrder()             → riordina e salva
_scrollToTrip(trip)        → scroll automatico alla riga aggiunta
showSummaryModal(trips)    → popup riepilogo viaggi aggiunti
closeSummaryModal()        → chiude popup riepilogo
showExcelDownloadConfirm() → popup conferma download Excel
closeExcelConfirm()        → chiude popup Excel
renderArchive()            → lista archivio settimane
setText(id, value)         → helper safe textContent
```

---

## Variabili globali principali
```js
let trips = []                   // sempre ordine cronologico
let filteredTrips = []
let weekTitle = "Lun 23/03 — Ven 27/03"
let currentView = 'compact'      // default
let searchQuery = ''
let importMode = 'add'           // 'add' | 'replace'
let filterState = { today, date, transporter, partenza, arrivo, giorno }
let driveAccessToken = null
let driveFileId = null
let _desktopSort = { field:'data', dir:'asc' }
let _desktopDayFilter = 'Tutti'
let _desktopQuickQuery = ''
const _mobileDayCounts = {lun:0, mar:0, mer:0, gio:0, ven:0}   // NO sab
const _deskPopupDays = {lun:false, mar:false, mer:false, gio:false, ven:false}
const _mdayColors = {lun:'rgba(96,165,250,', mar:'rgba(52,211,153,', ...}
const _DAY_COLORS = {1:{bg,border,txt,label}, ...}
```

---

## Elementi HTML critici
`#cardView`, `#compactView`, `#compactBody`, `#mediumView`, `#desktopView`, `#desktopBody`, `#addTripSection`, `#tripForm`, `#editModal`, `#editForm`, `#weekInfo`, `#syncBtn`, `#loadBtn`, `#desktopSyncBtn`, `#desktopLoadBtn`, `#mobileDayPicker`, `#mdpk-btn-{lun|mar|mer|gio|ven}`, `#mdpk-date-{lun|mar|mer|gio|ven}`, `#mobileDaySummary`, `#pcViewSwitcher`, `#todayBanner` (nascosto), `#archiveSection`, `#archiveList`

---

## Tema visivo
- Sfondo: `#070a10`, pannelli: `#0f1220` / `#161b2e`, modal: `#0d1020`
- Accento: `#ff6b35`, successo: `#06d6a0`, warning: `#ffd23f`
- Testo: `#e8edf5`, testo-dim: `#8892a4`, testo-muted: `rgba(255,255,255,0.3)`
- Card con glow colorato per trasportatore
- Separatori giorno: pill colorata (blu lun, verde mar, viola mer, giallo gio, rosa ven)
- Animazione card: `cardFadeIn` con `ease-out-expo`
- Easing: `--spring: cubic-bezier(0.34,1.56,0.64,1)`

---

## Google Drive
- Scope: `drive.appdata`, file: `planning-viaggi-data.json`
- Conflict check su `savedAt`, auto-save debounce 2s, token refresh 50min
- Bottoni sincronizzati: `syncBtn` (mobile) + `desktopSyncBtn` (PC)

---

## Cosa NON fare
- **Non usare framework** — single-file HTML vanilla, no dipendenze aggiuntive
- **Non usare template literal** (`\`...\``) in `renderArchive()` — causa escaped backtick nel secondo script tag. Usare concatenazione stringa
- **Non annidare apici singoli** in stringhe JS con apici singoli — causa SyntaxError
- **Non usare** `getElementById().textContent=` senza null-check → `setText()`
- **Non aggiungere Sabato** — rimosso intenzionalmente da tutti i picker e filtri
- **Non re-aggiungere** banner "Viaggi di oggi" — rimosso intenzionalmente
- **Non ri-abilitare** `renderTodayBanner()` — commentata intenzionalmente
- **Non usare** `ontouchstart="this.style.opacity='0.7'"` in stringhe JS — apici annidati
- Verificare ordine cronologico dopo ogni operazione che modifica `trips`
- Per il plurale "viaggio/viaggi" usare sempre `_pv(n)` — mai `'viaggio'+(n!==1?'i':'')`
- Verificare **tutti gli script tag** con `node --check` — ce ne sono 6, il bug di syntax può essere nel secondo script (indice 4) che contiene `renderArchive`
- Non usare regex con Python per sostituire codice JS con apici — usare str_replace diretto

---

## Verifica codice (da fare dopo ogni modifica)
```bash
# Estrai e verifica tutti gli script
python3 -c "
import re
with open('index.html') as f: content = f.read()
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL)
for i, sc in enumerate(scripts):
    if sc.strip():
        with open(f'/tmp/sc_{i}.js','w') as f: f.write(sc)
"
for i in 3 4 5; do node --check /tmp/sc_$i.js && echo "OK $i" || echo "ERRORE $i"; done
```

---

## File output
- Lavoro: `/home/claude/tab-viaggi/TAB-VIAGGI--main/index.html`
- Output versionate: `/mnt/user-data/outputs/app_viaggi_vN.html`
- Versione corrente: **v44**

---

## Storico versioni
| v | Contenuto |
|---|-----------|
| v39 | Excel 2 fogli, stampa, ordinamento fix |
| v40 | Tema scuro, glow card, badge trasportatori |
| v41 | Form Opzione A, chip date reali, vista Oggi, vista Trasportatore, banner rimosso, PWA |
| v42 | Swipe-to-delete rapida, popup PC chip giorni, popup riepilogo, scroll auto, viewport laptop, vista PC leggibile, colonna data Excel allargata, popup conferma Excel, fix modal tagliato |
| v43 | Spring physics, scroll 120Hz, font smoothing, GPU layers, azioni compatte, archivio restyled, +7gg e reset picker, import Excel rinnovato, empty states curati, modal modifica rinnovato |
| v43_backup | Backup pre-rifiniture |
| v44 | Fix SyntaxError renderArchive (backtick escaped), fix plurale viaggio/viaggi con helper _pv(n), fix modal tagliato su mobile |
