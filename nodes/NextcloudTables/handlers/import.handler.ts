import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { ImportState } from '../interfaces';

export class ImportHandler {
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'importCsv':
				return this.importCsv(context, itemIndex);
			case 'getImportStatus':
				return this.getImportStatus(context, itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Import CSV file into a table
	 */
	private static async importCsv(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<ImportState> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const csvFile = context.getNodeParameter('csvFile', itemIndex) as string;
		const importOptions = context.getNodeParameter('importOptions', itemIndex, {}) as any;
		const columnMapping = context.getNodeParameter(
			'columnMapping.mapping',
			itemIndex,
			[],
		) as any[];

		// Validate CSV file
		if (!csvFile || csvFile.trim().length === 0) {
			throw new Error('CSV-Datei darf nicht leer sein');
		}

		// Build import body
		const body: any = {
			file: csvFile.trim(),
		};

		// Add import options
		if (importOptions) {
			// Header row
			if (typeof importOptions.hasHeader === 'boolean') {
				body.hasHeader = importOptions.hasHeader;
			}

			// Delimiter
			if (importOptions.delimiter) {
				if (importOptions.delimiter === 'custom' && importOptions.customDelimiter) {
					body.delimiter = importOptions.customDelimiter;
				} else if (importOptions.delimiter !== 'custom') {
					body.delimiter = importOptions.delimiter;
				}
			}

			// Text qualifier
			if (importOptions.textQualifier) {
				body.textQualifier = importOptions.textQualifier;
			}

			// Additional options
			if (typeof importOptions.skipEmptyRows === 'boolean') {
				body.skipEmptyRows = importOptions.skipEmptyRows;
			}
			if (typeof importOptions.skipInvalidRows === 'boolean') {
				body.skipInvalidRows = importOptions.skipInvalidRows;
			}
		}

		// Add column mapping
		if (columnMapping && columnMapping.length > 0) {
			body.columnMapping = this.buildColumnMapping(columnMapping);
		}

		try {
			const result = await ApiHelper.makeApiRequest<ImportState>(
				context,
				'POST',
				`/tables/${tableId}/import`,
				body,
			);

			return result;
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Error during CSV import: ${apiError.message}`);
		}
	}

	/**
	 * Get status of an import
	 */
	private static async getImportStatus(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<ImportState> {
		const importId = context.getNodeParameter('importId', itemIndex) as string;

		// Validate import ID
		if (!importId || importId.trim().length === 0) {
			throw new Error('Import ID must not be empty');
		}

		try {
			return await ApiHelper.makeApiRequest<ImportState>(
				context,
				'GET',
				`/import/${importId.trim()}`,
			);
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Error retrieving import status: ${apiError.message}`);
		}
	}

	/**
	 * Helper function: build column mapping
	 */
	private static buildColumnMapping(mappings: any[]): Record<string, any> {
		const columnMapping: Record<string, any> = {};

		for (const mapping of mappings) {
			if (mapping.csvColumn && mapping.tableColumn) {
				const csvCol = mapping.csvColumn.trim();
				const tableCol = mapping.tableColumn.trim();

				if (csvCol && tableCol) {
					columnMapping[csvCol] = {
						targetColumn: tableCol,
						dataType: mapping.dataType || 'auto',
					};
				}
			}
		}

		return columnMapping;
	}

	/**
	 * Helper function: validate CSV content
	 */
	private static validateCsvContent(csvContent: string): boolean {
		if (!csvContent || csvContent.trim().length === 0) {
			return false;
		}

		// Basic CSV validation
		const lines = csvContent.trim().split('\n');
		if (lines.length < 1) {
			return false;
		}

		// Check if at least one line has content
		return lines.some((line) => line.trim().length > 0);
	}

	/**
	 * Helper function: validate delimiter
	 */
	private static validateDelimiter(delimiter: string): boolean {
		if (!delimiter) {
			return false;
		}

		// Allowed delimiters
		const allowedDelimiters = [',', ';', '\t', '|'];
		return allowedDelimiters.includes(delimiter) || delimiter.length === 1;
	}

	/**
	 * Helper function: validate import options
	 */
	private static validateImportOptions(options: any): string[] {
		const errors: string[] = [];

		if (options.delimiter === 'custom' && !options.customDelimiter) {
			errors.push('Custom delimiter must be specified');
		}

		if (options.customDelimiter && !this.validateDelimiter(options.customDelimiter)) {
			errors.push('Invalid custom delimiter');
		}

		return errors;
	}

	/**
	 * Helper function: validate column mapping
	 */
	private static validateColumnMapping(mappings: any[]): string[] {
		const errors: string[] = [];
		const usedCsvColumns = new Set<string>();
		const usedTableColumns = new Set<string>();

		for (const mapping of mappings) {
			if (!mapping.csvColumn || !mapping.tableColumn) {
				errors.push('All column mappings must contain both CSV and table columns');
				continue;
			}

			const csvCol = mapping.csvColumn.trim();
			const tableCol = mapping.tableColumn.trim();

			// Check for duplicate CSV columns
			if (usedCsvColumns.has(csvCol)) {
				errors.push(`CSV column "${csvCol}" is used multiple times`);
			}
			usedCsvColumns.add(csvCol);

			// Check for duplicate table columns
			if (usedTableColumns.has(tableCol)) {
				errors.push(`Table column "${tableCol}" is used multiple times`);
			}
			usedTableColumns.add(tableCol);
		}

		return errors;
	}
}

