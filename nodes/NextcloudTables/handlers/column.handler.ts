import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Column } from '../interfaces';

export class ColumnHandler {
	static async execute(context: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
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
			case 'delete':
				return this.delete(context, itemIndex);
			default:
				throw new Error(`Unbekannte Operation: ${operation}`);
		}
	}

	/**
	 * Alle Spalten einer Tabelle abrufen
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Column[]> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		
		return ApiHelper.makeApiRequest<Column[]>(
			context,
			'GET',
			`/tables/${tableId}/columns`,
		);
	}

	/**
	 * Eine spezifische Spalte abrufen
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Column> {
		const columnId = ApiHelper.getResourceId(context.getNodeParameter('columnId', itemIndex));
		
		return ApiHelper.makeApiRequest<Column>(
			context,
			'GET',
			`/columns/${columnId}`,
		);
	}

	/**
	 * Eine neue Spalte erstellen
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

		// Typ-spezifische Parameter hinzufügen
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

		// API v1 mit Query-Parametern verwenden (wie in Community-Lösung)
		return ApiHelper.makeApiRequest<Column>(
			context,
			'POST',
			`/tables/${tableId}/columns`,
			body,
			true, // useQueryParams = true
		);
	}

	/**
	 * Eine neue Spalte erstellen (KI-Friendly Version) 
	 * Alle Parameter sind direkt verfügbar ohne verschachtelte Strukturen
	 */
	private static async createAIFriendly(context: IExecuteFunctions, itemIndex: number): Promise<Column> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableIdAI', itemIndex));
		
		// Basis-Parameter direkt abrufen (alle immer verfügbar)
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

		// Typ-spezifische Parameter direkt aus den flachen Parametern hinzufügen
		// KI Agent kann alle Parameter sehen, aber nur die relevanten werden verwendet
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

		// API v1 mit Query-Parametern verwenden (wie in Community-Lösung)
		return ApiHelper.makeApiRequest<Column>(
			context,
			'POST',
			`/tables/${tableId}/columns`,
			body,
			true, // useQueryParams = true
		);
	}

	/**
	 * Eine Spalte aktualisieren
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

		// Nur aktualisieren, wenn es Änderungen gibt
		if (Object.keys(body).length === 0) {
			throw new Error('Mindestens ein Feld muss für die Aktualisierung angegeben werden');
		}

		return ApiHelper.makeApiRequest<Column>(
			context,
			'PUT',
			`/columns/${columnId}`,
			body,
		);
	}

	/**
	 * Eine Spalte löschen
	 */
	private static async delete(context: IExecuteFunctions, itemIndex: number): Promise<{ success: boolean; message?: string }> {
		const columnId = ApiHelper.getResourceId(context.getNodeParameter('columnId', itemIndex));

		await ApiHelper.makeApiRequest(
			context,
			'DELETE',
			`/columns/${columnId}`,
		);

		return { success: true, message: `Spalte ${columnId} wurde erfolgreich gelöscht` };
	}

	/**
	 * Text-spezifische Parameter hinzufügen
	 */
	private static addTextParameters(context: IExecuteFunctions, itemIndex: number, body: any): void {
		// KRITISCH: subtype ist für Text-Spalten erforderlich!
		const subtype = context.getNodeParameter('subtype', itemIndex, 'line') as string;
		const textDefault = context.getNodeParameter('textDefault', itemIndex, '') as string;
		const textMaxLength = context.getNodeParameter('textMaxLength', itemIndex, null) as number | null;
		const textAllowedPattern = context.getNodeParameter('textAllowedPattern', itemIndex, '') as string;

		// Subtype ist erforderlich für die API
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
	 * Number-spezifische Parameter hinzufügen
	 */
	private static addNumberParameters(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const numberDefault = context.getNodeParameter('numberDefault', itemIndex, null) as number | null;
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
	 * DateTime-spezifische Parameter hinzufügen
	 */
	private static addDateTimeParameters(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const datetimeDefault = context.getNodeParameter('datetimeDefault', itemIndex, '') as string;

		if (datetimeDefault) {
			body.datetimeDefault = datetimeDefault;
		}
	}

	/**
	 * Selection-spezifische Parameter hinzufügen
	 */
	private static addSelectionParameters(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const selectionOptions = context.getNodeParameter('selectionOptions', itemIndex, '') as string;
		const selectionDefault = context.getNodeParameter('selectionDefault', itemIndex, '') as string;

		if (selectionOptions) {
			// Optionen in Format konvertieren: Zeilen in JSON-Array
			const options = selectionOptions.split('\n').filter(line => line.trim() !== '');
			body.selectionOptions = JSON.stringify(options);
		}

		if (selectionDefault) {
			body.selectionDefault = selectionDefault;
		}
	}

	/**
	 * UserGroup-spezifische Parameter hinzufügen
	 */
	private static addUserGroupParameters(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const usergroupDefault = context.getNodeParameter('usergroupDefault', itemIndex, '') as string;
		const usergroupMultipleItems = context.getNodeParameter('usergroupMultipleItems', itemIndex, false) as boolean;
		const usergroupSelectUsers = context.getNodeParameter('usergroupSelectUsers', itemIndex, true) as boolean;
		const usergroupSelectGroups = context.getNodeParameter('usergroupSelectGroups', itemIndex, true) as boolean;
		const usergroupSelectTeams = context.getNodeParameter('usergroupSelectTeams', itemIndex, false) as boolean;
		const showUserStatus = context.getNodeParameter('showUserStatus', itemIndex, false) as boolean;

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
	 * Text-spezifische Parameter aus fixedCollection extrahieren
	 */
	private static addTextParametersFromConfig(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const textConfig = context.getNodeParameter('textConfig.settings', itemIndex, {}) as any;
		
		// Subtype ist erforderlich für die API
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
	 * Number-spezifische Parameter aus fixedCollection extrahieren
	 */
	private static addNumberParametersFromConfig(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const numberConfig = context.getNodeParameter('numberConfig.settings', itemIndex, {}) as any;

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
	 * DateTime-spezifische Parameter aus fixedCollection extrahieren
	 */
	private static addDateTimeParametersFromConfig(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const datetimeConfig = context.getNodeParameter('datetimeConfig.settings', itemIndex, {}) as any;

		if (datetimeConfig.datetimeDefault) {
			body.datetimeDefault = datetimeConfig.datetimeDefault;
		}
	}

	/**
	 * Selection-spezifische Parameter aus fixedCollection extrahieren
	 */
	private static addSelectionParametersFromConfig(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const selectionConfig = context.getNodeParameter('selectionConfig.settings', itemIndex, {}) as any;

		if (selectionConfig.selectionOptions) {
			// Optionen in Format konvertieren: Zeilen in JSON-Array
			const options = selectionConfig.selectionOptions.split('\n').filter((line: string) => line.trim() !== '');
			body.selectionOptions = JSON.stringify(options);
		}

		if (selectionConfig.selectionDefault) {
			body.selectionDefault = selectionConfig.selectionDefault;
		}
	}

	/**
	 * UserGroup-spezifische Parameter aus fixedCollection extrahieren
	 */
	private static addUserGroupParametersFromConfig(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const usergroupConfig = context.getNodeParameter('usergroupConfig.settings', itemIndex, {}) as any;

		if (usergroupConfig.usergroupDefault) {
			body.usergroupDefault = usergroupConfig.usergroupDefault;
		}

		body.usergroupMultipleItems = usergroupConfig.usergroupMultipleItems || false;
		body.usergroupSelectUsers = usergroupConfig.usergroupSelectUsers !== undefined ? usergroupConfig.usergroupSelectUsers : true;
		body.usergroupSelectGroups = usergroupConfig.usergroupSelectGroups !== undefined ? usergroupConfig.usergroupSelectGroups : true;
		body.usergroupSelectTeams = usergroupConfig.usergroupSelectTeams || false;
		body.showUserStatus = usergroupConfig.showUserStatus || false;
	}

	// =======================================================
	// AI-FRIENDLY Parameter-Methoden (flache Struktur)
	// =======================================================

	/**
	 * Text-spezifische Parameter für AI-Friendly Version (flache Parameter)
	 */
	private static addTextParametersAIFriendly(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const subtype = context.getNodeParameter('textSubtype', itemIndex, 'line') as string;
		const textDefault = context.getNodeParameter('textDefault', itemIndex, '') as string;
		const textMaxLength = context.getNodeParameter('textMaxLength', itemIndex, 255) as number;
		const textPattern = context.getNodeParameter('textPattern', itemIndex, '') as string;

		// Subtype ist erforderlich für die API
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
	 * Number-spezifische Parameter für AI-Friendly Version (flache Parameter)
	 */
	private static addNumberParametersAIFriendly(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const numberDefault = context.getNodeParameter('numberDefault', itemIndex, 0) as number;
		const numberMin = context.getNodeParameter('numberMin', itemIndex, null) as number | null;
		const numberMax = context.getNodeParameter('numberMax', itemIndex, null) as number | null;
		const numberDecimals = context.getNodeParameter('numberDecimals', itemIndex, 0) as number;
		const numberPrefix = context.getNodeParameter('numberPrefix', itemIndex, '') as string;
		const numberSuffix = context.getNodeParameter('numberSuffix', itemIndex, '') as string;

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
	 * DateTime-spezifische Parameter für AI-Friendly Version (flache Parameter)
	 */
	private static addDateTimeParametersAIFriendly(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const datetimeDefault = context.getNodeParameter('datetimeDefault', itemIndex, '') as string;

		if (datetimeDefault) {
			body.datetimeDefault = datetimeDefault;
		}
	}

	/**
	 * Selection-spezifische Parameter für AI-Friendly Version (flache Parameter)
	 */
	private static addSelectionParametersAIFriendly(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const selectionOptions = context.getNodeParameter('selectionOptions', itemIndex, '') as string;
		const selectionDefault = context.getNodeParameter('selectionDefault', itemIndex, '') as string;
		const selectionMultiple = context.getNodeParameter('selectionMultiple', itemIndex, false) as boolean;

		if (selectionOptions) {
			try {
				// KI Agent gibt JSON-Array als String
				const options = JSON.parse(selectionOptions);
				if (Array.isArray(options)) {
					body.selectionOptions = JSON.stringify(options);
				} else {
					throw new Error('selectionOptions muss ein JSON-Array sein');
				}
			} catch (error) {
				throw new Error(`Ungültiges JSON in selectionOptions: ${error.message}`);
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
	 * UserGroup-spezifische Parameter für AI-Friendly Version (flache Parameter)
	 */
	private static addUserGroupParametersAIFriendly(context: IExecuteFunctions, itemIndex: number, body: any): void {
		const usergroupType = context.getNodeParameter('usergroupType', itemIndex, 'user') as string;
		const usergroupDefault = context.getNodeParameter('usergroupDefault', itemIndex, '') as string;
		const usergroupMultiple = context.getNodeParameter('usergroupMultiple', itemIndex, false) as boolean;

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