import { Column } from '../interfaces';

export interface FormatOptions {
	columns?: Column[];
	dateTimeFormat?: string;
	timezone?: string;
	validateSelections?: boolean;
	resolveUserGroups?: boolean;
}

/**
 * Data formatter for Nextcloud Tables row data
 */
export class DataFormatter {
	/**
	 * Formats row data based on column types
	 */
	static formatRowData(
		data: Record<string, any>,
		columns?: Column[],
		options: FormatOptions = {},
	): Record<string, any> {
		const formattedData: Record<string, any> = {};

		for (const [columnKey, value] of Object.entries(data)) {
			// Skip empty values
			if (value === undefined || value === null || value === '') {
				continue;
			}

			const columnId = parseInt(columnKey, 10);
			const column = columns?.find((col) => col.id === columnId);

			if (column) {
				// Specific formatting based on column type
				formattedData[columnKey] = this.formatColumnValue(value, column, options);
			} else {
				// Fallback: basic formatting without column info
				formattedData[columnKey] = this.formatGenericValue(value);
			}
		}

		return formattedData;
	}

	/**
	 * Formats a value based on the column type
	 */
	private static formatColumnValue(value: any, column: Column, options: FormatOptions): any {
		switch (column.type) {
			case 'text':
				return this.formatTextValue(value, column);

			case 'number':
				return this.formatNumberValue(value, column);

			case 'datetime':
				return this.formatDateTimeValue(value, column, options);

			case 'selection':
				return this.formatSelectionValue(value, column, options);

			case 'usergroup':
				return this.formatUserGroupValue(value, column, options);

			case 'file':
				return this.formatFileValue(value, column);

			default:
				return this.formatGenericValue(value);
		}
	}

	/**
	 * Formats text columns
	 */
	private static formatTextValue(value: any, column: Column): string {
		const stringValue = String(value);

		// Check max length
		if (column.textMaxLength && stringValue.length > column.textMaxLength) {
			throw new Error(
				`Text too long: ${stringValue.length} characters, maximum: ${column.textMaxLength}`,
			);
		}

		// Pattern validation
		if (column.textAllowedPattern) {
			const regex = new RegExp(column.textAllowedPattern);
			if (!regex.test(stringValue)) {
				throw new Error(
					`Text does not match the allowed pattern: ${column.textAllowedPattern}`,
				);
			}
		}

		return stringValue;
	}

	/**
	 * Formats number columns
	 */
	private static formatNumberValue(value: any, column: Column): number {
		const numValue = parseFloat(value);

		if (isNaN(numValue)) {
			throw new Error(`Invalid number value: ${value}`);
		}

		// Min/Max checks
		if (
			column.numberMin !== undefined &&
			column.numberMin !== null &&
			numValue < column.numberMin
		) {
			throw new Error(`Number too small: ${numValue}, minimum: ${column.numberMin}`);
		}

		if (
			column.numberMax !== undefined &&
			column.numberMax !== null &&
			numValue > column.numberMax
		) {
			throw new Error(`Number too large: ${numValue}, maximum: ${column.numberMax}`);
		}

		// Decimal places
		if (column.numberDecimals !== undefined) {
			return parseFloat(numValue.toFixed(column.numberDecimals));
		}

		return numValue;
	}

	/**
	 * Formats datetime columns
	 */
	private static formatDateTimeValue(value: any, column: Column, options: FormatOptions): string {
		let dateValue: Date;

		// Handle different input formats
		if (value instanceof Date) {
			dateValue = value;
		} else if (typeof value === 'string') {
			if (/^\d+$/.test(value)) {
				// Unix timestamp
				dateValue = new Date(parseInt(value, 10) * 1000);
			} else {
				dateValue = new Date(value);
			}
		} else if (typeof value === 'number') {
			dateValue = new Date(value > 1e10 ? value : value * 1000);
		} else {
			throw new Error(`Invalid DateTime value: ${value}`);
		}

		if (isNaN(dateValue.getTime())) {
			throw new Error(`Invalid date: ${value}`);
		}

		const format = options.dateTimeFormat || 'iso';

		switch (format) {
			case 'iso':
				return dateValue.toISOString();
			case 'unix':
				return Math.floor(dateValue.getTime() / 1000).toString();
			case 'date':
				return dateValue.toISOString().split('T')[0];
			default:
				return dateValue.toISOString();
		}
	}

