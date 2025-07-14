import { INodeProperties } from 'n8n-workflow';

export const rowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['row'],
			},
		},
		options: [
			{
				name: 'Get All Rows',
				value: 'getAll',
				description: 'Retrieve all rows from a table or view',
				action: 'Get all rows',
			},
			{
				name: 'Get Row',
				value: 'get',
				description: 'Retrieve a specific row',
				action: 'Get row',
			},
			{
				name: 'Create Row',
				value: 'create',
				description: 'Create a new row',
				action: 'Create row',
			},
			{
				name: 'Create Row (AI-Friendly)',
				value: 'createAIFriendly',
				description: 'Create a new row - optimized for AI Agents',
				action: 'Create row (AI-Friendly)',
			},
			{
				name: 'Get All Rows (AI-Friendly)',
				value: 'getAllAIFriendly',
				description:
					'Retrieve rows with advanced filter/sort options - optimized for AI Agents',
				action: 'Get all rows (AI-Friendly)',
			},
			{
				name: 'Update Row',
				value: 'update',
				description: 'Update a row',
				action: 'Update row',
			},
			{
				name: 'Update Row (AI-Friendly)',
				value: 'updateAIFriendly',
				description: 'Update a row - optimized for AI Agents',
				action: 'Update row (AI-Friendly)',
			},
		],
		default: 'getAll',
	},
];

