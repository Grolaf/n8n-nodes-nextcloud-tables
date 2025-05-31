# KI-Agent Freundliche API Nutzung

## Problem mit der ursprünglichen "Spalte erstellen" UI

Die ursprüngliche n8n UI für "Spalte erstellen" verwendet `displayOptions`, um Felder dynamisch basierend auf Benutzer-Auswahlen zu zeigen/verstecken. Dies macht es für KI Agents schwierig zu verwenden, da:

1. **Dynamische Felder**: Felder erscheinen nur basierend auf vorherigen Auswahlen
2. **Conditional Logic**: KI Agents können nicht alle verfügbaren Parameter auf einmal sehen
3. **Unklare Struktur**: Die Abhängigkeiten zwischen Parametern sind nicht transparent

## Lösung: "Spalte Erstellen (KI-Friendly)" Operation

### Neue Operation: `createAIFriendly`

Diese neue Operation macht **alle Parameter gleichzeitig verfügbar** durch `fixedCollection` Strukturen, wodurch KI Agents eine klare, konsistente API erhalten.

### Struktur der KI-Friendly API

```typescript
{
  operation: "createAIFriendly",
  tableId: "123",
  columnConfig: {
    basic: {
      type: "text|number|datetime|selection|usergroup",
      title: "Spalten-Name",
      description: "Optional description",
      mandatory: false
    }
  },
  // Typ-spezifische Konfigurationen (optional, nur wenn benötigt)
  textConfig: {
    settings: {
      subtype: "line|long",
      textDefault: "Standard-Text",
      textMaxLength: 255,
      textAllowedPattern: "^[A-Za-z0-9]+$"
    }
  },
  numberConfig: {
    settings: {
      numberDefault: 0,
      numberMin: 1,
      numberMax: 100,
      numberDecimals: 2,
      numberPrefix: "€",
      numberSuffix: "kg"
    }
  },
  datetimeConfig: {
    settings: {
      datetimeDefault: "2024-01-01T12:00:00Z"
    }
  },
  selectionConfig: {
    settings: {
      selectionOptions: "Option 1\nOption 2\nOption 3",
      selectionDefault: "Option 1"
    }
  },
  usergroupConfig: {
    settings: {
      usergroupDefault: "admin",
      usergroupMultipleItems: false,
      usergroupSelectUsers: true,
      usergroupSelectGroups: true,
      usergroupSelectTeams: false,
      showUserStatus: false
    }
  }
}
```

## Beispiele für KI Agents

### 1. Text-Spalte erstellen

```json
{
  "operation": "createAIFriendly",
  "tableId": "123",
  "columnConfig": {
    "basic": {
      "type": "text",
      "title": "Produktname",
      "description": "Name des Produkts",
      "mandatory": true
    }
  },
  "textConfig": {
    "settings": {
      "subtype": "line",
      "textMaxLength": 100,
      "textAllowedPattern": "^[A-Za-z0-9\\s]+$"
    }
  }
}
```

### 2. Zahlen-Spalte erstellen

```json
{
  "operation": "createAIFriendly",
  "tableId": "123",
  "columnConfig": {
    "basic": {
      "type": "number",
      "title": "Preis",
      "description": "Produktpreis in Euro",
      "mandatory": true
    }
  },
  "numberConfig": {
    "settings": {
      "numberDefault": 0,
      "numberMin": 0.01,
      "numberMax": 9999.99,
      "numberDecimals": 2,
      "numberPrefix": "€",
      "numberSuffix": ""
    }
  }
}
```

### 3. Auswahl-Spalte erstellen

```json
{
  "operation": "createAIFriendly",
  "tableId": "123",
  "columnConfig": {
    "basic": {
      "type": "selection",
      "title": "Kategorie",
      "description": "Produktkategorie",
      "mandatory": false
    }
  },
  "selectionConfig": {
    "settings": {
      "selectionOptions": "Elektronik\nKleidung\nBücher\nSport",
      "selectionDefault": "Elektronik"
    }
  }
}
```

### 4. Datum-Spalte erstellen

```json
{
  "operation": "createAIFriendly",
  "tableId": "123",
  "columnConfig": {
    "basic": {
      "type": "datetime",
      "title": "Erstellungsdatum",
      "description": "Wann wurde das Element erstellt",
      "mandatory": false
    }
  },
  "datetimeConfig": {
    "settings": {
      "datetimeDefault": "today"
    }
  }
}
```

### 5. Benutzer/Gruppe-Spalte erstellen

```json
{
  "operation": "createAIFriendly",
  "tableId": "123",
  "columnConfig": {
    "basic": {
      "type": "usergroup",
      "title": "Zuständiger",
      "description": "Wer ist für dieses Element zuständig",
      "mandatory": true
    }
  },
  "usergroupConfig": {
    "settings": {
      "usergroupMultipleItems": false,
      "usergroupSelectUsers": true,
      "usergroupSelectGroups": false,
      "usergroupSelectTeams": false,
      "showUserStatus": true
    }
  }
}
```