	/**
	 * Formats selection columns
	 */
	private static formatSelectionValue(
		value: any,
		column: Column,
		options: FormatOptions,
	): string | string[] {
		if (!value) {
			return column.selectionDefault || '';
		}

		// Validate options if enabled
		if (options.validateSelections && column.selectionOptions) {
			const availableOptions = this.parseSelectionOptions(column.selectionOptions);
			const valueArray = Array.isArray(value) ? value : [value];

			for (const val of valueArray) {
				if (!availableOptions.includes(String(val))) {
					throw new Error(
						`Invalid selection: ${val}. Allowed: ${availableOptions.join(', ')}`,
					);
				}
			}
		}

		if (Array.isArray(value)) {
			return value.map((v) => String(v));
		}

		return String(value);
	}

	/**
	 * Formats user group columns
	 */
	private static formatUserGroupValue(
		value: any,
		column: Column,
		options: FormatOptions,
	): string | string[] {
		if (!value) {
			return column.usergroupDefault || '';
		}

		// TODO: Implement user/group ID resolution if enabled
		if (options.resolveUserGroups) {
			// Would resolve user IDs to usernames here
			// Requires additional API calls
		}

		if (column.usergroupMultipleItems) {
			if (Array.isArray(value)) {
				return value.map((v) => String(v));
			}
			return [String(value)];
		}

		return String(value);
	}

	/**
	 * Formats file columns (for future implementation)
	 */
	private static formatFileValue(value: any, column: Column): any {
		// TODO: Implement file attachment formatting

		if (typeof value === 'string' && value.length > 0) {
			return value;
		}

		if (typeof value === 'object' && value.fileId) {
			return value.fileId;
		}

		return value;
	}

	/**
	 * Generic value formatting without column info
	 */
	private static formatGenericValue(value: any): any {
		if (typeof value === 'string') {
			return value.trim();
		}

		if (typeof value === 'number' || typeof value === 'boolean') {
			return value;
		}

		if (Array.isArray(value)) {
			return value.map((v) => this.formatGenericValue(v));
		}

		if (value instanceof Date) {
			return value.toISOString();
		}

		return value;
	}

	/**
	 * Parses selection options from string
	 */
	private static parseSelectionOptions(optionsString: string): string[] {
		try {
			if (optionsString.startsWith('[') && optionsString.endsWith(']')) {
				return JSON.parse(optionsString);
			}
			return optionsString.split(',').map((opt) => opt.trim());
		} catch (error) {
			return [optionsString];
		}
	}

	/**
	 * Validates bulk row data
	 */
	static validateBulkData(rows: Record<string, any>[], columns?: Column[]): string[] {
		const errors: string[] = [];

		rows.forEach((row, index) => {
			try {
				this.formatRowData(row, columns, { validateSelections: true });
			} catch (error) {
				errors.push(`Row ${index + 1}: ${(error as Error).message}`);
			}
		});

		return errors;
	}

	/**
	 * Converts row data for export
	 */
	static convertForExport(rows: any[], columns?: Column[], format: 'csv' | 'json' = 'json'): any {
		const convertedRows = rows.map((row) => {
			const converted: Record<string, any> = {};

			if (row.data && Array.isArray(row.data)) {
				for (const item of row.data) {
					const column = columns?.find((col) => col.id === item.columnId);
					const columnName = column?.title || `column_${item.columnId}`;

					converted[columnName] = this.convertValueForExport(item.value, column);
				}
			}

			return converted;
		});

		if (format === 'csv') {
			return this.convertToCsv(convertedRows);
		}

		return convertedRows;
	}

	/**
	 * Converts a value for export
	 */
	private static convertValueForExport(value: any, column?: Column): any {
		if (!column) {
			return value;
		}

		switch (column.type) {
			case 'datetime':
				if (value && !isNaN(new Date(value).getTime())) {
					return new Date(value).toLocaleString();
				}
				return value;

			case 'selection':
			case 'usergroup':
				if (Array.isArray(value)) {
					return value.join(', ');
				}
				return value;

			default:
				return value;
		}
	}

	/**
	 * Converts data to CSV format
	 */
	private static convertToCsv(data: Record<string, any>[]): string {
		if (data.length === 0) {
			return '';
		}

		const headers = Object.keys(data[0]);
		const csvRows = [headers.join(',')];

		for (const row of data) {
			const values = headers.map((header) => {
				const value = row[header];
				if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
					return `"${value.replace(/"/g, '""')}"`;
				}
				return value || '';
			});
			csvRows.push(values.join(','));
		}

		return csvRows.join('\n');
	}
}

