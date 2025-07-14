import { ILoadOptionsFunctions, INodeListSearchResult, INodePropertyOptions } from 'n8n-workflow';

import { Column, Table, View } from '../interfaces';
import { ApiHelper } from './api.helper';

export class NodeLoadOptions {
	/**
	 * Loads all available tables for Load Options
	 */
	static async getTables(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tables = await ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');

			return tables.map((table) => ({
				name: table.title || `Table ${table.id}`,
				value: table.id.toString(),
				description: table.description || undefined,
			}));
		} catch (error: any) {
			return [
				{
					name: 'Error loading tables',
					value: '',
					description: 'Check your connection to Nextcloud',
				},
			];
		}
	}

	/**
	 * Loads all available views of a table for Load Options
	 */
	static async getViews(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;

			// Improved extraction with validation
			let extractedTableId: any;

			if (!tableId) {
				return [
					{
						name: 'No table selected',
						value: '',
						description: 'Select a table first to load views',
					},
				];
			}

			// Resource Locator structure
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}

			// Validate extracted ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return [
					{
						name: 'Invalid table ID',
						value: '',
						description: 'Please select a valid table',
					},
				];
			}

			// Ensure it is a valid number
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return [
					{
						name: 'Invalid table ID (not a number)',
						value: '',
						description: `"${extractedTableId}" is not a valid table ID`,
					},
				];
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context,
				'GET',
				`/tables/${numericTableId}/views`,
			);

			return views.map((view) => ({
				name: view.title || `View ${view.id}`,
				value: view.id.toString(),
				description: view.description || undefined,
			}));
		} catch (error: any) {
			return [
				{
					name: 'Error loading views',
					value: '',
					description: `Error: ${error.message || 'Unknown error'}`,
				},
			];
		}
	}

	/**
	 * Loads all available columns of a table for Load Options
	 */
	static async getColumns(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;

			// Improved extraction with validation
			let extractedTableId: any;

			if (!tableId) {
				return [
					{
						name: 'No table selected',
						value: '',
						description: 'Select a table first to load columns',
					},
				];
			}

			// Resource Locator structure
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}

			// Validate extracted ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return [
					{
						name: 'Invalid table ID',
						value: '',
						description: 'Please select a valid table',
					},
				];
			}

			// Ensure it is a valid number
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return [
					{
						name: 'Invalid table ID (not a number)',
						value: '',
						description: `"${extractedTableId}" is not a valid table ID`,
					},
				];
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context,
				'GET',
				`/tables/${numericTableId}/columns`,
			);

			return columns.map((column) => ({
				name: column.title || `Column ${column.id}`,
				value: column.id.toString(),
				description: `Type: ${column.type}`,
			}));
		} catch (error: any) {
			return [
				{
					name: 'Error loading columns',
					value: '',
					description: `Error: ${error.message || 'Unknown error'}`,
				},
			];
		}
	}

	/**
	 * Loads all available users for share recipients
	 */
	static async getUsers(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const credentials = await context.getCredentials('nextcloudTablesApi');
			const currentUser = credentials.username as string;
			const results: Array<{ name: string; value: string }> = [];

			// Always add current user as first entry
			const currentUserDisplayName = `${currentUser} (You)`;
			results.push({ name: currentUserDisplayName, value: currentUser });

			try {
				// Use the Sharee endpoint to search for more users
				const searchTerm = '';
				const endpoint = `/sharees?search=${encodeURIComponent(searchTerm)}&itemType=0&perPage=50`;

				const response = await ApiHelper.nextcloudShareeApiRequest(
					context,
					'GET',
					endpoint,
				);
				const shareeData = response as {
					users?: Array<{ value: { shareWith: string; shareWithDisplayName: string } }>;
				};

				if (shareeData.users && shareeData.users.length > 0) {
					// Add Sharee users (but avoid duplicates)
					for (const user of shareeData.users) {
						if (user.value.shareWith !== currentUser) {
							results.push({
								name: user.value.shareWithDisplayName || user.value.shareWith,
								value: user.value.shareWith,
							});
						}
					}
				}
			} catch (shareeError) {
				// Fallback: Use OCS Users API if Sharee API fails
				try {
					const usersResponse = await ApiHelper.nextcloudOcsUsersApiRequest(
						context,
						'GET',
						'/users',
					);
					const usersData = usersResponse as { users?: string[] };

					if (usersData.users && usersData.users.length > 0) {
						for (const userId of usersData.users) {
							if (userId !== currentUser) {
								results.push({
									name: userId,
									value: userId,
								});
							}
						}
					}
				} catch (usersError) {
					// Silent fallback - show only current user
				}
			}

			// Remove duplicates and limit to 50 results
			const uniqueResults = results
				.filter(
					(result, index, self) =>
						index === self.findIndex((r) => r.value === result.value),
				)
				.slice(0, 50);

			return uniqueResults;
		} catch (error: any) {
			return [
				{
					name: 'Error loading users',
					value: '',
					description: 'Check permission to list users',
				},
			];
		}
	}

	/**
	 * Loads all available groups for share recipients
	 */
	static async getGroups(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const results: Array<{ name: string; value: string }> = [];

			try {
				// Use the Sharee endpoint to search for groups
				const searchTerm = '';
				const endpoint = `/sharees?search=${encodeURIComponent(searchTerm)}&itemType=1&perPage=50`;

				const response = await ApiHelper.nextcloudShareeApiRequest(
					context,
					'GET',
					endpoint,
				);
				const shareeData = response as {
					groups?: Array<{ value: { shareWith: string; shareWithDisplayName: string } }>;
				};

				if (shareeData.groups && shareeData.groups.length > 0) {
					for (const group of shareeData.groups) {
						results.push({
							name: group.value.shareWithDisplayName || group.value.shareWith,
							value: group.value.shareWith,
						});
					}
				}
			} catch (shareeError) {
				// Fallback: Use OCS Groups API if Sharee API fails
				try {
					const groupsResponse = await ApiHelper.nextcloudOcsUsersApiRequest(
						context,
						'GET',
						'/groups',
					);
					const groupsData = groupsResponse as { groups?: string[] };

					if (groupsData.groups && groupsData.groups.length > 0) {
						for (const groupId of groupsData.groups) {
							results.push({
								name: groupId,
								value: groupId,
							});
						}
					}
				} catch (groupsError) {
					// Silent error handling
				}
			}

			// Remove duplicates and limit to 50 results
			const uniqueResults = results
				.filter(
					(result, index, self) =>
						index === self.findIndex((r) => r.value === result.value),
				)
				.slice(0, 50);

			return uniqueResults;
		} catch (error: any) {
			return [
				{
					name: 'Error loading groups',
					value: '',
					description: 'Check permission to list groups',
				},
			];
		}
	}

	/**
	 * Loads users and groups combined for share recipients
	 */
	static async getShareReceivers(
		context: ILoadOptionsFunctions,
	): Promise<INodePropertyOptions[]> {
		try {
			const shareType = context.getCurrentNodeParameter('shareType') as string;

			if (shareType === 'user') {
				return this.getUsers(context);
			} else if (shareType === 'group') {
				return this.getGroups(context);
			} else {
				// Fallback: Load both
				const [users, groups] = await Promise.all([
					this.getUsers(context),
					this.getGroups(context),
				]);

				return [
					...users.map((user) => ({
						...user,
						description: '👤 ' + (user.description || 'User'),
					})),
					...groups.map((group) => ({
						...group,
						description: '👥 ' + (group.description || 'Group'),
					})),
				];
			}
		} catch (error: any) {
			return [
				{
					name: 'Error loading recipients',
					value: '',
					description: 'Check your permissions',
				},
			];
		}
	}
}

