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
				name: 'Alle Views Abrufen',
				value: 'getAll',
				description: 'Alle Views einer Tabelle abrufen',
				action: 'Alle Views abrufen',
			},
			{
				name: 'View Abrufen',
				value: 'get',
				description: 'Eine spezifische View abrufen',
				action: 'View abrufen',
			},
			{
				name: 'View Erstellen',
				value: 'create',
				description: 'Eine neue View erstellen',
				action: 'View erstellen',
			},
			{
				name: 'View Aktualisieren',
				value: 'update',
				description: 'Eine View aktualisieren',
				action: 'View aktualisieren',
			},
			{
				name: 'View Löschen',
				value: 'delete',
				description: 'Eine View löschen',
				action: 'View löschen',
			},
		],
		default: 'getAll',
	},
];

export const viewFields: INodeProperties[] = [
	// Tabellen-ID für getAll, create
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
				resource: ['view'],
				operation: ['getAll', 'create'],
			},
		},
	},

	// View-ID als resourceLocator für get, update, delete
	{
		displayName: 'View',
		name: 'viewId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie eine View aus der Liste oder geben Sie deren ID an',
		modes: [
			{
				displayName: 'Liste',
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
				placeholder: 'View-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige View-ID (Zahl) eingeben',
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
				resource: ['view'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel der neuen View',
		placeholder: 'View-Name eingeben...',
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
				resource: ['view'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Ein optionales Emoji für die View',
		placeholder: '🔍',
	},

	// Beschreibung für create
	{
		displayName: 'Beschreibung',
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
		description: 'Eine optionale Beschreibung für die View',
		placeholder: 'Beschreibung der View...',
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
				resource: ['view'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel der View (optional)',
		placeholder: 'Neuer View-Name...',
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
		description: 'Das neue Emoji für die View (optional)',
		placeholder: '🔍',
	},

	{
		displayName: 'Beschreibung',
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
		description: 'Die neue Beschreibung der View (optional)',
		placeholder: 'Neue Beschreibung...',
	},

	// Filter für create/update
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Filter hinzufügen',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Filter-Regel',
				name: 'rule',
				values: [
					{
						displayName: 'Spalte',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die Spalte für den Filter',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{
								name: 'Gleich',
								value: 'EQ',
								description: 'Wert ist gleich',
							},
							{
								name: 'Ungleich',
								value: 'NEQ',
								description: 'Wert ist ungleich',
							},
							{
								name: 'Größer als',
								value: 'GT',
								description: 'Wert ist größer als',
							},
							{
								name: 'Größer oder gleich',
								value: 'GTE',
								description: 'Wert ist größer oder gleich',
							},
							{
								name: 'Kleiner als',
								value: 'LT',
								description: 'Wert ist kleiner als',
							},
							{
								name: 'Kleiner oder gleich',
								value: 'LTE',
								description: 'Wert ist kleiner oder gleich',
							},
							{
								name: 'Enthält',
								value: 'LIKE',
								description: 'Wert enthält Text',
							},
						],
						default: 'EQ',
						description: 'Der Vergleichsoperator',
					},
					{
						displayName: 'Wert',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Der Wert für den Vergleich',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Filter-Regeln für die View',
	},

	// Sortierung für create/update
	{
		displayName: 'Sortierung',
		name: 'sort',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Sortierung hinzufügen',
		displayOptions: {
			show: {
				resource: ['view'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sortier-Regel',
				name: 'rule',
				values: [
					{
						displayName: 'Spalte',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die Spalte für die Sortierung',
					},
					{
						displayName: 'Richtung',
						name: 'mode',
						type: 'options',
						options: [
							{
								name: 'Aufsteigend',
								value: 'ASC',
								description: 'Von klein zu groß (A-Z, 1-9)',
							},
							{
								name: 'Absteigend',
								value: 'DESC',
								description: 'Von groß zu klein (Z-A, 9-1)',
							},
						],
						default: 'ASC',
						description: 'Die Sortierrichtung',
					},
				],
			},
		],
		description: 'Sortier-Regeln für die View',
	},
]; 