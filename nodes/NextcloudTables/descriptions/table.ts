import { INodeProperties } from 'n8n-workflow';

export const tableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['table'],
			},
		},
		options: [
			{
				name: 'Get All Tables',
				value: 'getAll',
				description: 'Retrieve all available tables',
				action: 'Get all tables',
			},
			{
				name: 'Get Table',
				value: 'get',
				description: 'Retrieve a specific table',
				action: 'Get table',
			},
			{
				name: 'Create Table',
				value: 'create',
				description: 'Create a new table',
				action: 'Create table',
			},
			{
				name: 'Update Table',
				value: 'update',
				description: 'Update a table',
				action: 'Update table',
			},
			{
				name: 'Delete Table',
				value: 'delete',
				description: 'Delete a table',
				action: 'Delete table',
			},
		],
		default: 'getAll',
	},
];

export const tableFields: INodeProperties[] = [
	// Table ID as resourceLocator for get, update, delete
	{
		displayName: 'Table',
		name: 'tableId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select a table from the list or enter its ID',
		modes: [
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getTables',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Table ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Please enter a valid table ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// Title for create
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the new table',
		placeholder: 'Enter table name...',
	},

	// Emoji for create
	{
		displayName: 'Emoji',
		name: 'emoji',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'An optional emoji for the table',
		placeholder: '📊',
	},

	// Template for create
	{
		displayName: 'Template',
		name: 'template',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'No Template',
				value: '',
				description: 'Create an empty table',
			},
			{
				name: 'Todo List',
				value: 'todo',
				description: 'Create a table based on the todo template',
			},
			{
				name: 'Employees',
				value: 'employees',
				description: 'Create a table based on the employees template',
			},
			{
				name: 'Customers',
				value: 'customers',
				description: 'Create a table based on the customers template',
			},
		],
		default: '',
		description: 'Choose a template for the new table',
	},

	// Additional fields for update
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new title for the table (optional)',
		placeholder: 'New table name...',
	},

	{
		displayName: 'Emoji',
		name: 'emoji',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new emoji for the table (optional)',
		placeholder: '📊',
	},

	{
		displayName: 'Archived',
		name: 'archived',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['update'],
			},
		},
		default: false,
		description: 'Whether the table should be archived',
	},
];

