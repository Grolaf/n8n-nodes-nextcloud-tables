import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
} from 'n8n-workflow';

import { ApiHelper } from './api.helper';
import { Table, View, Column } from '../interfaces';
import { DebugHelper } from './debug.helper';

export class NodeLoadOptions {
	/**
	 * Lädt alle verfügbaren Tabellen für Load Options
	 */
	static async getTables(context: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			const tables = await ApiHelper.makeApiRequest<Table[]>(context, 'GET', '/tables');
			
			// 🐛 DEBUG: Load Options Result
			DebugHelper.logLoadOptions('getTables', tables.length, { 
				sampleTitles: tables.slice(0, 3).map(t => t.title) 
			});
			
			return tables.map((table) => ({
				name: table.title || `Tabelle ${table.id}`,
				value: table.id.toString(),
				description: table.description || undefined,
			}));
		} catch (error: any) {
			DebugHelper.logError('NodeLoadOptions.getTables', error);
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
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// 🐛 DEBUG: Detailed tableId debugging
			DebugHelper.logResourceLocator('getViews.input', {
				raw: tableId,
				type: typeof tableId,
				isNull: tableId === null,
				isUndefined: tableId === undefined,
				hasValue: tableId?.value,
				hasMode: tableId?.mode,
				keys: typeof tableId === 'object' ? Object.keys(tableId || {}) : [],
			});
			
			// Verbesserte Extraktion mit mehr Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				console.warn('getViews: tableId is null/undefined');
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
				console.warn('getViews: extractedTableId is empty or invalid:', extractedTableId);
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
				console.warn('getViews: tableId is not a valid number:', extractedTableId);
				return [
					{
						name: 'Ungültige Tabellen-ID (keine Zahl)',
						value: '',
						description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
					},
				];
			}

			// 🐛 DEBUG: Final tableId being used
			DebugHelper.logResourceLocator('getViews.final', {
				original: tableId,
				extracted: extractedTableId,
				numeric: numericTableId,
			});

