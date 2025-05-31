# n8n-nodes-nextcloud-tables

Ein **Community** n8n Node für die Integration mit Nextcloud Tables. Diese Node ermöglicht vollständige Tabellen-Verwaltung, erweiterte Datenoperationen und ist **speziell für KI-Agents optimiert**.

## 🚀 **Produktions-Status: v2.4.1** ✅

**Diese Node ist produktionsreif und vollständig getestet!**

### ✅ **Vollständig implementiert & getestet:**
- **Tabellen-Management**: Alle CRUD-Operationen (getAll, get, create, update, delete)
- **Spalten-Management**: Vollständige Operationen mit AI-friendly Erweiterungen
- **Zeilen-Management**: Erweiterte CRUD mit Filtering und Sortierung  
- **Views-Management**: Komplette View-Erstellung und -Konfiguration
- **Shares-Management**: Granulare Berechtigungen und Kollaboration
- **CSV-Import**: Flexible Import-Optionen mit Column-Mapping
- **Context-Integration**: Nextcloud-App-Integration

## 🤖 **KI-Agent Optimiert** ⭐

**Einzigartig**: Diese Node ist die **erste n8n Community Node**, die speziell für **KI-Agents** optimiert wurde!

### **Problem gelöst**: 
Standard n8n-Nodes verwenden `displayOptions`, die Parameter dynamisch verstecken. KI-Agents können diese nicht sehen.

### **Lösung**: AI-Friendly Operationen
- ✅ **Alle Parameter gleichzeitig sichtbar**
- ✅ **Keine UI-Dependencies** für KI-Agents
- ✅ **String-basierte IDs** statt Dropdown-Navigation
- ✅ **Flache Parameter-Struktur** ohne Verschachtelung

### **AI-Friendly Operationen verfügbar:**

#### **Spalten-Management (AI-Optimiert)**
```javascript
// Für KI-Agents optimiert - ALLE Parameter sichtbar
Operation: "Spalte Erstellen (KI-Friendly)"
{
  "tableIdAI": "123",
  "columnType": "selection", 
  "columnTitle": "Status",
  "columnMandatory": true,
  
  // Alle typ-spezifischen Parameter gleichzeitig verfügbar:
  "selectionOptionsAI": "[\"Offen\", \"In Bearbeitung\", \"Fertig\"]",
  "selectionDefaultAI": "Offen",
  "selectionMultipleAI": false,
  
  // Text-Parameter (werden ignoriert bei anderen Typen):
  "textSubtypeAI": "line",
  "textMaxLengthAI": 255,
  // ... alle anderen Parameter verfügbar
}

// Vollständige Updates möglich
Operation: "Spalte Aktualisieren (KI-Friendly)"
{
  "columnIdAI": "456",
  "columnType": "text",           // Typ ändern
  "columnTitle": "Neuer Name",    // Titel ändern
  "textSubtypeAI": "long",        // Text-spezifisch
  "textMaxLengthAI": 500,         // Max-Länge ändern
  // Nur relevante Parameter werden verwendet
}
```

**Vorteile für KI-Agents:**
- 🔍 **Parameter-Transparenz**: 24 Parameter gleichzeitig sichtbar
- 🎯 **Autonome Operationen**: Keine UI-Interaktion erforderlich
- 🚀 **Vollständige Kontrolle**: Create + Update aller Spaltentypen
- 🛡️ **Robuste Validierung**: Hilfreiche Fehlermeldungen
- ↩️ **Backward Compatible**: Human-UI bleibt unverändert

## 📊 **Vollständige Feature-Übersicht**

### 🏗️ **Tabellen-Operationen** ✅
- **Alle Tabellen abrufen**: Listet verfügbare Tabellen auf
- **Tabelle abrufen**: Details einer spezifischen Tabelle
- **Tabelle erstellen**: Neue Tabellen mit optionalen Templates  
- **Tabelle aktualisieren**: Eigenschaften ändern
- **Tabelle löschen**: Sichere Löschung mit Bestätigung

### 📋 **Spalten-Management** ✅ **AI-OPTIMIERT**
**Standard-Operationen:**
- Alle Spalten abrufen, Spalte abrufen, erstellen, aktualisieren, löschen

**🤖 KI-Friendly Operationen:**
- **Spalte Erstellen (KI-Friendly)**: 23 Parameter gleichzeitig sichtbar
- **Spalte Aktualisieren (KI-Friendly)**: 24 Parameter für vollständige Updates

**5 Spaltentypen vollständig unterstützt:**
- **Text**: Pattern-Validierung, Max-Länge, Subtypen (einzeilig/mehrzeilig)
- **Number**: Min/Max, Dezimalstellen, Präfix/Suffix, Validierung
- **DateTime**: Standard-Datum, flexible Eingabeformate
- **Selection**: Dropdown-Optionen, Standard-Werte, Mehrfachauswahl
- **UserGroup**: Benutzer/Gruppen-Auswahl, Multi-Select, Teams

