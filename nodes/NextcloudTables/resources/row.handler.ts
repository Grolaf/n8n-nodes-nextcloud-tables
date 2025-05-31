async execute(context: IExecuteFunctions, index: number): Promise<IDataObject[]> {
	const operation = context.getNodeParameter('operation', index);

	switch (operation) {
		case 'getAll':
			return this.getAll(context, index);
		case 'get':
			return this.get(context, index);
		case 'create':
			return this.create(context, index);
		case 'createAIFriendly':
			return this.createAIFriendly(context, index);
		case 'getAllAIFriendly':
			return this.getAllAIFriendly(context, index);
		case 'update':
			return this.update(context, index);
		case 'updateAIFriendly':
			return this.updateAIFriendly(context, index);
		default:
			throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

// ==============================================
// AI-FRIENDLY METHODS - Optimiert für KI Agents
// ==============================================

/**
 * AI-Friendly Zeile erstellen
 * Alle Parameter sind durch fixedCollection gleichzeitig verfügbar
 */
async createAIFriendly(context: IExecuteFunctions, index: number): Promise<IDataObject[]> {
	try {
		// Extrahiere Source-Konfiguration
		const sourceConfig = context.getNodeParameter('sourceConfig', index) as {
			source?: {
				type: 'table' | 'view';
				tableId?: string;
				viewId?: string;
			};
		};

		if (!sourceConfig?.source) {
			throw new Error('Datenquelle-Konfiguration ist erforderlich');
		}

		const { source } = sourceConfig;
		let apiPath: string;
		let tableId: string;

		// Bestimme API-Pfad basierend auf Quell-Typ
		if (source.type === 'table') {
			if (!source.tableId) {
				throw new Error('Tabellen-ID ist erforderlich wenn type="table"');
			}
			tableId = source.tableId;
			apiPath = `/api/1/tables/${tableId}/rows`;
		} else if (source.type === 'view') {
			if (!source.viewId) {
				throw new Error('View-ID ist erforderlich wenn type="view"');
			}
			// Für Views müssen wir auch die Tabellen-ID ermitteln
			const viewDetails = await this.nextcloud.request('GET', `/api/1/views/${source.viewId}`);
			tableId = viewDetails.tableId;
			apiPath = `/api/1/views/${source.viewId}/rows`;
		} else {
			throw new Error(`Ungültiger Quell-Typ: ${source.type}`);
		}

		// Extrahiere Zeilen-Daten
		const rowDataConfig = context.getNodeParameter('rowDataConfig', index) as {
			data?: {
				columns?: Array<{
					column?: {
						columnId: string;
						value: string;
					};
				}>;
			};
		};

		if (!rowDataConfig?.data?.columns || rowDataConfig.data.columns.length === 0) {
			throw new Error('Mindestens eine Spalte mit Daten ist erforderlich');
		}

		// Konvertiere AI-Friendly Format zu Nextcloud API Format
		const data: IDataObject = {};
		for (const columnEntry of rowDataConfig.data.columns) {
			if (columnEntry.column?.columnId) {
				data[columnEntry.column.columnId] = columnEntry.column.value || '';
			}
		}

		// Erstelle Zeile
		const response = await this.nextcloud.request('POST', apiPath, {
			data,
		});

		return [response as IDataObject];
	} catch (error) {
		throw new Error(`Fehler beim Erstellen der Zeile (AI-Friendly): ${error.message}`);
	}
}

/**
 * AI-Friendly Alle Zeilen abrufen mit erweiterten Optionen
 * Alle Filter/Sortierung/Suche Parameter gleichzeitig verfügbar
 */
async getAllAIFriendly(context: IExecuteFunctions, index: number): Promise<IDataObject[]> {
	try {
		// Extrahiere Source-Konfiguration
		const sourceConfig = context.getNodeParameter('sourceConfig', index) as {
			source?: {
				type: 'table' | 'view';
				tableId?: string;
				viewId?: string;
			};
		};

		if (!sourceConfig?.source) {
			throw new Error('Datenquelle-Konfiguration ist erforderlich');
		}

		const { source } = sourceConfig;
		let apiPath: string;

		// Bestimme API-Pfad basierend auf Quell-Typ
		if (source.type === 'table') {
			if (!source.tableId) {
				throw new Error('Tabellen-ID ist erforderlich wenn type="table"');
			}
			apiPath = `/api/1/tables/${source.tableId}/rows`;
		} else if (source.type === 'view') {
			if (!source.viewId) {
				throw new Error('View-ID ist erforderlich wenn type="view"');
			}
			apiPath = `/api/1/views/${source.viewId}/rows`;
		} else {
			throw new Error(`Ungültiger Quell-Typ: ${source.type}`);
		}

		// Extrahiere Query-Optionen
		const queryConfig = context.getNodeParameter('queryConfig', index, {}) as {
			query?: {
				pagination?: { settings?: { limit?: number; offset?: number } };
				filters?: Array<{ filter?: { columnId: string; operator: string; value: string } }>;
				sorting?: Array<{ sort?: { columnId: string; direction: 'ASC' | 'DESC' } }>;
				search?: { settings?: { term?: string; columns?: string; caseSensitive?: boolean } };
			};
		};

		// Baue Query-Parameter
		const queryParams: IDataObject = {};

		// Pagination
		if (queryConfig.query?.pagination?.settings) {
			const { limit, offset } = queryConfig.query.pagination.settings;
			if (limit !== undefined) queryParams.limit = limit;
			if (offset !== undefined) queryParams.offset = offset;
		}

		// Filter
		if (queryConfig.query?.filters && queryConfig.query.filters.length > 0) {
			queryParams.filter = [];
			for (const filterEntry of queryConfig.query.filters) {
				if (filterEntry.filter?.columnId && filterEntry.filter?.operator) {
					const filter: IDataObject = {
						column: filterEntry.filter.columnId,
						operator: this.mapFilterOperator(filterEntry.filter.operator),
					};
					
					// Wert nur hinzufügen wenn nicht leer (außer bei is_empty/is_not_empty)
					if (filterEntry.filter.value !== '' || 
						['is_empty', 'is_not_empty'].includes(filterEntry.filter.operator)) {
						filter.value = filterEntry.filter.value;
					}
					
					queryParams.filter.push(filter);
				}
			}
		}

		// Sortierung
		if (queryConfig.query?.sorting && queryConfig.query.sorting.length > 0) {
			queryParams.sort = [];
			for (const sortEntry of queryConfig.query.sorting) {
				if (sortEntry.sort?.columnId && sortEntry.sort?.direction) {
					queryParams.sort.push({
						column: sortEntry.sort.columnId,
						mode: sortEntry.sort.direction,
					});
				}
			}
		}

		// Suche
		if (queryConfig.query?.search?.settings?.term) {
			const searchSettings = queryConfig.query.search.settings;
			queryParams.search = searchSettings.term;
			
			if (searchSettings.columns) {
				// Konvertiere Komma-getrennte String zu Array
				queryParams.searchColumns = searchSettings.columns.split(',').map(id => id.trim());
			}
			
			if (searchSettings.caseSensitive !== undefined) {
				queryParams.caseSensitive = searchSettings.caseSensitive;
			}
		}

		// Führe API-Abfrage aus
		const response = await this.nextcloud.request('GET', apiPath, queryParams);
		
		// Nextcloud gibt manchmal { rows: [...] } zurück
		if (response && typeof response === 'object' && 'rows' in response) {
			return response.rows as IDataObject[];
		}
		
		// Oder direkt Array
		if (Array.isArray(response)) {
			return response;
		}
		
		return [response as IDataObject];
	} catch (error) {
		throw new Error(`Fehler beim Abrufen der Zeilen (AI-Friendly): ${error.message}`);
	}
}

/**
 * AI-Friendly Zeile aktualisieren
 * Alle Parameter durch fixedCollection gleichzeitig verfügbar
 */
async updateAIFriendly(context: IExecuteFunctions, index: number): Promise<IDataObject[]> {
	try {
		// Extrahiere Update-Konfiguration
		const updateDataConfig = context.getNodeParameter('updateDataConfig', index) as {
			update?: {
				rowId: string;
				tableId: string;
				columns?: Array<{
					column?: {
						columnId: string;
						value: string;
					};
				}>;
			};
		};

		if (!updateDataConfig?.update) {
			throw new Error('Update-Konfiguration ist erforderlich');
		}

		const { update } = updateDataConfig;

		if (!update.rowId) {
			throw new Error('Zeilen-ID ist erforderlich');
		}

		if (!update.tableId) {
			throw new Error('Tabellen-ID ist erforderlich');
		}

		if (!update.columns || update.columns.length === 0) {
			throw new Error('Mindestens eine Spalte mit Daten ist erforderlich');
		}

		// Konvertiere AI-Friendly Format zu Nextcloud API Format
		const data: IDataObject = {};
		for (const columnEntry of update.columns) {
			if (columnEntry.column?.columnId) {
				data[columnEntry.column.columnId] = columnEntry.column.value || '';
			}
		}

		// Aktualisiere Zeile
		const apiPath = `/api/1/tables/${update.tableId}/rows/${update.rowId}`;
		const response = await this.nextcloud.request('PUT', apiPath, {
			data,
		});

		return [response as IDataObject];
	} catch (error) {
		throw new Error(`Fehler beim Aktualisieren der Zeile (AI-Friendly): ${error.message}`);
	}
}

/**
 * Mappe AI-Friendly Filter-Operatoren zu Nextcloud API Operatoren
 */
private mapFilterOperator(operator: string): string {
	const operatorMap: { [key: string]: string } = {
		'equals': 'EQ',
		'not_equals': 'NE',
		'greater_than': 'GT',
		'greater_equal': 'GE',
		'less_than': 'LT',
		'less_equal': 'LE',
		'contains': 'LIKE',
		'starts_with': 'BEGINS_WITH',
		'ends_with': 'ENDS_WITH',
		'is_empty': 'IS_EMPTY',
		'is_not_empty': 'IS_NOT_EMPTY',
	};

	return operatorMap[operator] || operator;
} 