# Changelog

## [2.5.0] - 2025-07-14

### ✨ New Feature

- ✅ **Translated entire app into English**

---

## [2.4.8] - 2024-01-15

### 🔍 Improved Log Labeling & Debugging

**New Features:**
- ✅ **Unique Node Labeling**: All logs now have the `[N8N-NEXTCLOUD-TABLES]` prefix for easier grepping
- ✅ **Structured Logging**: Debug, Info, Warn, Error levels with timestamp and context
- ✅ **API Request/Response Tracking**: Detailed logging of HTTP requests with duration
- ✅ **Operation Lifecycle Logging**: Start, Success, Error tracking for all operations
- ✅ **Validation Debugging**: Detailed logs for Resource Locator validation
- ✅ **Grep-Friendly Categories**: Easy filtering by log type

**Improved Error Messages:**
- All error messages now include the `[N8N-NEXTCLOUD-TABLES]` prefix
- Detailed validation errors with contextual information
- API errors include HTTP status codes and debugging data

**Grep Examples:**
\`\`\`bash
# All Node Logs
grep "N8N-NEXTCLOUD-TABLES" /path/to/logs

# Only Errors
grep "N8N-NEXTCLOUD-TABLES.*ERROR" /path/to/logs

# API Performance
grep "N8N-NEXTCLOUD-TABLES.*API-RESPONSE" /path/to/logs
\`\`\`

---

## [2.4.7] - 2024-01-10
