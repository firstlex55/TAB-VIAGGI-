# APP VIAGGI — PROJECT.md

> Documento di riferimento per lo sviluppo con Claude.
> Aggiornato: maggio 2026 — versione corrente: **v1** (10 196 righe)

---

## 1. IDENTITÀ DEL PROGETTO

| Campo | Valore |
|---|---|
| Nome app | App Viaggi (Planning Logistica Viaggi) |
| Azienda | Pro Trasporti Srl |
| URL pubblicata | `firstlex55.github.io/TAB-VIAGGI-` |
| File principale | `index.html` (unico file, tutto inline) |
| File aggiuntivi | `manifest.json`, `sw.js`, `logo.png` |
| Lingua UI | Italiano |
| Lingua sviluppo | Italiano (Claude risponde sempre in italiano per questo progetto) |

---

## 2. STACK TECNICO

- **HTML/CSS/JS vanilla** — nessun framework, nessun build step
- **ExcelJS 4.4.0** — export Excel con stili reali (due fogli: Viaggi + Riepilogo, landscape A4)
- **XLSX 0.18.5** — import Excel
- **Google Drive API v3** — sync tramite OAuth2 + fetch diretto (niente gapi library)
- **Google Identity Services** (`accounts.google.com/gsi/client`) — login OAuth2
- **Google Fonts** — Outfit + JetBrains Mono
- **PWA** — manifest.json + sw.js (Service Worker) + logo.png

---

## 3. VINCOLI CRITICI DI SINTASSI (Android compatibility)

> Questi vincoli NON si toccano mai. Violarli rompe l'app su Android.

| Regola | Dettaglio |
|---|---|
| ❌ No arrow functions | Usare `function()` ovunque |
| ❌ No template literals (backtick) | Usare concatenazione stringa `+` |
| ❌ No `let`/`const` globali (fuori da funzioni) | Usare `var` a livello globale |
| ❌ No spread operator `...` nei contesti critici | Verificare caso per caso |
| ❌ No shorthand object properties `{a}` | Scrivere sempre `{a: a}` |
| ⚠️ `renderArchive()` | Funzione con regola speciale: **ZERO template literals**, solo string concatenation |
| ⚠️ `Array.from` | Evitare — usare slice/forEach/loop tradizionali |

---

## 4. WORKFLOW OBBLIGATORIO DI SVILUPPO

### 4.1 Ogni volta che si modifica JS:
1. Estrarre tutti i tag `<script>` con regex Python
2. Scrivere ciascuno in `/tmp/sc_N.js`
3. Eseguire `node --check /tmp/sc_N.js` per i blocchi 3, 4 e 5 (i principali)
4. Se errore → correggere prima di consegnare il file

```python
import re
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL)
for i, s in enumerate(scripts):
    with open(f'/tmp/sc_{i}.js', 'w') as f:
        f.write(s)
# poi: node --check /tmp/sc_N.js
```