			const views = await ApiHelper.makeApiRequest<View[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/views`
			);
			
			// 🐛 DEBUG: Load Options Result
			DebugHelper.logLoadOptions('getViews', views.length, { 
				tableId: numericTableId,
				sampleTitles: views.slice(0, 3).map(v => v.title) 
			});

			return views.map((view) => ({
				name: view.title || `View ${view.id}`,
				value: view.id.toString(),
				description: view.description || undefined,
			}));
		} catch (error: any) {
			DebugHelper.logError('NodeLoadOptions.getViews', error);
			console.error('getViews detailed error:', {
				message: error.message,
				statusCode: error.statusCode,
				response: error.response?.body,
				stack: error.stack?.split('\n').slice(0, 5),
			});
			
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
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// 🐛 DEBUG: Detailed tableId debugging
			DebugHelper.logResourceLocator('getColumns.input', {
				raw: tableId,
				type: typeof tableId,
				isNull: tableId === null,
				isUndefined: tableId === undefined,
				hasValue: tableId?.value,
				hasMode: tableId?.mode,
				keys: typeof tableId === 'object' ? Object.keys(tableId || {}) : [],
			});
			
			// Verbesserte Extraktion mit mehr Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				console.warn('getColumns: tableId is null/undefined');
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
				console.warn('getColumns: extractedTableId is empty or invalid:', extractedTableId);
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
				console.warn('getColumns: tableId is not a valid number:', extractedTableId);
				return [
					{
						name: 'Ungültige Tabellen-ID (keine Zahl)',
						value: '',
						description: `"${extractedTableId}" ist keine gültige Tabellen-ID`,
					},
				];
			}

			// 🐛 DEBUG: Final tableId being used
			DebugHelper.logResourceLocator('getColumns.final', {
				original: tableId,
				extracted: extractedTableId,
				numeric: numericTableId,
			});

			const columns = await ApiHelper.makeApiRequest<Column[]>(
				context, 
				'GET', 
				`/tables/${numericTableId}/columns`
			);
			
			// 🐛 DEBUG: Load Options Result
			DebugHelper.logLoadOptions('getColumns', columns.length, { 
				tableId: numericTableId,
				sampleColumns: columns.slice(0, 3).map(c => ({ title: c.title, type: c.type }))
			});

			return columns.map((column) => ({
				name: column.title || `Spalte ${column.id}`,
				value: column.id.toString(),
				description: `Typ: ${column.type}`,
			}));
		} catch (error: any) {
			DebugHelper.logError('NodeLoadOptions.getColumns', error);
			console.error('getColumns detailed error:', {
				message: error.message,
				statusCode: error.statusCode,
				response: error.response?.body,
				stack: error.stack?.split('\n').slice(0, 5),
			});
			
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
	 * Lädt alle verfügbaren Benutzer für Share-Empfänger (NEUE FUNKTION)
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
					// Wenn beide APIs fehlschlagen, zeige nur den aktuellen Benutzer
					// Stille Fehlerbehandlung - zeige nur aktuellen Benutzer
				}
			}
			
			// Entferne Duplikate und begrenze auf 50 Ergebnisse
			const uniqueResults = results.filter((result, index, self) => 
				index === self.findIndex(r => r.value === result.value)
			).slice(0, 50);

			// 🐛 DEBUG: Load Options Result
			DebugHelper.logLoadOptions('getUsers', uniqueResults.length, { 
				sampleUsers: uniqueResults.slice(0, 3).map(u => u.name) 
			});
			
			return uniqueResults;
		} catch (error: any) {
			DebugHelper.logError('NodeLoadOptions.getUsers', error);
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

			// 🐛 DEBUG: Load Options Result
			DebugHelper.logLoadOptions('getGroups', uniqueResults.length, { 
				sampleGroups: uniqueResults.slice(0, 3).map(g => g.name) 
			});
			
			return uniqueResults;
		} catch (error: any) {
			DebugHelper.logError('NodeLoadOptions.getGroups', error);
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
			
			// 🐛 DEBUG: Detailed tableId debugging
			DebugHelper.logResourceLocator('getViews.listSearch.input', {
				raw: tableId,
				type: typeof tableId,
				isNull: tableId === null,
				isUndefined: tableId === undefined,
				hasValue: tableId?.value,
				hasMode: tableId?.mode,
				keys: typeof tableId === 'object' ? Object.keys(tableId || {}) : [],
			});
			
			// Verbesserte Extraktion mit mehr Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				console.warn('getViews (listSearch): tableId is null/undefined');
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
				console.warn('getViews (listSearch): extractedTableId is empty or invalid:', extractedTableId);
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
				console.warn('getViews (listSearch): tableId is not a valid number:', extractedTableId);
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

			// 🐛 DEBUG: Final tableId being used
			DebugHelper.logResourceLocator('getViews.listSearch.final', {
				original: tableId,
				extracted: extractedTableId,
				numeric: numericTableId,
			});

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
			DebugHelper.logError('NodeListSearch.getViews', error);
			console.error('getViews (listSearch) detailed error:', {
				message: error.message,
				statusCode: error.statusCode,
				response: error.response?.body,
				stack: error.stack?.split('\n').slice(0, 5),
			});
			
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
			// Versuche die Tabellen-ID aus dem Kontext zu extrahieren
			const tableId = context.getCurrentNodeParameter('tableId') as any;
			
			// 🐛 DEBUG: Detailed tableId debugging
			DebugHelper.logResourceLocator('getColumns.listSearch.input', {
				raw: tableId,
				type: typeof tableId,
				isNull: tableId === null,
				isUndefined: tableId === undefined,
				hasValue: tableId?.value,
				hasMode: tableId?.mode,
				keys: typeof tableId === 'object' ? Object.keys(tableId || {}) : [],
			});
			
			// Verbesserte Extraktion mit mehr Validierung
			let extractedTableId: any;
			
			if (!tableId) {
				console.warn('getColumns (listSearch): tableId is null/undefined');
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
				console.warn('getColumns (listSearch): extractedTableId is empty or invalid:', extractedTableId);
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
				console.warn('getColumns (listSearch): tableId is not a valid number:', extractedTableId);
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

			// 🐛 DEBUG: Final tableId being used
			DebugHelper.logResourceLocator('getColumns.listSearch.final', {
				original: tableId,
				extracted: extractedTableId,
				numeric: numericTableId,
			});

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
			DebugHelper.logError('NodeListSearch.getColumns', error);
			console.error('getColumns (listSearch) detailed error:', {
				message: error.message,
				statusCode: error.statusCode,
				response: error.response?.body,
				stack: error.stack?.split('\n').slice(0, 5),
			});
			
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