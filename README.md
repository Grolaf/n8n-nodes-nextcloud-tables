# n8n-nodes-nextcloud-tables

A **community** n8n node for integration with Nextcloud Tables. This node enables full table management, advanced data operations, and is **specifically optimized for AI agents**.

This repo is the english translation of the original one https://github.com/terschawebIT/n8n-nodes-nextcloud-tables

## 🚀 **Production Status: v2.5.0** ✅

**This node is production-ready for the tested core features and hardened against critical NaN bugs!**

### ✅ **Version 2.5.0 - Production-Ready:**

- ✅ **English translation** - All node is now accessible in english

### ✅ **Version 2.4.8 - Production-Ready:**
- ✅ **Robust Resource Locator Validation** - No more NaN errors
- ✅ **AI-Agent Compatibility** - Special AI-friendly operations
- ✅ **Comprehensive Error Handling** - Detailed HTTP status codes
- ✅ **Optimized API Performance** - Query parameters for column operations
- ✅ **Improved Log Labeling** - Unique node identification for better grepping
- ✅ **Structured Logging** - Debug, Info, Warn, Error levels with context

### ✅ **Version 2.4.7 - Production-Ready:**
- **🛡️ NaN Bug Fixes**: Robust validation against all NaN sources (null, undefined, 'NaN' strings)
- **🧹 Production Cleanup**: Removed all debug tools, clean codebase
- ⚡ **Enhanced Error Handling**: Helpful error messages for Resource Locator issues
- 🔧 **Optimized Builds**: TypeScript compilation without warnings
- 📦 **Clean Dependencies**: Removed outdated scripts and legacy code

### ✅ **Tested & Production-Ready:**
- **Table Management**: Basic CRUD operations (getAll, get) ✅
- **Column Management**: All operations including AI-friendly extensions ✅
- **Row Management**: Basic CRUD (create, getAll, get) ✅
- **Views Management**: Basic operations (getAll, create) ✅
- **Shares Management**: User/Group sharing ✅
- **NaN Bug Protection**: Robust Resource Locator validation ✅

### ⚠️ **Implemented but Untested:**
- **Advanced Table Ops**: update, delete
- **Advanced Row Ops**: update (delete not supported by API)
- **Advanced Views Ops**: get, update, delete, getRows
- **Advanced Shares Ops**: update, delete
- **CSV Import**: Complete import pipeline
- **Context Integration**: App-context features
- **Advanced Filter/Sort**: Complex multi-column operations

## 🛡️ **Critical Bug Fixes in v2.4.7**

### **Problem Solved: NaN Table IDs**
Nextcloud logs showed critical errors like:
[error] Did expect one result but found none for table id = NaN
[error] no read access to table id = 0


