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
			return [
				{
					name: 'Fehler beim Laden der Tabellen',
					value: '',
					description: 'Überprüfen Sie die Verbindung zu Nextcloud',
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Views einer Tabelle für Load Options
	 */
	static async getViews(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// Verbesserte Extraktion mit Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				return [
					{
						name: 'Keine Tabelle ausgewählt',
						value: '',
						description: 'Wählen Sie zuerst eine Tabelle aus, um Views zu laden',
					},
				];
			}
			
			// Resource Locator Struktur
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}
			
			// Validierung der extrahierten ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return [
					{
						name: 'Ungültige Tabellen-ID',
						value: '',
						description: 'Bitte wählen Sie eine gültige Tabelle aus',
					},
				];
			}
			
			// Stelle sicher, dass es eine gültige Zahl ist
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return [
					{
						name: 'Ungültige Tabellen-ID (keine Zahl)',
						value: '',
						description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
					},
				];
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/views`
			);

			return views.map((view) => ({
				name: view.title || `View ${view.id}`,
				value: view.id.toString(),
				description: view.description || undefined,
			}));
		} catch (error: any) {
			return [
				{
					name: 'Fehler beim Laden der Views',
					value: '',
					description: `Fehler: ${error.message || 'Unbekannter Fehler'}`,
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Spalten einer Tabelle für Load Options
	 */
	static async getColumns(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// Verbesserte Extraktion mit Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				return [
					{
						name: 'Keine Tabelle ausgewählt',
						value: '',
						description: 'Wählen Sie zuerst eine Tabelle aus, um Spalten zu laden',
					},
				];
			}
			
			// Resource Locator Struktur
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}
			
			// Validierung der extrahierten ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return [
					{
						name: 'Ungültige Tabellen-ID',
						value: '',
						description: 'Bitte wählen Sie eine gültige Tabelle aus',
					},
				];
			}
			
			// Stelle sicher, dass es eine gültige Zahl ist
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return [
					{
						name: 'Ungültige Tabellen-ID (keine Zahl)',
						value: '',
						description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
					},
				];
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/columns`
			);

			return columns.map((column) => ({
				name: column.title || `Spalte ${column.id}`,
				value: column.id.toString(),
				description: `Typ: ${column.type}`,
			}));
		} catch (error: any) {
			return [
				{
					name: 'Fehler beim Laden der Spalten',
					value: '',
					description: `Fehler: ${error.message || 'Unbekannter Fehler'}`,
				},
			];
		}
	}

	/**
	 * Lädt alle verfügbaren Benutzer für Share-Empfänger
	 */
	static async getUsers(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const credentials = await context.getCredentials('nextcloudTablesApi');
			const currentUser = credentials.username as string;
			const results: Array<{ name: string; value: string }> = [];
			
			// Füge den aktuellen Benutzer immer als ersten Eintrag hinzu
			const currentUserDisplayName = `${currentUser} (Sie selbst)`;
			results.push({ name: currentUserDisplayName, value: currentUser });
			
			try {
				// Verwende den Sharee-Endpunkt, um weitere Benutzer zu suchen
				const searchTerm = '';
				const endpoint = `/sharees?search=${encodeURIComponent(searchTerm)}&itemType=0&perPage=50`;
				
				const response = await ApiHelper.nextcloudShareeApiRequest(context, 'GET', endpoint);
				const shareeData = response as { users?: Array<{ value: { shareWith: string; shareWithDisplayName: string } }> };
				
				if (shareeData.users && shareeData.users.length > 0) {
					// Füge Sharee-Benutzer hinzu (aber nicht den aktuellen Benutzer doppelt)
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
				// Fallback: Verwende OCS Users API, wenn Sharee API fehlschlägt
				try {
					const usersResponse = await ApiHelper.nextcloudOcsUsersApiRequest(context, 'GET', '/users');
					const usersData = usersResponse as { users?: string[] };
					
					if (usersData.users && usersData.users.length > 0) {
						// Füge alle Benutzer hinzu (aber nicht den aktuellen Benutzer doppelt)
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
					// Stille Fehlerbehandlung - zeige nur aktuellen Benutzer
				}
			}
			
			// Entferne Duplikate und begrenze auf 50 Ergebnisse
			const uniqueResults = results.filter((result, index, self) => 
				index === self.findIndex(r => r.value === result.value)
			).slice(0, 50);
			
			return uniqueResults;
		} catch (error: any) {
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
	 * Lädt alle verfügbaren Gruppen für Share-Empfänger
	 */
	static async getGroups(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const results: Array<{ name: string; value: string }> = [];
			
			try {
				// Verwende den Sharee-Endpunkt, um Gruppen zu suchen
				const searchTerm = '';
				const endpoint = `/sharees?search=${encodeURIComponent(searchTerm)}&itemType=1&perPage=50`;
				
				const response = await ApiHelper.nextcloudShareeApiRequest(context, 'GET', endpoint);
				const shareeData = response as { groups?: Array<{ value: { shareWith: string; shareWithDisplayName: string } }> };
				
				if (shareeData.groups && shareeData.groups.length > 0) {
					for (const group of shareeData.groups) {
						results.push({
							name: group.value.shareWithDisplayName || group.value.shareWith,
							value: group.value.shareWith,
						});
					}
				}
			} catch (shareeError) {
				// Fallback: Verwende OCS Groups API, wenn Sharee API fehlschlägt
				try {
					const groupsResponse = await ApiHelper.nextcloudOcsUsersApiRequest(context, 'GET', '/groups');
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
					// Stille Fehlerbehandlung
				}
			}
			
			// Entferne Duplikate und begrenze auf 50 Ergebnisse
			const uniqueResults = results.filter((result, index, self) => 
				index === self.findIndex(r => r.value === result.value)
			).slice(0, 50);
			
			return uniqueResults;
		} catch (error: any) {
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
	 * Lädt Benutzer und Gruppen kombiniert für Share-Empfänger
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
			throw new Error(`Fehler beim Durchsuchen der Tabellen: ${error.message || error}`);
		}
	}

	/**
	 * Durchsucht Views für List Search
	 */
	static async getViews(context: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		try {
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// Verbesserte Extraktion mit Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				return {
					results: [
						{
							name: 'Keine Tabelle ausgewählt',
							value: '',
							description: 'Wählen Sie zuerst eine Tabelle aus, um Views zu suchen',
						},
					],
				};
			}
			
			// Resource Locator Struktur
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}
			
			// Validierung der extrahierten ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return {
					results: [
						{
							name: 'Ungültige Tabellen-ID',
							value: '',
							description: 'Bitte wählen Sie eine gültige Tabelle aus',
						},
					],
				};
			}
			
			// Stelle sicher, dass es eine gültige Zahl ist
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return {
					results: [
						{
							name: 'Ungültige Tabellen-ID (keine Zahl)',
							value: '',
							description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
						},
					],
				};
			}

			const views = await ApiHelper.makeApiRequest<View[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/views`
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
		} catch (error: any) {
			return {
				results: [
					{
						name: 'Fehler beim Durchsuchen der Views',
						value: '',
						description: `Fehler: ${error.message || 'Unbekannter Fehler'}`,
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
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// Verbesserte Extraktion mit Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				return {
					results: [
						{
							name: 'Keine Tabelle ausgewählt',
							value: '',
							description: 'Wählen Sie zuerst eine Tabelle aus, um Spalten zu suchen',
						},
					],
				};
			}
			
			// Resource Locator Struktur
			if (typeof tableId === 'object' && tableId !== null) {
				if (tableId.__rl === true || tableId.mode) {
					extractedTableId = tableId.value;
				} else {
					extractedTableId = tableId;
				}
			} else {
				extractedTableId = tableId;
			}
			
			// Validierung der extrahierten ID
			if (!extractedTableId || extractedTableId === '' || extractedTableId === 'undefined') {
				return {
					results: [
						{
							name: 'Ungültige Tabellen-ID',
							value: '',
							description: 'Bitte wählen Sie eine gültige Tabelle aus',
						},
					],
				};
			}
			
			// Stelle sicher, dass es eine gültige Zahl ist
			const numericTableId = parseInt(extractedTableId, 10);
			if (isNaN(numericTableId) || numericTableId <= 0) {
				return {
					results: [
						{
							name: 'Ungültige Tabellen-ID (keine Zahl)',
							value: '',
							description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
						},
					],
				};
			}

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/columns`
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
		} catch (error: any) {
			return {
				results: [
					{
						name: 'Fehler beim Durchsuchen der Spalten',
						value: '',
						description: `Fehler: ${error.message || 'Unbekannter Fehler'}`,
					},
				],
			};
		}
	}
} 