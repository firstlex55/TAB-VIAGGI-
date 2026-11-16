# APP VIAGGI — PROJECT.md
> **Aggiornato: 16/11/2026 · Versione consegnata: v112** (file `index.html`, 19.773 righe, ~1,29 MB, `APP_VERSION = 'v112'`).
> Ultime tre versioni: **v112** = PC: menu ⋯ → pannello «Strumenti» + «Nuovi viaggi»: 7 ritocchi e avviso/elenco dopo «Aggiungi» · **v111** = PC: «Nuovi viaggi» ridisegnato (variante C+) · **v110** = PC: menu «Vista», Tabellone (da → a), «Esporta» premium.
> Nessun lavoro a metà: la v112 è finita, testata e consegnata (index.html + 8 anteprime + questo file). Nessuna richiesta di Fil aperta.

**Come è organizzato questo file**: **1 Ripartenza** (tutto ciò che serve per riprendere in una chat nuova) · **2 Roadmap** (cosa resta da fare, in ordine) · **3 Indice delle versioni** · **4 Attenzioni critiche** · **5 Novità per versione** (il diario di ogni versione, dalla più nuova alla più vecchia: cercare `## Novità v108` ecc.) · **6 Riferimento** (funzioni principali) · **7 Appendici storiche** (vecchia roadmap, vecchie liste «da verificare», palette Tema G: NON più valide, tenute solo per la cronologia).

---

# 1 · RIPARTENZA — leggere questa parte per prima