### **Root Cause: Resource Locator Handling**
```typescript
// BEFORE: Insufficient validation led to NaN IDs
if (!tableId || isNaN(tableId)) { ... }

// AFTER: Robust validation against ALL NaN sources
if (resourceLocator === null || resourceLocator === undefined || 
    resourceLocator === 'null' || resourceLocator === 'undefined' ||
    resourceLocator === 'NaN' || 
    (typeof resourceLocator === 'number' && isNaN(resourceLocator))) {
    throw new Error('Resource Locator is required but not set or invalid');
}
Hardened Validation in Load Options

    ✅ Table ID Extraction: Robust handling of __rl resource locators

    ✅ Column/View Loading: Validation prevents /tables/NaN/columns requests

    ✅ Error Messages: Helpful debugging information

    ✅ String-to-Number Conversion: Safe parseInt() with validation

🤖 AI-Agent Optimized ⭐

Unique: This is the first n8n community node specifically optimized for AI agents!
Problem Solved:

Standard n8n nodes use displayOptions to dynamically hide parameters. AI agents can't see these.
Solution: AI-Friendly Operations

    ✅ All parameters visible at once

    ✅ No UI dependencies for AI agents

    ✅ String-based IDs instead of dropdown navigation

    ✅ Flat parameter structure without nesting

    ✅ Robust NaN protection in v2.4.7

Available AI-Friendly Operations:
Column Management (AI-Optimized)

// Optimized for AI agents - ALL parameters visible
Operation: "Create Column (AI-Friendly)"
{
  "tableIdAI": "123",
  "columnType": "selection", 
  "columnTitle": "Status",
  "columnMandatory": true,

  // All type-specific parameters available at once:
  "selectionOptionsAI": "[\"Open\", \"In Progress\", \"Done\"]",
  "selectionDefaultAI": "Open",
  "selectionMultipleAI": false,

  // Text parameters (ignored for other types):
  "textSubtypeAI": "line",
  "textMaxLengthAI": 255
  // ... all other parameters available
}

// Full updates possible
Operation: "Update Column (AI-Friendly)"
{
  "columnIdAI": "456",
  "columnType": "text",           // Change type
  "columnTitle": "New Name",      // Change title
  "textSubtypeAI": "long",        // Text-specific
  "textMaxLengthAI": 500          // Change max length
  // Only relevant parameters are used
}

Benefits for AI Agents:

    🔍 Parameter transparency: 24 parameters visible at once

    🎯 Autonomous operations: No UI interaction required

    🚀 String-based inputs: No dropdowns, maximum flexibility

    🛡️ NaN protection: Robust validation prevents API errors (v2.4.7)

    ↩️ Backward compatible: Human UI remains unchanged

📊 Feature Overview & Test Status
🏗️ Table Operations

    ✅ Get all tables: Tested, production-ready

    ✅ Get table: Tested, production-ready

    ⚠️ Create table: Implemented, untested

    ⚠️ Update table: Implemented, untested

    ⚠️ Delete table: Implemented, untested

📋 Column Management ✅ FULLY TESTED & AI-OPTIMIZED

Standard operations:

    ✅ Get all columns: Tested, production-ready

    ✅ Get column: Tested, production-ready

    ✅ Create column: Tested, production-ready

    ⚠️ Update column: Implemented, untested

    ⚠️ Delete column: Implemented, untested

🤖 AI-Friendly Operations:

    ✅ Create Column (AI-Friendly): Tested, production-ready - 23 parameters visible

    ⚠️ Update Column (AI-Friendly): Implemented, untested - 24 parameters for full updates

5 fully supported column types:

    ✅ Text: Tested - pattern validation, max length, subtypes (single/multiline)

    ✅ Number: Tested - min/max, decimals, prefix/suffix, validation

    ✅ DateTime: Tested - default date, flexible input formats

    ✅ Selection: Tested - dropdown options, default values, multi-select

    ✅ UserGroup: Tested - user/group selection, multi-select, teams

🎯 Row Operations

    ✅ Get all rows: Tested, production-ready

    ✅ Get row: Tested, production-ready (client-side filtering)

    ✅ Create row: Tested, production-ready

    ⚠️ Update row: Implemented, untested

    ❌ Delete row: Not supported by Nextcloud Tables API

Advanced row features (untested):

    ⚠️ Smart pagination: Optimized for 1-1000 rows

    ⚠️ 11 filter operators: =, !=, >, >=, <, <=, LIKE, starts_with, ends_with, is_empty, is_not_empty

    ⚠️ Multi-column sorting: Priority-based sorting

    ⚠️ Full-text search: Case-sensitive/insensitive, column-specific

    ✅ Automatic validation: Column-based data formatting

📋 Views Management

    ✅ Get views: Tested, production-ready

    ✅ Create view: Tested, production-ready

    ⚠️ Get view (single): Implemented, untested

    ⚠️ Update view: Implemented, untested

    ⚠️ Delete view: Implemented, untested

    ⚠️ Get rows from view: Implemented, untested

🤝 Collaboration Features

    ✅ Get shares: Tested, production-ready

    ✅ Create share: Tested, production-ready (users & groups)

    ⚠️ Update share: Implemented, untested

    ⚠️ Delete share: Implemented, untested

    ✅ Get users/groups: Tested, production-ready

📥 CSV Import ⚠️ UNTESTED

    ⚠️ Flexible options: Header detection, delimiter selection

    ⚠️ Column mapping: Automatic or manual mapping

    ⚠️ Data type conversion: Auto, text, number, datetime, boolean

    ⚠️ Import status: Monitoring and error handling

🌐 App-Context Integration ⚠️ UNTESTED

    ⚠️ Context navigation: Seamless Nextcloud app integration

    ⚠️ Context tables: Filtered views by app context

    ⚠️ Context pages: App page management

## Installation

```bash
npm install n8n-nodes-nextcloud-tables

