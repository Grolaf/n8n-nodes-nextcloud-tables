# n8n-nodes-nextcloud-tables

Ein **Production-Ready** n8n Community Node für die umfassende Integration mit Nextcloud Tables. Diese Node ermöglicht vollständige Tabellen-Verwaltung, erweiterte Datenoperationen und professionelle Workflow-Automation.

## 🚀 **Professional Features**

### 📊 **Umfassende Tabellen-Operationen**
- **Alle Tabellen abrufen**: Listet alle verfügbaren Tabellen auf
- **Tabelle abrufen**: Ruft Details einer spezifischen Tabelle ab
- **Tabelle erstellen**: Erstellt neue Tabellen mit optionalen Templates
- **Tabelle aktualisieren**: Aktualisiert Eigenschaften bestehender Tabellen
- **Tabelle löschen**: Löscht Tabellen (mit Bestätigung)

### 🎯 **Erweiterte Zeilen-Operationen**
- **Alle Zeilen abrufen**: Smart-Pagination (1-1000 Zeilen)
- **Erweiterte Filter**: 11 Filter-Operatoren (=, !=, >, >=, <, <=, LIKE, starts_with, ends_with, is_empty, is_not_empty)
- **Multi-Column-Sorting**: Mehrere Spalten mit Prioritäten
- **Volltext-Suche**: Durchsucht Text-Spalten (case-sensitive/insensitive)
- **Zeile abrufen**: Spezifische Zeilen mit formatierter Ausgabe
- **Zeile erstellen/aktualisieren**: Spalten-basierte Validierung
- **Zeile löschen**: Mit detaillierter Rückmeldung

### 📋 **Views-Management**
- **View-CRUD**: Vollständige Create, Read, Update, Delete-Operationen
- **Filter & Sortierung**: Konfigurierbare Ansichten
- **Dynamic Views**: Automatische Datenfilterung

### 🗂️ **Spalten-Management**
- **5 Spaltentypen**: Text, Number, DateTime, Selection, UserGroup
- **Type-spezifische Konfiguration**: Pattern, Min/Max, Optionen, Multi-Select
- **Automatische Validierung**: Echtzeit-Datenvalidierung

### 🤝 **Kollaborations-Features**
- **Shares-Management**: Benutzer- und Gruppen-Freigaben
- **Granulare Berechtigungen**: Read, Create, Update, Delete, Manage
- **Berechtigungs-Updates**: Dynamische Permission-Verwaltung

### 📥 **CSV-Import**
- **Flexible Import-Optionen**: Header-Erkennung, verschiedene Trennzeichen
- **Column-Mapping**: Automatisch oder manuell
- **Datentyp-Konvertierung**: Auto, Text, Number, DateTime, Boolean
- **Import-Status**: Überwachung und Fehlerbehandlung

### 🌐 **App-Context-Integration**
- **Context-Navigation**: Nextcloud-App-Integration
- **Context-Tabellen**: Gefilterte Tabellen-Ansichten
- **Context-Pages**: App-Page-Management

## 🔥 **Advanced Features**

### 💾 **Advanced Data Processing**
- **Spalten-basierte Validierung**: Automatische Validierung nach Spaltentyp
- **DateTime-Unterstützung**: ISO 8601, Unix-Timestamp, Date-Only
- **Selection-Validierung**: Optionen-Prüfung gegen verfügbare Auswahlen
- **Multi-Select-Support**: Arrays für UserGroup und Selection-Spalten
- **Export-Funktionen**: CSV/JSON mit lesbaren Spaltennamen

### ⚡ **Performance & Reliability**
- **Smart Retry-Logic**: 3 Versuche mit exponentiellem Backoff
- **HTTP-Status-Handling**: Spezifische Behandlung für 10 Status-Codes
- **Client + Server-seitige Filter**: Hybrid-Ansatz für maximale Kompatibilität
- **Optimierte Pagination**: Performance-optimierte Datenabfrage

### 🎨 **Benutzerfreundlichkeit**
- **Deutsche Lokalisierung**: Vollständig lokalisierte Benutzeroberfläche
- **Erweiterte Tooltips**: Praktische Beispiele und Best-Practices
- **Progressive Disclosure**: Erweiterte Optionen nur wenn benötigt
- **Resource Locator**: Benutzerfreundliche Ressourcen-Auswahl

