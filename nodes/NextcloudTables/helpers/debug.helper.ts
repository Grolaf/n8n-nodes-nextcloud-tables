/**
 * 🐛 Debug-Helper für Nextcloud Tables n8n-Node
 * Zentrale Debug-Infrastruktur mit Kategorisierung und Inventar
 */

export type DebugCategory = 
	| 'api' 
	| 'validation' 
	| 'row-operations' 
	| 'share-operations' 
	| 'column-operations' 
	| 'table-operations'
	| 'view-operations'
	| 'import-operations'
	| 'resource-locator'
	| 'data-formatting'
	| 'authentication'
	| 'error-handling';

export type DebugLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface DebugEntry {
	id: string;
	category: DebugCategory;
	level: DebugLevel;
	description: string;
	location: string;
	enabled: boolean;
	testPhase?: 'development' | 'testing' | 'production';
}

/**
 * 🗂️ Debug-Inventar - Alle Debug-Points registriert
 */
export class DebugInventory {
	private static entries: Map<string, DebugEntry> = new Map();
	
	/**
	 * Debug-Point registrieren
	 */
	static register(entry: DebugEntry): void {
		this.entries.set(entry.id, entry);
	}
	
	/**
	 * Alle Debug-Points abrufen
	 */
	static getAll(): DebugEntry[] {
		return Array.from(this.entries.values());
	}
	
	/**
	 * Debug-Points nach Kategorie filtern
	 */
	static getByCategory(category: DebugCategory): DebugEntry[] {
		return this.getAll().filter(entry => entry.category === category);
	}
	
	/**
	 * Debug-Points nach Test-Phase filtern
	 */
	static getByPhase(phase: 'development' | 'testing' | 'production'): DebugEntry[] {
		return this.getAll().filter(entry => entry.testPhase === phase);
	}
	
	/**
	 * Debug-Point aktivieren/deaktivieren
	 */
	static setEnabled(id: string, enabled: boolean): void {
		const entry = this.entries.get(id);
		if (entry) {
			entry.enabled = enabled;
		}
	}
	
	/**
	 * Kategorie komplett aktivieren/deaktivieren
	 */
	static setCategoryEnabled(category: DebugCategory, enabled: boolean): void {
		this.getByCategory(category).forEach(entry => {
			entry.enabled = enabled;
		});
	}
	
	/**
	 * Markdown-Report generieren
	 */
	static generateReport(): string {
		const categories = [...new Set(this.getAll().map(e => e.category))];
		
		let report = '# 🐛 Debug-Inventar - Nextcloud Tables n8n-Node\n\n';
		report += `**Gesamt Debug-Points:** ${this.getAll().length}\n\n`;
		
		categories.forEach(category => {
			const entries = this.getByCategory(category);
			const enabledCount = entries.filter(e => e.enabled).length;
			
			report += `## 📂 ${category.toUpperCase()} (${enabledCount}/${entries.length} aktiv)\n\n`;
			
			entries.forEach(entry => {
				const status = entry.enabled ? '✅' : '❌';
				const phase = entry.testPhase ? ` [${entry.testPhase}]` : '';
				report += `- ${status} **${entry.id}** - ${entry.description} ${phase}\n`;
				report += `  - 📍 Location: \`${entry.location}\`\n`;
				report += `  - 🏷️ Level: ${entry.level}\n\n`;
			});
		});
		
		return report;
	}
}

/**
 * 🐛 Debug-Helper Hauptklasse
 */
export class DebugHelper {
	private static isEnabled = true;
	private static minLevel: DebugLevel = 'DEBUG';
	
