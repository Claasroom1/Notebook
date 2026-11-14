// Tafel-App – Schüler-Version (SuS): wird NUR in der Schüler-Kopie als letztes Skript geladen.
// Die übrigen app/*.js sind unverändert aus der Haupt-App übernommen – Updates: Dateien einfach neu kopieren
// (speicher.js und oberflaeche.js aber aus Tafel-App-GitHub, PIN-Hinweis!), diese Datei und die Zeile in Tafel.html bleiben.
// Grundsatz: Was die App selbst ausrechnet oder ausmisst (Maße, Winkel, Umfang, Fläche, Volumen …), erscheint hier gar nicht –
// auch kein „?“ (aufdecken ginge ja nicht) und keine Menüpunkte dafür.
// Lösungen, die schon verdeckt sind (Aufgaben „? Lösung“, Übungen mit Prüfen), bleiben, wie sie sind.
(() => {
  T.SCHUELER = true;
  document.documentElement.classList.add('schueler');
  const B = T.BAUSTEINE || {};
  const filt = (l, re) => Array.isArray(l) ? l.filter(q => !(q && re.test(q.l || ''))) : l;
  const ohne = (liste, re) => typeof liste === 'function' ? (...a) => filt(liste(...a), re) : filt(liste, re); /* Menüeinträge (schnell/teil) ohne die entfernten */
  const nachDemZeichnen = []; /* Aufräumarbeiten im Menü, sobald sich die Oberfläche ändert */
  new MutationObserver(() => nachDemZeichnen.forEach(fn => fn())).observe(document.body, { childList: true, subtree: true });

  // ---------- Formen: Seitenlängen, Winkel-Gradzahl, Winkelart, Umfang, Fläche, Formel-Rechnung und -Ergebnis ----------
  // Alle Anzeigen laufen über T.winkelZustand ('zahl' | 'frage' | 'leer'): hier immer 'leer' (Winkel: nur der Bogen).
  // Die allgemeine Formel (Sorte Ff, z. B. A = a · b) bleibt offen stehen.
  T.winkelZustand = (pg, key) => T.wertSorte(key) === 'Ff' ? 'zahl' : 'leer';
  T.winkelUmschalten = () => {}; /* Antippen: nichts aufzudecken */
  T.formelZeileUmschalten = () => {};
  // 🧮 Formelkasten: nur die Formel – Zeilen „Rechnung“ und „Ergebnis“ gibt es nicht
  if (T.formelKasten) { const alt = T.formelKasten; T.formelKasten = (ctx, pg, it, ...r) => alt(ctx, pg, { ...it, fa: { ...(it.fa || {}), r: 1, e: 1, f: 0 } }, ...r); }
  // 📏 Bemaßung-Tabelle: Spalte „verdeckt“ (Auge) und die Zeilen ohne Anzeige entfernen
  document.head.append(Object.assign(document.createElement('style'), { textContent:
    '.schueler .bm-tab { grid-template-columns: minmax(0, 1fr) 54px; } .schueler .bm-tab > :nth-child(3n) { display: none; }' }));
  const WEG = /Seitenlängen|Umfang|Fläche|Winkelart|Rechnung|Ergebnis/;
  nachDemZeichnen.push(() => document.querySelectorAll('.bm-tab .bm-name').forEach(n => {
    if (!n.classList.contains('bm-gesamt') && WEG.test(n.textContent) && !n.textContent.includes('☑')) { /* ☑ Umfang u / Flächeninhalt A = welche Formel im Kasten steht – bleibt */ n.nextElementSibling && n.nextElementSibling.nextElementSibling && n.nextElementSibling.nextElementSibling.remove(); n.nextElementSibling && n.nextElementSibling.remove(); n.remove(); } }));

  // ---------- 3D-Körper: Volumen V und Oberfläche O gibt es nicht (Kantenlängen sind Angaben und bleiben) ----------
  for (const k of ['wuerfel', 'quader', 'pyramide', 'prisma', 'zylinder', 'kegel', 'kugel']) {
    const Bk = B[k]; if (!Bk || !Bk.gen) continue;
    const alt = Bk.gen;
    Bk.gen = (d, P) => alt({ ...d, volumen: false, oberflaeche: false }, P);
    if (Array.isArray(Bk.felder)) Bk.felder = Bk.felder.filter(f => f.k !== 'volumen' && f.k !== 'oberflaeche');
  }
  if (T.chipZeile) { const alt = T.chipZeile; T.chipZeile = (liste, ...r) => alt(Array.isArray(liste) ? liste.filter(c => !(c && /^(Volumen V|Oberfläche O)$/.test(c.title || ''))) : liste, ...r); } /* Symbolzeile ohne 📦 🧱 */

  // ---------- 📐 Figur (Winkel einstellbar): eingestellte Winkel bleiben, die mitgerechneten (γ, δ …) nur als Bogen; keine Seitenlängen ----------
  if (B.figur && B.figur.gen) {
    const alt = B.figur.gen;
    B.figur.gen = (d, P) => {
      const gegeben = d.form === 'dreieck' || d.form === 'trapez' ? [0, 1] : d.form === 'rechteck' ? [] : [0]; /* α (und β) stellt man selbst ein */
      const wz = { ...(d.wz || {}) };
      for (let i = 0; i < 4; i++) if (!gegeben.includes(i) && (wz[i] || 'zahl') === 'zahl') wz[i] = 'leer';
      return alt({ ...d, wz, seiten: false }, P);
    };
    B.figur.felder = (B.figur.felder || []).filter(f => f.k !== 'seiten');
    B.figur.schnell = ohne(B.figur.schnell, /Seitenlängen|Alle Winkel zeigen/);
    B.figur.teil = ohne(B.figur.teil, /Seitenlängen/);
  }

  // ---------- Körpernetze: gegebene Maße (a, h, r) bleiben, berechnete (s ≈, hₛ ≈, u ≈, α ≈) entfallen ----------
  for (const k of ['koerpernetz', 'wuerfelnetz']) {
    const Bk = B[k]; if (!Bk || !Bk.gen) continue; const alt = Bk.gen;
    Bk.gen = (d, P) => { const g = alt(d, P); return g && typeof g.svg === 'string' ? { ...g, svg: g.svg.replace(/<text[^>]*>[^<]* ≈ [^<]*<\/text>/g, '') } : g; };
  }

  // ---------- 📊 Diagramm: keine ausgerechneten Prozente im Kreisdiagramm, keine Ausgleichsgerade/Gleichung ----------
  if (B.diagramm && B.diagramm.gen) {
    const alt = B.diagramm.gen;
    B.diagramm.gen = (d, P) => { const g = alt({ ...d, ausgleich: false }, P); return g && typeof g.svg === 'string' ? { ...g, svg: g.svg.replace(/<text[^>]*>\d+ %<\/text>/g, '') } : g; };
    B.diagramm.felder = (B.diagramm.felder || []).filter(f => f.k !== 'ausgleich');
    B.diagramm.schnell = ohne(B.diagramm.schnell, /Ausgleichsgerade/);
  }

  // ---------- Aufgabengenerator: Vorschau ohne Lösungen, Lösungen nie offen „auf neuer Seite“ ----------
  const MARKE = '⁣';
  if (T.erzeugeAufgaben) {
    const alt = T.erzeugeAufgaben;
    T.erzeugeAufgaben = (...a) => {
      const r = alt(...a);
      if (r && Array.isArray(r.loesungen)) { const L = r.loesungen, j = L.join.bind(L); L.join = sep => sep === '   ' ? MARKE : j(sep); } /* nur die Vorschau im Menü verbindet mit drei Leerzeichen */
      return r;
    };
  }
  nachDemZeichnen.push(() => document.querySelectorAll('.vorschau').forEach(v => { if (v.innerHTML.includes(MARKE)) v.innerHTML = v.innerHTML.replace(new RegExp('(\\s|<br\\s*/?>)*Lösungen: ' + MARKE), ''); }));
  if (T.opts && T.opts.aufLoes === 'seite') T.opts.aufLoes = 'einzeln';
  nachDemZeichnen.push(() => document.querySelectorAll('select option[value="seite"]').forEach(o => { if (o.parentNode.querySelector('option[value="abdeckung"]')) { if (o.selected) { o.parentNode.value = 'einzeln'; o.parentNode.dispatchEvent(new Event('change')); } o.remove(); } }));

  // ---------- ⚙ Einstellungen: nur, was Schülerinnen und Schüler am Tablet/PC brauchen ----------
  // Board-Optionen (Handballen, Schwammgröße, eigene Bildschirmtastatur, Stift-Test, Bedienseite am Pult) gibt es nicht;
  // unter „📐 Formen & Messen“ bleibt nur die Formenleiste (Maße zeigt die Schüler-Version ohnehin nicht an).
  if (T.opts) { T.opts.palm = false; T.opts.tastatur = false; delete T.opts.handRadierer; delete T.opts.neuWinkel; delete T.opts.neuMasse; T.opts.winkelFrage = false; }
  const EINST_WEG = /^(Handballen oder Board-Schwamm|Schwammgröße für Handballen|⌨ Eigene Bildschirmtastatur|Bedienseite \(Pult|❓ Winkel und Maße zuerst verdeckt)/;
  nachDemZeichnen.push(() => {
    const r = document.querySelector('.einst-rechts'); if (!r) return;
    r.querySelectorAll(':scope > label.fld').forEach(l => { if (EINST_WEG.test(l.textContent.trim())) l.remove(); });
    r.querySelectorAll(':scope > h3').forEach(h3 => {
      const t = h3.textContent.trim();
      if (t === 'Stift-Test' || t.startsWith('Neue Formen zeigen automatisch')) { let n = h3.nextElementSibling; while (n && n.tagName !== 'H3') { const w = n; n = n.nextElementSibling; w.remove(); } h3.remove(); }
    });
  });

  // ---------- 📱 Werkzeugleiste fürs iPad: kein 🖱 PC-Feld; „T Text“ steht direkt neben dem Stift ----------
  const pcAus = () => { const a = Array.isArray(T.opts.leisteAus) ? T.opts.leisteAus : []; if (a.includes('pc')) return false; T.opts.leisteAus = a.concat('pc'); return true; };
  if (pcAus() && T.buildToolbar) { T.saveOpts && T.saveOpts(); T.buildToolbar(); }
  nachDemZeichnen.push(() => {
    if (pcAus() && T.buildToolbar) { T.saveOpts && T.saveOpts(); T.buildToolbar(); return; } /* z. B. nach „↺ Standard“ */
    document.body.classList.remove('pcAuf');
    const s = document.getElementById('t_stift'), t = document.getElementById('t_text');
    if (s && t && s.nextElementSibling !== t) { t.classList.remove('pc-tool'); s.after(t); }
    document.querySelectorAll('.leiste-anpassen .la-chip, .leiste-anpassen > button').forEach(c => { if (c.textContent.includes('PC: Verschieben')) c.remove(); });
    document.querySelectorAll('.leiste-anpassen').forEach(r => { if (r.children.length === 1 && r.textContent.trim() === 'Ausgeblendet:') r.remove(); });
  });

  // ---------- 🎒 Classroom: ohne Klassenliste, Phasentimer, Arbeitssymbole, Ampel, Lautstärke, Ruhe! (Werkzeuge zum Klasse-Führen) ----------
  // gilt für das Classroom-Menü (Leiste unten und Seitenleiste) und die Auswahl für ⭐ Favoriten
  const CR_WEG = /^(📋\s*Klassenliste|⏳\s*Phasentimer|🤫\s*Arbeitssymbole|🚦\s*Ampel|🔊\s*Lautstärke|📢\s*(📢\s*)?Ruhe!)$/;
  if (T.CR) delete T.CR.ruhe;
  nachDemZeichnen.push(() => {
    document.querySelectorAll('button').forEach(b => { if (!b.closest(AUSNAHME) && CR_WEG.test(b.textContent.replace(/­/g, '').replace(/\s+/g, ' ').trim())) (b.closest('.sl-zeile2') || b).remove(); }); /* Leiste unten: Zeile samt ☆ */
    document.querySelectorAll('.tiles').forEach(t => { if (!t.children.length) { const v = t.previousElementSibling; if (v && v.tagName === 'H3') v.remove(); t.remove(); } });
    document.querySelectorAll('.sl-gruppe').forEach(g => { const n = g.nextElementSibling; if (!n || n.classList.contains('sl-gruppe')) g.remove(); });
  });

  // ---------- Texte: aus Sicht von Schülerinnen und Schülern statt Lehrkräften ----------
  // [Suchen, Ersetzen] – gilt für Texte und Tooltips (title, placeholder) der Oberfläche, nicht für Tafel-Inhalte.
  const TEXTE = [
    ['Den PIN legt man auf der Startseite bei der eigenen Lehrkraft fest', 'Den PIN legt man auf der Startseite beim eigenen Namen fest'],
    ['Jede Lehrkraft wählt ihren eigenen Ordner', 'Alle wählen ihren eigenen Ordner'],
    ['Darin liegen ihre Tafeln (Lehrkraft › Klasse › Fach)', 'Darin liegen die eigenen Tafeln (Name › Klasse › Fach)'],
    ['Einstellungen des Boards (Finger, Handballen …)', 'Einstellungen des Geräts (Finger …)'],
    ['(außer Finger, Handballen, Druck und Bildschirmtastatur – die gehören zum Board)', '(außer Finger und Druck – die gehören zum Gerät)'],
    ['Tipp: Mit gewählter Lehrkraft werden die Einstellungen in ihrem Ordner gespeichert.', 'Tipp: Nach dem Anmelden werden die Einstellungen im eigenen Ordner gespeichert.'],
    [' Handballen: wegwischen.', ''],
    ['☝ Finger & Board', '☝ Finger & Bedienung'],
    ['(Board unterscheidet nicht)', '(Gerät unterscheidet nicht)'],
    ['Ablageordner › Lehrkraft › Klasse', 'Ablageordner › Name › Klasse'],
    ['Tafeln dieser Lehrkraft erst', 'Tafeln dieser Person erst'],
    ['vor Neugierigen am Board', 'vor Neugierigen'],
    ['an Ihrer Schule', 'an deiner Schule'],
    ['Für alle Lehrkräfte freigeben', 'Für alle freigeben'],
    ['(alle Lehrkräfte)', '(alle)'],
    ['Bitte nur teilen, wenn diesen Ordner ausschließlich Lehrkräfte sehen.', 'Bitte nur teilen, wenn alle, die diesen Ordner sehen, die Namen sehen dürfen.'],
    ['Kolleginnen und Kollegen mit demselben Ordner', 'Alle mit demselben Ordner'],
    ['Kolleginnen und Kollegen', 'anderen'],
    ['Lehrkraft, Fach und Datum ändern', 'Name, Fach und Datum ändern'],
    [' · Lehrkraft · ', ' · '],
    ['🧑‍🏫 Tafel-App', '🧑‍🎓 Tafel-App'],
    ['wie Windows', 'wie iOS'],
    ['Phasentimer, Timer, Zufall, Würfel …', 'Timer, Zufall, Würfel …'],
    ['Am Board: mit zwei Fingern zoomen · am PC: Strg + Mausrad', 'Mit zwei Fingern zoomen']
  ];
  const GENAU = { 'Lehrkraft': 'Name' }; /* Feldbeschriftung in „Tafel-Infos“ */
  const ersetze = s => { if (!s) return s; if (GENAU[s.trim()]) return s.replace(s.trim(), GENAU[s.trim()]); let r = s; for (const [a, b] of TEXTE) if (r.includes(a)) r = r.split(a).join(b); return r; };
  const AUSNAHME = '#board, canvas, svg, textarea, [contenteditable="true"]'; /* Tafel-Inhalte und Eingaben nie ändern */
  const textKnoten = n => { if (!n.parentElement || n.parentElement.closest(AUSNAHME)) return; const v = ersetze(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; };
  const attr = el => { if (el.closest(AUSNAHME)) return; for (const a of ['title', 'placeholder']) { const v = el.getAttribute(a); if (v) { const w = ersetze(v); if (w !== v) el.setAttribute(a, w); } } };
  const pruefe = n => {
    if (n.nodeType === 3) return textKnoten(n);
    if (n.nodeType !== 1) return;
    attr(n); n.querySelectorAll('[title], [placeholder]').forEach(attr);
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) textKnoten(t);
  };
  new MutationObserver(ms => { for (const m of ms) {
    if (m.type === 'childList') m.addedNodes.forEach(pruefe);
    else if (m.type === 'characterData') textKnoten(m.target);
    else if (m.type === 'attributes') attr(m.target);
  } }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder'] });
  pruefe(document.body);
})();
