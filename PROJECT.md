# APP VIAGGI — PROJECT.md
> Aggiornato: 08/10/2026 · Versione attuale: **v78** (file `app_viaggi_v78.html` = `index.html`)

---

# 🎯 PROSSIME COSE DA FARE — ROADMAP (partire da qui nella nuova chat)

> Questa sezione è il punto di ripartenza. Elenco in ordine di priorità. Le priorità
> 1–3 sono piccole e ad alto valore: consigliato farle per prime, in una chat pulita.

## ✅ PRIORITÀ 0 — Tema "grigetto" chiaro/scuro + livelli: FATTO in v78

Vedi "Novità v78" più sotto (sistema colori, regole, file di build). Resta solo la verifica
di Fil sui suoi dispositivi (sezione "Da verificare subito").
Idee rimaste fuori e NON approvate: icone SVG al posto delle emoji (nell'altra linea v66 c'erano; qui NON portate,
tranne l'icona "nota vuota" della tabella PC, perché l'emoji bianca spariva sul chiaro), OGGI in evidenza, azioni riga in hover.

## 🔴 Priorità alta

**1. Un solo punto di salvataggio (`saveAndSync()` con debounce)** — 🟡 parzialmente
risolta in v53, resta da finire
- Fatto in v53: riconnessione Drive silenziosa vera all'avvio (`silentDriveInit`,
  prima non funzionava mai a freddo), stato onesto quando non sincronizza, e — la
  parte più importante — il controllo anti-conflitto ora gira ANCHE nei salvataggi
  automatici silenziosi (prima veniva saltato apposta). Se trova un conflitto, non
  sovrascrive più alla cieca: unisce i viaggi locali con quelli trovati su Drive
  (`_mergeTripArrays`, chiave composita data+trasportatore+partenza+arrivo+prodotto,
  dato che non c'è ancora un id — vedi punto 2). Copre il caso più comune (aggiungere
  viaggi nuovi da due dispositivi), non ancora la modifica dello STESSO viaggio da
  entrambi nella stessa finestra di tempo.
- Ancora da fare: resta una funzione unica `saveAndSync()` che sostituisca le ~20
  chiamate sparse a `saveToLocalStorage()`/`autoSaveDrive()` — oggi funzionano meglio
  ma restano duplicate riga per riga. Non urgente quanto prima: il rischio reale
  (sovrascrittura cieca) è già stato tolto.

**2. ID univoco per ogni viaggio**
- Problema: modifica/elimina/conferma lavorano su **indici** dell'array `trips`
  (`editingIndex`, `deleteTrip(index)`, `realIdx`…). Con filtri e riordini è fragile: si
  rischia di toccare il viaggio sbagliato.
- Da fare: aggiungere `id` (es. timestamp+random) a ogni viaggio alla creazione, con
  migrazione una tantum per i viaggi esistenti (anche archivio e `tripsNext`), e passare
  gli id al posto degli indici. Da fare con molta cura e con backup: tocca quasi tutto.

**3. Annulla / backup automatico prima delle azioni distruttive**
- "Cancella tutti i dati" oggi si ferma a un `confirm()`. Aggiungere backup automatico
  in localStorage prima di `clearData()`, import Excel che sostituisce tutto, ecc., e/o
  un toast "Annulla" di qualche secondo.

## 🟠 Priorità media

**4. Audit dei popup rimasti a tema chiaro** — ⚠️ la parte "colori centralizzati" di
questo punto È DIVENTATA la Priorità 0 qui sopra, non rifarla due volte
- Residui di Tema G chiaro (v25) sopravvissuti al redesign navy scuro (v43), probabilmente
  non tutti intenzionali. Cercare `#eef2f7`, `rgba(16,32,64`, `#c0cad8`, `#dde4ec`
  (sospetti a fine v52, non ancora verificati né toccati: intestazione tabella PC `<thead>`,
  riga separatore giorno, pulsanti switch settimana PC, `#pcArchiveModal`). Quando si fa
  la Priorità 0, controllare se questi rientrano automaticamente nel nuovo sistema di
  variabili o vanno sistemati a mano uno per uno.

**5. Funzioni nuove**
- ~~Ricerca/filtro per **numero DDT**~~ — FATTO in v74 (lente generale). Resta: avviso se si inserisce lo stesso DDT due volte.
- Dal vecchio backlog: Export PDF diretto (senza popup) · click su risultato ricerca
  archivio → apre la settimana archiviata (FATTO in v74 nel nuovo pannello Storico) · statistiche multi-settimana con grafico ·
  Service Worker per uso offline · PIN/password lato client (hash in localStorage).

**5b. `desktopToggleConfermato()` è codice morto** — trovato in v56: non è collegato
a nessun pulsante e cerca un `[data-conf-cell]` che non esiste più nel markup. Oggi in
tabella PC un viaggio è solo "da confermare" o "normale" — manca il terzo stato
"Confermato" (verde) che invece esiste nell'export Excel. Da decidere con Fil: se gli
serve davvero in tabella PC, collegarlo a un pulsante vero; altrimenti togliere la
funzione morta.

## 🟡 Priorità bassa / per ultimo

**6. Spezzare `index.html`** (~11.900 righe) in file separati (CSS/JS/moduli). Rende ogni
modifica meno costosa (token) e meno rischiosa, ma va testato bene su GitHub Pages e
Android. Farlo solo a fine lavori.

## ✅ Da verificare subito (appena aperta la nuova chat)

- **v78 — tema chiaro/scuro: cose che NON ho potuto provare da qui** (provato in Chromium con dati finti, 6 stati × PC/Rapida/Trasp./Oggi/modali):
  1. **Su telefono e PC veri di Fil**: aprire il menu (pulsante sole/luna in alto a destra) e provare i 6 stati. Controllare soprattutto
     che il livello "Medio" scuro (`#25272b`) sia comodo: è il nuovo predefinito (prima era un blu-navy) e i valori dei livelli intermedi sono scelti a occhio.
  2. **Barra di stato iPhone in tema chiaro** (solo se Fil usa la PWA su iPhone): la pagina dichiara `black-translucent`, cioè testo bianco
     nella barra di stato; su sfondo chiaro potrebbe leggersi male. Su Android non si applica. Non verificabile da qui.
  3. **Excel e stampa**: il codice è IDENTICO alla v77 (verificato confrontando i blocchi `@media print`, `_printColor…desktopAddEmpty`,
     `_transporterColorPC…closeExcelConfirm`, `_locationCodeColorPC`), quindi escono con gli stessi colori in qualsiasi tema. Ma l'Excel vero resta da provare (vedi sotto).

- **v74 — cose che NON ho potuto provare da qui** (le ho provate in un browser vero con dati finti, ma non queste):
  1. **Excel vero**: nella sandbox ExcelJS è sostituito da un finto che registra cosa verrebbe scritto. Fil deve esportare
     (a) una settimana senza filtri, (b) con filtro Cliente → scegliere "Settimana corrente", (c) con filtro → "Tutto lo storico",
     e controllare nome file (`Planning_Viaggi_Cliente_<valore>[_Storico].xlsx`), titolo e conteggi. Se qualcosa esce storto: `_srchFileName`, `_buildAndDownloadExcel(…, opts)`.
  2. **Google Drive vero** (login, salvataggio, merge tra due dispositivi): non toccato dalla v74 se non per le date locali; testato solo `_mergeState` in locale.
  3. **Aspetto su telefono/PC reali di Fil**: provato a 390px (Rapida) e 1280/1440px (PC) in Chromium, non su Android/Chrome reale. Controllare il foglio dal basso del filtro e la lente.
  4. **Ctrl+F5 / ricaricare l'ultimo `index.html`** dopo il caricamento su GitHub Pages (la cache serve la versione vecchia).

- **Tutto da v57 a v59 non è mai stato visto a schermo da me** — solo sintassi
  controllata (`node --check`) e riletture di codice. Fil deve aprire davvero l'app e
  controllare: popover duplica (colori trasportatore/fornitore/cliente nella riga di
  riepilogo), pannello Rubrica (apertura/chiusura, click su un fornitore/cliente/
  trasportatore, conteggi corretti), badge Fornitore/Cliente nella tabella (pallino +
  testo colorato, non più blocco pieno).
- **`app_viaggi_v58_backup.html`** è il punto di ripristino se qualcosa nella Priorità 0
  (grigetto) va storto — è la versione subito prima di iniziare quel lavoro.

- **Export Excel reale**: MAI verificato a schermo in nessuna sessione (v46→v56) — non
  posso eseguire ExcelJS nella sandbox (rete disabilitata). Verificato solo sintassi e
  rilettura del codice. Fil deve esportare una settimana vera e confrontare coi mockup
  (foglio unico, chip codici, colonna DDT, trasportatore stampa-safe). Se qualcosa esce
  storto: guardare `_buildAndDownloadExcel`, `_xlsWriteLoc`, `_toHex6`.
- **Tabella PC v54–v56 — mai vista a schermo, solo sintassi controllata**: colonne
  riallineate (Note tolta, era disallineata da tempo), badge Fornitore/Cliente a 2 righe,
  icona nota 🗒️/📝 col popover, popover duplica multi-giorno (pulsante ⧉ o Ctrl+D).
  Controllare che si aprano nel punto giusto (sono `position:fixed`, ancorati al
  pulsante cliccato) e che non escano dallo schermo su finestre strette.
- **Salvataggio automatico v53**: aprire l'app da telefono E PC in sequenza, modificare
  su uno, controllare che l'altro recuperi la modifica senza doverla rifare a mano.
- Toggle "Da confermare" (v48–v49): verificato visivamente da Fil, ok.
- Modale "Nuovo viaggio" PC in scuro (v52): verificato visivamente da Fil, ok.

---

## Contesto progetto