export const rowFields: INodeProperties[] = [
	// ==============================================
	// AI-FRIENDLY OPERATIONS - All parameters available
	// ==============================================

	// Source for AI-Friendly operations
	{
		displayName: 'Data Source (AI-Friendly)',
		name: 'sourceConfig',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['createAIFriendly', 'getAllAIFriendly', 'updateAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Source',
				name: 'source',
				values: [
					{
						displayName: 'Source Type',
						name: 'type',
						type: 'string',
						required: true,
						default: 'table',
						description:
							'Choose whether to use a table or view. Valid values: "table", "view"',
						placeholder: 'table',
					},
					{
						displayName: 'Table ID',
						name: 'tableId',
						type: 'string',
						default: '',
						description: 'The ID of the table (only when type = "table")',
						placeholder: '123',
					},
					{
						displayName: 'View ID',
						name: 'viewId',
						type: 'string',
						default: '',
						description: 'The ID of the view (only when type = "view")',
						placeholder: '456',
					},
				],
			},
		],
		description: 'Configuration of the data source for the operation',
	},

	// Row data for createAIFriendly
	{
		displayName: 'Row Data (AI-Friendly)',
		name: 'rowDataConfig',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['createAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Data',
				name: 'data',
				values: [
					{
						displayName: 'Column Data',
						name: 'columns',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Column',
						default: {},
						options: [
							{
								displayName: 'Column',
								name: 'column',
								values: [
									{
										displayName: 'Column ID',
										name: 'columnId',
										type: 'string',
										required: true,
										default: '',
										description: 'The ID of the column',
										placeholder: '1',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'The value for this column',
										placeholder: 'Enter value...',
									},
								],
							},
						],
						description: 'The column data for the new row',
					},
				],
			},
		],
		description: 'Configuration of the row data',
	},

	// Update data for updateAIFriendly
	{
		displayName: 'Update Data (AI-Friendly)',
		name: 'updateDataConfig',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['updateAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Update Configuration',
				name: 'update',
				values: [
					{
						displayName: 'Row ID',
						name: 'rowId',
						type: 'string',
						required: true,
						default: '',
						description: 'The ID of the row to update',
						placeholder: '123',
					},
					{
						displayName: 'Table ID',
						name: 'tableId',
						type: 'string',
						required: true,
						default: '',
						description: 'The ID of the table (required for API path)',
						placeholder: '456',
					},
					{
						displayName: 'Column Data',
						name: 'columns',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Column',
						default: {},
						options: [
							{
								displayName: 'Column',
								name: 'column',
								values: [
									{
										displayName: 'Column ID',
										name: 'columnId',
										type: 'string',
										required: true,
										default: '',
										description: 'The ID of the column',
										placeholder: '1',
									},
									{
										displayName: 'New Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'The new value for this column',
										placeholder: 'New value...',
									},
								],
							},
						],
						description: 'The column data to update',
					},
				],
			},
		],
		description: 'Configuration for row update',
	},

	// Query options for getAllAIFriendly
	{
		displayName: 'Query Options (AI-Friendly)',
		name: 'queryConfig',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAllAIFriendly'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Query Configuration',
				name: 'query',
				values: [
					{
						displayName: 'Pagination',
						name: 'pagination',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								displayName: 'Pagination Settings',
								name: 'settings',
								values: [
									{
										displayName: 'Limit',
										name: 'limit',
										type: 'number',
										default: 50,
										description: 'Maximum number of rows',
									},
									{
										displayName: 'Offset',
										name: 'offset',
										type: 'number',
										default: 0,
										description: 'Number of rows to skip',
									},
								],
							},
						],
						description: 'Pagination settings',
					},
					{
						displayName: 'Filters',
						name: 'filters',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Filter',
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
										type: 'options',
										options: [
											{
												name: 'Equals (=)',
												value: 'equals',
												description: 'Exact match',
											},
											{
												name: 'Not Equals (!=)',
												value: 'not_equals',
												description: 'Not equal to',
											},
											{
												name: 'Greater Than (>)',
												value: 'greater_than',
												description: 'Greater than',
											},
											{
												name: 'Greater or Equal (>=)',
												value: 'greater_equal',
												description: 'Greater than or equal to',
											},
											{
												name: 'Less Than (<)',
												value: 'less_than',
												description: 'Less than',
											},
											{
												name: 'Less or Equal (<=)',
												value: 'less_equal',
												description: 'Less than or equal to',
											},
											{
												name: 'Contains (LIKE)',
												value: 'contains',
												description: 'Text contains value',
											},
											{
												name: 'Starts With',
												value: 'starts_with',
												description: 'Text starts with value',
											},
											{
												name: 'Ends With',
												value: 'ends_with',
												description: 'Text ends with value',
											},
											{
												name: 'Is Empty',
												value: 'is_empty',
												description: 'Field is empty',
											},
											{
												name: 'Is Not Empty',
												value: 'is_not_empty',
												description: 'Field has a value',
											},
										],
										default: 'equals',
										description: 'The filter operator',
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
						description: 'Filter rules for the query',
					},
					{
						displayName: 'Sorting',
						name: 'sorting',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						placeholder: 'Add Sorting',
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
										description: 'The ID of the column to sort',
										placeholder: '1',
									},
									{
										displayName: 'Direction',
										name: 'direction',
										type: 'options',
										options: [
											{
												name: 'Ascending (A-Z, 1-9)',
												value: 'ASC',
												description: 'Low to high',
											},
											{
												name: 'Descending (Z-A, 9-1)',
												value: 'DESC',
												description: 'High to low',
											},
										],
										default: 'ASC',
										description: 'Sorting direction',
									},
								],
							},
						],
						description: 'Sorting rules for the query',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								displayName: 'Search Settings',
								name: 'settings',
								values: [
									{
										displayName: 'Search Term',
										name: 'term',
										type: 'string',
										default: '',
										description: 'The search term',
										placeholder: 'Search term...',
									},
									{
										displayName: 'Column IDs for Search',
										name: 'columns',
										type: 'string',
										default: '',
										description: 'Comma-separated column IDs (empty = all)',
										placeholder: '1,3,5',
									},
									{
										displayName: 'Case Sensitive',
										name: 'caseSensitive',
										type: 'boolean',
										default: false,
										description: 'Whether to match case',
									},
								],
							},
						],
						description: 'Search configuration',
					},
				],
			},
		],
		description: 'Advanced query options for row retrieval',
	},

	// ==============================================
	// ORIGINAL OPERATIONS - For normal UI users
	// ==============================================

	// Node Collection for getAll, create
	{
		displayName: 'Source',
		name: 'nodeCollection',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll', 'create'],
			},
		},
		options: [
			{
				name: 'Table',
				value: 'tables',
				description: 'Fetch/create rows directly in a table',
			},
			{
				name: 'View',
				value: 'views',
				description: 'Fetch/create rows from a view',
			},
		],
		default: 'tables',
		description: 'Select whether to work with a table or view',
	},

	// Table ID for tables nodeCollection
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
							errorMessage: 'Please enter a valid Table ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll', 'create'],
				nodeCollection: ['tables'],
			},
		},
	},

	// View ID for views nodeCollection
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
							errorMessage: 'Please enter a valid View ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll', 'create'],
				nodeCollection: ['views'],
			},
		},
	},

	// Data for create - DIRECTLY after selecting table
	{
		displayName: 'Row Data',
		name: 'data',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Column',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Column',
				name: 'column',
				values: [
					{
						displayName: 'Column ID',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The ID of the column',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value for this column',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Data for the new row',
	},

	// Row ID for get, update
	{
		displayName: 'Row ID',
		name: 'rowId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['get', 'update'],
			},
		},
		default: '',
		description: 'The ID of the row',
		placeholder: '123',
		typeOptions: {
			canBeExpression: true,
		},
	},

	// Table ID for get, update (required for API path)
	{
		displayName: 'Table',
		name: 'tableId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The table containing the row',
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
							errorMessage: 'Please enter a valid Table ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['get', 'update'],
			},
		},
	},

	// Data for update
	{
		displayName: 'Update Row Data',
		name: 'data',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Column',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Column',
				name: 'column',
				values: [
					{
						displayName: 'Column ID',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The ID of the column',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The new value for this column',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Data to update',
	},

	// ============ FROM HERE: ONLY FOR getAll ============

	// Additional options for getAll - ONLY FOR getAll!
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'], // ONLY for getAll!
			},
		},
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
				description: 'Maximum number of rows returned',
				hint: 'Recommended: 50-200 for best performance. Maximum: 1000 rows per request.',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of rows to skip (for pagination)',
				hint: 'For page 2 with limit 50: Offset = 50. For page 3: Offset = 100.',
			},
			{
				displayName: 'Enable Filters',
				name: 'useFilters',
				type: 'boolean',
				default: false,
				description: 'Whether to apply filters',
				hint: 'Enable filters to retrieve only rows matching specific column values.',
			},
			{
				displayName: 'Enable Sorting',
				name: 'useSorting',
				type: 'boolean',
				default: false,
				description: 'Whether to apply sorting',
				hint: 'Sort rows by one or more columns (first rule has highest priority).',
			},
			{
				displayName: 'Enable Search',
				name: 'useSearch',
				type: 'boolean',
				default: false,
				description: 'Whether to apply text search',
				hint: 'Search text columns for specific terms.',
			},
		],
	},

	// Filter Configuration - ONLY FOR getAll!
	{
		displayName: 'Filter (enabled when "Enable Filters" is set)',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Filter Rule',
				name: 'filter',
				values: [
					{
						displayName: 'Column',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The column to filter on',
						hint: 'Select the column to apply the filter to.',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						default: 'equals',
						description: 'The filter operator',
						hint: 'Choose the comparison operator for the filter.',
						options: [
							{
								name: 'Equals (=)',
								value: 'equals',
								description: 'Exact match - finds only the specified value',
							},
							{
								name: 'Not Equals (!=)',
								value: 'not_equals',
								description:
									'Not equal - finds all values except the specified one',
							},
							{
								name: 'Greater Than (>)',
								value: 'greater_than',
								description: 'Greater than - for numbers and dates',
							},
							{
								name: 'Greater or Equal (>=)',
								value: 'greater_equal',
								description: 'Greater than or equal - for numbers and dates',
							},
							{
								name: 'Less Than (<)',
								value: 'less_than',
								description: 'Less than - for numbers and dates',
							},
							{
								name: 'Less or Equal (<=)',
								value: 'less_equal',
								description: 'Less than or equal - for numbers and dates',
							},
							{
								name: 'Contains (LIKE)',
								value: 'contains',
								description: 'Text contains the specified term (case-insensitive)',
							},
							{
								name: 'Starts With',
								value: 'starts_with',
								description: 'Text starts with the specified term',
							},
							{
								name: 'Ends With',
								value: 'ends_with',
								description: 'Text ends with the specified term',
							},
							{
								name: 'Is Empty',
								value: 'is_empty',
								description: 'Field is empty, null, or unset',
							},
							{
								name: 'Is Not Empty',
								value: 'is_not_empty',
								description: 'Field has a value (not empty, null, or unset)',
							},
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description:
							'The filter value (leave empty for "Is Empty" and "Is Not Empty" operators)',
						hint: 'For numbers: "42", for dates: "2024-01-01" or "2024-01-01T10:00:00Z", for text: any string. Leave empty for "Is Empty"/"Is Not Empty".',
						placeholder: 'Enter filter value...',
					},
				],
			},
		],
		description: 'Filter rules for the row query',
	},

	// Sorting Configuration - ONLY FOR getAll!
	{
		displayName: 'Sorting (enabled when "Enable Sorting" is set)',
		name: 'sorting',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Sorting',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sorting Rule',
				name: 'sort',
				values: [
					{
						displayName: 'Column',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'The column to sort by',
						hint: 'Select the column for sorting. First rule has highest priority.',
					},
					{
						displayName: 'Direction',
						name: 'direction',
						type: 'options',
						default: 'ASC',
						description: 'Sort direction',
						hint: 'ASC = A-Z, 1-9, oldest first. DESC = Z-A, 9-1, newest first.',
						options: [
							{
								name: 'Ascending (A-Z, 1-9)',
								value: 'ASC',
								description:
									'Alphabetically A-Z, numerically 1-9, date oldest to newest',
							},
							{
								name: 'Descending (Z-A, 9-1)',
								value: 'DESC',
								description:
									'Alphabetically Z-A, numerically 9-1, date newest to oldest',
							},
						],
					},
				],
			},
		],
		description: 'Sorting rules for the row query (first rule has highest priority)',
	},

	// Search Configuration - ONLY FOR getAll!
	{
		displayName: 'Search (enabled when "Enable Search" is set)',
		name: 'search',
		type: 'collection',
		placeholder: 'Configure Search',
		default: {},
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'The search term (searches all text columns)',
				hint: 'Enter a term to search in text columns.',
				placeholder: 'e.g. "Munich" or "project"',
			},
			{
				displayName: 'Search Only Specific Columns',
				name: 'searchColumns',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getColumns',
				},
				default: [],
				description: 'Search only these columns (empty = all text columns)',
				hint: 'Leave empty to search all text columns, or select specific columns.',
			},
			{
				displayName: 'Case Sensitive',
				name: 'caseSensitive',
				type: 'boolean',
				default: false,
				description: 'Whether search is case-sensitive',
				hint: 'Off: "Munich" also finds "munich". On: matches only exact case.',
			},
		],
		description: 'Full-text search in row data',
	},
];

