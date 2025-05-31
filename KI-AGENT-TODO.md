# KI-Agent Kompatibilität TODO-Liste

## Status: 🔄 In Bearbeitung

### ✅ **ERLEDIGT**
- [x] **Spalten (Columns)** - `createAIFriendly` Operation implementiert
  - Alle Parameter durch fixedCollection gleichzeitig verfügbar
  - Typ-spezifische Konfigurationen strukturiert
  - Handler und UI implementiert

- [x] **Zeilen (Rows)** - AI-Friendly Operationen implementiert
  - `createRowAIFriendly` ✅ Fertig
  - `getAllRowsAIFriendly` ✅ Fertig 
  - `updateRowAIFriendly` ✅ Fertig
  - Handler-Integration ✅ Fertig
  - UI-Integration ✅ Fertig

- [x] **Views** - AI-Friendly Operationen implementiert
  - `createViewAIFriendly` ✅ Fertig
  - `updateViewAIFriendly` ✅ Fertig
  - Handler-Integration ✅ Fertig
  - UI-Integration ✅ Fertig
  - Filter/Sortierung-Konfiguration ✅ Fertig

### ❌ **NOCH ZU ERLEDIGEN**

## 1. 🎯 **ZEILEN (ROWS) - ✅ IMPLEMENTIERT**

### Probleme:
- **Quelle-Auswahl Problem**: `nodeCollection` (Tabelle vs. View) bestimmt welche Felder erscheinen
- **Bedingte UI-Logik**: Filter, Sortierung, Suche nur sichtbar wenn "aktivieren" Boolean gesetzt
- **Komplexe Datenstruktur**: Zeilen-Daten als fixedCollection mit Spalten-ID + Wert Paaren

### Lösung:
- [x] **`createRowAIFriendly`** Operation erstellen ✅ **FERTIG**
- [x] **`getAllRowsAIFriendly`** Operation für erweiterte Abfragen ✅ **FERTIG**
- [x] **`updateRowAIFriendly`** Operation erstellen ✅ **FERTIG**

### ✅ **IMPLEMENTIERT**:
- **Source-Konfiguration**: Strukturierte Auswahl zwischen Tabelle/View mit expliziten IDs
- **Row-Data-Konfiguration**: fixedCollection mit columnId/value Paaren
- **Query-Konfiguration**: Alle Filter/Sortierung/Suche Parameter gleichzeitig verfügbar
- **Keine displayOptions**: Alle Parameter immer sichtbar für KI Agents
- **API-Integration**: Vollständige Backend-Integration mit korrekten API-Aufrufen
- **Fehlerbehandlung**: Robuste Validierung und aussagekräftige Fehlermeldungen

### 📝 **API-Struktur für KI Agents**:

```typescript
// createRowAIFriendly
{
  operation: "createRowAIFriendly",
  sourceConfig: {
    source: {
      type: "table|view",
      tableId: "123",  // wenn type="table"
      viewId: "456"    // wenn type="view"
    }
  },
  rowDataConfig: {
    data: {
      columns: [
        { column: { columnId: "1", value: "Text-Wert" } },
        { column: { columnId: "2", value: "99.99" } },
        { column: { columnId: "3", value: "2024-01-01" } }
      ]
    }
  }
}

// getAllRowsAIFriendly
{
  operation: "getAllRowsAIFriendly",
  sourceConfig: {
    source: { type: "table", tableId: "123" }
  },
  queryConfig: {
    query: {
      pagination: { settings: { limit: 50, offset: 0 } },
      filters: [
        { filter: { columnId: "1", operator: "equals", value: "Test" } }
      ],
      sorting: [
        { sort: { columnId: "2", direction: "ASC" } }
      ],
      search: { 
        settings: { 
          term: "suchbegriff", 
          columns: "1,3", 
          caseSensitive: false 
        } 
      }
    }
  }
}

// updateRowAIFriendly
{
  operation: "updateRowAIFriendly",
  updateDataConfig: {
    update: {
      rowId: "789",
      tableId: "123",
      columns: [
        { column: { columnId: "1", value: "Neuer Wert" } }
      ]
    }
  }
}
```

