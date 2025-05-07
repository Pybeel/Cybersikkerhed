# Cybersikkerhed Awareness Platform

En interaktiv læringsplatform om cybersikkerhed udviklet til at øge bevidstheden om digitale trusler.

## Indholdsfortegnelse

### HTML Sider
- `index.html` - Forside med introduktion og statistikker
- `mail.html` - E-mail phishing scenarie
- `wifi.html` - WiFi sikkerhedsscenarie
- `sms.html` - SMS svindel scenarie
- `kodeord.html` - Password sikkerhedsscenarie
- `resultat.html` - Resultatside med scoring og anbefalinger

### JavaScript Filer (i `/js`)
- `mail.js` - Logik for e-mail phishing øvelse
- `wifi.js` - Håndtering af WiFi sikkerhedsvalg
- `sms.js` - SMS scenarie interaktioner
- `kodeord.js` - Password validering og feedback
- `resultat.js` - Resultatberegning og visualisering

### Styling (i `/styles`)
- `main.scss` - Hovedstyling og import af komponenter
- `_base.scss` - Grundlæggende styling og variabler
- `_result.scss` - Styling for resultatvisning
- `_animations.scss` - Animationer og transitions

### Point System
- Mail Scenarie: 3 point
  - 1 point per korrekt identificeret trussel
- WiFi Scenarie: 2 point
  - 2 point for mobilnetværk
  - 1 point for VPN
- SMS Scenarie: 2 point
  - 2 point for verificering
  - 1 point for sletning
- Kodeord Scenarie: 6 point
  - 1 point per opfyldt sikkerhedskrav

### Teknisk Stack
- HTML5
- SCSS/CSS3
- Vanilla JavaScript
- Font Awesome ikoner
- Responsive design

### Vedligeholdelse
- SCSS filer skal kompileres ved ændringer
- JavaScript filer er modulære og selvstændige
- Alle tekster er på dansk
- Responsivt design understøtter alle skærmstørrelser
