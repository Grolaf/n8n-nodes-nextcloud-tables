import { INodeProperties } from 'n8n-workflow';

export const viewOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['view'],
			},
		},
		options: [
			{
				name: 'Get All Views',
				value: 'getAll',
				description: 'Retrieve all views of a table',
				action: 'Get all views',
			},
			{
				name: 'Get View',
				value: 'get',
				description: 'Retrieve a specific view',
				action: 'Get view',
			},
			{
				name: 'Create View',
				value: 'create',
				description: 'Create a new view',
				action: 'Create view',
			},
			{
				name: 'Create View (AI-Friendly)',
				value: 'createAIFriendly',
				description: 'Create a new view - optimized for AI agents',
				action: 'Create view (AI-Friendly)',
			},
			{
				name: 'Update View',
				value: 'update',
				description: 'Update a view',
				action: 'Update view',
			},
			{
				name: 'Update View (AI-Friendly)',
				value: 'updateAIFriendly',
				description: 'Update a view - optimized for AI agents',
				action: 'Update view (AI-Friendly)',
			},
			{
				name: 'Delete View',
				value: 'delete',
				description: 'Delete a view',
				action: 'Delete view',
			},
		],
		default: 'getAll',
	},
];

export const viewFields: INodeProperties[] = [
	// ==============================================
	// AI-FRIENDLY OPERATIONS - All parameters available
	// ==============================================

	// View config for AI-Friendly create
	{
		displayName: 'View Configuration (AI-Friendly)',
		name: 'viewConfig',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['createAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Basic Configuration',
				name: 'basic',
				values: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						description: 'The title of the new view',
						placeholder: 'My View',
					},
					{
						displayName: 'Table ID',
						name: 'tableId',
						type: 'string',
						required: true,
						default: '',
						description: 'The ID of the table for the view',
						placeholder: '123',
					},
					{
						displayName: 'Emoji',
						name: 'emoji',
						type: 'string',
						default: '',
						description: 'An optional emoji for the view',
						placeholder: '🔍',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'An optional description for the view',
						placeholder: 'Description of the view...',
					},
				],
			},
		],
		description: 'Basic configuration for the new view',
	},

	// Update configuration for AI-Friendly update
	{
		displayName: 'Update Configuration (AI-Friendly)',
		name: 'updateConfig',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['updateAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Update Data',
				name: 'data',
				values: [
					{
						displayName: 'View ID',
						name: 'viewId',
						type: 'string',
						required: true,
						default: '',
						description: 'The ID of the view to update',
						placeholder: '456',
					},
					{
						displayName: 'New Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The new title for the view (leave empty to keep unchanged)',
						placeholder: 'New view name',
					},
					{
						displayName: 'New Emoji',
						name: 'emoji',
						type: 'string',
						default: '',
						description: 'The new emoji for the view (leave empty to keep unchanged)',
						placeholder: '🔍',
					},
					{
						displayName: 'New Description',
						name: 'description',
						type: 'string',
						default: '',
						description:
							'The new description for the view (leave empty to keep unchanged)',
						placeholder: 'New description...',
					},
				],
			},
		],
		description: 'Update configuration for the view',
	},

	// Filter configuration for AI-Friendly operations
	{
		displayName: 'Filter Configuration (AI-Friendly)',
		name: 'filterConfig',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Filter Rules',
				name: 'rules',
				values: [
					{
						displayName: 'Filters',
						name: 'filters',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add filter',
						default: {},
						options: [
							{
								displayName: 'Filter Rule',
								name: 'filter',
								values: [
									{
										displayName: 'Column ID',
										name: 'columnId',
										type: 'string',
										required: true,
										default: '',
										description: 'The ID of the column to filter',
										placeholder: '1',
									},
									{
										displayName: 'Operator',
										name: 'operator',
										type: 'string',
										default: 'EQ',
										description:
											'The filter operator. Valid values: "EQ" (equals), "NEQ" (not equals), "GT" (greater than), "GTE" (greater or equal), "LT" (less than), "LTE" (less or equal), "LIKE" (contains)',
										placeholder: 'EQ',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'The filter value',
										placeholder: 'Filter value...',
									},
								],
							},
						],
						description: 'The filter rules for the view',
					},
				],
			},
		],
		description: 'Filter configuration for the view',
	},

	// Sort configuration for AI-Friendly operations
	{
		displayName: 'Sorting Configuration (AI-Friendly)',
		name: 'sortConfig',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sorting Rules',
				name: 'rules',
				values: [
					{
						displayName: 'Sorting',
						name: 'sorting',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add sorting',
						default: {},
						options: [
							{
								displayName: 'Sort Rule',
								name: 'sort',
								values: [
									{
										displayName: 'Column ID',
										name: 'columnId',
										type: 'string',
										required: true,
										default: '',
										description: 'The ID of the column to sort by',
										placeholder: '1',
									},
									{
										displayName: 'Direction',
										name: 'direction',
										type: 'string',
										default: 'ASC',
										description:
											'Sort direction. Valid values: "ASC" (ascending A-Z, 1-9), "DESC" (descending Z-A, 9-1)',
										placeholder: 'ASC',
									},
								],
							},
						],
						description: 'The sorting rules for the view',
					},
				],
			},
		],
		description: 'Sorting configuration for the view',
	},

	// ==============================================
	// ORIGINAL OPERATIONS - For regular UI users
	// ==============================================

	// Table ID for getAll, create
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
				resource: ['view'],
				operation: ['getAll', 'create'],
			},
		},
	},

	// View ID as resourceLocator for get, update, delete
	{
		displayName: 'View',
		name: 'viewId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select a view from the list or enter its ID',
		modes: [
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getViews',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'View ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Please enter a valid view ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['view'],
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
				resource: ['view'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the new view',
		placeholder: 'Enter view name...',
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
				resource: ['view'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'An optional emoji for the view',
		placeholder: '🔍',
	},

	// Description for create
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'An optional description for the view',
		placeholder: 'Description of the view...',
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
				resource: ['view'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new title of the view (optional)',
		placeholder: 'New view name...',
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
				resource: ['view'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new emoji for the view (optional)',
		placeholder: '🔍',
	},

	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new description of the view (optional)',
		placeholder: 'New description...',
	},

	// Filters for create/update
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add filter',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Filter Rule',
				name: 'rule',
				values: [
					{
						displayName: 'Column',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The column for the filter',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'string',
						default: 'EQ',
						description: 'The comparison operator',
						placeholder: 'EQ',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value for the comparison',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Filter rules for the view',
	},

	// Sorting for create/update
	{
		displayName: 'Sorting',
		name: 'sort',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add sorting',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sort Rule',
				name: 'rule',
				values: [
					{
						displayName: 'Column',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The column for sorting',
					},
					{
						displayName: 'Direction',
						name: 'mode',
						type: 'options',
						options: [
							{
								name: 'Ascending',
								value: 'ASC',
								description: 'From small to large (A-Z, 1-9)',
							},
							{
								name: 'Descending',
								value: 'DESC',
								description: 'From large to small (Z-A, 9-1)',
							},
						],
						default: 'ASC',
						description: 'The sorting direction',
					},
				],
			},
		],
		description: 'Sorting rules for the view',
	},
];