- **App**: App Viaggi — planning logistica settimanale per Pro Trasporti Srl
- **Stack**: HTML/CSS/JS vanilla, single-file, GitHub Pages
- **URL**: `firstlex55.github.io/TAB-VIAGGI-`
- **File lavoro**: caricare `app_viaggi_v61.html` all'inizio della sessione
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

> Fil è astigmatico: evitare l'effetto "alazione"/halo (testo bianco puro su nero puro,
> colori neon). **Stato reale attuale (aggiornato v52)**: mobile = tema scuro anti-alone
> (v27); vista PC = tema **navy scuro** (v43, ha sostituito il Tema G chiaro). In entrambi:
> navy non nerissimo, testo bianco caldo non puro, niente neon. Fil ha chiesto
> esplicitamente in questa sessione che i popup PC siano scuri come il resto della vista PC.
> **Stampa ed Excel restano invece chiari** (foglio bianco, stampa-safe, niente riempimenti
> pieni saturi — vedi Novità v46–v47).
> Regola pratica: in un popup scuro, mai usare sfondi chiari con `var(--text)` (che è
> chiaro): dà testo chiaro su sfondo chiaro, invisibile (bug reale trovato in v52).

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
{ data, trasportatore, partenza, arrivo, prodotto, note, ddt, daConfermare, confermato }
```
Partenza/arrivo includono il codice: `"Bientina (INCONTRATO)"`.
`ddt` (v46) è il numero del Documento Di Trasporto, facoltativo, stringa libera.
**Attenzione se in futuro si tocca ancora il modale di modifica mobile**: il
form "✏️ Modifica Viaggio" ricostruisce l'INTERO oggetto viaggio da zero sui
campi del form — qualsiasi campo che il form non espone esplicitamente (es.
era successo con `confermato` e `ddt` prima del fix v47) va RIPRESO A MANO dal
viaggio originale prima di sovrascrivere, altrimenti si perde silenziosamente
ad ogni modifica. Vedi `_commitEditForm()`.

---

## TEMA G — Vista PC (IMPLEMENTATO in v25 — ⚠️ SOSTITUITO in v43 dal tema navy scuro)

> Sezione storica. La vista PC oggi usa il tema navy scuro descritto in "Novità v43".
> Restano in giro alcuni residui chiari di Tema G (vedi Roadmap punto 4).

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

## Novità v78 — Tema chiaro/scuro × 3 livelli (non reimplementare)

**Cosa vede Fil**: pulsante sole/luna nell'header (PC: accanto allo stato Drive; telefono: sopra lo stato Drive, per non rubare spazio al titolo).
Apre il menu **Aspetto**: *Tema* Scuro/Chiaro e *Scurezza* Più chiaro / Medio / Più scuro (6 combinazioni). La scelta resta salvata e viene
applicata nel `<head>` prima del primo paint (nessun lampo). Il tocco fuori dal menu lo chiude senza attivare quello che c'è sotto; Esc lo chiude.
**Predefinito: Scuro · Medio** (`#25272b`, grigio) — cambia rispetto alla v77 (blu-navy). Chi aveva già scelto nella linea parallela (v60–v66) ritrova la scelta: stesse chiavi `appTheme`/`appTone`.

**Come è fatto** (tutto in `index.html`, nessun file esterno):
- `localStorage`: `appTheme` = `dark`|`light`; `appTone` = `1`|`2`|`3` (default 2). Attributi `html[data-theme]` e `html[data-tone]`; `<meta name="theme-color">` segue lo sfondo.
- Palette in cima al CSS: `:root, html[data-theme="dark"]` (valori del livello 2), `html[data-theme="light"]`, poi `html[data-theme=..][data-tone="1"|"3"]` che cambiano SOLO le superfici
  (`--bg --primary --secondary --surface-1 --surface-2 --pchead --border --surface-rgb`). Sfondi pagina: scuro 1/2/3 = `#2f3136 / #25272b / #1b1d20`; chiaro 1/2/3 = `#f0eeea / #e8e6e2 / #dcd9d3`.
- **REGOLA D'ORO: non scrivere più colori a mano nell'interfaccia.** Variabili da usare: sfondi `--bg --surface-1 --surface-2 --pchead`; testi `--text --text-soft --text-dim --text-muted`;
  bordi `--border`; veli `rgba(var(--veil-rgb),a)` (bianco nello scuro, inchiostro nel chiaro); ombre/overlay `rgba(var(--shade-rgb),a)`; **campi/input** `rgba(var(--well-rgb),a)` (scuro nello scuro,
  CHIARO nel chiaro — usare shade per un input lo farebbe grigio scuro nel chiaro); accenti `--accent --success --warning --ac-red --ac-orange --ac-cyan --ac-blue --ac-violet --ac-pink` e le versioni `-rgb`;
  testo su riempimento colorato `--ink`; su accento pieno `--on-accent`.
- Trasportatori: `--t-<nome>` (testo/bordo; nel chiaro sono più scuri), `--t-<nome>-bg`, `--t-<nome>-fill/-ink` (badge pieni mobile, uguali in entrambi i temi), `--t-<nome>-pill` (riempimento della pillola
  Trasportatore in tabella PC, uguale in entrambi i temi, testo `--ink`). La vista PC (`.desktop-view-active`) non ha più una palette sua: solo le tinte `--t-*`.
- **Colori calcolati da JS** (non possono essere `var()`): passano da `_themeInk(hex|hsl)` (nel chiaro abbassa la luminosità, tetto 31–38%) e `_themeRgb('r,g,b')`. Già applicati a:
  `getTransporterColorVar`, `_locationCodeColor` (`.tx`) e `_impactColor`, `dayColors` della tabella PC, `_mtDayColors` (Multi-Tratta, come proprietà con getter), `_pcRubricaColor`, `_dbCleanRender`,
  `SRCH_KINDS[*].color` (getter), `_srchDayCol`. Quando cambia il tema `setTheme()` chiama `_themeRerender()` (ridisegna Rapida/Trasp./Oggi, tabella PC, Rubrica, Archivio, pannello Storico via `_srchThemeChanged`).
- **NON toccati apposta** (stesso colore in ogni tema): `@media print`, stampa JS (`_printColor…`), Excel (`_transporterColorPC…closeExcelConfirm` e `_locationCodeColorPC`, usata anche dalla tabella PC solo per i pallini `.bd`).
- Funzioni: `applyTheme(t)`, `applyTone(n)`, `setTheme(t)`, `setTone(n)`, `toggleThemeMenu(ev)`, `_closeThemeMenu`, `_syncThemeMenu`, `_themeRerender`, `_isLightTheme`.
- Piccole correzioni fatte durante il lavoro: titoli dell'Archivio (testo `#1a2540` scuro su fondo scuro → illeggibile, residuo del vecchio Tema G); overlay dell'Archivio era bianco nello scuro (ora `shade`);
  pulsante ⬇ dell'Archivio bianco fisso; bordo giorno inattivo; stato del pulsante Salva in tabella PC; toast promemoria salvataggio; icona nota vuota (emoji 🗒️ → icona a linea).

**Come è stato costruito** (ripetibile, in `test_v74/theme_v78/`): `transform.py` (v77 → sostituzione automatica dei colori fissi con variabili, con zone protette), `theme_patch.py` (palette, menu, JS),
`theme_patch2.py` (palette JS, residui). Partono da `src_v77.html`. Percorsi scritti per `/home/claude/theme/` (cambiare `SRC`/`DST` in cima agli script se si sposta tutto).
Prove: `test_v74/th2.js` (screenshot per scena × 6 stati, `STATES=… ONLY=…`), `th5.js` (38 controlli sul pulsante: salvataggio, ricarica, Esc, clic fuori, mobile e PC), `th6.js` (popup minori), `montage.py` (foglio comparativo).
Regressione sul file con tema: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17 → tutti ok; `node --check` sui 5 script inline ok; lint no-undef 0; id doppi: nessuno.

## Novità v77 (non reimplementare)
- **DDT non alza più le righe** (Fil: "righe troppo alte"; con la riga DDT sotto il prodotto erano 84px invece di 68). Ora il DDT è un'**etichetta piccola sovrapposta** a destra nella cella Prodotto (`label.pc-ddt`, `position:absolute`): "DDT 1010". Se il viaggio non ha DDT l'etichetta è invisibile e compare "+ DDT" solo passando il mouse sulla riga o entrandoci con Tab/Invio (`.pc-ddt.empty`, `tr:hover`, `:focus-within`). `_pcDdtSync(input)` accende/spegne l'etichetta e fa spazio al prodotto (`padding-right:74px`, con ellissi). Intestazione tornata "Prodotto"; colonna Prodotto 180px, `min-width` tabella 1240px. Righe con e senza DDT: stessa altezza (provato a 1280 e 1440, `test_v74/s11.js`, 17 controlli).
- Invariati: DDT nel modulo di inserimento/modifica, nella ricerca/lente, nell'Excel, sulle schede Rapida (compare solo se c'è).
- **Due linee di lavoro parallele**: il 1 ottobre una chat "Chiarimento su file caricati" ha costruito, partendo dalla stessa v59, un'altra v60–v66 con **tema chiaro/scuro (pulsante sole/luna, `toggleTheme`, `data-theme`), regolatore "Scurezza" a 3 livelli (`appTone`, menu "Aspetto") e icone SVG al posto delle emoji**. Quel codice NON è nei file di questa linea (v46–v77). Fil lo ricordava giustamente.

