# Tafel-App für Schülerinnen und Schüler

Digitale Tafel zum Schreiben, Zeichnen, Messen und Üben – optimiert für das **iPad mit Apple Pencil**.
Läuft komplett im Browser, ohne Installation, ohne Anmeldung und ohne Server: Alles wird nur auf dem eigenen Gerät gespeichert.

**Schüler-Version:** Die App zeigt keine Lösungen sofort an. Was sie selbst ausrechnen oder ausmessen würde (Seitenlängen, Winkel, Winkelart, Umfang, Fläche, Formeln mit Zahlen und Ergebnis, Volumen, Oberfläche), wird gar nicht angezeigt – auch kein „?“ und keine Menüpunkte dafür. Verdeckte Lösungen zum Antippen (Aufgaben, Übungen mit Prüfen) bleiben.

**Starten:** `Tafel.html` öffnen – oder nach dem Einrichten von GitHub Pages die Adresse des Repositorys aufrufen.

Bedienung: [Anleitung.md](Anleitung.md)

## Auf dem iPad mit Apple Pencil

1. Die Seite in **Safari** öffnen.
2. **Teilen › „Zum Home-Bildschirm“** – danach die Tafel über das neue Symbol starten. So läuft sie im Vollbild, auch ohne Internet, und Safari löscht die gespeicherten Tafeln nicht nach einigen Tagen.
3. **Apple Pencil schreibt**, der **Finger** verschiebt die Tafel, zoomt (zwei Finger) und bedient Objekte.

## Veröffentlichen mit GitHub Pages

1. Neues Repository anlegen und den Inhalt dieses Ordners hochladen (die Dateien aus `.gitignore` bleiben draußen).
2. Im Repository **Settings › Pages › Build and deployment**: *Deploy from a branch*, Branch `main`, Ordner `/ (root)` – speichern.
3. Nach ein bis zwei Minuten ist die Tafel unter `https://<benutzername>.github.io/<repository>/` erreichbar.

## Technik: Schüler-Schalter

Alle Dateien in `app/` stammen unverändert aus der Lehrkräfte-Version. Nur `app/schueler.js` (setzt `T.SCHUELER = true`, blendet die errechneten Werte aus, entfernt Board-/PC-Optionen – Handballen, Bildschirmtastatur, Stift-Test, Pult-Seite, 🖱 PC-Feld –, stellt „T Text“ neben den Stift und formuliert die Oberflächentexte aus Schülersicht um) wird zusätzlich als letztes Skript in `Tafel.html` geladen. Für ein Update die `app/`-Dateien der Lehrkräfte-Version neu kopieren, `schueler.js` und die Zeile in `Tafel.html` behalten, in `sw.js` die Dateiliste übernehmen (mit `./app/schueler.js`) und `VERSION` erhöhen.

## Eine einzige HTML-Datei bauen (optional)

`Einzeldatei bauen.ps1` (Windows PowerShell) erzeugt daneben `Tafel-App Schueler (eine Datei).html` mit allem eingebettet.

## Datenschutz

Keine Anmeldung, kein Tracking, keine Daten an fremde Server. Externe Inhalte (z. B. YouTube-Videos, GeoGebra) werden nur geladen, wenn man sie selbst einfügt.
Karten: Natural Earth (gemeinfrei). PDF-Anzeige: PDF.js (Apache-2.0).