### 🎯 **Erweiterte Zeilen-Operationen** ✅
- **Smart-Pagination**: 1-1000 Zeilen optimiert
- **11 Filter-Operatoren**: =, !=, >, >=, <, <=, LIKE, starts_with, ends_with, is_empty, is_not_empty
- **Multi-Column-Sorting**: Prioritäts-basierte Sortierung
- **Volltext-Suche**: Case-sensitive/insensitive, spalten-spezifisch
- **Automatische Validierung**: Spalten-basierte Datenformatierung
- **Export-Funktionen**: CSV/JSON mit lesbaren Spaltennamen

### 📋 **Views-Management** ✅
- **Vollständige CRUD**: Create, Read, Update, Delete
- **Filter & Sortierung**: Konfigurierbare Ansichten  
- **Dynamic Views**: Automatische Datenfilterung

### 🤝 **Kollaborations-Features** ✅
- **Shares-Management**: Benutzer- und Gruppen-Freigaben
- **Granulare Berechtigungen**: Read, Create, Update, Delete, Manage
- **Dynamische Updates**: Permission-Verwaltung in Echtzeit

### 📥 **CSV-Import** ✅
- **Flexible Optionen**: Header-Erkennung, Trennzeichen-Auswahl
- **Column-Mapping**: Automatische oder manuelle Zuordnung  
- **Datentyp-Konvertierung**: Auto, Text, Number, DateTime, Boolean
- **Import-Status**: Überwachung und Fehlerbehandlung

### 🌐 **App-Context-Integration** ✅
- **Context-Navigation**: Nahtlose Nextcloud-App-Integration
- **Context-Tabellen**: Gefilterte Ansichten nach App-Context
- **Context-Pages**: App-Page-Management

## Installation

```bash
npm install n8n-nodes-nextcloud-tables
```

Starten Sie n8n neu, um die neue Node zu laden.

## Konfiguration

### Credentials
Erstellen Sie neue Credentials vom Typ "Nextcloud Tables API":

1. **Nextcloud URL**: Vollständige URL (z.B. `https://cloud.example.com`)
2. **Benutzername**: Ihr Nextcloud-Benutzername  
3. **Passwort**: App-Passwort (empfohlen) oder normales Passwort

**🔒 Sicherheit**: Verwenden Sie App-Passwörter:
- Nextcloud → Einstellungen → Sicherheit → App-Passwörter
- Erstellen Sie ein neues App-Passwort für n8n

## 🤖 **KI-Agent Usage Examples**

### Spalte für KI-Agents erstellen
```javascript
{
  "resource": "Spalte",
  "operation": "Spalte Erstellen (KI-Friendly)",
  "tableIdAI": "123",
  "columnType": "selection",
  "columnTitle": "Projekt-Status", 
  "columnDescription": "Aktueller Status des Projekts",
  "columnMandatory": true,
  "selectionOptionsAI": "[\"Geplant\", \"In Arbeit\", \"Testing\", \"Fertig\", \"Archiviert\"]",
  "selectionDefaultAI": "Geplant",
  "selectionMultipleAI": false
}
```

### Spalte für KI-Agents aktualisieren
```javascript
{
  "resource": "Spalte", 
  "operation": "Spalte Aktualisieren (KI-Friendly)",
  "columnIdAI": "456",
  "columnTitle": "Erweiterte Projekt-Status",
  "selectionOptionsAI": "[\"Backlog\", \"Sprint\", \"Review\", \"Done\", \"Cancelled\"]",
  "selectionDefaultAI": "Backlog"
}
```

### Human vs. KI-Agent Vergleich
```javascript
// HUMAN (UI-optimiert) - Parameter erscheinen dynamisch
Operation: "Spalte Erstellen"
Tabelle: [Dropdown-Auswahl]
Typ: "Auswahl" 
// → Dann erscheinen Auswahl-spezifische Parameter

// KI-AGENT (AI-optimiert) - Alle Parameter sichtbar
Operation: "Spalte Erstellen (KI-Friendly)"  
// → ALLE 23 Parameter sofort sichtbar und verwendbar
```

## 🔧 **Advanced Usage**

### Erweiterte Zeilen-Abfrage mit Filtern
```javascript
{
  "resource": "Zeile",
  "operation": "Alle Zeilen Abrufen",
  "source": "table",
  "tableId": "123",
  "useFiltering": true,
  "filters": [
    {
      "columnId": "5",
      "operator": "EQ", 
      "value": "Aktiv"
    },
    {
      "columnId": "8",
      "operator": "GT",
      "value": "2024-01-01"
    }
  ],
  "useSorting": true,
  "sorting": [
    {
      "columnId": "10",
      "direction": "DESC"
    }
  ]
}
```

### CSV-Import mit Column-Mapping
```javascript
{
  "resource": "Import",
  "operation": "CSV in Tabelle Importieren",
  "tableId": "123",
  "csvData": "[Binary CSV Data]",
  "hasHeader": true,
  "delimiter": ";",
  "columnMapping": [
    {
      "csvColumn": "Kundenname",
      "tableColumn": "1",
      "dataType": "text"
    },
    {
      "csvColumn": "Erstellungsdatum", 
      "tableColumn": "2",
      "dataType": "datetime"
    }
  ]
}
```

