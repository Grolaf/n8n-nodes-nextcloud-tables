import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Table } from '../interfaces';

export class TableHandler {
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
			case 'update':
				return this.update(context, itemIndex);
			case 'delete':
				return this.delete(context, itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Fetch all tables
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Table[]> {
		return ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');
	}

	/**
	 * Fetch a specific table
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Table> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));

		return ApiHelper.makeApiRequest<Table>(context, 'GET', `/tables/${tableId}`);
	}

	/**
	 * Create a new table
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<Table> {
		const title = context.getNodeParameter('title', itemIndex) as string;
		const emoji = context.getNodeParameter('emoji', itemIndex, '') as string;
		const template = context.getNodeParameter('template', itemIndex, '') as string;

		const body: any = {
			title,
		};

		if (emoji) {
			body.emoji = emoji;
		}

		if (template) {
			body.template = template;
		}

		return ApiHelper.makeApiRequest<Table>(context, 'POST', '/tables', body);
	}

	/**
	 * Update a table
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<Table> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const title = context.getNodeParameter('title', itemIndex, '') as string;
		const emoji = context.getNodeParameter('emoji', itemIndex, '') as string;
		const archived = context.getNodeParameter('archived', itemIndex, false) as boolean;

		const body: any = {};

		if (title) {
			body.title = title;
		}

		if (emoji !== undefined) {
			body.emoji = emoji;
		}

		if (archived !== undefined) {
			body.archived = archived;
		}

		// Only update if there are changes
		if (Object.keys(body).length === 0) {
			throw new Error('At least one field must be specified for the update');
		}

		return ApiHelper.makeApiRequest<Table>(context, 'PUT', `/tables/${tableId}`, body);
	}

	/**
	 * Delete a table
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<{ success: boolean; message?: string }> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));

		await ApiHelper.makeApiRequest(context, 'DELETE', `/tables/${tableId}`);

		return { success: true, message: `Table ${tableId} was successfully deleted` };
	}
}

