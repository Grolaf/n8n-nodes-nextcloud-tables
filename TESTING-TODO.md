# 🧪 Nextcloud Tables n8n-Node - Testing ToDo Liste

## ✅ **Bereits erfolgreich getestet** (Version 2.1.11)

### 🔐 **Authentifizierung & Credentials**
- [x] ✅ **Credentials Validation** - Korrekte Fehlerbehandlung bei fehlenden/ungültigen Credentials
- [x] ✅ **Basic Authentication** - Erfolgreiche Anmeldung mit Benutzername/Passwort
- [x] ✅ **API Verbindung** - Grundlegende API-Konnektivität funktioniert

### 📋 **Tabellen-Operations**  
- [x] ✅ **Tabellen abrufen** - `GET /tables` Status 200
- [x] ✅ **Resource Locator für Tabellen** - Dropdown-Liste funktioniert
- [x] ✅ **Tabelle abrufen** - `GET /tables/{id}` Status 200 (Test 5: Execution ID 2567, 482ms)

### 🏗️ **Spalten-Operations**
- [x] ✅ **Spalten abrufen** - `GET /tables/{id}/columns` Status 200
- [x] ✅ **Spalte erstellen** - API v1 mit Query-Parametern funktioniert (Fix für v2.1.0)
- [x] ✅ **Spalten für Tabelle abrufen** - `GET /tables/{id}/columns` Status 200 (Test 4: Execution ID 2566)

### 📝 **Zeilen-Operations** 
- [x] ✅ **Zeile erstellen** - `POST /tables/{id}/rows` Status 200 erfolgreich
- [x] ✅ **Resource Locator für Zeilen-Daten** - Spalten-Dropdown funktioniert
- [x] ✅ **Datenformatierung** - Korrekte Übertragung von Zeilen-Daten
- [x] ✅ **Numeric Validation Bug** - 'undefined' Fehler bei number-Spalten behoben
- [x] ✅ **Alle Zeilen abrufen** - `GET /tables/{id}/rows` Status 200 - Test-Tabelle hat 7 Zeilen, 609ms Response Time
- [x] ✅ **Zeile abrufen** - `GET /tables/{id}/rows` + clientseitige Filterung (Test 1: Execution ID 2570, 896ms) **API-Limitation behoben in v2.1.11**
- [ ] 🔄 **Zeile aktualisieren** - `PUT /tables/{id}/rows/{rowId}` - Bereit für Test mit v2.1.13
- [x] ❌ **Zeile löschen** - **ENDGÜLTIG ENTFERNT in v2.1.13** - Nextcloud Tables API unterstützt keine DELETE für Zeilen (OCS v2: 404/998, Standard API: 405). **Feature aus Node entfernt.**

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
- [x] ✅ **Groups Dropdown Cache Fix** - Separate Parameter Namen beheben n8n Cache-Problem

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

### 🧪 **Test-Umgebung (READY!)**
- [x] ✅ **Docker-Entwicklungsumgebung** - n8n lokale Instanz läuft
- [x] ✅ **Node Installation** - Version 2.1.11 erfolgreich installiert und getestet
- [x] ✅ **Test-Workflows erstellt** - Zeilen-CRUD Test-Workflows bereit
- [x] ✅ **Test-Daten analysiert** - Tabelle 1 mit 7 Zeilen, 4 Spalten identifiziert
- [x] ✅ **Remote Testing via MCP** - n8n Server per Model Context Protocol erreichbar

### 🔍 **API-Analyse & OpenAPI (NEU! Version 2.1.11)**
- [x] ✅ **OpenAPI-Spezifikation analysiert** - Nextcloud Tables API vollständig dokumentiert
- [x] ✅ **API-Limitation identifiziert** - `GET /tables/{id}/rows/{rowId}` existiert NICHT in der API
- [x] ✅ **Clientseitige Lösung implementiert** - Row GET über `/tables/{id}/rows` + Filterung
- [x] ✅ **DELETE-Endpunkte identifiziert** - OCS v2 API unterstützt Zeilen-Löschung
- [x] ✅ **Multi-Endpoint DELETE-Test** - 4 verschiedene DELETE-Endpunkte werden systematisch getestet

---

## ⚠️ **Noch zu testen** (Priorität: Hoch)

### 📝 **Zeilen-Operations (Kern-Features)**
- [ ] 🔄 **Zeile aktualisieren** - `PUT /tables/{id}/rows/{rowId}` - Bereit für Test mit v2.1.13

### 🏗️ **Spalten-Operations (Vollständigkeit)**
- [ ] 🔄 **Spalte abrufen** - `GET /tables/{id}/columns/{columnId}`
- [ ] 🔄 **Spalte aktualisieren** - `PUT /tables/{id}/columns/{columnId}`
- [ ] 🔄 **Spalte löschen** - `DELETE /tables/{id}/columns/{columnId}`

### 📋 **Tabellen-Operations (Vollständigkeit)**
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

### **Phase 1: Zeilen-CRUD vollenden** (Höchste Priorität) - **FAST FERTIG!** 🎯
1. ✅ **Zeile abrufen** - ✅ ERFOLGREICH mit v2.1.11 (clientseitige Filterung)
2. **Zeile aktualisieren** - Bereit für Test mit v2.1.13
3. ❌ **Zeile löschen** - **ENTFERNT** (API unterstützt DELETE nicht)

