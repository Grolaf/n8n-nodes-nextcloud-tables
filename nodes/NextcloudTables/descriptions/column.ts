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
				name: 'Alle Spalten Abrufen',
				value: 'getAll',
				description: 'Alle Spalten einer Tabelle abrufen',
				action: 'Alle Spalten abrufen',
			},
			{
				name: 'Spalte Abrufen',
				value: 'get',
				description: 'Eine spezifische Spalte abrufen',
				action: 'Spalte abrufen',
			},
			{
				name: 'Spalte Erstellen',
				value: 'create',
				description: 'Eine neue Spalte erstellen',
				action: 'Spalte erstellen',
			},
			{
				name: 'Spalte Aktualisieren',
				value: 'update',
				description: 'Eine Spalte aktualisieren',
				action: 'Spalte aktualisieren',
			},
			{
				name: 'Spalte Löschen',
				value: 'delete',
				description: 'Eine Spalte löschen',
				action: 'Spalte löschen',
			},
		],
		default: 'getAll',
	},
];

export const columnFields: INodeProperties[] = [
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
				resource: ['column'],
				operation: ['getAll', 'create'],
			},
		},
	},

	// Spalten-ID als resourceLocator für get, update, delete
	{
		displayName: 'Spalte',
		name: 'columnId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie eine Spalte aus der Liste oder geben Sie deren ID an',
		modes: [
			{
				displayName: 'Liste',
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
				placeholder: 'Spalten-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Spalten-ID (Zahl) eingeben',
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

	// Spaltentyp für create
	{
		displayName: 'Spaltentyp',
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
				description: 'Textspalte mit optionaler Pattern-Validierung',
			},
			{
				name: 'Zahl',
				value: 'number',
				description: 'Zahlenspalte mit Min/Max/Dezimalstellen',
			},
			{
				name: 'Datum/Zeit',
				value: 'datetime',
				description: 'Datum- und Zeitspalte',
			},
			{
				name: 'Auswahl',
				value: 'selection',
				description: 'Dropdown-Auswahl mit vordefinierten Optionen',
			},
			{
				name: 'Benutzer/Gruppe',
				value: 'usergroup',
				description: 'Benutzer-, Gruppen- oder Team-Auswahl',
			},
		],
		default: 'text',
		description: 'Der Typ der neuen Spalte',
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
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel der neuen Spalte',
		placeholder: 'Spalten-Name eingeben...',
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
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Eine optionale Beschreibung für die Spalte',
		placeholder: 'Beschreibung der Spalte...',
	},

	// Pflichtfeld für create
	{
		displayName: 'Pflichtfeld',
		name: 'mandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Ob diese Spalte ein Pflichtfeld ist',
	},

	// TEXT-spezifische Felder
	{
		displayName: 'Standard-Text',
		name: 'textDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		default: '',
		description: 'Standard-Wert für neue Zeilen',
		placeholder: 'Standard-Text...',
	},

	{
		displayName: 'Maximale Länge',
		name: 'textMaxLength',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		default: 255,
		description: 'Maximale Anzahl Zeichen (leer = unbegrenzt)',
		typeOptions: {
			minValue: 1,
			maxValue: 65535,
		},
	},

	{
		displayName: 'Validierungs-Pattern',
		name: 'textAllowedPattern',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['text'],
			},
		},
		default: '',
		description: 'Regex-Pattern zur Validierung (optional)',
		placeholder: '^[A-Za-z0-9]+$',
	},

	// NUMBER-spezifische Felder
	{
		displayName: 'Standard-Zahl',
		name: 'numberDefault',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: 0,
		description: 'Standard-Wert für neue Zeilen',
	},

	{
		displayName: 'Minimum',
		name: 'numberMin',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: '',
		description: 'Kleinster erlaubter Wert (optional)',
	},

	{
		displayName: 'Maximum',
		name: 'numberMax',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: '',
		description: 'Größter erlaubter Wert (optional)',
	},

	{
		displayName: 'Dezimalstellen',
		name: 'numberDecimals',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: 0,
		description: 'Anzahl der Dezimalstellen',
		typeOptions: {
			minValue: 0,
			maxValue: 10,
		},
	},

	{
		displayName: 'Präfix',
		name: 'numberPrefix',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: '',
		description: 'Text vor der Zahl (z.B. "€")',
		placeholder: '€',
	},

	{
		displayName: 'Suffix',
		name: 'numberSuffix',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		default: '',
		description: 'Text nach der Zahl (z.B. "kg")',
		placeholder: 'kg',
	},

	// DATETIME-spezifische Felder
	{
		displayName: 'Standard-Datum',
		name: 'datetimeDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['datetime'],
			},
		},
		default: '',
		description: 'Standard-Datum/Zeit (ISO 8601 Format oder "today")',
		placeholder: '2024-01-01T12:00:00Z oder "today"',
	},

	// SELECTION-spezifische Felder
	{
		displayName: 'Auswahloptionen',
		name: 'selectionOptions',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['selection'],
			},
		},
		default: '',
		description: 'Verfügbare Optionen (eine pro Zeile)',
		placeholder: 'Option 1\nOption 2\nOption 3',
	},

	{
		displayName: 'Standard-Auswahl',
		name: 'selectionDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['selection'],
			},
		},
		default: '',
		description: 'Standard-Auswahl für neue Zeilen',
	},

	// USERGROUP-spezifische Felder
	{
		displayName: 'Standard-Benutzer/Gruppe',
		name: 'usergroupDefault',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: '',
		description: 'Standard-Benutzer oder -Gruppe',
	},

	{
		displayName: 'Mehrfachauswahl',
		name: 'usergroupMultipleItems',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: false,
		description: 'Erlaubt die Auswahl mehrerer Benutzer/Gruppen',
	},

	{
		displayName: 'Benutzer auswählbar',
		name: 'usergroupSelectUsers',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: true,
		description: 'Erlaubt die Auswahl von Benutzern',
	},

	{
		displayName: 'Gruppen auswählbar',
		name: 'usergroupSelectGroups',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: true,
		description: 'Erlaubt die Auswahl von Gruppen',
	},

	{
		displayName: 'Teams auswählbar',
		name: 'usergroupSelectTeams',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: false,
		description: 'Erlaubt die Auswahl von Teams',
	},

	{
		displayName: 'Benutzerstatus anzeigen',
		name: 'showUserStatus',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['usergroup'],
			},
		},
		default: false,
		description: 'Zeigt den Online-Status der Benutzer an',
	},

	// UPDATE-Felder
	{
		displayName: 'Neuer Titel',
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
		description: 'Der neue Titel der Spalte (optional)',
		placeholder: 'Neuer Spalten-Name...',
	},

	{
		displayName: 'Neue Beschreibung',
		name: 'description',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neue Beschreibung der Spalte (optional)',
		placeholder: 'Neue Beschreibung...',
	},

	{
		displayName: 'Pflichtfeld',
		name: 'mandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		default: false,
		description: 'Ob diese Spalte ein Pflichtfeld ist',
	},
]; 