Restart n8n to load the new node.
Configuration
Credentials

Create new credentials of type Nextcloud Tables API:

    Nextcloud URL: Full URL (e.g. https://cloud.example.com)

    Username: Your Nextcloud username

    Password: App password (recommended) or normal password

🔒 Security Tip: Use App Passwords:

    Nextcloud → Settings → Security → App Passwords

    Create a new app password for n8n

🤖 AI-Agent Usage Examples
Create Column (AI-Friendly)

{
  "resource": "Column",
  "operation": "Create Column (AI-Friendly)",
  "tableIdAI": "123",
  "columnType": "selection",
  "columnTitle": "Project Status", 
  "columnDescription": "Current status of the project",
  "columnMandatory": true,
  "selectionOptionsAI": "[\"Planned\", \"In Progress\", \"Testing\", \"Done\", \"Archived\"]",
  "selectionDefaultAI": "Planned",
  "selectionMultipleAI": false
}

Update Column (AI-Friendly)

{
  "resource": "Column", 
  "operation": "Update Column (AI-Friendly)",
  "columnIdAI": "456",
  "columnTitle": "Advanced Project Status",
  "selectionOptionsAI": "[\"Backlog\", \"Sprint\", \"Review\", \"Done\", \"Cancelled\"]",
  "selectionDefaultAI": "Backlog"
}

Various Column Types for AI Agents

// Create Text Column
{
  "columnType": "text",
  "columnTitle": "Description",
  "textSubtypeAI": "long",
  "textMaxLengthAI": 1000,
  "textPatternAI": "^[A-Za-z0-9\\s]+$"
}

// Create Number Column  
{
  "columnType": "number",
  "columnTitle": "Budget",
  "numberMinAI": 0,
  "numberMaxAI": 100000,
  "numberDecimalsAI": 2,
  "numberPrefixAI": "€"
}

// Create User/Group Column
{
  "columnType": "usergroup", 
  "columnTitle": "Responsible",
  "usergroupTypeAI": "user",
  "usergroupMultipleAI": false
}

Human vs. AI-Agent Comparison

// HUMAN (UI-optimized) - Parameters appear dynamically
Operation: "Create Column"
Table: [Dropdown Selection]
Type: "Selection" 
// → Then type-specific parameters appear

// AI-AGENT (AI-optimized) - All parameters visible
Operation: "Create Column (AI-Friendly)"  
// → ALL 23 parameters immediately visible and usable
// → String-based inputs instead of dropdowns
// → Maximum flexibility for autonomous execution

🔧 Advanced Usage
Advanced Row Query with Filters

{
  "resource": "Row",
  "operation": "Get All Rows",
  "source": "table",
  "tableId": "123",
  "useFiltering": true,
  "filters": [
    {
      "columnId": "5",
      "operator": "EQ", 
      "value": "Active"
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

CSV Import with Column Mapping

{
  "resource": "Import",
  "operation": "Import CSV to Table",
  "tableId": "123",
  "csvData": "[Binary CSV Data]",
  "hasHeader": true,
  "delimiter": ";",
  "columnMapping": [
    {
      "csvColumn": "Customer Name",
      "tableColumn": "1",
      "dataType": "text"
    },
    {
      "csvColumn": "Created Date", 
      "tableColumn": "2",
      "dataType": "datetime"
    }
  ]
}

📊 Full API Coverage
✅ Implemented Endpoints

    Tables: /tables/* (full CRUD)

    Rows: /tables/{id}/rows, /views/{id}/rows (full CRUD except DELETE*)

    Views: /tables/{id}/views, /views/{id} (full CRUD)

    Columns: /tables/{id}/columns, /columns/{id} (full CRUD + AI-friendly)

    Shares: /tables/{id}/shares, /shares/{id} (full CRUD)

    Import: /tables/{id}/import (POST + status monitoring)

    Context: /contexts/* (GET operations)

*Note: Row DELETE is not supported by the Nextcloud Tables API
🔧 Compatibility

    Nextcloud: 28+ (tested)

    Tables App: 0.6+ (tested)

    n8n: 1.0+ (tested)

🛠️ Technical Details

    API Version: Hybrid v1/v2 (optimized per operation)

    Authentication: Basic Auth with app-password support

    Error Handling: 10 HTTP status codes with specific messages

    Retry Logic: 3 attempts with exponential backoff

    Validation: Column-based real-time validation

Development & Testing
Setup

npm install          # Install dependencies
npm run build        # Compile TypeScript  
npm run dev          # Development mode
npm run lint         # Lint code
npm run format       # Format code

Project Structure

nodes/NextcloudTables/
├── NextcloudTables.node.ts           # Main node
├── descriptions/                     # UI definitions
│   ├── column.ts     ← AI-OPTIMIZED
│   ├── table.ts      ├── row.ts
│   ├── view.ts       ├── share.ts  
│   ├── import.ts     └── context.ts
├── handlers/                         # Business logic
│   ├── column.handler.ts ← AI-FRIENDLY LOGIC
│   └── *.handler.ts
├── helpers/                          # Core utilities
│   ├── api.helper.ts                 # HTTP + error handling
│   ├── data.formatter.ts             # Validation
│   └── node.methods.ts               # Dynamic dropdowns
└── interfaces/                       # TypeScript types

🛠️ Troubleshooting
Logging & Debugging

🔍 Improved Log Labeling (New in v2.4.8)
All node logs are now clearly labeled for better grepping:

# All Nextcloud Tables node logs
grep "N8N-NEXTCLOUD-TABLES" /path/to/n8n/logs

# Only API errors
grep "N8N-NEXTCLOUD-TABLES.*API-ERROR" /path/to/n8n/logs

# Only validation errors
grep "N8N-NEXTCLOUD-TABLES.*VALIDATION-ERROR" /path/to/n8n/logs

# Operation-specific logs
grep "N8N-NEXTCLOUD-TABLES.*OPERATION-" /path/to/n8n/logs

# Resource Locator debugging
grep "N8N-NEXTCLOUD-TABLES.*RESOURCE-VALIDATION" /path/to/n8n/logs

Log Categories:

    [N8N-NEXTCLOUD-TABLES] [DEBUG] [API-REQUEST] - API requests

    [N8N-NEXTCLOUD-TABLES] [DEBUG] [API-RESPONSE] - API responses

    [N8N-NEXTCLOUD-TABLES] [INFO] [OPERATION-START] - Operation started

    [N8N-NEXTCLOUD-TABLES] [INFO] [OPERATION-SUCCESS] - Operation successful

    [N8N-NEXTCLOUD-TABLES] [ERROR] [OPERATION-ERROR] - Operation failed

    [N8N-NEXTCLOUD-TABLES] [WARN] [VALIDATION-ERROR] - Validation error

    [N8N-NEXTCLOUD-TABLES] [DEBUG] [RESOURCE-VALIDATION] - Resource locator debugging

Example Logs:

2024-01-15T10:30:45.123Z [N8N-NEXTCLOUD-TABLES] [INFO] [OPERATION-START] table.getAll
2024-01-15T10:30:45.124Z [N8N-NEXTCLOUD-TABLES] [DEBUG] [API-REQUEST] GET /tables
2024-01-15T10:30:45.234Z [N8N-NEXTCLOUD-TABLES] [DEBUG] [API-RESPONSE] GET /tables -> 200 (110ms)
2024-01-15T10:30:45.235Z [N8N-NEXTCLOUD-TABLES] [INFO] [OPERATION-SUCCESS] table.getAll completed (112ms)

### Common Issues

**401 Unauthorized**  
✅ **Solution**: Use an app password, check permissions.

**AI Agent can't see parameters**  
✅ **Solution**: Use AI-Friendly operations (`createAIFriendly`, `updateAIFriendly`).

**🚨 NaN Table ID Errors (FIXED in v2.4.7)**  
❌ **Symptom**: Nextcloud logs show `table id = NaN` or `table id = 0`.  
✅ **Solution**: Update to v2.4.7 – robust Resource Locator validation implemented.

**Filters not working**  
✅ **Solution**: Use column IDs instead of names, ensure correct operators.

**Column creation failed**  
✅ **Fixed**: Uses optimized API v1 with query parameters.

**Resource Locator Validation Errors**  
✅ **New in v2.4.7**: Detailed error messages to help with debugging:

"Resource Locator is required but not set or invalid"
"Invalid ID in Resource Locator: 'undefined' is not a valid number"


### Error Handling
Detailed error messages for all HTTP status codes:
- **400–404**: Client errors with suggested fixes
- **429**: Rate-limiting with automatic retry
- **5xx**: Server errors with retry logic
- **Resource Locator**: Specific validation and helpful debugging (v2.4.7)

## 🎯 **Roadmap**

### ✅ **Version 2.4.8 (Current)**
- ✅ **Improved Log Labeling** – clear `[N8N-NEXTCLOUD-TABLES]` prefixes
- ✅ **Structured Logging** – Debug, Info, Warn, Error levels with context
- ✅ **API Request/Response Logging** – detailed debugging information
- ✅ **Operation Tracking** – start, success, error logging with timestamps
- ✅ **Validation Logging** – resource locator and parameter validation
- ✅ **Grep-friendly logs** – easy filtering by category

### ✅ **Version 2.4.7**
- 🛡️ **Critical NaN Bug Fixes**: Robust resource locator validation
- 🧹 **Production Cleanup**: Removed all debug tools and legacy code
- ⚡ **Enhanced Error Handling**: Helpful messages and validation
- 📦 **Optimized Builds**: Clean TypeScript compilation without warnings

### ✅ **Version 2.4.6 (Previous)**
- Full AI-Agent optimization
- 24 AI parameters with systematic separation
- Robust validation and error handling
- Clean UX for all operations

### 🔮 **Future Versions**
- More AI-Friendly operations for other resources
- Extended AI features (bulk operations, schema inference)
- Performance optimizations for large datasets
- Extended context integration with more Nextcloud apps

## Contributing

**Contributions welcome!** Especially:
- 🤖 **AI-Agent Testing**: Help test the AI-friendly operations
- 🐛 **Bug Reports**: Use GitHub Issues
- 💻 **Code**: Improvements and new features
- 📝 **Documentation**: Examples and best practices

## License

MIT

## Support

- **GitHub**: [Issues & Discussions](https://github.com/terschawebIT/n8n-nodes-nextcloud-tables)
- **n8n Community**: [Community Forum](https://community.n8n.io/)
- **Documentation**: [Nextcloud Tables API](https://github.com/nextcloud/tables/blob/main/docs/API.md)

---

**🤖 This node is the first AI-Agent-optimized n8n community node!**  
**Try the AI-friendly operations and experience fully autonomous table mana