### **Phase 2: Spalten-CRUD vollenden**
4. **Spalte abrufen** - Einzelne Spalte laden
5. **Spalte aktualisieren** - Spalten-Eigenschaften ändern
6. **Spalte löschen** - Spalte entfernen

### **Phase 3: Tabellen-CRUD vollenden**
7. **Tabelle erstellen** - Neue Tabelle anlegen
8. **Tabelle aktualisieren** - Tabellen-Eigenschaften ändern
9. **Tabelle löschen** - Tabelle entfernen

### **Phase 4: Erweiterte Features**
10. **Filter testen** - Einfache Gleichheits-Filter
11. **Sortierung testen** - Ein-Spalten Sortierung
12. **View CRUD** - Vollständige View-Operationen

---

## 📊 **Testing Status Übersicht**

```
✅ Erfolgreich getestet:    26/55 Features (47%) 📈+4 Features in v2.1.11!
⚠️  Noch zu testen (Hoch):   8/55 Features (15%) 📉-3 (Fortschritt!)
⚠️  Noch zu testen (Mittel): 11/55 Features (20%)
❓ Noch zu testen (Niedrig): 10/55 Features (18%)
```

**🎯 Nächstes Ziel:** Zeilen-CRUD Operations vollständig testen (nur noch UPDATE und DELETE!)

---

## 🏆 **Erfolgreiche Fixes in Version 2.1.11**

### 🔍 **Kritische API-Limitation behoben:**
- ✅ **Row GET API-Problem gelöst** - `GET /tables/{id}/rows/{rowId}` existiert nicht in Nextcloud Tables API
- ✅ **Clientseitige Filterung implementiert** - `GET /tables/{id}/rows` + JavaScript-Filterung nach Row ID
- ✅ **OpenAPI-Analyse integriert** - Vollständige API-Spezifikation analysiert für bessere Kompatibilität
- ✅ **Erfolgreicher Test bestätigt** - Execution ID 2570: Row GET funktioniert perfekt (896ms)

### 🧪 **Test-Infrastruktur erweitert:**
- ✅ **Remote Testing via MCP** - Model Context Protocol für n8n-Server-Integration
- ✅ **Systematische Workflow-Tests** - 5 Test-Workflows für CRUD-Operationen erstellt
- ✅ **Multi-Endpoint DELETE-Test** - 4 verschiedene DELETE-APIs werden systematisch getestet

### 📊 **Debug-System komplett:**
- ✅ **9 Debug-Kategorien** aktiv
- ✅ **CLI Management** mit 6 NPM-Skripten
- ✅ **Production Cleanup** bereit

### 👥 **Share-System erweitert:**
- ✅ **OCS Sharee API** für Benutzer-/Gruppensuche
- ✅ **OCS Users API** als Fallback
- ✅ **Robuste Fehlerbehandlung** mit mehreren API-Endpunkten

---

## 🧪 **Test-Protokoll v2.1.11**

### ✅ **Row GET Test** - 31.05.2025
- **Endpoint:** `GET /tables/1/rows` (+ clientseitige Filterung)
- **Execution ID:** 2570
- **Status:** ✅ ERFOLGREICH
- **Performance:** 896ms
- **Besonderheit:** API-Limitation durch clevere Lösung umgangen
- **Daten:** Zeile 1 korrekt abgerufen und formatiert

### ✅ **Table GET Test** - 31.05.2025  
- **Endpoint:** `GET /tables/1`
- **Execution ID:** 2567
- **Status:** ✅ ERFOLGREICH  
- **Performance:** 482ms

### ✅ **Column GET Test** - 31.05.2025
- **Endpoint:** `GET /tables/1/columns`
- **Execution ID:** 2566
- **Status:** ✅ ERFOLGREICH

---

## 📋 **Aktuelle Test-Workflows (Remote n8n Server)**

1. **🧪 Test 1: Row GET** (ID: 0DFpw1uey3VOq2w5) - ✅ ERFOLGREICH
2. **🧪 Test 2: Row UPDATE** (ID: SDCYFgZ9j617cZfL) - 🔄 Bereit
3. **🧪 Test 3: Row DELETE** (ID: AkYnK8e1rDJsVJzr) - 🔄 Bereit (Multi-Endpoint)
4. **🧪 Test 4: Column GET** (ID: f2LaSgPLw04MmUmU) - ✅ ERFOLGREICH
5. **🧪 Test 5: Table GET** (ID: PH7BI1gjmm481keO) - ✅ ERFOLGREICH

**Credentials:** Nextcloud Tables account (ID: 3bsRr23dgzlsdDNw)
**Test-Tabelle:** "Willkommen zu Terschaweb IT-Tabellen!" (ID: 1, 7 Zeilen, 4 Spalten)

---

## 🎯 **Nächste kritische Tests**

### **Immediate Priority (heute):**
1. **Row UPDATE Test** ausführen - PUT-Operation testen
2. **Row DELETE Test** ausführen - Multi-Endpoint DELETE systematisch testen
3. TESTING-TODO.md mit finalen Ergebnissen aktualisieren

### **Short-term (diese Woche):**
4. Column CRUD-Operationen
5. Table CRUD-Operationen  
6. Erweiterte Filter/Sort-Funktionen

**🚀 Das Row GET Problem ist vollständig gelöst - ein großer Erfolg für Version 2.1.11!** 