## Vorteile für KI Agents

### 1. **Vollständige Parameter-Transparenz**
- Alle Parameter sind in der Struktur sichtbar
- Keine versteckten Abhängigkeiten
- Klare Typ-Zuordnungen

### 2. **Konsistente API-Struktur**
- Einheitliches `fixedCollection` Format
- Vorhersagbare Parameterstruktur
- Standardisierte Namenskonventionen

### 3. **Flexibilität ohne Komplexität**
- KI Agent kann alle Optionen setzen
- Ungenutzte Konfigurationen werden ignoriert
- Fallback auf sinnvolle Standardwerte

### 4. **Bessere Fehlerbehandlung**
- Fehlende erforderliche Parameter werden klar gemeldet
- Validierung auf API-Ebene statt UI-Ebene
- Explizite Fehlertypen

## Migration von der ursprünglichen API

Die ursprüngliche `create` Operation bleibt für normale UI-Benutzer erhalten. KI Agents sollten die neue `createAIFriendly` Operation verwenden.

### Kompatibilität

- **Original API**: Weiterhin verfügbar für UI-Benutzer
- **AI-Friendly API**: Optimiert für KI Agents
- **Gleiche Backend-Logik**: Beide verwenden dieselbe API-Implementation

## Best Practices für KI Agents

### 1. **Immer alle relevanten Konfigurationen bereitstellen**
```json
// ✅ Gut: Vollständige Konfiguration
{
  "columnConfig": { "basic": { ... } },
  "textConfig": { "settings": { ... } }
}

// ❌ Schlecht: Unvollständige Konfiguration
{
  "columnConfig": { "basic": { "type": "text" } }
  // textConfig fehlt
}
```

### 2. **Sinnvolle Standardwerte verwenden**
```json
// ✅ Gut: Explizite Standardwerte
{
  "textConfig": {
    "settings": {
      "subtype": "line",
      "textMaxLength": 255
    }
  }
}
```

### 3. **Typ-spezifische Konfigurationen beachten**
- `text` → `textConfig` erforderlich (wegen `subtype`)
- `number` → `numberConfig` optional
- `selection` → `selectionConfig` für Optionen erforderlich
- `datetime` → `datetimeConfig` optional
- `usergroup` → `usergroupConfig` für erweiterte Einstellungen

### 4. **Validierung auf Client-Seite**
```typescript
// Beispiel Validierung
function validateColumnConfig(config: any) {
  if (!config.columnConfig?.basic?.type) {
    throw new Error('Spaltentyp ist erforderlich');
  }
  
  if (!config.columnConfig?.basic?.title) {
    throw new Error('Spaltentitel ist erforderlich');
  }
  
  if (config.columnConfig.basic.type === 'text' && !config.textConfig?.settings?.subtype) {
    throw new Error('Text-Subtyp ist für Text-Spalten erforderlich');
  }
}
```

## Technische Details

### Parameter-Extraktion im Handler

```typescript
// AI-Friendly Version
const columnConfig = context.getNodeParameter('columnConfig.basic', itemIndex, {});
const textConfig = context.getNodeParameter('textConfig.settings', itemIndex, {});

// Original Version  
const type = context.getNodeParameter('type', itemIndex);
const subtype = context.getNodeParameter('subtype', itemIndex, 'line');
```

### Fehlerbehandlung

```typescript
// Explizite Validierung
if (!type || !title) {
  throw new Error('Spaltentyp und Titel sind erforderlich');
}

// Typ-spezifische Fallbacks
body.subtype = textConfig.subtype || 'line';
```

### API-Kompatibilität

Beide Versionen verwenden dieselbe Nextcloud Tables API:

```typescript
return ApiHelper.makeApiRequest<Column>(
  context,
  'POST',
  `/tables/${tableId}/columns`,
  body,
  true // useQueryParams = true
);
```

## Troubleshooting

### Häufige Fehler

1. **"Spaltentyp und Titel sind erforderlich"**
   - Lösung: `columnConfig.basic.type` und `columnConfig.basic.title` setzen

2. **"Text-Subtyp ist erforderlich"**
   - Lösung: `textConfig.settings.subtype` auf `"line"` oder `"long"` setzen

3. **"Auswahloptionen sind leer"**
   - Lösung: `selectionConfig.settings.selectionOptions` mit Optionen füllen

### Debug-Modus

Für Entwicklung kann man die vollständige Konfiguration loggen:

```typescript
console.log('AI-Friendly Config:', {
  columnConfig: context.getNodeParameter('columnConfig', itemIndex),
  textConfig: context.getNodeParameter('textConfig', itemIndex),
  // ... andere Configs
});
``` 