import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Column } from '../interfaces';

export class ColumnHandler {
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
			case 'update':
				return this.update(context, itemIndex);
			case 'updateAIFriendly':
				return this.updateAIFriendly(context, itemIndex);
			case 'delete':
				return this.delete(context, itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Fetch all columns of a table
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Column[]> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));

		return ApiHelper.makeApiRequest<Column[]>(context, 'GET', `/tables/${tableId}/columns`);
	}

	/**
	 * Fetch a specific column
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Column> {
		const columnId = ApiHelper.getResourceId(context.getNodeParameter('columnId', itemIndex));

		return ApiHelper.makeApiRequest<Column>(context, 'GET', `/columns/${columnId}`);
	}

	/**
	 * Create a new column
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<Column> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const type = context.getNodeParameter('type', itemIndex) as string;
		const title = context.getNodeParameter('title', itemIndex) as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;
		const mandatory = context.getNodeParameter('mandatory', itemIndex, false) as boolean;

		const body: any = {
			type,
			title,
			mandatory,
		};

		if (description) {
			body.description = description;
		}

		// Add type-specific parameters
		switch (type) {
			case 'text':
				this.addTextParameters(context, itemIndex, body);
				break;
			case 'number':
				this.addNumberParameters(context, itemIndex, body);
				break;
			case 'datetime':
				this.addDateTimeParameters(context, itemIndex, body);
				break;
			case 'selection':
				this.addSelectionParameters(context, itemIndex, body);
				break;
			case 'usergroup':
				this.addUserGroupParameters(context, itemIndex, body);
				break;
		}

		// Use API v1 with query parameters (like community solution)
		return ApiHelper.makeApiRequest<Column>(
			context,
			'POST',
			`/tables/${tableId}/columns`,
			body,
			true, // useQueryParams = true
		);
	}

	/**
	 * Create a new column (AI-Friendly version)
	 * All parameters available directly without nested structures
	 */
	private static async createAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<Column> {
		const tableIdAI = context.getNodeParameter('tableIdAI', itemIndex, '') as string;

		// Validation: tableIdAI is required for createAIFriendly
		if (!tableIdAI) {
			throw new Error('tableIdAI is required for createAIFriendly operation');
		}

		const tableId = ApiHelper.getResourceId(tableIdAI);

		// Retrieve base parameters directly (all always available)
		const type = context.getNodeParameter('columnType', itemIndex) as string;
		const title = context.getNodeParameter('columnTitle', itemIndex) as string;
		const description = context.getNodeParameter('columnDescription', itemIndex, '') as string;
		const mandatory = context.getNodeParameter('columnMandatory', itemIndex, false) as boolean;

		if (!type || !title) {
			throw new Error('Spaltentyp und Titel sind erforderlich');
		}

		const body: any = {
			type,
			title,
			mandatory,
		};

		if (description) {
			body.description = description;
		}

		// Add type-specific parameters directly from flat parameters
		// AI agent can see all parameters but only relevant ones are used
		switch (type) {
			case 'text':
				this.addTextParametersAIFriendly(context, itemIndex, body);
				break;
			case 'number':
				this.addNumberParametersAIFriendly(context, itemIndex, body);
				break;
			case 'datetime':
				this.addDateTimeParametersAIFriendly(context, itemIndex, body);
				break;
			case 'selection':
				this.addSelectionParametersAIFriendly(context, itemIndex, body);
				break;
			case 'usergroup':
				this.addUserGroupParametersAIFriendly(context, itemIndex, body);
				break;
		}

		// Use API v1 with query parameters (like community solution)
		return ApiHelper.makeApiRequest<Column>(
			context,
			'POST',
			`/tables/${tableId}/columns`,
			body,
			true, // useQueryParams = true
		);
	}

	/**
	 * Update a column
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<Column> {
		const columnId = ApiHelper.getResourceId(context.getNodeParameter('columnId', itemIndex));
		const title = context.getNodeParameter('title', itemIndex, '') as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;
		const mandatory = context.getNodeParameter('mandatory', itemIndex) as boolean;

		const body: any = {};

		if (title) {
			body.title = title;
		}

		if (description !== undefined) {
			body.description = description;
		}

		if (mandatory !== undefined) {
			body.mandatory = mandatory;
		}

		// Only update if there are changes
		if (Object.keys(body).length === 0) {
			throw new Error('At least one field must be specified for update');
		}

		return ApiHelper.makeApiRequest<Column>(context, 'PUT', `/columns/${columnId}`, body);
	}

	/**
	 * Delete a column
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<{ success: boolean; message?: string }> {
		const columnId = ApiHelper.getResourceId(context.getNodeParameter('columnId', itemIndex));

		await ApiHelper.makeApiRequest(context, 'DELETE', `/columns/${columnId}`);

		return { success: true, message: `Column ${columnId} was successfully deleted` };
	}

	/**
	 * Fully update a column (AI-Friendly version)
	 * All parameters available directly; AI can change type and all properties
	 */
	private static async updateAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<Column> {
		const columnIdAI = context.getNodeParameter('columnIdAI', itemIndex, '') as string;

		// Validation: columnIdAI is required for updateAIFriendly
		if (!columnIdAI) {
			throw new Error('columnIdAI is required for updateAIFriendly operation');
		}

		const columnId = ApiHelper.getResourceId(columnIdAI);

		// Retrieve base parameters directly (all always available)
		const type = context.getNodeParameter('columnType', itemIndex, '') as string;
		const title = context.getNodeParameter('columnTitle', itemIndex, '') as string;
		const description = context.getNodeParameter('columnDescription', itemIndex, '') as string;
		const mandatory = context.getNodeParameter('columnMandatory', itemIndex, false) as boolean;

		const body: any = {};

		// Only set what was actually provided
		if (type) {
			body.type = type;
		}

		if (title) {
			body.title = title;
		}

		if (description !== undefined) {
			body.description = description;
		}

		if (mandatory !== undefined) {
			body.mandatory = mandatory;
		}

		// Add type-specific parameters directly from flat parameters
		// But only if a type is set
		if (type) {
			switch (type) {
				case 'text':
					this.addTextParametersAIFriendly(context, itemIndex, body);
					break;
				case 'number':
					this.addNumberParametersAIFriendly(context, itemIndex, body);
					break;
				case 'datetime':
					this.addDateTimeParametersAIFriendly(context, itemIndex, body);
					break;
				case 'selection':
					this.addSelectionParametersAIFriendly(context, itemIndex, body);
					break;
				case 'usergroup':
					this.addUserGroupParametersAIFriendly(context, itemIndex, body);
					break;
			}
		}

		// Improved validation: At least one meaningful field must be specified for update
		if (Object.keys(body).length === 0) {
			throw new Error(
				'At least one field must be specified for update (type, title, description, mandatory or type-specific parameters)',
			);
		}

		// Additional validation: On type change, at least one type-specific parameter should also be set
		if (type && !title && Object.keys(body).length === 1) {
			throw new Error(
				'On a type change, at least the title or type-specific parameters should be provided',
			);
		}

		return ApiHelper.makeApiRequest<Column>(context, 'PUT', `/columns/${columnId}`, body);
	}

	/**
	 * Add text-specific parameters
	 */
	private static addTextParameters(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		// CRITICAL: subtype is required for text columns!
		const subtype = context.getNodeParameter('subtype', itemIndex, 'line') as string;
		const textDefault = context.getNodeParameter('textDefault', itemIndex, '') as string;
		const textMaxLength = context.getNodeParameter('textMaxLength', itemIndex, null) as
			| number
			| null;
		const textAllowedPattern = context.getNodeParameter(
			'textAllowedPattern',
			itemIndex,
			'',
		) as string;

		// Subtype is required for the API
		body.subtype = subtype;

		if (textDefault) {
			body.textDefault = textDefault;
		}

		if (textMaxLength && textMaxLength > 0) {
			body.textMaxLength = textMaxLength;
		}

		if (textAllowedPattern) {
			body.textAllowedPattern = textAllowedPattern;
		}
	}

	/**
	 * Add number-specific parameters
	 */
	private static addNumberParameters(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const numberDefault = context.getNodeParameter('numberDefault', itemIndex, null) as
			| number
			| null;
		const numberMin = context.getNodeParameter('numberMin', itemIndex, null) as number | null;
		const numberMax = context.getNodeParameter('numberMax', itemIndex, null) as number | null;
		const numberDecimals = context.getNodeParameter('numberDecimals', itemIndex, 0) as number;
		const numberPrefix = context.getNodeParameter('numberPrefix', itemIndex, '') as string;
		const numberSuffix = context.getNodeParameter('numberSuffix', itemIndex, '') as string;

		if (numberDefault !== null) {
			body.numberDefault = numberDefault;
		}

		if (numberMin !== null) {
			body.numberMin = numberMin;
		}

		if (numberMax !== null) {
			body.numberMax = numberMax;
		}

		if (numberDecimals >= 0) {
			body.numberDecimals = numberDecimals;
		}

		if (numberPrefix) {
			body.numberPrefix = numberPrefix;
		}

		if (numberSuffix) {
			body.numberSuffix = numberSuffix;
		}
	}

	/**
	 * Add datetime-specific parameters
	 */
	private static addDateTimeParameters(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const datetimeDefault = context.getNodeParameter(
			'datetimeDefault',
			itemIndex,
			'',
		) as string;

		if (datetimeDefault) {
			body.datetimeDefault = datetimeDefault;
		}
	}

	/**
	 * Add selection-specific parameters
	 */
	private static addSelectionParameters(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const selectionOptions = context.getNodeParameter(
			'selectionOptions',
			itemIndex,
			'',
		) as string;
		const selectionDefault = context.getNodeParameter(
			'selectionDefault',
			itemIndex,
			'',
		) as string;

		if (selectionOptions) {
			// Convert options to JSON array format
			const options = selectionOptions.split('\n').filter((line) => line.trim() !== '');
			body.selectionOptions = JSON.stringify(options);
		}

		if (selectionDefault) {
			body.selectionDefault = selectionDefault;
		}
	}

	/**
	 * Add usergroup-specific parameters
	 */
	private static addUserGroupParameters(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const usergroupDefault = context.getNodeParameter(
			'usergroupDefault',
			itemIndex,
			'',
		) as string;
		const usergroupMultipleItems = context.getNodeParameter(
			'usergroupMultipleItems',
			itemIndex,
			false,
		) as boolean;
		const usergroupSelectUsers = context.getNodeParameter(
			'usergroupSelectUsers',
			itemIndex,
			true,
		) as boolean;
		const usergroupSelectGroups = context.getNodeParameter(
			'usergroupSelectGroups',
			itemIndex,
			true,
		) as boolean;
		const usergroupSelectTeams = context.getNodeParameter(
			'usergroupSelectTeams',
			itemIndex,
			false,
		) as boolean;
		const showUserStatus = context.getNodeParameter(
			'showUserStatus',
			itemIndex,
			false,
		) as boolean;

		if (usergroupDefault) {
			body.usergroupDefault = usergroupDefault;
		}

		body.usergroupMultipleItems = usergroupMultipleItems;
		body.usergroupSelectUsers = usergroupSelectUsers;
		body.usergroupSelectGroups = usergroupSelectGroups;
		body.usergroupSelectTeams = usergroupSelectTeams;
		body.showUserStatus = showUserStatus;
	}

	/**
	 * Extract text-specific parameters from fixedCollection
	 */
	private static addTextParametersFromConfig(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const textConfig = context.getNodeParameter('textConfig.settings', itemIndex, {}) as any;

		// Subtype is required for the API
		body.subtype = textConfig.subtype || 'line';

		if (textConfig.textDefault) {
			body.textDefault = textConfig.textDefault;
		}

		if (textConfig.textMaxLength && textConfig.textMaxLength > 0) {
			body.textMaxLength = textConfig.textMaxLength;
		}

		if (textConfig.textAllowedPattern) {
			body.textAllowedPattern = textConfig.textAllowedPattern;
		}
	}

	/**
	 * Extract number-specific parameters from fixedCollection
	 */
	private static addNumberParametersFromConfig(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const numberConfig = context.getNodeParameter(
			'numberConfig.settings',
			itemIndex,
			{},
		) as any;

		if (numberConfig.numberDefault !== undefined && numberConfig.numberDefault !== null) {
			body.numberDefault = numberConfig.numberDefault;
		}

		if (numberConfig.numberMin !== undefined && numberConfig.numberMin !== null) {
			body.numberMin = numberConfig.numberMin;
		}

		if (numberConfig.numberMax !== undefined && numberConfig.numberMax !== null) {
			body.numberMax = numberConfig.numberMax;
		}

		if (numberConfig.numberDecimals !== undefined && numberConfig.numberDecimals >= 0) {
			body.numberDecimals = numberConfig.numberDecimals;
		}

		if (numberConfig.numberPrefix) {
			body.numberPrefix = numberConfig.numberPrefix;
		}

		if (numberConfig.numberSuffix) {
			body.numberSuffix = numberConfig.numberSuffix;
		}
	}

	/**
	 * Extract datetime-specific parameters from fixedCollection
	 */
	private static addDateTimeParametersFromConfig(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const datetimeConfig = context.getNodeParameter(
			'datetimeConfig.settings',
			itemIndex,
			{},
		) as any;

		if (datetimeConfig.datetimeDefault) {
			body.datetimeDefault = datetimeConfig.datetimeDefault;
		}
	}

	/**
	 * Extract selection-specific parameters from fixedCollection
	 */
	private static addSelectionParametersFromConfig(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const selectionConfig = context.getNodeParameter(
			'selectionConfig.settings',
			itemIndex,
			{},
		) as any;

		if (selectionConfig.selectionOptions) {
			// Convert options to JSON array format
			const options = selectionConfig.selectionOptions
				.split('\n')
				.filter((line: string) => line.trim() !== '');
			body.selectionOptions = JSON.stringify(options);
		}

		if (selectionConfig.selectionDefault) {
			body.selectionDefault = selectionConfig.selectionDefault;
		}
	}

	/**
	 * Extract usergroup-specific parameters from fixedCollection
	 */
	private static addUserGroupParametersFromConfig(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const usergroupConfig = context.getNodeParameter(
			'usergroupConfig.settings',
			itemIndex,
			{},
		) as any;

		if (usergroupConfig.usergroupDefault) {
			body.usergroupDefault = usergroupConfig.usergroupDefault;
		}

		body.usergroupMultipleItems = usergroupConfig.usergroupMultipleItems || false;
		body.usergroupSelectUsers =
			usergroupConfig.usergroupSelectUsers !== undefined
				? usergroupConfig.usergroupSelectUsers
				: true;
		body.usergroupSelectGroups =
			usergroupConfig.usergroupSelectGroups !== undefined
				? usergroupConfig.usergroupSelectGroups
				: true;
		body.usergroupSelectTeams = usergroupConfig.usergroupSelectTeams || false;
		body.showUserStatus = usergroupConfig.showUserStatus || false;
	}

	// =======================================================
	// AI-FRIENDLY parameter methods (flat structure)
	// =======================================================

	/**
	 * Text-specific parameters for AI-Friendly version (flat parameters)
	 */
	private static addTextParametersAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const subtype = context.getNodeParameter('textSubtypeAI', itemIndex, 'line') as string;
		const textDefault = context.getNodeParameter('textDefaultAI', itemIndex, '') as string;
		const textMaxLength = context.getNodeParameter('textMaxLengthAI', itemIndex, 255) as number;
		const textPattern = context.getNodeParameter('textPatternAI', itemIndex, '') as string;

		// Subtype is required for the API
		body.subtype = subtype;

		if (textDefault) {
			body.textDefault = textDefault;
		}

		if (textMaxLength && textMaxLength > 0) {
			body.textMaxLength = textMaxLength;
		}

		if (textPattern) {
			body.textAllowedPattern = textPattern;
		}
	}

	/**
	 * Number-specific parameters for AI-Friendly version (flat parameters)
	 */
	private static addNumberParametersAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const numberDefault = context.getNodeParameter('numberDefaultAI', itemIndex, 0) as number;
		const numberMin = context.getNodeParameter('numberMinAI', itemIndex, null) as number | null;
		const numberMax = context.getNodeParameter('numberMaxAI', itemIndex, null) as number | null;
		const numberDecimals = context.getNodeParameter('numberDecimalsAI', itemIndex, 0) as number;
		const numberPrefix = context.getNodeParameter('numberPrefixAI', itemIndex, '') as string;
		const numberSuffix = context.getNodeParameter('numberSuffixAI', itemIndex, '') as string;

		if (numberDefault !== undefined && numberDefault !== null) {
			body.numberDefault = numberDefault;
		}

		if (numberMin !== undefined && numberMin !== null) {
			body.numberMin = numberMin;
		}

		if (numberMax !== undefined && numberMax !== null) {
			body.numberMax = numberMax;
		}

		if (numberDecimals !== undefined && numberDecimals >= 0) {
			body.numberDecimals = numberDecimals;
		}

		if (numberPrefix) {
			body.numberPrefix = numberPrefix;
		}

		if (numberSuffix) {
			body.numberSuffix = numberSuffix;
		}
	}

	/**
	 * Datetime-specific parameters for AI-Friendly version (flat parameters)
	 */
	private static addDateTimeParametersAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const datetimeDefault = context.getNodeParameter(
			'datetimeDefaultAI',
			itemIndex,
			'',
		) as string;

		if (datetimeDefault) {
			body.datetimeDefault = datetimeDefault;
		}
	}

	/**
	 * Selection-specific parameters for AI-Friendly version (flat parameters)
	 */
	private static addSelectionParametersAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const selectionOptions = context.getNodeParameter(
			'selectionOptionsAI',
			itemIndex,
			'',
		) as string;
		const selectionDefault = context.getNodeParameter(
			'selectionDefaultAI',
			itemIndex,
			'',
		) as string;
		const selectionMultiple = context.getNodeParameter(
			'selectionMultipleAI',
			itemIndex,
			false,
		) as boolean;

		if (selectionOptions) {
			try {
				// KI Agent gibt JSON-Array als String
				const options = JSON.parse(selectionOptions);
				if (Array.isArray(options)) {
					body.selectionOptions = JSON.stringify(options);
				} else {
					throw new Error('selectionOptionsAI must be a JSON array');
				}
			} catch (error) {
				throw new Error(`Invalid JSON in selectionOptionsAI: ${error.message}`);
			}
		}

		if (selectionDefault) {
			body.selectionDefault = selectionDefault;
		}

		if (selectionMultiple !== undefined) {
			body.selectionMultiple = selectionMultiple;
		}
	}

	/**
	 * Usergroup-specific parameters for AI-Friendly version (flat parameters)
	 */
	private static addUserGroupParametersAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
		body: any,
	): void {
		const usergroupType = context.getNodeParameter(
			'usergroupTypeAI',
			itemIndex,
			'user',
		) as string;
		const usergroupDefault = context.getNodeParameter(
			'usergroupDefaultAI',
			itemIndex,
			'',
		) as string;
		const usergroupMultiple = context.getNodeParameter(
			'usergroupMultipleAI',
			itemIndex,
			false,
		) as boolean;

		if (usergroupDefault) {
			body.usergroupDefault = usergroupDefault;
		}

		// Basierend auf usergroupType die entsprechenden Flags setzen
		body.usergroupMultipleItems = usergroupMultiple;

		if (usergroupType === 'user') {
			body.usergroupSelectUsers = true;
			body.usergroupSelectGroups = false;
		} else if (usergroupType === 'group') {
			body.usergroupSelectUsers = false;
			body.usergroupSelectGroups = true;
		} else {
			// Fallback: beide erlauben
			body.usergroupSelectUsers = true;
			body.usergroupSelectGroups = true;
		}

		// Standardwerte für andere Optionen
		body.usergroupSelectTeams = false;
		body.showUserStatus = false;
	}
}

