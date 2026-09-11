# APP VIAGGI — PROJECT.md
> Aggiornato: 09/09/2026 · Versione attuale: **v28**

---

## Contesto progetto

- **App**: App Viaggi — planning logistica settimanale per Pro Trasporti Srl
- **Stack**: HTML/CSS/JS vanilla, single-file, GitHub Pages
- **URL**: `firstlex55.github.io/TAB-VIAGGI-`
- **File lavoro**: caricare `app_viaggi_v28.html` all'inizio della sessione
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
- `learnedPartenze/Arrivi/Prodotti/Trasportatori` — 4 DB appresi
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

### DB appresi
- `openDbClean()` / `closeDbClean()`
- `dbCleanRemove(key, idx)`, `dbCleanClearAll(key)`

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
