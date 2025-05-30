# 🧪 Nextcloud Tables n8n-Node - Testing ToDo Liste

## ✅ **Bereits erfolgreich getestet** (Version 2.1.9)

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
- [x] ✅ **Numeric Validation Bug** - 'undefined' Fehler bei number-Spalten behoben

### 👁️ **View-Operations (NEU!)**
- [x] ✅ **Views abrufen** - `GET /tables/{id}/views` Status 200
- [x] ✅ **View erstellen** - `POST /tables/{id}/views` Status 200 erfolgreich
- [x] ✅ **View mit Filtern** - Complex Filter/Sort-Objekte funktionieren
- [x] ✅ **Resource Locator für Views** - Dropdown-Liste funktioniert

### 👥 **Share-Operations (VOLLSTÄNDIG FUNKTIONAL! 🎉)**
- [x] ✅ **Shares abrufen** - `GET /tables/{id}/shares` Status 200
- [x] ✅ **Share-Empfänger Dropdowns** - Benutzer/Gruppen-Listen implementiert
- [x] ✅ **OCS API Integration** - Nextcloud Sharee & Users API Helper hinzugefügt
- [x] ✅ **Benutzer abrufen** - OCS Sharee API erfolgreich (6 Benutzer geladen)
- [x] ✅ **Gruppen abrufen** - OCS API erfolgreich (2 Gruppen: "Team", "admin" geladen)
- [x] ✅ **Share mit Benutzer erstellen** - `POST /tables/{id}/shares` Status 200, Benutzer-Sharing funktioniert
- [x] ✅ **Share mit Gruppe erstellen** - `POST /tables/{id}/shares` Status 200, Gruppen-Sharing funktioniert
- [x] ✅ **UI-Parameter Bug Fix** - userReceiver vs groupReceiver Trennung löst Cache-Problem

### 🎨 **UI/UX-Verbesserungen**
- [x] ✅ **Optimierte Feld-Reihenfolge** - Zeilen-Daten direkt nach Tabellen-Auswahl
- [x] ✅ **Bedingte Feld-Anzeige** - Filter/Sortierung nur bei `getAll` sichtbar
- [x] ✅ **Context entfernt** - 405-Fehler behoben, Fokus auf wichtige Features
- [x] ✅ **Conditional Dropdown Loading** - User/Groups werden getrennt geladen je nach Share-Typ

### 🐛 **Debug-System (VOLLSTÄNDIG!)**
- [x] ✅ **Structured Debug Helper** - 9 Debug-Kategorien implementiert
- [x] ✅ **Resource Locator Debugging** - Input/Output-Tracking läuft
- [x] ✅ **API Request/Response Logging** - Vollständige HTTP-Überwachung
- [x] ✅ **Performance Monitoring** - Request-Dauer wird gemessen
- [x] ✅ **Load Options Debugging** - Dropdown-Loading wird überwacht
- [x] ✅ **CLI Debug Management** - `npm run debug:*` Skripte funktionieren

---

## ⚠️ **Noch zu testen** (Priorität: Hoch)

### 📝 **Zeilen-Operations (Kern-Features)**
- [ ] 🔄 **Zeile abrufen** - `GET /tables/{id}/rows/{rowId}`
- [ ] 🔄 **Zeile aktualisieren** - `PUT /tables/{id}/rows/{rowId}`  
- [ ] 🔄 **Zeile löschen** - `DELETE /tables/{id}/rows/{rowId}`
- [ ] 🔄 **Alle Zeilen abrufen** - `GET /tables/{id}/rows`

### 👥 **Share-Operations (REST-CRUD VOLLENDEN!)**
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

### 👁️ **View-Operations (Erweitert)**
- [ ] 🔄 **View abrufen** - `GET /tables/{id}/views/{viewId}`
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

### **Phase 1: Share-System testen** (Höchste Priorität)
1. **Benutzer abrufen** - Neue OCS Sharee API testen
2. **Gruppen abrufen** - Neue OCS Groups API testen
3. **Share erstellen** - Mit Dropdown-Empfänger testen
4. **Share aktualisieren/löschen** - CRUD vollständig

### **Phase 2: Kern-CRUD Operations**
5. **Zeile abrufen** - Einzelne Zeile laden
6. **Zeile aktualisieren** - Bestehende Zeile ändern  
7. **Zeile löschen** - Zeile entfernen
8. **Alle Zeilen abrufen** - Basis-Liste ohne Filter

### **Phase 3: Erweiterte Features**
9. **Filter testen** - Einfache Gleichheits-Filter
10. **Sortierung testen** - Ein-Spalten Sortierung
11. **View CRUD** - Vollständige View-Operationen

### **Phase 4: Vollständige API-Abdeckung**
12. **Restliche Spalten-Operations**
13. **Restliche Tabellen-Operations** 
14. **Import/Export-Features**

---

## 📊 **Testing Status Übersicht**

```
✅ Erfolgreich getestet:    17/57 Features (29%) 📈+12!
⚠️  Noch zu testen (Hoch):  9/57 Features (16%) 
⚠️  Noch zu testen (Mittel): 11/57 Features (19%)
❓ Noch zu testen (Niedrig): 20/57 Features (35%)
```

**🎯 Nächstes Ziel:** Share-System vollständig testen (neue OCS APIs)

---

## 🏆 **Erfolgreiche Fixes in Version 2.1.9**

### 🐛 **Kritische Runtime-Bugs behoben:**
- ✅ **Numeric Validation Error** - `Cannot read properties of undefined (reading 'length')` 
- ✅ **API Status Undefined** - Response-Handling verbessert
- ✅ **OCS API Integration** - Nextcloud Sharee & Users APIs hinzugefügt

### 📊 **Debug-System komplett:**
- ✅ **9 Debug-Kategorien** aktiv
- ✅ **CLI Management** mit 6 NPM-Skripten
- ✅ **Production Cleanup** bereit

### 👥 **Share-System erweitert:**
- ✅ **OCS Sharee API** für Benutzer-/Gruppensuche
- ✅ **OCS Users API** als Fallback
- ✅ **Robuste Fehlerbehandlung** mit mehreren API-Endpunkten

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

*Letzte Aktualisierung: 30.05.2025 - Version 2.1.9* 