export class NodeListSearch {
	/**
	 * Searches tables for List Search
	 */
	static async getTables(
		context: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		try {
			const tables = await ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');

			let filteredTables = tables;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredTables = tables.filter(
					(table) =>
						table.title?.toLowerCase().includes(filterLower) ||
						table.description?.toLowerCase().includes(filterLower),
				);
			}

			return {
				results: filteredTables.map((table) => ({
					name: table.title || `Table ${table.id}`,
					value: table.id.toString(),
					description: table.description || undefined,
				})),
			};
		} catch (error: any) {
			throw new Error(`Error searching tables: ${error.message || error}`);
		}
	}

	/**
	 * Searches views for List Search
	 */
	static async getViews(
		context: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;

			let extractedTableId: any;

			if (!tableId) {
				return {
					results: [
						{
							name: 'No table selected',
							value: '',
							description: 'Select a table first to load views',
						},
					],
				};
			}

			// Handle Resource Locator structure
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}

			// Validate extracted ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return {
					results: [
						{
							name: 'Invalid table ID',
							value: '',
							description: 'Please select a valid table',
						},
					],
				};
			}

			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return {
					results: [
						{
							name: 'Invalid table ID (not a number)',
							value: '',
							description: `"${extractedTableId}" is not a valid table ID`,
						},
					],
				};
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context,
				'GET',
				`/tables/${numericTableId}/views`,
			);

			let filteredViews = views;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredViews = views.filter(
					(view) =>
						view.title?.toLowerCase().includes(filterLower) ||
						view.description?.toLowerCase().includes(filterLower),
				);
			}

			return {
				results: filteredViews.map((view) => ({
					name: view.title || `View ${view.id}`,
					value: view.id.toString(),
					description: view.description || undefined,
				})),
			};
		} catch (error: any) {
			return {
				results: [
					{
						name: 'Error searching views',
						value: '',
						description: `Error: ${error.message || 'Unknown error'}`,
					},
				],
			};
		}
	}

	/**
	 * Searches columns for List Search
	 */
	static async getColumns(
		context: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;

			let extractedTableId: any;

			if (!tableId) {
				return {
					results: [
						{
							name: 'No table selected',
							value: '',
							description: 'Select a table first to load columns',
						},
					],
				};
			}

			// Handle Resource Locator structure
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}

			// Validate extracted ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return {
					results: [
						{
							name: 'Invalid table ID',
							value: '',
							description: 'Please select a valid table',
						},
					],
				};
			}

			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return {
					results: [
						{
							name: 'Invalid table ID (not a number)',
							value: '',
							description: `"${extractedTableId}" is not a valid table ID`,
						},
					],
				};
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context,
				'GET',
				`/tables/${numericTableId}/columns`,
			);

			let filteredColumns = columns;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredColumns = columns.filter(
					(column) =>
						column.title?.toLowerCase().includes(filterLower) ||
						column.type?.toLowerCase().includes(filterLower),
				);
			}

			return {
				results: filteredColumns.map((column) => ({
					name: column.title || `Column ${column.id}`,
					value: column.id.toString(),
					description: `Type: ${column.type}`,
				})),
			};
		} catch (error: any) {
			return {
				results: [
					{
						name: 'Error searching columns',
						value: '',
						description: `Error: ${error.message || 'Unknown error'}`,
					},
				],
			};
		}
	}
}

