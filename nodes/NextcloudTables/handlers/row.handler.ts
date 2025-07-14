import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { FormatOptions } from '../helpers/data.formatter';
import { Column, Row } from '../interfaces';

export class RowHandler {
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(context, itemIndex);
			case 'get':
				return this.get(context, itemIndex);
			case 'create':
				return this.create(context, itemIndex);
			case 'createAIFriendly':
				return this.createAIFriendly(context, itemIndex);
			case 'getAllAIFriendly':
				return this.getAllAIFriendly(context, itemIndex);
			case 'update':
				return this.update(context, itemIndex);
			case 'updateAIFriendly':
				return this.updateAIFriendly(context, itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Retrieve all rows
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Row[]> {
		const nodeCollection = context.getNodeParameter('nodeCollection', itemIndex) as string;
		const additionalOptions = context.getNodeParameter(
			'additionalOptions',
			itemIndex,
			{},
		) as any;
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

			// For views, determine the table ID for column info
			try {
				const view = await ApiHelper.makeApiRequest<any>(
					context,
					'GET',
					`/views/${viewId}`,
				);
				tableId = view.tableId;
			} catch (error) {
				// Fallback without column info
				tableId = 0;
			}
		}

		// Basic query parameters
		const queryParams: Record<string, string> = {
			limit: limit.toString(),
			offset: offset.toString(),
		};

		// Advanced filters, sorting and search
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

			// Optionally load column info for better data formatting in output
			let columns: Column[] = [];
			if (tableId > 0) {
				columns = await ApiHelper.getTableColumns(context, tableId);
			}

			// Client-side post-processing if necessary
			let processedRows = rows;

			// Client-side filtering if the server API doesn't support all filters
			if (additionalOptions.useFilters) {
				const filters = context.getNodeParameter('filters.filter', itemIndex, []) as any[];
				processedRows = this.applyClientSideFilters(processedRows, filters, columns);
			}

			// Client-side search if the server API doesn't support all search options
			if (additionalOptions.useSearch) {
				const search = context.getNodeParameter('search', itemIndex, {}) as any;
				processedRows = this.applyClientSideSearch(processedRows, search, columns);
			}

			// Format rows for better readability
			return this.formatRowsForOutput(processedRows, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Apply filters to query parameters
	 */
	private static applyFilters(queryParams: Record<string, string>, filters: any[]): void {
		if (!filters || filters.length === 0) {
			return;
		}

		// Nextcloud Tables API filter format (if supported)
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
	 * Apply sorting to query parameters
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
	 * Apply search to query parameters
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
	 * Client-side filtering for advanced filter options
	 */
	private static applyClientSideFilters(rows: Row[], filters: any[], columns: Column[]): Row[] {
		if (!filters || filters.length === 0) {
			return rows;
		}

		return rows.filter((row) => {
			return filters.every((filter) => {
				if (!filter.columnId || !filter.operator) {
					return true;
				}

				const columnId = parseInt(filter.columnId, 10);
				const rowData = row.data?.find((d) => d.columnId === columnId);
				const value = rowData?.value;
				const filterValue = filter.value;

				return this.evaluateFilter(value, filter.operator, filterValue);
			});
		});
	}

	/**
	 * Client-side search for advanced search options
	 */
	private static applyClientSideSearch(rows: Row[], search: any, columns: Column[]): Row[] {
		if (!search || !search.term) {
			return rows;
		}

		const searchTerm = search.caseSensitive ? search.term : search.term.toLowerCase();
		const searchColumns = search.searchColumns || [];

		return rows.filter((row) => {
			if (!row.data) {
				return false;
			}

			// Determine which columns to search
			let columnsToSearch = columns;
			if (searchColumns.length > 0) {
				columnsToSearch = columns.filter((col) =>
					searchColumns.includes(col.id.toString()),
				);
			}

			// Search only text columns
			const textColumns = columnsToSearch.filter((col) => col.type === 'text');

			return textColumns.some((column) => {
				const rowData = row.data!.find((d) => d.columnId === column.id);
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
	 * Evaluates a filter condition
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
				return String(value || '')
					.toLowerCase()
					.includes(String(filterValue || '').toLowerCase());
			case 'starts_with':
				return String(value || '')
					.toLowerCase()
					.startsWith(String(filterValue || '').toLowerCase());
			case 'ends_with':
				return String(value || '')
					.toLowerCase()
					.endsWith(String(filterValue || '').toLowerCase());
			case 'is_empty':
				return value === null || value === undefined || value === '';
			case 'is_not_empty':
				return value !== null && value !== undefined && value !== '';
			default:
				return true;
		}
	}

	/**
	 * Compares two values for numeric/alphanumeric sorting
	 */
	private static compareValues(a: any, b: any): number {
		// Numeric comparison if both are numbers
		const numA = parseFloat(a);
		const numB = parseFloat(b);

		if (!isNaN(numA) && !isNaN(numB)) {
			return numA - numB;
		}

		// Date comparison if both are dates
		const dateA = new Date(a);
		const dateB = new Date(b);

		if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
			return dateA.getTime() - dateB.getTime();
		}

		// String comparison
		return String(a || '').localeCompare(String(b || ''));
	}

	/**
	 * Retrieve a single row (using client-side filtering)
	 * Since the Nextcloud Tables API does not support direct single-row retrieval,
	 * all rows are fetched and then filtered locally.
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const rowId = ApiHelper.validateRowId(context.getNodeParameter('rowId', itemIndex));

		try {
			// Fetch all rows from the table
			const allRows = await ApiHelper.makeApiRequest<Row[]>(
				context,
				'GET',
				`/tables/${tableId}/rows`,
			);

			// Find the desired row
			const targetRow = allRows.find((row) => row.id === rowId);

			if (!targetRow) {
				throw new Error(`Row with ID ${rowId} not found in table ${tableId}`);
			}

			// Load column info for better formatting
			const columns = await ApiHelper.getTableColumns(context, tableId);

			return this.formatRowForOutput(targetRow, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Create a new row
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const nodeCollection = context.getNodeParameter('nodeCollection', itemIndex) as string;
		const dataArray = context.getNodeParameter('data.column', itemIndex, []) as any[];

		// Format data for the API
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

			// For views, we need to determine the table ID
			try {
				const view = await ApiHelper.makeApiRequest<any>(
					context,
					'GET',
					`/views/${viewId}`,
				);
				tableId = view.tableId;
			} catch (error) {
				// Fallback: create without column info
				const formattedData = ApiHelper.formatRowDataSimple(data);
				return await ApiHelper.makeApiRequest<Row>(context, 'POST', endpoint, {
					data: formattedData,
				});
			}
		}

		// Load column info for correct data formatting
		const columns = await ApiHelper.getTableColumns(context, tableId);

		// Advanced formatting with validation
		const formatOptions: FormatOptions = {
			validateSelections: true,
			dateTimeFormat: 'iso',
		};

		try {
			const formattedData = ApiHelper.formatRowData(data, columns, formatOptions);

			const result = await ApiHelper.makeApiRequest<Row>(context, 'POST', endpoint, {
				data: formattedData,
			});

			return this.formatRowForOutput(result, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * Update a row
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<Row> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const rowId = ApiHelper.validateRowId(context.getNodeParameter('rowId', itemIndex));
		const dataArray = context.getNodeParameter('data.column', itemIndex, []) as any[];

		// Format data for the API
		const data: Record<string, any> = {};
		for (const item of dataArray) {
			if (item.columnId && item.value !== undefined) {
				data[item.columnId] = item.value;
			}
		}

		// Load column info for correct data formatting
		const columns = await ApiHelper.getTableColumns(context, tableId);

		// Advanced formatting with validation
		const formatOptions: FormatOptions = {
			validateSelections: true,
			dateTimeFormat: 'iso',
		};

		try {
			const formattedData = ApiHelper.formatRowData(data, columns, formatOptions);

			if (Object.keys(formattedData).length === 0) {
				throw new Error('At least one column must be specified for the update');
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
	 * Formats a single row for better output
	 */
	private static formatRowForOutput(row: Row, columns: Column[]): any {
		const formatted: any = {
			id: row.id,
			tableId: row.tableId,
			createdBy: row.createdBy,
			createdAt: row.createdAt,
			lastEditBy: row.lastEditBy,
			lastEditAt: row.lastEditAt,
			data: {},
		};

		// Format data with column names instead of IDs
		if (row.data && Array.isArray(row.data)) {
			for (const item of row.data) {
				const column = columns.find((col) => col.id === item.columnId);
				const columnName = column?.title || `column_${item.columnId}`;

				formatted.data[columnName] = this.formatValueForOutput(item.value, column);
			}
		}

		return formatted;
	}

	/**
	 * Formats multiple rows for better output
	 */
	private static formatRowsForOutput(rows: Row[], columns: Column[]): any[] {
		return rows.map((row) => this.formatRowForOutput(row, columns));
	}

	/**
	 * Formats a value for output based on column type
	 */
	private static formatValueForOutput(value: any, column?: Column): any {
		if (value === null || value === undefined) {
			return null;
		}

		if (!column) {
			return value;
		}

		// Formatting based on column type
		switch (column.type) {
			case 'datetime':
				// Format date
				if (typeof value === 'string' && value) {
					try {
						return new Date(value).toISOString();
					} catch {
						return value;
					}
				}
				return value;
			case 'number':
				// Format number
				if (typeof value === 'string' && value) {
					const num = parseFloat(value);
					return isNaN(num) ? value : num;
				}
				return value;
			case 'selection':
				// Selection values are usually already properly formatted
				return value;
			default:
				return value;
		}
	}

	// ==============================================
	// AI-FRIENDLY METHODS - Optimized for AI Agents
	// ==============================================

	/**
	 * AI-Friendly create row
	 * All parameters are available at once through fixedCollection
	 */
	private static async createAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<Row> {
		try {
			// Extract source configuration
			const sourceConfig = context.getNodeParameter('sourceConfig', itemIndex) as {
				source?: {
					type: 'table' | 'view';
					tableId?: string;
					viewId?: string;
				};
			};

			if (!sourceConfig?.source) {
				throw new Error('Source configuration is required');
			}

			const { source } = sourceConfig;
			let endpoint: string;
			let tableId: number;

			// Determine API endpoint based on source type
			if (source.type === 'table') {
				if (!source.tableId) {
					throw new Error('Table ID is required when type="table"');
				}
				tableId = parseInt(source.tableId);
				endpoint = `/tables/${tableId}/rows`;
			} else if (source.type === 'view') {
				if (!source.viewId) {
					throw new Error('View ID is required when type="view"');
				}
				const viewId = parseInt(source.viewId);
				endpoint = `/views/${viewId}/rows`;

				// For views, we need to determine the table ID
				const view = await ApiHelper.makeApiRequest<any>(
					context,
					'GET',
					`/views/${viewId}`,
				);
				tableId = view.tableId;
			} else {
				throw new Error(`Invalid source type: ${source.type}`);
			}

			// Extract row data
			const rowDataConfig = context.getNodeParameter('rowDataConfig', itemIndex) as {
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
				throw new Error('At least one column with data is required');
			}

			// Convert AI-Friendly format to Nextcloud API format
			const data: Record<string, any> = {};
			for (const columnEntry of rowDataConfig.data.columns) {
				if (columnEntry.column?.columnId) {
					data[columnEntry.column.columnId] = columnEntry.column.value || '';
				}
			}

			// Create row
			const response = await ApiHelper.makeApiRequest<Row>(context, 'POST', endpoint, {
				data,
			});

			// Format output with column information
			const columns = await ApiHelper.getTableColumns(context, tableId);
			return this.formatRowForOutput(response, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * AI-Friendly get all rows with advanced options
	 * All filter/sorting/search parameters available at once
	 */
	private static async getAllAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<Row[]> {
		try {
			// Extract source configuration
			const sourceConfig = context.getNodeParameter('sourceConfig', itemIndex) as {
				source?: {
					type: 'table' | 'view';
					tableId?: string;
					viewId?: string;
				};
			};

			if (!sourceConfig?.source) {
				throw new Error('Source configuration is required');
			}

			const { source } = sourceConfig;
			let endpoint: string;
			let tableId: number;

			// Determine API endpoint based on source type
			if (source.type === 'table') {
				if (!source.tableId) {
					throw new Error('Table ID is required when type="table"');
				}
				tableId = parseInt(source.tableId);
				endpoint = `/tables/${tableId}/rows`;
			} else if (source.type === 'view') {
				if (!source.viewId) {
					throw new Error('View ID is required when type="view"');
				}
				const viewId = parseInt(source.viewId);
				endpoint = `/views/${viewId}/rows`;

				// For views, we need to determine the table ID
				const view = await ApiHelper.makeApiRequest<any>(
					context,
					'GET',
					`/views/${viewId}`,
				);
				tableId = view.tableId;
			} else {
				throw new Error(`Invalid source type: ${source.type}`);
			}

			// Extract query options
			const queryConfig = context.getNodeParameter('queryConfig', itemIndex, {}) as {
				query?: {
					pagination?: { settings?: { limit?: number; offset?: number } };
					filters?: Array<{
						filter?: { columnId: string; operator: string; value: string };
					}>;
					sorting?: Array<{ sort?: { columnId: string; direction: 'ASC' | 'DESC' } }>;
					search?: {
						settings?: { term?: string; columns?: string; caseSensitive?: boolean };
					};
				};
			};

			// Build query parameters
			const queryParams: Record<string, string> = {};

			// Pagination
			if (queryConfig.query?.pagination?.settings) {
				const { limit, offset } = queryConfig.query.pagination.settings;
				if (limit !== undefined) queryParams.limit = limit.toString();
				if (offset !== undefined) queryParams.offset = offset.toString();
			} else {
				// Default values
				queryParams.limit = '50';
				queryParams.offset = '0';
			}

			// Filters
			if (queryConfig.query?.filters && queryConfig.query.filters.length > 0) {
				const filters = queryConfig.query.filters
					.map((f) => f.filter)
					.filter((f) => f?.columnId && f?.operator);
				this.applyFilters(queryParams, filters);
			}

			// Sorting
			if (queryConfig.query?.sorting && queryConfig.query.sorting.length > 0) {
				const sorting = queryConfig.query.sorting
					.map((s) => s.sort)
					.filter((s) => s?.columnId && s?.direction);
				this.applySorting(queryParams, sorting);
			}

			// Search
			if (queryConfig.query?.search?.settings?.term) {
				const searchSettings = queryConfig.query.search.settings;
				const search = {
					term: searchSettings.term,
					searchColumns: searchSettings.columns
						? searchSettings.columns.split(',').map((id) => id.trim())
						: [],
					caseSensitive: searchSettings.caseSensitive,
				};
				this.applySearch(queryParams, search);
			}

			// Perform API request - with useQueryParams = true
			const rows = await ApiHelper.makeApiRequest<Row[]>(
				context,
				'GET',
				endpoint,
				queryParams,
				true, // useQueryParams for GET request
			);

			// Load column info for better data formatting
			const columns = await ApiHelper.getTableColumns(context, tableId);

			// Client-side post-processing if needed
			let processedRows = rows;

			// Client-side filtering if server API doesn't support all filters
			if (queryConfig.query?.filters && queryConfig.query.filters.length > 0) {
				const filters = queryConfig.query.filters
					.map((f) => f.filter)
					.filter((f) => f?.columnId && f?.operator);
				processedRows = this.applyClientSideFilters(processedRows, filters, columns);
			}

			// Client-side search if server API doesn't support all search options
			if (queryConfig.query?.search?.settings?.term) {
				const searchSettings = queryConfig.query.search.settings;
				const search = {
					term: searchSettings.term,
					searchColumns: searchSettings.columns
						? searchSettings.columns.split(',').map((id) => id.trim())
						: [],
					caseSensitive: searchSettings.caseSensitive,
				};
				processedRows = this.applyClientSideSearch(processedRows, search, columns);
			}

			// Format rows for better readability
			return this.formatRowsForOutput(processedRows, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * AI-Friendly update row
	 * All parameters available at once through fixedCollection
	 */
	private static async updateAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<Row> {
		try {
			// Extract update configuration
			const updateDataConfig = context.getNodeParameter('updateDataConfig', itemIndex) as {
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
				throw new Error('Update configuration is required');
			}

			const { update } = updateDataConfig;

			if (!update.rowId) {
				throw new Error('Row ID is required');
			}

			if (!update.tableId) {
				throw new Error('Table ID is required');
			}

			if (!update.columns || update.columns.length === 0) {
				throw new Error('At least one column with data is required');
			}

			const tableId = parseInt(update.tableId);
			const rowId = parseInt(update.rowId);

			// Convert AI-Friendly format to Nextcloud API format
			const data: Record<string, any> = {};
			for (const columnEntry of update.columns) {
				if (columnEntry.column?.columnId) {
					data[columnEntry.column.columnId] = columnEntry.column.value || '';
				}
			}

			// Update row
			const endpoint = `/tables/${tableId}/rows/${rowId}`;
			const response = await ApiHelper.makeApiRequest<Row>(context, 'PUT', endpoint, {
				data,
			});

			// Format output with column information
			const columns = await ApiHelper.getTableColumns(context, tableId);
			return this.formatRowForOutput(response, columns);
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}
}