### 4.2 Upload e consegna:
- Fil carica il file HTML direttamente (GitHub inaccessibile dall'ambiente Claude)
- Claude fa modifiche chirurgiche con `str_replace` — mai riscrivere blocchi grandi
- File output: `/mnt/user-data/outputs/app_viaggi_vN.html` (con numero versione)
- Backup obbligatorio prima di modifiche significative

### 4.3 Regola d'oro:
> **Toccare solo ciò che serve. Mai riscrivere codice funzionante.**

---

## 5. STRUTTURA DATI

### 5.1 Oggetto viaggio

```js
{
    data: "2026-03-17",          // ISO YYYY-MM-DD — obbligatorio
    trasportatore: "COAP",       // stringa libera
    partenza: "Bientina (INCONTRATO)", // stringa libera
    arrivo: "Verolavecchia (AGROGI)",  // stringa libera
    prodotto: "Cippato",         // opzionale
    note: "",                    // opzionale
    daConfermare: false,         // bool — viaggio da confermare al trasportatore
    confermato: false            // bool — viaggio confermato
}
```

### 5.2 Oggetto archivio settimana

```js
{
    title: "Settimana 12/2026 (Lun. 16/03 - Ven. 20/03)",
    trips: [ /* array di oggetti viaggio */ ],
    archivedAt: "2026-03-21T08:00:00.000Z"  // ISO timestamp
}
```

---

## 6. CHIAVI localStorage

| Chiave | Tipo | Descrizione |
|---|---|---|
| `viaggiLogistica` | JSON array | Viaggi settimana corrente |
| `viaggiLogisticaNext` | JSON array | Viaggi settimana prossima |
| `weekTitle` | string | Titolo settimana corrente (es. "Lun 16/03 — Ven 20/03") |
| `weekArchive` | JSON array | Archivio settimane passate |
| `transportersList` | JSON array | Lista trasportatori personalizzata |
| `partenzaList` | JSON array | Lista partenze personalizzata |
| `arrivoList` | JSON array | Lista arrivi personalizzata |
| `pcb_routes` | JSON array | Rotte rapide salvate in vista PC |
| `preferredView` | string | Vista preferita (`compact`, `medium`, `next`, `desktop`) |
| `savedAt` | string ISO | Timestamp ultimo salvataggio su Drive riuscito |
| `driveConnected` | string `'1'` | Flag connessione Drive attiva |
| `appVersion` | string | Versione app per migrazioni (attuale: `'v59b'`) |

---

## 7. VARIABILI GLOBALI PRINCIPALI

```js
var trips = [];                  // Viaggi settimana corrente
var tripsNext = [];              // Viaggi settimana prossima
var transportersList = [...];   // Lista trasportatori
var partenzaList = [...];       // Lista partenze
var arrivoList = [...];         // Lista arrivi
var currentView = 'compact';    // Vista attiva
var searchQuery = '';            // Query ricerca attiva
var filteredTrips = [];          // Viaggi filtrati (subset di trips)
var weekTitle = '...';           // Titolo settimana
var filterState = {              // Stato filtri
    today: false,
    date: '',
    transporter: '',
    partenza: '',
    arrivo: '',
    giorno: null
};
var _dayFilterActive = null;     // Giorno settimana filtrato dalla barra
var _pcWeekMode = 'current';     // Modalità vista PC: 'current' | 'next'
var _desktopDayFilter = 'Tutti'; // Filtro giorno nella vista PC
var _desktopSort = { field: 'data', dir: 'asc' };
var driveAccessToken = null;     // Token OAuth2 Drive
var driveFileId = null;          // ID file su Drive
```

---

## 8. COSTANTI DRIVE

```js
const DRIVE_CLIENT_ID = '107091966360-vbepp0lmghbck14vv89et30acl34d8a9.apps.googleusercontent.com';
const DRIVE_SCOPE     = 'https://www.googleapis.com/auth/drive.appdata';
const DRIVE_FILE_NAME = 'planning-viaggi-data.json';
```

Il file Drive risiede in `appDataFolder` (privato per l'app, non visibile nell'interfaccia Drive dell'utente).

---

## 9. VISTE DISPONIBILI

| ID vista | `currentView` | Nav label | Funzione render | Descrizione |
|---|---|---|---|---|
| `#cardView` | `'card'` *(legacy, rimappato)* | — | `renderCardView()` | Vista card espansa (legacy, non più nella nav) |
| `#nextView` | `'next'` | Prossima | `renderNextView()` | Viaggi settimana prossima |
| `#mediumView` | `'medium'` | Trasp. | `renderMediumView()` | Raggruppa per trasportatore |
| `#compactView` | `'compact'` | Rapida | `renderCompactView()` | Righe compatte per giorno — **vista default** |
| `#desktopView` | `'desktop'` | PC | `renderDesktopView()` | Tabella editabile inline |

La vista salvata in localStorage come `preferredView`. Default: `compact`.
Vecchio valore `'card_old_unused'` viene silenziosamente rimappato a `'compact'` all'avvio.

---

## 10. FUNZIONI PRINCIPALI

### 10.1 Init e persistenza

| Funzione | Descrizione |
|---|---|
| `window.onload` | Boot app: carica dati, riordina, renderizza tutto |
| `loadTripsFromLocalStorage()` | Carica `viaggiLogistica`, riordina cronologicamente |
| `loadNextFromLocalStorage()` | Carica `viaggiLogisticaNext` |
| `saveToLocalStorage()` | Salva `trips` in `viaggiLogistica` |
| `saveNextToLocalStorage()` | Salva `tripsNext` in `viaggiLogisticaNext` |
| `loadArchive()` | Legge `weekArchive` da localStorage |
| `saveArchive(archive)` | Scrive `weekArchive` su localStorage |
| `loadTransportersList()` | Carica lista trasportatori + partenze + arrivi |

### 10.2 Render viste

| Funzione | Note critiche |
|---|---|
| `renderTrips()` | Dispatcher: chiama la render della vista attiva |
| `renderCompactView()` | Vista Rapida — righe compatte con swipe-to-delete |
| `renderMediumView()` | Vista Trasp. — raggruppa per trasportatore |
| `renderNextView()` | Vista Prossima — usa `tripsNext` |
| `renderCardView()` | Vista legacy card |
| `renderDesktopView()` | Vista PC — tabella editabile inline |
| `renderArchive()` | ⚠️ **ZERO template literals** — usa solo string concat |

### 10.3 Filtri e ricerca

| Funzione | Descrizione |
|---|---|
| `filterApply()` | Applica tutti i filtri attivi, aggiorna `filteredTrips` |
| `filterReset()` | Azzera tutti i filtri e la ricerca |
| `filterToggleToday()` | Toggle filtro "Solo Oggi" |
| `filterByWeekDay(dayName)` | Filtra per giorno settimana dalla barra (lun-ven) |
| `filterPopulateDropdowns()` | Popola i select filtro con i valori esistenti |
| `handleSearch()` | Gestisce la ricerca testuale |
| `toggleFilterPanel()` | Apre/chiude pannello filtri collassabile |

### 10.4 Aggiunta e modifica viaggi

| Funzione | Descrizione |
|---|---|
| `addTrip(event)` | Submit del form — aggiunge uno o più viaggi |
| `deleteTrip(idx)` | Elimina viaggio per indice |
| `editTrip(idx)` | Apre modale di modifica |
| `toggleAddForm()` | Apre/chiude sezione aggiunta viaggio |
| `mobileDayTap(dayName)` | Seleziona giorno nel multi-day picker mobile |
| `mdpkUpdateFromDate()` | Aggiorna il day picker quando cambia la data |
| `mdpkNextWeek()` | Sposta il day picker alla settimana successiva (+7gg) |
| `mdpkFullReset()` | Azzera il day picker |

### 10.5 Vista PC desktop

| Funzione | Descrizione |
|---|---|
| `renderDesktopView()` | Render tabella PC |
| `desktopAddEmpty()` | Aggiunge riga vuota |
| `desktopDel(idx)` | Elimina riga |
| `desktopDup(idx)` | Duplica riga (Ctrl+D) |
| `desktopSave(idx, field, value)` | Salva cella editata inline |
| `desktopSetNextWeek()` | Aggiunge 5 righe vuote per la settimana prossima |
| `desktopGetNextWeekday(dayName)` | Calcola data del giorno nella settimana corrente/prossima |
| `desktopFilter(dayName)` | Filtra tabella PC per giorno |
| `desktopSortBy(field)` | Ordina tabella PC per colonna |
| `desktopOpenAddModal()` | Apre popup multi-giorno (aggiunta da sidebar rotte) |
| `desktopCloseAddModal()` | Chiude popup multi-giorno |
| `desktopSaveRoute()` | Salva rotta rapida |
| `desktopNewRouteModal()` / `desktopCloseRouteModal()` | Modal nuova rotta |
| `desktopFilterRoutes()` | Filtra lista rotte rapide |
| `desktopQuickSearch()` | Ricerca in-tabella (Ctrl+F) |

### 10.6 Archivio settimane

| Funzione | Descrizione |
|---|---|
| `showNewWeekModalV2()` | Apre modal archiviazione nuova settimana (V2) |
| `closeNewWeekModalV2()` | Chiude modal V2 |
| `archiveAndNewWeek()` | Archivia settimana corrente e ricomincia |
| `renderArchive()` | Renderizza la sezione archivio (⚠️ no template literals) |
| `archiveDownloadExcel(idx)` | Scarica Excel di una settimana archiviata |
| `archiveRestore(idx)` | Ripristina settimana archiviata come corrente |
| `archiveDelete(idx)` | Elimina settimana dall'archivio |

### 10.7 Export Excel e stampa

| Funzione | Descrizione |
|---|---|
| `downloadExcel()` | Genera e scarica Excel settimana corrente |
| `_buildAndDownloadExcel(trips, title, suffix)` | Worker Excel condiviso (usato anche dall'archivio) |
| `printPlanning(tripsData)` | Apre finestra di stampa A4 landscape con CSS dedicato |
| `_printColor(name)` | Restituisce colori trasportatore per la stampa |
| `_xlsColors(name)` | Restituisce colori trasportatore per l'Excel |

### 10.8 Google Drive

| Funzione | Descrizione |
|---|---|
| `driveSync()` | Salvataggio manuale Drive (con conflict check) |
| `driveLoad()` | Caricamento manuale da Drive |
| `driveSave(silent)` | Salvataggio Drive: silent=true salta conflict check |
| `autoSaveDrive()` | Auto-save silenzioso (dopo ogni modifica) |
| `driveSmartSync()` | Sync intelligente: carica se Drive più recente, altrimenti salva |
| `driveCheckConflict()` | Confronta timestamp locale vs Drive |
| `driveShowConflictModal(driveData)` | Mostra modal risoluzione conflitto |
| `driveConflictResolve(choice)` | Risolve conflitto ('local'/'drive'/'cancel') |
| `_driveWriteData()` | Scrittura effettiva su Drive (senza conflict check) |
| `_applyDriveData(data, silent)` | Applica dati scaricati da Drive |
| `driveFindFile()` | Trova ID file su Drive |
| `tryAutoReconnectDrive()` | Rinnova token silenziosamente (ogni 50 min) |
| `startSaveReminder()` | Avvia reminder salvataggio Drive (dopo 20 min) |
| `updateDriveBtns(connected)` | Aggiorna stato pulsanti Drive |

### 10.9 Utility

| Funzione | Descrizione |
|---|---|
| `_pv(n)` | Plurale: `n===1 ? 'viaggio' : 'viaggi'` |
| `_pvAdded(n)` | Plurale: `'viaggio aggiunto'` / `'viaggi aggiunti'` |
| `setText(id, value)` | `document.getElementById(id).textContent = value` sicuro (null-safe) |
| `showStatus(msg, type)` | Toast di stato temporaneo |
| `formatDateDisplay(dateStr)` | Formatta data ISO → "Lun 16/03/26" |
| `getWeekNumber(date)` | Numero settimana ISO 8601 |
| `getMonday(date)` | Lunedì della settimana di `date` |
| `getTransporterKey(name)` | Chiave CSS trasportatore (es. `'coap'`) |
| `getTransporterColorClass(name)` | Classe CSS colore trasportatore |
| `updateStats()` | Aggiorna stat box (totale, da confermare, confermati) |
| `updateWeekProgress()` | Aggiorna barra giorni settimana (Lun-Ven) |
| `updateWeekSummary()` | Aggiorna riepilogo header |
| `updateHeaderSummary()` | Badge trasportatori nel top-bar |
| `markTodayCards()` | Aggiunge classe `today-card` ai viaggi di oggi |
| `haptic(type)` | Vibrazione haptic feedback (dove disponibile) |
| `switchView(view, el)` | Cambia vista attiva |
| `_getVisibleTrips()` | Ritorna viaggi filtrati/ordinati per la vista desktop |

---

## 11. TRASPORTATORI E COLORI

| Chiave CSS | Nome | Colore principale |
|---|---|---|
| `cevolo` | CEVOLO | `#e8821a` / `#FF6B00` |
| `coap` | COAP | `#5b8dd9` / `#7C3AED` |
| `coneco` | ConEco / CON ECO | `#e040a0` / `#DC2626` |
| `consar` | CONSAR | `#06d6a0` / `#16A34A` |
| `avio` | AVIO | `#38bdf8` / `#0891B2` |
| `alb` | ALB / A.L.B | `#f5a623` / `#D97706` |
| `lino` | LINO BRA / BRANCHINI | `#c084fc` / `#EC4899` |
| `stegagno` | Stegagno | `#94a3b8` / `#475569` |
| `cirioni` | Cirioni | `#34d399` / `#059669` |
| `clp` | CLP | `#ca8a04` |
| `default` | (altri) | `#37474F` |

Le variabili CSS sono `--t-{key}` e `--t-{key}-bg`.

---

## 12. REGOLE SPECIFICHE PER FUNZIONE

### `renderArchive()`
- **Nessun template literal** (backtick) — causa `SyntaxError` su Python che riscrive il file
- Usare esclusivamente concatenazione con `+`
- Non modificare con riscritture grandi: usare `str_replace` chirurgico

### `addTrip()` / form di aggiunta
- Supporta aggiunta multi-giorno tramite `mobileDayPicker`
- Chip giorno Lun-Ven con date calcolate dalla data di partenza
- Pulsante "+7gg" sposta tutti i chip alla settimana successiva
- Pulsante "↺ Reset" azzera tutti i chip
- Dopo aggiunta: mostra `summaryModal` con riepilogo dei viaggi inseriti
- Se in vista `'next'`: precompila la data col lunedì della settimana prossima

### `renderCompactView()`
- Swipe-to-delete integrato (swipe sinistro su mobile)
- Separatori per giorno con pill colorata (Lun verde, Mar verde acqua, Mer viola, Gio giallo, Ven rosa)
- Nessun sabato

### `renderDesktopView()`
- Due modalità toggle: settimana corrente / prossima (`_pcWeekMode`)
- Sidebar rotte rapide con counter utilizzi
- Popup multi-giorno per aggiunta rapida da rotta
- Scorciatoie tastiera: `N` = nuova riga, `Ctrl+D` = duplica, `Delete` = elimina, `Ctrl+F` = cerca
- Separatori visuali per giorno, bordo sinistro colorato per trasportatore on hover

### Drive sync
- **Conflict check** solo su salvataggio manuale (non su auto-save)
- `driveLastKnownSavedAt` tracciato in localStorage come `'savedAt'`
- Conflitto = Drive più recente di 10 secondi rispetto all'ultimo sync noto
- Reminder automatico ogni minuto se non si salva da 20 minuti (snooze 30 min)
- Auto-reconnect token ogni 50 minuti (silenzioso)

---

## 13. ELEMENTI HTML CRITICI (ID)

| ID | Elemento | Uso |
|---|---|---|
| `weekInfo` | `<div>` | Titolo settimana corrente (cliccabile per modifica) |
| `archiveSection` | `<div>` | Sezione archivio (nascosta se vuota) |
| `archiveList` | `<div>` | Container card archivio |
| `archiveCount` | `<span>` | Numero settimane archiviate |
| `addTripSection` | `<div>` | Form aggiunta viaggio (toggle) |
| `mobileDayPicker` | `<div>` | Chip giorni nel form |
| `mobileDaySummary` | `<div>` | Riepilogo selezione multi-giorno |
| `newWeekModalV2` | `<div>` | Modal archiviazione nuova settimana |
| `driveConflictModal` | `<div>` | Modal risoluzione conflitto Drive |
| `weekTitleModal` | `<div>` | Modal modifica titolo settimana |
| `weekProgressBar` | `<div>` | Barra giorni settimana (sticky, cliccabile) |
| `wseg-1` … `wseg-5` | `<div>` | Segmenti Lun-Ven nella barra |
| `wseg-cnt-1` … `wseg-cnt-5` | `<span>` | Contatori viaggi per giorno |
| `filterPanel` | `<div>` | Pannello filtri collassabile |
| `filterActiveBadge` | `<span>` | Badge "attivo" quando filtri attivi |
| `filterTransporter` | `<select>` | Filtro per trasportatore |
| `filterPartenza` | `<select>` | Filtro per partenza |
| `filterArrivo` | `<select>` | Filtro per arrivo |
| `btnFilterToday` | `<button>` | Toggle filtro "Solo Oggi" |
| `tripCountBadge` | `<span>` | Contatore nel separatore decorativo |
| `driveStatus` | `<div>` | Indicatore stato Drive (dot + testo) |
| `driveStatusDot` | `<span>` | Pallino colorato stato Drive |
| `headerSummary` | `<div>` | Badge trasportatori nell'header |
| `navBtnAdd` | `<button>` | Pulsante + centrale nella bottom nav |
| `desktopBody` | `<table>` | Tabella vista PC |
| `desktopAddModal` | `<div>` | Popup aggiunta multi-giorno PC |
| `desktopRouteModal` | `<div>` | Modal nuova rotta rapida |
| `desktopRoutesList` | `<div>` | Lista rotte rapide |
| `syncBtn` | `<button>` | Pulsante salva Drive (mobile) |
| `desktopSyncBtn` | `<button>` | Pulsante salva Drive (PC) |
| `pcViewSwitcher` | `<div>` | Barra navigazione viste per schermi larghi |

---

## 14. MODALI E OVERLAY

| Modale | ID | Trigger | Funzioni |
|---|---|---|---|
| Dettaglio viaggio / conferma | `confirmModal` | Click su viaggio | `showConfirmModal()`, `closeConfirmModal()` |
| Riepilogo aggiunta | `summaryModal` | Dopo `addTrip()` | `closeSummaryModal()` |
| Nuova settimana V2 | `newWeekModalV2` | Pulsante "📦 Nuova sett." | `showNewWeekModalV2()`, `closeNewWeekModalV2()`, `archiveAndNewWeek()` |
| Nuova settimana (legacy) | `newWeekModal` | — | `showNewWeekModal()`, `closeNewWeekModal()`, `createNewWeek(action)` |
| Modifica titolo settimana | `weekTitleModal` | Click su `weekInfo` | `editWeekTitle()`, `closeWeekTitleModal()`, `saveWeekTitle()` |
| Conflitto Drive | `driveConflictModal` | Rilevato conflitto sync | `driveShowConflictModal()`, `driveConflictResolve(choice)` |
| Modifica viaggio | *(creato dinamicamente)* | Click edit | `editTrip(idx)` |
| Aggiunta PC | `desktopAddModal` | Clic su rotta rapida | `desktopOpenAddModal()`, `desktopCloseAddModal()` |
| Nuova rotta PC | `desktopRouteModal` | Clic "+ rotta" | `desktopNewRouteModal()`, `desktopCloseRouteModal()` |

---

## 15. DATI PRECARICATI

```js
var partenzaList = [
    "Bientina (INCONTRATO)",
    "S.Felice (CAI-BF)",
    "Dosolo (ARDENGHI)",
    "Grezzana (TACCHELLA)",
    "Mercatino (COVI)",
    "Tirano (ILT)",
    "Jolanda (Bonifiche)",
    "Mezzocorona (VENDER)",
    "Castel S. Nicolò (Tosco imballaggi)"
];

var arrivoList = [
    "Ponzano Romano (SICEM)",
    "Verolavecchia (AGROGI)",
    "Mezzano RA (SICEM Srl)",
    "Tarmassia (TRUCIOLI)"
];
```

I prodotti precaricati nel datalist: Cippato, Sfarinato, Segatura, Pula.

---

## 16. PERFORMANCE E OTTIMIZZAZIONI

- **120Hz scroll**: `is-scrolling` class su body durante scroll, rimuove `backdrop-filter` costosi
- **GPU layers**: `will-change: transform` + `transform: translateZ(0)` sulla top bar
- **Font rendering**: `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility`
- **iOS scroll**: `-webkit-overflow-scrolling: touch`
- **Animazioni spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` su card/bottoni
- **Immagine logo**: `image-rendering: crisp-edges` per nitidezza

---

## 17. SISTEMA DI VERSIONING

- Ogni file output include numero versione nel nome: `app_viaggi_vN.html` (es. app_viaggi_v2.html, app_viaggi_v3.html...)
- `localStorage.getItem('appVersion')` usato per migrazioni one-shot all'avvio
- Versione attuale: **v1** — la numerazione riparte da qui, consecutiva e senza salti
- Backup obbligatorio prima di modifiche significative

---

## 18. NOTE PER CLAUDE

1. **Prima di qualsiasi modifica**: leggere il file uploadato, non inventare nulla dalla memoria
2. **`str_replace` sempre**: non riscrivere blocchi grandi, modificare solo la parte necessaria
3. **Dopo ogni modifica JS**: eseguire `node --check` su tutti i blocchi script
4. **`renderArchive()`**: trattarla come untouchable — modificarla solo con `str_replace` mirato, zero backtick
5. **Nessun sabato**: la logica dei giorni è sempre Lun-Ven
6. **Plurali**: usare sempre `_pv(n)` e `_pvAdded(n)`, non scrivere "viaggio/viaggi" inline
7. **Drive auto-save**: `autoSaveDrive()` va chiamato dopo ogni modifica che salva su localStorage
8. **ES6 check**: prima di consegnare, verificare assenza di arrow functions, template literals e const/let globali con grep
9. **Lingua**: rispondere sempre in italiano per questo progetto

---

## 18. CHANGELOG

### v1 — maggio 2026 (versione base da cui parte la numerazione)
Partendo dal codice precedente (interno v59b/v61, 10 185 righe), applicati i seguenti bug fix:

**Bug fix 1 — Calcolo date chip giorno mobile (critico)**
- **Problema:** nel form aggiunta viaggio, il calcolo della data per i chip Lun-Ven usava `(dnums[d] - dow2 + 7) % 7` rispetto a `specificDate`. Se il chip era lo stesso giorno della data principale il risultato era 0 (duplicato); se il chip era un giorno precedente, il calcolo portava alla settimana successiva.
- **Correzione:** il calcolo ora ancora al lunedì della settimana di `specificDate`, poi aggiunge 0-4 giorni in base al chip (`dnums = {lun:0,mar:1,mer:2,gio:3,ven:4}`). Qualsiasi combinazione data+chip produce la data corretta nella stessa settimana.
- **Posizione:** submit handler `tripForm`, blocco `Object.keys(_mobileDayCounts).forEach`.

**Bug fix 2 — `#headerSummary` mancante nel DOM**
- **Problema:** `updateHeaderSummary()` cercava `getElementById('headerSummary')` ma l'elemento non esisteva nell'HTML → i badge trasportatori nella top bar non venivano mai mostrati nonostante il CSS esistesse.
- **Correzione:** aggiunto `<div class="header-summary" id="headerSummary"></div>` dentro `.top-bar-titles`, subito dopo `#weekInfo`.

**Bug fix 3 — `autoSaveDrive()` mancante in operazioni critiche**
- **Problema:** diverse operazioni che modificano i dati salvavano in localStorage senza propagare al Drive.
- **Correzione:** aggiunto `if (driveAccessToken) autoSaveDrive()` in: aggiunta viaggio, `deleteTrip()`, swipe-to-delete, `_confirmAllCompact()`, `_compactConfirm()`, `createNewWeek('save'/'clear')`.

**Nota per le prossime sessioni:** la regola 7 delle NOTE PER CLAUDE è stata rafforzata — `autoSaveDrive()` va chiamato dopo **ogni** `saveToLocalStorage()` che segue un'azione utente, non solo alcune.
