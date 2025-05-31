import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Row, Column } from '../interfaces';
import { DataFormatter, FormatOptions } from '../helpers/data.formatter';

export class RowHandler {
	static async execute(context: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(context, itemIndex);
			case 'get':
				return this.get(context, itemIndex);
			case 'create':
				return this.create(context, itemIndex);
			case 'update':
				return this.update(context, itemIndex);
			case 'delete':
				return this.delete(context, itemIndex);
			default:
				throw new Error(`Unbekannte Operation: ${operation}`);
		}
	}

	/**
	 * Alle Zeilen abrufen
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Row[]> {
		const nodeCollection = context.getNodeParameter('nodeCollection', itemIndex) as string;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;
		const limit = additionalOptions.limit || 50;
		const offset = additionalOptions.offset || 0;

		let endpoint: string;
		let tableId: number;
		
		if (nodeCollection === 'tables') {
			tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
			endpoint = `/tables/${tableId}/rows`;
		} else {
			const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));
			endpoint = `/views/${viewId}/rows`;
			
			// Für Views müssen wir die Tabellen-ID ermitteln für Spalten-Info
			try {
				const view = await ApiHelper.makeApiRequest<any>(context, 'GET', `/views/${viewId}`);
				tableId = view.tableId;
			} catch (error) {
				// Fallback ohne Spalten-Info
				tableId = 0;
			}
		}

		// Basis Query-Parameter
		const queryParams: Record<string, string> = {
			limit: limit.toString(),
			offset: offset.toString(),
		};

		// Erweiterte Filter, Sortierung und Suche
		if (additionalOptions.useFilters) {
			const filters = context.getNodeParameter('filters.filter', itemIndex, []) as any[];
			this.applyFilters(queryParams, filters);
		}

		if (additionalOptions.useSorting) {
			const sorting = context.getNodeParameter('sorting.sort', itemIndex, []) as any[];
			this.applySorting(queryParams, sorting);
		}

		if (additionalOptions.useSearch) {
			const search = context.getNodeParameter('search', itemIndex, {}) as any;
			this.applySearch(queryParams, search);
		}

		try {
			const rows = await ApiHelper.makeApiRequest<Row[]>(
				context,
				'GET',
				endpoint,
				queryParams,
			);

			// Optional: Spalten-Info laden für bessere Datenformatierung bei der Ausgabe
			let columns: Column[] = [];
			if (tableId > 0) {
				columns = await ApiHelper.getTableColumns(context, tableId);
			}

			// Client-seitige Nachbearbeitung falls erforderlich
			let processedRows = rows;
			
			// Client-seitige Filterung falls Server-API nicht alle Filter unterstützt
			if (additionalOptions.useFilters) {
				const filters = context.getNodeParameter('filters.filter', itemIndex, []) as any[];
				processedRows = this.applyClientSideFilters(processedRows, filters, columns);
			}

			// Client-seitige Suche falls Server-API nicht alle Suchoptionen unterstützt
			if (additionalOptions.useSearch) {
				const search = context.getNodeParameter('search', itemIndex, {}) as any;
				processedRows = this.applyClientSideSearch(processedRows, search, columns);
			}

			// Zeilen für bessere Lesbarkeit formatieren
			return this.formatRowsForOutput(processedRows, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Wendet Filter auf Query-Parameter an
	 */
	private static applyFilters(queryParams: Record<string, string>, filters: any[]): void {
		if (!filters || filters.length === 0) {
			return;
		}

		// Nextcloud Tables API Filter-Format (falls unterstützt)
		const filterQueries: string[] = [];
		
		for (const filter of filters) {
			if (filter.columnId && filter.operator) {
				let filterQuery = '';
				
				switch (filter.operator) {
					case 'equals':
						filterQuery = `${filter.columnId}=${encodeURIComponent(filter.value || '')}`;
						break;
					case 'not_equals':
						filterQuery = `${filter.columnId}!=${encodeURIComponent(filter.value || '')}`;
						break;
					case 'greater_than':
						filterQuery = `${filter.columnId}>${encodeURIComponent(filter.value || '')}`;
						break;
					case 'greater_equal':
						filterQuery = `${filter.columnId}>=${encodeURIComponent(filter.value || '')}`;
						break;
					case 'less_than':
						filterQuery = `${filter.columnId}<${encodeURIComponent(filter.value || '')}`;
						break;
					case 'less_equal':
						filterQuery = `${filter.columnId}<=${encodeURIComponent(filter.value || '')}`;
						break;
					case 'contains':
						filterQuery = `${filter.columnId}~${encodeURIComponent(filter.value || '')}`;
						break;
					case 'is_empty':
						filterQuery = `${filter.columnId}=null`;
						break;
					case 'is_not_empty':
						filterQuery = `${filter.columnId}!=null`;
						break;
				}
				
				if (filterQuery) {
					filterQueries.push(filterQuery);
				}
			}
		}
		
		if (filterQueries.length > 0) {
			queryParams['filter'] = filterQueries.join('&');
		}
	}

	/**
	 * Wendet Sortierung auf Query-Parameter an
	 */
	private static applySorting(queryParams: Record<string, string>, sorting: any[]): void {
		if (!sorting || sorting.length === 0) {
			return;
		}

		const sortQueries: string[] = [];
		
		for (const sort of sorting) {
			if (sort.columnId && sort.direction) {
				const direction = sort.direction === 'DESC' ? '-' : '';
				sortQueries.push(`${direction}${sort.columnId}`);
			}
		}
		
		if (sortQueries.length > 0) {
			queryParams['sort'] = sortQueries.join(',');
		}
	}

	/**
	 * Wendet Suche auf Query-Parameter an
	 */
	private static applySearch(queryParams: Record<string, string>, search: any): void {
		if (!search || !search.term) {
			return;
		}

		queryParams['search'] = encodeURIComponent(search.term);
		
		if (search.searchColumns && search.searchColumns.length > 0) {
			queryParams['searchColumns'] = search.searchColumns.join(',');
		}
		
		if (search.caseSensitive) {
			queryParams['caseSensitive'] = 'true';
		}
	}

	/**
	 * Client-seitige Filterung für erweiterte Filter-Optionen
	 */
	private static applyClientSideFilters(rows: Row[], filters: any[], columns: Column[]): Row[] {
		if (!filters || filters.length === 0) {
			return rows;
		}

		return rows.filter(row => {
			return filters.every(filter => {
				if (!filter.columnId || !filter.operator) {
					return true;
				}

				const columnId = parseInt(filter.columnId, 10);
				const rowData = row.data?.find(d => d.columnId === columnId);
				const value = rowData?.value;
				const filterValue = filter.value;

				return this.evaluateFilter(value, filter.operator, filterValue);
			});
		});
	}

	/**
	 * Client-seitige Suche für erweiterte Suchoptionen
	 */
	private static applyClientSideSearch(rows: Row[], search: any, columns: Column[]): Row[] {
		if (!search || !search.term) {
			return rows;
		}

		const searchTerm = search.caseSensitive ? search.term : search.term.toLowerCase();
		const searchColumns = search.searchColumns || [];

		return rows.filter(row => {
			if (!row.data) {
				return false;
			}

			// Bestimme welche Spalten durchsucht werden sollen
			let columnsToSearch = columns;
			if (searchColumns.length > 0) {
				columnsToSearch = columns.filter(col => searchColumns.includes(col.id.toString()));
			}

			// Durchsuche nur Text-Spalten
			const textColumns = columnsToSearch.filter(col => col.type === 'text');

			return textColumns.some(column => {
				const rowData = row.data!.find(d => d.columnId === column.id);
				if (!rowData || !rowData.value) {
					return false;
				}

				const cellValue = search.caseSensitive 
					? String(rowData.value) 
					: String(rowData.value).toLowerCase();

				return cellValue.includes(searchTerm);
			});
		});
	}

	/**
	 * Evaluiert eine Filter-Bedingung
	 */
	private static evaluateFilter(value: any, operator: string, filterValue: any): boolean {
		switch (operator) {
			case 'equals':
				return value == filterValue;
			case 'not_equals':
				return value != filterValue;
			case 'greater_than':
				return this.compareValues(value, filterValue) > 0;
			case 'greater_equal':
				return this.compareValues(value, filterValue) >= 0;
			case 'less_than':
				return this.compareValues(value, filterValue) < 0;
			case 'less_equal':
				return this.compareValues(value, filterValue) <= 0;
			case 'contains':
				return String(value || '').toLowerCase().includes(String(filterValue || '').toLowerCase());
			case 'starts_with':
				return String(value || '').toLowerCase().startsWith(String(filterValue || '').toLowerCase());
			case 'ends_with':
				return String(value || '').toLowerCase().endsWith(String(filterValue || '').toLowerCase());
			case 'is_empty':
				return value === null || value === undefined || value === '';
			case 'is_not_empty':
				return value !== null && value !== undefined && value !== '';
			default:
				return true;
		}
	}

	/**
	 * Vergleicht zwei Werte für numerische/alphanumerische Sortierung
	 */
	private static compareValues(a: any, b: any): number {
		// Numerischer Vergleich falls beide Zahlen sind
		const numA = parseFloat(a);
		const numB = parseFloat(b);
		
		if (!isNaN(numA) && !isNaN(numB)) {
			return numA - numB;
		}
		
		// Datum-Vergleich falls beide Daten sind
		const dateA = new Date(a);
		const dateB = new Date(b);
		
		if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
			return dateA.getTime() - dateB.getTime();
		}
		
		// String-Vergleich
		return String(a || '').localeCompare(String(b || ''));
	}

	/**
	 * Eine spezifische Zeile abrufen
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const rowId = ApiHelper.validateRowId(context.getNodeParameter('rowId', itemIndex));
		
		try {
			const row = await ApiHelper.makeApiRequest<Row>(
				context,
				'GET',
				`/tables/${tableId}/rows/${rowId}`,
			);

			// Spalten-Info für bessere Formatierung laden
			const columns = await ApiHelper.getTableColumns(context, tableId);
			
			return this.formatRowForOutput(row, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Eine neue Zeile erstellen
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const nodeCollection = context.getNodeParameter('nodeCollection', itemIndex) as string;
		const dataArray = context.getNodeParameter('data.column', itemIndex, []) as any[];

		// Formatiere die Daten für die API
		const data: Record<string, any> = {};
		for (const item of dataArray) {
			if (item.columnId && item.value !== undefined) {
				data[item.columnId] = item.value;
			}
		}

		let endpoint: string;
		let tableId: number;
		
		if (nodeCollection === 'tables') {
			tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
			endpoint = `/tables/${tableId}/rows`;
		} else {
			const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));
			endpoint = `/views/${viewId}/rows`;
			
			// Für Views müssen wir die Tabellen-ID ermitteln
			try {
				const view = await ApiHelper.makeApiRequest<any>(context, 'GET', `/views/${viewId}`);
				tableId = view.tableId;
			} catch (error) {
				// Fallback: Erstellen ohne Spalten-Info
				const formattedData = ApiHelper.formatRowDataSimple(data);
				return await ApiHelper.makeApiRequest<Row>(
					context,
					'POST',
					endpoint,
					{ data: formattedData },
				);
			}
		}

		// Spalten-Info laden für korrekte Datenformatierung
		const columns = await ApiHelper.getTableColumns(context, tableId);
		
		// Erweiterte Formatierung mit Validierung
		const formatOptions: FormatOptions = {
			validateSelections: true,
			dateTimeFormat: 'iso'
		};
		
		try {
			const formattedData = ApiHelper.formatRowData(data, columns, formatOptions);

			const result = await ApiHelper.makeApiRequest<Row>(
				context,
				'POST',
				endpoint,
				{ data: formattedData },
			);

			return this.formatRowForOutput(result, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Eine Zeile aktualisieren
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const rowId = ApiHelper.validateRowId(context.getNodeParameter('rowId', itemIndex));
		const dataArray = context.getNodeParameter('data.column', itemIndex, []) as any[];

		// Formatiere die Daten für die API
		const data: Record<string, any> = {};
		for (const item of dataArray) {
			if (item.columnId && item.value !== undefined) {
				data[item.columnId] = item.value;
			}
		}

		// Spalten-Info laden für korrekte Datenformatierung
		const columns = await ApiHelper.getTableColumns(context, tableId);
		
		// Erweiterte Formatierung mit Validierung
		const formatOptions: FormatOptions = {
			validateSelections: true,
			dateTimeFormat: 'iso'
		};

		try {
			const formattedData = ApiHelper.formatRowData(data, columns, formatOptions);

			if (Object.keys(formattedData).length === 0) {
				throw new Error('Mindestens eine Spalte muss für die Aktualisierung angegeben werden');
			}

			const result = await ApiHelper.makeApiRequest<Row>(
				context,
				'PUT',
				`/tables/${tableId}/rows/${rowId}`,
				{ data: formattedData },
			);

			return this.formatRowForOutput(result, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Eine Zeile löschen - Teste verschiedene API-Endpunkte
	 */
	private static async delete(context: IExecuteFunctions, itemIndex: number): Promise<{ success: boolean; message: string }> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const rowId = ApiHelper.validateRowId(context.getNodeParameter('rowId', itemIndex));

		// Verschiedene API-Endpunkte testen
		const endpointsToTry = [
			`/api/1/tables/${tableId}/rows/${rowId}`,      // Standard DELETE
			`/api/2/tables/${tableId}/rows/${rowId}`,      // API v2 
			`/ocs/v2.php/apps/tables/api/1/tables/${tableId}/rows/${rowId}`, // OCS v1
			`/ocs/v2.php/apps/tables/api/2/tables/${tableId}/rows/${rowId}`, // OCS v2
		];

		let lastError: any = null;

		for (const endpoint of endpointsToTry) {
			try {
				await ApiHelper.makeApiRequest(
					context,
					'DELETE',
					endpoint,
				);

				return { 
					success: true, 
					message: `Zeile ${rowId} wurde erfolgreich aus Tabelle ${tableId} gelöscht (Endpunkt: ${endpoint})` 
				};
			} catch (error: any) {
				lastError = error;
				// 405 = Method Not Allowed, 404 = Not Found - beide bedeuten "Endpunkt existiert nicht"
				if (error.status && (error.status === 405 || error.status === 404)) {
					continue; // Nächsten Endpunkt probieren
				}
				// Bei anderen Fehlern (403, 500, etc.) sofort abbrechen
				break;
			}
		}

		// Wenn alle Endpunkte fehlschlagen
		throw new Error(`DELETE für Zeilen wird von der Nextcloud Tables API nicht unterstützt. Letzter Fehler: ${lastError?.message || 'Unbekannt'}`);
	}

	/**
	 * Formatiert eine einzelne Zeile für bessere Ausgabe
	 */
	private static formatRowForOutput(row: Row, columns: Column[]): any {
		const formatted: any = {
			id: row.id,
			tableId: row.tableId,
			createdBy: row.createdBy,
			createdAt: row.createdAt,
			lastEditBy: row.lastEditBy,
			lastEditAt: row.lastEditAt,
			data: {}
		};

		// Daten mit Spaltennamen anstatt IDs formatieren
		if (row.data && Array.isArray(row.data)) {
			for (const item of row.data) {
				const column = columns.find(col => col.id === item.columnId);
				const columnName = column?.title || `column_${item.columnId}`;
				
				formatted.data[columnName] = this.formatValueForOutput(item.value, column);
			}
		}

		return formatted;
	}

	/**
	 * Formatiert mehrere Zeilen für bessere Ausgabe
	 */
	private static formatRowsForOutput(rows: Row[], columns: Column[]): any[] {
		return rows.map(row => this.formatRowForOutput(row, columns));
	}

	/**
	 * Formatiert einen Wert für die Ausgabe basierend auf Spaltentyp
	 */
	private static formatValueForOutput(value: any, column?: Column): any {
		if (!column || value === null || value === undefined) {
			return value;
		}

		return DataFormatter.convertForExport([{ data: [{ columnId: column.id, value }] }], [column])[0][column.title];
	}
} 