## 2. 🎯 **VIEWS - ✅ IMPLEMENTIERT**

### Probleme (GELÖST):
- **Filter-Konfiguration**: Komplex verschachtelte fixedCollection ✅ GELÖST
- **Sortierung**: Ähnlich komplex wie bei Rows ✅ GELÖST
- **Keine vereinfachte API für KI Agents** ✅ GELÖST

### Lösung:
- [x] **`createViewAIFriendly`** Operation erstellen ✅ **FERTIG**
- [x] **`updateViewAIFriendly`** Operation erstellen ✅ **FERTIG**

### ✅ **IMPLEMENTIERT**:
- **Basis-Konfiguration**: Strukturierte View-Eigenschaften (Titel, Tabellen-ID, Emoji, Beschreibung)
- **Filter-Konfiguration**: Alle Filter-Regeln gleichzeitig verfügbar ohne displayOptions
- **Sortierungs-Konfiguration**: Alle Sortier-Regeln gleichzeitig verfügbar
- **Update-Konfiguration**: Strukturierte Update-Parameter für View-Änderungen
- **Keine loadOptionsMethod**: Spalten-IDs werden direkt als String eingegeben
- **API-Integration**: Vollständige Backend-Integration mit korrekter Parameter-Extraktion

### 📝 **API-Struktur für KI Agents**:

```typescript
// createViewAIFriendly
{
  operation: "createViewAIFriendly",
  viewConfig: {
    basic: {
      title: "Meine View",
      tableId: "123",
      emoji: "🔍",
      description: "Beschreibung"
    }
  },
  filterConfig: {
    rules: {
      filters: [
        { filter: { columnId: "1", operator: "EQ", value: "Test" } },
        { filter: { columnId: "2", operator: "GT", value: "100" } }
      ]
    }
  },
  sortConfig: {
    rules: {
      sorting: [
        { sort: { columnId: "1", direction: "ASC" } },
        { sort: { columnId: "2", direction: "DESC" } }
      ]
    }
  }
}

// updateViewAIFriendly
{
  operation: "updateViewAIFriendly",
  updateConfig: {
    data: {
      viewId: "456",
      title: "Neuer Titel",
      emoji: "📊",
      description: "Neue Beschreibung"
    }
  },
  filterConfig: {
    rules: {
      filters: [
        { filter: { columnId: "3", operator: "LIKE", value: "Test%" } }
      ]
    }
  },
  sortConfig: {
    rules: {
      sorting: [
        { sort: { columnId: "4", direction: "ASC" } }
      ]
    }
  }
}
```

## 3. 🎯 **IMPORT (CSV) - MITTLERE PRIORITÄT**

### Vermutete Probleme:
- [ ] **Analysieren**: Import-UI auf KI-Agent-Probleme prüfen
- [ ] **Spalten-Mapping**: Vermutlich komplexe fixedCollection
- [ ] **Optionen**: Wahrscheinlich bedingte UI-Logik

### Zu untersuchen:
- [ ] `nodes/NextcloudTables/descriptions/import.ts` analysieren
- [ ] Handler auf komplexe Parameter-Extraktion prüfen
- [ ] AI-Friendly Lösung entwickeln falls nötig

## 4. 🎯 **SHARE - NIEDRIGE PRIORITÄT**

### Zu untersuchen:
- [ ] `nodes/NextcloudTables/descriptions/share.ts` analysieren
- [ ] Berechtigungen-UI auf KI-Agent-Probleme prüfen
- [ ] AI-Friendly Lösung entwickeln falls nötig

## 5. 🎯 **TABLES - NIEDRIGE PRIORITÄT**