## Installation

1. Installieren Sie das Paket über npm:
```bash
npm install n8n-nodes-nextcloud-tables
```

2. Starten Sie n8n neu, um die neue Node zu laden.

## Konfiguration

### Credentials
Erstellen Sie neue Credentials vom Typ "Nextcloud Tables API":

1. **Nextcloud URL**: Die vollständige URL Ihrer Nextcloud-Instanz (z.B. `https://cloud.example.com`)
2. **Benutzername**: Ihr Nextcloud-Benutzername
3. **Passwort**: Ihr Nextcloud-Passwort oder besser ein App-Passwort

⚠️ **Empfehlung**: Verwenden Sie ein App-Passwort anstelle Ihres normalen Passworts:
- Gehen Sie zu Nextcloud → Einstellungen → Sicherheit → App-Passwörter
- Erstellen Sie ein neues App-Passwort für n8n
- Verwenden Sie dieses in den Credentials

## 🔧 **Advanced Usage**

### Professional Data Querying mit Filtern

```javascript
// Erweiterte Zeilen-Abfrage
Resource: Zeile
Operation: Alle Zeilen Abrufen
Quelle: Tabelle
Tabelle: [Auswahl aus Dropdown]

// Erweiterte Optionen
Filter aktivieren: true
Sortierung aktivieren: true
Suche aktivieren: true

// Filter-Konfiguration
Filter:
  - Spalte: "Status"
    Operator: "Gleich (=)"
    Wert: "Aktiv"
  - Spalte: "Erstellt"
    Operator: "Größer (>)"
    Wert: "2024-01-01"

// Sortierung
Sortierung:
  - Spalte: "Priorität"
    Richtung: "Absteigend (Z-A, 9-1)"
  - Spalte: "Erstellt"
    Richtung: "Aufsteigend (A-Z, 1-9)"

// Suche
Suche:
  Suchbegriff: "Projekt"
  Groß-/Kleinschreibung beachten: false
```

### CSV-Import mit Column-Mapping

```javascript
// CSV-Import
Resource: Import
Operation: CSV in Tabelle Importieren
Tabelle: [Auswahl aus Dropdown]
CSV-Datei: [Binary-Input]

// Import-Optionen
Header-Zeile vorhanden: true
Trennzeichen: "Semikolon (;)"
Text-Qualifizierer: "Anführungszeichen"

// Column-Mapping
Spalten-Zuordnung:
  - CSV-Spalte: "Name"
    Tabellen-Spalte: "Kundenname"
    Datentyp: "text"
  - CSV-Spalte: "Datum"
    Tabellen-Spalte: "Erstellungsdatum"
    Datentyp: "datetime"
```

### Multi-Spalten Tabellenerstellung

```javascript
// Tabelle mit Spalten erstellen
Resource: Tabelle
Operation: Tabelle Erstellen
Titel: "Projektmanagement"
Emoji: "📋"

// Dann Spalten hinzufügen
Resource: Spalte
Operation: Spalte Erstellen
Tabelle: [Erstellte Tabelle]

Spalten-Konfiguration:
  - Titel: "Projektname"
    Typ: "Text"
    Pflichtfeld: true
    Max-Länge: 100
  
  - Titel: "Budget"
    Typ: "Zahl"
    Dezimalstellen: 2
    Minimum: 0
    Präfix: "€"
  
  - Titel: "Deadline"
    Typ: "Datum/Zeit"
    Standard-Datum: "jetzt"
```

## 📊 **API-Vollständigkeit**

Diese Node bietet **100% API-Abdeckung** der Nextcloud Tables API v2:

### ✅ Unterstützte Endpunkte
- **Tables**: `/tables` (GET, POST, PUT, DELETE)
- **Rows**: `/tables/{id}/rows`, `/views/{id}/rows` (GET, POST, PUT, DELETE)
- **Views**: `/tables/{id}/views`, `/views/{id}` (GET, POST, PUT, DELETE)
- **Columns**: `/tables/{id}/columns`, `/columns/{id}` (GET, POST, PUT, DELETE)
- **Shares**: `/tables/{id}/shares`, `/shares/{id}` (GET, POST, PUT, DELETE)
- **Import**: `/tables/{id}/import` (POST + Status)
- **Context**: `/contexts`, `/contexts/{id}/tables`, `/contexts/{id}/pages` (GET)

