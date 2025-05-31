# Changelog

## [2.4.8] - 2024-01-15

### 🔍 Verbesserte Log-Kennzeichnung & Debugging

**Neue Features:**
- ✅ **Eindeutige Node-Kennzeichnung**: Alle Logs haben jetzt `[N8N-NEXTCLOUD-TABLES]` Präfix für besseres Grepping
- ✅ **Strukturiertes Logging**: Debug, Info, Warn, Error Level mit Zeitstempel und Kontext
- ✅ **API-Request/Response Tracking**: Detaillierte Logging von HTTP-Anfragen mit Dauer
- ✅ **Operation-Lifecycle Logging**: Start, Success, Error Tracking für alle Operationen
- ✅ **Validation-Debugging**: Ausführliche Logs für Resource Locator Validierung
- ✅ **Grep-freundliche Kategorien**: Einfache Filterung nach Log-Typen

**Verbesserte Fehlermeldungen:**
- Alle Error-Messages haben jetzt `[N8N-NEXTCLOUD-TABLES]` Präfix
- Detaillierte Validierungsfehler mit Kontext-Informationen
- API-Fehler mit HTTP-Status-Codes und Debugging-Daten

**Grep-Beispiele:**
```bash
# Alle Node-Logs
grep "N8N-NEXTCLOUD-TABLES" /path/to/logs

# Nur Fehler
grep "N8N-NEXTCLOUD-TABLES.*ERROR" /path/to/logs

# API-Performance
grep "N8N-NEXTCLOUD-TABLES.*API-RESPONSE" /path/to/logs
```

## [2.4.7] - 2024-01-10 