import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeListSearchResult,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

// Import handlers
import { ColumnHandler } from './handlers/column.handler';
import { ImportHandler } from './handlers/import.handler';
import { RowHandler } from './handlers/row.handler';
import { ShareHandler } from './handlers/share.handler';
import { TableHandler } from './handlers/table.handler';
import { ViewHandler } from './handlers/view.handler';

// Import helpers
import { NextcloudTablesLogger } from './helpers/api.helper';
import { NodeListSearch, NodeLoadOptions } from './helpers/node.methods';

// Import descriptions
import { columnFields, columnOperations } from './descriptions/column';
import { importFields, importOperations } from './descriptions/import';
import { rowFields, rowOperations } from './descriptions/row';
import { shareFields, shareOperations } from './descriptions/share';
import { tableFields, tableOperations } from './descriptions/table';
import { viewFields, viewOperations } from './descriptions/view';

export class NextcloudTables implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nextcloud Tables',
		name: 'nextcloudTables',
		icon: 'file:nextcloud-tables.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Manage your Nextcloud Tables - tables, rows, and data',
		defaults: {
			name: 'Nextcloud Tables',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'nextcloudTablesApi',
				required: true,
			},
		],
		usableAsTool: true,
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Table',
						value: 'table',
						description: 'Operations with Nextcloud Tables',
					},
					{
						name: 'View',
						value: 'view',
						description: 'Operations with table views',
					},
					{
						name: 'Column',
						value: 'column',
						description: 'Operations with table columns',
					},
					{
						name: 'Share',
						value: 'share',
						description: 'Operations with table sharing',
					},
					{
						name: 'Import',
						value: 'import',
						description: 'CSV import into tables',
					},
					{
						name: 'Row',
						value: 'row',
						description: 'Operations with table rows',
					},
				],
				default: 'table',
				description: 'The resource to operate on',
			},
			// Operations and fields
			...tableOperations,
			...tableFields,
			...viewOperations,
			...viewFields,
			...columnOperations,
			...columnFields,
			...shareOperations,
			...shareFields,
			...importOperations,
			...importFields,
			...rowOperations,
			...rowFields,
		],
	};

	methods = {
		loadOptions: {
			async getTables(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getTables(this);
			},
			async getViews(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getViews(this);
			},
			async getColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getColumns(this);
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getUsers(this);
			},
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getGroups(this);
			},
			async getShareReceivers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getShareReceivers(this);
			},
		},
		listSearch: {
			async getTables(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				return NodeListSearch.getTables(this, filter);
			},
			async getViews(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				return NodeListSearch.getViews(this, filter);
			},
			async getColumns(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				return NodeListSearch.getColumns(this, filter);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const startTime = Date.now();
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Log operation start
				NextcloudTablesLogger.operationStart(resource, operation, {
					itemIndex: i,
					totalItems: items.length,
				});

				let result;
				switch (resource) {
					case 'table':
						result = await TableHandler.execute(this, operation, i);
						break;
					case 'view':
						result = await ViewHandler.execute(this, operation, i);
						break;
					case 'column':
						result = await ColumnHandler.execute(this, operation, i);
						break;
					case 'share':
						result = await ShareHandler.execute(this, operation, i);
						break;
					case 'import':
						result = await ImportHandler.execute(this, operation, i);
						break;
					case 'row':
						result = await RowHandler.execute(this, operation, i);
						break;
					default:
						NextcloudTablesLogger.error(
							'OPERATION-ERROR',
							`Unknown resource: ${resource}`,
							null,
							{ resource, operation },
						);
						throw new Error(`[N8N-NEXTCLOUD-TABLES] Unknown resource: ${resource}`);
				}

				const duration = Date.now() - startTime;
				NextcloudTablesLogger.operationSuccess(resource, operation, duration, result);

				returnData.push({ json: result });
			} catch (error) {
				const duration = Date.now() - startTime;
				const resource = this.getNodeParameter('resource', i, 'unknown') as string;
				const operation = this.getNodeParameter('operation', i, 'unknown') as string;

				NextcloudTablesLogger.operationError(resource, operation, error, duration);

				const nodeError = error as Error;
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: nodeError.message },
					});
				} else {
					throw error;
				}
			}
		}

		return this.prepareOutputData(returnData);
	}
}

