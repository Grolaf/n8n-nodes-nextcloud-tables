import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
} from 'n8n-workflow';

import { ApiHelper } from './api.helper';
import { Table, View, Column } from '../interfaces';

export class NodeLoadOptions {
	/**
	 * Lädt alle verfügbaren Tabellen für Load Options
	 */
	static async getTables(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tables = await ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');
			
			return tables.map((table) => ({
				name: table.title || `Tabelle ${table.id}`,
				value: table.id.toString(),
				description: table.description || undefined,
			}));
		} catch (error: any) {
			console.error('Load Options getTables error:', error);
			throw new Error(`Fehler beim Laden der Tabellen: ${error.message || error}`);
		}
	}

	/**
	 * Lädt alle verfügbaren Views einer Tabelle für Load Options
	 */
	static async getViews(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			const extractedTableId = tableId?.value || tableId;
			
			if (!extractedTableId) {
				return [
					{
						name: 'Wählen Sie zuerst eine Tabelle aus',
						value: '',
						description: 'Eine Tabelle muss ausgewählt werden, um Views zu laden',
					},
				];
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context, 
				'GET', 
				`/tables/${extractedTableId}/views`
			);
			
			return views.map((view) => ({
				name: view.title || `View ${view.id}`,
				value: view.id.toString(),
				description: view.description || undefined,
			}));
		} catch (error) {
			return [
				{
					name: 'Fehler beim Laden der Views',
					value: '',
					description: error as string,
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Spalten einer Tabelle für Load Options
	 */
	static async getColumns(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			const extractedTableId = tableId?.value || tableId;
			
			if (!extractedTableId) {
				return [
					{
						name: 'Wählen Sie zuerst eine Tabelle aus',
						value: '',
						description: 'Eine Tabelle muss ausgewählt werden, um Spalten zu laden',
					},
				];
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context, 
				'GET', 
				`/tables/${extractedTableId}/columns`
			);
			
			return columns.map((column) => ({
				name: column.title || `Spalte ${column.id}`,
				value: column.id.toString(),
				description: `Typ: ${column.type}`,
			}));
		} catch (error) {
			return [
				{
					name: 'Fehler beim Laden der Spalten',
					value: '',
					description: error as string,
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Benutzer für Share-Empfänger (NEUE FUNKTION)
	 */
	static async getUsers(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Nextcloud Users API verwenden (erfordert OCS-Header)
			const credentials = await context.getCredentials('nextcloudTablesApi');
			const baseUrl = (credentials.serverUrl as string).replace(/\/$/, '');
			
			const users = await context.helpers.request({
				method: 'GET',
				url: `${baseUrl}/ocs/v1.php/cloud/users`,
				headers: {
					'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'OCS-APIRequest': 'true',
				},
				json: true,
			});

			const userList = users?.ocs?.data?.users || [];
			
			return userList.map((username: string) => ({
				name: username,
				value: username,
				description: '👤 Nextcloud Benutzer',
			}));
		} catch (error: any) {
			console.error('Load Options getUsers error:', error);
			return [
				{
					name: 'Fehler beim Laden der Benutzer',
					value: '',
					description: 'Überprüfen Sie die Berechtigung zur Benutzerliste',
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Gruppen für Share-Empfänger (NEUE FUNKTION)
	 */
	static async getGroups(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Nextcloud Groups API verwenden (erfordert OCS-Header)
			const credentials = await context.getCredentials('nextcloudTablesApi');
			const baseUrl = (credentials.serverUrl as string).replace(/\/$/, '');
			
			const groups = await context.helpers.request({
				method: 'GET',
				url: `${baseUrl}/ocs/v1.php/cloud/groups`,
				headers: {
					'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'OCS-APIRequest': 'true',
				},
				json: true,
			});

			const groupList = groups?.ocs?.data?.groups || [];
			
			return groupList.map((groupname: string) => ({
				name: groupname,
				value: groupname,
				description: '👥 Nextcloud Gruppe',
			}));
		} catch (error: any) {
			console.error('Load Options getGroups error:', error);
			return [
				{
					name: 'Fehler beim Laden der Gruppen',
					value: '',
					description: 'Überprüfen Sie die Berechtigung zur Gruppenliste',
				},
			];
		}
	}

	/**
	 * Lädt Benutzer und Gruppen kombiniert für Share-Empfänger (NEUE FUNKTION)
	 */
	static async getShareReceivers(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const shareType = context.getCurrentNodeParameter('shareType') as string;
			
			if (shareType === 'user') {
				return this.getUsers(context);
			} else if (shareType === 'group') {
				return this.getGroups(context);
			} else {
				// Fallback: Beide laden
				const [users, groups] = await Promise.all([
					this.getUsers(context),
					this.getGroups(context)
				]);
				
				return [
					...users.map(user => ({ ...user, description: '👤 ' + (user.description || 'Benutzer') })),
					...groups.map(group => ({ ...group, description: '👥 ' + (group.description || 'Gruppe') }))
				];
			}
		} catch (error: any) {
			console.error('Load Options getShareReceivers error:', error);
			return [
				{
					name: 'Fehler beim Laden der Empfänger',
					value: '',
					description: 'Überprüfen Sie die Berechtigung',
				},
			];
		}
	}
}

export class NodeListSearch {
	/**
	 * Durchsucht Tabellen für List Search
	 */
	static async getTables(context: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		try {
			const tables = await ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');
			
			let filteredTables = tables;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredTables = tables.filter(
					(table) =>
						table.title?.toLowerCase().includes(filterLower) ||
						table.description?.toLowerCase().includes(filterLower)
				);
			}

			return {
				results: filteredTables.map((table) => ({
					name: table.title || `Tabelle ${table.id}`,
					value: table.id.toString(),
					description: table.description || undefined,
				})),
			};
		} catch (error: any) {
			console.error('NodeListSearch getTables error:', error);
			throw new Error(`Fehler beim Durchsuchen der Tabellen: ${error.message || error}`);
		}
	}

	/**
	 * Durchsucht Views für List Search
	 */
	static async getViews(context: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		try {
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			const extractedTableId = tableId?.value || tableId;
			
			if (!extractedTableId) {
				return {
					results: [
						{
							name: 'Wählen Sie zuerst eine Tabelle aus',
							value: '',
							description: 'Eine Tabelle muss ausgewählt werden, um Views zu suchen',
						},
					],
				};
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context, 
				'GET', 
				`/tables/${extractedTableId}/views`
			);
			
			let filteredViews = views;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredViews = views.filter(
					(view) =>
						view.title?.toLowerCase().includes(filterLower) ||
						view.description?.toLowerCase().includes(filterLower)
				);
			}

			return {
				results: filteredViews.map((view) => ({
					name: view.title || `View ${view.id}`,
					value: view.id.toString(),
					description: view.description || undefined,
				})),
			};
		} catch (error) {
			return {
				results: [
					{
						name: 'Fehler beim Durchsuchen der Views',
						value: '',
						description: error as string,
					},
				],
			};
		}
	}

	/**
	 * Durchsucht Spalten für List Search
	 */
	static async getColumns(context: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		try {
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			const extractedTableId = tableId?.value || tableId;
			
			if (!extractedTableId) {
				return {
					results: [
						{
							name: 'Wählen Sie zuerst eine Tabelle aus',
							value: '',
							description: 'Eine Tabelle muss ausgewählt werden, um Spalten zu suchen',
						},
					],
				};
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context, 
				'GET', 
				`/tables/${extractedTableId}/columns`
			);
			
			let filteredColumns = columns;
			if (filter) {
				const filterLower = filter.toLowerCase();
				filteredColumns = columns.filter(
					(column) =>
						column.title?.toLowerCase().includes(filterLower) ||
						column.type?.toLowerCase().includes(filterLower)
				);
			}

			return {
				results: filteredColumns.map((column) => ({
					name: column.title || `Spalte ${column.id}`,
					value: column.id.toString(),
					description: `Typ: ${column.type}`,
				})),
			};
		} catch (error) {
			return {
				results: [
					{
						name: 'Fehler beim Durchsuchen der Spalten',
						value: '',
						description: error as string,
					},
				],
			};
		}
	}
} 