## 📊 **Vollständige API-Abdeckung**

### ✅ Implementierte Endpunkte
- **Tables**: `/tables/*` (vollständige CRUD)
- **Rows**: `/tables/{id}/rows`, `/views/{id}/rows` (vollständige CRUD außer DELETE*)
- **Views**: `/tables/{id}/views`, `/views/{id}` (vollständige CRUD)
- **Columns**: `/tables/{id}/columns`, `/columns/{id}` (vollständige CRUD + AI-friendly)
- **Shares**: `/tables/{id}/shares`, `/shares/{id}` (vollständige CRUD)
- **Import**: `/tables/{id}/import` (POST + Status-Monitoring)
- **Context**: `/contexts/*` (GET-Operationen)

**\*Note**: Row DELETE ist von der Nextcloud Tables API nicht unterstützt

### 🔧 **Kompatibilität**
- **Nextcloud**: 28+ (getestet)
- **Tables App**: 0.6+ (getestet) 
- **n8n**: 1.0+ (getestet)

### 🛠️ **Technische Details**
- **API Version**: Hybrid v1/v2 (optimal je nach Operation)
- **Authentifizierung**: Basic Auth mit App-Passwort-Support
- **Error Handling**: 10 HTTP-Status-Codes mit spezifischen Meldungen
- **Retry Logic**: 3 Versuche mit exponentiellem Backoff
- **Validation**: Spalten-basierte Echtzeit-Validierung

## Development & Testing

### Setup
```bash
npm install          # Dependencies
npm run build        # TypeScript kompilieren  
npm run dev          # Development-Modus
npm run lint         # Code-Prüfung
npm run format       # Code formatieren
```

### Projekt-Architektur
```
nodes/NextcloudTables/
├── NextcloudTables.node.ts              # Haupt-Node
├── descriptions/                        # UI-Definitionen
│   ├── column.ts     ← KI-OPTIMIERT
│   ├── table.ts      ├── row.ts
│   ├── view.ts       ├── share.ts  
│   ├── import.ts     └── context.ts
├── handlers/                           # Business Logic
│   ├── column.handler.ts ← KI-FRIENDLY LOGIC
│   └── *.handler.ts
├── helpers/                           # Core Utilities
│   ├── api.helper.ts                  # HTTP + Error Handling
│   ├── data.formatter.ts              # Validation
│   └── node.methods.ts                # Dynamic Dropdowns
└── interfaces/                        # TypeScript Types
```

## 🛠️ **Troubleshooting**

### Häufige Probleme

**401 Unauthorized**  
✅ **Lösung**: App-Passwort verwenden, Berechtigungen prüfen

**KI-Agent kann Parameter nicht sehen**  
✅ **Lösung**: KI-Friendly Operationen verwenden (`createAIFriendly`, `updateAIFriendly`)

**Filter funktionieren nicht**  
✅ **Lösung**: Spalten-IDs statt Namen, korrekte Operatoren verwenden

**Column-Erstellung fehlgeschlagen**  
✅ **Behoben**: Verwendet optimierte API v1 mit Query-Parametern

### Error Handling
Detaillierte Fehlermeldungen für alle HTTP-Status-Codes:
- **400-404**: Client-Fehler mit Lösungshinweisen
- **429**: Rate-Limiting mit automatischer Wiederholung  
- **5xx**: Server-Fehler mit Retry-Logic

## 🎯 **Roadmap**

### ✅ **Version 2.4.1 (Aktuell)**
- Vollständige KI-Agent-Optimierung
- 24 AI-Parameter mit systematischer Trennung
- Robuste Validierung und Error Handling
- Saubere UX für alle Operationen

### 🔮 **Zukünftige Versionen**
- **Weitere AI-Friendly Operationen** für andere Ressourcen
- **Erweiterte KI-Features** (Bulk-Operations, Schema-Inference)
- **Performance-Optimierungen** für große Datenmengen
- **Extended Context-Integration** mit mehr Nextcloud-Apps

## Contributing

**Beiträge willkommen!** Besonders:
- 🤖 **KI-Agent Testing**: Testen Sie die AI-friendly Operationen
- 🐛 **Bug Reports**: GitHub Issues für Probleme
- 💻 **Code**: Verbesserungen und neue Features
- 📝 **Dokumentation**: Beispiele und Best Practices

## Lizenz

MIT

## Support

- **GitHub**: [Issues & Discussions](https://github.com/terschawebIT/n8n-nodes-nextcloud-tables)
- **n8n Community**: [Community Forum](https://community.n8n.io/)
- **Documentation**: [Nextcloud Tables API](https://github.com/nextcloud/tables/blob/main/docs/API.md)

---

**🤖 Diese Node ist die erste KI-Agent-optimierte n8n Community Node!**  
**Probieren Sie die AI-friendly Operationen aus und erleben Sie autonome Tabellen-Verwaltung.** 