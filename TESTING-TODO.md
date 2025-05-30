# 🧪 Nextcloud Tables n8n-Node - Testing ToDo Liste

## ✅ **Bereits erfolgreich getestet** (Version 2.1.2)

### 🔐 **Authentifizierung & Credentials**
- [x] ✅ **Credentials Validation** - Korrekte Fehlerbehandlung bei fehlenden/ungültigen Credentials
- [x] ✅ **Basic Authentication** - Erfolgreiche Anmeldung mit Benutzername/Passwort
- [x] ✅ **API Verbindung** - Grundlegende API-Konnektivität funktioniert

### 📋 **Tabellen-Operations**  
- [x] ✅ **Tabellen abrufen** - `GET /tables` Status 200
- [x] ✅ **Resource Locator für Tabellen** - Dropdown-Liste funktioniert

### 🏗️ **Spalten-Operations**
- [x] ✅ **Spalten abrufen** - `GET /tables/{id}/columns` Status 200
- [x] ✅ **Spalte erstellen** - API v1 mit Query-Parametern funktioniert (Fix für v2.1.0)

### 📝 **Zeilen-Operations** 
- [x] ✅ **Zeile erstellen** - `POST /tables/{id}/rows` Status 200 erfolgreich
- [x] ✅ **Resource Locator für Zeilen-Daten** - Spalten-Dropdown funktioniert
- [x] ✅ **Datenformatierung** - Korrekte Übertragung von Zeilen-Daten

### 👥 **Share-Operations (NEU!)**
- [x] ✅ **Share-Empfänger Dropdowns** - Benutzer/Gruppen-Listen implementiert
- [ ] 🔄 **Benutzer abrufen** - `GET /ocs/v1.php/cloud/users` testen
- [ ] 🔄 **Gruppen abrufen** - `GET /ocs/v1.php/cloud/groups` testen
- [ ] 🔄 **Share erstellen** - Mit Dropdown-Empfänger testen

### 🎨 **UI/UX-Verbesserungen**
- [x] ✅ **Optimierte Feld-Reihenfolge** - Zeilen-Daten direkt nach Tabellen-Auswahl
- [x] ✅ **Bedingte Feld-Anzeige** - Filter/Sortierung nur bei `getAll` sichtbar
- [x] ✅ **Context entfernt** - 405-Fehler behoben, Fokus auf wichtige Features

---

## ⚠️ **Noch zu testen** (Priorität: Hoch)

### 📝 **Zeilen-Operations (Kern-Features)**
- [ ] 🔄 **Zeile abrufen** - `GET /tables/{id}/rows/{rowId}`
- [ ] 🔄 **Zeile aktualisieren** - `PUT /tables/{id}/rows/{rowId}`  
- [ ] 🔄 **Zeile löschen** - `DELETE /tables/{id}/rows/{rowId}`
- [ ] 🔄 **Alle Zeilen abrufen** - `GET /tables/{id}/rows`

### 👥 **Share-Operations (NÄCHSTE PRIORITÄT!)**
- [ ] 🔄 **Share erstellen** - `POST /tables/{id}/shares` mit Dropdown-Empfängern
- [ ] 🔄 **Alle Shares abrufen** - `GET /tables/{id}/shares`
- [ ] 🔄 **Share aktualisieren** - `PUT /shares/{id}`
- [ ] 🔄 **Share löschen** - `DELETE /shares/{id}`

### 🏗️ **Spalten-Operations (Vollständigkeit)**
- [ ] 🔄 **Spalte abrufen** - `GET /tables/{id}/columns/{columnId}`
- [ ] 🔄 **Spalte aktualisieren** - `PUT /tables/{id}/columns/{columnId}`
- [ ] 🔄 **Spalte löschen** - `DELETE /tables/{id}/columns/{columnId}`

### 📋 **Tabellen-Operations (Vollständigkeit)**
- [ ] 🔄 **Tabelle abrufen** - `GET /tables/{id}`
- [ ] 🔄 **Tabelle erstellen** - `POST /tables`
- [ ] 🔄 **Tabelle aktualisieren** - `PUT /tables/{id}`
- [ ] 🔄 **Tabelle löschen** - `DELETE /tables/{id}`

---

## ⚠️ **Noch zu testen** (Priorität: Mittel)

### 👁️ **View-Operations**
- [ ] 🔄 **Views abrufen** - `GET /tables/{id}/views`
- [ ] 🔄 **View abrufen** - `GET /tables/{id}/views/{viewId}`
- [ ] 🔄 **View erstellen** - `POST /tables/{id}/views`
- [ ] 🔄 **View aktualisieren** - `PUT /tables/{id}/views/{viewId}`
- [ ] 🔄 **View löschen** - `DELETE /tables/{id}/views/{viewId}`
- [ ] 🔄 **Zeilen aus View abrufen** - `GET /tables/{id}/views/{viewId}/rows`