	/**
	 * Debug-System global aktivieren/deaktivieren
	 */
	static setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}
	
	/**
	 * Minimum Log-Level setzen
	 */
	static setMinLevel(level: DebugLevel): void {
		this.minLevel = level;
	}
	
	/**
	 * Debug-Message ausgeben
	 */
	static log(
		id: string, 
		message: string, 
		data?: any, 
		category?: DebugCategory, 
		level: DebugLevel = 'DEBUG'
	): void {
		if (!this.isEnabled) return;
		
		const entry = DebugInventory.getAll().find(e => e.id === id);
		if (entry && !entry.enabled) return;
		
		if (!this.shouldLog(level)) return;
		
		const timestamp = new Date().toISOString();
		const categoryTag = category ? `[${category.toUpperCase()}]` : '';
		const prefix = `🐛 ${timestamp} ${categoryTag} [${level}] ${id}:`;
		
		console.log(prefix, message);
		if (data !== undefined) {
			console.log('📊 Data:', JSON.stringify(data, null, 2));
		}
	}
	
	/**
	 * API-Request Debug
	 */
	static logApiRequest(method: string, url: string, data?: any): void {
		this.log(
			'api-request',
			`${method} ${url}`,
			data,
			'api',
			'INFO'
		);
	}
	
	/**
	 * API-Response Debug
	 */
	static logApiResponse(method: string, url: string, status: number, data?: any): void {
		this.log(
			'api-response',
			`${method} ${url} - Status: ${status}`,
			data,
			'api',
			'INFO'
		);
	}
	
	/**
	 * Resource Locator Debug
	 */
	static logResourceLocator(type: string, value: any): void {
		this.log(
			'resource-locator',
			`Resource Locator: ${type}`,
			value,
			'resource-locator',
			'DEBUG'
		);
	}
	
	/**
	 * Validation Debug
	 */
	static logValidation(field: string, value: any, result: boolean, error?: string): void {
		this.log(
			'validation',
			`Validation ${field}: ${result ? '✅ PASS' : '❌ FAIL'}`,
			{ value, error },
			'validation',
			'DEBUG'
		);
	}
	
	/**
	 * Row Operation Debug
	 */
	static logRowOperation(operation: string, tableId: number, data?: any): void {
		this.log(
			'row-operation',
			`Row ${operation} - Table ${tableId}`,
			data,
			'row-operations',
			'INFO'
		);
	}
	
	/**
	 * Share Operation Debug
	 */
	static logShareOperation(operation: string, shareType?: string, receiver?: string): void {
		this.log(
			'share-operation',
			`Share ${operation} - Type: ${shareType}, Receiver: ${receiver}`,
			undefined,
			'share-operations',
			'INFO'
		);
	}
	
	/**
	 * Error Debug
	 */
	static logError(context: string, error: any): void {
		this.log(
			'error',
			`Error in ${context}`,
			{
				message: error.message,
				stack: error.stack,
				name: error.name
			},
			'error-handling',
			'ERROR'
		);
	}
	
	/**
	 * Performance Debug
	 */
	static logPerformance(operation: string, startTime: number, additionalData?: any): void {
		const duration = Date.now() - startTime;
		this.log(
			'performance',
			`${operation} completed in ${duration}ms`,
			additionalData,
			'api',
			'DEBUG'
		);
	}
	
	/**
	 * Load Options Debug
	 */
	static logLoadOptions(method: string, resultCount: number, data?: any): void {
		this.log(
			'load-options',
			`Load Options ${method}: ${resultCount} items`,
			data,
			'resource-locator',
			'DEBUG'
		);
	}
	
	/**
	 * Prüft ob Log-Level ausgegeben werden soll
	 */
	private static shouldLog(level: DebugLevel): boolean {
		const levels: Record<DebugLevel, number> = {
			'ERROR': 0,
			'WARN': 1,
			'INFO': 2,
			'DEBUG': 3,
			'TRACE': 4
		};
		
		return levels[level] <= levels[this.minLevel];
	}
}

/**
 * 🗂️ Debug-Points registrieren
 */
export function registerDebugPoints(): void {
	// API Debug Points
	DebugInventory.register({
		id: 'api-request',
		category: 'api',
		level: 'INFO',
		description: 'API-Requests verfolgen',
		location: 'api.helper.ts - makeApiRequest()',
		enabled: true,
		testPhase: 'testing'
	});
	
	DebugInventory.register({
		id: 'api-response',
		category: 'api',
		level: 'INFO',
		description: 'API-Responses verfolgen',
		location: 'api.helper.ts - makeApiRequest()',
		enabled: true,
		testPhase: 'testing'
	});
	
	// Resource Locator Debug Points
	DebugInventory.register({
		id: 'resource-locator',
		category: 'resource-locator',
		level: 'DEBUG',
		description: 'Resource Locator Werte debuggen',
		location: 'api.helper.ts - getResourceId()',
		enabled: true,
		testPhase: 'development'
	});
	
	DebugInventory.register({
		id: 'load-options',
		category: 'resource-locator',
		level: 'DEBUG',
		description: 'Load Options Methoden debuggen',
		location: 'node.methods.ts - NodeLoadOptions',
		enabled: true,
		testPhase: 'testing'
	});
	
	// Validation Debug Points
	DebugInventory.register({
		id: 'validation',
		category: 'validation',
		level: 'DEBUG',
		description: 'Datenvalidierung verfolgen',
		location: 'data.formatter.ts - formatColumnValue()',
		enabled: true,
		testPhase: 'development'
	});
	
	// Row Operations Debug Points
	DebugInventory.register({
		id: 'row-operation',
		category: 'row-operations',
		level: 'INFO',
		description: 'Zeilen-Operationen verfolgen',
		location: 'row.handler.ts - create/update/delete/get',
		enabled: true,
		testPhase: 'testing'
	});
	
	// Share Operations Debug Points
	DebugInventory.register({
		id: 'share-operation',
		category: 'share-operations',
		level: 'INFO',
		description: 'Share-Operationen verfolgen',
		location: 'share.handler.ts - create/update/delete',
		enabled: true,
		testPhase: 'testing'
	});
	
	// Error Handling Debug Points
	DebugInventory.register({
		id: 'error',
		category: 'error-handling',
		level: 'ERROR',
		description: 'Fehlerbehandlung verfolgen',
		location: 'api.helper.ts - handleApiError()',
		enabled: true,
		testPhase: 'production'
	});
	
	// Performance Debug Points
	DebugInventory.register({
		id: 'performance',
		category: 'api',
		level: 'DEBUG',
		description: 'Performance-Metriken sammeln',
		location: 'Verschiedene Handler',
		enabled: false,
		testPhase: 'development'
	});
}

// Debug-Points beim Import registrieren
registerDebugPoints(); 