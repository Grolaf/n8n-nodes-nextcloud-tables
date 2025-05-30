# 🐛 Debug-Inventar - Nextcloud Tables n8n-Node

**Gesamt Debug-Points:** 9

## 📂 API (2/3 aktiv)

- ✅ **api-request** - API-Requests verfolgen  [testing]
  - 📍 Location: `api.helper.ts - makeApiRequest()`
  - 🏷️ Level: INFO

- ✅ **api-response** - API-Responses verfolgen  [testing]
  - 📍 Location: `api.helper.ts - makeApiRequest()`
  - 🏷️ Level: INFO

- ❌ **performance** - Performance-Metriken sammeln  [development]
  - 📍 Location: `Verschiedene Handler`
  - 🏷️ Level: DEBUG

## 📂 RESOURCE-LOCATOR (2/2 aktiv)

- ✅ **resource-locator** - Resource Locator Werte debuggen  [development]
  - 📍 Location: `api.helper.ts - getResourceId()`
  - 🏷️ Level: DEBUG

- ✅ **load-options** - Load Options Methoden debuggen  [testing]
  - 📍 Location: `node.methods.ts - NodeLoadOptions`
  - 🏷️ Level: DEBUG

## 📂 VALIDATION (1/1 aktiv)

- ✅ **validation** - Datenvalidierung verfolgen  [development]
  - 📍 Location: `data.formatter.ts - formatColumnValue()`
  - 🏷️ Level: DEBUG

## 📂 ROW-OPERATIONS (1/1 aktiv)

- ✅ **row-operation** - Zeilen-Operationen verfolgen  [testing]
  - 📍 Location: `row.handler.ts - create/update/delete/get`
  - 🏷️ Level: INFO

## 📂 SHARE-OPERATIONS (1/1 aktiv)

- ✅ **share-operation** - Share-Operationen verfolgen  [testing]
  - 📍 Location: `share.handler.ts - create/update/delete`
  - 🏷️ Level: INFO

## 📂 ERROR-HANDLING (1/1 aktiv)

- ✅ **error** - Fehlerbehandlung verfolgen  [production]
  - 📍 Location: `api.helper.ts - handleApiError()`
  - 🏷️ Level: ERROR

