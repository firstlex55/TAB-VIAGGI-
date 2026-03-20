# TAB-VIAGGI — Project Context

## Cos'è questa app
Web app single-file HTML per la **pianificazione logistica settimanale dei viaggi** di un'azienda di trasporti (Pro Trasporti). Hosted su GitHub Pages: `firstlex55.github.io/TAB-VIAGGI-`

Il file principale è **un unico `index.html`** (~7700 righe) che contiene tutto: HTML, CSS inline, JavaScript vanilla. Non usa framework, non ha build step, non ha dipendenze locali.

---

## Stack tecnico
- **HTML/CSS/JS vanilla** — nessun framework
- **ExcelJS 4.4.0** — export Excel con stili reali (colori trasportatori, orientamento landscape A4)
- **XLSX 0.18.5** — import Excel
- **Google Drive API** — sync dati via OAuth2 + fetch diretto (no gapi library)
- **Google Fonts** — Outfit + JetBrains Mono
- **PWA** — manifest.json + logo.png nel repo GitHub

---

## Struttura dati
Ogni viaggio è un oggetto JS:
```js
{
  data: "2026-03-17",          // formato ISO YYYY-MM-DD
  trasportatore: "COAP",       // stringa libera, lista suggerimenti
  partenza: "Bientina (INCONTRATO)",
  arrivo: "Verolavecchia (AGROGI)",
  prodotto: "Cippato",         // opzionale
  note: "",                    // opzionale
  daConfermare: false          // boolean
}
```

Salvato in `localStorage` come `JSON.stringify(trips)` con chiave `viaggiLogistica`.

---

## Trasportatori principali
CEVOLO, COAP, CONSAR, AVIO, ALB (A.L.B. SRL), LINO BRA (Lino Branchini), ConEco, Stegagno, Cirioni, CLP

Colori CSS per ogni trasportatore tramite variabili `--t-{key}` e `--t-{key}-bg`.

---

## Viste disponibili (bottom nav mobile)
| Vista | ID elemento | Descrizione |
|-------|-------------|-------------|
| CARD | `#cardView` | Card espandibili con dettagli viaggio |
| LISTA | `#compactBody` | Vista compatta a righe |
| RAPIDA | `#compactView` | Come LISTA ma ultra-compatta |
| PC | `#desktopView` | Tabella editabile inline + sidebar rotte rapide |

`currentView` è la variabile globale che traccia la vista attiva. Salvata in `localStorage` come `preferredView`.

---

## Vista PC — funzionalità chiave
- **Tabella editabile inline** — ogni cella è un input/select modificabile direttamente
- **Sidebar rotte rapide** — impara dalle rotte esistenti, click → apre modal aggiungi
- **Modal aggiungi viaggio** — picker multi-giorno con contatori (Lun ×2, Mer ×1 ecc.)
- **Filtri giorno** — Tutti / Lun / Mar / Mer / Gio / Ven / Sab con contatori
- **Pulsante "Sett. prossima"** — crea 5 righe vuote Lun→Ven con date automatiche
- **Ctrl+D** — duplica riga selezionata
- **Export Excel filtrato** — solo i viaggi del filtro attivo
- **Stampa** — finestra print ottimizzata con totali per trasportatore
- **Drive sync** — salva/carica da Google Drive appDataFolder

---

## Form mobile aggiungi viaggio
- **Picker multi-giorno** — bottoni Lun/Mar/Mer/Gio/Ven/Sab con − e + per selezionare più giorni e/o più copie dello stesso giorno
- **Data specifica** — campo date tradizionale per date precise
- Submit crea automaticamente N viaggi (uno per ogni giorno/copia selezionata)
- `desktopGetNextWeekday(d)` ricava la data corretta dal giorno settimana

---

## Funzioni JS critiche
```
renderTrips()           → dispatcha a renderCardView/CompactView/MediumView/DesktopView
filterApply()           → filtra trips → filteredTrips, chiama renderTrips()
saveToLocalStorage()    → salva + chiama autoSaveDrive()
importaExcel(file)      → legge .xlsx con XLSX.js, crea viaggi, salva
_buildAndDownloadExcel()→ genera .xlsx con ExcelJS (landscape A4, colori trasportatori)
switchView(view, el)    → cambia vista, aggiorna classi, chiama renderTrips()
desktopSetNextWeek()    → crea 5 righe vuote per settimana prossima
setText(id, value)      → helper safe per textContent (con null-check)
```

---

## Variabili globali principali
```js
let trips = []              // array viaggi correnti
let filteredTrips = []      // dopo filterApply()
let weekTitle = "..."       // titolo settimana corrente
let currentView = 'card'   // vista attiva
let searchQuery = ''        // testo ricerca
let importMode = 'add'      // 'add' | 'replace' per import Excel
let filterState = { today, date, transporter, partenza, arrivo, giorno }
let driveAccessToken = null // Google OAuth token
let driveFileId = null      // ID file su Drive
const _mobileDayCounts = {lun:0, mar:0, mer:0, gio:0, ven:0, sab:0}
const _dayPickerCounts = {lun:0, mar:0, mer:0, gio:0, ven:0, sab:0}
```