## 1.1 Che cos'è
- **App Viaggi** — planning settimanale della logistica per **Pro Trasporti Srl** (Fil = Filippo Carlotti). Un solo file `index.html` (HTML/CSS/JS senza librerie, tranne ExcelJS e Google Sign-In caricati da rete), pubblicato su **GitHub Pages**: `firstlex55.github.io/TAB-VIAGGI-`. Accanto a `index.html` nel repository ci sono `sw.js` (service worker, cache `viaggi-app-v90`, chiede sempre la rete per prima), `manifest.json` e `logo.png`.
- **Uso reale**: Fil inserisce i viaggi della settimana (da PC e da telefono Android/Oppo), poi manda ai trasportatori una mail con testo sempre uguale (generata dall'app: «Mail», «Invia ▾», «Mail della settimana»), stampa/esporta il planning (Stampa/PDF, Excel, Esporta A4/A3), archivia la settimana.
- **Dati**: stanno nel browser (`localStorage`) e, se Fil collega Google Drive, anche in un file nell'area nascosta dell'app su Drive (unione automatica tra dispositivi, vedi §1.6).

## 1.2 Come si consegna e si aggiorna (Fil NON deve mai modificare il codice a mano)
1. Claude consegna **un solo file pronto: `index.html`** (dalla v110 si chiama sempre così; prima era `app_viaggi_vN.html`) + il `PROJECT.md` aggiornato.
2. Fil carica **solo `index.html`** nel repository GitHub (`sw.js`, `manifest.json`, `logo.png` non cambiano, salvo avviso esplicito).
3. Sul PC: **⋯ → «Aggiorna app»** (`pcForceUpdate`), poi controllare in fondo al pannello «Strumenti» il chip **«App Viaggi v112»**. Se resta la versione vecchia: Ctrl+F5. Sul telefono: chiudere e riaprire l'app (se serve, svuotare la cache del sito).
4. Se qualcosa va storto: i file vecchi `app_viaggi_vNN.html` (v46–v109) sono tutti nella cartella consegne; `app_viaggi_v58_backup.html` è il punto di ripristino pre-«grigetto».

## 1.3 Come lavora Claude su questo progetto (flusso collaudato)
1. **Prima di costruire una grafica importante**: preparare **anteprime con dati veri** (una settimana reale, PNG nella cartella consegne `anteprime_vNNN/`), far scegliere a Fil, solo dopo costruire nell'app. Fil lo ha chiesto esplicitamente. Un'anteprima senza dati veri non serve.
2. **Patch con script, mai a mano**: `applyNNN.py` parte dal file della versione precedente, applica sostituzioni con `rep()`/`between()` che si fermano (assert) se il testo da sostituire non è ESATTAMENTE una volta, legge i blocchi di codice da `parts/*.txt`, scrive `vNNN/index.html` e alza `APP_VERSION`. Dopo una sostituzione controllare che il nuovo testo non ripeta il prefisso (errore reale v96: `_escH_escH`).
3. **Controlli obbligatori prima di consegnare**: `sh lintcheck.sh <percorso ASSOLUTO>` (atteso: «lint ok (solo ClipboardItem noto)»; con percorso relativo dà errore) → sintassi di tutti i blocchi script + variabili non definite. Poi i test Playwright (`harness.js` → `openApp({view,viewport,seed,ls,fakeNow,wait,dsf,touch})`; si lanciano con `APP=<file> node sXX.js` dalla cartella test) e la **batteria** `runall112.sh` → `battery112.log`.
4. **Regole dei test**: mai due Playwright insieme; un comando in primo piano dura al massimo 600 s (le batterie lunghe vanno in background con controllo periodico). Rossi **noti e non legati ai lavori recenti**: `s23` («1–50 di 1684», vecchio); `th5`, `th11`, `s27` a volte vanno in timeout/rosso SOLO dentro la batteria ma da soli sono verdi (rilanciare da soli prima di preoccuparsi). Batteria v112: tutta verde con quelle eccezioni; `s40` = 98 controlli, `s39` = 173, `s38` = 93, `s37` = 70.
5. **Se la cartella di lavoro della sandbox non c'è più** (`/home/claude/v111`, `/home/claude/t`, script e parti): è normale in una chat nuova. Si riparte da `index.html` + questo file caricati da Fil; si lavora con patch assertive sul file e si riscrivono solo i test che servono (il vecchio `harness.js` è facile da rifare: Chromium via Playwright, viewport, localStorage pre-caricato, orologio finto).
6. **Comunicazione**: Fil scrive a voce (voice-to-text, italiano, a volte con errori di trascrizione): interpretare il senso. Vuole **aggiornamenti brevi e frequenti in italiano** mentre si lavora, e a fine lavoro poche righe («cosa è uscito», file consegnato, un solo passo successivo). Quando non è chiaro cosa intende, mostrare 2–3 varianti con dati veri invece di chiedere a parole.
7. **Token**: quando la chat si avvicina al limite avvisare: «⚠️ Token in esaurimento — conviene aprire una nuova conversazione e ricaricare il PROJECT.md + file HTML corrente.»

## 1.4 Fil e le sue preferenze (decise nel tempo, non rimetterle in discussione)
- **È astigmatico**: il fastidio viene dal **contrasto troppo netto** (nero pieno su bianco pieno, testo bianco puro su nero puro, colori neon), non da chiaro vs scuro in sé. Toni «grigetti»/smorzati in entrambi i temi; **sceglie lui chiaro/scuro** e i livelli di luminosità e contrasto a tacche (v78, v98). Ogni colore nuovo va provato con `contrast_lib.js` (testo ≥ 4,5 su sfondo; pulsanti ≥ 36 px di altezza nei test).
- **Voce (dettatura nell'app): RIMOSSA del tutto, non reimplementare.**
- **Nomi nel codice pubblico**: il repository è pubblico. **Nessun nome di cliente, fornitore o impianto nel codice, nei commenti, nei test di esempio** (test `s26` e `s32` lo controllano). I **nomi dei trasportatori possono restare** (decisione 07/11: colori fissi per nome, `getTransporterKey` e CSS `--t-*` non si toccano). La cronologia di GitHub conserva ancora le versioni vecchie con i nomi: per toglierle servirebbe cancellare e ricreare il repository con lo stesso nome — **rinviato, decide Fil**.
- **Nessun cambio di hosting** (niente GitHub Pro, niente Cloudflare): soluzioni gratuite e poco invasive.
- **Colori**: ogni fornitore e ogni cliente hanno sempre lo stesso colore in tutta l'app (stesso slot `vcN` in Schede, Excel, Colonne, Tabellone, stampa).
- **Vista PC**: gli piace la vista a **Schede**; la vista a celle tipo Excel non lo convince (c'è ma non è la sua preferita). Ha chiesto e ottenuto Colonne e Tabellone (da → a). «Chi va dove» deve vedersi subito.
- **Tonnellate per viaggio**: accantonate (servirebbe l'integrazione con le bolle).
- **Tre cose scartate da lui, NON riproporre**: località a 20 px / «non tutta maiuscola» (v106), prodotto con pillola colorata (v106), icone SVG al posto delle emoji in giro per l'app (non portate).

## 1.5 Vincoli di codice
- **Android**: Fil usa un Oppo. Il **codice nuovo è ES5**: solo `var`, `function`, niente arrow function `=>`, niente template literal con backtick, niente `let`/`const` a livello globale, niente spread `...`, niente shorthand degli oggetti, niente `Array.from`. Eccezioni già presenti e da non prendere a modello: `_buildAndDownloadExcel` e i suoi helper (usano `const`/`let`/arrow), le funzioni Drive (`async`/template) e molto del vecchio rendering PC.
- Il codice nuovo **non deve stare** dentro il blocco protetto `_CODE_PAL … // Badge HTML` (il test `s32` lo confronta con la v103): il JS nuovo va **prima di `renderDesktopView`**; il CSS nuovo prima del commento «v104 — Look "P2"» (se solo-schermo) o in blocchi `<style>` propri.
- Il codice che gira all'avvio può eseguirsi **prima** delle `var` scritte più sotto (hoisting): proteggere con guardie (es. `if(!_BD_Z) return` in `_bdApply`).
- **Colori e temi**: tutto passa dalle variabili CSS del sistema chiaro/scuro (v78+: `--text`, `--text-soft`, `--bg`, `--shade-rgb`, `--nw-*`…). Mai colori fissi chiari dentro un popup scuro né il contrario; ogni schermata nuova va provata in **chiaro e scuro** e con i 3 livelli di contrasto. Stampa ed Excel restano chiari (foglio bianco, stampa-safe).

## 1.6 Architettura dati (verificata nel codice il 16/11/2026)
**localStorage**: `viaggiLogistica` (viaggi settimana corrente) · `viaggiLogisticaNext` (settimana prossima) · `weekArchive` (settimane archiviate) · `weekTitle` · `transportersList`, `partenzaList`, `arrivoList`, `prodottiList` (elenchi unici dal v30; `learnedPartenze/Arrivi/Prodotti/Trasportatori` sono solo legacy, caricati una volta) · `tripTombs` (lapidi delle cancellazioni) · `tripSigMap` (ultimo stato noto per generare le lapidi) · `listMeta` (voci degli elenchi tolte/aggiunte a mano, v97) · `preferredView`, `savedAt`, `driveConnected`, `archiveExpandedUI` · preferenze PC: `pcDensMode`, `pcDensCards`, `pcDensExcel`, `pcDensBoard`, `pcTabComp`, `nwrCmp` (+ tema/livelli, vedi v78/v98).

**Oggetto viaggio**: `{ id, ts, data, trasportatore, partenza, arrivo, prodotto, note, ddt, daConfermare, confermato }`. `partenza`/`arrivo` includono il codice: `"Località (CODICE)"`. `daConfermare` è **per singolo viaggio** (v99/v111). `id` e `ts` li assegna da solo `_stampTrips()` dentro `saveToLocalStorage()`: nessun punto di modifica deve occuparsene.
⚠ **`_commitEditForm()`** (modale «Modifica viaggio» del telefono) ricostruisce l'intero viaggio dai campi del form: ogni campo non mostrato nel form (`confermato`, `ddt`, `id`, `ts`…) va RIPRESO dal viaggio originale, o si perde in silenzio (bug reale v47).

**Salvataggio e sync (v67, unico)**: cancellazioni = lapidi; `_mergeState` unisce per `id` (vince `ts` maggiore, la lapide con `ts` ≥ elimina); `_runSync(forceWrite)` → `_driveSyncCore` legge Drive, unisce, applica alla UI (rimandato se Fil sta scrivendo in un campo), scrive se serve; una sync alla volta, debounce 1,5 s, retry 15 s, 401 → `silentDriveInit(true)`; «Carica» **unisce**, non sovrascrive. Il guardiano ogni 1,5 s salva i cambi senza riordinare (per non spostare gli indici della tabella PC); pull ogni 45 s, al ritorno sull'app, su `online`; flush quando la pagina si nasconde. Il permesso Google dura ~1 ora e si rinnova con un tocco (v84, pastiglia «Drive» nella barra PC).
**Payload su Drive** (`_driveWriteData`): `trips`, `weekTitle`, `weekArchive`, `tombs`, `lists`, `listMeta` (v97: gli elenchi si UNISCONO, mai perdere una voce; vince l'ultima azione manuale), `v:2`, `savedAt`.
⚠ **NON sincronizzata: la settimana prossima (`viaggiLogisticaNext`, variabile `tripsNext`).** Il payload non la contiene (verificato il 16/11). Oggi «Nuovi viaggi» può aggiungere decine di viaggi alla settimana prossima: restano **solo su quel dispositivo/browser** finché non diventano settimana corrente. Rischio di perdita (cache cancellata, altro dispositivo). → vedi Roadmap A2.

## 1.7 Mappa dell'app oggi (dettagli nelle sezioni «Novità» indicate)
**Viste** (`switchView`): *Rapida* `compact` (predefinita su telefono) · *Oggi* `oggi` · *Trasp.* `medium` · *PC* `desktop` (≥ ~1000 px di larghezza, barra comandi `#pcBarStyle`, classi `.pcb*`). `next` e `card` esistono ancora nel codice ma **senza pulsante** (la vista «Prossima» è stata tolta in v65): **dal PC la settimana prossima non si può guardare** (`_pcWeekMode==='next'` c'è, manca il selettore) → Roadmap B1.
**Vista PC** — menu **«Vista»** (`#pcViewBtn`): *Schede* (la preferita; 7 livelli di dimensione, look «P2» v104) · *Colonne* (v109: una colonna per giorno, per fornitore, zoom, evidenzia, modifica, Esporta A4/A3) · *Tabellone* e *Tabellone compatto* (v110: fornitore → cliente) · *Excel* (celle). Barra: Rubrica (v58–v61), Settimana/Oggi, ricerca generale + filtro per tipo (v74), «Nuovi viaggi», Multi-tratta, Salva/Carica, Excel, pulsante **Mail** (`#pcMailProgBtn`), pastiglia **Drive**, menu **⋯ «Strumenti»** (v112: Stampa/PDF, Nuova settimana, Archivio viaggi, Settimane archiviate, Nomi e luoghi, Aggiorna app).
**«Nuovi viaggi»** (v99 → v112): schermata unica per PC (tutta pagina, ≥ 1000 px, `_nwrIsPC`: elenco tratte a sinistra, «tratta scelta» con 5 giorni + elenco per giorno a destra, Confermato/Da confermare per singolo viaggio, avviso e «Vedi l'elenco» dopo «Aggiungi») e per telefono (corsie, «Aggiungi tratta» con ricerca). Entrate: `nwrOpen`, tasto N, `toggleAddForm`, `openMultiTratta`, `desktopAddEmpty`, `duplicateTrip`, `tapOpen`. Un solo punto di scrittura: `nwrConfirm()` → `_nwrCommit(newTrips, toNext)`.
**Telefono**: testata «Compatta» e giorni azzurri (v105), Salva/Carica nell'header (v80), strumenti colorati (5, tra cui «Stampa / PDF»), swipe-elimina con conferma e «Annulla» 7 s (v68), «Rotte frequenti», «A tocchi», «Un altro uguale» (v96), «Modifica viaggio» (v83).
**Archivio**: *Archivio viaggi* = cruscotto con ricerca, filtri mese/trimestre/anno, totali, export Excel (v94, richiamabile con `arcOpen()`); *Settimane archiviate* = elenco delle settimane (`openPcArchive`); *Nuova settimana* = `showNewWeekModalV2()` (contiene «Parti dalla settimana scorsa», `nwv2CopyPrev`).
**Mail**: «Invia ▾» accanto alla ricerca (v89), «Mail della settimana» (v91–v93), mail di integrazione per i soli viaggi aggiunti dopo l'invio (v101); testo standard di Fil, tratta in grassetto sottolineato (v90).
**Stampa/Excel**: «Stampa / PDF» (`window.printPlanning`, `_xpPrintHtml`) ed Excel (`_buildAndDownloadExcel`) escono «come la vista PC», 1 pagina A4 orizzontale (v107); «Esporta» di Colonne/Tabellone: A4/A3, orizzontale/verticale, adatta a 1 pagina o a tutta larghezza (v110).

## 1.8 Cose che NON ho potuto provare (servono gli occhi di Fil sui dati veri)
Tutto è stato provato in Chromium con dati finti (e Drive/Excel/Google finti). Da controllare quando Fil ha tempo, in ordine di importanza:
1. **v112 sul suo PC**: il menu ⋯ «Strumenti» (titoli in MAIUSCOLO, leggibilità, contrasto) e, dopo «Aggiungi» con molti viaggi, l'avviso «N viaggi aggiunti…» e il pulsante «Vedi l'elenco». Fil non ha ancora detto di averla provata.
2. **Drive vero**: sincronizzazione tra PC e telefono con il vero Google (v67, v84, v97 sono provate solo con Drive finto): aprire da un dispositivo, modificare, controllare sull'altro; pastiglia «Drive» verde dopo un'ora di lavoro; elenchi (Nomi e luoghi) che arrivano sul secondo dispositivo.
3. **Excel vero e stampa dal telefono** (v107): visualizzatore Oppo + stampante Brother, 1 pagina? colori come la vista PC? Mai provati con l'hardware vero. In Chromium con LibreOffice: 1 pagina.
4. **Stampa A4/A3 con stampante vera** di «Esporta» (Colonne/Tabellone, v109–v110).
5. **«Nuovi viaggi» PC con una settimana vera** (nomi lunghi, 50+ viaggi) e col font Outfit vero (nei test è il font di ripiego, più largo).
6. **Colori v104**: quali codici prendono la tinta dipende dai dati di Fil (primi 6 per ruolo con ≥ 2 viaggi). Chiedergli se i colori «giusti» sono quelli che si aspetta; se il nome del trasportatore in tema chiaro (contrasto ~3,0–3,6, il più basso CONSAR) si legge male: scurire `--k4-pa/--k4-pb` del tema chiaro.
7. **Installazione come app su Android/Oppo** (PWA): Fil non ha mai riferito il risultato. Barra di stato iPhone in tema chiaro (solo se mai usasse iPhone).
8. **Mail**: cosa apre `mailto:` sul suo PC (programma di posta non noto: «altra posta / non so»); testo oltre ~1800 caratteri → si apre con il solo oggetto, il testo resta copiato negli appunti.
9. L'elenco completo e storico delle prove mancanti per versione è nell'**Appendice A**.

---

# 2 · ROADMAP — cosa resta da fare (stato al 16/11/2026)

> Legenda: ⏳ aspetta una decisione/un sì di Fil · 💡 idea proposta, non chiesta · 🔧 lavoro tecnico · ✅ chiuso (non rifare).

## A · Da ricordare a Fil / decisioni sue
1. ⏳ **Sincronizzazione Drive senza premere Salva/Carica** (Fil: «ricordamelo più avanti»). La sync automatica c'è già; il blocco è il permesso Google da 1 ora che non si rinnova senza un tocco. Due strade proposte: **(1)** ponte *Google Apps Script* senza login (configurazione una tantum + parola chiave per dispositivo — consigliata); **(2)** tenere il login e mettere un solo pulsante «Collega Drive» all'apertura. Fil non ha scelto.
2. 🔧⏳ **Settimana prossima non sincronizzata** (vedi §1.6): proporre di aggiungere `tripsNext` al payload di Drive con la stessa unione per `id`/`ts`/lapidi, oppure di mostrare un avviso. Da chiedere a Fil se vuole la sincronizzazione anche della prossima settimana. È la cosa a rischio dati più concreta oggi.
3. ⏳ **Risultato dell'installazione Android/Oppo** e prova dell'Excel/stampa dal telefono (§1.8 punti 3 e 7).
4. ⏳ **Cronologia GitHub con i nomi vecchi**: cancellare e ricreare il repository (stesso nome: URL, app installata e dati restano; Pages va riattivato, sito giù qualche minuto) o lasciare. Rinviata a Fil.

## B · Idee non fatte, aspettano il sì di Fil (in ordine di valore secondo me)
1. 💡 **Selettore «Prossima settimana» sulla barra PC** — oggi, dopo aver aggiunto viaggi alla prossima, dal PC non si possono rivedere se non nell'elenco «Appena aggiunti» (v112). Il resto del codice c'è già (`_pcWeekMode`, `renderNextView`); manca il pulsante e la verifica di tutte le viste (Schede/Colonne/Tabellone/Excel) con la settimana prossima.
2. 💡 **Annulla/backup prima delle azioni distruttive**: `clearData()` («Cancella tutti i dati») si ferma a un `confirm()`; manca un backup automatico in localStorage (e/o toast «Annulla») prima di «Cancella tutti i dati», import che sostituisce tutto, «Nuova settimana» che archivia. Il toast «Annulla» esiste già per la cancellazione di un viaggio (v68) e per «Tratta tolta» (v111).
3. 💡 **Bozza automatica di «Nuovi viaggi»**: oggi se si chiude per sbaglio si perde tutto (lo stato `_nwr` è solo in memoria).
4. 💡 **Scorciatoie da tastiera** in «Nuovi viaggi» (Invio nella ricerca = prima tratta, 1–5 = giorno).
5. 💡 Collegare «**Parti dalla settimana scorsa**» (`nwv2CopyPrev`, oggi dentro «Nuova settimana») a «Nuovi viaggi».
6. 💡 **Trascinare un viaggio da un giorno all'altro** (Colonne/Tabellone).
7. 💡 **Totali per cliente** (riepilogo a fondo pagina).
8. 💡 **Avviso se si inserisce due volte lo stesso DDT** (la ricerca per DDT c'è dalla v74).
9. 💡 Idee vecchie mai approvate: «OGGI» in evidenza nella fascia giorno (in Colonne e Tabellone c'è già la pillola OGGI), azioni di riga solo al passaggio del mouse, statistiche multi-settimana con grafico (in parte coperte dal cruscotto Archivio viaggi, v94), PIN/password lato client con hash.

## C · Debito tecnico
1. 🔧 `desktopToggleConfermato()` è **codice morto** (non collegato a nessun pulsante, cerca un `[data-conf-cell]` che non esiste più). Oggi la tabella PC ha solo «da confermare» / normale. Togliere la funzione (a meno che Fil voglia un terzo stato «Confermato» verde in tabella).
2. 🔧 **Spezzare `index.html`** (19.773 righe, ~1,29 MB) in più file: più economico e meno rischioso da modificare, ma da testare bene su GitHub Pages e Android. Solo a fine lavori; richiede cambiare anche `sw.js`.
3. 🔧 Il file è molto grande: ogni patch deve restare assertiva (`rep`/`between` che si fermano se il testo non è unico).
4. 🔧 `s23` rosso noto («1684») da sistemare o togliere; `th5/th11/s27` instabili dentro la batteria.
5. 🔧 Eventuale pulizia dei vecchi file di test `*_vNN_old.js` e dei vecchi `app_viaggi_vNN.html`.

## D · Chiuso — NON rifare
- ✅ **Un solo punto di salvataggio** e **id univoco per viaggio**: fatti in **v67** (id+ts+lapidi, sync unica con guardiano). Le vecchie voci «Priorità alta 1 e 2» dell'Appendice A sono superate.
- ✅ **Tema «grigetto» chiaro/scuro + livelli** (v78, v98) e audit dei popup rimasti a tema fisso: chiusi. `#c0cad8` non esiste più nel codice.
- ✅ **Service worker / uso offline** (`sw.js`, v89–v90) · **Export PDF diretto** («Stampa / PDF», v107) · **ricerca per DDT** (v74) · **click su risultato dell'archivio → apre la settimana** (v74/v94) · **Rubrica** (v58–v61) · **Mail ai trasportatori** (v87–v101) · **database unico delle liste** (v30) · **nomi di clienti/impianti fuori dal codice** (v97).
- ✅ Dettatura vocale: **rimossa per scelta di Fil**.
- ✅ «Nuovi viaggi» **tutta pagina PC** (v108) → **ridisegnato** (v111) → ritocchi e riepilogo dopo «Aggiungi» (v112). Menu ⋯ → **«Strumenti»** (v112). Non rifarli senza una nuova richiesta di Fil.

---

# 3 · INDICE DELLE VERSIONI (diario completo: cercare `## Novità vNN` più sotto)

| Versione | Cosa |
|---|---|
| v112 | PC: menu ⋯ → «Strumenti» (6 voci, 3 gruppi, titoli MAIUSCOLO, senza Mail/Totali); «Nuovi viaggi»: 7 ritocchi + avviso `#nwrDone` / elenco `#nwdOv` / righe `nw-just` dopo «Aggiungi» |
| v111 | PC: «Nuovi viaggi» ridisegnato (variante C+: tratta scelta + elenco per giorno), «Da confermare» per singolo viaggio, comprimi/compatte/«già in programma» |
| v110 | PC: menu «Vista», Tabellone (da → a), località di arrivo in MAIUSCOLO, «Esporta» premium A4/A3 |
| v109 | PC: modalità «Colonne» con zoom, evidenzia, modifica, Esporta |
| v108 | PC: «Nuovi viaggi» a tutta pagina, due colonne (poi sostituita da v111) |
| v107 | Excel e Stampa «come la vista PC» (1 pagina A4); «Stampa / PDF» sul telefono |
| v106 | PC: prodotto «riquadro piatto»; telefono: «Aggiungi tratta» solo con ricerca |
| v105 | Telefono: testata «Compatta», giorni azzurri, schede più leggibili, strumenti colorati |
| v104 | PC Schede: look «P2» (riquadri Fornitore/Cliente a tasto, pillola trasportatore scura, fascia ambra «Da conf.») |
| v103 | Controllo generale del codice (correzioni piccole) |
| v102 | «Nuovi viaggi» a planner (griglia) — disegno superato, logica dati valida |
| v101 | Colori diversi per fornitori/clienti, pulsanti di riga più visibili, mail di integrazione |
| v98–v100 | Luminosità e contrasto a tacche; «Nuovi viaggi» una sola schermata PC+telefono, «Da confermare» per viaggio (disegni superati, logica valida) |
| v97 | Nomi di clienti/impianti fuori dal codice pubblico; elenchi nel file di Drive (`lists`, `listMeta`) |
| v96 | Niente pop-up «salva»; telefono: Rotte frequenti, «A tocchi», «Un altro uguale» |
| v95 | PC: giorni in MAIUSCOLO + pulsante «Invia mail programma» |
| v94 | **Archivio viaggi** (cruscotto, variante C) |
| v93 | Gradiente «Dall'alto» nel tema chiaro; trasportatore colorato nella Mail della settimana |
| v92 | Telefono: la ricerca non apre più Google (crash «pagina bianca») |
| v91 | «Mail della settimana» + testo standard di Fil |
| v89–v90 | «Invia ▾» accanto alla ricerca; aggiornamento che funziona (`sw.js`); tratta in grassetto sottolineato |
| v86–v88 | «Per tratta», «Copia testo mail», busta sui chip (superata da v89) |
| v85 | PC in finestra stretta: rotella ovunque, «Filtri ▾», pulsanti compatti |
| v84 | Collegamento Google Drive più robusto + pastiglia «Drive» |
| v82–v83 | Aggiungi viaggio PC/telefono; «già N» nei giorni; «Modifica viaggio» telefono |
| v81 | PC: Schede / Excel × 7 livelli di dimensione |
| v80 | Salva e Carica nell'header |
| v79 | Filo tra un viaggio e l'altro |
| v78 | **Tema chiaro/scuro × 3 livelli** (sistema colori) |
| v74–v77 | Ricerca generale, filtro per tipo, Storico a schede, Excel filtrato; DDT che non alza le righe; riga «da confermare» |
| v70–v73 | Excel layout «B»; bug CSS storico risolto (`}` mancante in `@media`); barra comandi PC in 3 righe; intestazione tabella scura «B» |
| v68 | Rapida: swipe-elimina con conferma e «Annulla» 7 s |
| v67 | **Salvataggio/sync unico** (`id`+`ts`+lapidi, `_mergeState`, `_runSync`) |
| v62–v66 | Pinch-zoom disattivato; barra PC ridisegnata; Rubrica a sinistra |
| v57–v61 | Popover duplica con riepilogo; **Rubrica** (dettaglio, cancellazione multipla con «Annulla») |
| v53–v56 | Sync Drive: causa reale trovata, riconnessione silenziosa; tabella PC (nota, duplica con popover) |
| v48–v52 | «Da confermare» premium; modale «Nuovo viaggio» PC scuro |
| v46–v47 | **Excel foglio unico «Planning»**; campo DDT |
| v43–v44 | Redesign completo vista PC (tema navy scuro, poi superato da v78); menu suggerimenti nostro al posto di quello del telefono |
| v27–v42 | Tema mobile scuro anti-alone (v27); controllo generale (v28); database unico delle liste (v30); rifiniture tabella PC: bordi, nomi, Archivio da PC, layout Partenza/Arrivo «C», etichette Fornitore/Cliente, separatori giorno, Excel «Viaggi», gerarchia Fornitore/Cliente (v29–v42) |
| v22–v26 | Sintesi vocale (poi **rimossa**); Tema G chiaro per la vista PC (poi sostituito) |

---

# 4 · ATTENZIONI CRITICHE (aggiornate al 16/11/2026)

1. **Mai ricostruire a mano un viaggio**: `_commitEditForm()` (vedi §1.6) e ogni altra funzione che crea/aggiorna un viaggio deve conservare `id`, `ts`, `ddt`, `confermato`, `daConfermare`.
2. **Un solo punto di scrittura per «Nuovi viaggi»**: `_nwrCommit(newTrips, toNext)`. Su PC dopo il salvataggio chiama `_nwrDoneShow` (avviso + elenco); sul telefono/altre viste `showSummaryModal` + `_scrollToTrip`. Il toast `#nwrToast` e l'avviso `#nwrDone` sono diversi.
3. **Tabellone e «Nuovi viaggi» condividono le righe**: `_tbRowHtml(t, idx, edit, xt)` con `xt = {cls, attr, tail}` facoltativo. Cambiare quella funzione tocca entrambi (e l'elenco «Appena aggiunti»).
4. **Tabella PC (Schede/Excel)**: riga e `<thead>` devono avere lo STESSO numero di celle; gli indici `td:nth-child(N)` usati per aggiornare le celle (oggi `nth-child(7)` = Stato) vanno ricontati se si tocca la tabella. La cella Stato si ricostruisce solo con `_desktopRebuildStatoCell(idx)`. Le righe del PC lavorano ancora sugli **indici** dell'array `trips`, la stabilità è data da `_stampTrips` e dal fatto che il guardiano non riordina (`saveToLocalStorage(true)`).
5. **`_pcDensApply`** può girare prima delle `var` più sotto (guardie obbligatorie). `<html data-pcmode data-pclvl>` guidano il CSS delle viste PC.
6. **Popover e overlay**: `position:fixed`, ancorati con `getBoundingClientRect()`, chiusura con clic fuori / Esc (pattern v55–v56). Overlay del menu ⋯ `#pcMoreMenu` z-index 9000; modifica Colonne `#bdEditOv` 3500. **Esc** chiude prima il livello più interno (es. i dettagli di una tratta) e poi la finestra.
7. **Chiave `window.printPlanning`** è una proprietà di `window` (riscritta in v107): chi la chiama usa `window.printPlanning()`.
8. **`updateWeekProgress()`** legge `t.data` (non `t.giorno`). `renderArchive()` è senza template literal (solo concatenazione).
9. **Excel**: nella sandbox ExcelJS è finto (il vero richiede rete). Un cambio a `_buildAndDownloadExcel`, `_xlsWriteLoc`, `_toHex6`, `_XP_T/_XP_DOT/_XP_TINK` va confrontato con una settimana vera di Fil. Prima di dichiarare finito un redesign di export/UI verificare che sia nella funzione reale e non solo nel mockup (successo con l'Excel in v46).
10. **Sostituzioni automatiche**: se il testo nuovo contiene il testo da sostituire, controllare che non ripeta il prefisso (`_escH_escH`, v96). Il lint va sempre sul file FINALE, con percorso assoluto.
11. **Tema chiaro e contrasto**: il giovedì ambra sta a 4,4 contro 4,5 richiesto, per questo in «Nuovi viaggi» il testo del giorno usa `--dd` più scuro (`color-mix`). Nuovi pulsanti ≥ 36 px di altezza (soglia dei test) tranne le righe compatte.
12. **Service worker**: se cambia `index.html` ma Fil vede la versione vecchia, è la cache: «Aggiorna app» o Ctrl+F5. `sw.js` non cambia con `index.html`.

---

# 5 · NOVITÀ PER VERSIONE (diario, dalla più nuova)
## Novità v112 — PC: menu ⋯ → pannello «Strumenti»; «Nuovi viaggi»: 7 ritocchi + avviso/elenco dopo «Aggiungi» (16/11/2026, richieste di Fil: «Non si capisce niente. Troppe cose e con simboli che non si riescono a identificare subito. Falla poi bella e premium» · «2C pannello chiaro … come gli strumenti» · titoli in maiuscolo · «Mail» e «Totali» via dal menu · «i 7 ritocchi» di «Nuovi viaggi» + riepilogo dopo «Aggiungi»)

**Menu ⋯ della barra PC** (`pcToggleMoreMenu(btn)`, id `#pcMoreMenu`; era un elenco di 8 voci tutte blu con emoji simili): ora è un **pannello centrale «Strumenti»** (variante C scelta da Fil, anteprime in `anteprime_menu_v111/`). `#pcMoreMenu` è l'**overlay** a tutto schermo (`position:fixed; inset:0; z-index:9000`, velo `rgba(var(--shade-rgb),.42)`), dentro `.pcm-pn` (`role="dialog"`, `aria-modal`, larghezza `min(940px,100%)`, tre colonne `.pcm-cols` → una sola sotto 820 px). **6 voci in 3 gruppi** (`_PCM_GROUPS`, ogni voce = bottone `.pcm-it[data-act]` con icona `.pcm-ic` colorata Lucide-style `_PCM_IC` + titolo `<b>` + riga `<small>`): *Questa settimana* → **Stampa / PDF** (`window.printPlanning()`), **Nuova settimana** (`showNewWeekModalV2()`); *Storico* → **Archivio viaggi** (`arcOpen()`), **Settimane archiviate** (`openPcArchive()`); *Dati e app* → **Nomi e luoghi** (`openDbClean()`), **Aggiorna app** (`pcForceUpdate()`). Piede «App Viaggi» + chip versione (`.pcm-ver`). **Titoli delle voci in grassetto MAIUSCOLO** (`text-transform:uppercase` in CSS: `textContent` resta «Archivio viaggi», quindi i test con regex restano validi), spiegazioni in `--text-soft` (contrasto ≥4,5). **Tolte dal menu** «Mail della settimana» (c'è il pulsante «Mail» `#pcMailProgBtn` nella barra) e «Totali per trasportatore» (stessi numeri dei chip colorati sotto la barra). Le schermate hanno lo stesso nome della voce: «🗃️ **Nomi e luoghi**» (era «Database»), «🗄️ **Settimane archiviate**» (era «Archivio settimane»); «Archivio viaggi» invariato. Tastiera: il cursore parte sulla prima voce, ↑/↓ scorrono, **Esc** chiude e riporta il cursore sul ⋯ (`_pcmKeyH`, listener in cattura che si toglie da solo), clic fuori o ✕ chiudono. `_pcmClose()` chiude; i 3 punti del codice che fanno `getElementById('pcMoreMenu').remove()` restano validi. **Telefono invariato.** Titolo del pulsante ⋯: «Strumenti: stampa, archivi, nomi e luoghi, nuova settimana, aggiorna app».

**«Nuovi viaggi» — i 7 ritocchi** (parti `parts/nwr_*.txt` + `parts/rit_*.txt`, `apply111.py` genera l'index):
1. **«Vai a:»** (`.nwn-lbl`) davanti alla barra dei giorni `#nwrFix .nw-nav` e linea di separazione sopra; i chip diventano più leggeri (bordo 1 px, sfondo trasparente, peso 700) ma **restano alti 36 px** (soglia dei test sui pulsanti); così non si confondono con i 5 giorni della tratta scelta.
2. **«Confermato» discreto**: `.nw-tg.ok` senza sfondo né bordo (✓ + scritta in `--text-soft`, contrasto ≥4,5; al passaggio del mouse riprende il riquadro blu); **`.nw-tg.wn` («Da confermare») resta pieno ambra**: le eccezioni saltano all'occhio.
3. **Riga appena aggiunta** (`.nw-new::after`): velo `--nw-sel` al 32 % + anello da 3 px, resta piena fino al 35 % e svanisce in **3,2 s** (`nwFade`); i timer JS sono 3400 ms.
4. **«Esci senza salvare»** al posto di «Annulla» nel piede (`.nwr-btn2[data-a="cancel"]`); «Annulla» resta solo nell'avviso («Aggiunto · …», `#nwrToast`).
5. **Pulsanti scelti tutti pieni**: `.nwr-seg button.on` (Questa settimana / Prossima) ora è pieno `--nw-sel` come Normali/Compatte, Confermato/Da confermare, Tutte/Da inserire.
6. **Piccole**: tolto «nessuno in programma» dai giorni senza viaggi già inseriti (resta «già N in programma» quando ci sono); **telefono**: il «−» `.pl-m` ora sta a `top:-14px; right:-9px` e non copre più la data (`.dl`).
7. **Avviso e elenco dopo «Aggiungi» su PC** (`_nwrCommit` → `else { _nwrDoneShow(newTrips, !!toNext) }`, solo se `currentView==='desktop'`; sul telefono/altre viste resta `showSummaryModal` + `_scrollToTrip`): **avviso** `#nwrDone` (`.nw-tok.nwd-t`, in basso al centro, 16 s o ✕): «**58 viaggi aggiunti alla settimana prossima**» / «a questa settimana» + «53 confermati · 5 da confermare» (le parti a zero non compaiono; singolare «1 viaggio aggiunto … 1 confermato») + pulsante **«Vedi l'elenco»** (solo se `_nwrIsPC()`) che apre `#nwdOv` («Appena aggiunti», elenco **per giorno** con le stesse righe di «Nuovi viaggi» `_tbRowHtml` + stato ✓ Confermato / ⚠ Da confermare non cliccabile `.nw-st`, Esc/✕/«Chiudi»). **Solo per questa settimana**: `_nwrDoneMark` mette la classe `nw-just` (animazione `nwJust` 4 s, anello + velo) alle righe nuove — `#drow-<idx>` (Schede/Excel), `.bd-r[data-i]` (Colonne), `.tb-r[data-i]` (Tabellone), con `idx = trips.indexOf(t)` — e porta in vista la prima (la più vicina nel tempo). **La settimana prossima non si può guardare dalla schermata PC** (la vista «Prossima» è stata tolta in v65 e il selettore ha solo Settimana/Oggi; `_pcWeekMode==='next'` esiste nel codice ma nessun pulsante lo imposta): per quella l'elenco `#nwdOv` è l'unico modo di vedere cosa è entrato (oltre a «Nuovi viaggi → Prossima → già N in programma»). I colori `--nw-*` ora valgono anche in `.nw-tok` (stesso blocco di `.nwr-ov`).

**Test**: `s40` NUOVO (98 controlli: menu in chiaro e scuro — struttura, nomi, maiuscolo, contrasto, icone, tastiera, ogni voce; ritocchi 1–6; avviso, conteggi, singolare, settimana corrente/prossima, righe illuminate, elenco, Esc; telefono) + `contrast_lib.js` (helper contrasto condiviso, copiato da s19); aggiornati `s19` (piede/versione, già ok), `s20` (la mail si apre dal pulsante «Mail», il menu non la contiene più, 6 voci), `s23` («Settimane archiviate»). Runner: `runall112.sh` → `battery112.log`.

**Idee ANCORA non fatte** (aspettano il sì di Fil): bozza automatica di «Nuovi viaggi» (oggi in sola memoria), scorciatoie da tastiera (Invio nella ricerca = prima tratta, 1–5 = giorno), link «Parti dalla settimana scorsa» (`nwv2CopyPrev`, oggi dentro «Nuova settimana») collegato a «Nuovi viaggi», trascinare un viaggio da un giorno all'altro, totali per cliente, un selettore «Prossima settimana» sulla barra PC. Da ricordare ancora a Fil: sincronizzazione automatica con Drive (ponte Apps Script o «Collega Drive») e prova di installazione sull'Oppo.

## Novità v111 — PC: «Nuovi viaggi» ridisegnato (variante C+: «tratta scelta» fissa + elenco dei viaggi nuovi per giorno), «Da confermare» sul singolo viaggio, comprimi/compatte/«già in programma», «Annulla» (13/11, richieste di Fil: «con l'inserimento di molti viaggi non si capisce più niente… e mettere anche la possibilità del singolo viaggio di DA CONFERMARE»; poi «MI PIACE MOLTO la versione C. ma con tanti viaggi poi come si comporta? è difficile capire quali viaggi si sono aggiunti oppure no?»; NON reimplementare)

**Solo PC (≥1000 px, `_nwrIsPC`)**; il telefono resta con le corsie della v108–v110, ma sotto ogni corsia c'è ora un segno per OGNI viaggio (✓ confermato / ⚠ da confermare, tocco = cambia stato; prima solo per le «altre date»). Funzioni d'ingresso invariate (`nwrOpen/nwrToggle/nwrClose/nwrConfirm`, `toggleAddForm`, `openMultiTratta`, `desktopAddEmpty`, `tapOpen`, tasto N, `duplicateTrip`); `_nwrCommit` e la logica dati sono quelli di prima (ogni slot ha già `st:'c'|'w'`).
**Struttura** (`.nwr-card` = griglia `clamp(380px,30vw,500px) 1fr`, righe testata/barra/corpo/piede, `position:relative`): **sinistra** = elenco tratte sempre aperto (`#nwrPn`: ricerca, filtro `#nwrPf` **Tutte · Da inserire · Inserite (N)** = `_nwr.pn.flt`, tratte più usate o risultati, «Scrivi una tratta nuova…»); **destra** = barra (passo «2 Tocca i giorni», selettore Confermato/Da confermare `#nwrMode`, vista `#nwrVw` Normali/Compatte, striscia fissa `#nwrFix`) + elenco a scorrimento `#nwrBody > #nwrGrid` + piede con totali `#nwrTot` («5 viaggi · 3 confermati · 2 da confermare») e «Aggiungi N viaggi» `#nwrGo`.
**Tratta scelta** (`#nwrFix .nw-ac[data-i]`, `_nwrActHtml`, una sola alla volta, `_nwr.act`): barra colore del trasportatore a sinistra (≥5 px), trasportatore · Da → A · prodotto, **5 pulsanti-giorno** `[data-a="day"][data-d]` (Lun 05 … Ven 09, tocco = +1 viaggio nello stato scelto; il «già N viaggi in programma» sta solo in `title`/`aria-label`, non sul pulsante), «⋯» dettagli (DDT, note, altra data; `.xo`; Esc li chiude PRIMA di chiudere la finestra), cestino `rowdel` (toglie la tratta con i suoi viaggi, con «Annulla»). Scrivere nei dettagli aggiorna subito la striscia e l'elenco (`_nwrPcRefInfo`).
**Barra dei giorni** (`_nwrNavHtml`, chip `.nwn-d[data-k]` con conteggio `.nwn-n` e ⚠ `.nwn-w` per i «da confermare»; giorno vuoto = tratteggiato): un tocco porta l'elenco a quel giorno (`_nwrJump`), lo scorrimento evidenzia il giorno in vista (`_nwrSpyNow`, listener su `#nwrBody` con rAF, `.nwn-d.on`); pulsante **Comprimi/Espandi tutto** (`colall`).
**Elenco per giorno** (`_nwrGroups` → `_nwrListHtml`; gruppi `.tb-dg[data-k]`: lun…ven e poi le date fuori settimana, es. `x2026-10-20`): intestazione `.tb-day` appiccicosa («2 viaggi nuovi · 1 da confermare»), freccia `.nw-ch` per chiudere il giorno (`dcol`, `_nwr.col`). Le righe sono quelle del **Tabellone** (`_tbRowHtml(t, idx, edit, xt)` ha un quarto parametro facoltativo `xt = {cls, attr, tail}`) + tag di stato `.nw-tg` (Confermato ⇄ Da confermare = `flip`), «+» un altro uguale (`dup`) e ✕ (`unslot`); «da confermare» = riga ambra `.cf`; riga appena aggiunta `.nw-new` (illuminata), righe della tratta scelta `.nw-on`; toccare una riga porta in alto la sua tratta (`_nwrRowClick`). Righe **Compatte** (`_nwr.cmp`, classe `tb-c`, localStorage `nwrCmp` '1'/'0'): una riga per viaggio, località di partenza sempre visibile.
**«Già in programma»**: per ogni giorno il pulsante `.nw-hv` «già N in programma» (`_nwrExisting`, `_nwrExRowHtml`) espande in grigio i viaggi già presenti (`.tb-r.nw-ex`, senza pulsanti, NON contano nei totali) sotto le etichette «Già in programma · N» / «Da aggiungere».
**Avviso** `#nwrToast` (`_nwrToast/_nwrToastHide`, in basso al centro dell'elenco: `grid-column:2/3; grid-row:3/4`, l'elenco ha `padding-bottom:78px` e le righe `scroll-margin-bottom:76px`): «Aggiunto · …», «Tolto», «Tratta tolta (N viaggi)» con **Annulla** (`_nwr.undo`).
**Elenco tratte (sinistra)**: una tratta è «inserita» se ha ≥1 viaggio (`_nwrInserted`); le inserite hanno ✓ e puntini dei giorni L M M G V (`_nwrDotsHtml`); toccare una tratta già inserita NON la duplica (si torna a lavorarci, la striscia lampeggia `.flash`); scegliendo un'altra tratta, quella lasciata senza giorni viene sostituita (`_nwrDropBlank`); «Scrivi una tratta nuova…» parte dal trasportatore dell'ultima tratta, cursore su «Da». Conferma con tratta incompleta: messaggio «manca l'arrivo/la partenza…» e campo `.bad` (`parts/nwr_bad.txt`).
**Responsive**: da 1600 px l'etichetta del trasportatore nell'elenco tratte è più larga (126 px); sotto 1360 px nell'elenco tratte l'etichetta del trasportatore sta sopra e il testo sotto (niente parole spezzate); sotto 1280 px spariscono sottotitolo, scritta «Modalità» e date nei chip (l'elenco resta ≥ 328 px a 1100×700). Pulsanti ≥ 36 px (tranne le righe compatte). **Tema chiaro**: dentro «Nuovi viaggi» il testo del giorno usa `--dd` più scuro (`color-mix(... 47% ...)`) perché il giovedì ambra stava a 4,4 su 4,5 di contrasto. Testi: tratta 17 px, località 15,5 px (come il Tabellone), stato 12,5 px.
**Test**: `s39` NUOVO (173 controlli PC: apertura/struttura, tratta scelta e giorni, stato per viaggio, più tratte/ricerca/filtro, dettagli/validazione/salvataggio, «Prossima», tutti gli ingressi, 57 viaggi con comprimi/salta/compatte/«già in programma», leggibilità chiaro+scuro, 1280×720·1100×700·1920×1080); `s12/s13/s36` con blocco PC riscritto, `s30` solo telefono (51); vecchie copie `s12_v110_old.js`, `s13_v110_old.js`, `s30_v110_old.js`, `s36_v110_old.js`. **Batteria completa su v111 (13/11)**: tutta verde (s2–s4, s8–s17, s19–s22, s24–s26, s29–s39, swtest, th5, th10, th11) tranne `s23` («1–50 di 1684», vecchio e noto, non legato a «Nuovi viaggi») e `s27`, che dentro la batteria è andato in timeout su un clic ma da solo è verde (37) — stessa cosa già vista in v110; `th5` stavolta verde. Script `v111/apply111.py` (parte da v110) + `parts/nwr_*.txt`; anteprime con 58 viaggi veri in `anteprime_v111/` (normale, compatte, appena aggiunto, tutto compresso, già in programma, scuro, 1920, telefono). Attenzione: niente nomi veri di clienti/località nei commenti del codice (test s26/s32).
**Idee NON fatte (aspettano il sì di Fil)**: dopo «Aggiungi» sul PC evidenziare i viaggi nuovi con avviso (FATTO in v112: avviso `#nwrDone` + elenco `#nwdOv` + righe `nw-just`); trascinare un viaggio da un giorno all'altro; totali per cliente. Da ricordare ancora a Fil: sincronizzazione Drive senza Salva/Carica (v. v108) e risultato dell'installazione Android/Oppo.

## Novità v110 — PC: menu «Vista», vista «Tabellone» (da → a), località di arrivo in MAIUSCOLO, «Esporta» premium (13/11, richieste di Fil: «tabellone da → a» con Normale/Compatta, «un menu per scegliere la visualizzazione», poi «si vede troppo piccolo… stampa molto più premium e curata»; NON reimplementare)

**Solo PC** (telefono identico alla v109).
**Menu «Vista»** (pulsante `#pcViewBtn` nella barra in alto, accanto agli strumenti; menu `#pcViewMenu` creato da `pcToggleViewMenu`, si chiude con Esc o clic fuori): **Schede · Colonne · Tabellone · Tabellone compatto · Excel**. `pcViewSet(v)` con v = cards|board|tabn|tabc|excel; stato in `_pcDens` = `{mode:'cards'|'excel'|'board'|'tab', cards, excel, board, tabC}` (localStorage `pcDensMode`, `pcDensCards/Excel/Board`, `pcTabComp`); `<html data-pcmode>` e `data-pclvl` (lvl 0 per il Tabellone). Il vecchio selettore Schede/Excel/Colonne è sparito dalla barra: `#pcDensCtl` ora mostra solo lo zoom a tacche (Schede/Excel/Colonne) oppure **Normale / Compatta** (Tabellone, `pcTabComp(0|1)`, cambia solo la classe `tb-c` su `#pcTab`, senza ridisegnare).
**Tabellone** (`_tbHtml` → `#pcTab`, classi `.tb-*`; codice in un blocco prima di `renderDesktopView`): chip trasportatore a sinistra, **fornitore → cliente** (nome in grande, località sotto, pallino colore del codice, DDT, prodotto, nota ✎), fasce giorno colorate (`_DAY_STRIPE`) con «N viaggi · N da confermare», pillola OGGI, due metà bilanciate per numero di righe (`_tbSplit`; sotto 1180 px i giorni vanno uno sotto l'altro; un solo giorno = una sola metà). **Normale** = 2 righe per viaggio; **Compatta** = 1 riga (20 viaggi interi in 1440×900). Viaggi «da confermare»: riga ambra con tag. Ricerca/filtri (`_tbFilter`, chiamata da `desktopQuickFilter`), evidenzia cliente/fornitore con la stessa logica di Colonne (`_bdFocus/_bdSetFocus`, barra `#tbFb`, Esc/«Togli»), ✎ o doppio clic → `bdEdit`. Pulsante «Esporta» dentro `.bd-bar` (non nella barra strumenti: test s24 vuole una sola riga a 1440).
**Località di arrivo in MAIUSCOLO**: `.bd-lo` (Colonne) e `.tb-lo` (Tabellone). **Banda fornitore** (Colonne): i nomi di una parola (es. INCONTRATO) restano su una riga.
**Esporta (stampa)**: finestra di stampa autonoma generata da `_pzPrintHtml(list, wt, kind, cp)` (kind = 'tab' se la vista è Tabellone, altrimenti 'board'; `bdExport()`); intestazione «Settimana NN · 14 – 18 settembre 2026», totali (KPI), legenda dei trasportatori, piè di pagina; **testo molto più grande** (`_PZ_CSS`, `_pzP2` per le Colonne ridisegnate per la carta). Comandi: **Formato A4/A3 · Pagina Orizzontale/Verticale · Righe Normali/Compatte (solo Tabellone; compatta all'inizio se la vista è compatta o ci sono >24 viaggi) · Adatta «A 1 pagina»/«A tutta larghezza»**. La scala si trova con ricerca binaria su `transform:scale` (max 1,2) dentro `_pzBoot`; `@page` dinamico; font Google caricati senza bloccare lo script (se la rete è assente resta il font di sistema). Con 20 viaggi in A4 orizzontale la scala è ~94% (nomi ≈ 14,6 px); in A4 verticale a 1 pagina ≈ 71% (nomi ≈ 11 px): per averli più grandi usare «Compatte» o «A tutta larghezza».
**Test** (tutti verdi con `APP=…/index.html`): `s38` NUOVO (93 controlli: Tabellone chiaro/scuro, menu Vista, filtri/evidenzia/modifica, 1100/1440/1920, compatta ricordata, stampa normale+compatta A4/A3/orizz./vert.), `s37` riscritto per Colonne con menu Vista e nuova stampa (70), `s31/s32/s34/s36/swtest/s26/s19` con versione generica `v1xx`, `th11` adeguato (`data-pcmode`, `pcViewSet`). **Rossi noti e NON legati a v110**: `s23` («1684») e `th5` (tema dopo la ricarica / `getTransporterColorVar`) — th5 è rosso identico anche su v109. Vecchie copie: `s37_v109_old.js`, `th11_v109_old.js`. Script `v110/apply110.py` (parte da v109) + `parts/*.txt`; anteprime in `anteprime_stampa_v110/`.
**(REALIZZATO in v111, vedi sopra) Chiesto da Fil dopo la v110 (13/11)**: ridisegnare «Nuovi viaggi» (PC) perché con tanti viaggi non si capiva più niente (colonna del nome tratta larga solo ~140–200 px a 1280–1366 px, testo spezzato lettera per lettera, 3 tratte per schermata) e aggiungere il **«Da confermare» sul singolo viaggio**. Anteprime A (planner compatto), B (colonne per giorno), C (elenco stile Tabellone): **Fil ha scelto la C** («mi piace molto la versione C») e ha chiesto come si comporta con tanti viaggi e come capire cosa si è aggiunto → previsto: striscia «Tratta scelta» con i 5 giorni, elenco per giorno con righe come il Tabellone e interruttore Confermato/Da confermare + «un altro uguale» + ✕ su ogni riga; riga appena aggiunta evidenziata con avviso «Aggiunto: … [Annulla]»; barra dei giorni sempre in vista (con ⚠) e salto al giorno; giorni comprimibili; righe Normali/Compatte; nell'elenco tratte a sinistra i giorni già inseriti (L M M G V colorati) e filtro «Da inserire»; «già N in programma» sul giorno. Telefono: lasciare le corsie attuali e aggiungere il segno ✓/⚠ per cambiare lo stato di ogni singolo viaggio.

## Novità v109 — PC: modalità «Colonne» (settimana a colonne) con zoom, evidenzia, modifica, Esporta A4/A3 (11/11, richiesta di Fil: «va bene la 1 [= L1] … ingrandirlo, rimpicciolirlo … esportarne una copia in A4 e in A3»; NON reimplementare)

**Solo PC** (telefono identico alla v108). Terza modalità del selettore **Schede · Excel · Colonne** (`_pcDens.mode` = 'cards'|'excel'|'board', salvata in `pcDensMode`; livello in `pcDensBoard` −3…+3). Una colonna per giorno (lun–ven, più eventuali giorni extra; con filtro giorno/Oggi solo i giorni con viaggi); in ogni colonna i viaggi sono **raggruppati per fornitore**: fascia a sinistra (`.bd-band`, nome + località + prodotto se tutti uguali) e a destra un blocco **cliente** colorato (`.bd-cb`) con sotto pillola trasportatore (pallino colorato), località, «DDT n», icona nota, «Da confermare». Design = anteprima **L1** approvata sulla settimana 38 vera (20 viaggi).
**Colori**: stesse classi `vcN` della tabella (`_vvCls`, 12 slot per frequenza, top 6 per ruolo, ≥2 usi) → un cliente ha lo stesso colore in Schede, Excel, Colonne e stampa. Blocchi cliente = stesso colore scuro in chiaro e scuro (contrasto testo ≥4,7); fasce fornitore pastello (chiaro) / scure (scuro). **Ritoccati viola (slot 5) e rosso (slot 8)** perché non si confondessero con blu e arancio (Zignago/Agrogi): CSS `.pc-loc.vc5/.vc8` (chiaro e scuro) e `_XP_DOT[5]/[8]` (Excel/stampa); valori in `v109/pal109.py`.
**Zoom**: i pulsanti −/+ e i puntini del selettore (livelli −3…+3) cambiano `--bd-z` (CSS `zoom` sulla griglia: 0,80 · 0,94 · 0,84 · 1 · 1,14 · 1,30 · 1,50). Ai livelli **−2 e −3** scatta la versione **compatta** (classe `bd-c`: ~82 px a viaggio invece di ~115, tutto visibile con 30 viaggi); per questo lo zoom a −2 (0,94) è più grande di quello a −1 (0,84): è voluto (cambia la densità, non solo la scala). Colonne min. 258 px; se non entrano compare lo scorrimento orizzontale del contenitore `#desktopTableScroll`.
**Intestazione giorno**: sticky, gradiente dal colore del giorno (`_DAY_STRIPE`), contatore a cerchio; colonna di **oggi** con anello, linguetta «OGGI» sul bordo e scorrimento automatico (`_bdScrollToday`) quando si entra in Colonne; pallino ambra «⚠N» = viaggi da confermare.
**Evidenzia**: clic su un blocco cliente → si accendono tutti i viaggi di quel cliente, gli altri si abbassano (`bd-dim`); clic su una fascia fornitore → idem per fornitore; barra `#bdFb` con conteggio e «Togli»; Esc o clic nel vuoto azzera.
**Modifica**: ✎ (compare al passaggio) o doppio clic su un blocco → finestra `#bdEditOv` (z-index 3500) con data, trasportatore, fornitore, cliente, prodotto, DDT, note, «Segna da confermare/confermato», Duplica…, Elimina; usa gli stessi `desktopSetField/desktopSetPending/desktopToggleConf/desktopDel/desktopDup` della tabella; alla chiusura, se qualcosa è cambiato, `renderDesktopView()` ridisegna (lo scorrimento viene ripristinato da `_bdAfter`).
**Ricerca/filtri**: `desktopQuickFilter` chiama `_bdFilter` (stessi criteri della tabella: giorno, cliente/fornitore/trasportatore, testo, tratta); la tabella resta nel DOM nascosta (serve a `desktopSetPending/ToggleConf`).
**Esporta** (pulsante «Esporta» in alto a destra sopra le colonne, `.bd-exp` dentro `.bd-bar`, accanto al suggerimento `#bdHint` che lascia il posto alla barra «Evidenziato» `#bdFb`; NON nel selettore, altrimenti a 1440px la barra strumenti va a capo — test s24; per lo stesso motivo il selettore Schede/Excel/Colonne e i puntini sono stati stretti): apre una finestra di stampa (come `printPlanning`) con la settimana filtrata: **Formato A4/A3 · Pagina Orizzontale/Verticale · Adatta «A 1 pagina»/«A tutta larghezza»**; `@page` dinamico, scala automatica (CSS `zoom`), intestazione con totali e chip dei trasportatori, piè di pagina con legenda; CSS letto da `<style id="bdCss">` (stesso stile della vista), colori forzati in stampa; nella pagina di stampa niente linguetta «OGGI» né anello della colonna di oggi (`.bd-dh{position:relative}`, altrimenti i badge assoluti finivano agli angoli della pagina). Verificato: PDF A4 e A3 orizzontali = 1 pagina.
**Codice**: tutto il JS nuovo sta in un blocco prima di `renderDesktopView` (fuori dal blocco protetto `_CODE_PAL … // Badge HTML`, test s32); CSS condiviso in `#bdCss`, parte solo-schermo in `@media screen` prima del commento «v104 — Look "P2"». `_pcDensApply` può girare PRIMA delle `var` successive → `_bdApply` ha la guardia `if(!_BD_Z) return`. Niente nomi veri di clienti/località nei commenti (test s26/s32).
**Test**: batteria completa verde (come v108: solo `s23` «1684» noto e `th5` da solo; `swtest`/`s31`/`s32`/`s34`/`s36` portati a v109, vecchie copie `*_v108_old.js`); `s37` (69 controlli: 1440 chiaro/scuro, zoom −3…+3, compatta, colori = tabella, oggi in vista, ricerca/giorno, evidenzia, modifica/elimina, Esporta A4/A3/orizz./vert./larghezza, scorrimento non salta, riavvio, telefono invariato); `s31/s32/s34/s36` aggiornati a v109 (vecchie copie `*_v108_old.js`). Script `v109/apply109.py` (parte da v108) + `pal109.py`, `bd_js.txt`, `bd_css_*.txt`.
**Anteprime scartate**: K1–K3 (fascia fornitore troppo pesante), P1/P2, L2; scelta L1 («più calma»).
**Idee proposte a Fil, NON fatte (aspettano il suo sì)**: trascinare un viaggio da un giorno all'altro; riepilogo per cliente (totale viaggi a fondo pagina). Ancora da ricordargli: sincronizzazione Drive senza Salva/Carica (v. v108) e risultato installazione Android/Oppo.

## Novità v108 — PC: «Nuovi viaggi» a tutta pagina, due colonne (10/11, richiesta di Fil: «fatta male, troppo in basso la selezione… ricostruire tutto», poi «a tutta pagina ma più curata e premium»; NON reimplementare)

**Solo ≥1000px** (`_nwrIsPC`); telefono identico alla v106. La finestra occupa tutto lo schermo (griglia CSS su `.nwr-card`): **sinistra «1 Scegli la tratta»** = `#nwrPn` diventato colonna fissa (ricerca grande col cursore già dentro + elenco sempre visibile: 30 «Tratte più usate», o i risultati mentre si scrive) · **destra «2 Tocca i giorni»** = barra stato + righe con i giorni. Niente più pulsante «Aggiungi tratta», pillole dei trasportatori, velo, riquadro a tendina (nascosti via CSS; i nodi restano nel DOM). Riga dell'elenco su PC (`_nwrRouteTx`): pillola trasportatore colorata a larghezza fissa, località in grande, sotto codici e prodotto, contatore «N×»; le tratte già scelte hanno ✓ e sfondo azzurro e si aggiornano a ogni cambio della griglia (`_nwrPaintGrid` → `_nwrPaintPn`).
**Comportamento**: `_nwrPnClose()` su PC non chiude (svuota la ricerca e rimette il cursore; `_nwrPnClose(true)` solo da `nwrClose`); Esc = con testo nella ricerca la svuota, altrimenti chiude la finestra; non c'è più un «fuori» da cliccare (✕, Esc, Annulla). «Scrivi una tratta nuova…» parte dal trasportatore dell'ultima tratta anche su PC. Etichette dei passi = `.pl-step` (nascoste sul telefono).
**Anteprime scartate**: A «ricerca in alto con tendina»; B due colonne in finestra (Fil l'ha voluta a tutta pagina).
**Test**: `s36` (54 controlli: 1440 chiaro/scuro, 1100, 1920, telefono invariato), `s30`/`s12`/`s34` aggiornati; batteria verde tranne `s23` «1684» (noto); `th5` passa da solo. Script `test_v74/v108/apply108.py` (parte da v107). Attenzione: niente nomi veri di clienti/località nei commenti del codice (test s26/s32).
**DA RICORDARE A FIL (l'ha chiesto lui: «ricordamelo più avanti»)**: sincronizzazione Drive senza premere Salva/Carica. Diagnosi: la sincronizzazione automatica c'è già (unione ogni 45 s e al ritorno sull'app); il blocco è il permesso Google che dura 1 ora e non si rinnova senza un tocco. Proposte fatte: (1) ponte Google Apps Script senza login, configurazione una tantum + parola chiave per dispositivo (consigliata); (2) tenere il login e mettere un solo pulsante «Collega Drive» all'apertura. Fil non ha ancora scelto.

## Novità v107 — Excel e Stampa «come la vista PC» (10/11, richiesta di Fil con foto; NON reimplementare)

**Problema visto da Fil**: l'Excel aperto/stampato dal telefono (visualizzatore Oppo, stampante Brother) usciva su **4 pagine**, piccolo, con colori pastello diversi dalla vista PC. Causa: colonne larghe 182 unità (più di un A4 orizzontale) e quel programma ignora «adatta alla pagina»; riprodotto qui con LibreOffice senza adattamento = 4 pagine.
**Excel** (`_buildAndDownloadExcel`, stesso file per PC e Rapida): colonne e ordine della vista PC → DATA · TRASP. · PARTENZA Fornitore · Località · ARRIVO Cliente · Località · PRODOTTO · DDT · STATO · NOTE; trasportatore = cella piena coi **colori della vista PC tema chiaro** (`_XP_T`, inchiostro `_XP_TINK`); fornitore/cliente = pallino colorato (`_XP_DOT`, stesso slot `vcN` di `_vvCls`) + nome in grassetto (richText; senza slot il pallino è bianco per tenere l'allineamento); località in grassetto; fascia del giorno con filo sopra; intestazione grigia con «DATA» arancio. Righe 18pt, larghezze in tutto ≈133 (un A4 orizzontale al 100%), `fitToHeight:1` fino a 46 righe, `printArea`, margini 0,25". Etichette accorciate: «TOTALI», «TRASP.», «⚠ DA CONF.», «✓ Conferm.».
**Stampa** (`window.printPlanning` riscritta, HTML in `_xpPrintHtml`): stessa tabella/colori, `print-color-adjust:exact`, A4 orizzontale, una settimana di 18 viaggi = 1 pagina (PDF di Chromium). Sceglie i viaggi come l'Excel (`_xpSelection`: vista PC = visibili; altre viste = filtri attivi). Su PC resta nel menu ⋯ «Stampa planning»; **sul telefono nuovo quinto strumento «Stampa / PDF»** (`.ic.c-pr`, griglia a 5).
**Non provato**: il visualizzatore Excel e la stampa dal telefono vero di Fil; Excel vero di Microsoft (qui: file ricostruito con openpyxl dai dati che l'app passa a ExcelJS + LibreOffice → PDF: 1 pagina con adattamento, larghezza giusta anche senza; senza adattamento una riga con nota lunga può andare su una 2ª pagina).
**Test**: `s35` (33 controlli: tavolozza = colori calcolati nella vista PC, Excel e Stampa da PC e da telefono), `s33` aggiornato (5 strumenti), versione in `s31/s32/s34/swtest`. Batteria completa verde tranne `s23` «1684» (noto). Script: `test_v74/v107/apply107.py` (parte da v106), strumenti di anteprima `xl.js`, `mkxlsx.py`, `pr.js`.

## Novità v106 — PC: prodotto «riquadro piatto» · TELEFONO: «Aggiungi tratta» solo con ricerca (09/11, richieste di Fil; NON reimplementare)

**PC (vista Schede)**: SOLO la colonna Prodotto cambia → riquadro piatto e neutro (nessun colore) con la scritta PRODOTTO sopra e il nome a 18px grassetto; messa a fuoco = bordo/sfondo arancio tenue. Il nome lungo si rimpicciolisce da solo (min 14px, `_pcFitNames`, variabile CSS `--pc-fit`) invece di tagliarsi; al livello −3 niente etichetta. Scala con `--pc-f`/`--pc-p`; Excel e stampa invariati.
**Provato e SCARTATO da Fil (non rifarlo)**: località a 20px/18px e «non tutta maiuscola» (la funzione `_pcTitleCase` era pronta ma Fil ha detto «lascia tutto come era prima»: località INVARIATE); prodotto con pillola/tasto colorato («più sobrio»); varianti B (solo testo col filetto) e C (tasto neutro). Colori di Fornitore/Cliente: Fil ha chiesto un parere, non una modifica.
**Telefono — «Nuovi viaggi» → «Aggiungi tratta»** (lamentela di Fil: «a tre quarti dello schermo non si vede niente, 50.000 trasportatori»): via le pillole dei trasportatori (`.pl-chips` nascoste, il nodo resta nel DOM per i test); il pannello non è più un foglio dal basso ma sta in alto (`position:fixed; top:0`), il cursore va subito nella ricerca (si apre la tastiera) e l'altezza segue lo schermo libero (`visualViewport`, `_nwrVv`: tastiera aperta → tutto lo spazio, chiusa → max 62%). Senza testo: solo 4 «Tratte più usate» (PC: 12); scrivendo: risultati con pillola del trasportatore colorata; «Scrivi una tratta nuova…» sempre visibile in fondo. Su telefono non si pre-seleziona più il trasportatore dell'ultima tratta (senza pillole non si potrebbe togliere). Righe più compatte (pillola 10px, riga min 44px). PC invariato.
**Test**: `s31/s32` aggiornati alla versione v106; il codice nuovo NON deve stare dentro il blocco `_CODE_PAL … // Badge HTML` (test s32 lo confronta con la v103) → il JS di v106 sta prima di `renderDesktopView`. Script: `test_v74/v106/apply106.py` (parte da v105, assert), `runall106.sh`.

## Novità v105 — TELEFONO: testata «Compatta», giorni AZZURRI, schede «più leggibili», strumenti colorati; tolta la vecchia lente 🗂 (09/11, richiesta di Fil: «renderlo più premium, dare una rinfrescata»; NON reimplementare)

**Come si è arrivati qui (per non rifare le stesse domande)**: dopo molti mockup in sequenza (R, S, F, G, N, P, Q — tutti con nomi finti) Fil ha scelto: **schede «F5 più leggibile»**; **barra dei giorni a mini-calendario + fasce giorno a tutta larghezza**, ma con **un solo colore azzurro** («renderli riconoscibili, non grigi») e **solo OGGI arancio**; testata **«P3 Compatta»**; strumenti in fondo come **4 icone colorate** (Esporta verde · Importa azzurro · Nuova settimana arancio · Archivio viola) con **«Cancella tutti i viaggi» come link discreto**; e ha detto di **togliere la vecchia lente 🗂** «Ricerca avanzata archivio» (il cruscotto «Archivio viaggi» fa tutto: periodo, filtri trasportatore/fornitore/cliente/prodotto, testo e DDT, Excel, stampa). Cose che Fil ha **scartato**: giorni di colori diversi («si rischia di non capire niente»), giorni grigi (poco riconoscibili), testate P1 «Pulita» e P2 «Vetro», verde acqua e lavanda per i giorni (mostrati, non scelti). Il mockup della fascia/ barra con tutti i colori della settimana (G1–G3) e il «sfumata» troppo poco leggibile sono superati.

**Cosa vede Fil (SOLO telefono: sotto i 1000px e fuori dalla vista PC — il PC è identico alla v104, confronto pixel 1440×900 scuro/chiaro × PC/Rapida/Trasp.: 0 pixel diversi)**
1. **Testata sottile (52px)**: logo + «VIAGGI» + titolo corto della settimana + tre icone 38×38 senza sfondo (Salva verde, Carica azzurro, tema). Tolto il badge «LOGISTICA». Il titolo si mostra **corto**: «Settimana 46/2026 (Lun. 09/11 - Ven. 13/11)» → «Sett. 46 · 9–13 nov» (`_weekShort105`, solo a video: il testo salvato in `weekTitle`/localStorage/Drive NON cambia, il modulo «Titolo settimana» mostra quello intero; se il testo non ha la forma «Lun … Ven …» resta com'è).
2. **Stato Drive** = riga leggibile (Outfit 11px, a tutta larghezza) sotto la testata, non più il testo mono 9px troncato accanto ai pulsanti. Compare solo quando l'app ha uno stato (come prima). Pulsanti Salva/Carica restano «spenti» (opacità 0,6) quando Drive non è connesso.
3. **Barra dei giorni** = 5 tessere azzurre con giorno, **numero del giorno** (9 10 11 12 13, dal lunedì della settimana in uso: `_mtCurrentWeekMonday`) e **badge in alto a destra** col numero dei viaggi; OGGI = tessera arancio con anello; tocco su un giorno = filtro (anello chiaro, `day-filtered`).
4. **Filtri**: pannello con filo sottile (niente più bordo arancio spesso), titolo grigio; **la lente 🗂 non c'è più** (pulsante, pannello «Dove cercare/Periodo/Trasportatore/Prodotto», risultati e tutte le funzioni `toggleArchiveSearch`, `runArchiveSearch`, `as*`: ~300 righe tolte). Per cercare nell'archivio si usa **Archivio viaggi** (cruscotto).
5. **Riga «18 viaggi · Questa settimana»** a sinistra, senza linee né pallino. **Banner «da confermare»** = una riga («1 da confermare» + pulsante «✓ Conferma tutti» + freccia); i viaggi si aprono con la freccia (chiuso di default, lo stato aperto/chiuso resta dopo un ridisegno: `_daConfOpen105`).
6. **Fasce dei giorni**: «Lunedì · 9 novembre» + «3 viaggi» (singolare «1 viaggio») su fascia azzurra; **OGGI** (confronto sulla data vera, non sul nome del giorno) in arancio. Il numero del giorno resta nel DOM (`.day-badge-num`, nascosto) perché lo usa «vai al viaggio».
7. **Schede viaggio «più leggibili»**: pillola trasportatore PIENA (colore + testo `--t-<chiave>-fill/-ink`, 10px) | **DA** (pallino arancio vuoto + luogo 13px grassetto che può andare a capo + codice arancio 11px) | filo | **A** (pallino verde pieno + luogo + codice verde) | pulsante duplica 30px; fascia laterale 4px nel colore del trasportatore (stesso della pillola), sfumatura leggera del colore, angoli 18px. «⚠ conf.» e «DDT …» restano sotto la pillola.
8. **Strumenti in fondo** (`#phTools`): **Esporta Excel** (`downloadExcel`), **Importa Excel** (apre/chiude il pannello `#importSection` con Aggiungi/Sostituisci + scelta file: prima era sempre aperto e lunghissimo), **Nuova settimana** (`showNewWeekModalV2`), **Archivio viaggi** (`arcOpen` — **sempre raggiungibile**, prima il pulsante stava dentro la sezione Archivio e compariva solo con almeno una settimana archiviata: per questo Fil non era mai riuscito ad aprire il cruscotto dal telefono), «Cancella tutti i viaggi» (`clearData`). La riga «ARCHIVIO · N settimane» (settimane passate) resta com'era, senza il vecchio riquadro attorno.
9. **Barra in basso**: fluttuante, di vetro (8px dal fondo), tasto «+» a gradiente arancio 38px.
10. **Bug sistemato per strada**: **toccare un giorno nella barra ora filtra davvero la lista Rapida** (prima `filterState.giorno` veniva impostato ma `renderCompactView` non lo considerava in `hasFilters`: si accendeva il filtro e la lista restava intera). Secondo tocco = di nuovo tutti.

**Come è fatto (tecnico)**
- **CSS**: nuovo `<style id="phone105">` dopo `srchStyle`: tutto dentro `@media (max-width: 999px)` e con prefisso `body:not(.desktop-view-active)` (aggiunto dal generatore). Fuori dalla media query solo `.section.ph-tools, .week-seg .w-date { display:none }`. Variabili nella media query: `--dh` (azzurro, rgb), `--dhl` (azzurro chiaro per i testi; **scuro nel tema chiaro**), `--tcx/--tci/--tcn/--tca` (colori strumenti), `--dlc` (rosso di «Cancella»), tutte con la versione `html[data-theme="light"]`. Sulla riga della scheda `--rc` = `var(--t-<chiave>-fill)` (in linea).
- **JS (ES5)**: `_phoneUi()` (= `matchMedia('(max-width: 999px)')`, stesso limite del CSS), `_rowPhone105`, `_daConfBannerPhone`, `_placeDriveStatus` (sposta `#driveStatus` sotto la testata sul telefono e lo rimette in `.top-bar-right` sugli schermi larghi), `phToggleImport`, `_weekShort105` (dentro `setText('weekInfo', …)`), `.w-date` creato in `updateWeekProgress`, listener `matchMedia('change')` che ridisegna Rapida/barra/Drive/titolo quando si passa da telefono a largo e viceversa. In `renderCompactView` il ramo telefono è `if (PH) {…} else {…vecchio markup…}` (3 punti: banner, fascia giorno, scheda): **sugli schermi larghi il markup resta quello di sempre**.
- **HTML**: nuova sezione `#phTools` prima di «Actions»; la sezione «Actions» ha ora `class="section ph-old"` (nascosta sul telefono, visibile sugli schermi larghi); la sezione importazione ha `id="importSection"` e `class="section ph-imp"` (chiusa sul telefono finché non si tocca «Importa Excel»).
- **Generatore**: `apply_phone105.py` + `phone105.src.css` in `test_v74/v105/`: leggono sempre la **v104** (`src104.html`), controllano ogni punto di aggancio (`rep`: atteso/trovato) e scrivono `index.html`. Per cambiare un colore/misura si modifica `phone105.src.css` (selettori SENZA prefisso) e si rilancia; non ritoccare l'HTML a mano.
- ⚠️ In `test_v74/v105/` ci sono anche `apply105.py` + `nwr105.css` = **prima prova «Nuovi viaggi» da telefono nel look P2** (NON applicata, NON approvata da Fil): NON fa parte della v105. Eventuale seguito: rifarla con la lingua visiva di questa versione (azzurro/arancio, strumenti colorati).

**Numeri e compromessi da conoscere**
- Contrasti (misurati da `s33.js`): scuro — nome giorno 7,2 · data 6,0 · «N viaggi» 4,6 · tessere 7,3 · strumenti 5,2–6,2 · «Cancella» 5,1 · luoghi 9,5 · codice verde 6,4 · **codice arancio 3,9** · pillola 4,8. Chiaro — nome giorno 7,1 · data 5,4 · «N viaggi» 5,3 · tessere 8,3 · strumenti 5,3–6,3 · «Cancella» 6,3 · luoghi 12,0 · **codice arancio 3,9 · codice verde 3,8** · pillola 4,8. I codici arancio/verde di Fil nel chiaro restano sotto 4,5 (sono i colori `--accent`/`--success` di sempre, grassetto 11px): da ritoccare solo se dice che si leggono male.
- Pulsanti della testata: **restano 38×38** (nel mockup erano 34): Fil aveva chiesto pulsanti più grandi (v96) e `s25` lo verifica.
- Barra in basso: **non è più incollata al bordo** ma a 8px (fluttuante); `s27` accetta ≤10px.
- Il test `s23` dà «1–50 di 1684» invece di «1.684» solo su questa macchina (lingua del browser): non è una regressione. `s27` e `s15` a volte danno un falso rosso di tempo se lanciati uno dopo l'altro: da soli passano.

**Manifest/icona (09/11)**: il `manifest.json` consegnato la mattina del 09/11 era stato riscritto da zero e aveva perso le due righe dell'icona NUOVA (`logo-maskable.png`, `purpose: "maskable"`, 192 e 512, fondo blu notte, logo all'80%) che Fil aveva scelto il 07/11 dopo il «cerchio bianco» di Android sull'icona normale; Chrome mostrava di nuovo la vecchia. Rimesse (stesso `id` `app-viaggi-protrasporti-2026`, quindi nessuna nuova identità dell'app). **Regola**: ogni nuovo `manifest.json` deve contenere SEMPRE 4 icone: `logo.png` any 192/512 + `logo-maskable.png` maskable 192/512; partire dal manifest vivo che Fil ha nel repository (ultimo caricato: `c1c5a120-manifest.json`), non riscriverlo. Verifica per Fil dal telefono: aprire `…/TAB-VIAGGI-/logo-maskable.png` (deve mostrare il quadrato blu con il logo) e `…/manifest.json`.

**Test**: nuovo `s33.js` (53 controlli: fasce, schede, tessere, titolo corto, giorni azzurri e OGGI arancio, singolare, tocchi (modifica/duplica), filtro giorno, banner, strumenti e Importa, lente tolta, stato Drive, schermo largo identico + passaggio telefono↔largo, contrasti scuro/chiaro). Adattati: `s9` e `s31` (la lente non c'è più: ora controllano che manchi e che il cruscotto ci sia), `s27` (barra a ≤10px dal fondo), `th10` (stato Drive = riga larga, non più ≤38% dello schermo), `s32`/`swtest`/`s31` (versione). **Batteria finale (09/11)**: tutta verde — s33 53 · s32 87 · s31 70 · s30 165 · s29 30 · s27 37 · s26 66 · s25 115 · s24 77 · s19 74 · s20 101 · s21 18 · s22 25 · swtest 12 · th10 69 · th11 88 · s2…s17 tutte a 0 falliti. Unico rosso fisso: `s23` «1684» (lingua del browser della macchina di prova). `th5` (3 rossi) e `s27`/`s15` a volte falliscono SOLO se lanciati in sequenza nella batteria: da soli passano (th5 38 ok, s27 37 ok, s15 95 ok). Lint: «lint ok (solo ClipboardItem noto)». PC 1440×900: 0 pixel diversi dalla v104.

**Da fare / proposte rimaste (NON approvate)**: (1) **«Nuovi viaggi» da telefono** nella stessa lingua (difetti noti: foglio alto solo il 70%, scelta tratta come secondo foglio, 15 chip trasportatore che vanno a capo, tratte su una riga sola) — **mostrare PRIMA le anteprime**; (2) titolo settimana: aggiungere nel modulo un suggerimento «Sett. 46 · 9–13 nov» se Fil vuole scriverlo lui; (3) chip dei trasportatori e intestazioni dei giorni della vista PC nello stesso stile (proposta v104, ancora aperta); (4) codice morto: i pulsanti «Excel/Nuova sett./Cancella» vecchi (`.ph-old`) e il vecchio markup di Rapida servono solo sopra i 1000px.

---

## Novità v104 — Vista PC (Schede): look «P2» — riquadri Fornitore/Cliente «a tasto», pillola Trasportatore scura col nome colorato, sfondo riga che segue la luminosità, fascia ambra «Da conf.» (08/11, richiesta di Fil: «Fai P2»; NON reimplementare)

**Come si è arrivati qui (per non rifare le stesse domande)**: dopo molti mockup in sequenza (T2/F3/F4 per i riquadri, N3/N4 per il trasportatore, G3 per lo sfondo riga, S/W/X/Z/P semplificati e «premium») Fil ha scelto **P2 = riquadri F4 «keycap» + pillola N3 + sfondo G3 + ritocchi premium** (etichette più fini, filetto sfumato, ombra morbida, zoccolo scuro anche sotto la pillola). Cose che Fil ha **scartato**: opzioni «calme»/neutre per il trasportatore, la famiglia C1–C4 (disegno completamente diverso), fondi più scuri senza riquadro (H1–H3). Interpretazione giusta di «un pizzico di scuro» = un **riquadro/cornice scuro** attorno a Fornitore e Cliente (non fondi più scuri). Le immagini di confronto con i nomi veri sono solo private (mai nel file pubblico).

**Cosa vede Fil (solo vista PC, modalità «Schede»; i 7 livelli di grandezza funzionano)**
1. **Riquadri Fornitore / Cliente**: cornice sottile scura + **zoccolo** di 4px sotto (nel colore scuro del codice), angoli 12px, ombra morbida, filetto verticale sfumato fra codice e località, etichette FORNITORE / LOCALITÀ / CLIENTE più fini. I **6 codici più frequenti per ruolo** (almeno 2 viaggi) hanno il riquadro **tinto** (fondo pastello, barretta colorata a sinistra, zoccolo nella tinta scura); tutti gli altri riquadri sono **neutri** (stessa cornice, nessun colore). La località di arrivo non è più verde: stesso colore della partenza. Il pallino del codice non c'è più nelle Schede.
2. **Pillola Trasportatore**: fondo ardesia scuro (più chiaro nel tema chiaro, più scuro nello scuro), cornice 2px, zoccolo 4px nel colore scuro del trasportatore, **barretta colorata** a sinistra e **nome nel colore del trasportatore** (grassetto 13px). Altezza 34px (scala con i livelli di grandezza). I colori dei trasportatori sono quelli di sempre (`--t-<chiave>-pill`), solo riletti in versione chiara/scura.
3. **Sfondo riga** (G3): leggermente più scuro dell'app e **segue «Più chiaro / Medio / Più scuro»**; la riga di **OGGI** parte da `--surface-2` (un filo diversa, come prima).
4. **«Da conf.»**: la riga prende un fondo ambra (12%) e una fascia ambra di 6px a sinistra; il pulsante «DA CONF.» resta sempre visibile. **«Segna»** è invisibile a riposo: compare (debole) passando sul rigo o con Tab, e pieno passandoci sopra.
5. **Modalità Excel**: invariata, salvo: sfondo riga G3, fascia «Da conf.» e il **pallino** del codice (colorato per i codici frequenti, nascosto per gli altri — il testo del codice è neutro). Pillola e riquadri di Excel sono quelli di prima.
6. **Telefono, stampa, Excel esportato, Archivio, chip della barra, popup**: **identici alla v103** (confronto pixel del telefono: 0 pixel diversi; blocco `_CODE_PAL … _codeChip` identico, verificato da `s32.js`). Continuano a usare la palette a 12 tinte per codice della v101.

**Come è fatto (tecnico)**
- **CSS**: un solo blocco `@media screen { … }` in fondo al `<style>` principale (commento «v104 — Look "P2"»). **Tutti i colori sono già calcolati** (OKLCH → esadecimale, tagliati nel gamut sRGB come fa Chromium): niente sintassi «colore relativo», solo `color-mix` (già usato in v101) e `:has()` (fascia «Da conf.», segue da sola il pulsante che il codice ricostruisce). Variabili `--k4-*`: tema su `html` (`--k4-fr`, `--k4-fr2`, `--k4-pa/pb/pbd` = fondo/bordo pillola, `--k4-ring`, `--k4-psh`, `--k4-hi`, `--k4-hla`), tinta per riquadro su `.pc-loc.vcN` (`--k4-fill`, `--k4-b1/b2` barretta, `--k4-pl` zoccolo, `--k4-sep` filetto) e per trasportatore su `.pc-c-trasp.tk-<chiave>` (`--k4-tx` nome, `--k4-b1/b2`, `--k4-pl`). **Chiaro e scuro stanno entrambi nel CSS** → il cambio tema non ridisegna nulla.
- **Specificità**: prefisso `html:not([data-pcmode="excel"]):not([data-pcmode="none"]) body #desktopBody` (due `:not` + `body` apposta) per battere le regole dei livelli di grandezza `html[data-pcmode="cards"]:not([data-pclvl="0"]) #desktopBody …` (1,3,1); le misure usano `calc(… * var(--pc-f,1))` / `var(--pc-p,1)` per seguire i livelli. Gli stili in linea di `.pc-loc`, `.pc-trasp-in`, `tr.pc-trip` sono battuti con `!important`.
- **JS (ES5)**: `_vvNorm` (maiuscolo, toglie SRL/SPA/SAS/SNC finale: «ROSSI» e «ROSSI Srl» sono lo stesso codice), `_vvArchCounts` (conta i viaggi dell'archivio rileggendo `weekArchive` solo se cambia la lunghezza del testo salvato; testo illeggibile = ignorato), `_vvBuild` (conta partenze → fornitori e arrivi → clienti su settimana + prossima + archivio; ordina per viaggi, poi ruolo `a`<`f` (cliente prima), poi codice; per ruolo i primi `_VV_TOPN=6` con almeno `_VV_MINN=2` viaggi; le tinte `0…11` si assegnano **in ordine di classifica globale**; un codice già mappato non si ripete), `_vvReset()` (chiamato all'inizio di ogni `renderDesktopView`), `_vvCls(code)` → `' vv vcN'` o `''`. In `tripRow`: classe `pc-today` sulla riga di oggi, `tk-<chiave>` sul `<td>` del trasportatore, `_vvCls(...)` sui due `.pc-loc`; pallino trasparente (visibile solo in Excel via CSS), codice in `var(--text)`, località arrivo in `var(--text)`.
- **Generatore**: `apply104.py` (+ `okl.py`, conversioni OKLCH) in `test_v74/v104/`: legge la v103, calcola i colori, scrive il CSS e applica le sostituzioni con controlli (`assert` su ogni punto di aggancio). Rilanciarlo non duplica nulla (parte sempre dal file v103). **Per cambiare una tinta**: modificare `VV_ORDER`/`CARRIERS` o i numeri L/C in `apply104.py` e rigenerare (non ritoccare gli esadecimali a mano).
- **Tinta = classifica**: i colori dei codici dipendono dalla classifica dei viaggi (settimana + archivio): se un fornitore sale/scende in classifica può cambiare tinta, e se due codici hanno lo stesso numero di viaggi decide l'ordine descritto sopra. Scelta voluta per dare le tinte più distinguibili ai codici più usati; se Fil preferisse tinte «fisse» per codice serve una tabella salvata (non fatto).

**Numeri e compromessi da conoscere**
- **Righe più alte di 3px** (zoccolo 4px invece del bordo 1px): in Schede livello 0 le righe vanno da 71 a 82px (prima 68–79). Soglie dei test aggiornate: `s11` ≤ 84px, `th11` 66–74 / 78–85.
- **Contrasto del nome del trasportatore sulla pillola**: scuro ≥ 4,1 sul punto più chiaro (≥ 4,8 a metà); **chiaro 2,96 sul punto più chiaro e 3,6 a metà (il più basso è CONSAR, rosso)**. È il disegno scelto da Fil; il «pulsante» per migliorarlo è un solo numero: nel CSS `--k4-pa`/`--k4-pb` del tema chiaro (ora `.50`/`.40` di luminosità; con `.44`/`.36` si arriva a ≥ 4,5 a metà). Da proporgli solo se dice che si legge male.
- **Etichette** FORNITORE/LOCALITÀ in tema scuro sui riquadri colorati: `var(--text-soft)` invece di `--text-dim` (contrasto ≥ 3 anche su verde/teal scuri).
- Il test `s23` dà «1–50 di 1684» invece di «1.684» **solo su questa macchina** (lingua del browser senza separatore delle migliaia): identico sulla v103, non è una regressione.

**Test**: nuovo `s32.js` (87 controlli: classifica con pari merito, «SRL» ignorato, archivio contato e archivio rotto, bordi/zoccoli/angoli/barrette dei riquadri, tinte calcolate, contrasti codice/località/etichette, 11 pillole, sfondo riga nei 3 toni e in OGGI, «Da conf.» e «Segna» con mouse/tastiera/clic, cambio tema dal vivo, ridisegno, Excel, 7 livelli, telefono, nessun nome nel file). Adattati: `s11`, `th11`, `s22` (confronta la **tinta** ±22° con l'elenco della mail, non più il fondo), `s31` (versione), `swtest` (legge `/home/claude/app.html` e `/home/claude/theme/sw.js`), `runall104.sh`. **Batteria finale (08/11)**: s32 87 · s31 79 · s30 165 · s29 30 · s27 37 (rilanciata da sola: nel giro automatico aveva dato un falso rosso di tempo) · s26 66 · s25 115 · s24 77 · s2 31 · s3 40 · s4 14 · s8 40 · s9 8 · s10 12 · s11 17 · s12 131 · s13 113 · s14 58 · s15 95 · s16 97 · s17 35 · s19 74 · s20 101 · s21 18 · s22 25 · swtest 12 · th5 38 · th10 69 · th11 88 · s23 152/153 (l'unico rosso è «1.684» scritto «1684» per la lingua del browser di questa macchina, identico sulla v103); poi `audit3b.js` (scimmia, 6 giri PC chiaro/scuro + telefono, ~450 clic ciascuno) 0 errori JS, `audit_loc.js` 0 elementi iniettati — `lintcheck.sh` pulito, scansione nomi pulita.

**Da fare / proposte rimaste (NON approvate)**: (1) allineare al nuovo look i **chip dei trasportatori nella barra** e le **intestazioni dei giorni**; (2) **telefono**: portare lo stesso linguaggio (barretta colorata solo per i codici frequenti) — **mostrare PRIMA un'anteprima** a Fil; (3) eventuali tinte fisse per codice (vedi sopra); (4) se Fil dice che il nome del trasportatore sul chiaro si legge poco: scurire un filo la pillola (vedi «Contrasto»).

---

## Novità v103 — controllo generale del codice (06/11, richiesta di Fil: «controlla tutto il codice: miglioramenti, bug, errori»): solo correzioni piccole, nessun cambio di aspetto

**Come è stato fatto**: analisi statica (sintassi, `no-undef`, ID duplicati, gestori `onclick` verso funzioni inesistenti → tutto pulito), «scimmia» Playwright (`audit3.js`: ~450 clic casuali a run su ciò che è davvero visibile, PC chiaro/scuro e telefono, 21 run → 0 errori JS), nomi «cattivi» (`nasty.js`, `audit4.js`, `audit5.js`: apostrofi, virgolette, `<b>`, `<img onerror>`, `</script>` → nessun XSS), date limite (`audit6.js`: 28/12, 1/1, ora legale, sabato/domenica → sempre Lun–Ven consecutivi), memoria del browser rovinata (`audit7.js`). Script: `v103.py` (parte da `out102.html`, scrive `out103.html`), test nuovo `s31.js` (79 controlli), `runall103.sh`.

**Corretto**
1. **Privacy**: un commento della v101 nel file pubblico conteneva tre nomi di clienti («incontrato e assofrutti… sicem…»): riscritto senza nomi (anche in `v101_pal.js`). Scansione del file: restano solo i nomi dei trasportatori (rimando già noto) e l'esempio «San Felice sul Panaro» in un commento vecchio.
2. **Archivio**: `asSetTrasp`/`asSetProd` mettevano il nome dentro `onclick="…('NOME')"` togliendo solo gli apostrofi → un nome con `"` o `\` rompeva il pulsante. Ora `_escH(...)` + barra rovesciata raddoppiata. (Con gli apostrofi andava già.)
3. **«Modifica viaggio»**: `editTrip(i)` non apre se il viaggio non c'è; `_commitEditForm` non scrive più se l'elenco è cambiato nel frattempo (prima: `trips[17] = …` su un elenco più corto → «buchi» `undefined` salvati in memoria e su Drive → errori a ogni apertura). Non raggiungibile con un clic normale (la finestra copre la lista) ma possibile con una sincronizzazione Drive mentre la finestra è aperta.
4. **Dati rovinati** (`_tripsSane`): all'avvio e nelle unioni con Drive si scartano gli elementi che non sono viaggi (null, numeri, testo) e i campi data/trasportatore/partenza/arrivo diventano sempre testo; `loadArchive()` fa lo stesso per ogni settimana (titolo testo, `trips` array) e, se il testo è illeggibile, ne tiene una copia in `weekArchive_corrotto` (analogo `viaggiLogistica_corrotto`) prima che venga sovrascritto. Anche `bulkLearnFromAllTrips`, l'elenco trasportatori all'avvio e `_nwrDates` ignorano i buchi. NON gestite (restano un limite): liste `transportersList/partenzaList/arrivoList/prodottiList` che non siano array JSON (le scrive solo l'app).
5. **Anno ISO** (`getWeekYear`, anno del giovedì): titoli automatici «Settimana N/AAAA» a cavallo del 1° gennaio (1/1/2027 = settimana 53 del **2026**; 29/12/2025 = settimana 1 del **2026**). Usato in `applyTitleSuggestion`, «Nuova settimana» (2 punti) e nel titolo creato da `lun`.
6. **Date proposte a inizio anno**: `desktopGetNextWeekday` (2 copie: PC e telefono) deduceva l'anno del «Lun. gg/mm» del titolo con `if (mm2 < now2.getMonth()) yyyy2++` (mese 1-12 contro 0-11): il 5/1/2027 con titolo «Lun. 28/12» e nessun viaggio nella settimana in corso proponeva **dicembre 2027**. Ora si sceglie fra anno−1/anno/anno+1 quello più vicino a oggi.

**Segnalato a Fil, NON modificato**
- PC, di **sabato**, «Questa settimana» con settimana vuota propone le date della settimana appena finita (di domenica e sul telefono propone la prossima): incoerenza storica di `desktopGetNextWeekday` (`getMondayOf` sposta solo la domenica). Allineare è una scelta di comportamento → chiedere.
- Codice vecchio non più raggiungibile dopo un `return` (`toggleAddForm`, `openMultiTratta`, `_addSameAs`, `tapOpen`, `desktopAddEmpty`) e `desktopToggleTotals` (cerca `btnTotals`, che non esiste): innocuo, da togliere in una pulizia.
- ~~Nomi dei trasportatori nel file pubblico~~ — **DECISO da Fil il 07/11: i nomi dei trasportatori POSSONO restare nel file; non fare colori automatici né togliere i nomi.** Contano solo clienti e fornitori/impianti: nel file non ce ne sono (scansione 07/11 su tutti i nomi tolti nella v97: zero).
- `_commitEditForm` rimpiazza l'oggetto viaggio senza `id`: l'id viene riassegnato al salvataggio (comportamento di sempre, ok per la sincronizzazione).

**Batteria finale v103 (06/11, tutta verde)**: s31 79 · s30 165 · s29 30 · s27 37 · s26 66 · s25 115 · s24 77 · s2 31 · s3 40 · s4 14 · s8 40 · s9 8 · s10 12 · s11 17 · s12 131 · s13 113 · s14 58 · s15 95 · s16 97 · s17 35 · s19 74 · s20 101 · s21 18 · s22 25 · swtest 12 · th5 38 (falso rosso sotto carico nella batteria, da solo 38/38) · th10 69 · th11 88 · s23 153. Poi `audit3b.js` (scimmia), `audit4.js`, `audit5.js` (nomi «cattivi»), `audit7.js` (dati rovinati: i 4 «problemi» rimasti sono attesi = testo non JSON che scrive un messaggio in console, e liste che non sono array) tutti puliti. Lanciare `bash runall103.sh` (mai due Playwright insieme, ~15 min, con `nohup` in background).

**Per la prossima chat — da fare ancora**: pulizia del codice morto di «Aggiungi»; decidere con Fil il comportamento del sabato sul PC; ricordargli di aggiornare l'app (⋯ → «Aggiorna app»).

## Novità v102 — «Nuovi viaggi» a PLANNER (griglia: una riga per tratta, una colonna per giorno Lun–Ven) — sostituisce il disegno v100/H2b

**Contesto** (06/11, pomeriggio): con i 15 trasportatori veri la v100 (come la v99) era troppo grande e i nomi risultavano troncati. Fil: «prendi ispirazione da app di logistica». Disegnato un planner a griglia (mock `x100e.js`, solo immagini) → Fil: «mi sembra che vada bene». Realizzato in `v102.py` + `v102_p1_planner.py` (parte da `out101.html`, scrive `out102.html`). Moduli: `v102_nwr.js` (tutto il JS del planner, ES5), `v102_nwr.css` (generato da `mkcss102.py`: righe tenute da `v100_nwr.css` + `v102_new.css`). **`_nwrCommit` NON è stato toccato** (resta quello della v100 con l'aggancio v101 `_mwAfterAdd`): il modulo nuovo termina subito prima di `function _nwrCommit`.

1. **Schermata**: testata con titolo, sottotitolo settimana e interruttore «Questa settimana / Prossima»; barra con **«+ Aggiungi tratta»** e selettore dello stato dei NUOVI viaggi (**Confermato / Da confermare**, `#nwrMode`, classe `.w` quando è «da confermare»); sotto la **griglia**; in fondo totali (`N viaggi · n confermati · n da confermare`) e **«Aggiungi N viaggi»** (`#nwrGo`). PC ≥1000px: finestra 1020px, intestazione fissa «TRATTA · LUN 09 … VEN 13», ogni riga = barra colore del trasportatore a sinistra + cartellino + «Da → A» per intero (va a capo, mai tagliato) + prodotto + 5 caselle da 90px + «⋯» e cestino. Telefono: foglio dal basso, ogni tratta è una scheda (cartellino + «⋯» e cestino in alto, tratta a tutta larghezza, sotto i 5 giorni con il nome del giorno dentro la casella). Altezza minima della finestra per non «saltare» (`min-height`).
2. **Giorni**: **un tocco su una casella = +1 viaggio** con lo stato scelto in alto (✓ azzurro = confermato, ⚠ giallo = da confermare, diagonale se misto). Il piccolo **«−»** in alto a destra della casella (solo se ha viaggi) toglie l'ULTIMO aggiunto di quel giorno. Nessun «già N» visibile (resta nell'`aria-label`/`title` di ogni casella).
3. **«Aggiungi tratta»** (`#nwrPn`; popover sotto la barra su PC, foglio dal basso su telefono, con velo `#nwrScrim`): ricerca (`#nwrQ`, Invio con un solo risultato lo sceglie), pillole dei 15 trasportatori (`#nwrPc`, `_tqCarList`, più usati prima; tocco = filtra, secondo tocco = toglie il filtro), «Tratte più usate [di X]» / «Risultati» (`#nwrPr`, da `_rfRoutes('')` filtrate in memoria; ✓ sulle tratte già inserite), **«Scrivi una tratta nuova…»** (riga vuota con i dettagli aperti e il cursore su Trasportatore/Da). Si apre da solo quando non ci sono righe; riaprendo parte dal trasportatore dell'ultima riga. **Stessa tratta già presente → non ne crea una seconda: si porta lì e la evidenzia** (`.flash`). Esc: prima chiude i suggerimenti scritti, poi l'elenco, poi la finestra (con domanda se ci sono viaggi scelti).
4. **«⋯» di ogni riga** = dettagli: Trasportatore, Da, A, Prodotto, N. DDT, Note (con suggerimenti `_nwrAc*`) e **«Altro giorno — un viaggio in più»** (data libera: se cade in uno dei 5 giorni mostrati va in quella colonna, altrimenti compare come pillola «Sab 14/11» sotto la tratta: tocco = cambia stato, ✕ = toglie). Puntino arancio su «⋯» quando ci sono DDT o note. DDT/nota compaiono nel riepilogo della riga.
5. **Conferma** (`nwrConfirm`): le righe SENZA viaggi sono ignorate; riga con viaggi ma senza trasportatore/partenza/arrivo → messaggio «Tratta N: manca l'arrivo…», dettagli aperti e campo in rosso. Le date vengono da `_nwr.dates` (stessa logica di v100: PC `desktopGetNextWeekday`, telefono lunedì di calendario).
6. **Stato/ID**: `_nwr = {wk, mode, rows:[{car,f,a,p,note,ddt,x,slots:[{d,date,st}]}], cars, all, pnl, pn:{open,q,car}, dates, have}`; `#nwrOv #nwrCard #nwrWk #nwrSub #nwrBar #nwrAdd #nwrMode #nwrBody #nwrGrid (.pl-hd .pl-ln[data-i] .pl-info .pl-days .pl-tools .pl-xr) #nwrScrim #nwrPn #nwrQ #nwrPc #nwrPs #nwrPr #nwrTot #nwrGo #nwrMsg #nwrAc`; azioni `data-a`: close cancel go wk mode padd pclose pcar proute pnew day dec xtra xdate flip unslot rowdel. Entrate invariate: `nwrOpen(pre)` (pre = `trasportatore/partenza/arrivo/prodotto/note/ddt/daConfermare` → una riga precompilata senza giorni, elenco chiuso, dettagli aperti solo se manca trasportatore/Da/A), `nwrToggle`, `nwrClose(ask)`, `nwrConfirm`. Aggiornamenti mirati (non si ridisegna tutto: le caselle di testo non perdono il cursore): `_nwrRefCells(i)`, `_nwrRefInfo(i)`, `_nwrPaintGrid()`.
7. **Test**: nuovo `s30.js` (165 controlli: apertura/Esc, elenco, giorni, «−», stato, righe multiple, dedupe, ricerca, «Scrivi una tratta nuova…», DDT/note/altra data, validazione, salvataggio, «Prossima», ingressi, contrasto/dimensioni/allineamento in chiaro e scuro, 1280×720, telefono); `s12.js` (131), `s13.js` (113), `s25.js` (115) riscritti sul planner (le versioni v100 sono `*_v100_old.js`, `s28.js` è obsoleto → `s28_v100_old.js`); `swtest.js` ora usa `out102.html`; `runall102.sh`.
8. **Limiti noti / idee**: più di ~6 tratte nella stessa schermata → la griglia scorre (l'intestazione resta ferma); il «−» è un po' piccolo sul telefono (28px, appoggiato all'angolo della casella); per cambiare lo stato di UN viaggio già inserito si usa «−» e poi si ripete il tocco con lo stato giusto (le pillole «altro giorno» invece si girano con un tocco). Possibile miglioria non richiesta: dopo «Aggiungi» proporre di aprire la Mail della settimana per i trasportatori toccati.

## Novità v101 — colori diversi per fornitori/clienti · pulsanti di riga più visibili · mail di INTEGRAZIONE (solo i viaggi aggiunti dopo l'invio)

**Contesto** (06/11): INCONTRATO e AssoFrutti sembravano lo stesso verde, SICEM Srl era un oliva quasi invisibile nel tema chiaro; i pulsanti di riga della lista PC (segna / nota / duplica / elimina) erano quelli «della prima versione», troppo fiochi; Fil voleva un avviso quando un viaggio aggiunto dopo l'invio della mail a un trasportatore, e una mail con SOLO quel viaggio. Script: `v101.py` (parti `v101_p1_pal.py`, `v101_p2_rowbtn.py`, `v101_p3_mail.py`; sorgenti `v101_pal.js`, `v101_rowbtn.css`, `v101_mail.js/.css`).

1. **Palette codici** (`v101_pal.js`, prima di `_locationCodeColor`): 12 tinte (rosso, arancio, senape, oliva, verde, smeraldo, azzurro, blu, viola, magenta, rosa, ardesia), ognuna con valore `lt`/`dk`; `_codePal(code, theme)` → `{bg, bd, tx}`. Assegnazione **dai dati, senza salvare nulla** (`_codeBuild/_codeAssign`, cache `_codeMaps`, `_codeResetMaps()`): per ruolo (fornitori prima, i clienti evitano le tinte già usate), nell'ordine di comparsa; codici sconosciuti → `hash % 12`. Limite: oltre 12 codici per ruolo le tinte si riusano; aggiungere un codice nuovo può spostarne altri solo per le collisioni. `_locationCodeColor` (telefono) e `_locationCodeColorPC(code, theme)` (PC; le esportazioni Excel passano `'light'`); `_impactColor` = bordo. SICEM e SICEM Srl sono due codici diversi (suggerito: unificare i nomi).
2. **Pulsanti di riga PC** (`_pcStatoInner(idx,t)`, `.pc-sbar .pc-st(.on) .pc-ib .pc-note(.has) .pc-dup .pc-del`, `.pc-row-actions`): bordati da 32px, icone SVG, pillola «Segna / Da conf.» larga 98px, colori al passaggio; verificato in chiaro/scuro e modo «schede»/«excel» (`html[data-pcmode]`, scala `--pc-f`). Colonna azioni 206px.
3. **Mail di integrazione** (`v101_mail.js`): `localStorage.mailSent = {lunedì:{trasportatore:{t,name,sig,snap}}}` (per browser, NON sincronizzato); `_mwSnap` (chiavi `tratta|giorno`, `…~w` per «da confermare»), `_mwStatus` todo/sent/changed. Dopo ogni aggiunta (`_nwrCommit` e `_pcDupConfirm` chiamano `_mwAfterAdd(newTrips, toNext)` con 300ms di ritardo) **solo su PC** e **solo se la mail di quel trasportatore per quella settimana era già segnata «mandata»** compare l'avviso `#mwaOv` («Devi mandare un’integrazione a X: N viaggi nuovi») con «Apri la mail». Nella schermata Mail della settimana lo stato «cambiata» mostra l'interruttore `#mwScope` **«Solo i viaggi nuovi (N)» / «Tutta la mail aggiornata»** (`mwSetScope('new'|'all')`); predefinito = solo i nuovi: oggetto «X - Integrazione programma settimana prossima», testo con l'intestazione `ihead` (modello `_mailTplGet/Set`: «Ad integrazione del programma già inviato, aggiungo questi viaggi:») + SOLO le tratte nuove + chiusura; «Tutta la mail aggiornata» = come prima («(aggiornato)», pulsante «Rimanda aggiornata»). Se è stato solo TOLTO un viaggio non c'è interruttore. Il telefono non ha `mailSent`: nessun avviso (resta il numerino «Mail» sul PC come promemoria).
4. **Test**: `s29.js` (nuovo, 30), `s26.js` (colori: formato esadecimale, assegnazione a liste, `partenzaList.push('Loc (X)')`, `_codeResetMaps()`), `s20.js` (ora prova «Tutta la mail aggiornata» con `mwSetScope('all')` dopo aver verificato l'«Integrazione» di partenza), `s19.js` (versione `v10x`), `runall101.sh`.

**Batteria finale v102 (06/11, tutta verde)**: s30 165 · s29 30 · s27 37 · s26 66 · s25 115 · s24 77 · s2 31 · s3 40 · s4 14 · s8 40 · s9 8 · s10 12 · s11 17 · s12 131 · s13 113 · s14 58 · s15 95 · s16 97 · s17 35 · s19 74 · s20 101 · s21 18 · s22 25 · swtest 12 · th5 38 · th10 69 · th11 88 · s23 153. Lanciare `bash runall102.sh` (mai due Playwright insieme; ~15 min, in background con `nohup`). th5 può dare un falso rosso sotto carico: rilanciarlo da solo.

**Ancora da fare (rimandato)**: pulizia della cronologia git; pulizia del vecchio codice morto di «Aggiungi»; verificare nel programma di posta vero come si comporta il testo della mail; ricordare a Fil di aggiornare l'app (⋯ → «Aggiorna app») — la sua foto mostrava ancora la v99.

## (DISEGNO SCHERMATA SUPERATO dalla v102 — `_nwrCommit` e la logica dati restano validi) Novità v100 — «Nuovi viaggi» rifatta (variante H2b «tratta prima») · Mail della settimana più curata · testo della mail già dentro la posta · «(da confermare)» e righe bianche nel testo

**Contesto** (06/11): la v99 sul PC vero non andava (fascia delle tratte che occupava tutto lo schermo, riga in corso segnata solo da un filo blu, «già N» che sporcava, Da/A tagliati). Fil ha chiesto nuove varianti → sul Design canvas sono state disegnate H1–H4 (+ H2b); ha scelto **H2 «Tratta prima»**, poi **H2b = H2 a due colonne sul PC** («ok proviamo a farla così»). Script: `v100.py` (out99 → out100) con le parti `v100_p1_mail.py`, `v100_p1b_open.py`, `v100_p2_btn.py`, `v100_p2b_mw.py`, `v100_p3_nwr.py` + `v100_nwr.js`, `v100_nwr.css`, `v100_mw.js/css`, `v100_btn.css/btn2.css` (tutto in test_v74/ o accanto agli script di build). ES5. **Il modello dati e `_nwrCommit` sono quelli della v99** (`_nwr.rows[]` = tratte, ognuna con i suoi `slots`).

### A) Schermata «Nuovi viaggi» (H2b) — sostituisce il disegno v99 (stesse funzioni d'ingresso `nwrOpen/nwrToggle/nwrClose/nwrConfirm`)
1. **Tre passi numerati**: **1 Trasportatore** (pillole nel colore dell'app, più usati prima, «Altro…» con campo; senza storico il campo del nome è subito pronto) → **2 Tratta** (scheda grande con barra colore larga 12px + alone: trasportatore, «Da → A» scritti per intero, prodotto; pulsante **«Tratte più usate (N) ▾»** = tendina **CHIUSA a ogni apertura** (non si ricorda lo stato); scelta una tratta la tendina si richiude e le righe «salgono»; **matita** = scrivere/modificare Da, A, Prodotto a mano — obbligatoria da soli se il trasportatore non ha tratte) → **3 Giorni** (pannello **Confermato / Da confermare** con due pulsanti grandi pieni quando attivi + 5 giorni «Lun 05 … Ven 09» **senza «già N»** visibile — il conteggio resta in `title`/`aria-label`; ogni tocco = un viaggio; chip blu ✓ n / ambra ⚠ n; giorno misto = `.mx`) + «DDT, note, altra data» + **«Aggiungi un'altra tratta»** (senza giorni scelti avvisa e non crea tratte vuote).
2. **«Viaggi pronti»**: pannello a destra su PC (≥1000px, sticky), sotto su telefono. Un gruppo per tratta (cartellino colore, Da → A, gettoni dei giorni: tocco = cambia stato ✓/⚠, ✕ = toglie; ✎ = riporta quella tratta nel costruttore, cestino = toglie). Totali in fondo: `N viaggi · n confermati · n da confermare` e «Aggiungi N viaggi».
3. **Stato/ID**: `_nwr = {wk, mode, cur, rows:[{car,f,a,p,note,ddt,x,ed,slots}], routes, cars, oth, acc, dates, have}`; `#nwrOv #nwrCard #nwrWk #nwrSub #nwrBld #nwrPills #nwrOth #nwrRc #nwrRtop #nwrAb #nwrMode #nwrDays #nwrXb #nwrXtra #nwrSide #nwrTot #nwrGo #nwrMsg #nwrAc`; azioni `data-a`: close cancel go wk mode car carother tacc redit route addrow xtra day xdate flip unslot rowedit rowdel. Autocompletamento mentre si scrive e Esc/clic-fuori come in v99. Colori: `_nwrCarVars(nome)` (un solo punto da cambiare per i colori automatici).
4. **Test**: `s28.js` riscritto (124 controlli), `s12`, `s13`, `s25` adattati (le vecchie versioni v99 sono `*_v99_old.js` in test_v74/). **Batteria completa (06/11, file finale)**: s27 37, s28 124, s26 66, s25 110, s24 77, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 131, s13 113, s14 58, s15 95, s16 97, s17 35, s19 74, s20 100, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, s23 153 → tutto verde; `lintcheck.sh` pulito. Lanciare con `runall100.sh` (copia prima il file in `/home/claude/app.html`; non lanciare altri Playwright insieme; th5 può dare un falso rosso se la macchina è carica: rilanciarlo da solo). Foto: `x100b.js`.

### B) Mail della settimana
1. **Schermata rifatta** (`v100_mw.*`): binario dei trasportatori a sinistra (pallini con stato), «foglio» della mail al centro (oggetto + testo con tratte in grassetto sottolineato), avanzamento «N di M mandate» in testata, pulsanti più curati e colorati; riga in basso con interruttore del modo (`#mwMode`) e ✎ modifica testi.
2. **Testo nella posta**: il pulsante apre `mailto:?subject=…&body=…` con il testo GIÀ scritto (modo **«nel corpo»**, predefinito `localStorage.mailMode='body'`; se il link supera ~1900 caratteri ricade sul modo «incolla»). In parallelo copia anche la versione formattata (HTML, grassetto/sottolineato) negli appunti: se lo vuoi formattato, selezioni il testo nella mail e Ctrl+V. Modo **«incolla»** (`mailMode='paste'`, `mailSetMode`): apre solo l'oggetto e il testo va negli appunti. **Non provabile da qui con il vero programma di posta di Fil: da verificare.**
3. **Pulsante «Mail»**: tolto dalla riga Giorno (era grande e arancio); ora è un pulsantino neutro «✉ Mail» con numerino (`.pcb-mailprog`, `#pcMailProgBtn`) nella barra in alto (riga 1, dopo l'icona telefono). Interpretazione di una frase ambigua di Fil: se lo voleva da un'altra parte basta spostare una riga in `v100_p2_btn.py`. Anche `.srch-send`/menu «Invia ▾» e `#srchMailBtn` sono neutri.
4. **Testo della mail**: riga bianca tra «Buongiorno,» e «Di seguito invio programma…» (`_MAIL_HEAD_DEF`; chi aveva salvato il vecchio testo standard lo ritrova aggiornato), riga bianca tra il titolo della tratta (grassetto sottolineato) e le righe «N. 1 viaggio LUN», riga bianca tra una tratta e l'altra; un viaggio **da confermare** è scritto `N. 1 viaggio LUN (da confermare)` con «(da confermare)» in grassetto sottolineato (`daysW` in `_srchTratteFromTrips/_srchTratteAggregate`, `_srchDayLines`); `_mwSnap/_mwDiff` tengono conto dei «da confermare» (chiave `~w`).
5. **Test**: `s20.js` aggiornato (nuovi testi, URL con corpo, modo «incolla», pulsante nella barra) e `s24.js` (pulsante «Mail» in barra: piccolo, non più vicino a VEN; contrasto misurato sul fondo vero).

### C) Rinviato (v101+)
Colori automatici dei trasportatori (tabella a slot sincronizzata su Drive; togliere i nomi da `getTransporterKey`, CSS `--t-*` e mappe), pulizia della cronologia di GitHub, caricamento/`sw.js` (invariato v89), pulizia del codice morto del vecchio modulo (v99 punto 7: vale ancora).

---

## (DISEGNO SUPERATO dalla v100; logica dati, ingressi e codice morto restano validi) Novità v99 — UNA sola schermata «Nuovi viaggi» (PC e telefono) · «Da confermare» per ogni singolo viaggio · Multi-Tratta confluito in «Aggiungi una riga»

**Richiesta di Fil** (06/11): dopo le varianti A–G scelta **G4 «Pastello»** (ibrido A+D: righe in linea + pillole trasportatore + tratte più usate; stati confermato/da confermare in tinte chiare, niente colori pieni). Prima: «non è possibile avere 2 sistemi di aggiunta viaggi diversi», «da confermare anche a solo 1», «troppo grande/scomoda». Script: `v99.py` (out98 → out99) + `v99.css` + `v99_nwr.js` (test_v74/). Tutto in ES5. Test: `s28.js` (nuovo), `s12/s13/s25` riscritte (sezioni sul vecchio modulo), `s15` ritoccata, `s26/s19/swtest` portati a v99 (le vecchie versioni sono in test_v74/ come `*_v98_old.js`).

1. **Dove si apre** (tutti gli ingressi chiamano `nwrOpen(pre)` o `nwrToggle()`): «+» in basso e FAB del telefono (`toggleAddForm`), «＋ Aggiungi» e «Nuova riga» del PC e tasto **N** (`desktopAddEmpty`), «Un altro uguale» del riepilogo (`_addSameAs`), Duplica (`duplicateTrip`), `tapOpen`, `openMultiTratta`. **Tolti** i tre pulsanti «Multi». `nwrOpen` non fa nulla se la schermata è già aperta (la bozza non si azzera, es. N premuto col fuoco su un pulsante).
2. **Com'è fatta**: titolo + settimana («Lun 05/10 – Ven 09/10»); commutatore **Questa settimana / Prossima**; «pennello» **Confermato / Da confermare** = stato dei prossimi tocchi; fascia con **pillole trasportatore** (più usati prima, «Altro…») e **tratte più usate** del trasportatore scelto (un tocco compila Da, A, prodotto della riga in corso; con un solo trasportatore con una sola tratta, la tratta è già scelta); **righe**: trasportatore (nel suo colore), Da, A, Prodotto, 5 celle-giorno (vuota = «+» tratteggiato, blu = confermati, crema = da confermare, badge se misti; ogni tocco = +1 viaggio), «…» (N. DDT, Note, **Altra data**) e cestino; intestazione PC con «Lun 05 · già N» (viaggi già in programma); **gettoni** sotto la riga in corso: ogni viaggio è un gettone (tocco = cambia stato, ✕ = togli) — aggiunta mia rispetto ai mock, serve per cambiare/togliere un singolo viaggio; «Aggiungi una riga» (eredita il trasportatore); piede con totali («5 viaggi · 3 confermati · 2 da confermare»), Annulla, **Aggiungi N viaggi**.
3. **Telefono**: foglio dal basso; le righe già fatte si chiudono in una **scheda riassunto** (✎ per riaprirla), solo la riga in corso è aperta. **PC (≥1000px)**: scheda centrata larga, una riga = una riga di griglia.
4. **Stato** `_nwr = {wk:0|1, mode:'c'|'w', cur, rows:[{car,f,a,p,note,ddt,x,slots:[{d:'lun'..'ven'|'', date:'', st:'c'|'w'}]}], routes, dates, have}`. Date: PC = `desktopGetNextWeekday` con `_pcWeekMode` forzato per la settimana scelta; telefono = `_nwrMonPhone` (sabato/domenica → la settimana che inizia). Salvataggio `_nwrCommit(newTrips, toNext)`: settimana corrente → `trips` + `saveToLocalStorage` + `autoSaveDrive`; **prossima → `tripsNext`** + `saveNextToLocalStorage` (solo locale, come prima). `daConfermare` è **per viaggio**. Sul telefono mostra `showSummaryModal` (con «Un altro uguale»), sul PC ridisegna la tabella.
5. **Colori**: `_nwrCarVars(nome)` dà `--nc/--nci` dalle variabili del trasportatore (`--t-<chiave>-fill/-ink`, via `getTransporterKey`) → **un solo punto da cambiare** quando i colori diventeranno automatici (v100+). Le righe sono neutre con una barra a sinistra nel colore del trasportatore (le tinte di sfondo `--t-*-bg` sul telefono non sono coerenti con i riempimenti). Stati: celle/gettoni confermati e da confermare con variabili `--nw-ok-*`/`--nw-wn-*` (chiaro: #dbe8f3/#5f8db8/#1d3d5c e #f6e9c4/#c8a24a/#5a4208). Testi ≥ 12 px, campi 16 px, bersagli ≥ 40 px.
6. **Dettagli**: suggerimenti mentre si scrive in un solo riquadro `#nwrAc` (Da/A dopo la prima lettera, Prodotto subito; si nasconde con clic, Esc, scorrimento); Esc chiude (con conferma se ci sono viaggi nella bozza; col riquadro suggerimenti e testo scritto il primo Esc chiude solo quello); clic sul fondo = chiude, ma trascinare da un campo fino fuori NON chiude; blocca lo scorrimento della pagina; `_pcAnyOverlayOpen()` la riconosce (rotella e PagGiù non muovono la lista dietro); validazione: «Riga 2: manca la partenza e l'arrivo» (campi segnati in rosso, la riga diventa quella in corso). Telefono: la tastiera non si apre da sola se ci sono pillole/tratte da toccare.
7. **Codice vecchio MORTO ma ancora nel file** (si potrà ripulire con calma, con un test per volta): corpi di `toggleAddForm`, `desktopAddEmpty` (+ `_dmEnsureModal`, `desktopConfirmAdd`, `_dayPicker*`), `openMultiTratta`/`mt*`/`#multiTrattaModal`, `tapOpen`/`_tq*`/`#tapSheet`, il modulo `#addTripSection`/`#tripForm` e le «Rotte frequenti» `_rf*`/`_rfRender`, `_commitNewTrips`. **NON cancellare**: `_rfRoutes` e `_tqCarList` (le usa la nuova schermata), `showSummaryModal`, `learnFromTrip`, `addLocationToList`, `_scrollToTrip`, `_lmRevive`.
8. **Da verificare da Fil** (non provabile da qui): uso con il dito sul vero telefono Android (altezza dello schermo con la tastiera aperta: il foglio è alto al massimo 96% e il corpo scorre); letture dei colori sul suo schermo (astigmatismo): se un colore di stato non si legge bene si cambia in una sola riga di CSS; la settimana scelta di default nel fine settimana (sabato/domenica = la settimana che inizia).
9. **Test**: Batteria completa (06/11, sul file finale): s27 37, s28 109 (nuovo: PC e telefono, chiaro/scuro, stato per viaggio, righe, tratte, validazione, salvataggio, ingressi, Esc), s26 66, s25 106 (sezioni 2–5 riscritte), s24 74, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 137 (riscritta), s13 119 (parte PC riscritta), s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, s23 153 → tutto verde; `lintcheck.sh` pulito sul file finale. Dopo l'ultimo ritocco di CSS (campo colorato col cursore, piede del telefono) sono stati rilanciati s28, s12, s13, s25, s19. Nota: lanciare s27 sempre da solo; la batteria è `runall99.sh`.

## Novità v98 — luminosità e contrasto a tacche (come la dimensione delle righe) · analisi della schermata «Nuovi viaggi» (REALIZZATA in v99: vedi sopra)

**Richiesta di Fil** (06/11, 10:08): «per la luminosità metti un potenziometro come quello per la dimensione del carattere… più, meno… luminosità e tutto quanto posso regolarle». Script: `v98.py` (out97 → out98); test `s27.js` (test_v74/). Tutto in ES5.

1. **Dove**: menu «Aspetto» (icona sole/luna, `#themeMenu`): sotto i toni (1/2/3) ci sono due righe, **Luminosità** e **Contrasto**, ognuna `−` · 7 tacche · `+` (stessa grafica di «Dimensione delle righe» della vista PC, classe `.tm-step`, `data-look="bri|con"`). Livelli da −3 a +3, 0 = com'era prima. Tasto «Ripristina» (`#tmLookReset`) compare solo se almeno un livello è diverso da 0. I `−`/`+` si spengono ai limiti.
2. **Come funziona**: un filtro CSS sull'elemento `<html>`: `brightness(1 + 0.07·livello) contrast(1 + 0.06·livello)` (a ±3: ±21% luminosità, ±18% contrasto). Se entrambi i livelli sono 0 il filtro NON viene scritto (nessun costo, niente effetti sui `position:fixed`). Salvato in `localStorage` (`appBri`, `appCon`) e applicato PRIMA del primo disegno dallo snippet iniziale (niente lampo); **per dispositivo, non sincronizzato con Drive** (telefono e PC possono avere valori diversi, come il tema). Funzioni: `_applyLook`, `setLook`, `stepLook`, `resetLook`, `_lookInit`, `_syncLookMenu` (agganciata a `_syncThemeMenu`).
3. **Stampa**: in `@media print` il filtro è tolto (la stampa e i PDF restano identici a prima).
4. **Perché sull'<html> e non sul <body>**: con il filtro sul body i pannelli `position:fixed` (barra in basso, fogli dal basso) si ancorano al body e si spostano; sull'<html> no. Testato su telefono (barra in basso e foglio «Elimina viaggio») e PC.
5. **Test**: `s27.js` (37 controlli: livelli, limiti, persistenza dopo ricarica, nessun filtro a 0, stampa, telefono e PC, tema chiaro/scuro). Batteria completa (06/11): s27 37 (rilanciata da sola: nel giro automatico era partita insieme a un altro lavoro del browser e aveva dato 3 errori di tempo), s26 66, s25 113, s24 74, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, s23 153 → tutto verde; `lintcheck.sh` pulito sul file finale. Nota: lanciare s27 sempre da solo (mai insieme ad altri test del browser).

### Schermata «Nuovi viaggi» — ANALISI e scelta in corso (06/11, 10:08 → varianti consegnate; Fil deve scegliere)

**Richieste di Fil**: (a) la schermata «nuova riga» del PC (finestra `desktopAddEmpty`, con i grossi pulsanti-giorno a destra) è «troppo scomoda, troppo grande» → 4–5 varianti per scegliere la più comoda e intuitiva; (b) «Da confermare» possibile anche per **un solo viaggio** (oggi è un unico interruttore per tutti i viaggi creati in quel momento); (c) **unificare Multi-Tratta (`openMultiTratta`) con «aggiungi una riga»**: non devono esistere 2 sistemi per aggiungere viaggi.
- **Stato attuale del codice (v98)**: PC = modale `#desktopAddModal` (`desktopAddEmpty`, `_dmEnsureModal`, campi `dmTransp/dmFrom/dmTo/dmProd/dmNote/dmDDT/dmDate/dmDaConf`, giorni `_dayPickerCounts`/`_dpkUpdate`, «Rotte rapide» `_dmPopulateRoutes`, `_syncDmDaConfermareUI`); Multi-Tratta = `#multiTrattaModal` (`mtAddRow`, un solo trasportatore per tutte le righe, chip-giorno per riga); telefono = modulo lungo con chip-giorno e un solo «Da confermare», più «A tocchi» (`tapOpen`) e «Rotte frequenti» (`_rf*`); salvataggio comune `_commitNewTrips(newTrips)`.
- **Varianti mostrate** (tavola Design «Aggiunta viaggi — varianti», dati di esempio uguali in tutte: 2 righe, 6 viaggi, 2 da confermare, PC + telefono): **A In linea** (una riga per tratta, 5 caselle-giorno compatte; interruttore «Confermato / Da confermare» che dice cosa aggiunge il tocco successivo), **B Schede e gettoni** (righe chiuse come schede, quella aperta ha i giorni; sotto un «gettone» per ogni viaggio: un tocco lo passa da confermato a da confermare), **C Matrice** (ogni cella-giorno ha due pulsanti: + confermato, ! da confermare; i quadratini nella cella si toccano per togliere), **D Passo dopo passo** (1 trasportatore → 2 rotta → 3 quando, carrello «Righe pronte»), **E Come adesso, ridotta** (le stesse cose di oggi, ma a schede-riga e con per ogni giorno due contatori: confermati e da confermare).
- **Idea comune a tutte**: la riga diventa l'unità (trasportatore + Da + A + prodotto + giorni); Multi-Tratta sparisce e diventa «Aggiungi una riga»; ogni viaggio ha il proprio stato (confermato / da confermare); in fondo un totale («6 viaggi · 2 da confermare») e un solo pulsante «Aggiungi N viaggi».
- **Dopo la scelta**: realizzare la schermata nel PC (e decidere cosa fare di «A tocchi»/«Rotte frequenti» sul telefono: restano come scorciatoie che riempiono la prima riga), togliere `#multiTrattaModal`/`openMultiTratta`/`mtAddRow` senza lasciare riferimenti (il pulsante «Multi» diventa «+ riga»), `_commitNewTrips` riceve già lo stato per viaggio, aggiornare `s12/s14/s16/s25` (che toccano il modulo e Multi-Tratta), battery completa, PROJECT.md.
- **Rinviato (v99+)**: colori automatici dei trasportatori (tabella a slot c1..c10 sincronizzata su Drive; togliere i nomi da `getTransporterKey`, CSS `--t-*` e dalle regole che accorciano i nomi); eventuale pulizia della cronologia di GitHub (ricreare il repository).

## Novità v97 — nomi di clienti/impianti fuori dal codice pubblico · elenchi nel file di Drive · correzione di un errore della v96 (non reimplementare)

**Richiesta di Fil** (06/11, 09:21–09:37): il file su GitHub (Pages) è pubblico e contiene nomi di clienti, impianti e trasportatori. Decisioni: NON spostare l'hosting (niente GitHub Pro / Cloudflare); togliere i nomi dal codice e tenere gli elenchi su Drive; i colori dei trasportatori diventeranno automatici (v98: «l'importante è avere colori diversi»). Se una cosa non si poteva fare in sicurezza, non andava fatta. Script: `v97.py` (out96 → out97) + `v97_lists.js` (test_v74/). Tutto in ES5.

1. **Nomi tolti dal codice** (la scansione finale non trova più nessuno di questi): le tre liste di partenza (`transportersList/partenzaList/arrivoList` ora `[]`; `prodottiList` resta con i 4 prodotti generici), le opzioni statiche dei 3 `<datalist>` del modulo (ora vuote, le riempie `_refreshAllDatalistsLearn`), i segnaposto (`Trasportatore...`, `Es. Località (NOME)`, `Es. nome della ditta`), gli esempi nei commenti, e le MAPPE DEI COLORI dei codici-cliente (`dots` in `_locationCodeColor` e `map` in `_locationCodeColorPC`: ora `{}`, quindi vale sempre il colore automatico dal nome del codice, stabile). Il pannello Database mostra le voci con `_escH`. **Ancora nel codice (v98)**: i nomi dei trasportatori nei colori (`getTransporterKey`, CSS `--t-*`, mappe a ~7017/13297/14342/16540 e le regole che accorciano i nomi).
2. **Elenchi nel file di Drive.** Il payload (`_driveWriteData`) ora ha anche `lists:{transportersList,partenzaList,arrivoList,prodottiList}` e `listMeta`. Regola: si UNISCE (mai perdere una voce); l'unica eccezione sono le voci tolte A MANO (Database → ✕ / «Svuota tutto»): `listMeta[chiave][nome normalizzato] = {n, a:0|1, t}` — vince l'azione più recente (a parità, la rimozione); registro in `localStorage.listMeta`, scartate le azioni più vecchie di 180 giorni (anche quelle arrivate da Drive). Una voce tolta torna comunque se è USATA in un viaggio (corrente, prossima, archivio: `_listUsedSet`), come faceva già il caricamento; in quel caso resta sul dispositivo ma NON viene pubblicata su Drive (`_listPub`), così due dispositivi non si rimbalzano la scrittura. Togliere un doppione (stessa voce con maiuscole diverse) non registra la rimozione se ne resta uno.
3. **Agganci**: `_driveSyncCore` → dopo l'unione dei viaggi, `bulkLearnFromAllTrips()` (se sono arrivati viaggi) e `_listsMergeRemote(driveData.lists, driveData.listMeta)` → `{changed, behind}`; `needWrite` ora include `behind` (= Drive non ha ancora tutto). `_applyDriveData` (percorso classico) unisce anche gli elenchi. Le funzioni di unione MUTANO gli array sul posto (`loadTransportersList` riassegna le `let`, quindi mai tenere riferimenti vecchi: `_listArr(chiave)`). `_lmSet(chiave,nome,1|0)` solo per azioni esplicite (Database add/remove/clear, «Aggiungi alla lista»); `_lmRevive` quando una voce «tolta» viene imparata di nuovo (`_addToDb`, nuovo viaggio, modifica). Dopo azioni esplicite: `_listsTouched()` = `autoSaveDrive()` se connesso. `behind` confronta solo gli insiemi normalizzati e `{a,t}` del registro, mai l'ordine né le maiuscole: nessun ciclo di scritture (testato).
4. **Migrazione**: senza passaggi. Ogni dispositivo ha già gli elenchi nella sua memoria; alla prima sincronizzazione v97 li manda a Drive e gli altri li ricevono. Se un dispositivo ancora v96 riscrive il file, perde `lists/listMeta`: il primo v97 che sincronizza li rimanda (convergente; le rimozioni registrate nel frattempo si perdono). Dispositivo nuovo: gli elenchi arrivano da Drive; senza Drive restano solo i nomi che si ricavano dai viaggi.
5. **Errore della v96 corretto** (il file v96 consegnato lo ha): una sostituzione automatica (`many("(t.trasportatore||'—')", ...)` con il conteggio giusto perché una delle 3 occorrenze era GIÀ `_escH(...)`) aveva scritto `_escH_escH(...)` in `_tripSummaryHtml` → le schede «Eliminare questo viaggio?» e «Duplica su altri giorni» del telefono davano errore e non si aprivano. Il lint di allora girava su una copia VECCHIA del file. Regola da ora: `lintcheck.sh <file>` (rifà l'estrazione dal file finale, `node --check` + `no-undef`) PRIMA di consegnare; e `s26.js` (sezione D) apre le due schede. Quando una sostituzione contiene il testo da sostituire, controllare che non ripeta il prefisso.
6. **Colori dei codici** senza mappa: `_locationCodeColor` (telefono, hex) e `_locationCodeColorPC` (hsl) usano solo l'hash del codice (evitano il verde/bianco); stesso codice = stesso colore, codici diversi per lo più diversi. Più avanti (v98) si può usare la stessa tavolozza a slot dei trasportatori per evitare colori troppo vicini.
7. **Non nascosto da questa versione**: i nomi dei trasportatori nei colori (v98); `logo.png` e `manifest` (marchio dell'azienda); l'ID cliente Google OAuth (pubblico per natura); **la cronologia di GitHub** conserva le versioni vecchie con i nomi: per toglierli bisogna cancellare e ricreare il repository con lo stesso nome (URL, app installata e localStorage restano; Pages va riattivato e il sito resta giù qualche minuto). Rinviato a decisione di Fil.
8. **Test**: `s26.js` (66 controlli: file senza nomi, profilo nuovo, 12 casi di elenchi su Drive con Drive finto, schede Elimina/Duplica, colori). `lintcheck.sh`. Batteria completa (06/11): tutte verdi — s26 66, s25 113, s24 74, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, th5 38, th10 69, th11 88, s23 153; swtest 12 (rilanciata dopo aver puntato il file v97); `audit_loc.js` 0 elementi iniettati; `lintcheck.sh` pulito. Il numero «fail=1» di s26 nel log è la riga di riepilogo «0 FAIL».

## Novità v96 — niente più pop-up «salva» · telefono: Rotte frequenti, «A tocchi», «Un altro uguale» · pulsanti più grandi · correzioni (non reimplementare)

**Richieste di Fil** (05/11 16:07, dopo il controllo generale): pop-up = variante C; «rotte frequenti» sì; «foglio a tocchi» «proviamo, fammi vedere»; pulsanti del telefono «un pochino più grandi»; le due correzioni piccole sì; «un altro uguale» (parte di C) sì. Script: `v96.py` (out95 → out96) + `v96_sync.js`, `v96_phone.js`, `v96.css` (test_v74/).

1. **Avviso Drive (variante C)**: il promemoria «Non salvi su Drive da N min» (`startSaveReminder/showSaveReminder/snoozeSaveReminder`) è stato TOLTO. Al suo posto una barretta fissa piccola `#syncWarnBar` («⚠️ Modifiche non salvate su Drive» + «Collega» se Drive è scollegato / «Riprova» se è collegato ma non riesce), SOLO se Drive è stato collegato almeno una volta (`localStorage.driveConnected`) E su questo dispositivo ci sono modifiche che Drive non ha da più di 3 minuti (`SYNC_WARN_AFTER`). Niente timer di sparizione, niente ripetizioni; sparisce da sola quando la sincronizzazione riesce (`_syncMarkOk(sig)` chiamata in fondo a `_driveSyncCore`, con la firma `_tripsSigAll()` presa a inizio sincronizzazione) o se la firma torna uguale. Controllo ogni 10 s (`_syncWarnStart`, avviato dove prima partiva il promemoria). Telefono: sopra la barra in basso; PC: in basso a destra.
2. **Rotte frequenti** (in cima al modulo «Nuovo viaggio», `#rfWrap/#rfStrip`): fino a 8 chip (trasportatore colorato · Da → A · prodotto · ×volte), dalle ultime 10 settimane (`_RF_DAYS=70`) di corrente + prossima + archivio, ordinate per uso. Un tocco compila Trasportatore/Da/A/Prodotto (`_rfPick`), la chip si evidenzia finché i campi coincidono, poi scorre ai giorni. Se c'è almeno una rotta frequente la tastiera NON si apre più da sola all'apertura del modulo (senza storico: come prima). Il modulo di sempre resta com'è.
3. **«⚡ A tocchi»** (pulsante nell'intestazione di Rotte frequenti → `tapOpen()`): foglio dal basso, senza tastiera: 1 Trasportatore (pillole colorate, i più usati prima, + «Altro») → 2 Rotta (le sue rotte con «N volte», prodotto precompilato e modificabile, «Altra rotta…» libera; se ne ha una sola è già scelta) → 3 Quando (Questa settimana / Prossima + 5 chip giorno; tocchi 0→1→2→3→0 = numero di viaggi) → «Da confermare» + Nota → «✅ Aggiungi N viaggi» (spento finché manca qualcosa, dice cosa). Chiude con ✕, Esc o toccando fuori. Classi `tq-*` (NON usare il prefisso `tp-`: è del pannello «Per tratta»). Vista «Prossima»: lavora sulla settimana dopo.
4. **«Un altro uguale»**: nel riepilogo dopo l'aggiunta (`.su-same`); riapre lo stesso metodo (modulo o foglio) con gli stessi dati, senza data né giorni: si scelgono solo i giorni. `_lastAddVia` ('form'|'tap'). Il salvataggio comune è `_commitNewTrips(newTrips)`.
5. **Pulsanti telefono più grandi** (solo `@media (max-width:600px)`): pulsanti in alto 38×38 da 375px di larghezza in su (erano 34; sotto i 375px restano 34: a 360px più grandi coprirebbero il titolo «VIAGGI» — il test `th10` lo controlla; l'header passa da ~67 a ~71px e `th10` ora ammette ≤72), campi ricerca/filtri 42px, «Conferma tutti» più alto. IL PANNELLO FILTRI ha un'altezza massima fissa (150px chiuso / 400 aperto): con i campi più grandi è stata alzata a 176 / 470, altrimenti il fondo veniva tagliato.
6. **Correzioni**: (a) la data di un viaggio creato da un chip-giorno ora è quella scritta sul chip (`_mdpkChipDate`, stessa regola «sempre in avanti»; prima poteva differire di una settimana); (b) data di default col fuso giusto (`_isoDate`, prima `valueAsDate` UTC: tra 00:00 e 01:00 dava ieri); (c) `saveToLocalStorage/saveArchive` con try/catch + avviso «Memoria piena»: una memoria piena non ferma più `autoSaveDrive()`; (d) **il «+» apre il modulo al PRIMO tocco**: prima, dopo l'avvio o un cambio vista, `switchView` scopriva (`display=''`) il modulo in fondo alla pagina e il primo «+» lo chiudeva senza effetto visibile; ora `switchView` lo lascia chiuso (se è aperto resta aperto); (e) caratteri speciali: `_escH` su Partenza/Arrivo/Prodotto/Trasportatore in tutti i punti noti (finestra conferma, schede, tooltip, elenchi a tendina/datalist, targhette, chip PC, totali, input PC): `audit_loc.js` = 0 elementi iniettati in PC/Rapida/Trasp.
7. **Batteria completa (05/11)**: s25 113 (nuovo), s24 74, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, s23 153 → tutto verde. `s12` usa `switchView('add')` (percorso vecchio): per quella vista il modulo resta scoperto come prima. `th10`: header ammesso ≤72px. `audit_loc.js` (Partenza/Arrivo/Prodotto/Trasportatore con `"><b id=injected>`) = 0 elementi iniettati in PC/Rapida/Trasp.
8. **Non fatto (proposte)**: controllo Drive più leggero (chiedere prima solo `modifiedTime`/`md5Checksum` invece di riscaricare tutto ogni 45 s); `filterApply()` lento a 400 viaggi; email salvate per trasportatore; tonnellate.

## Analisi 05/11 (dopo la v95) — controllo generale + pop-up «salva» + inserimento da telefono (SCELTE FATTE da Fil → realizzate in v96, vedi sopra)

- **Pop-up «Non salvi su Drive da N min» — CAUSA TROVATA**: `startSaveReminder()` (fine dello script, ~riga 15997 di out95) controlla OGNI MINUTO `localStorage.savedAt` (= ora dell'ultima SCRITTURA su Drive, non dell'ultima sincronizzazione); se ≥20 min mostra `showSaveReminder()` per 15 s; scomparendo da solo NON fa snooze (lo fa solo la ✕, 30 min) → ricompare ogni minuto (riprodotto: 60s, 120s, 180s…). Scatta anche se non è cambiato niente e Drive è allineato (`_runSync(false)` non riscrive se non c'è nulla da scrivere, quindi `savedAt` invecchia) e anche se Drive non è collegato. Il pulsante SALVA chiama `driveSync()` → senza token apre il login Google. Oggi l'app salva già da sola: `autoSaveDrive()` (1,5 s dopo ogni modifica) + `_runSync(false)` ogni 45 s a scheda visibile + all'uscita/ritorno sulla scheda + `online`. Proposte: A) togliere il promemoria e basta; B) tenerlo solo per un problema vero (modifiche locali NON ancora su Drive da >3 min o Drive scollegato) come barretta fissa piccola, senza timer né ripetizioni, scompare appena sincronizzato; C) A+B (consigliata).
- **Controllo codice (v95)**: nessun errore JS cliccando ~110 pulsanti (telefono+PC); nessun id duplicato; lint = solo avvisi innocui (uso-prima-di-definire, `var` ripetute dentro la stessa funzione, `ClipboardItem` già protetto da `window.ClipboardItem`); `getMondayOf` doppia = due helper locali identici. Dati: date locali corrette (nessun `toISOString` per le date dei viaggi). Tempi: 60 viaggi 20 ms, 150 → 73 ms, 400 → 559 ms (primo disegno PC); `filterApply()` 74/175/600 ms a 60/150/400 viaggi → il punto più lento. localStorage: 52 settimane ≈ 750 KB (limite ~5 MB → anni di margine).
- **Problemi veri trovati**: (1) HTML non protetto (`_escH` mancante) per Partenza/Arrivo/Prodotto/Trasportatore con virgolette `"` o `<`: righe ~6037-6045 (finestra conferma), 6589, 6909, 7062, 7211, 7335, 7883, 8004 (+ input Partenza/Arrivo PC), 14705. Note e DDT sono già a posto. Apostrofi e `&` NON danno problemi. Impatto basso (serve un `"` nel nome). (2) `saveToLocalStorage()`/`saveArchive()` senza try/catch: se la memoria fosse piena l'eccezione salta anche `autoSaveDrive()` (rischio basso). (3) Ogni 45 s si riscarica TUTTO il file Drive (`_driveSyncCore` fa sempre `?alt=media`) e a ogni modifica si riscrive tutto, archivio compreso: ~17 KB a settimana archiviata (≈0,9 MB dopo un anno). Migliorìa: prima chiedere solo `modifiedTime`/`md5Checksum` (poche centinaia di byte) e scaricare solo se cambiato.
- **Inserimento da telefono — stato attuale**: form lungo nella pagina (Trasportatore → DA → A → Prodotto → Note → DDT → Data → chip giorni → Da confermare → Aggiungi), tutto digitato/datalist; esistono già «Multi» (multi-tratta), «Duplica su altri giorni» (foglio dal basso sulla card, v68) e «Copia dalla settimana precedente» (tutto o niente). Dettatura in-app: RIMOSSA per volontà di Fil, non reimplementare. Proposte: A) «Rotte frequenti»: chip colorate in cima al form (trasportatore · da → a · prodotto, dalle ultime settimane) → un tocco compila tutto, restano solo i giorni; B) «Foglio a tocchi» senza tastiera: Trasportatore (pillole colorate) → Rotta (solo quelle già fatte da quel trasportatore, prodotto precompilato) → Giorni → Aggiungi; C) «Aggiungi e continua» + «Un altro uguale» nella finestra riepilogo + «Copia dalla scorsa settimana» a scelta per trasportatore. Consigliata A + la parte «un altro uguale» di C; B come passo successivo.
- File di prova di questa analisi: `test_v74/audit1.js … audit6.js`.

## Novità v95 — vista PC: giorni in MAIUSCOLO + pulsante «Invia mail programma» di fianco a VEN (non reimplementare)

**Richiesta di Fil** (05/11 12:20, risolve la voce "di fianco a venerdì" rimasta aperta nella v93): «sopra, nella parte dove ci sono scritti i giorni, nella versione PC … lun, mar, merc, giov, di fianco a venerdì … quei giorni a lettere maiuscole … di fianco metti invia mail programma, ben visibile, fatta bene».
- **Dove**: riga «Giorno» della barra PC (`.pcb-row3`, `#desktopDayFilters`): TUTTI · LUN · MAR · MER · GIO · VEN, poi un separatore e il pulsante **«✉ INVIA MAIL PROGRAMMA»** (`#pcMailProgBtn`, classe `.pcb-mailprog`). NON è la `week-progress-bar` (quella è solo telefono/Rapida e nella vista PC è nascosta).
- **Maiuscolo**: solo CSS (`#desktopDayFilters button { text-transform:uppercase; letter-spacing:.4px }`); i valori interni dei filtri restano `Tutti/Lun/Mar/Mer/Gio/Ven` (`desktopDayFilter()`, `data-dayfilter`), quindi nulla cambia nella logica.
- **Il pulsante apre `mwOpen()`** ("Mail della settimana", v91): il **testo delle mail NON è cambiato**. Colori propri: pieno `--mp-bg/--mp-fg` (chiaro #b94a25/#fffaf3, scuro #e8623f/#1b1c1f), contrasto 4.97 / 5.07.
- **Numerino sul pulsante**: quanti trasportatori hanno ancora la mail da mandare (mai mandata o cambiata dopo l'invio, = stato `todo`/`changed` di `_mwStatus`); **✓** se è tutto inviato; nessun numerino se non ci sono trasportatori. `_pcMailProgState/_pcMailProgInner/_pcMailProgRefresh` (ES5); si aggiorna a ogni ridisegno della vista PC, a ogni «Fatto» (`mwDone`) e alla chiusura della finestra (`mwClose`).
- **Finestra stretta/bassa** (≤1100px o ≤760px d'altezza): la riga Giorno è a scomparsa dietro «Filtri ▾» (v85); lì il pulsante compare quando i filtri sono aperti, e resta sempre raggiungibile dal menu ⋯ → «Mail della settimana». Telefono invariato (nessun pulsante).
- **Layout (effetto collaterale gestito)**: la riga Giorno nella v94 era già quasi piena (slack ~15px a 1366, ~90px a 1440). Con il pulsante (248px) + maiuscolo (+38px) NON sta più su una riga sotto ~1700px. Soluzione: i comandi di destra (`_pcDensHtml()` Schede/Excel+densità, `#desktopSortChronoBtn` ⏱ Data, `#shortcutHintWrap` ⌨) sono ora dentro un unico `<div class="pcb-tools">` (`margin-left:auto`): sotto ~1700px vanno a capo INSIEME, allineati a destra sotto la ricerca (riga alta 107px invece di 60); a 1920px resta tutta su una riga. Gli id non sono cambiati. Se Fil vuole recuperare l'altezza: togliere l'etichetta «Giorno» o spostare Schede/Excel nella riga 1.
- **Batteria completa (05/11)**: s24 74, s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, s23 153 → tutto verde.
- **Test**: `s24.js` (74 ok, incl. layout a 1920/1536/1440; `s16.js` ora clicca "fuori dal pannello" in (700,860) invece che in (30,700) perché il pannello Per tratta può aprirsi a sinistra se la ricerca va a capo; i primi 60 controlli: PC chiaro/scuro, posizione a destra di VEN, contrasto, numerino che scende/✓/torna a 1 dopo una modifica, cambio tema, modalità Oggi, finestre 1000 e 760, telefono invariato). Script: `v95.py` (out94 → out95).

## Novità v94 — ARCHIVIO VIAGGI (cruscotto, variante C) (non reimplementare)

**Richiesta di Fil** (05/11): archivio dei viaggi fatti con ricerca completa (periodo settimana/mese/trimestre/anno/tutto + date libere; filtri trasportatore, fornitore, cliente E prodotto; testo libero), andamento per settimana, consultabile nell'app senza Excel, esportabile in Excel e **stampabile a colori**. Scelta la variante **C (cruscotto)** tra A/B/C; l'elenco viaggi della A è dentro come vista «Elenco viaggi». **Tonnellate ACCANTONATE** (decisione di Fil: servirebbe integrazione con le bolle) → nessun dato di peso, mai. «Buccette d'uva» era solo un esempio: i prodotti nel filtro sono quelli veri dei viaggi.
- **Dove si apre**: menu ⋯ della barra PC → «Archivio viaggi (cruscotto)» (sopra «Archivio settimane»); pulsante «📈 Viaggi» nella riga `pcvs`; sul telefono pulsante «📈 Archivio viaggi · cerca, statistiche, Excel» in cima alla sezione Archivio (visibile solo se c'è almeno una settimana archiviata). Funzione `arcOpen()` / `arcClose()`.
- **Codice** (ES5 puro, vincoli Android rispettati): `test_v74/theme_v78/v94_arc.js` (dati, filtri, calcolo, HTML, eventi), `v94_arc2.js` (Excel + stampa), `v94_arc.css`; `v94.py` li innesta in `out93.html` → `out94.html` (JS prima di `mwOpen`, CSS prima del blocco v91, voce menu, due pulsanti, hook in `_themeRerender`). Tutte le funzioni/variabili hanno prefisso `_arc`/`arc`; classi CSS `.arc-*`; overlay `#arcOverlay` z-index 9400 (sotto Mail della settimana 9500, la conferma Excel viene alzata a 9800).
- **Dati**: `trips` (settimana in corso) + `loadArchive()` (settimane archiviate). Doppioni (stesso `id`+data) contati una volta; date impossibili scartate. **Non incluse** le tratte della settimana prossima (`tripsNext`). Trasportatore/fornitore/cliente/prodotto raggruppati con `_srchNorm` (maiuscole/accenti ignorati: «Coap» = «COAP»). Valori vuoti → «(senza prodotto)» ecc.
- **Periodo**: predefinito Mese (ultimo scelto ricordato in `localStorage.arcMode`, «Date…» non viene ricordato). ‹ › e frecce da tastiera, «Oggi». **Periodo in corso** (i dati non arrivano a fine periodo): sottotitolo «(in corso)» e confronto col periodo prima **«a pari giorni»** (niente falso −72%). Media «viaggi / settimana» (in Settimana: «viaggi / giorno» su giorni lavorativi). Grafico: Giorni/Settimane/Mesi a seconda del periodo; clic su una barra restringe (giorno → Date, settimana → Settimana, mese → Mese).
- **Filtri**: 4 menu a spunta multipla con ricerca interna e conteggi (calcolati sul periodo e sugli ALTRI filtri), tratta (clic su una riga di «Tratte») con ✕, testo libero (usa `_srchGenHay`: DDT, note, luoghi, prodotto, giorno), «Azzera filtri». Clic su una riga di Trasportatori/Prodotti/Tratte/Fornitori/Clienti = filtra (secondo clic toglie). «Elenco viaggi (N)»: 50 per pagina, ordinabile per data, ⚠ per «da confermare».
- **Excel** (`arcXlGo` → `_arcXlsx`, ExcelJS come il resto): finestra con 6 fogli a scelta (Riepilogo, Elenco viaggi, Per trasportatore, Per tratta, Per prodotto, Per mese e settimana); nome `Archivio_Viaggi_<periodo>[_filtrato].xlsx`; date vere, colori trasportatore (`_transporterColorPC`), filtri automatici, intestazione bloccata, A4 orizzontale + piè di pagina, totali. Esporta SEMPRE le righe che soddisfano periodo+filtri.
- **Stampa** (`arcPrint`): `window.open` + `document.write` come `printPlanning`; A4 orizzontale, `print-color-adjust:exact`, tavolozza chiara fissa (testata arancione, 4 KPI colorati, barre, pillole trasportatore dell'Excel). Stampa ciò che si vede: cruscotto (1 pagina, verificato con PDF vero) oppure elenco (tutte le righe, max 2000, pagine ripetono l'intestazione). Periodo vuoto: avviso, niente stampa.
- **Accessibilità**: variabili locali `--arc-sel-bg/-fg`, `--arc-pri-fg`, `--arc-bar(-top)` su `.arc-ov` (chiaro e scuro) scelte per contrasto ≥ 4,5 sui testi e ≥ 3 sulle barre. Le pillole dei trasportatori hanno gli stessi colori dell'elenco viaggi (come chiesto da Fil per la Mail della settimana): alcune restano sotto 4,5 (es. CONSAR PC 3,7) come nell'elenco — escluse dall'audit.
- **Test**: nuovo `test_v74/s23.js` (153 controlli: periodi, doppioni, filtri/prodotto, conteggi, grafico, elenco, Excel foglio per foglio, stampa, tema, tastiera, contrasto PC/telefono, nessun errore JS) + `arch_seed.js` + `arc_seed2.js` (dati finti 44 settimane), `arc_shot.js`/`arc_final.js` (screenshot), `arc_pdf.js` (PDF vero), `arc_contrast.js`. Nota: l'helper `CONTRAST` di `s20.js` va valutato con `eval('`'+…+'`')` quando lo si estrae dal sorgente (altrimenti i backslash raddoppiati lo rendono cieco: rapporto sempre 1).
- **Batteria completa (05/11)**: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88, **s23 153** — tutti ok (`runall94.sh`; `swtest.js` ora legge `out94.html`). Il diff v93→v94 è solo aggiunte + `APP_VERSION`.
- **Idee non fatte**: tonnellate (bolle); includere la settimana prossima; stampa del cruscotto + elenco insieme; «torna al periodo di prima» dopo un clic su barra; pillole PC con inchiostro adattivo come sul telefono; indirizzi mail salvati per trasportatore. **Ancora aperto** dalla v93: «giorno accanto a venerdì» nel testo mail (serve un esempio di riga scritto da Fil).

---

## Novità v93 — Gradiente "A · Dall'alto" nel tema chiaro + nome del trasportatore colorato nella Mail della settimana (non reimplementare)

**Richieste di Fil** (05/11): (1) "nel chiaro puoi mettermi anche un gradiente che non dia fastidio a chi è astigmatico e ha fastidio per la luce? fai ricerca" → ricerca (BOIA, Ask HN astigmatici, "Beyond WCAG", Berkeley Eye): NESSUNA fonte parla di gradienti; consigliano off-white caldo, no bianco puro, no contrasti duri, tema scelto dall'utente. Il gradiente è una scelta di design nostra: toglie un po' di luce. Fil non vedeva differenza tra le 3 varianti (effetto −4/−5% di luce media) → rifatte ingrandite 3× solo come illustrazione → **ha scelto la A**. (2) Foto del pannello Mail della settimana: "Metti il nome del trasportatore colorato, come nell'elenco viaggi, stesso colore" + "tutti i trasportatori non solo alba".
- **Gradiente A** (solo CSS, `test_v74/theme_v78/v93.py`): `html[data-theme="light"] body::after` fisso, `pointer-events:none`, z 9990, `linear-gradient(180deg, rgba(52,48,42,0.065) 0%, rgba(52,48,42,0) 70%)`; `@media print` lo nasconde. In più `html[data-theme="light"]{--text-dim:#5e5e57}` (era #6c6c64): i testi grigi piccoli erano già a 4,5–4,6 e il velo li portava sotto. Misura (script `t/grad.js`, calcolo analitico del velo sul centro di ogni elemento di testo, confronto con la base piatta, stati: principale / Mail della settimana / Per tratta, PC e telefono): a 0,08 due testi di "Per tratta" (GIO, 08/10) scendevano a 4,48; a 0,07 uno a 4,50; **a 0,065 nessun testo nuovo sotto 4,5**. Più forte di così serve scurire altri grigi. Il tema scuro non cambia.
- **Nome colorato**: `_mwNameHtml(name)` in `_mwRender` → `<span class="nv-pill mw-pill">` dentro `#mwName`. Chiave colore = `getTransporterKey()` (stessa dell'elenco). PC (`body.desktop-view-active`): fondo `var(--t-KEY-pill)`, testo `var(--ink)` = identico alla pillola della colonna Trasp.; telefono: fondo `--t-KEY-fill`, testo `--t-KEY-ink` ma `_mwPhoneInk(key)` passa a scuro/chiaro dove le lettere della card telefono sarebbero <4,5 (CIRIONI/STEGAGNO/ALBA erano 2,6–3,1). Sconosciuti = grigio-blu "default" come nell'elenco. Pillola 42 px / 20 px grassetto (telefono 38 px / 19 px), ellissi se il nome è lunghissimo. Contrasti PC (uguali all'elenco): CONSAR 3,72, LINO 3,89, CONECO 4,0, CLP 4,45, gli altri ≥4,6 — testo grande (≥18,66 px grassetto) quindi soglia 3.
- **(CHIARITO E FATTO nella v95: Fil intendeva il pulsante «Invia mail programma» di fianco a VEN nella riga Giorno della vista PC, non un giorno dentro il testo della mail)** Voce originale: "nella parte di invio mail mettimela di fianco a venerdì il giorno della settimana" (voce poco chiara). Domanda fatta con AskUserQuestion (data "VEN 06/11" / numero "VEN 6" / "VENERDÌ") → Fil ha risposto "nessuna preferenza" e ha cambiato argomento. NON modificato il testo che va ai trasportatori: serve un esempio di riga scritto da lui. Nota tecnica: `_srchTratteMailText/_srchTratteMailInner` usano `g.days[dow]` (conteggi per giorno della settimana) e `_SRCH_DWM`; una data richiederebbe di tenere le date per giorno (`_srchTratteFromTrips`, `_srchTratteAggregate`) o di calcolarle dal lunedì della settimana mostrata (`_srchMonday`).
- **"Aggiorna app"** (menu ⋯, `pcForceUpdate`): spiegato a Fil — toglie la copia vecchia dell'app tenuta dal browser (service worker + cache) e ricarica; NON tocca viaggi (localStorage) né Drive.
- **Batteria completa (05/11)**: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, s22 25, swtest 12, th5 38, th10 69, th11 88 — tutti ok.
- **Test**: nuovo `test_v74/s22.js` (25 controlli: 11 trasportatori in chiaro/scuro/telefono, colore identico alla colonna Trasp., contrasti, velo presente/assente/stampa/tocchi, `--text-dim`). `swtest.js`/`s19.js` v93; `runall.sh` include s22. `harness.js`: nuova opzione `dsf` (deviceScaleFactor). Script mockup: `t/grad.js` (STATE=mw|tratte, ALPHA, DIM), `t/shot93.js`.

---

## Novità v92 — Telefono: la ricerca non apre più Google (crash "pagina bianca") (non reimplementare)

**Richiesta di Fil** (03/11, 11:49): "quando cerco nella barra di ricerca o nel selettore trasportatore/cliente/fornitore mi fa il caricamento o salvataggio di Google e dopo poco l'app crasha". Risposte: succede **sul telefono**, **ogni volta che cerca**, vede **pagina bianca, poi tutto sparisce**; su PC non l'ha notato; non ha potuto controllare la versione (menu ⋯ → "App Viaggi vNN").
- **Cosa NON era**: su PC (v87/v89/v91, Google finto ok/popup bloccato/rifiutato/lento) la ricerca non tocca Drive, nessun ciclo, nessun errore. Sul telefono `filterApply`/`renderTrips`/`updateStats` girano 1 volta per lettera, nessun salvataggio, nessun errore JS.
- **Causa (riprodotta con Google simulato, telefono 390×800, `test_v74/drv2.js ph-multi popupvis`)**: il meccanismo v84 (`_armGestureReconnect`) avvia la riconnessione a Google (finestrella) al PRIMO tocco/tasto dopo l'apertura. La finestrella porta la pagina in secondo piano; al ritorno l'handler `visibilitychange` azzerava `_gestEpisodeFailed` e riarmava → il tocco/tasto successivo (la lettera dopo nella ricerca, il selettore) apriva un'altra finestrella, anche più richieste insieme. Nel test v91: **2 richieste per ogni ricerca, 11 in 5 ricerche**, anche con la scritta "premi Salva" (rinuncia). Probabile origine del "caricamento di Google" + pagina bianca (la finestrella di Google in un'app installata sul telefono; il vero crash di Android NON è riproducibile qui: Google non è raggiungibile dal sandbox → se Fil lo rivede, è il primo posto da guardare).
- **Correzione** (solo logica, niente grafica; `test_v74/theme_v78/v92.py` da out91): (1) `fire` di `_armGestureReconnect` ignora (resta armato) tocchi/tasti dentro la ricerca/selettore/menu (`#srchRowM, #filterTypedQ, #searchInput, #desktopClientSearch, #srchTyped, #srchLens, #srchPanel, #srchTypeMenu, #srchKindBtnM, #srchChips, #srchSendMenu, #srchExpModal, #mobSheet, .filter-search-input`) e, sul telefono, qualsiasi campo di testo; (2) sul telefono i tasti (`keydown`) non avviano mai Google; (3) `visibilitychange`: se `_silentBusy` o l'ultimo tentativo è di meno di 60 s fa non riarma né riprova; (4) `silentDriveInit`: un solo tentativo alla volta (`_silentBusy`, sblocco dopo 20 s), azzerato in callback / error_callback / failTimer / catch; (5) massimo 2 tentativi "da tocco" ogni 10 minuti (`_gestTries`, azzerati a collegamento riuscito): poi `_gestEpisodeFailed` e la scritta "premi Salva". Salva / Carica / pastiglia Drive (`driveLogin`) funzionano sempre.
- **Conseguenza voluta**: su PC e telefono la riconnessione "al prossimo tocco" parte al primo tocco su un punto NEUTRO (non nella ricerca). Se il crash dovesse restare: opzione più drastica = sul telefono la riconnessione solo con Salva/Carica (niente tocco libero).
- **Non toccati**: stampa, Excel, colori codici (diff v91→v92: 30 righe, tutte nel blocco riconnessione + `APP_VERSION`). `sw.js` invariato (cache v89).
- **Batteria completa (03/11)**: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 93, s21 18, swtest 12, th5 38, th10 69, th11 88 — tutti ok.
- **Test**: nuovo `test_v74/s21.js` (18 controlli, Google finto con finestrella che manda la pagina in secondo piano: 5 ricerche + selettore = 0 richieste; tasto = 0; tocco neutro = 1; ritorno = 0; tetto; Salva apre l'accesso; PC; telefono con Google che accetta solo dentro un tocco). **Sulla v91 fallisce 5 controlli** (conferma che il test vede il difetto). `runall.sh` include s21; `swtest.js`/`s19.js` v92. `drv2.js` ora ha gli scenari `ph-typed|ph-kind|ph-multi` e la modalità `popupvis`.

---

## Novità v91 — "Mail della settimana" (variante B) + testo standard di Fil + avviso visibile (non reimplementare)

**Richiesta di Fil** (02/11 17:37–17:43): dopo le 3 varianti ha scelto la **B** ("la b va bene"), poi ha mandato la sua mail standard e l'oggetto: *"Buongiorno, / Di seguito invio programma per la prossima settimana: / <tratte e viaggi> / Grazie, saluti"* e oggetto *"COAP - Programma settimana prossima"* (il nome cambia con il trasportatore). Voleva anche il punto 3 (saluto/chiusura fissi) → fatto insieme.
- **Testo standard** (`_mailTplGet/Set/Reset`, localStorage `mailTpl` = {subj, head, foot}; campo salvato vuoto = non scritto; mancante = predefinito di Fil): `_mailSubject(nome)` (`{trasportatore}` → nome; senza nome, cioè più trasportatori nella ricerca, si toglie anche il trattino → "Programma settimana prossima"), `_mailFullText(list)` = intestazione + riga vuota + tratte + riga vuota + chiusura; `_mailFullHtml(list)` = stessa cosa in HTML (tratte `<b><u>…</u></b>`). Usati da **tutte** le uscite: Invia ▾ (Apri la mail / Copia solo il testo), "Copia testo mail" di Per tratta, Mail della settimana. `_srchTratteMailText` (corpo semplice) e `_srchTratteMailInner/Html` (corpo HTML) restano il corpo.
- **Mail della settimana** (`mwOpen()`; ⋯ → "Mail della settimana" sempre disponibile; Invia ▾ → quarta voce `#srchSendWeek`): overlay `#mwOverlay` (z 9500) con `#mwBox`. Un trasportatore alla volta (alfabetico, nomi uniti senza maiuscole/accenti/spazi): punti `.mw-dot` cliccabili (verde = mandata, giallo = cambiata dopo l'invio, anello = corrente), ‹ ›, frecce da tastiera, Esc, clic sullo sfondo; riga "Mail N di M · k viaggi · t tratte · [x da confermare] · ancora da mandare: n"; stato; oggetto; anteprima completa; **Apri la mail** (copia il testo formattato + `mailto:?subject=…`, NON segna), **✓ Fatto, prossima ▸** (segna ✓ con data/ora, passa al prossimo da mandare; all'ultimo la scritta è solo "✓ Fatto"; finiti tutti → "✓ Tutte le mail della settimana risultano mandate"), **Salta**; per le già mandate: Rimanda la mail / Prossima ▸ / Togli il ✓. Footer: "✎ Modifica oggetto, saluto e chiusura" (editor: oggetto, inizio, fine; Salva / Annulla / Ripristina) e "N viaggi senza trasportatore: non compaiono qui". Settimana = `_pcRubricaWeekTrips()` (mostrata o prossima); sottotitolo "Settimana 42 · 12 – 16 ott · prossima".
- **Stato "mandata"**: localStorage `mailSent` = { 'AAAA-MM-GG del lunedì': { chiaveTrasportatore: { t, name, sig, snap } } }, ultime 8 settimane. `sig` = firma dei viaggi (tratta|giorno=n); se dopo ✓ cambia → giallo "⚠ Cambiata dopo l'invio (gio 8 ott · 09:15): +1 viaggio GIOV (Pisa › Verolavecchia)" (`_mwDiff`: +/− per tratta/giorno, max 2 voci poi "e altri N"), pulsante "Rimanda aggiornata", oggetto con " (aggiornato)". **È solo sul browser di Fil (non va su Drive)**; "mandata" = ha premuto «Fatto», l'app non può sapere se la posta è davvero partita.
- **Avviso «prossima»**: se `_pcWeekMode !== 'next'` e oggetto/saluto contengono «prossim» → riga gialla nel pannello e frase nell'avviso dopo la copia ("Attenzione: stai guardando la settimana in corso, ma il testo dice «prossima»"). Non modifica i testi di Fil.
- **SCOPERTA (vale per tutta l'app)**: in vista PC `#statusMessage` è `display:none !important` → **`showStatus()` non si vede mai su PC** (si vede solo sul telefono). Quindi gli avvisi delle v87–v90 ("Testo copiato…") non erano visibili. Dalla v91 le funzioni mail usano `_mailToast(msg, tipo)` = `showStatus` (invariato, per i test) + avviso proprio `#mailToast` (in basso al centro, z 9700, 5 s). Gli altri `showStatus` dell'app NON sono stati toccati: se Fil si lamenta che "non compare nessun messaggio" altrove, è questo.
- **Colori**: testo di stato sempre `--text`; solo il simbolo ✓/⚠ è verde/giallo (in chiaro `--success` 3.8 e `--warning` 4.45 non bastavano come testo).
- **Non toccati**: stampa, Excel, colori codici (IDENTICI alla v87, confronto ancorato alle definizioni). `sw.js` invariato.
- **Build e test**: `test_v74/theme_v78/v91.py` (da out90). Nuovo `test_v74/s20.js` (92 controlli: dove si apre; primo trasportatore e contenuto; navigazione; apri la mail; Fatto/Togli ✓/fine giro/potatura 8 settimane; cambiamenti dopo l'invio; editor testi; avviso «prossima» e settimana prossima; avviso visibile; contrasti chiaro/scuro; misure 1440/1366/960/800 e 28 trasportatori; telefono). `s17.js`/`s19.js` adattati (testo completo, oggetto, 4 voci nel menu), `swtest.js` v91. `runall.sh` ora include s20.
- **Batteria completa (02/11 sera)**: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, s20 92, swtest 12, th5 38, th10 69, th11 88 — tutti ok (`th2.js` solo generatore di screenshot, timeout atteso). Zone protette identiche alla v87.
- **Idee ancora aperte**: indirizzi email salvati per trasportatore (destinatario/CC già compilati — NON fatto, Fil ha scelto solo punti 1 e 3); trasportatore che perde tutti i viaggi dopo l'invio (sparisce dall'elenco, nessun avviso); stato "mandata" anche su Drive/altri dispositivi; "da confermare" inclusi nel testo (solo segnalati nella riga del pannello); date accanto ai giorni; mail "variazioni"; Invia nella Rapida (telefono); `{settimana}` automatico nel saluto (oggi frase fissa «prossima settimana»).

---

## Novità v90 — tratta in GRASSETTO e SOTTOLINEATA nel testo della mail (non reimplementare)

**Richiesta di Fil** (02/11 17:12): "mettere in grassetto e sottolineare la tratta, ad esempio Bientina destinazione Verolavecchia, così è ancora più immediato e sott'occhio". Poi (17:14): "se il grassetto sottolineato è un problema grosso lascia così" (cioè: se complica troppo, il testo semplice va bene) → non era un problema grosso, tenuto.
- **Limite tecnico (da spiegare a Fil)**: un link `mailto:` porta SOLO testo semplice, mai grassetto/sottolineato. Quindi il testo formattato va **negli appunti** (HTML + testo semplice insieme) e si **incolla con Ctrl+V** nel corpo della mail. "Apri la mail" ora: copia il testo formattato → apre la posta con l'OGGETTO già scritto (`mailto:?subject=…`, nessun `&body=`) → toast "Testo copiato (tratte in grassetto e sottolineate): nella mail premi Ctrl+V per incollarlo". Se la copia NON riesce: la mail si apre col testo semplice già dentro (come v89, CRLF, senza grassetto; toast "…senza grassetto"); se in più è > 1800 caratteri → nessuna mail, errore.
- **Codice**: `_srchTratteMailHtml(list)` (riga tratta `<b><u>Pisa Destinazione Verolavecchia</u></b>`, righe `N. 1 viaggio LUN` con `<br>`, gruppi separati da `<br><br>`, tutto in `<div>`; testo escapato con `_escH`), `_srchCopyRich(text, html, done)` (`navigator.clipboard.write([ClipboardItem{text/html,text/plain}])` solo in contesto sicuro; altrimenti div nascosto `left:-9999px` + selezione + `execCommand('copy')`; ultima risorsa = testo semplice con `_srchCopyText`; `done(ok,'rich'|'plain')`), `_srchSendData()` ora restituisce anche `html`. Usato da: "Apri la mail", "Copia solo il testo" (menu Invia ▾) e "Copia testo mail" (schermata Per tratta). Il TESTO SEMPLICE non è cambiato (stesso formato di v87–v89).
- `APP_VERSION='v90'` (si vede nel menu ⋯). `sw.js` invariato (cache resta `viaggi-app-v89`).
- **Non toccati**: stampa, Excel, colori codici (blocchi IDENTICI alla v87, verificato con confronto ancorato alle definizioni).
- **Build e test**: `test_v74/theme_v78/v90.py` (parte da out89). `s17.js` (stub appunti con `write`, verifica HTML esatto e metodo di riserva sul div nascosto), `s19.js` (74 controlli: ora anche HTML negli appunti, mail con solo oggetto, caso "copia fallita → testo semplice dentro"), `swtest.js` (legge out90, versione v90).
- **Batteria completa (02/11)**: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 35, s19 74, swtest 12, th5 38, th10 69, th11 88 — tutti ok (`th2.js` solo generatore di screenshot, timeout atteso).
- **Idee ancora aperte (proposte a Fil, da scegliere)**: elenco "Mail della settimana" (tutti i trasportatori, un Invia ciascuno, segno "mandata ✓ + data/ora" e avviso se i viaggi cambiano dopo l'invio); indirizzi email salvati per trasportatore (destinatario/CC già compilati); saluto/chiusura fissi opzionali; date accanto ai giorni (LUN 02/11) e come trattare i "da confermare"; mail "variazioni" (solo viaggi nuovi/cambiati); pulsante Invia nella Rapida (telefono); Gmail nel browser.

---

## Novità v89 — "Invia ▾" accanto alla ricerca + aggiornamento che funziona (non reimplementare)

**Richiesta di Fil** (02/11): "dobbiamo farlo tutto più semplice: se cerco coap nella barra di ricerca generica mi deve dare la possibilità di fare subito la mail, ma non invasivo; fammi 2-3 opzioni" → ha scelto la **C** (un solo pulsante con menu; bozze in `Mail_3_opzioni_vicino_alla_ricerca.png`). Poi: "anche caricando ancora il file è sempre la stessa, non compare niente" (foto: versione vecchia) → vedi "Da verificare" punto 0.
- **`#srchSendBtn` "Invia ▾"** dentro `#srchGroup` (riga 3, subito dopo la casella `#srchTyped`), dentro il contenitore `#srchTrattWrap` (id invariato; prima stava in riga 2): compare con QUALSIASI ricerca attiva (casella tipo Tutti/Cliente/Fornitore/Trasportatore, lente "ovunque", tratta scelta: `_srchHasCrit`). Sotto 820px solo icona. `_srchTrattBtnHtml()` ora produce questo pulsante (il vecchio `#srchTrattBtn` "Per tratta" e le buste `.pcb-chipmail` della v88 NON esistono più).
- **Menu `#srchSendMenu`**: elemento sul `body`, `position:fixed`, z-index 9000 (come il menu ⋯) — DEVE stare sopra `#srchPanel` (z 5500), altrimenti con la schermata Per tratta aperta resta nascosto (difetto trovato e corretto). `#srchSendMenu` è nell'elenco "clic dentro" di `_srchPanelOutside` (se no un clic sul menu chiudeva la schermata e poi la riapriva). Si chiude con Esc, clic fuori, secondo clic sul pulsante, resize. Voci: **Apri la mail con questi viaggi** (`srchSendMail`) · **Copia solo il testo** (`srchSendCopy`) · **Vedi per tratta / Chiudi la schermata per tratta** (`srchSendTratte` → `srchToggleTratte`). Senza viaggi nella settimana le prime due sono spente con la scritta "nessun viaggio in questa settimana"; in Storico il pulsante c'è e la mail resta quella della settimana mostrata (lo dice la voce).
- **Dati**: `_srchSendData()` = viaggi di `_pcRubricaWeekTrips()` (settimana mostrata, anche "prossima") che passano `_srchTripPass(t, _srchCriteria())` (testo, tipo, lente, tratta scelta; il filtro **giorno** NON conta, come "Per tratta"); `_srchTratteFromTrips()` raggruppa per tratta (ordine: più viaggi prima); testo = `_srchTratteMailText` (v87). Oggetto: `Viaggi <NOME> · settimana 5 – 9 ott` (NOME solo se un unico trasportatore).
- **Invio**: `_srchCopyText` (v87) poi `_srchOpenMail(url)` (anchor nascosto `mailto:?subject=…&body=…`, CRLF); > 1800 caratteri → solo oggetto + "premi Ctrl+V"; copia fallita + testo lungo → nessuna mail vuota.
- **Fix collaterale**: `transitionend` dentro `#srchGroup` → `_srchPlacePanel()` (aprendo la lente la riga di ricerca si allarga/va a capo e la schermata dei risultati restava posizionata più in alto coprendola; c'era anche prima).
- **Aggiornamento**: **`sw.js` nuovo** (file a parte, da caricare nel repo accanto a `index.html`): cache `viaggi-app-v89`, `install` con `skipWaiting`, `activate` cancella le cache diverse + `clients.claim()` + `navigate` delle pagine aperte (una volta), `fetch` same-origin GET = rete con `cache:'no-cache'` e copia salvata SOLO offline; Drive/font/CDN non toccati. `index.html` registra `./sw.js` con `{updateViaCache:'none'}` + `reg.update()`. **Menu ⋯**: voce "🔄 Aggiorna app (versione nuova)" = `pcForceUpdate()` (de-registra i service worker e svuota Cache Storage, poi ricarica; NON tocca localStorage né Drive) + riga "App Viaggi v89" (`APP_VERSION`). **Ad ogni nuova versione aggiornare `APP_VERSION` in `v89.py`/successivi** così Fil verifica a colpo d'occhio cosa sta usando.
- **Non toccati**: stampa, Excel, colori codici (blocchi IDENTICI alla v87); schermata Per tratta (con "Copia testo mail" della v87) invariata.
- **Build e test**: `test_v74/theme_v78/v89.py` (parte da out87; la v88 era un ramo scartato). Nuovo `test_v74/s19.js` (70 controlli: compare solo cercando e non in riga 2; menu 3 voci/Esc/clic fuori; mail con testo/oggetto/CRLF/appunti; solo copia senza posta; più trasportatori; tratta scelta e filtro giorno; menu SOPRA la schermata e non la riapre; senza viaggi/Storico; testo lungo/copia fallita/settimana prossima; vera apertura mailto + tastiera; menu ⋯; contrasti scuro/chiaro; 1366/960/640; telefono senza pulsante) e `test_v74/swtest.js` (server finto stile GitHub Pages: riproduce il sintomo di Fil con un vecchio sw "cache first", poi verifica che il nuovo sw.js aggiorni, cancelli le cache vecchie, tenga i dati, funzioni offline, e che "Aggiorna app" lasci localStorage). `s16.js`/`s17.js` adattati (ora aprono "Per tratta" dal menu). `runall.sh`: s2…s17, s19, swtest, th*. (`s18.js` della v88 non più nella batteria.) Batteria completa (02/11): s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 34, s19 70, swtest 12, th5 38 (una volta 35/38 durante la batteria, poi 4 su 4 a 38 sia sulla v89 sia sulla v87: ballerino come prima), th10 69, th11 88 (`th2.js` solo generatore di screenshot, timeout come sulla v85). Zone protette (2 blocchi `@media print`, JS di stampa, JS Excel, `_locationCodeColorPC … _codeChip`) IDENTICHE alla v87.
- **Idee ancora aperte**: Gmail nel browser; destinatario predefinito per trasportatore; mandare a tutti i trasportatori in un colpo; testo con prodotto/DDT; mostrare la versione anche nella Rapida (telefono).

---

## (SUPERATA dalla v89 — busta sui chip e Per tratta in riga 2 tolti) Novità v88 — busta "Invia mail" su ogni trasportatore (non reimplementare)

**Richiesta di Fil** (02/11): "forse è bene mettere un pulsante tipo invia mail, perché non mi serve solo per tratta: per ogni singolo trasportatore mi serve tutti i viaggi che fa e tutte le tratte che fa". Domande fatte: cosa deve succedere → **"Apre la mail già scritta"**; che posta usa → **"Altra posta / non so"** (→ `mailto:` predefinito).
- **Dove**: dentro ogni chip trasportatore della riga 2 (CEVOLO 5 · CONSAR 4 · COAP 1) c'è un pulsante busta `.pcb-chipmail` (24×24, icona `_PCI.mail`, nel chip `.pcb-chip.hasmail`); suggerimento "Invia mail a <nome>: tutte le sue tratte e i giorni, già scritte". Il chip non ha altro clic.
- **Cosa fa** `pcMailTransp(i)`: `i` = indice in `_pcMailNames` (assegnato in `renderDesktopView` subito dopo `_transpSummary`, così niente nomi dentro `onclick`: apostrofi/virgolette/& sono sicuri). `_srchMailTranspData(name)` prende i viaggi della **settimana mostrata** (`_pcRubricaWeekTrips()`, anche "prossima") con `t.trasportatore === name` (nome esatto, come il numero sul chip), **ignorando filtri/ricerca/giorno attivi**; `_srchTratteFromTrips(items)` li raggruppa per tratta (`_srchRouteKey`, stesso ordine della schermata Per tratta: più viaggi prima); testo = `_srchTratteMailText` della v87 (formato di Fil). Oggetto: `Viaggi <NOME> · settimana 5 – 9 ott` (etichetta in minuscolo).
- **Invio**: `_srchCopyText(text, cb)` (v87: appunti moderni / textarea+execCommand), poi `_srchOpenMail(url)` (anchor nascosto `mailto:?subject=…&body=…`, a capo CRLF, rimosso subito). Avvisi (`showStatus`): "Mail aperta con il testo dentro (copiato anche negli appunti)" / senza "copiato" se la copia fallisce. **Testo lungo** (link > 1800 caratteri): si apre la mail col solo oggetto e l'avviso dice "Testo copiato: nella mail premi Ctrl+V per incollarlo"; se in più la copia fallisce non apre nessuna mail vuota e lo dice.
- **Resta** il pulsante "Copia testo mail" della v87 nella schermata Per tratta (per tratte filtrate per cliente/fornitore o ricerche).
- **CSS** "v88 — Busta…" prima del blocco v87: icona `currentColor` = `--text-soft` (contrasto 5.1–6.2 scuro/chiaro), hover/focus `--text` su sfondo del colore del chip al 28%. Solo vista PC; la Rapida non ha buste. Non toccati: stampa, Excel, colori codici (blocchi IDENTICI alla v87).
- **Build e test**: `test_v74/theme_v78/v88.py` (parte da out87). Nuovo `test_v74/s18.js` (55 controlli: 3 buste; testo+oggetto+CRLF+appunti per CONSAR/CEVOLO/COAP; indipendenza da filtro cliente/giorno; settimana prossima; nomi con `'`, `&`, `"`; testo lungo e copia fallita; funzione vera `_srchOpenMail` + tastiera; contrasti scuro/chiaro; 1440/1366/960/640; telefono senza buste). `runall.sh` include s18. Batteria completa (02/11): s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 34, s18 55, th5 38, th10 69, th11 88, tutti senza errori (`th2.js` solo generatore di screenshot, timeout come sulla v85). Zone protette (2 blocchi `@media print`, JS di stampa, JS Excel, `_locationCodeColorPC … _codeChip`) IDENTICHE alla v87.
- **Idee ancora aperte**: Gmail nel browser (link `mail.google.com/mail/?view=cm`); destinatario predefinito per trasportatore (Fil non l'ha chiesto: "indirizzi li metto io"); mandare in un colpo solo a tutti i trasportatori; scrivere il testo con anche prodotto/DDT.

---

## Novità v87 — "Copia testo mail" nella schermata Per tratta (non reimplementare)

**Richiesta di Fil** (02/11): "a me mail mi basta solo il testo, dopo ci penso io a impostarla e mettere gli indirizzi e tutto il resto". Ha incollato il formato, che è lo stesso per tutti i trasportatori → nessun "prompt"/AI: testo deterministico generato dai dati della schermata.
```
Pisa Destinazione Verolavecchia
N. 1 viaggio LUN
N. 1 viaggio MERC
N. 1 viaggio VEN

Ciano D'Enza Destinazione Verolavecchia
N. 1 viaggio GIOV
```
- **`_srchTratteMailText(list)`**: per ogni tratta (stesso ordine della schermata) una riga `<partenza> Destinazione <arrivo>` (solo nomi, senza codice tra parentesi) + una riga `N. <n> viaggio|viaggi <GIORNO>` per ogni giorno con viaggi (`_SRCH_DWM`: LUN MART MERC GIOV VEN SAB DOM; viaggi senza data → `(data da definire)`); tratte separate da una riga vuota. `_pv(n)` per il plurale.
- **Pulsante `#srchMailBtn` "Copia testo mail"** (icona `_PCI.copy`) nella testata della schermata Per tratta, prima dell'interruttore; solo in **Settimana** e con almeno un viaggio (`A.total && !A.storico`). Il suggerimento (`title`) mostra il testo che verrà copiato. `srchCopyMail()` → `_srchCopyText(text, done)`: `navigator.clipboard.writeText` (solo se `isSecureContext`), altrimenti/in caso di errore `textarea` nascosta + `document.execCommand('copy')`; l'etichetta diventa "✓ Copiato" (o "Copia non riuscita") per 2,2 s + avviso `showStatus`. ES5, nessun campo di servizio lasciato nella pagina.
- Sotto 820px il pulsante è solo icona (la scritta è nel suggerimento). CSS "v87 — Copia testo mail" prima del blocco v86; colori da variabili (testo `var(--text)`, icona `--ac-orange`; contrasto 8.0 scuro / 10.3 chiaro).
- **Non toccati**: stampa, Excel, colori codici: blocchi IDENTICI alla v86.
- **Build e test**: `test_v74/theme_v78/v87.py` (parte da out86). Nuovo `test_v74/s17.js` (34 controlli: testo identico all'esempio di Fil; copia con appunti finti; metodo di riserva; "Copia non riuscita"; più viaggi nello stesso giorno/MART/SAB/DOM/senza data; filtro Cliente; settimana prossima; niente pulsante in Storico e senza risultati; contrasti; 960/640). `runall.sh` ora include s17. Batteria completa (02/11): s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, s17 34, th5 38, th10 69, th11 88, tutti senza errori (`th2.js` solo generatore di screenshot, supera il timeout come sulla v85). Zone protette (2 blocchi `@media print`, JS di stampa, JS Excel, `_locationCodeColorPC … _codeChip`) IDENTICHE alla v86. Lint: 58 avvisi (+1 `_PCI` usato prima di definirlo, stessa classe innocua).
- **Idee ancora aperte**: formato diverso per tratte/giorni se Fil lo chiede (es. altro testo di apertura/chiusura); vedere le tratte di tutti i trasportatori senza filtro; contare le tratte anche per prodotto.

---

## Novità v86 — "Per tratta": trasportatore / fornitore / cliente → tratte con i giorni di carico (non reimplementare)

**Richiesta di Fil** (23/10): "se cerco il trasportatore mi viene fuori tutta la lista dei viaggi, però deve esserci l'opzione per tratta: Grezzana → Verolavecchia fatto da CONSAR lunedì e giovedì, Bientina → Ponzano lunedì e mercoledì… per poi mandare le mail, perché quando inserisco i viaggi dopo mando sempre le mail". Bozze A (griglia coi giorni) e B (schede): ha proseguito con la A (`Tratte_bozza_A_griglia_giorni.png`). **Seguito previsto**: Fil mostrerà la mail che manda (testo uguale per tutti) → generarla da questa schermata.
- **Criterio "tratta"** `_srchRoute = { k, label }` (k = `_srchNorm(partenza) + '>' + _srchNorm(arrivo)`, `_srchRouteKey(t)`): entra in `_srchCriteria()` (`route`, `routeLabel`; SOLO vista PC, sul telefono è sempre vuoto), `_srchHasCrit`, `_srchTripPass`, `_srchTitleLabel`, `_srchFilterLabel` ("Tratta: A → B" nel sottotitolo del foglio), `_srchFileName` (`…_Tratta_A-B.xlsx`), `desktopQuickFilter` (`hasFilter` + `_srchRouteMatch`) e `_getVisibleTrips` (quindi Excel e stampa filtrati). Chip viola "Tratta: A → B ✕" (`srchClearRoute()`). Si azzera da sola cambiando tipo (`srchSetKind`), testo (`srchTypedInput`) o svuotando (`srchClearTyped`). Non è salvata in localStorage. NON tocca la Rapida (`filterApply` invariato).
- **(SUPERATO dalla v89: il pulsante "Per tratta" non esiste più, ora è la voce "Vedi per tratta" del menu "Invia ▾" accanto alla ricerca, `#srchSendBtn`)** Pulsante "Per tratta" (`#srchTrattBtn`, dentro `#srchTrattWrap`, in fondo alla **riga 2**, a destra): compare solo con un filtro attivo (`_srchTrattBtnHtml()`, aggiornato da `_srchRefreshChips()`). Stava prima nella riga dei filtri, ma a 1366–1440px faceva andare a capo la casella di ricerca (misurato): spostato. Se acceso: sfondo accent al 28%, bordo accent, testo `var(--text)` (contrasto ≥ 4.5; bianco su accent era 3.4).
- **Schermata** (`_srchRenderTratte(c)` dentro `#srchPanel`, modo `_srchPanelMode = 'tratte'`; `srchToggleTratte()` apre/chiude, `_srchTratteForced = true` quando aperta dal pulsante): titolo "Per tratta · Trasportatore: CONSAR · settimana 5 – 9 ott" (+ "· prossima" nella settimana prossima), 4 numeri (viaggi · tratte diverse · trasportatori · giorni di carico / settimane), griglia: una riga per tratta con Fornitore → Cliente (codici colorati), **frase** "1 viaggio Lun + 1 viaggio Gio", chip dei trasportatori (×N), prodotti, "⚠ N da confermare", colonne Lun…Ven (+Sab/Dom/"—" senza data solo se servono) con il numero di viaggi, totale; in fondo "Totale per giorno". Ordine: più viaggi prima, poi alfabetico. I dati: `_srchTratteAggregate(c)` (la tratta scelta NON restringe la schermata che serve a sceglierla). **Settimana/Storico** (interruttore della lente): Settimana = `_pcRubricaWeekTrips()` (settimana mostrata, anche la prossima), Storico = `_srchCollect()` (corrente + archivio, con "in N settimane"). Cambiando filtro o interruttore con la schermata aperta si aggiorna da sola.
- **Clic su una tratta** (`srchTrattaPick(i)`): imposta il criterio tratta; in Settimana chiude il pannello e la tabella mostra solo quei viaggi; in Storico passa all'elenco a schede di quella tratta. Esc, ✕, clic fuori e secondo clic sul pulsante chiudono. Nel pannello Storico l'interruttore **[Elenco viaggi | Per tratta]** (`srchPanelView()`); in Settimana **[Tabella | Per tratta]**.
- **Responsive**: sotto 820px la griglia dei giorni sparisce e resta la frase + totale (i 4 numeri in alto più piccoli).
- **Per la mail (fatto nella v87: pulsante Copia testo mail)**: `_srchTratteAggregate(c)` restituisce già tutto quello che serve (tratta, giorni, conteggi, trasportatori); la frase è `_srchTrattaSentence(g)`.
- **Non toccati**: stampa (`@media print`, JS di stampa), Excel, colori codici/trasportatori: blocchi IDENTICI alla v85. `_srchChipsHtml` ora aggiunge solo il chip tratta; il badge "Filtri ▾" della v85 conta anche la tratta.
- **Build e test**: `test_v74/theme_v78/v86.py` (parte da out85). Nuovo `test_v74/s16.js` (97 controlli: pulsante solo con filtro; tratte/giorni/numeri/totali calcolati su dati finti con CONSAR, CEVOLO, COAP; cambio filtro a pannello aperto; clic su tratta → tabella, chip, Excel/nome file/sottotitolo; tratta + giorno; la tratta cade cambiando filtro; apri/chiudi/Esc/clic fuori; Storico su 3 settimane con "in 3 settimane" e interruttore; settimana prossima; contrasti scuro/chiaro; 960 e 640 con pannello dentro la finestra; badge; telefono invariato). Bozza grafica: `test_v74/tratte_mock.js` + `tratte_mock_page.js`. Batteria: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, s16 97, th5 38, th10 69, th11 88 (`th2.js` è solo un generatore di screenshot, supera il timeout di 280s anche sulla v85; `th5.js` ballerino come prima). `runall.sh` ora include s16. Lint: 57 avvisi (+2 `_PCI` usato prima di definirlo, stessa classe innocua).
- **Idee ancora aperte**: mail dalla schermata; scelta se contare le tratte anche per prodotto; vedere le tratte di TUTTI i trasportatori senza filtro (il pulsante oggi richiede un filtro).

---

## Novità v85 — Vista PC in finestra stretta: rotella ovunque, "Filtri ▾" a scomparsa, pulsanti compatti (non reimplementare)

**Richiesta di Fil** (09/10, 11:39): "se tengo due finestre una di fianco all'altra… nella visualizzazione PC non riesco a scrollare in giù con il mouse"; poi "tu cosa suggerisci? Voglio che sia una cosa fatta bene". Cause misurate (`test_v74/scr1.js`, `scr2.js`): la pagina PC è `overflow:hidden` e scorre solo `#desktopTableScroll`, quindi la rotella funzionava solo con il mouse SOPRA la lista; sopra la lista restavano 243px (1920) / 371px (960) / 455px (≈640), cioè la lista era il 76% / 47–63% / 16–34% della finestra.
- **Rotella ovunque** (`_pcWheelForward`, listener `wheel` passivo su `document`): solo se `body.desktop-view-active` e il mouse è dentro `#desktopView` o `.top-bar`; NON agisce con Ctrl (zoom del browser), sopra Rubrica/overlay (`#pcRubricaPanel`, `#pcRubricaOverlay`) né con una finestra aperta (`_pcAnyOverlayOpen()`: `.modal`, `[id$="Modal"]` visibili), né se sotto il mouse c'è qualcosa che scorre da solo (la lista stessa, menu lunghi). Inoltra deltaY a `scrollTop` e deltaX (o Maiusc+rotella) a `scrollLeft` di `#desktopTableScroll`; `deltaMode` righe/pagine convertito in pixel.
- **Tastiera**: PagGiù/PagSù (90% dell'altezza visibile), Home/Fine scorrono la lista; non quando si scrive in input/textarea/select, non con Ctrl/Alt/Maiusc/Meta, non con finestre aperte.
- **"Filtri ▾"** (`#pcFiltBtn`, classe `.pcb-compact-only`): `html[data-pcfilt]` = "1" righe 2 e 3 della barra (riepilogo + chip trasportatori, filtri giorno/ricerca/modo/livelli) visibili, "0" nascoste. Senza scelta dell'utente: "0" se la finestra è ≤1100px, altrimenti "1" (`_pcFiltResolve()`, ricalcolato al ridimensionamento con 120ms di attesa). Se l'utente preme il pulsante la scelta è salvata in `localStorage 'pcFiltPref'` ('0'/'1') e vince sempre. A filtri chiusi restano in riga 1: "N viaggi" (`.pcb-mini`) e il chip "⚠ N" da confermare (`.pcb-minichip`, apre `openDaConfermarModal()`); sul pulsante c'è un **badge** (`.pcb-fbadge`, `_pcFiltActiveCount()`: filtro giorno ≠ Tutti + testo digitato + testo della lente) così non si dimentica un filtro attivo. Il badge usa sfondo accent al 26%, bordo accent e testo `var(--text)` (contrasto ≥ 4.5; accent+testo chiaro era 3.1). `/` e Ctrl+F aprono i filtri da soli (`_pcFiltEnsureOpen()` in `srchLensOpen()`); `_srchRefreshChips` aggiorna il badge.
- **Pulsanti compatti** sotto 1100px (o altezza ≤760 con larghezza ≤1500): etichette di Multi-tratta/Salva/Carica/Excel dentro `<span class="pcb-l">` nascosto (resta nel DOM; il tooltip del pulsante spiega la funzione); riga 1 con padding ridotto; sotto 760px ancora più stretti (icone 38px). Pastiglia Drive con **testo corto** (`.s`): "Collegato · hh:mm" / "Scollegato · N" / "Non sincronizzato" / "Non collegato"; testo lungo (`.l`) sopra i 1100px. `_driveClassify()` ora restituisce `{st, txt, sh, tip}`; `_pcDrivePillHtml()` e `_driveMirror()` aggiornano entrambi i testi. `updateDriveBtns`, `_setSyncBtnState`, `_pcSyncBtnHtml` mantengono `<span class="pcb-l">`.
- **Risultati misurati** (quota di finestra occupata dalla lista, v84 → v85, 75 viaggi): 1920×1000 76%→76% (invariato, lista a 243px, nessun pulsante Filtri); 1280×700 59%→60% (filtri aperti, riga comandi su una riga; chiudendoli ≈75%); 960×1000 63%→84%; 960×700 47%→77%; 720×800 48%→80%; 683/640×690 27%→77%; 640×600 16%→73%; rotella con il mouse in alto: 0 → 500px.
- **Non toccati**: stampa (`@media print` ×2, JS di stampa), Excel, colori codici/trasportatori: blocchi IDENTICI alla v84 (verificato per confronto di testo). Telefono invariato.
- **Build e test**: `test_v74/theme_v78/v85.py` (parte da out84). Nuovo `test_v74/s15.js` (95 controlli: filtri chiusi/aperti/persistenza/riapertura con "/", rotella su intestazione/pulsanti/riepilogo, Maiusc+rotella, deltaMode, Ctrl, Rubrica e "Nuova riga" aperte, tasti pagina, campi di testo, ridimensionamento 1440→900→1400→700, 1920 invariato, 1280×700, 640×690 scuro+chiaro con contrasti, telefono invariato). `s14.js`: `pill()` ora legge il testo lungo `.l`. Batteria: s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, s14 58, s15 95, th10 69, th11 88; `th5.js` ballerino come prima (35/38 una volta su ~4, uguale sulla v84). Script `runall.sh` lancia tutto in sequenza (`APP=... ./runall.sh`, esito in `battery.log`). Lint: 55 avvisi (+1 della stessa classe "`_PCI` usato prima di definirlo", innocuo). Immagini: `Vista_PC_finestra_stretta_v85.png` (prima/dopo a 640×690 e 960×700).
- **Idee ancora aperte** (non fatte, chiedere a Fil): colonne adattabili sotto 1240px (D) o scorrimento unico della pagina (B); barra "Invia" fissa sul telefono; nuovo stile per Multi-tratta; icone SVG al posto delle emoji; evidenziare OGGI; scorciatoie per la densità; nascondere la riga riepilogo nell'Excel; togliere la vecchia ricerca archivio 🗂 in Rapida.

---

## Novità v84 — Collegamento a Google Drive più robusto + pastiglia "Drive" nella barra PC (non reimplementare)

**Richiesta di Fil** (09/10, 11:07): "il salvataggio e il caricamento… nella versione PC molto spesso dice scollegato, solo locale… controlla cosa vedi". Indagine con un Google finto (`test_v74/drv1.js`): le scritte erano "Drive non riconnesso — tocca un punto qualsiasi per riprovare" / "…premi Salva per riconnettere" / "Salvato solo su questo dispositivo — Drive si riconnette al prossimo tocco", alte 9px nell'intestazione.
- **Cause trovate**: (1) il token di Google dura 1 ora e il browser lo rinnova solo dopo un clic/tasto; (2) il tentativo "al prossimo clic" esisteva SOLO all'apertura e una volta sola (`_driveSilentRetryArmed` non si azzerava mai): dopo la scadenza la scritta prometteva "si riconnette al prossimo tocco" ma non succedeva niente (solo Salva); (3) il rinnovo ogni 50 min partiva senza clic, senza `error_callback`: bloccato in silenzio, e un rinnovo fallito buttava anche il token ancora valido; (4) `driveFindFile` non controllava l'esito: ricerca fallita = "il file non esiste" = poteva creare un secondo file su Drive.
- **Riconnessione al clic**: `_armGestureReconnect()` (listener one-shot su `pointerup` e `keydown`, in cattura) → `silentDriveInit(true, true)` dentro il clic. Si riarma OGNI volta che Drive si perde (apertura, 401, `autoSaveDrive`, ritorno sulla scheda, evento `online`). Se il tentativo fatto con un clic vero fallisce → `_gestEpisodeFailed = true`: NON ripete a ogni clic (niente finestrelle che lampeggiano), il messaggio diventa "premi Salva per riconnettere Drive"; si riprova una volta tornando sulla scheda o quando torna la rete. Se l'utente preme già Salva/Carica/pastiglia, il listener non interviene (ci pensa quel pulsante).
- **Rinnovo mentre si lavora**: `_driveNoteToken(resp)` registra `_driveTokenTs` e `expires_in`; `_driveMaybeRenewOnGesture()` (su `pointerup`/`keydown`): dopo il 75% della vita del token (~45 min) il primo clic/tasto chiama `tryAutoReconnectDrive()` (max 1 volta ogni 2 min). Un rinnovo fallito NON azzera `driveAccessToken` (vale fino alla scadenza; se poi scade, ci pensa il 401 → riarmo).
- **Pastiglia nella barra PC** (`#pcDrivePill`, classe `.pcb .pcb-drive`, `data-st="ok|busy|lost|err|off"`): sta dopo il gruppo Salva/Carica/Excel, `onclick="driveSync()"` (collega o sincronizza). Testi: "Drive collegato · hh:mm" · "Sincronizzo…"/"Riconnessione…" · "Scollegato · clicca per riconnettere" / "Scollegato · N da inviare" · "Non sincronizzato · riprovo" · "Drive non collegato · clicca". Il testo resta sempre `var(--text)` (leggibile); lo stato lo dicono pallino, bordo e sfondo (token `--success/--warning/--ac-red`). Si aggiorna da sola copiando lo stato di `#driveStatusText` con un MutationObserver (`_driveMirror()`), quindi funziona con tutti i punti dell'app che scrivono lo stato; il template della vista PC la ridisegna con `_pcDrivePillHtml()`. Conteggio "da inviare" = viaggi con `ts` più recente dell'ultimo `savedAt` noto + lapidi (`_driveUnsentCount()`). Nella vista PC la scritta piccola dell'intestazione è nascosta (`.desktop-view-active #driveStatus {display:none !important}`); sul telefono resta com'era.
- `driveLogin`: se Google non è caricato (offline/bloccato) mostra "Google non raggiungibile" invece di un errore muto.
- **Non toccati**: stampa, Excel, tutto il resto. Build: `test_v74/theme_v78/v84.py` (parte da out83). Test: nuovo `s14.js` (58 controlli con Google finto: apertura a freddo, scadenza, rinnovo a 30/46 min, rinnovo fallito, ricerca file in 500 senza POST, clic fallito che non si ripete, pastiglia in 5 stati × scuro/chiaro con contrasto ≥ 4.5, finestra stretta 960, mai collegato, offline, telefono invariato) + batteria precedente (s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, s13 134, th5 38, th10 69, th11 88). Lint: 54 avvisi (2 in meno della v83). Stampa/Excel/codici: blocchi IDENTICI. **`th5.js` è instabile** (1 volta su ~4 dà 35/38 con "dopo la ricarica il tema è già applicato a DOM pronto…", anche sulla v82): non è una regressione, rilanciarlo da solo.
- **`harness.js`**: nuova opzione `init` (script iniettato prima dell'app, per i test con Google finto).
- ~~Ancora aperto: scorrere con la rotella nella vista PC con finestre affiancate~~ → **risolto in v85** (vedi "Novità v85"; le misure di partenza sono lì).

## Novità v83 — "già N" sotto ogni giorno (finestra PC) + "Modifica viaggio" del telefono con lo stile nuovo (non reimplementare)

**Richiesta di Fil** ("si, fallo" alla mia proposta dopo la v82): (a) nella finestra PC "Nuovo viaggio" scrivere sotto ogni giorno quanti viaggi ci sono già; (b) dare lo stile nuovo alla finestra "Modifica viaggio" del telefono.
- **"già N"**: in ogni riquadro giorno (`.dpk`) c'è un `<span class="x" id="dpk-has-<giorno>">` sotto i tasti −/+. Lo riempie `_dpkUpdate(d)`: `iso = desktopGetNextWeekday(d)`, lista = `tripsNext` se `_pcWeekMode==='next'` altrimenti `trips`, conta `t.data === iso` → testo `già N` (classe `x has`) oppure `vuoto` (classe `x`, più chiara); `title` del riquadro: "Ci sono già N viaggio/viaggi in questo giorno" / "Nessun viaggio in questo giorno". Conta solo quelli GIÀ in tabella: non cambia mentre si tocca +/− (quelli scelti stanno nel numero grande e nel riepilogo). Con il riquadro acceso il testo prende il colore del giorno (`rgb(var(--di))`). CSS blocco "v83": `.dpk .x`, `.dpk .x.has`, `.dpk[data-st="on"] .x`.
- **Modifica viaggio (`#editModal`)**: stessi ID di prima. Campi con classi `af-in` (`af-strong` trasportatore, `af-from` partenza = bordo rosso, `af-to` arrivo = bordo verde, `af-mono` DDT) al posto degli stili scritti a mano (tolti anche dal select Prodotto e dalle Note); etichette `#editModal .form-group > label` 12px più marcate; "Da confermare" = `.af-conf` con `data-on="0|1"` (la funzione `_syncEditDaConfermareUI` ora imposta solo l'attributo, niente più stili inline); tasto in fondo = `.af-save` (gradiente arancione, 16px, "💾 Salva Modifiche", ≥44px di altezza). Il comportamento (editTrip, _commitEditForm, closeEditModal) è identico.
- **NON toccati**: Multi-tratta (ancora col vecchio stile), stampa, Excel.
- Idee ancora aperte (non fatte senza ok di Fil): barra fissa vera per il tasto di invio del modulo Aggiungi sul telefono; stile nuovo anche per la Multi-tratta; icone SVG al posto delle emoji; OGGI in evidenza.
- Build: `test_v74/theme_v78/v83.py` (parte da out82 = v82). Test: nuovo `s13.js` (134 controlli: PC 1440/1366/1100 scuro+chiaro: già 3 ×5, aggiunta e riapertura → già 4/5/4, "vuoto", settimana prossima, singolare "1 viaggio", leggibilità, geometria, cambio tema a finestra aperta; telefono 390 scuro/chiaro e 360 scuro: classi, contrasti bordo≥1.5 testo≥7, Da/A colori diversi, nessuno scorrimento orizzontale, tasto visibile, interruttore, salvataggio, riapertura senza residui) + batteria precedente (s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, s12 159, th5 38, th10 69, th11 88). Stampa ed Excel: blocchi IDENTICI alla v82. Lint: nessun avviso nuovo (56 come in v82). Nota: th5 una volta è risultato 35/38 durante la batteria in background, poi 38/38 per due volte rilanciato da solo (falso allarme di tempi).

## Novità v82 — Aggiungi viaggio: finestra PC "pannello unico" + telefono senza sovrapposizioni (non reimplementare)

**Richiesta di Fil** (con 3 foto): la finestra "Nuovo viaggio" del PC è troppo piccola e tagliata in alto, i campi non si vedono (grigio su grigio), sul telefono i pulsanti si accavallano. Ha scelto la **variante A (pannello unico)** tra 3 bozze (A pannello unico a 2 colonne · B pannello laterale · C a 3 passi; i mockup sono in `test_v74/theme_v78/mock82.js`).
- **Cause trovate**: (1) la finestra PC stava dentro `#desktopView` (fixed, z-index 50), un livello PIÙ BASSO dell'intestazione (z 100): la parte alta finiva sotto la barra → titolo tagliato. (2) Il tasto "Aggiungi Viaggio" del telefono era `position:sticky;bottom:80px` ma `#addTripSection` ha `overflow:hidden`, che diventa il contenitore di riferimento dello sticky: non è mai stato fisso a schermo, restava 62px sopra il fondo del modulo e copriva "Da confermare". (3) Sfondo campo `veil 5%` + bordo `veil 10%` sullo sfondo della scheda: contrasto ≈ 1.1. (4) Colori dei giorni scritti a mano (`_dpkColors` blu/verde scuri, `_mdayColors` gialli chiari): invisibili in scuro / in chiaro. (5) Barra giorni `rgba(surface,0.95)`: il testo sotto traspariva.
- **Finestra PC** (`#desktopAddModal`): ora si crea UNA volta dentro `<body>` (`_dmEnsureModal()`, all'avvio, nascosta) e NON è più nel template di `renderDesktopView` (quindi non viene mai ridisegnata né duplicata, nemmeno al cambio tema). Larghezza `min(1280px,95vw)`, max 94vh; a sinistra: rotte rapide (griglia 2×3, pillola trasportatore colorata come in tabella), Trasportatore/Prodotto, riquadri Da (arancione) e A (verde) con il codice azienda colorato accanto (`_dmTags`), DDT, Note; a destra: 5 riquadri-giorno (Lun…Ven con data reale, contatore, − / +; tocco = +1), data specifica, "Da confermare", **Riepilogo** (una riga per giorno, ×N) e il pulsante diventa "✅ Aggiungi N viaggi". Esc chiude; clic fuori chiude solo se il clic è iniziato fuori (trascinando per selezionare un testo non si chiude). Senza giorni: avviso `#dmWarn` (non più il riquadro riepilogo colorato di rosso).
- Stessi ID di prima: `dmTransp dmProd dmFrom dmTo dmDDT dmNote dmDate dmDaConf dmDaConfRow dmSummary dmRouteChips desktopDayPicker dpk-<giorno> dpk-cnt-<giorno>` + nuovi `dmSub dmFromTag dmToTag dmWarn dmOk dmSumCnt dmSumRows dpk-date-<giorno>`. Funzioni: `desktopAddEmpty(prefill)` (identica come uso), `desktopCloseAddModal`, `desktopConfirmAdd`, `_dpkUpdate`, `desktopUpdateSummary`, `_dmPopulateRoutes` (ora 6 rotte, `_dmApplyRoute(indice|oggetto)`), `_syncDmDaConfermareUI`.
- **Telefono** (`#tripForm`): campi 16px con sfondo/bordo visibili; etichette 12px più scure; giorni `.dchip` con stato `data-st="off|main|on"` e colori della tabella (`_DAYPAL`, inchiostro adattato al tema con `_themeRgb`); **la data sotto ogni giorno non sparisce più dopo il tocco** (prima `btn.textContent=…` cancellava il sotto-titolo); "Da confermare" con interruttore ben visibile; il tasto di invio è nel flusso, sotto "Da confermare". Barra giorni `rgb(var(--surface-rgb))` opaca.
- **Classi nuove (CSS blocco "v82")**: `.af-lab .af-in (.af-from .af-to .af-pre .af-strong .af-mono) .af-preg .af-sub-row .af-sub .af-pill .af-sumbox .dchips .dchip .af-conf .af-sw .af-th` (condivise telefono+PC) e `.nv-* .dpk*` (solo finestra PC). Variabili `--fld-a` (sfondo campo), `--fld-ba` (bordo), `--chip-a` (sfondo giorni): scuro .32/.24/.22, chiaro .85/.30/.65 — per rendere i campi più/meno marcati basta cambiare questi tre numeri. Cambio tema: `_addFormsRepaint()` (agganciata a `_themeRerender`) ridisegna i colori dei giorni.
- Idee NON fatte in v82: barra fissa vera per il tasto di invio sul telefono; stile nuovo nella Multi-tratta (non toccata). ("già N" e "Modifica viaggio" fatti in v83.)
- Build: `test_v74/theme_v78/v82.py` (parte da out81 = v81). Test: nuovo `s12.js` (159 controlli: PC 1440/1366/1100, scuro+chiaro, contrasti misurati, apertura/chiusura, giorni, riepilogo, aggiunta con date/DDT/note/da confermare, tema a finestra aperta; telefono: nessuna sovrapposizione, barra opaca, campi, giorni, invio, duplica) + batteria precedente (s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, th5 38, th10 69, th11 88). Stampa ed Excel: blocchi IDENTICI alla v81. Lint: nessun avviso nuovo.

## Novità v81 — Vista PC: due modalità (Schede / Excel) × 7 livelli di dimensione (non reimplementare)

**Richiesta di Fil**: «nella visualizzazione PC una doppia visualizzazione, righe più piccole per avere una panoramica, tipo Excel, con la possibilità di aumentare e diminuire a passi, un po' come la luminosità». Risposta: **stessa tabella, due modalità, stesso DOM** (quindi modifica, DDT, note, Tab, filtri, ricerca funzionano uguale); cambia solo il CSS.
- **Controllo** nella riga filtri della barra PC (prima del tasto "Data"): `[Schede | Excel]` + `[−] ▮▮▮▮▮▮▮ [+]` (7 tacche cliccabili, livelli **−3 … +3**, 0 = com'era). `_pcDensHtml()` lo disegna dentro `renderDesktopView()`.
- **Schede** livello 0 = **identico alla v80** (nessuna regola attiva; righe 69–80px). Livelli: −3 ≈ 34–38px (senza etichette FORNITORE/LOCALITÀ) · −2 ≈ 49 · −1 ≈ 55–69 · +1 ≈ 74–86 · +3 ≈ 84–98 (testi +9%, niente scorrimento orizzontale).
- **Excel**: una riga per viaggio (Fornitore │ Località e Cliente │ Località affiancati, senza riquadri, filo sottile tra le colonne), righe **19 / 22 / 25 / 27 (liv. 0) / 31 / 35 / 40px**. A 1440×900 tutta la settimana di prova (15 viaggi, 5 giorni) entra in una schermata (in Schede ne entrano ~8). Intestazione con «Fornitore │ Località».
- **Come funziona**: attributi su `<html>`: `data-pcmode="cards|excel"` e `data-pclvl="-3…3"` → variabili `--pc-f` (moltiplicatore testi) e `--pc-p` (moltiplicatore spazi). Tutto in un blocco CSS `@media screen` etichettato "v81" (la stampa non cambia). Nel template della riga (`tripRow`) e in thead/righe giorno ho solo **aggiunto classi**: `pc-trip, pc-c-grip/date/trasp/from/to/prod/stato, pc-trasp-in, pc-loc, pc-loc-code, pc-lab, pc-loc-coderow, pc-dot, pc-code, pc-loc-sep, pc-loc-name, pc-loc-in, pc-prod-in, pc-oggi, pc-th (+pc-th-<campo>), pc-day-td/bar/name/badge`. Gli stili inline restano: le regole v81 li battono con `!important`.
- **Stato**: JS `_pcDens {mode, cards, excel}` + `pcDensMode(m)`, `pcDensStep(±1)`, `pcDensSet(n)`, `_pcDensApply()`. Ogni modalità ricorda il **proprio** livello. localStorage: `pcDensMode`, `pcDensCards`, `pcDensExcel`. Cambiare modalità/livello NON ridisegna la tabella (solo CSS).
- Attenzione: le celle hanno `transition: all 0.15s` inline, quindi nei test aspettare ~350ms prima di misurare.
- Idee NON fatte (da proporre a Fil): scorciatoie da tastiera per − / +, nascondere il riepilogo (riga 2 della barra) in Excel per guadagnare altri ~45px, colonna DDT dedicata in Excel.
- Build: `test_v74/theme_v78/v81.py` (parte da out80 = v80). Test: nuovo `th11.js` (88 controlli: predefinito identico alla v80, livelli monotoni, limiti dei pulsanti, persistenza e ricarica, ridisegno, modifica/DDT/filtro in Excel, nessuno scorrimento orizzontale a 1440 e 1280, temi, telefono) + batteria precedente (s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, th5 38, th10 69). Stampa ed Excel: blocchi IDENTICI alla v80.

## Novità v80 — Salva e Carica nell'header (non reimplementare)

**Richiesta di Fil**: «nella visualizzazione rapida mettiamo i tasti salva e carica in alto così sono più comodi». Prima stavano in fondo alla pagina (≈2800px di scroll).
Ora sono **nell'header** (sticky: sempre visibili anche scorrendo), prima del pulsante sole/luna: `.top-bar-right > .top-bar-btns > #syncBtn #loadBtn #themeToggleBtn`.
Stessi `id` e stessi `onclick` (`driveSync()` / `driveLoad()`); la vecchia riga in fondo è stata tolta (restano Excel, Nuova sett., Cancella).
- **Telefono (≤600px)**: solo icone, cerchi da 34px come il sole/luna (nuvola in su verde = Salva; nuvola in giù azzurra = Carica). Con la scritta il titolo VIAGGI veniva coperto (a 390px resta 33px liberi tra titolo e tasti). Header: 67px (era 63). **PC / tablet**: pillole con icona + scritta.
- **Visibili in Rapida, Trasp., Oggi, Aggiungi. Nascosti nella vista PC** (`.desktop-view-active .hdr-btn`), che ha già la sua barra Salva/Carica/Excel (`#desktopSyncBtn`, `#desktopLoadBtn`).
- **Stati** con classi, non più stili scritti a mano: spento (Drive non connesso, opacità .6) · `.on` (connesso) · `.saving` (icona che gira, «Salvo…») · `.saved` (✓ pieno verde, 3 s, poi torna `.on`/spento) · `.err` (nuvola barrata, rosso). Helper `_hdrBtn(btn, kind, label, state)` + `_HDR_ICO` (icone SVG a linea, come il sole/luna); chiamato da `updateDriveBtns()` e `_setSyncBtnState()`.
- Colori solo da variabili (nuova `--ac-cyan-rgb` nei due temi). Verificati i 4 livelli × scuro/chiaro.
- **Correzione di passaggio**: la barra dei giorni LUN…VEN (sticky) misurava l'altezza dell'header una sola volta, prima che comparisse la riga di stato Drive → scorrendo finiva 11px (ora 15px) sotto l'header e le sigle sparivano. Ora un `ResizeObserver` sull'header la tiene sempre sotto (e la vista PC parte sotto l'header). Vale anche per le versioni precedenti: era un difetto già presente.
- Build: `test_v74/theme_v78/v80.py` (parte da out79 = v79). Test: nuovo `th10.js` (69 controlli: 4 larghezze telefono, PC 1440, stati, tocchi, viste, temi) + tutta la batteria precedente (s2 31, s3 40, s4 14, s8 40, s9 8, s10 12, s11 17, th5 38). Stampa ed Excel: blocchi IDENTICI alla v79.
- Nota test: `th5.js` può dare 3 falsi allarmi («dopo la ricarica…») se lanciato in parallelo con altri test (sovraccarico: succede anche sulla v79); da solo passa 38/38.

## Novità v79 — Filo tra un viaggio e l'altro (non reimplementare)

Tabella PC: le righe non sono più schede staccate (spazio 8px + ombra + angoli tondi) ma righe attaccate con un **filo sottile tenue** sotto ogni viaggio:
`td { border-bottom:1px solid rgba(var(--veil-rgb),0.14) }`, `border-spacing:0`. L'ultimo viaggio del giorno non ha il filo (c'è già la riga colorata del giorno: `:has(+ .day-sep-row)`).
Scelto da Fil tra 4 intensità (tenue / medio 0.26 / marcato 0.40 / puntinato). Per cambiare intensità basta il numero 0.14 nel CSS (blocco "v79"). Le righe sono ~8px più compatte di prima.
Provata un'altra variante (schede staccate con il filo nello spazio in mezzo): in una tabella HTML non viene pulita, scartata. Build: `test_v74/theme_v78/v79.py` (parte dalla v78). Regressione: tutti i test ok come in v78.

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


---

# 6 · RIFERIMENTO — funzioni principali

> Elenco delle funzioni più usate, ripulito il 16/11/2026 (tolte: dettatura vocale e vecchia ricerca archivio, non più nel codice). Per ciò che è stato fatto dopo la v98 vedere anche «Funzioni recenti» e le singole «Novità».

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
- `desktopToggleConfermato(idx)` — ⚠️ CODICE MORTO, non collegata a nulla (vedi Roadmap C1)
- `desktopAddEmpty()`, `desktopGetNextWeekday(dayName)` (fix v24)
- `desktopConfirmAdd()`, `desktopCloseAddModal()`
- **Rubrica (v58)**: `pcToggleRubrica()`, `pcRubricaSetTab(tab)`, `pcRubricaSelectEntity(key)`,
  `_pcRubricaRender()`, `_pcRubricaGroups(tab)`, `_pcRubricaColor(tab, key)`,
  `_pcRubricaDetailHtml(tab, key, col)`, `_pcRubricaCode(locText)`, `_pcRubricaWeekTrips()`

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

### Funzioni recenti (v99–v112)
- **«Nuovi viaggi»**: `nwrOpen/nwrToggle/nwrClose/nwrConfirm`, `_nwrCommit(newTrips,toNext)`, `_nwrIsPC`, `_nwrActHtml`, `_nwrNavHtml`, `_nwrJump`, `_nwrGroups`, `_nwrListHtml`, `_nwrExisting`, `_nwrToast`, `_nwrDoneShow`, `_nwrDoneMark`; stato in `_nwr`.
- **Tabellone / Colonne / viste PC**: `pcViewSet`, `pcToggleViewMenu`, `_pcDensApply`, `_pcDens`, `_tbHtml`, `_tbRowHtml`, `_tbFilter`, `_tbSplit`, `_bdApply`, `_bdFilter`, `_bdScrollToday`, `bdExport`, `_pzPrintHtml`, `_pzBoot`.
- **Menu ⋯ «Strumenti»**: `pcToggleMoreMenu`, `_PCM_GROUPS`, `_PCM_IC`, `_pcmClose`, `_pcmKeyH`, `pcForceUpdate`.
- **Stampa / Excel**: `window.printPlanning`, `_xpPrintHtml`, `_xpSelection`, `_buildAndDownloadExcel`, `_XP_T`, `_XP_DOT`, `_XP_TINK`.
- **Sync / dati**: `_stampTrips`, `_mergeState`, `_runSync`, `_driveSyncCore`, `_driveWriteData`, `_listsMergeRemote`, `_lmSet`, `silentDriveInit`.


---

# 7 · APPENDICI STORICHE (non più valide come elenco di lavoro)

# (STORICO — SUPERATA il 16/11/2026) Vecchia ROADMAP e vecchie liste «Da verificare subito»

> ⚠️ **Questa appendice NON è più valida come elenco di lavoro.** La roadmap aggiornata è nella sezione 2 in cima. Qui restano, per cronologia: le vecchie priorità (la 1 e la 2 sono state chiuse in v67, la 0 in v78, il punto 4 con v78) e le prove che per ogni versione «non erano state fatte». La parte realmente ancora aperta è stata riassunta in §1.8.


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

- **v104 — look «P2» della tabella PC: cose che NON ho potuto provare da qui** (provato in Chromium con dati finti, chiaro/scuro, 3 toni, Schede 7 livelli + Excel; 87 controlli in `s32.js`):
  1. **Sui viaggi veri di Fil**: quali codici prendono la tinta dipende dai suoi dati (primi 6 per ruolo con almeno 2 viaggi, archivio compreso). Chiedergli se i colori «giusti» sono quelli che si aspetta e se il cambio di tinta quando cambia la classifica lo disturba (alternativa: tinte fisse salvate per codice).
  2. **Nome del trasportatore nel tema chiaro**: contrasto 3,0–3,6 (il più basso CONSAR). Se lo legge male: scurire `--k4-pa/--k4-pb` del tema chiaro (vedi «Novità v104»).
  3. **Righe più alte di 3px** (zoccolo): se gli sembrano troppo alte ci sono i livelli «−» e la modalità Excel.
  4. Da caricare su GitHub **solo `index.html`** (il `sw.js` v89 non cambia): poi ⋯ → «Aggiorna app» e controllare che compaia «App Viaggi v104».

- **v89 — "Invia ▾" + aggiornamento: cose che NON ho potuto provare da qui** (provato in Chromium con dati finti e con un server finto che imita GitHub Pages; 70 controlli in `s19.js` + 12 in `swtest.js`):
  0. **PROBLEMA REALE DI FIL (02/11, foto)**: sul suo schermo girava una versione ≤ v83 (niente buste, niente "Per tratta", scritta Drive "non riconnesso – premi Salva…") anche dopo aver "ricaricato il file". Causa più probabile: il **service worker `sw.js`** (registrato da `index.html`) tiene in cache la pagina vecchia ("cache first") — riprodotto in `swtest.js`. Da qui NON ho potuto leggere né il suo `sw.js` né il sito (rete bloccata): ho scritto un **`sw.js` nuovo** (pagina sempre dalla rete, copia salvata solo offline, cancella le cache vecchie, ricarica una volta le pagine aperte) da caricare **insieme** a `index.html`. Se dopo il caricamento il menu ⋯ non mostra "App Viaggi v89", la causa è un'altra (file caricato nel posto sbagliato / Pages non pubblicato): chiedere a Fil come carica i file e cosa vede aprendo l'indirizzo in una scheda normale.
  1. **Apertura della posta** (`mailto:`): Fil ha detto "Altra posta / non so". Chrome può chiedere "Aprire Outlook?" la prima volta (consenti sempre); se nessun programma gestisce `mailto:` non succede niente → il testo è comunque copiato (Ctrl+V). Testo > ~1800 caratteri: si apre la mail col solo oggetto. Se usa Gmail nel browser: link `https://mail.google.com/mail/?view=cm&su=…&body=…` (da fare solo se serve).
  2. **Oggetto** scelto da me: "Viaggi COAP · settimana 5 – 9 ott" (senza nome se i trasportatori trovati sono più di uno). Nessun destinatario/saluto/firma.
  3. Il pulsante "Per tratta" in riga 2 e le buste sui chip (v88) **non ci sono più**: tutto sta nel menu "Invia ▾" accanto alla ricerca (scelta C di Fil, "tutto più semplice").

- **(v88, SUPERATA dalla v89) — busta "Invia mail" sul trasportatore: cose che NON ho potuto provare da qui** (provato in Chromium con dati finti, scuro+chiaro, 1440/1366/960/700/640px; 55 controlli in `s18.js`):
  1. **Apertura della posta sul PC di Fil**: il pulsante apre un link `mailto:` (programma di posta predefinito di Windows/Chrome). Fil ha risposto "Altra posta / non so", quindi NON so cosa usa. Possibili sorprese: (a) Chrome chiede la prima volta "Aprire Outlook/Posta?" → spuntare "consenti sempre"; (b) se nessun programma è associato a `mailto:` non succede niente → il testo è comunque copiato (Ctrl+V); (c) Outlook/Posta di Windows tagliano i link molto lunghi: oltre ~1800 caratteri l'app apre la mail col solo oggetto e il testo resta negli appunti. Se Fil usa Gmail nel browser, la strada giusta è un link `https://mail.google.com/mail/?view=cm&su=…&body=…` (da fare solo se serve).
  2. **Oggetto** scelto da me: "Viaggi CONSAR · settimana 5 – 9 ott" (da far confermare). Nessun destinatario, nessun saluto/firma.
  3. A larghezza finestra < ~740px i chip dei trasportatori vanno a capo su due righe (la busta li allarga di ~85px in tutto); era già così a 640px nella v87.

- **v87 — "Copia testo mail": cose che NON ho potuto provare da qui** (provato in Chromium con dati finti, scuro+chiaro, 1440/960/640px; 34 controlli in `s17.js`):
  1. **Copia negli appunti sul vero browser di Fil** (Chrome da `https://…github.io` = contesto sicuro → `navigator.clipboard`; se non va, parte la copia "alla vecchia maniera"; se nemmeno quella, il pulsante scrive "Copia non riuscita"). Provato con appunti finti.
  2. **Formato**: ricostruito dall'esempio di Fil (`Pisa Destinazione Verolavecchia` / `N. 1 viaggio LUN` …). Ipotesi mie da fargli confermare: plurale "N. 2 viaggi", giorni LUN MART MERC GIOV VEN SAB DOM, nessun saluto/chiusura, righe vuote tra le tratte, riga vuota "stray" del suo esempio ignorata, ordine = quello della schermata (più viaggi prima), nomi senza codice tra parentesi.
  3. Il pulsante c'è solo in **Settimana** (nello Storico i giorni sono sommati su più settimane); il testo elenca le tratte mostrate nella schermata (quindi con filtro Cliente/Fornitore/Trasportatore diverso → tratte diverse).

- **v86 — "Per tratta": cose che NON ho potuto provare da qui** (provato in Chromium con dati finti: PC 1440×900, 960×700, 640×690; scuro+chiaro; 97 controlli in `s16.js`):
  1. **Sui viaggi veri di Fil**: cercare un trasportatore (es. CONSAR) → pulsante **"Per tratta"** in fondo alla riga del riepilogo (a destra) → controllare che Grezzana → Verolavecchia, Bientina → Ponzano ecc. abbiano i giorni giusti. La "tratta" è la coppia testo intero di *Partenza* → *Arrivo* (codici compresi, senza maiuscole/accenti): due scritture diverse dello stesso posto (es. "Verolavecchia (SICEM)" e "Verolavecchia") sono due tratte diverse.
  2. **Settimana prossima**: la schermata segue la settimana mostrata (`_pcRubricaWeekTrips()`); provato con dati finti.
  3. **Mail**: la schermata è pensata come base per l'invio mail ai trasportatori; la mail NON è ancora stata fatta: Fil deve mostrare il testo che manda (sempre uguale per tutti) per poterlo generare con un clic dalla schermata.
  4. A finestra stretta (<1100px) il pulsante sta nella riga del riepilogo, quindi si vede solo con "Filtri ▾" aperto.

- **v85 — vista PC in finestra stretta: cose che NON ho potuto provare da qui** (provato in Chromium: 1920×1000, 1440×900, 1280×700, 960×700, 720×800, 640×690, 640×600; scuro+chiaro; 95 controlli in `s15.js`):
  1. **Rotella sul PC vero con due finestre affiancate**: passare il mouse sull'intestazione, sui pulsanti, su "Filtri" e girare la rotella → deve scorrere la lista; con la Rubrica o "Nuova riga" aperte la lista dietro deve restare ferma. Con **Maiusc + rotella** si scorre di lato (colonne a destra).
  2. **Windows con ingrandimento 125–150%**: la finestra "vale" meno pixel; sotto i 1100px compare "Filtri ▾" e le etichette di Multi-tratta/Salva/Carica/Excel diventano solo icone (il tooltip spiega la funzione). Controllare che le icone si riconoscano.
  3. **Font Outfit vero**: nei test il font di Google non si carica (rete bloccata), quindi larghezze dei pulsanti possono differire di qualche pixel. Se su 1100–1280 px la barra comandi va su due righe, aggiungere la soglia in `@media (max-width:1100px), (max-height:760px)` di `v85.py`.
  4. **PagGiù / PagSù / Home / Fine** scorrono la lista quando non si sta scrivendo in un campo e nessuna finestra è aperta.
  5. Non fatti di proposito (aspettano un ok di Fil): **opzione D** (colonne adattabili sotto 1240px: oggi la tabella ha `min-width:1240px` e le colonne a destra si raggiungono con Maiusc+rotella o la barra in basso) e **opzione B** (tutta la pagina scorre insieme).

- **v84 — collegamento a Google Drive: cose che NON ho potuto provare da qui** (provato in Chromium con un Google FINTO che simula popup bloccato/consentito, token scaduto, ricerca file in errore; 58 controlli in `s14.js`):
  1. **Google vero sul PC di Fil**: all'apertura dell'app la pastiglia nella barra PC deve passare da "Scollegato · clicca per riconnettere" a "Drive collegato · hh:mm" **con UN clic in un punto qualsiasi**. Se invece resta "Scollegato" anche dopo il clic, vuol dire che Google chiede un login vero (sessione scaduta / cookie bloccati): allora serve premere la pastiglia (apre il collegamento normale). Consiglio a Fil: in Chrome, lucchetto accanto all'indirizzo → Impostazioni sito → "Popup e reindirizzamenti" = Consenti; così la riconnessione può avvenire anche senza clic.
  2. **Rinnovo dopo ~45 minuti**: nel test funziona con il clic; sul PC vero controllare che dopo un'ora di lavoro la pastiglia resti verde (il rinnovo apre per un istante una finestrella di Google che si richiude da sola).
  3. **Telefono**: la logica è la stessa (primo tocco riconnette), ma sul telefono resta la vecchia scritta piccola in intestazione (la pastiglia c'è solo nella vista PC).
  4. ~~Scroll della vista PC in finestra stretta~~ → **fatto in v85** (vedi sopra).

- **v83 — "già N" nei giorni (PC) + "Modifica viaggio" (telefono): cose che NON ho potuto provare da qui** (provato in Chromium: PC 1440×900, 1366×768, 1100×700; telefono 390 e 360; scuro+chiaro; 134 controlli in `s13.js`):
  1. **Telefono vero**: aprire un viaggio dalla Rapida (matita) e controllare che l'ultima riga "Da confermare" non finisca sotto il tasto "Salva Modifiche" scorrendo fino in fondo (nel test: no, sia a 360 che a 390 di larghezza).
  2. **PC vero**: il "già N" conta i viaggi della settimana che si sta guardando (corrente o prossima) per quella data; sul PC vero controllare che i numeri coincidano con la tabella.
  3. **Selettore data** della finestra Modifica: nel test è in formato americano; sul telefono italiano sarà gg/mm/aaaa.

- **v82 — Aggiungi viaggio (PC + telefono): cose che NON ho potuto provare da qui** (provato in Chromium: PC 1440×900, 1366×768, 1100×700, telefono 390×844; scuro+chiaro; 159 controlli in `s12.js`):
  1. **Sul PC vero di Fil** (portatile con schermo basso): aprire "Nuova riga" e controllare che titolo, tutti i campi e i due pulsanti in fondo si vedano senza scorrere. A 1366×768 provato: sì; sotto 820px di altezza i margini si stringono da soli; sotto 1100px di larghezza le due colonne diventano una sola (si scorre dentro la finestra).
  2. **Telefono vero**: il tasto "Aggiungi Viaggio" ora sta in fondo al modulo (non è più fisso a schermo): se Fil lo vuole sempre visibile mentre scorre, va fatto con una barra fissa vera sopra la barra in basso (da decidere con lui).
  3. **Font Outfit vero** (nel test è il font di ripiego, più largo): sul PC vero i nomi lunghi in "Da/A" dovrebbero stare meglio.
  4. **Selettore data**: nel test è in formato americano (mm/dd/yyyy); sul PC italiano sarà gg/mm/aaaa.

- **v81 — vista PC Schede/Excel: cose che NON ho potuto provare da qui** (provato in Chromium a 1440 e 1280px, scuro+chiaro, con 15 viaggi finti):
  1. **Con una settimana vera** (più viaggi, nomi lunghi, note, DDT): i testi lunghi nelle colonne Località/Fornitore vengono tagliati con «…» nei livelli piccoli (c'è il tooltip). Controllare che il livello −3 / Excel sia ancora leggibile sul monitor di Fil (la leggibilità dipende dall'astigmatismo: se i testi di Excel sono troppo piccoli, alzare i valori `--pc-f` del livello 0 di Excel o far partire Excel dal +1).
  2. **Font Outfit vero** (nel test è il font di ripiego, più largo): sul PC vero i nomi dovrebbero stare meglio.
  3. **Stampa**: il codice è IDENTICO alla v80, ma la stampa dalla vista PC in modalità Excel non è stata provata con stampante vera.

- **v80 — Salva/Carica nell'header: cose che NON ho potuto provare da qui** (provato in Chromium a 360/375/390/430px e PC 1440, scuro+chiaro):
  1. **Sul telefono vero di Fil**: le due icone sono riconoscibili e comode da toccare? (34px, zona di tocco allargata). Se le vuole con la scritta, l'header dovrebbe diventare a due righe (+~12px): da decidere con lui.
  2. **Font Outfit vero**: nel test non si carica (rete bloccata), quindi la larghezza del titolo è misurata col font di ripiego (più largo): sul telefono vero dovrebbe esserci un po' più aria, non meno.
  3. **Drive vero**: gli stati (spento / connesso / salvo / salvato / errore) sono provati chiamando le funzioni dell'app, non con un vero salvataggio su Google Drive.

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


---

# (STORICO) Contesto, vincoli, workflow e architettura prima del 16/11/2026, palette Tema G

> ⚠️ **Superato dalle sezioni 1.1–1.7 in cima.** Tema G e navy scuro non sono più in uso (sostituiti da v78). Tenuto solo per cronologia. File di lavoro e versione indicati qui (`app_viaggi_v61.html`) sono quelli di allora.

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

**Decisione di Fil, 07/11 (dopo la v103)**: i nomi dei **trasportatori** possono restare nel file pubblico (colori fissi per nome com'è, `getTransporterKey` e CSS `--t-*` NON si toccano); l'importante è che non ci siano **clienti e fornitori/impianti**. Il piano «v104 a slot di colore» è stato annullato. Unica modifica: l'esempio «San Felice sul Panaro» in un commento (riga ~7280) riscritto senza nome di luogo; la v103 consegnata il 07/11 contiene già questa correzione (stessa versione, solo un commento diverso). Scansione ripetibile: nomi estratti da `out96.html` (liste e mappe tolte dalla v97) + nomi di luoghi, cercati senza distinzione di maiuscole nel file finale.
