import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { View } from '../interfaces';

export class ViewHandler {
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
	 * Alle Views einer Tabelle abrufen
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<View[]> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		
		return ApiHelper.makeApiRequest<View[]>(
			context,
			'GET',
			`/tables/${tableId}/views`,
		);
	}

	/**
	 * Eine spezifische View abrufen
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<View> {
		const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));
		
		return ApiHelper.makeApiRequest<View>(
			context,
			'GET',
			`/views/${viewId}`,
		);
	}

	/**
	 * Eine neue View erstellen
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<View> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const title = context.getNodeParameter('title', itemIndex) as string;
		const emoji = context.getNodeParameter('emoji', itemIndex, '') as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;
		const filterArray = context.getNodeParameter('filter.rule', itemIndex, []) as any[];
		const sortArray = context.getNodeParameter('sort.rule', itemIndex, []) as any[];

		const body: any = {
			title,
		};

		if (emoji) {
			body.emoji = emoji;
		}

		if (description) {
			body.description = description;
		}

		// Filter formatieren
		if (filterArray && filterArray.length > 0) {
			body.filter = filterArray.map((filter) => ({
				columnId: parseInt(filter.columnId, 10),
				operator: filter.operator,
				value: filter.value,
			}));
		}

		// Sortierung formatieren
		if (sortArray && sortArray.length > 0) {
			body.sort = sortArray.map((sort) => ({
				columnId: parseInt(sort.columnId, 10),
				mode: sort.mode,
			}));
		}

		return ApiHelper.makeApiRequest<View>(
			context,
			'POST',
			`/tables/${tableId}/views`,
			body,
		);
	}

	/**
	 * Eine View aktualisieren
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<View> {
		const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));
		const title = context.getNodeParameter('title', itemIndex, '') as string;
		const emoji = context.getNodeParameter('emoji', itemIndex, '') as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;
		const filterArray = context.getNodeParameter('filter.rule', itemIndex, []) as any[];
		const sortArray = context.getNodeParameter('sort.rule', itemIndex, []) as any[];

		const body: any = {};

		if (title) {
			body.title = title;
		}

		if (emoji !== undefined) {
			body.emoji = emoji;
		}

		if (description !== undefined) {
			body.description = description;
		}

		// Filter formatieren (nur wenn angegeben)
		if (filterArray && filterArray.length > 0) {
			body.filter = filterArray.map((filter) => ({
				columnId: parseInt(filter.columnId, 10),
				operator: filter.operator,
				value: filter.value,
			}));
		}

		// Sortierung formatieren (nur wenn angegeben)
		if (sortArray && sortArray.length > 0) {
			body.sort = sortArray.map((sort) => ({
				columnId: parseInt(sort.columnId, 10),
				mode: sort.mode,
			}));
		}

		// Nur aktualisieren, wenn es Änderungen gibt
		if (Object.keys(body).length === 0) {
			throw new Error('Mindestens ein Feld muss für die Aktualisierung angegeben werden');
		}

		return ApiHelper.makeApiRequest<View>(
			context,
			'PUT',
			`/views/${viewId}`,
			body,
		);
	}

	/**
	 * Eine View löschen
	 */
	private static async delete(context: IExecuteFunctions, itemIndex: number): Promise<{ success: boolean; message?: string }> {
		const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));

		await ApiHelper.makeApiRequest(
			context,
			'DELETE',
			`/views/${viewId}`,
		);

		return { success: true, message: `View ${viewId} wurde erfolgreich gelöscht` };
	}
} 