---

## Elementi HTML critici
`#cardView`, `#compactView`, `#compactBody`, `#mediumView`, `#desktopView`, `#desktopBody`, `#addTripSection`, `#tripForm`, `#newWeekModal`, `#newWeekModalV2`, `#fileInput`, `#weekInfo`, `#syncBtn`, `#loadBtn`, `#archiveSection`, `#mobileDayPicker`, `#desktopDayPicker`

---

## Import Excel — formato supportato
Il file Excel esportato dall'app e da quello che riceve ha questa struttura:
- Riga 1: `PLANNING VIAGGI`
- Riga 2: `Settimana 12/2026 (Lun.16/03 - Ven. 20/03)`
- Riga 3: header → `| Data | Trasportatore | Partenza da | Arrivo a | Eseguito/DDT |`
- Righe dati: `| LUN. 16/03/2026 | COAP | Bientina (INCONTRATO) | Verolavecchia (AGROGI) | |`

Il parser (`importaExcel()`) cerca la riga header con "Data" + "Trasportatore", poi mappa le colonne e parsa le date con regex `(\d{1,2})/(\d{1,2})/(\d{2,4})`.

---

## Google Drive
- Scope: `https://www.googleapis.com/auth/drive.appdata` (appDataFolder — invisibile all'utente)
- File: `planning-viaggi-data.json`
- Conflict check: confronto `savedAt` timestamp locale vs Drive
- Auto-save: debounce 2s dopo ogni modifica da vista PC
- Token refresh: silenzioso ogni 50min

---

## Archivio settimane
Stored in `localStorage` chiave `weekArchive` come array di `{title, trips, archivedAt}`. Visibile nella sezione Archivio. Può essere esportato in Excel.

---

## Cosa NON fare
- **Non toccare** il sistema Drive/reminder senza istruzioni esplicite
- **Non usare framework** — deve rimanere single-file HTML vanilla
- **Non aggiungere dipendenze** non già presenti (ExcelJS, XLSX, Google fonts)
- **Non usare template literals annidati** (backtick dentro backtick) — causa SyntaxError su Chrome mobile
- **Non usare** `getElementById(...).textContent =` senza null-check — usare `setText(id, value)`
- **Non mettere** `if (!container) return` dentro `switchView()` — blocca il render

---

## Convenzioni file output
- Ogni versione salvata come `app_viaggi_vN.html` (underscore, no spazi)
- File di lavoro locale: `/home/claude/tab-viaggi/TAB-VIAGGI--main/index.html`
- Output per GitHub: `/mnt/user-data/outputs/app_viaggi_vN.html`
- Versione corrente: **v36**

---

## Storico versioni rilevanti
| Versione | Cosa contiene |
|----------|---------------|
| v22 | Base stabile con import Excel funzionante e tutti i null-check |
| v23 | Separatori giorno a pill colorata (Lun/Mar/Mer/Gio/Ven con colori) |
| v31 | Export Excel con orientamento landscape A4 |
| v33 | Toolbar PC a 2 righe + filtri giorno con contatori |
| v34 | Data in formato `LUN 17/03` nella tabella PC |
| v35 | Desktop picker multi-giorno con contatori ×N |
| v36 | Mobile picker multi-giorno identico al desktop |

---

## Regola aggiornamento PROJECT.md

**Questa regola è obbligatoria per Claude in ogni conversazione.**

Ogni volta che viene apportata una modifica significativa all'app, il PROJECT.md deve essere aggiornato **nella stessa sessione**, prima di consegnare il file finale.

### Cosa aggiornare obbligatoriamente

| Tipo modifica | Sezione da aggiornare |
|---|---|
| Nuova funzionalità | Sezione specifica (es. "Vista PC", "Form mobile") + Storico versioni |
| Nuova variabile globale | "Variabili globali principali" |
| Nuova funzione critica | "Funzioni JS critiche" |
| Nuovo elemento HTML | "Elementi HTML critici" |
| Bug fix che cambia comportamento | "Cosa NON fare" |
| Nuovo pattern pericoloso scoperto | "Cosa NON fare" |
| Cambio struttura dati | "Struttura dati" |
| Nuova dipendenza esterna | "Stack tecnico" |
| Nuova versione rilasciata | "Storico versioni" + "Versione corrente" |

### Cosa NON aggiornare
- Fix CSS estetici o cambi di colori
- Modifiche grafiche minori
- Aggiustamenti di spaziatura o font

### Procedura
1. Apporta la modifica all'app → salva come `app_viaggi_vN.html`
2. Aggiorna il PROJECT.md con le sezioni rilevanti
3. Consegna entrambi i file insieme

### Perché è importante
Il PROJECT.md è il documento di contesto che permette a Claude di capire l'app in una nuova conversazione senza dover rileggere 7700 righe di codice. Se non viene aggiornato, le conversazioni future partiranno con informazioni obsolete e rischiano di reintrodurre bug già risolti o rompere funzionalità esistenti.
