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
		} catch (error) {
			throw new Error(`Fehler beim Laden der Tabellen: ${error}`);
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
		} catch (error) {
			throw new Error(`Fehler beim Durchsuchen der Tabellen: ${error}`);
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