## Novità v75–v76 (non reimplementare)
- **Vista PC: tolta la riga gialla dei viaggi "da confermare"** (Fil: "non mi piace"). Prima: barra sinistra spessa 8px `#f0b030` + sfondo caldo `#3a3527`/`#3d3828`. Ora la riga è identica alle altre; il segnale resta la scritta **"⚠ DA CONF."** nella colonna Stato (clic = conferma, "— segna" = segna). Tolti anche i lampi giallo/verde che `desktopSetPending`/`desktopToggleConf` davano alla riga (azzeravano lo sfondo della riga fino al ridisegno: difetto vecchio). **v76**: Fil ha scelto "un pallino": pallino ambra `#f0b030` 9px (`.pc-pend-dot`) nella prima colonna sotto le maniglie ⋮⋮, acceso/spento da `_desktopRebuildStatoCell` quando si segna/conferma (senza ridisegnare). Non rimettere barra o sfondo giallo.
- ⚠️ Il pulsante chiaro/scuro non è in questa linea di file (v46–v77): vedi la nota "Due linee di lavoro parallele" in v77. Fil l'ha cercato l'08/10 e ha ragione che esisteva (in un'altra chat).
- Prova: `test_v74/s10.js` (12 controlli).

## Novità v74 — Ricerca, filtro per tipo, storico a schede, Excel filtrato (non reimplementare)
**Barra PC** (`#srchGroup`, dentro `renderDesktopView`):
- **Lente generale** `#srchLens` a sinistra, piccola; al clic (o `/`, o Ctrl+F) si allarga a 390px. Cerca in trasportatore, partenza, arrivo, prodotto, "ddt N", note, date (più formati) e giorno. Più parole = AND, senza maiuscole/accenti (`_srchNorm`). Interruttore **Settimana / Storico** (`_srchScope`, ricordato in `localStorage.srchScope`).
- **Filtro unico per tipo** `#srchTyped`: tasto `#srchKindBtn` (menu `#srchTypeMenu`) con **Tutti** (grigio chiaro `#c3c9d6`, 4 quadratini) · **Cliente** (verde `#5fd9ab`, persona = colonna **Arrivo**) · **Fornitore** (azzurro `#7eb8ff`, fabbrica = colonna **Partenza**) · **Trasportatore** (arancione `#ff8c5a`, camion). "Tutti" cerca sui tre insieme. Suggerimenti (datalist) per tipo. Tipo ricordato in `localStorage.srchKind`.
- **Chip filtri attivi** `#srchChips` ("Cliente: X ✕", "Ricerca: Y ✕"): i filtri sono combinabili tra loro e col filtro giorno.
- Stato in cima al file (accanto a `_desktopQuickQuery`): `SRCH_KINDS`, `_srchKind`, `_srchScope`, `_srchTypedQ`, `_srchLensQ`… Il filtro tipizzato è **condiviso PC/Rapida**; la lente PC usa `_srchLensQ`, la barra Rapida `searchQuery`.
- `desktopQuickFilter()` riscritta: lavora sui DATI (`wt[idx]`), non sul testo delle celle; `renderDesktopView` chiama `_srchCaptureFocus()` all'inizio e `srchAfterRender()` alla fine → testo, filtri e focus **sopravvivono ai ridisegni** (sync Drive, modifica campi).
**Storico a schede** (`#srchPanel`, variante D approvata): numeri in alto (viaggi / settimane / trasportatori / tratte diverse), giorno grande colorato, fornitore azzurro → cliente verde, testo trovato evidenziato (`_srchHl`), max 400 schede, raggruppate per lunedì (più recenti prima). Clic su scheda della settimana corrente → `srchGoToResult` (azzera i filtri e fa lampeggiare la riga); su scheda archiviata → `srchOpenWeek` → `archiveRestore` (con la sua conferma; se Fil annulla il pannello resta aperto).
**Export Excel filtrato**: `downloadExcel(opts)` — con filtri attivi apre `#srchExpModal` (scelta *settimana corrente* o *tutto lo storico*, conteggi, anteprima nome file); `downloadExcel({all:true})` salta il dialog. Nome file `_srchFileName`: `Planning_Viaggi[_Tipo][_valore][_Ricerca_testo][_Storico].xlsx` (senza filtri resta il nome di sempre dal titolo settimana). Il filtro compare anche nel sottotitolo del foglio. `_getVisibleTrips()` applica anche tipo+lente. Il foglio si chiama sempre **"Planning"**; nel titolo solo "PLANNING VIAGGI".
**Rapida**: riga `#srchRowM` nei Filtri Rapidi con lo stesso menu (foglio dal basso `_openMobSheet` se `innerWidth<=640`, popover sul PC); `filterApply` usa `_srchTypedMatch`/`_srchGenMatch`. La barra "Cerca…" ora cerca anche prodotto, DDT, note, date.
**DDT finalmente visibile** (esisteva solo nel modale!): campo sotto il prodotto nella tabella PC (intestazione "Prodotto · DDT", `desktopSetField(idx,'ddt',…)`), riga "DDT n" sulle schede Rapida e nel riepilogo duplicazione (`_tripSummaryHtml`).
**Difetti PREESISTENTI trovati e corretti controllando tutto il codice**:
- DDT invisibile in tabella PC e schede Rapida (vedi sopra).
- Pulsante **Oggi** in PC con 0 viaggi (già così in v73; ora `_srchDayOk` gestisce la data ISO della modalità Oggi).
- **"Salva Excel e nuova settimana" con un filtro attivo** esportava solo i filtrati e poi svuotava tutta la settimana → ora usa `downloadExcel({all:true})` (esporta tutto).
- Excel da PC **ignorava la ricerca testuale** (ora la applica).
- `handleSearch` svuotava il campo di ricerca PC.
- Date "oggi" calcolate in **UTC** (`toISOString().split('T')[0]`) → fuori di un giorno dopo mezzanotte/prima delle 2: sostituite in 9 punti con `_isoDate(d)` (ora locale).
- `selectImportMode` era chiamata da `createNewWeek('import')` ma **non esisteva** → aggiunta.
- Import Excel non svuotava il campo del filtro tipizzato (riferimento a un id vecchio `filterClienteQ`).
- La vecchia ricerca archivio della Rapida (tasto 🗂) non guardava il DDT → aggiunto.
**Resta**: la 🗂 *Ricerca avanzata archivio* della Rapida (`toggleArchiveSearch`, `runArchiveSearch`) è un doppione della nuova lente Storico: da decidere con Fil se toglierla.
**Come è stato provato** (cartella `test_v74/`): `harness.js` apre l'app in Chromium (Playwright, `/opt/pw-browsers/chromium`) con dati finti e ExcelJS finto; `s2` filtro/lente (31 controlli), `s3` storico/export (40), `s4` Rapida (14), `s5/s6` Oggi e fuso orario (`s6` confronta due file: `APP_A=v73.html APP_B=v74.html node s6.js`; simula le 00:30 a Roma: in v73 "Oggi" mostrava 0 viaggi, in v74 sono giusti), `s8` regressione funzioni esistenti (40), `s9` interazioni sync/ricerca/form (8); `lint.js` (ESLint no-undef ecc.), `handlers.js` (ogni `onclick=` punta a una funzione esistente, id doppi). `patch.py` + `srch.js` + `srch.css` = come la v74 è stata ricavata dalla v73. Uso: `APP=/percorso/index.html node s8.js`.
**Lezioni di metodo** (per non ripetere gli errori di questa sessione):
- Il codice "letto a occhio" non basta: i difetti sopra (DDT invisibile, Oggi a 0, nuova settimana con filtro) c'erano da più versioni e nessuno li aveva mai provati. **Ogni funzione nuova va provata in un browser vero** (Playwright) e il risultato va letto, non solo `node --check`.
- Test: calcolare le attese dai dati dell'app (`page.evaluate(() => trips)`), non dai dati del seed (l'app riordina `trips`).
- Dire sempre onestamente **cosa non è stato provato** (Excel reale, Drive reale, dispositivo reale).
- Mockup uno alla volta e grandi; mai emoji come icone nelle cose nuove (SVG a contorno); ogni cancellazione con conferma o Annulla.

## Novità v73 (non reimplementare)
- (⚠ sostituito in v75: la barra gialla è stata tolta) Vista PC: riga "da confermare" (`daConfermare`) con **barra gialla** `#f0b030` larga 8px a sinistra (le altre righe 4px) e sfondo caldo `#3a3527` (`#3d3828` se oggi). Approvata da Fil.
- Restano non fatte: OGGI in evidenza nella fascia giorno, azioni riga solo in hover.

