# n8n-nodes-nextcloud-tables

> ⚠️ **ENTWICKLUNGSSTATUS / DEVELOPMENT STATUS** ⚠️
> 
> **🚧 Diese Node befindet sich aktuell noch in der aktiven Entwicklung!**
> 
> **Wichtige Hinweise:**
> - ⚠️ **Beta-Software**: Nicht für produktive Umgebungen empfohlen
> - 🧪 **Viele Funktionen sind noch ungetestet** und können Fehler enthalten
> - 🔄 **API kann sich noch ändern** - Breaking Changes möglich
> - 🐛 **Bugs sind zu erwarten** - bitte über GitHub Issues melden
> - 📝 **Feedback erwünscht** - Tests und Verbesserungsvorschläge willkommen
> 
> **Getestete Funktionen:**
> - ✅ Tabellen abrufen (GET /tables)
> - ✅ Spalten erstellen (POST /tables/{id}/columns) - API v1
> - ✅ Basis-Authentifizierung
> - ✅ Resource Locator für Tabellen-Auswahl
> 
> **Noch nicht/unvollständig getestet:**
> - ❓ Alle anderen CRUD-Operationen (Views, Rows, Shares, etc.)
> - ❓ CSV-Import-Funktionalität
> - ❓ Erweiterte Filter- und Sortier-Features
> - ❓ Context-App-Integration
> - ❓ Fehlerbehandlung in Edge Cases
> 
> **Für Entwickler und Tester:** Bitte helfen Sie mit, indem Sie verschiedene Operationen testen und Bugs über [GitHub Issues](https://github.com/terschawebIT/n8n-nodes-nextcloud-tables/issues) melden!

Ein **Community** n8n Node für die Integration mit Nextcloud Tables. Diese Node ermöglicht Tabellen-Verwaltung, Datenoperationen und Workflow-Automation.

## 🚀 **Geplante Features** (in Entwicklung)

> **Hinweis:** Die meisten der unten aufgeführten Features sind implementiert, aber noch nicht vollständig getestet. Verwenden Sie sie mit Vorsicht und melden Sie Probleme über GitHub Issues.

### 📊 **Tabellen-Operationen** ⚠️ *Teilweise getestet*
- **Alle Tabellen abrufen**: Listet alle verfügbaren Tabellen auf
- **Tabelle abrufen**: Ruft Details einer spezifischen Tabelle ab
- **Tabelle erstellen**: Erstellt neue Tabellen mit optionalen Templates
- **Tabelle aktualisieren**: Aktualisiert Eigenschaften bestehender Tabellen
- **Tabelle löschen**: Löscht Tabellen (mit Bestätigung)

### 🎯 **Erweiterte Zeilen-Operationen** ⚠️ *Ungetestet*
- **Alle Zeilen abrufen**: Smart-Pagination (1-1000 Zeilen)
- **Erweiterte Filter**: 11 Filter-Operatoren (=, !=, >, >=, <, <=, LIKE, starts_with, ends_with, is_empty, is_not_empty)
- **Multi-Column-Sorting**: Mehrere Spalten mit Prioritäten
- **Volltext-Suche**: Durchsucht Text-Spalten (case-sensitive/insensitive)
- **Zeile abrufen**: Spezifische Zeilen mit formatierter Ausgabe
- **Zeile erstellen/aktualisieren**: Spalten-basierte Validierung
- ⚠️ **Zeile löschen**: **NICHT VERFÜGBAR** - Die Nextcloud Tables API unterstützt keine DELETE-Operation für Zeilen

### 📋 **Views-Management** ⚠️ *Ungetestet*
- **View-CRUD**: Vollständige Create, Read, Update, Delete-Operationen
- **Filter & Sortierung**: Konfigurierbare Ansichten
- **Dynamic Views**: Automatische Datenfilterung

### 🗂️ **Spalten-Management** ✅ *Spalten-Erstellung getestet*
- **5 Spaltentypen**: Text, Number, DateTime, Selection, UserGroup
- **Type-spezifische Konfiguration**: Pattern, Min/Max, Optionen, Multi-Select
- **Automatische Validierung**: Echtzeit-Datenvalidierung

### 🤝 **Kollaborations-Features** ⚠️ *Ungetestet*
- **Shares-Management**: Benutzer- und Gruppen-Freigaben
- **Granulare Berechtigungen**: Read, Create, Update, Delete, Manage
- **Berechtigungs-Updates**: Dynamische Permission-Verwaltung

### 📥 **CSV-Import** ⚠️ *Ungetestet*
- **Flexible Import-Optionen**: Header-Erkennung, verschiedene Trennzeichen
- **Column-Mapping**: Automatisch oder manuell
- **Datentyp-Konvertierung**: Auto, Text, Number, DateTime, Boolean
- **Import-Status**: Überwachung und Fehlerbehandlung

### 🌐 **App-Context-Integration** ⚠️ *Ungetestet*
- **Context-Navigation**: Nextcloud-App-Integration
- **Context-Tabellen**: Gefilterte Tabellen-Ansichten
- **Context-Pages**: App-Page-Management

## 🔧 **Implementierte Features** (erfordern Tests)

### 💾 **Datenverarbeitung** ⚠️ *Ungetestet*
- **Spalten-basierte Validierung**: Automatische Validierung nach Spaltentyp
- **DateTime-Unterstützung**: ISO 8601, Unix-Timestamp, Date-Only
- **Selection-Validierung**: Optionen-Prüfung gegen verfügbare Auswahlen
- **Multi-Select-Support**: Arrays für UserGroup und Selection-Spalten
- **Export-Funktionen**: CSV/JSON mit lesbaren Spaltennamen

### ⚡ **Stabilität & Zuverlässigkeit** ⚠️ *Ungetestet*
- **Smart Retry-Logic**: 3 Versuche mit exponentiellem Backoff
- **HTTP-Status-Handling**: Spezifische Behandlung für 10 Status-Codes
- **Client + Server-seitige Filter**: Hybrid-Ansatz für maximale Kompatibilität
- **Optimierte Pagination**: Performance-optimierte Datenabfrage

### 🎨 **Benutzerfreundlichkeit** ✅ *Getestet*
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

## 📊 **API-Implementierung** 

> ⚠️ **Hinweis:** Alle Endpunkte sind implementiert, aber noch nicht vollständig getestet!

### ✅ Implementierte Endpunkte
- **Tables**: `/tables` (GET ✅ getestet, POST/PUT/DELETE ⚠️ ungetestet)
- **Rows**: `/tables/{id}/rows`, `/views/{id}/rows` (GET ✅ getestet, POST ⚠️ ungetestet, PUT ⚠️ ungetestet, ❌ DELETE nicht unterstützt von API)
- **Views**: `/tables/{id}/views`, `/views/{id}` (GET, POST, PUT, DELETE - ⚠️ alle ungetestet)
- **Columns**: `/tables/{id}/columns`, `/columns/{id}` (POST ✅ getestet, GET ✅ getestet, PUT/DELETE ⚠️ ungetestet)
- **Shares**: `/tables/{id}/shares`, `/shares/{id}` (GET, POST, PUT, DELETE - ⚠️ alle ungetestet)
- **Import**: `/tables/{id}/import` (POST + Status - ⚠️ ungetestet)
- **Context**: `/contexts`, `/contexts/{id}/tables`, `/contexts/{id}/pages` (GET - ⚠️ ungetestet)

### 🔧 **Kompatibilität**
- **Nextcloud**: 28+ (⚠️ andere Versionen ungetestet)
- **Tables App**: 0.6+ (⚠️ andere Versionen ungetestet)
- **n8n**: 1.0+ (✅ getestet)

### 🚨 **Bekannte API-Probleme**
- **API v2** funktioniert nicht für Column-Erstellung → **API v1** wird verwendet
- **Query-Parameter** erforderlich statt JSON-Body für Spalten-Erstellung
- **Subtype-Parameter** ist kritisch für Text-Spalten (nicht in offizieller Dokumentation)
- ❌ **ROW DELETE nicht unterstützt**: Die Nextcloud Tables API bietet KEINE DELETE-Operation für Zeilen (bestätigt v2.1.12, Execution ID 2574)

## Entwicklung & Testing

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

### Projekt-Architektur
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

## 🛠️ **Troubleshooting & Known Issues**

### Häufige Probleme

**401 Unauthorized Error**
- ✅ App-Passwort verwenden statt normales Passwort
- ✅ Benutzer-Berechtigung für Tables-App prüfen
- ✅ Nextcloud-URL ohne API-Pfad angeben

**404 Not Found bei Column-Erstellung**
- ✅ **BEHOBEN**: Verwendet jetzt API v1 statt v2
- ✅ **BEHOBEN**: Query-Parameter statt JSON-Body
- ✅ **BEHOBEN**: Subtype-Parameter hinzugefügt

**Filter funktionieren nicht** ⚠️ *Ungetestet*
- ⚠️ Spalten-IDs statt Namen verwenden
- ⚠️ Datentyp-kompatible Werte eingeben
- ⚠️ Client-seitige Filterung als Fallback aktiviert

### Fehlerbehandlung
Die Node bietet detaillierte Fehlermeldungen für:
- **400**: Ungültige Anfrage → Eingabedaten prüfen
- **401**: Nicht autorisiert → Credentials aktualisieren
- **403**: Zugriff verweigert → Berechtigungen prüfen
- **404**: Nicht gefunden → Ressourcen-IDs überprüfen
- **429**: Rate-Limit → Automatische Wiederholung
- **5xx**: Server-Fehler → Retry-Logic aktiviert

## 🧪 **Testing Needed**

**Du kannst helfen! Wir brauchen Tests für:**

### Priorität 1 (Basis-Funktionen)
- [ ] **Tabellen**: Erstellen, Aktualisieren, Löschen
- [ ] **Zeilen**: CRUD-Operationen in verschiedenen Tabellentypen
- [ ] **Views**: Erstellen und Konfigurieren von Ansichten
- [ ] **Spalten**: Update und Delete-Operationen

### Priorität 2 (Erweiterte Funktionen)
- [ ] **Filter**: Alle 11 Filter-Operatoren testen
- [ ] **Sortierung**: Multi-Column-Sorting
- [ ] **CSV-Import**: Verschiedene Dateiformate und Trennzeichen
- [ ] **Shares**: Benutzer- und Gruppen-Freigaben

### Priorität 3 (Edge Cases)
- [ ] **Performance**: Große Datenmengen (>1000 Zeilen)
- [ ] **Error Handling**: Alle HTTP-Status-Codes
- [ ] **Context**: App-Integration
- [ ] **Kompatibilität**: Verschiedene Nextcloud/Tables-Versionen

## 🚨 **Beta-Status**

> **Diese Node ist Beta-Software! Verwenden Sie sie NICHT in produktiven Umgebungen.**
> 
> **Warum Beta?**
> - Viele Features sind ungetestet
> - API-Kompatibilität kann sich ändern
> - Bugs sind zu erwarten
> - Breaking Changes möglich
> 
> **Für Tests geeignet in:**
> - Entwicklungsumgebungen
> - Test-Nextcloud-Instanzen  
> - Persönliche Projekte (mit Backup!)

## Lizenz

MIT

## Support

- GitHub Issues: [GitHub Repository](https://github.com/terschawebIT/n8n-nodes-nextcloud-tables)
- n8n Community: [n8n Community Forum](https://community.n8n.io/)
- Documentation: [Nextcloud Tables API](https://github.com/nextcloud/tables/blob/main/docs/API.md)

## Contributing

**Beiträge sind sehr willkommen!** 

**Besonders gebraucht:**
- 🧪 **Tester**: Probieren Sie verschiedene Operationen aus
- 🐛 **Bug Reports**: Melden Sie Probleme über GitHub Issues  
- 📝 **Dokumentation**: Verbesserungen und Beispiele
- 💻 **Code**: Bug-Fixes und Feature-Verbesserungen

**Testing Guidelines:**
1. Verwenden Sie eine Test-Nextcloud-Instanz
2. Dokumentieren Sie Ihre Tests (Screenshots hilfreich)
3. Melden Sie sowohl Erfolge als auch Fehler
4. Geben Sie Nextcloud/Tables-Versionen an

**Danke für Ihre Hilfe bei der Entwicklung dieser Node!** 🙏 