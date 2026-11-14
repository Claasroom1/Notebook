// Tafel-App – Schüler-Version: nur hier (wird nach schueler.js und mitschrift.js geladen)
//   · 📋 Stundenablauf gibt es nicht (Werkzeug der Lehrkraft)
//   · 💼 Wirtschaft: Bildtafeln leer – nur Rahmen, Pfeile und Überschrift, die Begriffe schreiben die Schülerinnen und Schüler selbst hinein
//   · Kategorie „📋 Stunde & Rückmeldung“ heißt „📝 Mitschrift & Lernen“
'use strict';
(function () {
const B = T.BAUSTEINE; if (!B || !T._svg) return;
const { nachDemZeichnen } = T.VL;

// ---------- 📋 Stundenablauf entfällt ----------
delete B.stundenablauf;
if (T.KACHEL_VARIANTEN) delete T.KACHEL_VARIANTEN['stundenablauf:leer'];

// ---------- 💼 Wirtschaft: leere Vorlagen ----------
// Stehen bleiben nur Überschrift (💼 …), Stufennummern, Achsen (Menge, Preis), „Beispiel:“ und die Spaltenköpfe des Haushaltsplans.
const BLEIBT = /^(💼 .*|[1-5]|Menge|Preis|Beispiel:|€|Summe|Einnahmen|Ausgaben|Einnahmen − Ausgaben =|🏠|🏭)$/;
for (const k of ['wi_maslow', 'wi_bedarf', 'wi_gueter', 'wi_prinzip', 'wi_kreislauf', 'wi_markt']) {
  const Bk = B[k]; if (!Bk || !Bk.gen) continue; const alt = Bk.gen;
  Bk.gen = (d, P) => { const g = alt(d, P); return g && typeof g.svg === 'string' ? { ...g, svg: g.svg.replace(/<text[^>]*>([^<]*)<\/text>/g, (m, t) => BLEIBT.test(t.trim()) ? m : '') } : g; };
  Bk.felder = []; delete Bk.schnell; /* Namen/Beispiele/Überhänge ein-aus: gibt es leer nicht */
}

// Einfügen: Kategorie „📋 Stunde & Rückmeldung“ heißt hier „📝 Mitschrift & Lernen“
nachDemZeichnen.push(() => {
  document.querySelectorAll('button').forEach(b => { for (const n of b.childNodes) if (n.nodeType === 3 && n.nodeValue.includes('📋 Stunde & Rückmeldung')) n.nodeValue = n.nodeValue.replace('📋 Stunde & Rückmeldung', '📝 Mitschrift & Lernen'); });
});
})();
