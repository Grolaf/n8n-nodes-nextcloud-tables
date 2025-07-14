import { INodeProperties } from 'n8n-workflow';

export const columnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['column'],
			},
		},
		options: [
			{
				name: 'Get All Columns',
				value: 'getAll',
				description: 'Retrieve all columns of a table',
				action: 'Get all columns',
			},
			{
				name: 'Get Column',
				value: 'get',
				description: 'Retrieve a specific column',
				action: 'Get column',
			},
			{
				name: 'Create Column',
				value: 'create',
				description: 'Create a new column',
				action: 'Create column',
			},
			{
				name: 'Create Column (AI-Friendly)',
				value: 'createAIFriendly',
				description: 'Create a new column optimized for AI agents',
				action: 'Create column (AI-Friendly)',
			},
			{
				name: 'Update Column',
				value: 'update',
				description: 'Update a column',
				action: 'Update column',
			},
			{
				name: 'Update Column (AI-Friendly)',
				value: 'updateAIFriendly',
				description: 'Fully update a column optimized for AI agents',
				action: 'Update column (AI-Friendly)',
			},
			{
				name: 'Delete Column',
				value: 'delete',
				description: 'Delete a column',
				action: 'Delete column',
			},
		],
		default: 'getAll',
	},
];

export const columnFields: INodeProperties[] = [
	// ==============================================
	// AI-FRIENDLY OPERATIONS - All parameters available
	// ==============================================

	// Table ID (string input for AI Agents - only for CREATE)
	{
		displayName: 'tableIdAI',
		name: 'tableIdAI',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description:
			'The ID of the table where the column should be created (used only for createAIFriendly operation, ignored otherwise)',
		placeholder: '123',
	},

	// Base parameters (always available)
	{
		displayName: 'columnType',
		name: 'columnType',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 'text',
		description:
			'Type of the column (required for createAIFriendly, optional for updateAIFriendly, ignored otherwise). Valid values: "text", "number", "datetime", "selection", "usergroup"',
		placeholder: 'text',
	},

	{
		displayName: 'columnTitle',
		name: 'columnTitle',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'The title of the column (required for createAIFriendly, optional for updateAIFriendly, ignored otherwise)',
		placeholder: 'My Column',
	},

	{
		displayName: 'columnDescription',
		name: 'columnDescription',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Optional description for the column (used in createAIFriendly/updateAIFriendly operations, ignored otherwise)',
		placeholder: 'Description of the column...',
	},

	{
		displayName: 'columnMandatory',
		name: 'columnMandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: false,
		description:
			'Whether this column is required (used in createAIFriendly/updateAIFriendly operations, ignored otherwise)',
	},

	// TEXT parameters (always available - only relevant if columnType="text")
	{
		displayName: 'textSubtypeAI',
		name: 'textSubtypeAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 'line',
		description:
			'Subtype for text columns (ignored for other types, used in createAIFriendly/updateAIFriendly operations). Valid values: "line" (single line), "long" (multiline)',
		placeholder: 'line',
	},

	{
		displayName: 'textDefaultAI',
		name: 'textDefaultAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Default value for new rows (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: 'Default text...',
	},

	{
		displayName: 'textMaxLengthAI',
		name: 'textMaxLengthAI',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 255,
		description:
			'Maximum number of characters (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	{
		displayName: 'textPatternAI',
		name: 'textPatternAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Regex pattern for validation (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: '^[A-Za-z0-9]+$',
	},

	// NUMBER parameters (always available - only relevant if columnType="number")
	{
		displayName: 'numberDefaultAI',
		name: 'numberDefaultAI',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 0,
		description:
			'Default value for new rows (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	{
		displayName: 'numberMinAI',
		name: 'numberMinAI',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Minimum allowed value (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	{
		displayName: 'numberMaxAI',
		name: 'numberMaxAI',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Maximum allowed value (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	{
		displayName: 'numberDecimalsAI',
		name: 'numberDecimalsAI',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 0,
		description:
			'Number of decimal places (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	{
		displayName: 'numberPrefixAI',
		name: 'numberPrefixAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Text before the number, e.g. "€" (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: '€',
	},

	{
		displayName: 'numberSuffixAI',
		name: 'numberSuffixAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Text after the number, e.g. "kg" (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: 'kg',
	},

	// DATETIME parameters (always available - only relevant if columnType="datetime")
	{
		displayName: 'datetimeDefaultAI',
		name: 'datetimeDefaultAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Default date/time in ISO 8601 format or "today" (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: '2024-01-01T12:00:00Z or "today"',
	},

	// SELECTION parameters (always available - only relevant if columnType="selection")
	{
		displayName: 'selectionOptionsAI',
		name: 'selectionOptionsAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'JSON array with selection options, e.g. ["Option 1", "Option 2"] (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: '["Option 1", "Option 2", "Option 3"]',
	},

	{
		displayName: 'selectionDefaultAI',
		name: 'selectionDefaultAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Default selection (must be one of the options, ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: 'Option 1',
	},

	{
		displayName: 'selectionMultipleAI',
		name: 'selectionMultipleAI',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: false,
		description:
			'Whether multiple options can be selected (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	// USERGROUP parameters (always available - only relevant if columnType="usergroup")
	{
		displayName: 'usergroupTypeAI',
		name: 'usergroupTypeAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: 'user',
		description:
			'Type of user/group selection (ignored for other types, used in createAIFriendly/updateAIFriendly operations). Valid values: "user", "group"',
		placeholder: 'user',
	},

	{
		displayName: 'usergroupDefaultAI',
		name: 'usergroupDefaultAI',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: '',
		description:
			'Default user/group (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
		placeholder: 'admin',
	},

	{
		displayName: 'usergroupMultipleAI',
		name: 'usergroupMultipleAI',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly', 'updateAIFriendly'],
			},
		},
		default: false,
		description:
			'Whether multiple users/groups can be selected (ignored for other types, used in createAIFriendly/updateAIFriendly operations)',
	},

	// COLUMN-ID for updateAIFriendly (String input for AI Agents)
	{
		displayName: 'columnIdAI',
		name: 'columnIdAI',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['updateAIFriendly'],
			},
		},
		default: '',
		description:
			'ID of the column to update (only used for updateAIFriendly operation, ignored otherwise)',
		placeholder: '456',
	},

	// ==============================================
	// ORIGINAL OPERATIONS - For standard UI users
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
							errorMessage: 'Please enter a valid Table ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['getAll', 'create'],
			},
		},
	},

	// Column ID as resourceLocator for get, update, delete
	{
		displayName: 'Column',
		name: 'columnId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select a column from the list or enter its ID',
		modes: [
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getColumns',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Column ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Please enter a valid Column ID (number)',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['column'],
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
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the new column',
		placeholder: 'Enter column name...',
	},

	// Description for create
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'An optional description for the column',
		placeholder: 'Column description...',
	},

	// Type for create
	{
		displayName: 'Column Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Text',
				value: 'text',
				description: 'Text column',
			},
			{
				name: 'Number',
				value: 'number',
				description: 'Number column',
			},
			{
				name: 'Date/Time',
				value: 'datetime',
				description: 'Date and time column',
			},
			{
				name: 'Selection',
				value: 'selection',
				description: 'Dropdown selection list',
			},
			{
				name: 'User/Group',
				value: 'usergroup',
				description: 'User or group selection',
			},
		],
		default: 'text',
		description: 'The type of the column',
	},

	// Mandatory for create
	{
		displayName: 'Required Field',
		name: 'mandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether this column is a required field',
	},

	// Text-specific configuration for create
	{
		displayName: 'Text Subtype',
		name: 'textSubtype',
		type: 'options',
		options: [
			{
				name: 'Line (Single line)',
				value: 'line',
				description: 'Single-line text field',
			},
			{
				name: 'Long Text (Multiline)',
				value: 'long',
				description: 'Multiline text field',
			},
		],
		default: 'line',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		description: 'The subtype of the text column',
	},

	{
		displayName: 'Default Text',
		name: 'textDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		description: 'Default value for new rows',
		placeholder: 'Default text...',
	},

	{
		displayName: 'Maximum Length',
		name: 'textMaxLength',
		type: 'number',
		default: 255,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		description: 'Maximum number of characters (empty = unlimited)',
	},

	{
		displayName: 'Validation Pattern',
		name: 'textAllowedPattern',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		description: 'Regex pattern for validation (optional)',
		placeholder: '^[A-Za-z0-9]+$',
	},

	// Number-specific configuration for create
	{
		displayName: 'Default Number',
		name: 'numberDefault',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Default value for new rows',
	},

	{
		displayName: 'Minimum',
		name: 'numberMin',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Minimum allowed value (optional)',
	},

	{
		displayName: 'Maximum',
		name: 'numberMax',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Maximum allowed value (optional)',
	},

	{
		displayName: 'Decimal Places',
		name: 'numberDecimals',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Number of decimal places',
	},

	{
		displayName: 'Prefix',
		name: 'numberPrefix',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Text before the number (e.g. "€")',
		placeholder: '€',
	},

	{
		displayName: 'Suffix',
		name: 'numberSuffix',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Text after the number (e.g. "kg")',
		placeholder: 'kg',
	},

	// Datetime-specific configuration for create
	{
		displayName: 'Default Date',
		name: 'datetimeDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['datetime'],
			},
		},
		description: 'Default date/time (ISO 8601 format or "today")',
		placeholder: '2024-01-01T12:00:00Z or "today"',
	},

	// Selection-specific configuration for create
	{
		displayName: 'Selection Options',
		name: 'selectionOptions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['selection'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Option',
				name: 'option',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value of the option',
						placeholder: 'Enter option...',
					},
				],
			},
		],
		description: 'The available selection options',
	},

	{
		displayName: 'Default Selection',
		name: 'selectionDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['selection'],
			},
		},
		description: 'Default selection (must be included in the options)',
		placeholder: 'Option 1',
	},

	{
		displayName: 'Multiple Selection',
		name: 'selectionMultiple',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['selection'],
			},
		},
		description: 'Whether multiple options can be selected at the same time',
	},

	// UserGroup-specific configuration for create
	{
		displayName: 'User/Group Type',
		name: 'usergroupType',
		type: 'options',
		options: [
			{
				name: 'User',
				value: 'user',
				description: 'Only users selectable',
			},
			{
				name: 'Group',
				value: 'group',
				description: 'Only groups selectable',
			},
		],
		default: 'user',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		description: 'Type of user/group selection',
	},

	{
		displayName: 'Default User/Group',
		name: 'usergroupDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		description: 'Default user/group',
		placeholder: 'admin',
	},

	{
		displayName: 'Multiple Selection',
		name: 'usergroupMultiple',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		description: 'Whether multiple users/groups can be selected at the same time',
	},

	// Fields for update
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new title of the column (optional)',
		placeholder: 'Enter new column name...',
	},

	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new description of the column (optional)',
		placeholder: 'New description...',
	},

	{
		displayName: 'Required Field',
		name: 'mandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		default: false,
		description: 'Whether this column is a required field',
	},
];

