import { INodeProperties } from 'n8n-workflow';

export const importOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['import'],
			},
		},
		options: [
			{
				name: 'CSV Import',
				value: 'importCsv',
				description: 'Import a CSV file into a table',
				action: 'Import CSV file',
			},
			{
				name: 'Check Import Status',
				value: 'getImportStatus',
				description: 'Check the status of an ongoing import',
				action: 'Check import status',
			},
		],
		default: 'importCsv',
	},
];

export const importFields: INodeProperties[] = [
	// Table ID for Import
	{
		displayName: 'Table',
		name: 'tableId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select a table from the list or specify its ID',
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
				resource: ['import'],
				operation: ['importCsv'],
			},
		},
	},

	// CSV File
	{
		displayName: 'CSV File',
		name: 'csvFile',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['importCsv'],
			},
		},
		default: '',
		description: 'The CSV file to import (file content or file path)',
		placeholder: 'CSV file content or path...',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
	},

	// Import Options
	{
		displayName: 'Import Options',
		name: 'importOptions',
		type: 'collection',
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['importCsv'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'First Row Contains Headers',
				name: 'hasHeader',
				type: 'boolean',
				default: true,
				description: 'Whether the first row of the CSV file contains column headers',
			},
			{
				displayName: 'Delimiter',
				name: 'delimiter',
				type: 'options',
				default: ',',
				description: 'The delimiter for CSV columns',
				options: [
					{ name: 'Comma (,)', value: ',' },
					{ name: 'Semicolon (;)', value: ';' },
					{ name: 'Tab', value: '\t' },
					{ name: 'Pipe (|)', value: '|' },
					{ name: 'Custom', value: 'custom' },
				],
			},
			{
				displayName: 'Custom Delimiter',
				name: 'customDelimiter',
				type: 'string',
				default: '',
				description: 'Custom delimiter (only relevant if Delimiter is set to "Custom")',
				placeholder: 'e.g. | or ;',
			},
			{
				displayName: 'Text Qualifier',
				name: 'textQualifier',
				type: 'options',
				default: '"',
				description: 'Character used to enclose text values',
				options: [
					{ name: 'Quote (")', value: '"' },
					{ name: "Apostrophe (')", value: "'" },
					{ name: 'None', value: '' },
				],
			},
			{
				displayName: 'Skip Empty Rows',
				name: 'skipEmptyRows',
				type: 'boolean',
				default: true,
				description: 'Whether to skip empty rows during import',
			},
			{
				displayName: 'Skip Invalid Rows',
				name: 'skipInvalidRows',
				type: 'boolean',
				default: false,
				description: 'Whether to skip rows with errors instead of aborting the import',
			},
		],
	},

	// Column Mapping
	{
		displayName: 'Column Mapping',
		name: 'columnMapping',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['importCsv'],
			},
		},
		default: {},
		placeholder: 'Add column mapping',
		options: [
			{
				displayName: 'Column Mapping',
				name: 'mapping',
				values: [
					{
						displayName: 'CSV Column',
						name: 'csvColumn',
						type: 'string',
						default: '',
						description: 'Name or index of the CSV column (if index: 0, 1, 2, ...)',
						placeholder: 'e.g. "Name" or "0"',
					},
					{
						displayName: 'Table Column',
						name: 'tableColumn',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Target column in the Nextcloud table',
					},
					{
						displayName: 'Data Type Conversion',
						name: 'dataType',
						type: 'options',
						default: 'auto',
						description: 'How the data should be converted',
						options: [
							{
								name: 'Automatic',
								value: 'auto',
								description: 'Automatic detection based on column type',
							},
							{
								name: 'Text',
								value: 'text',
								description: 'Treat as text',
							},
							{
								name: 'Number',
								value: 'number',
								description: 'Treat as number',
							},
							{
								name: 'Date',
								value: 'datetime',
								description: 'Treat as date/time',
							},
							{
								name: 'Boolean',
								value: 'boolean',
								description: 'Treat as true/false',
							},
						],
					},
				],
			},
		],
		description:
			'Mapping between CSV columns and table columns (optional - without mapping, columns are matched automatically)',
	},

	// Import ID for Status Check
	{
		displayName: 'Import ID',
		name: 'importId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['getImportStatus'],
			},
		},
		default: '',
		description: 'The ID of the import to check',
		placeholder: 'Enter Import ID...',
	},
];

