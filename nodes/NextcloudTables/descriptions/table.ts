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
				name: 'Alle Tabellen Abrufen',
				value: 'getAll',
				description: 'Alle verfügbaren Tabellen abrufen',
				action: 'Alle Tabellen abrufen',
			},
			{
				name: 'Tabelle Abrufen',
				value: 'get',
				description: 'Eine spezifische Tabelle abrufen',
				action: 'Tabelle abrufen',
			},
			{
				name: 'Tabelle Erstellen',
				value: 'create',
				description: 'Eine neue Tabelle erstellen',
				action: 'Tabelle erstellen',
			},
			{
				name: 'Tabelle Aktualisieren',
				value: 'update',
				description: 'Eine Tabelle aktualisieren',
				action: 'Tabelle aktualisieren',
			},
			{
				name: 'Tabelle Löschen',
				value: 'delete',
				description: 'Eine Tabelle löschen',
				action: 'Tabelle löschen',
			},
		],
		default: 'getAll',
	},
];

export const tableFields: INodeProperties[] = [
	// Tabellen-ID als resourceLocator für get, update, delete
	{
		displayName: 'Tabelle',
		name: 'tableId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie eine Tabelle aus der Liste oder geben Sie deren ID an',
		modes: [
			{
				displayName: 'Liste',
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
				placeholder: 'Tabellen-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Tabellen-ID (Zahl) eingeben',
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

	// Titel für create
	{
		displayName: 'Titel',
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
		description: 'Der Titel der neuen Tabelle',
		placeholder: 'Tabellen-Name eingeben...',
	},

	// Emoji für create
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
		description: 'Ein optionales Emoji für die Tabelle',
		placeholder: '📊',
	},

	// Template für create
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
				name: 'Keine Vorlage',
				value: '',
				description: 'Erstelle eine leere Tabelle',
			},
			{
				name: 'Todo-Liste',
				value: 'todo',
				description: 'Erstelle eine Tabelle basierend auf der Todo-Vorlage',
			},
			{
				name: 'Mitarbeiter',
				value: 'employees',
				description: 'Erstelle eine Tabelle basierend auf der Mitarbeiter-Vorlage',
			},
			{
				name: 'Kunden',
				value: 'customers',
				description: 'Erstelle eine Tabelle basierend auf der Kunden-Vorlage',
			},
		],
		default: '',
		description: 'Wählen Sie eine Vorlage für die neue Tabelle',
	},

	// Zusätzliche Felder für update
	{
		displayName: 'Titel',
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
		description: 'Der neue Titel der Tabelle (optional)',
		placeholder: 'Neuer Tabellen-Name...',
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
		description: 'Das neue Emoji für die Tabelle (optional)',
		placeholder: '📊',
	},

	{
		displayName: 'Archiviert',
		name: 'archived',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['update'],
			},
		},
		default: false,
		description: 'Ob die Tabelle archiviert werden soll',
	},
]; 