### 🔍 **Erweiterte Abfrage-Features (nur getAll)**
- [ ] 🔄 **Filter-Funktionen** - Verschiedene Operatoren testen
- [ ] 🔄 **Sortierung** - ASC/DESC, Multiple Spalten
- [ ] 🔄 **Suche** - Volltext-Suche in Spalten
- [ ] 🔄 **Pagination** - Limit & Offset
- [ ] 🔄 **Kombinierte Filter** - Mehrere Filter gleichzeitig

### 📤 **Import/Export-Features**
- [ ] 🔄 **CSV Import** - `POST /tables/{id}/import`
- [ ] 🔄 **CSV Export** - `GET /tables/{id}/export`

---

## ❓ **Noch zu testen** (Priorität: Niedrig)

### 🔧 **Edge Cases & Fehlerbehandlung**
- [ ] ❓ **Ungültige Tabellen-ID** - 404 Behandlung
- [ ] ❓ **Ungültige Spalten-ID** - 404 Behandlung  
- [ ] ❓ **Ungültige Zeilen-ID** - 404 Behandlung
- [ ] ❓ **Ungültige View-ID** - 404 Behandlung
- [ ] ❓ **Netzwerk-Timeouts** - Retry-Mechanismus
- [ ] ❓ **Rate Limiting** - 429 Behandlung
- [ ] ❓ **Server Errors** - 5xx Behandlung

### 🎛️ **Datentyp-Spezifische Tests**
- [ ] ❓ **Text-Spalten** - Verschiedene Textlängen
- [ ] ❓ **Nummer-Spalten** - Integer, Float, Negative Zahlen
- [ ] ❓ **Datum-Spalten** - Verschiedene Datumsformate
- [ ] ❓ **Boolean-Spalten** - true/false Werte
- [ ] ❓ **Auswahl-Spalten** - Single/Multi Select
- [ ] ❓ **Link-Spalten** - URL-Validierung

### 🌐 **Multi-Instanz & Sicherheit**
- [ ] ❓ **Verschiedene Nextcloud-Versionen** - Kompatibilität
- [ ] ❓ **Verschiedene Tables App-Versionen** - API-Unterschiede
- [ ] ❓ **SSL/TLS Verbindungen** - HTTPS-only Instanzen
- [ ] ❓ **Self-Signed Certificates** - Zertifikat-Behandlung

---

## 🚀 **Test-Reihenfolge Empfehlung**

### **Phase 1: Kern-CRUD Operations** (Nächste Priorität)
1. **Zeile abrufen** - Einzelne Zeile laden
2. **Zeile aktualisieren** - Bestehende Zeile ändern  
3. **Zeile löschen** - Zeile entfernen
4. **Alle Zeilen abrufen** - Basis-Liste ohne Filter

### **Phase 2: Erweiterte Zeilen-Features**
5. **Filter testen** - Einfache Gleichheits-Filter
6. **Sortierung testen** - Ein-Spalten Sortierung
7. **Pagination testen** - Limit/Offset

### **Phase 3: Vollständige API-Abdeckung**
8. **Restliche Spalten-Operations**
9. **Restliche Tabellen-Operations** 
10. **View-Operations**

### **Phase 4: Edge Cases & Robustheit**
11. **Fehlerbehandlung**
12. **Datentyp-Tests**
13. **Performance & Limits**

---

## 📊 **Testing Status Übersicht**

```
✅ Erfolgreich getestet:    8/57 Features (14%)
⚠️  Noch zu testen (Hoch):  12/57 Features (21%) 
⚠️  Noch zu testen (Mittel): 15/57 Features (26%)
❓ Noch zu testen (Niedrig): 22/57 Features (39%)
```

**🎯 Nächstes Ziel:** Kern-CRUD Operations für Zeilen vollständig testen (Phase 1)

---

## 🧪 **Test-Protokoll Template**

Für jeden Test bitte folgende Informationen dokumentieren:

```markdown
### ✅/❌ [Feature Name] - [Datum]
- **Endpoint:** `METHOD /path`
- **Input:** [Beschreibung der Test-Daten]
- **Erwartetes Ergebnis:** [Was sollte passieren]
- **Tatsächliches Ergebnis:** [Was ist passiert]
- **Status Code:** [HTTP Status]
- **Logs:** [Relevante Log-Ausgaben]
- **Notizen:** [Besonderheiten, Bugs, etc.]
```

---

*Letzte Aktualisierung: 30.05.2025 - Version 2.1.2* 