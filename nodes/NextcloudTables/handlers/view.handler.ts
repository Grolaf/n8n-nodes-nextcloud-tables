import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { View } from '../interfaces';

export class ViewHandler {
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
	 * Fetch all views of a table
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<View[]> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));

		return ApiHelper.makeApiRequest<View[]>(context, 'GET', `/tables/${tableId}/views`);
	}

	/**
	 * Fetch a specific view
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<View> {
		const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));

		return ApiHelper.makeApiRequest<View>(context, 'GET', `/views/${viewId}`);
	}

	/**
	 * Create a new view
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

		// Format filters
		if (filterArray && filterArray.length > 0) {
			body.filter = filterArray.map((filter) => ({
				columnId: parseInt(filter.columnId, 10),
				operator: filter.operator,
				value: filter.value,
			}));
		}

		// Format sorting
		if (sortArray && sortArray.length > 0) {
			body.sort = sortArray.map((sort) => ({
				columnId: parseInt(sort.columnId, 10),
				mode: sort.mode,
			}));
		}

		return ApiHelper.makeApiRequest<View>(context, 'POST', `/tables/${tableId}/views`, body);
	}

	/**
	 * Update a view
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

		// Format filters (only if provided)
		if (filterArray && filterArray.length > 0) {
			body.filter = filterArray.map((filter) => ({
				columnId: parseInt(filter.columnId, 10),
				operator: filter.operator,
				value: filter.value,
			}));
		}

		// Format sorting (only if provided)
		if (sortArray && sortArray.length > 0) {
			body.sort = sortArray.map((sort) => ({
				columnId: parseInt(sort.columnId, 10),
				mode: sort.mode,
			}));
		}

		// Only update if there are changes
		if (Object.keys(body).length === 0) {
			throw new Error('At least one field must be specified for the update');
		}

		return ApiHelper.makeApiRequest<View>(context, 'PUT', `/views/${viewId}`, body);
	}

	/**
	 * Delete a view
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<{ success: boolean; message?: string }> {
		const viewId = ApiHelper.getResourceId(context.getNodeParameter('viewId', itemIndex));

		await ApiHelper.makeApiRequest(context, 'DELETE', `/views/${viewId}`);

		return { success: true, message: `View ${viewId} was successfully deleted` };
	}

	// ==============================================
	// AI-FRIENDLY METHODS - Optimized for AI agents
	// ==============================================

	/**
	 * Create AI-Friendly view
	 * All parameters available via fixedCollection simultaneously
	 */
	private static async createAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<View> {
		try {
			// Extract base configuration
			const viewConfig = context.getNodeParameter('viewConfig', itemIndex) as {
				basic?: {
					title: string;
					tableId: string;
					emoji?: string;
					description?: string;
				};
			};

			if (!viewConfig?.basic) {
				throw new Error('Base configuration is required');
			}

			const { basic } = viewConfig;

			if (!basic.title) {
				throw new Error('Title is required');
			}

			if (!basic.tableId) {
				throw new Error('Table ID is required');
			}

			const tableId = parseInt(basic.tableId);

			// Build base body
			const body: any = {
				title: basic.title,
			};

			if (basic.emoji) {
				body.emoji = basic.emoji;
			}

			if (basic.description) {
				body.description = basic.description;
			}

			// Extract filter configuration
			const filterConfig = context.getNodeParameter('filterConfig', itemIndex, {}) as {
				rules?: {
					filters?: Array<{
						filter?: {
							columnId: string;
							operator: string;
							value: string;
						};
					}>;
				};
			};
			// Process filters
			if (filterConfig.rules?.filters && filterConfig.rules.filters.length > 0) {
				body.filter = [];
				for (const filterEntry of filterConfig.rules.filters) {
					if (filterEntry.filter?.columnId && filterEntry.filter?.operator) {
						body.filter.push({
							columnId: parseInt(filterEntry.filter.columnId),
							operator: filterEntry.filter.operator,
							value: filterEntry.filter.value || '',
						});
					}
				}
			}

			// Extract sorting configuration
			const sortConfig = context.getNodeParameter('sortConfig', itemIndex, {}) as {
				rules?: {
					sorting?: Array<{
						sort?: {
							columnId: string;
							direction: 'ASC' | 'DESC';
						};
					}>;
				};
			};

			// Process sorting
			if (sortConfig.rules?.sorting && sortConfig.rules.sorting.length > 0) {
				body.sort = [];
				for (const sortEntry of sortConfig.rules.sorting) {
					if (sortEntry.sort?.columnId && sortEntry.sort?.direction) {
						body.sort.push({
							columnId: parseInt(sortEntry.sort.columnId),
							mode: sortEntry.sort.direction,
						});
					}
				}
			}

			// Create view
			const response = await ApiHelper.makeApiRequest<View>(
				context,
				'POST',
				`/tables/${tableId}/views`,
				body,
			);

			return response;
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}

	/**
	 * AI-Friendly view update
	 * All parameters available via fixedCollection simultaneously
	 */
	private static async updateAIFriendly(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<View> {
		try {
			// Extract update configuration
			const updateConfig = context.getNodeParameter('updateConfig', itemIndex) as {
				data?: {
					viewId: string;
					title?: string;
					emoji?: string;
					description?: string;
				};
			};

			if (!updateConfig?.data) {
				throw new Error('Update configuration is required');
			}

			const { data } = updateConfig;

			if (!data.viewId) {
				throw new Error('View ID is required');
			}

			const viewId = parseInt(data.viewId);

			// Build base body (only changed fields)
			const body: any = {};

			if (data.title) {
				body.title = data.title;
			}

			if (data.emoji !== undefined) {
				body.emoji = data.emoji;
			}

			if (data.description !== undefined) {
				body.description = data.description;
			}

			// Extract filter configuration
			const filterConfig = context.getNodeParameter('filterConfig', itemIndex, {}) as {
				rules?: {
					filters?: Array<{
						filter?: {
							columnId: string;
							operator: string;
							value: string;
						};
					}>;
				};
			};

			// Process filters (overwrites all existing filters)
			if (filterConfig.rules?.filters && filterConfig.rules.filters.length > 0) {
				body.filter = [];
				for (const filterEntry of filterConfig.rules.filters) {
					if (filterEntry.filter?.columnId && filterEntry.filter?.operator) {
						body.filter.push({
							columnId: parseInt(filterEntry.filter.columnId),
							operator: filterEntry.filter.operator,
							value: filterEntry.filter.value || '',
						});
					}
				}
			}

			// Extract sorting configuration
			const sortConfig = context.getNodeParameter('sortConfig', itemIndex, {}) as {
				rules?: {
					sorting?: Array<{
						sort?: {
							columnId: string;
							direction: 'ASC' | 'DESC';
						};
					}>;
				};
			};

			// Process sorting (overwrites all existing sorting)
			if (sortConfig.rules?.sorting && sortConfig.rules.sorting.length > 0) {
				body.sort = [];
				for (const sortEntry of sortConfig.rules.sorting) {
					if (sortEntry.sort?.columnId && sortEntry.sort?.direction) {
						body.sort.push({
							columnId: parseInt(sortEntry.sort.columnId),
							mode: sortEntry.sort.direction,
						});
					}
				}
			}

			// At least one change must be present
			if (Object.keys(body).length === 0) {
				throw new Error('At least one field must be specified for the update');
			}

			// Update view
			const response = await ApiHelper.makeApiRequest<View>(
				context,
				'PUT',
				`/views/${viewId}`,
				body,
			);

			return response;
		} catch (error) {
			ApiHelper.handleApiError(error);
		}
	}
}