## Novità v72 (non reimplementare)
- Intestazione tabella PC scura "B" (grigio-blu #2d3447, scritte #d6dcea, linea #46506b, colonna ordinata arancione chiaro #ff8c5a).
- Colori trasportatori vista PC (`.desktop-view-active --t-*`) con saturazione ridotta del 10% (S×0.9, in HSL). Stile blocco pieno invariato.
- (La barra gialla è stata fatta in v73.)

## Novità v70 — Excel layout "B" (non reimplementare)
- `_buildAndDownloadExcel` riscritto: righe alte (31pt), titolo "PLANNING VIAGGI" con riquadri numeri, filo arancione, etichette trasportatori con conteggio, intestazione, **fascia tenue per giorno** (tinta `_DAY_CHIP` + barra colore `_DAY_STRIPE` in colonna A, con n. viaggi e da confermare), codici fornitore/cliente in celle colorate con bordo bianco thick (effetto pillola). Colonne: A barra | Giorno | Trasportatore | Fornitore(cod) | Partenza | Cliente(cod) | Arrivo | Prodotto | DDT | Stato | Note (compatibile con `importaExcel`: le fasce giorno sono righe senza trasportatore → saltate).
- **Stampa**: A4 orizzontale, larghezza 1 pagina, intestazione ripetuta (`printTitlesRow`), piè di pagina "Pagina X di Y · Generato il …" (try/catch: se ExcelJS non li supporta l'export funziona comunque).
- Nome azienda tolto dall'Excel (v71): solo "Planning Viaggi". Verifica: ExcelJS non installabile in sandbox (npm bloccato) → testato con shim che registra le chiamate + openpyxl + LibreOffice (anteprima_excel_v70.png). NON provato con ExcelJS vero né in Excel: da controllare da Fil.
- Idee non ancora fatte: riga gialla per "da confermare", foglio per trasportatore, foglio Riepilogo, colonna Note condizionale.

## Novità v69 — BUG CSS STORICO RISOLTO (non reimplementare)
- Nel primo `<style>` mancava la `}` di chiusura di `@media (max-width: 640px)` (dopo la regola `.desktop-view-active .mobile-bottom-nav`), quindi TUTTO il CSS seguente (barra viste PC `.pc-view-switcher`, bottom nav, modali, ecc.) valeva solo su telefono: su PC i pulsanti "Vista/Aggiungi/Multi/Archivio" comparivano grezzi (bianchi, senza stile). Chiusa la graffa e riaperto `@media (max-width: 640px)` prima di "Da Confermare modal - mobile full screen" (il cui `}` finale era l'unica chiusura). Bilancio graffe = 0 in tutti e 3 gli `<style>`. Verifica: contare `{`/`}` fuori dai commenti.
- Filtro Cliente (Rapida) ora rispettato anche da Rapida/Trasp./export Excel (`hasFilters` include `clienteQ`).
- Possibile effetto collaterale (da guardare a schermo): altri stili ora attivi anche su PC (modali, bottom-sheet).

## Novità v69 (non reimplementare)
- Barra comandi PC ridisegnata in 3 righe con CSS dedicato `#pcBarStyle` (classi `.pcb*`) e icone linea `_PCI`: R1 = Rubrica | [Settimana|Oggi] | 📱 … Multi-tratta, ＋Nuova riga | gruppo [Salva|Carica|Excel] | ⋯; R2 = totale viaggi, pillola "N da confermare" (apre il modale) o "Tutto confermato", chip trasportatori tinte+pallino; R3 = filtri giorno + ricerca + Cliente + Crono + ⌨.
- Toggle settimana ora con classe `.on` (non più stili inline); "Corrente"→"Settimana". `_setSyncBtnState`/`updateDriveBtns` aggiornano il bottone Salva con `_PCI.save`.
- Nota: Fil guardava una versione VECCHIA (con Prossima/Sett. prossima): ricordare di caricare l'ultimo file su GitHub Pages.

## Novità v68 (non reimplementare)
- Rapida: swipe a destra NON elimina più subito → foglio di conferma (`_askDeleteTrip`: riepilogo viaggio, Annulla/Elimina); dopo l'eliminazione toast "ANNULLA" per 7s (`_showUndoToast`, ripristina il viaggio). Vale anche per la vista Prossima (codice residuo).
- Rapida: pulsante ⧉ su ogni card → foglio "Duplica su questi giorni" (`mobileDup`, chip Lun–Ven, il giorno del viaggio preselezionato; copia identica con trasportatore). Helper `_openMobSheet/_closeMobSheet/_tripSummaryHtml`.
- Sync: `_stampTrips` assegna nuovo id a copie con id duplicato e a viaggi cancellati poi rimessi (annulla/ripristina/copia settimana), così le lapidi non li ricancellano.
- Test con touch simulati (CDP): duplica, swipe→conferma, annulla, elimina, ANNULLA toast → OK.

## Novità v67 — SALVATAGGIO/SYNC UNICO (non reimplementare)
- Ogni viaggio ha `id` + `ts`; cancellazioni = lapidi `_tombs` (localStorage `tripTombs`); `tripSigMap` = ultimo stato noto. `_stampTrips()` (in `saveToLocalStorage(skipSort)`) assegna id/ts e crea lapidi confrontando con la firma precedente → nessun punto di modifica deve ricordarsi di nulla.
- `_mergeState` unisce per id (vince ts maggiore, lapide >= ts elimina). Viaggi vecchi senza id: id deterministico da `_tripMergeKey` (`_ensureIds`).
- Drive: `_runSync(forceWrite)` → `_driveSyncCore` legge Drive, unisce, applica a UI (rinviato se si sta scrivendo in un campo), scrive se serve. Una sync alla volta (`_syncRunning/_syncPending`), debounce 1.5s in `autoSaveDrive`, retry 15s se errore, 401 → `silentDriveInit(true)`. `driveSave`, `driveSmartSync`, `driveSync`, `driveLoadData` sono ora wrapper; "Carica" UNISCE (non sovrascrive). Payload Drive: trips (con id/ts), tombs, weekTitle, weekArchive, savedAt, v:2.
- Guardiano: ogni 1.5s se i viaggi sono cambiati rispetto all'ultimo salvataggio → `saveToLocalStorage(true)` (senza riordinare, per non spostare gli indici della tabella PC). Pull ogni 45s, al ritorno sull'app (visibilitychange), su `online`; flush su pagina nascosta.
- `desktopSetField` e `debouncedDriveSave` ora passano dal sistema unico. Test con Drive simulato (2 dispositivi): aggiunte concorrenti, modifica, cancellazione senza risurrezione, reload → OK. Mai provato con Drive reale!
- Rapida: "Nuova settimana" spostato dentro il pannello Filtri.
- Non sincronizzati: tripsNext (vista Prossima rimossa), cartelle/altro.

## Novità v66 (non reimplementare)
- Rubrica PC: pulsante spostato a SINISTRA della barra; pannello `#pcRubricaPanel` ora si apre a sinistra (left:0, bordo destro); giorni in oro (#ffd98a, 16px, barretta) e testi secondari più chiari.
- Rapida (mobile): "Filtri rapidi" chiuso di default (restano visibili ricerca + nuovo campo **Cliente** `#filterClienteQ`, `filterState.clienteQ`, match parziale su arrivo, datalist `#clienteList`); header: stato Drive con ellissi su schermi stretti (@media 600px).
- (Falsi allarmi nei test: "0 viaggi" e logo rotto erano artefatti dell'ambiente di prova.)
- v65: vista "Prossima" non più raggiungibile.

## Novità v64 (non reimplementare)
- Barra PC ridisegnata: riga 1 = [Corrente|Oggi] [←📱] [＋Nuova riga] [Multi-Tratta] … [Salva][Carica][Excel][Rubrica][⋯]. Menu `⋯` (`pcToggleMoreMenu`): Stampa, Totali, Archivio, Database, Nuova settimana. Tolti: "Prossima" (toggle e barra viste PC), "Sett. prossima", contatore doppio. Su mobile la tab "Prossima" resta.
- Riga filtri: giorni + ricerca testo + **filtro Cliente** (`#desktopClientSearch`, datalist arrivi `dto`, filtra sul campo arrivo; combinato con la ricerca; ✕ per azzerare) + Crono + ⌨. Logica in `desktopQuickFilter`.
- Il filtro si azzera quando la tabella si ridisegna (come la ricerca).
- v65: vista "Prossima" non più raggiungibile da nessun pulsante (mobile e PC); se salvata come vista preferita riparte da Rapida. Codice e dati tripsNext lasciati intatti.
- (v63) pinch-zoom bloccato in tutta l'app.

## Novità v62 (non reimplementare)
- v63: pinch-zoom disattivato in TUTTA l'app (meta viewport user-scalable=no + touch-action pan + preventDefault su touchmove multi-touch e gesture*).

## Novità v61 (non reimplementare)

**Rubrica, secondo giro dopo la foto di Fil ("non è fatto bene").** Dalla foto si vedeva che la v60,
pur corretta nella logica, era scomoda da usare davvero:
- **scorrendo si perdeva il contesto**: nome del fornitore, conteggio e "Seleziona tutti" uscivano
  dallo schermo → ora l'intestazione della scheda (`top:0`, altezza fissa 56px) e la riga "Seleziona
  tutti" (`top:56px`) sono `position:sticky`, con sfondo OPACO (`#161b28` + tinta in `linear-gradient`).
  ⚠️ la scheda NON deve avere `overflow:hidden`: spezzerebbe lo sticky (per questo l'angolo in alto
  è arrotondato sull'intestazione, non sulla scheda);
- **metà di ogni riga era vuota** e si vedevano ~5 viaggi per schermata → Fornitori/Clienti ora
  hanno **una riga sola a colonne** (46px): destinazione+codice | trasportatore (96px) | prodotto
  (66px) | icona "da confermare" (18px, riga con tinta ambra). Trasportatori resta a due righe
  (manca la colonna trasportatore: è l'entità aperta). Pannello 520 → **560px**;
- spunte più piccole/discrete (18px, bordo tenue), si accendono al passaggio e da selezionate
  (`.pcr-row`/`.pcr-cb`, stile iniettato una volta da `_pcRubricaEnsureStyle`); riga selezionata con
  `box-shadow:inset` (non `border`, per non spostare il layout).

**Bug mio della v53 trovato dalla stessa foto: "Riconnessione a Drive…" fermo per sempre.**
`silentDriveInit` non aveva né `error_callback` né timeout. Con GIS gli errori "di sistema" (popup
bloccato dal browser perché non c'è un gesto dell'utente — il caso normale a caricamento pagina)
arrivano a `error_callback`, NON a `callback`: senza, la scritta gialla restava lì e Drive non si
collegava. Ora: `error_callback` + timeout di sicurezza a 15s → messaggio onesto
(`_driveSilentFail`), e se il popup è stato bloccato **riprova UNA volta al primo tocco/clic**
(`pointerdown` una tantum, quando il popup è consentito) — mai cicli. Se riprova e fallisce:
"premi Salva". **Da verificare nel browser vero**: non so se Brave+Google dopo il primo tocco
riconnettano davvero senza interazione (testata solo la logica con un Google finto).

**Verifica**: 50 controlli sul dettaglio Rubrica + 17 sulla riconnessione (popup bloccato / chiuso /
negato / nessuna risposta / token tardivo / niente cicli) — **l'aspetto a schermo NON è stato visto**.

## Novità v60 (non reimplementare)

**Rubrica: dettaglio ridisegnato + cancellazione multipla con "Annulla".** Fil, guardando il
dettaglio di Bientina (foto): "molto sterile, si capisce poco". Problemi reali: le righe dicevano
solo data + destinazione (niente trasportatore né prodotto → due viaggi di venerdì identici),
scatole grigie tutte dello stesso peso, nessuna azione possibile. Ora, cliccando un
fornitore/cliente/trasportatore:
- **una scheda sola**, nel colore dell'entità (`color-mix` per le tinte, funziona anche con
  `var(--t-...)`), con intestazione "N viaggi";
- **riepilogo** "DOVE VANNO" (fornitori e trasportatori → luoghi di arrivo) o "DA DOVE ARRIVANO"
  (clienti), con ×conteggio per luogo — è il dato "dove vanno / quante volte" che Fil voleva estrarre;
- viaggi **raggruppati per giorno**, ogni riga su due righe: destinazione + codice, sotto
  trasportatore · prodotto; tag "Da conf." se da confermare;
- **checkbox per riga + "Seleziona tutti"**; con una selezione compare in basso la barra
  "N selezionati · Annulla · Elimina N viaggi".
**Scelta di Fil sull'eliminazione**: cancella SUBITO (niente conferma), con toast **"Annulla"
visibile 8 secondi** (barra che si consuma). Solo l'ULTIMA eliminazione è annullabile (una
nuova sostituisce il buffer). Annulla rimette i viaggi nell'array giusto (corrente/prossima) anche
se nel frattempo si è cambiata settimana, e il salvataggio li rimette in ordine di data.
Funzioni nuove: `pcRubricaToggleRow`, `pcRubricaToggleAll`, `pcRubricaClearSelection`,
`pcRubricaDeleteSelected`, `pcRubricaUndoDelete`, `_pcRubricaPersist`, `_pcRubricaShowUndo/HideUndo`,
`_pcRubricaEntityTrips`, `_pcRubricaCheckbox`, `_pcEsc`. Stato: `_pcRubricaChecked`
(indice-nell'array → true), `_pcRubricaUndo`.
**Cose da sapere**:
- La selezione usa **indici dell'array** (il progetto non ha ancora id per viaggio — Roadmap 2):
  per sicurezza `pcRubricaDeleteSelected` ricontrolla che ogni indice esista ANCORA e che il viaggio
  appartenga davvero all'entità aperta, altrimenti lo salta. Quando arriverà l'id per viaggio, passare
  la selezione agli id.
- `saveToLocalStorage()` e `saveNextToLocalStorage()` **ordinano l'array per data a ogni salvataggio**:
  gli indici cambiano dopo ogni save, quindi non conservare indici tra un salvataggio e l'altro.
- Il payload Drive contiene solo `trips` (non `tripsNext`): le eliminazioni in "settimana prossima"
  non si sincronizzano su Drive (comportamento già esistente, non toccato).
- Chiusura al click fuori dal pannello (overlay) → mentre è aperto non si può modificare la
  tabella: il vecchio limite "i conteggi non si aggiornano" della v58 è di fatto superato.
- Pannello allargato 460 → 520px (max 94vw).
**Verifica**: logica provata con un test Node (41 controlli: selezione, cancellazione, annulla,
selezione "sporca", settimana prossima + cambio vista, entità che si svuota, escaping HTML) —
**l'aspetto a schermo NON è stato visto**: da controllare nel browser.

## Novità v57–v59 (non reimplementare)

**v57 — Popover duplica: riepilogo colorato + box più grande.** Nel popover "Duplica su
questi giorni" (v56), la riga di riepilogo (trasportatore · partenza → arrivo) ora è
colorata coi colori veri: trasportatore con `getTransporterKey()`/`var(--t-...)`,
partenza/arrivo con `_locationCodeColorPC(...).bd` estratto dal codice tra parentesi.
Popover allargato 260→300px.

**v58 — Pannello "Rubrica" Fornitori/Clienti/Trasportatori (PC).** Nuova funzione vera,
non più mockup: pulsante "Rubrica" in barra azioni PC apre un pannello fisso a destra
(`#pcRubricaPanel`, `position:fixed`, chiude su click-fuori tramite `#pcRubricaOverlay`).
3 schede (Fornitori/Clienti/Trasportatori), lista con conteggio viaggi della settimana
corrente/prossima (`_pcRubricaGroups`, raggruppa per `partenza`/`arrivo`/`trasportatore`
esatti — NON solo per codice, per il luogo+codice intero), colori identità veri
(`_pcRubricaColor`, riusa `_locationCodeColorPC`/`getTransporterKey`). Click su una voce
apre il dettaglio viaggi sotto, nello stesso pannello (non un secondo popup — scelta
esplicita di Fil dopo aver confrontato le alternative). Funzioni: `pcToggleRubrica()`,
`pcRubricaSetTab()`, `pcRubricaSelectEntity()`, `_pcRubricaRender()`,
`_pcRubricaDetailHtml()`. **Limite noto**: se il pannello resta aperto e nel frattempo
si modifica un viaggio altrove, i conteggi non si aggiornano da soli finché non si
cambia scheda o si riapre — segnalato a Fil, non ancora sistemato.

**v59 — Fornitore/Cliente: tolto il blocco di colore pieno.** Causa del "raffazzonamento"
segnalato da Fil (screenshot con 18 blocchi di colore diversi in 6 righe): i badge
Fornitore/Cliente nella tabella PC usavano `background:' + _locationCodeColorPC(code).bd`
con testo bianco sopra — pieno e saturo, uno diverso per riga, senza gerarchia. Ora: solo
un pallino 8px + testo in tinta (stessa idea già usata per il Trasportatore dal v54,
finalmente coerente su tutta la riga). Anche le icone della Rubrica (v58) sono passate da
emoji a SVG inline a contorno — le emoji come icone d'interfaccia sono "AI slop" per
qualunque standard di design professionale, non solo per i mockup. **Non esteso al resto
dell'app**: ci sono ancora ~40+ emoji usate come icone altrove (bottoni azione, stati,
ecc.) — toccarle tutte è un lavoro a parte, non fatto in v59, probabilmente da abbinare
alla Priorità 0 quando si mette mano ai colori comunque.

**Nota di metodo — il bug che non c'era**: a metà sessione Fil ha segnalato "sono
cambiati tutti i colori" dopo l'aggiunta della Rubrica (v58). Confronto riga per riga
v57↔v58: zero righe toccate fuori dalla Rubrica stessa. Non era un bug — era la sensazione
di incoerenza data dal fatto che i colori sono scritti a mano ovunque invece che in un
sistema unico (motivo per cui la Priorità 0 qui sopra viene prima di tutto). **Lezione**:
quando Fil segnala "è cambiato tutto" dopo una modifica piccola e mirata, il diff riga per
riga va comunque fatto per essere sicuri — ma vale anche la pena capire se il problema
reale è più a monte (mancanza di un sistema) invece di cercare una riga di codice che
in realtà non esiste.

## Novità v53–v56 (non reimplementare)

**v53 — Salvataggio/sync Drive, causa reale trovata**: Fil segnalava disallineamenti
frequenti PC/telefono. Causa: `tryAutoReconnectDrive()` richiedeva un token già presente
per partire, ma a ogni ricarica pagina `driveAccessToken` riparte `null` — quindi il
"tentativo automatico" scritto nel `window.onload` non faceva letteralmente nulla finché
non si premeva "Salva" a mano almeno una volta a sessione. In più `autoSaveDrive()`
saltava apposta il controllo anti-conflitto (`silent=true`), quindi quando funzionava
sovrascriveva alla cieca. Aggiunte: `silentDriveInit()` (riconnessione vera a freddo,
poi lancia `driveSmartSync()` — esisteva già ma non era mai stata collegata a nulla),
stato onesto (`driveStatusText`/`driveStatusDot`) invece del log invisibile, controllo
conflitto anche in automatico con merge silenzioso (`_mergeTripArrays`, `_tripMergeKey`)
invece di sovrascrittura cieca.

**v54 — Tabella PC: bug di disallineamento colonne + toggle mancante**. L'intestazione
aveva una colonna "Note" senza la cella corrispondente nella riga: tutto scivolava di
una posizione e restava una colonna fantasma vuota fino al bordo destro (lo screenshot
di Fil "manca spazio a destra" era letteralmente questo bug, non solo estetica). Le note
non comparivano mai in tabella PC. Corretto l'allineamento, ingranditi i font
(trasportatore, prodotto, badge codice), badge Fornitore/Cliente passati da ellissi su
una riga a wrap su 2 righe (`-webkit-line-clamp:2`) invece di tagliare la parola.
Aggiunta `desktopSetPending(idx)`: `desktopToggleConf` sapeva solo confermare (imposta
`daConfermare=false`), mancava la direzione opposta per marcare "da confermare" un
viaggio già in lista senza aprire il modale — ora il placeholder "—" nella cella Stato è
cliccabile ("— segna").

**v55 — Colonna Note tolta, sostituita da icona + popover** (Fil: le note si usano
raramente, non ha senso tenerle una colonna fissa sempre vuota). Rimossa dalla tabella,
spazio ridato a Partenza/Arrivo/Prodotto. Al suo posto, nella cella Stato: icona 🗒️/📝
(piena solo se il viaggio ha già una nota), click apre un piccolo popover fisso
(`desktopToggleNotePopover`, ancorato con `getBoundingClientRect`) con una textarea —
Invio salva, Esc annulla, click fuori salva e chiude. **Bug trovato e corretto nello
stesso giro**: sia `desktopToggleConf` che `desktopSetPending` ricostruivano la cella
Stato a modo loro perdendo pezzi (una perdeva i bottoni duplica/elimina, l'altra pure);
centralizzato tutto in `_desktopRebuildStatoCell(idx)`, unica fonte di verità per
com'è fatta quella cella.

**v56 — Duplica viaggio su più giorni**. Prima "⧉ Duplica" creava subito una copia
identica nello stesso giorno. Ora apre un popover (stesso pattern del v55: `position:
fixed`, ancorato al pulsante) con i 5 giorni Lun–Ven della settimana DEL VIAGGIO
(calcolati con `getMonday(t.data)`, quindi funziona identico in vista Corrente e
Prossima) — il giorno originale parte già selezionato, si possono aggiungere gli altri,
"✓ Duplica" crea una copia identica (stesso trasportatore/partenza/arrivo/prodotto/note/
ddt) per ciascun giorno scelto. Funzioni: `desktopDup(idx, btnEl)`, `_pcDupToggleDay`,
`_pcDupConfirm`, `_pcDupCancel`, `_isoDate(d)`. La scorciatoia Ctrl+D è stata adattata
allo stesso flusso (prima assumeva la creazione immediata e ci spostava il focus sopra).

**Nota di pattern per sessioni future**: v55 e v56 usano lo STESSO schema di popover
leggero (elemento `position:fixed` creato al volo, appeso a `document.body`, posizionato
via `getBoundingClientRect()` del pulsante cliccato, chiuso da click-fuori/Esc). Se serve
un altro popover simile in tabella PC, riusare questo pattern invece di inventarne uno
nuovo — sono quasi identici e si potrebbero anche accorpare in un helper comune, non
ancora fatto per non rischiare inutilmente codice che già funziona.

## Novità v48–v52 (non reimplementare)

**Toggle "Da confermare" premium** (Fil: "non c'è più la possibilità di mettere da
confermare" — il checkbox c'era ancora ma era piccolo e con colori tenui, sembrava sparito).
Sostituito il checkbox con una riga cliccabile con interruttore stile iOS, in 3 punti:
- **v48 — form mobile "Nuovo Viaggio"**: `#daConfermareRow` (riga), `#daConfermareSwitch` +
  `#daConfermareThumb` (interruttore), checkbox reale nascosto `#daConfermare` (resta la
  fonte del valore letta dal submit). Funzioni `toggleDaConfermareUI()` /
  `_syncDaConfermareUI()`; `_syncDaConfermareUI()` richiamata dopo `tripForm.reset()`.
- **v49 — modale "✏️ Modifica Viaggio"** (`#editDaConfermareRow`, `toggleEditDaConfermareUI()`,
  `_syncEditDaConfermareUI()`, richiamata in `editTrip()` e `editNextTrip()` dopo aver
  impostato `.checked`) **e modale PC "Nuovo viaggio"** (`#dmDaConfRow`,
  `toggleDmDaConfermareUI()`, `_syncDmDaConfermareUI()`, richiamata in `desktopAddEmpty()`).
- Regola da ricordare: ogni volta che il codice imposta `.checked` di questi checkbox
  nascosti va richiamata la relativa `_sync…UI()`, altrimenti l'aspetto non segue lo stato.
- v50–v51: nel modale PC il primo tentativo usava trasparenze (`rgba(224,192,90,0.08)`)
  pensate per stare sopra sfondi scuri → su bianco erano invisibili. Poi rifatto in chiaro
  contro il desiderio di Fil. Versione finale: sfondo **pieno** `#1E2530` (ON `#2E2510`),
  bordo/testo oro `#E0C05A`. Lezione: non riusare stili con trasparenze fuori dal loro tema.

**v52 — modale PC "Nuovo viaggio" reso completamente scuro** (bug reale, non solo estetico):
`#desktopAddModal` era rimasto coi colori del vecchio Tema G chiaro (`#eef2f7`,
`rgba(16,32,64,…)`, `#e4e9f0`) dopo il redesign navy v43, ma il testo usava
`color:var(--text)` che è **chiaro** → scritte quasi bianche su sfondo quasi bianco,
invisibili (Trasportatore, Prodotto, Partenza, Arrivo, ecc.). Ora: card `#0f1220` (stesso
di Multi-Tratta), campi `rgba(255,255,255,0.05)`, bordi `rgba(255,255,255,0.12)`, header/
footer/bottoni riallineati, e anche i **chip giorno Lun–Ven** (sia nel markup iniziale sia
in `_dpkUpdate()`) e il campo `#dmDate`. Il riquadro "Da confermare" resta come approvato.
Verificato con grep che nel modale non restino colori chiari; **non verificato a schermo**.

**Nota di metodo**: nei turni v50–v52 ho frainteso due volte la richiesta (pensavo si
trattasse solo del riquadro "Da confermare", poi ho letto "scuro" come "adatto al tema
chiaro"). Quando Fil manda una foto e dice "ancora il problema", guardare **tutta** la
schermata, non solo l'elemento appena toccato; e prima di scegliere i colori verificare la
palette reale del tema (v43 = navy scuro), non quella descritta nelle sezioni storiche.

## Novità v46–v47 (non reimplementare)

**Export Excel — redesign completo, foglio unico "Planning" (sostituisce il
vecchio sistema a 2 fogli "Viaggi"+"Riepilogo" descritto più sotto in v38/v39,
ormai storico)**. Motivo: Fil lo trovava "brutto, non funzionale, pagine che
non c'entrano niente". Dopo diverse iterazioni di mockup (varianti Excel
generate con `openpyxl`/Python fuori dall'app, solo per scegliere lo stile —
il codice reale nell'app usa sempre `ExcelJS` lato browser) è stato scelto:

- **Foglio unico**, niente più "Riepilogo" separato.
- **KPI card in alto** (Viaggi totali / Confermati / Da confermare /
  Trasportatori), 4 box con bordo superiore colorato, tinta chiara.
- **Trasportatore stampa-safe**: NON più un tassello a sfondo pieno saturo
  (in bianco/nero diventava un blocco grigio scuro illeggibile — verificato
  esportando in PDF e convertendo in scala di grigi). Ora: piccolo quadratino
  colorato (swatch, colonna a parte) + nome in **testo grassetto colorato**
  su sfondo bianco/zebra. Palette in `_transporterColorPC()` — stessa identità
  colore della sezione "Badge trasportatori" più sotto in questo file, con
  fallback deterministico (hash→hue) per nomi non in lista.
- **Codici cliente/sito a colonna separata** ("Cod.") accanto a Partenza/Arrivo,
  chip a tinta chiara — riusa `_locationCodeColorPC()` già esistente (stessa
  palette fissa della vista PC), quindi stesso colore ovunque nell'app.
- **Colonna DDT** (nuova, v46) tra Prodotto e Stato — mostra `t.ddt` in
  monospace grassetto, oppure "—" se assente.
- Giorno: chip a tinta chiara + striscia laterale colorata sottile (non un
  banner pieno come il vecchio sistema).
- Funzioni nuove: `_transporterColorPC(name)`, `_toHex6(c)` (converte hex o
  stringa `hsl(...)` in hex a 6 cifre per ExcelJS), `_xlsWriteLoc(wr, colIdx,
  locText, bg, inkArgb)` (scrive luogo + chip codice), `_DAY_CHIP`/`_DAY_STRIPE`
  (nuove palette leggere, sostituiscono `_DAY_COLORS` rimossa). **Rimosse**:
  `_xlsColors()` e `_DAY_COLORS` (vecchia palette Excel-only, sfondi pieni
  saturi) — non esistono più, non cercarle.
- `_xlsFmtDate`/`_xlsWeekRange` invariate (riusate).
- Popup di conferma download: rimosso il riferimento fisso "· 2 fogli" (ora è
  un foglio unico).

**Campo N. DDT aggiunto al modello dati e a TUTTI i punti di inserimento/
modifica, sia mobile che PC** (richiesta esplicita di Fil):
- Form mobile "Nuovo Viaggio" (`tripForm`): input `id="ddt"` dopo Prodotto/Note.
- Modale desktop "Aggiungi viaggio PC": input `id="dmDDT"` accanto alle Note
  (`desktopAddEmpty()` lo include nella lista campi da svuotare/precompilare,
  `desktopConfirmAdd()` lo legge).
- Modale mobile "✏️ Modifica Viaggio" (`editModal`, condiviso da `editTrip()` e
  `editNextTrip()`): input `id="editDDT"` — **aggiunto durante un giro di
  controllo del codice**, non era stato richiesto esplicitamente ma era
  necessario: senza, ogni modifica di un viaggio esistente cancellava il DDT
  già inserito (vedi bug sotto).

**Archivio settimane — ora è un pulsante espandibile, non più una lista
sempre visibile** (Fil, da screenshot: "non una lista infinita"). Header
`#archiveSection` trasformato in `<button id="archiveToggleBtn">` con
chevron `#archiveChevron` (▶/▼) che chiama `toggleArchiveExpanded()`; la
lista `#archiveList` parte `display:none` e lo stato aperto/chiuso è
ricordato in `localStorage.archiveExpandedUI` (applicato a fine
`renderArchive()` ad ogni re-render, non solo al primo load).

**Tre bug di mancata sincronizzazione automatica trovati e corretti**
(Fil aveva chiesto un controllo generale del salvataggio automatico da
mobile — nessuno di questi era stato segnalato esplicitamente, trovati
scansionando tutti i punti che chiamano `saveToLocalStorage()` e verificando
se seguiva `if (driveAccessToken) autoSaveDrive();` come negli altri punti
equivalenti):
1. **`_commitEditForm()`** (submit del modale "✏️ Modifica Viaggio", il più
   grave) — non chiamava `autoSaveDrive()` dopo il salvataggio. Corretto.
2. **`fixSortOrder()`** — idem, aggiunta la chiamata.
3. **`clearData()`** — cancellare tutti i viaggi non sincronizzava la
   cancellazione su Drive (rischio: il backup remoto restava con i vecchi
   dati). Aggiunta la chiamata.
   Anche l'handler di successo dell'**import da Excel** non sincronizzava —
   aggiunta la chiamata a fine importazione.

**Nota metodologica per sessioni future**: la funzione Excel reale
(`_buildAndDownloadExcel`) era rimasta quella vecchia per diversi turni di
conversazione mentre si iterava solo su MOCKUP esterni (file `.xlsx` generati
con Python/openpyxl, mai collegati al codice dell'app) — Fil ha dovuto
segnalare "perché mi viene ancora fuori questo?" caricando l'export reale
prima che il codice venisse davvero aggiornato. **Quando si concorda un
design a mockup, chiarire sempre esplicitamente quando si passa
dall'anteprima all'implementazione reale nel file HTML**, non darlo per
scontato.

**Nota sui vincoli ES5**: la funzione Excel (sia la vecchia che la nuova)
usa `const`/`let`/arrow functions/spread — **non rispetta i "Vincoli Android
critici"** dichiarati più sotto in questo file. È così da prima di questa
sessione (era già così nel codice v45 originale) ed evidentemente funziona
lo stesso su Android, quindi non è stato riportato a ES5 puro per non
introdurre rischi in codice già testato — mantenuta la convenzione locale
già presente. Se in futuro Fil segnala problemi Excel specifici su Android,
questo è il primo sospetto da controllare.



**Menu suggerimenti nostro esteso a tutti i campi mobile/touch** (Fil: "danno lo
stesso fastidio" su modifica ed multi-tratta). Aggiunto a: `editTrasportatore`,
`editPartenza`, `editArrivo` (modale modifica), `mtTrasp` (Multi-Tratta, campo
in alto), `mt-from-*`/`mt-to-*`/`mt-prod-*` (Multi-Tratta, campi per-riga —
agganciati dentro `mtAddRow()` appena la riga viene creata, dato che sono
dinamici). `editProdotto` non serviva: è un `<select>`, non un campo di testo
con datalist.

**Fix di posizionamento trovato durante l'estensione**: `_customAutocomplete`
posizionava il menu relativo al genitore dell'input (`position:relative` +
`top:100%`) — funzionava nel form principale (ogni campo ha il suo contenitore),
ma nella Multi-Tratta più campi (partenza/arrivo/prodotto) stanno nella STESSA
riga flex, quindi il menu si sarebbe allargato su tutta la riga invece che sotto
il campo giusto. Riscritta per posizionarsi con `getBoundingClientRect()` in
`position:fixed` agganciato al bordo esatto dell'input, aggiunto a `document.body`
— funziona ovunque, indipendentemente da come è strutturato il contenitore.

**Pulizia memoria**: righe Multi-Tratta rimosse (`mtRemoveRow`) o l'intero elenco
svuotato alla riapertura (`openMultiTratta`) ora rimuovono anche i menu a tendina
orfani associati (altrimenti restavano nel DOM invisibili ma accumulati ad ogni
uso ripetuto della Multi-Tratta).

Colori corretti in Multi-Tratta: `#f0f4ff`/`#86efac` (bianco/verde quasi neon,
residuo del vecchio tema) → `#e4e8f0`/`#7fd6ac` (stessa palette anti-alone usata
ovunque nel resto dell'app).

**Verificato con una scansione completa di ogni `list="..."` nel file**: tutti i
campi mobile/touch ora usano il menu nostro; quelli rimasti nativi sono solo
nella vista PC (dfrom/dto/dprod/dtransp/dmTransp/dmProd/dmFrom/dmTo), dove va
bene così — col mouse il datalist nativo non ha lo stesso problema.

## Novità v44 (non reimplementare)

**Menu suggerimenti nativo del telefono sostituito con uno nostro** — Fil ha
segnalato (screenshot) che il menu a tendina di Trasportatore nel form mobile
"Nuovo Viaggio" era il `<datalist>` **nativo del browser Android**: righe enormi,
impossibile toccare quella giusta, pieno di doppioni storici (es. "ASCHIERI" e
"Aschieri", "C.M TRASP" e "C.M TRASPORTI" — dati reali, non un bug: da ripulire
dal pannello 🗃️ Database). Il menu nativo non è stilizzabile via CSS, quindi
l'unico modo per renderlo "premium" e usabile era sostituirlo del tutto.

Nuova funzione `_customAutocomplete(inputId, getList)`: rimuove l'attributo
`list` dall'input, crea un menu a tendina nostro (div assoluto sotto il campo,
stile navy scuro coerente col resto), filtrato in tempo reale mentre si scrive,
righe compatte e toccabili (12px padding, non le righe enormi native), chiusura
al tap fuori. Applicata a **Trasportatore, Partenza, Arrivo, Prodotto** nel form
mobile "Nuovo Viaggio" (`_setupCustomAutocompletes()`, chiamata in init dopo
`loadTransportersList()`).
**Non ancora estesa** a `editTrasportatore` (modale di modifica mobile) né a
`mtTrasp`/campi riga Multi-Tratta — usano ancora il datalist nativo, stesso
problema lì se Fil lo segnala di nuovo.

## Novità v43 (non reimplementare) — redesign completo vista PC, tema navy scuro

Grosso lavoro su richiesta esplicita di Fil ("modifica al 100%, 360 gradi"), dopo
molte iterazioni di mockup approvate una per una. Tema G (chiaro) **sostituito** da
un tema navy scuro premium per la vista PC, con gli stessi accorgimenti anti-alone
già validati sul tema scuro mobile (v27): navy non nerissimo, testo bianco caldo
non puro, niente neon.

**Variabili CSS** (`.desktop-view-active`): `--bg:#0f1420`, `--primary:#1a2540`
(header/modali condivisi), `--secondary:#242b3d` (righe/card), `--text:#e4e8f0`,
`--accent:#e8623f` (arancio "F3", meno acceso dell'originale `#ff6b35` — scelto tra
5 varianti). Colori `--t-*` (trasportatori) e `_locationCodeColorPC()` (Fornitore/
Cliente) schiariti/vivacizzati per leggersi bene su sfondo scuro invece che chiaro.

**Righe tabella → schede**: `border-collapse:separate` + `border-spacing:0 8px` +
angoli arrotondati su primo/ultimo `<td>` di ogni riga (non `.day-sep-row`) +
`box-shadow`. Bordo laterale ora indica **stato** (ambra se "da confermare", non
più il colore trasportatore — quello ha la sua pillola dedicata). Hover riga
schiarisce leggermente lo sfondo.

**Trasportatore**: da testo colorato su input chiaro a **pillola piena colorata**
editabile (sfondo = colore identità, testo quasi nero per contrasto uniforme su
tutti i colori).

**Fornitore/Cliente**: mantenuta struttura approvata (didascalia scura + nome come
pillola colorata piena, "E1"), ricolorata per sfondo scuro. Località: bianco caldo
(partenza) / verde chiaro `#7fd6ac` (arrivo, era verde scuro illeggibile su navy).

**Stato/Azioni → "G3"**: bordo laterale della riga = stato (niente più badge
sempre visibile), duplica/elimina (icone `⧉`/`🗑`) opacità 0.35 a riposo → 1 al
hover (classe `.pc-row-actions`, regola in `.desktop-view-active`). **"Aggiungi
nota" rimossa su richiesta di Fil** — `desktopEditNote(idx)` ora è irraggiungibile
da PC (nessun bottone la chiama più); le note restano modificabili solo da mobile.

**Indicatore OGGI**: badge "● OGGI" sotto la data nelle righe del giorno corrente.

**Separatori giorno**: ricolorati da pastello chiaro a tinte scure trasparenti con
testo brillante (stessa logica di http Tema G capovolta).

**Toolbar**: ricolorata in navy (sostituzione in blocco `rgba(16,32,64,` →
`rgba(255,255,255,` nell'area toolbar, più hex puntuali). Aggiunta nuova fascia
("Riga 1b") con **numeri grandi** (viaggi totali, da confermare) e **riepilogo
trasportatori** come pillole piene — sostituisce il vecchio blocco "mini totali
inline" che era la causa ESATTA del problema originale di Fil ("i trasportatori
sopra Corrente/Prossima/Oggi, non si capisce niente") — rimosso.

**Pulsanti con icona a cerchietto** (stile scelto da Fil): Salva, Carica, Excel,
Stampa, Stats, Archivio, Database — stesso linguaggio visivo, ognuno con colore
identità proprio, testo sempre presente accanto all'icona (mai solo icona nuda).

**Due bug reali trovati e corretti durante il lavoro** (non richiesti, scoperti
controllando il codice):
1. Le funzioni che aggiornano lo stato del pulsante Salva durante il salvataggio
   (`updateDriveBtns`, `driveSave`) usavano `.textContent =`, che avrebbe cancellato
   la nuova icona a cerchietto ad ogni salvataggio. Cambiate in `.innerHTML =` con
   lo stesso markup dell'icona, in tutti e 5 i punti dove succedeva.
2. **I pulsanti Database e Archivio (aggiunti in v29/v30) non sono mai stati
   davvero raggiungibili dalla vista PC**: vivevano dentro `#pcViewSwitcher`
   (`.pc-view-switcher`), una barra che si nasconde con `display:none !important`
   proprio quando `.desktop-view-active` è attivo — cioè esattamente quando sei
   nella tabella PC vera. Spostati dentro la toolbar reale di `renderDesktopView()`,
   accanto a Stats, con lo stesso stile a cerchietto.

**Pulizia variabili morte** trovate durante il lavoro: `colorClass`, `isConf`,
`inpStyle`/`inpFocus`/`inpBlur` (dentro `tripRow`), `dayBg`/`rowBg` (idem) — tutte
dichiarate ma non più usate dopo il redesign, rimosse.

**Non ancora fatto**: "Prossima settimana" resta come terzo tab alla pari di
Corrente/Oggi nel toggle principale — nei mockup era stata spostata a link
secondario ma non ho ancora portato questo pezzo specifico nel codice reale, per
limiti di tempo in questa sessione. Segnare come prossimo passo se richiesto.

Verifiche fatte a fine lavoro: `node --check` su tutti i blocchi script, funzioni
duplicate, `onclick` orfani, `getElementById` verso ID inesistenti, bilanciamento
tag HTML e parentesi CSS — tutto pulito.

## Novità v42 (non reimplementare)

**Gerarchia Fornitore/Cliente invertita ("opzione E1")** — su feedback di Fil: nella
v41/v40 l'etichetta "FORNITORE"/"CLIENTE" (il ruolo) era più in evidenza del nome
vero (Assofrutti, Poggio, CAI-BF), rendendo il nome "poco riconoscibile a colpo
d'occhio". Invertito:
- "Fornitore"/"Cliente" ora è una didascalia piccola e scura (`#506080`, non più
  pillola bianca su blu/arancio) sopra al nome.
- Il **nome** (fromCode/toCode, es. "ASSOFRUTTI") è ora la pillola piena colorata
  (`background:` invece di `color:`, usando `_locationCodeColorPC(...).bd` come
  sfondo, testo bianco) — è lui il protagonista ora, coerente con come i
  trasportatori sono già identificati nell'app.
- Troncatura (`_pcShortName(..., 11)`) e tooltip (`title`) sul nome invariati.

## Novità v41 (non reimplementare)

Le 3 migliorie proposte dopo v40, tutte fatte:
1. **Troncatura intelligente sui codici Fornitore/Cliente** — stessa logica di
   `_pcShortName` già usata per Località, ora anche su `fromCode`/`toCode` (soglia
   11 invece di 16, box più stretto). "POGGIO DEL FARRO" → "POGGIO". Nome completo
   sempre disponibile via `title` al passaggio del mouse.
2. **Divisore verticale colorato** — da grigio piatto (`#c8d2e0`, 1px) a tinta
   abbinata alla pillola: blu per Fornitore (`rgba(74,110,212,0.35)`), arancio per
   Cliente (`rgba(200,80,26,0.35)`), 2px.
3. **Bilanciamento colonne** — colonna Data era rimasta piccola (12px) rispetto a
   Trasportatore/Località (15px) e Prodotto (14px): portata a 14px, larghezza
   corretta da 90px a 100px (non coincideva più con la mappa `widths`).

Controllo completo del codice dopo le modifiche: `node --check` su tutti i blocchi
script, funzioni duplicate, `onclick` orfani, `getElementById` verso ID inesistenti,
bilanciamento tag HTML e parentesi CSS — tutto pulito (l'unico "sbilanciamento"
segnalato dall'audit su `<input>` è un falso positivo: sono tag che si autochiudono,
non serve `</input>`).

## Novità v40 (non reimplementare)

**Celle Fornitore/Cliente/Località in tabella PC ingrandite** — Fil: "non si vedono
proprio". Aumentati: pillola Fornitore/Cliente (font 8→10px, padding), testo codice
sotto la pillola (10→12px), etichetta "Località" (8→10px, colore da `#8090a8` chiaro
a `#384860` scuro — era illeggibile). Input località 14→15px. Colonne
partenza/arrivo 190px→220px, tabella min-width 1150→1210px, box max-width interno
78→92px per fare spazio ai codici cliente più lunghi.

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

## Backlog (prossime sessioni) — ⚠️ integrato nella ROADMAP in cima al file

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
- `desktop` — tabella PC (tema navy scuro v43)
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
- `silentDriveInit()` (v53) — riconnessione Drive silenziosa vera all'avvio, poi lancia `driveSmartSync()`
- `driveSmartSync()` — scarica se Drive è più recente, altrimenti salva (esisteva da prima, collegata solo in v53)
- `_mergeTripArrays(local, drive)`, `_tripMergeKey(t)` (v53) — merge anti-sovrascrittura per il salvataggio silenzioso
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

### Ricerca (v74 — modulo `srch.js`, inserito prima di `// v69: icone linea…`)
- Corrispondenza: `_srchNorm`, `_srchTypedMatch(t,kind,q)`, `_srchGenMatch(t,q)`, `_srchCriteria()`, `_srchTripPass(t,c)`, `_srchDayOk(t)`
- UI: `srchToggleTypeMenu`, `srchSetKind`, `srchTypedInput`, `srchClearTyped`, `srchLensOpen/Input/Clear/Key`, `srchSetScope`, `_srchChipsHtml`, `srchAfterRender`, `_srchCaptureFocus`, `_srchSyncMobileUI`
- Storico: `_srchCollect(c)`, `_srchRenderPanel`, `_srchCardHtml`, `srchGoToResult`, `srchOpenWeek`
- Export: `srchOpenExportDialog`, `srchDoExport`, `_srchFileName`

### Vista PC
- `pcSetWeek(mode)` — corrente / prossima / oggi
- `desktopSetField(idx, field, val)`, `desktopDel(idx)`
- `desktopDup(idx, btnEl)` (v56) — apre popover scelta giorni, NON duplica più subito;
  `_pcDupToggleDay`, `_pcDupConfirm`, `_pcDupCancel`, `_isoDate(d)`
- `desktopToggleConf(idx)` — conferma (imposta `daConfermare=false`) + flash verde
- `desktopSetPending(idx)` (v54) — direzione opposta: marca "da confermare" un viaggio già in lista
- `_desktopRebuildStatoCell(idx)` (v55) — unica fonte di verità per la cella Stato (flag + icona nota + azioni); usata da `desktopToggleConf` e `desktopSetPending`, non ricostruire quella cella a mano altrove
- `desktopToggleNotePopover(idx, btnEl)` (v55) — popover nota, vedi Novità v53–v56
- `desktopToggleConfermato(idx)` — ⚠️ CODICE MORTO, non collegata a nulla (vedi Roadmap 5b)
- `desktopAddEmpty()`, `desktopGetNextWeekday(dayName)` (fix v24)
- `desktopConfirmAdd()`, `desktopCloseAddModal()`
- **Rubrica (v58)**: `pcToggleRubrica()`, `pcRubricaSetTab(tab)`, `pcRubricaSelectEntity(key)`,
  `_pcRubricaRender()`, `_pcRubricaGroups(tab)`, `_pcRubricaColor(tab, key)`,
  `_pcRubricaDetailHtml(tab, key, col)`, `_pcRubricaCode(locText)`, `_pcRubricaWeekTrips()`

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
- `downloadExcel()` / `downloadExcelFiltered()` — entry point, chiamano sempre `_buildAndDownloadExcel(tripsData, title, filenameSuffix)`
- `_buildAndDownloadExcel()` — foglio unico "Planning" (v46, vedi Novità v46–v47)
- `_transporterColorPC(name)`, `_toHex6(c)`, `_xlsWriteLoc(wr, colIdx, locText, bg, inkArgb)` — helper Excel v46

### Archivio
- `renderArchive()`, `loadArchive()`, `saveArchive()`
- `toggleArchiveExpanded()` (v46) — espande/collassa `#archiveList`, stato in `localStorage.archiveExpandedUI`
- `archiveDownloadExcel(idx)`, `archiveRestore(idx)`, `archiveDelete(idx)`

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
6. Colori trasportatori e clienti nella vista PC seguono il tema navy scuro (v43+); il Tema G chiaro (v25) è storico
7. **`_commitEditForm()` (modale "✏️ Modifica Viaggio") ricostruisce l'intero
   oggetto viaggio da zero** — ogni campo non esposto nel form (es. `confermato`,
   `ddt`) va riportato a mano dal viaggio originale prima di sovrascrivere, o si
   perde silenziosamente ad ogni modifica (bug reale trovato e corretto in v47)
8. `_buildAndDownloadExcel()` e i suoi helper (`_transporterColorPC`, `_xlsWriteLoc`,
   ecc.) usano `const`/`let`/arrow functions — NON rispettano i Vincoli Android
   sotto, ma è la convenzione già presente in quella funzione, non toccare
9. Prima di dichiarare finita una richiesta di redesign export/UI: verificare che
   sia stata *effettivamente* portata nella funzione reale e non solo in un
   mockup esterno (successo con l'Excel in v46 — vedi Novità v46–v47)
10. Popup/modali PC: palette scura (card `#0f1220`, campi `rgba(255,255,255,0.05)`, bordi
    `rgba(255,255,255,0.12)`). Mai `var(--text)` su sfondo chiaro (testo invisibile, bug v52).
    Dopo ogni impostazione via codice di un checkbox-toggle nascosto, richiamare la sua `_sync…UI()`
11. **La riga della tabella PC (`renderDesktopView`) e il suo `<thead>` devono avere
    LO STESSO NUMERO di celle** — in v54 non era così (mancava il `<td>` Note) e la
    tabella scivolava di una colonna. Se si aggiunge/toglie una colonna, aggiornare
    ANCHE gli indici `td:nth-child(N)` usati altrove per aggiornare quella cella al volo
    (oggi: `nth-child(7)` = cella Stato, cambiato due volte già, v54→v55 — se si tocca
    ancora questa tabella, ricontare prima di riusare quell'indice a memoria)
12. Residui di Tema G chiaro non ancora sistemati (vedi Roadmap punto 4): `<thead>` della
    tabella PC (`#c0cad8`) e `#pcArchiveModal` (`#dde4ec`) — confermato ancora presenti
    a fine v56, non toccati in questa sessione
13. Pattern popover leggero (v55/v56, vedi Novità v53–v56): `position:fixed`, ancorato
    con `getBoundingClientRect()`, chiusura su click-fuori/Esc. Riusarlo per qualsiasi
    altro popover in tabella PC invece di inventarne uno nuovo
