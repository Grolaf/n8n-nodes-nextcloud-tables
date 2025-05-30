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
} 