### Zu untersuchen:
- [ ] `nodes/NextcloudTables/descriptions/table.ts` analysieren  
- [ ] Vermutlich weniger komplex, aber trotzdem prüfen
- [ ] AI-Friendly Lösung entwickeln falls nötig

## 📋 **IMPLEMENTIERUNGS-STRATEGIE**

### Phase 1: ✅ Zeilen (Rows) - FERTIG
1. [x] `createRowAIFriendly` Operation in `row.ts` hinzufügen
2. [x] Handler in `row.handler.ts` erweitern
3. [x] Alle Parameter durch strukturierte fixedCollections verfügbar machen
4. [x] Tests und Beispiele erstellen

### Phase 2: ✅ Views - FERTIG  
1. [x] `createViewAIFriendly` und `updateViewAIFriendly` implementiert
2. [x] Strukturierte Filter/Sortierungs-Konfiguration implementiert
3. [x] Handler-Integration vollständig implementiert

### Phase 3: Import - NÄCHSTE AUFGABE
1. [ ] Import-Beschreibungen analysieren 
2. [ ] Probleme identifizieren (Spalten-Mapping, Optionen)
3. [ ] AI-Friendly Operationen implementieren falls erforderlich

### Phase 4: Share und Tables
1. [ ] Nach Bedarf analysieren und implementieren

## 🎨 **DESIGN-PRINZIPIEN FÜR AI-FRIENDLY APIs**

### ✅ **Do's:**
1. **Alle Parameter gleichzeitig sichtbar** durch fixedCollection
2. **Strukturierte Hierarchie**: `config.basic`, `config.advanced`
3. **Explizite Validierung** in Handlern statt UI
4. **Fallback-Werte** für optionale Parameter
5. **Klare Namenskonventionen**: `createXXXAIFriendly`
6. **String-IDs**: Spalten-IDs als String eingeben statt loadOptionsMethod

### ❌ **Don'ts:**
1. **Keine displayOptions** für KI-Friendly Operationen
2. **Keine dynamischen UI-Abhängigkeiten**
3. **Keine verschachtelten Bedingungen**
4. **Keine impliziten Parameter**
5. **Keine loadOptionsMethod** für KI-Friendly APIs

## 📝 **DOKUMENTATION TODO**

- [x] AI-Friendly API Dokumentation für Rows erweitert
- [x] AI-Friendly API Dokumentation für Views erweitert
- [ ] Beispiel-Workflows für jede Operation
- [ ] Migration Guide von Original zu AI-Friendly APIs
- [ ] Best Practices Guide für KI Agents

## 🧪 **TESTING TODO**

- [ ] Unit Tests für alle AI-Friendly Handler
- [ ] Integration Tests mit echten Nextcloud Tables
- [ ] Performance Tests für komplexe Abfragen
- [ ] KI-Agent Simulation Tests

## 📦 **VERÖFFENTLICHUNG TODO**

- [ ] Version Bump vorbereiten
- [ ] Changelog mit AI-Friendly Features
- [ ] README mit KI-Agent Sektion aktualisieren
- [ ] npm Package veröffentlichen

---

## 🎯 **NÄCHSTE KONKRETE SCHRITTE:**

1. **SOFORT**: Import analysieren und AI-Friendly machen falls nötig
2. **DANACH**: Share analysieren und AI-Friendly machen falls nötig
3. **DANN**: Tables analysieren und AI-Friendly machen falls nötig
4. **SPÄTER**: Dokumentation und Tests vervollständigen

---

## 📊 **PROGRESS TRACKING**

- **Gesamt Fortschritt**: 60% (3/5 Hauptbereiche fertig)
- **Spalten (Columns)**: ✅ 100% 
- **Zeilen (Rows)**: ✅ 100%
- **Views**: ✅ 100% - HEUTE FERTIGGESTELLT!
- **Import**: ❌ 0% (noch nicht analysiert)
- **Share**: ❌ 0% (noch nicht analysiert)

**Letzte Aktualisierung**: 2024-01-15 - Views AI-Friendly komplett implementiert! 