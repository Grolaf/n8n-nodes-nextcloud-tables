import { INodeProperties } from 'n8n-workflow';

export const shareOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['share'],
			},
		},
		options: [
			{
				name: 'Get All Shares',
				value: 'getAll',
				description: 'Retrieve all shares of a table',
				action: 'Get all shares',
			},
			{
				name: 'Create Share',
				value: 'create',
				description: 'Create a new share',
				action: 'Create share',
			},
			{
				name: 'Update Share',
				value: 'update',
				description: 'Update permissions of a share',
				action: 'Update share',
			},
			{
				name: 'Delete Share',
				value: 'delete',
				description: 'Delete a share',
				action: 'Delete share',
			},
		],
		default: 'getAll',
	},
];

export const shareFields: INodeProperties[] = [
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
			},
		],
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['getAll', 'create'],
			},
		},
	},

	// Share ID for update, delete
	{
		displayName: 'Share ID',
		name: 'shareId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the share (number)',
		placeholder: 'Enter Share ID...',
	},

	// Share Type for create
	{
		displayName: 'Share Type',
		name: 'shareType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'User',
				value: 'user',
				description: 'Share with a specific user',
			},
			{
				name: 'Group',
				value: 'group',
				description: 'Share with a user group',
			},
		],
		default: 'user',
		description: 'The type of share',
	},

	// Recipient for create - User
	{
		displayName: 'User',
		name: 'userReceiver',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['create'],
				shareType: ['user'],
			},
		},
		default: '',
		description: 'Select the user to share with',
		hint: 'All available Nextcloud users in your instance',
	},

	// Recipient for create - Group
	{
		displayName: 'Group',
		name: 'groupReceiver',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['create'],
				shareType: ['group'],
			},
		},
		default: '',
		description: 'Select the group to share with',
		hint: 'All available Nextcloud groups in your instance',
	},

	// Permissions for create and update
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Permissions',
				name: 'permission',
				values: [
					{
						displayName: 'Read',
						name: 'read',
						type: 'boolean',
						default: true,
						description: 'Permission to read table data',
					},
					{
						displayName: 'Create',
						name: 'create',
						type: 'boolean',
						default: false,
						description: 'Permission to create new rows',
					},
					{
						displayName: 'Update',
						name: 'update',
						type: 'boolean',
						default: false,
						description: 'Permission to edit existing rows',
					},
					{
						displayName: 'Delete',
						name: 'delete',
						type: 'boolean',
						default: false,
						description: 'Permission to delete rows',
					},
					{
						displayName: 'Manage',
						name: 'manage',
						type: 'boolean',
						default: false,
						description: 'Full access: modify structure, manage shares, etc.',
					},
				],
			},
		],
		description: 'Permissions for this share',
	},

	// Additional Options for create
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['share'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'Optional display name for the share',
				placeholder: 'Enter display name...',
			},
		],
	},
];

