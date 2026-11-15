# Seelen-Harmonie – technisch überarbeitet

Einfach den Ordnerinhalt ins Vercel-Projekt legen (statisch, kein Build nötig).

## Damit das Kontaktformular sendet
1. Konto bei resend.com anlegen und Domain seelen-harmonie.com verifizieren (DNS-Einträge).
2. In Vercel → Settings → Environment Variables setzen:
   - RESEND_API_KEY = API-Key von Resend
   - KONTAKT_AN = Nicoles E-Mail-Adresse
   - KONTAKT_VON = Seelen-Harmonie <formular@seelen-harmonie.com>
3. Neu deployen. Ohne diese Variablen zeigt das Formular ehrlich einen Fehler statt „gesendet“.

## Noch von Nicole auszufüllen
- impressum.html und datenschutz.html: alle [eckigen Klammern], danach rechtlich prüfen lassen
- index.html: Zahl bei „Viele – Jahre Erfahrung“ (Kommentar TODO)
- Falls die Domain anders lautet: canonical, og:url, og:image, robots.txt, sitemap.xml anpassen