### 🔧 **Kompatibilität**
- **Nextcloud**: 28+
- **Tables App**: 0.6+
- **n8n**: 1.0+

## Entwicklung

### Setup
```bash
# Dependencies installieren
npm install

# TypeScript kompilieren
npm run build

# Development-Modus (Watch)
npm run dev

# Linting
npm run lint
npm run lintfix

# Code formatieren
npm run format
```

### Professional-Architektur
```
nodes/NextcloudTables/
├── NextcloudTables.node.ts              # Haupt-Node
├── nextcloud-tables.svg                 # Custom Icon
├── descriptions/                        # UI-Definitionen
│   ├── table.ts     ├── view.ts
│   ├── row.ts       ├── column.ts
│   ├── share.ts     ├── import.ts
│   └── context.ts
├── handlers/                           # Business Logic
│   ├── table.handler.ts    ├── view.handler.ts
│   ├── row.handler.ts      ├── column.handler.ts
│   ├── share.handler.ts    ├── import.handler.ts
│   └── context.handler.ts
├── helpers/                           # Core Utilities
│   ├── api.helper.ts                  # HTTP + Error Handling
│   ├── data.formatter.ts              # Data Validation
│   └── node.methods.ts                # Dynamic Dropdowns
└── interfaces/                        # TypeScript Types
    └── index.ts
```

## 🛠️ **Troubleshooting**

### Häufige Probleme

**401 Unauthorized Error**
- ✅ App-Passwort verwenden statt normales Passwort
- ✅ Benutzer-Berechtigung für Tables-App prüfen
- ✅ Nextcloud-URL ohne API-Pfad angeben

**Filter funktionieren nicht**
- ✅ Spalten-IDs statt Namen verwenden
- ✅ Datentyp-kompatible Werte eingeben
- ✅ Client-seitige Filterung als Fallback aktiviert

**Performance-Optimierung**
- ✅ Limit auf 50-200 Zeilen für große Tabellen
- ✅ Spezifische Spalten-Filter statt Volltext-Suche
- ✅ Pagination für große Datenmengen verwenden

### Erweiterte Fehlerbehandlung
Die Node bietet detaillierte Fehlermeldungen für:
- **400**: Ungültige Anfrage → Eingabedaten prüfen
- **401**: Nicht autorisiert → Credentials aktualisieren
- **403**: Zugriff verweigert → Berechtigungen prüfen
- **404**: Nicht gefunden → Ressourcen-IDs überprüfen
- **429**: Rate-Limit → Automatische Wiederholung
- **5xx**: Server-Fehler → Retry-Logic aktiviert

## 📈 **Performance-Metriken**

- **Durchsatz**: Bis zu 1000 Zeilen pro Request
- **Retry-Strategien**: 3 Versuche mit exponential backoff
- **Filter-Performance**: Server + Client-seitige Optimierung
- **Memory-Effizienz**: Streaming für große Datenmengen

## 🏆 **Production-Ready**

Diese Node ist **bereit für den produktiven Einsatz** und bietet:
- ✅ Comprehensive Error Handling
- ✅ Data Validation & Sanitization
- ✅ Performance Optimization
- ✅ Intuitive German UI
- ✅ Complete API Coverage
- ✅ Robust Retry Logic

**Bereit für den produktiven Einsatz in professionellen Workflows!** 🚀

## Lizenz

MIT

## Support

- GitHub Issues: [GitHub Repository](https://github.com/user/n8n-nodes-nextcloud-tables)
- n8n Community: [n8n Community Forum](https://community.n8n.io/)
- Documentation: [Nextcloud Tables API](https://github.com/nextcloud/tables/blob/main/docs/API.md)

## Contributing

Beiträge sind willkommen! Diese Node implementiert bereits 100% der API-Funktionalität. Pull Requests für weitere Verbesserungen oder Bug-Fixes sind herzlich willkommen. 