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
				name: 'Spalte Erstellen (KI-Friendly)',
				value: 'createAIFriendly',
				description: 'Eine neue Spalte erstellen - optimiert für KI Agents',
				action: 'Spalte erstellen (KI-Friendly)',
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
	// ==============================================
	// KI-FRIENDLY OPERATIONS - ALLE Parameter verfügbar
	// ==============================================

	// Tabellen-ID (String-Eingabe für KI Agents)
	{
		displayName: 'Tabellen-ID (AI-Friendly)',
		name: 'tableIdAI',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Die ID der Tabelle in der die Spalte erstellt werden soll',
		placeholder: '123',
	},

	// Basis-Parameter (immer verfügbar)
	{
		displayName: 'Spaltentyp',
		name: 'columnType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
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

	{
		displayName: 'Spalten-Titel',
		name: 'columnTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Der Titel der neuen Spalte',
		placeholder: 'Meine Spalte',
	},

	{
		displayName: 'Beschreibung',
		name: 'columnDescription',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Optionale Beschreibung für die Spalte',
		placeholder: 'Beschreibung der Spalte...',
	},

	{
		displayName: 'Pflichtfeld',
		name: 'columnMandatory',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: false,
		description: 'Ob diese Spalte ein Pflichtfeld ist',
	},

	// TEXT-Parameter (immer verfügbar - nur relevant wenn columnType="text")
	{
		displayName: 'Text-Subtyp (nur für Typ "text")',
		name: 'textSubtype',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		options: [
			{
				name: 'Line (Einzeilig)',
				value: 'line',
				description: 'Einzeiliges Textfeld',
			},
			{
				name: 'Long Text (Mehrzeilig)',
				value: 'long',
				description: 'Mehrzeiliges Textfeld',
			},
		],
		default: 'line',
		description: 'Subtyp für Text-Spalten (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Text-Standard-Wert (nur für Typ "text")',
		name: 'textDefault',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Standard-Wert für neue Zeilen (wird ignoriert bei anderen Typen)',
		placeholder: 'Standard-Text...',
	},

	{
		displayName: 'Text-Maximale Länge (nur für Typ "text")',
		name: 'textMaxLength',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: 255,
		description: 'Maximale Zeichen-Anzahl (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Text-Validierungs-Pattern (nur für Typ "text")',
		name: 'textPattern',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Regex-Pattern zur Validierung (wird ignoriert bei anderen Typen)',
		placeholder: '^[A-Za-z0-9]+$',
	},

	// NUMBER-Parameter (immer verfügbar - nur relevant wenn columnType="number")
	{
		displayName: 'Zahlen-Standard-Wert (nur für Typ "number")',
		name: 'numberDefault',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: 0,
		description: 'Standard-Wert für neue Zeilen (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Zahlen-Minimum (nur für Typ "number")',
		name: 'numberMin',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Kleinster erlaubter Wert (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Zahlen-Maximum (nur für Typ "number")',
		name: 'numberMax',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Größter erlaubter Wert (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Zahlen-Dezimalstellen (nur für Typ "number")',
		name: 'numberDecimals',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: 0,
		description: 'Anzahl der Dezimalstellen (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Zahlen-Präfix (nur für Typ "number")',
		name: 'numberPrefix',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Text vor der Zahl, z.B. "€" (wird ignoriert bei anderen Typen)',
		placeholder: '€',
	},

	{
		displayName: 'Zahlen-Suffix (nur für Typ "number")',
		name: 'numberSuffix',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Text nach der Zahl, z.B. "kg" (wird ignoriert bei anderen Typen)',
		placeholder: 'kg',
	},

	// DATETIME-Parameter (immer verfügbar - nur relevant wenn columnType="datetime")
	{
		displayName: 'Datum-Standard-Wert (nur für Typ "datetime")',
		name: 'datetimeDefault',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Standard-Datum/Zeit in ISO 8601 Format oder "today" (wird ignoriert bei anderen Typen)',
		placeholder: '2024-01-01T12:00:00Z oder "today"',
	},

	// SELECTION-Parameter (immer verfügbar - nur relevant wenn columnType="selection")
	{
		displayName: 'Auswahl-Optionen JSON (nur für Typ "selection")',
		name: 'selectionOptions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'JSON-Array mit Auswahl-Optionen, z.B. ["Option 1", "Option 2"] (wird ignoriert bei anderen Typen)',
		placeholder: '["Option 1", "Option 2", "Option 3"]',
	},

	{
		displayName: 'Auswahl-Standard-Wert (nur für Typ "selection")',
		name: 'selectionDefault',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Standard-Auswahl (muss in den Optionen enthalten sein, wird ignoriert bei anderen Typen)',
		placeholder: 'Option 1',
	},

	{
		displayName: 'Mehrfach-Auswahl (nur für Typ "selection")',
		name: 'selectionMultiple',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: false,
		description: 'Ob mehrere Optionen gleichzeitig ausgewählt werden können (wird ignoriert bei anderen Typen)',
	},

	// USERGROUP-Parameter (immer verfügbar - nur relevant wenn columnType="usergroup")
	{
		displayName: 'Benutzer/Gruppen-Typ (nur für Typ "usergroup")',
		name: 'usergroupType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		options: [
			{
				name: 'User (Benutzer)',
				value: 'user',
				description: 'Nur Benutzer auswählbar',
			},
			{
				name: 'Group (Gruppen)',
				value: 'group',
				description: 'Nur Gruppen auswählbar',
			},
		],
		default: 'user',
		description: 'Art der Benutzer/Gruppen-Auswahl (wird ignoriert bei anderen Typen)',
	},

	{
		displayName: 'Benutzer/Gruppen-Standard-Wert (nur für Typ "usergroup")',
		name: 'usergroupDefault',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: '',
		description: 'Standard-Benutzer/Gruppe (wird ignoriert bei anderen Typen)',
		placeholder: 'admin',
	},

	{
		displayName: 'Mehrfach-Auswahl Benutzer/Gruppen (nur für Typ "usergroup")',
		name: 'usergroupMultiple',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['createAIFriendly'],
			},
		},
		default: false,
		description: 'Ob mehrere Benutzer/Gruppen gleichzeitig ausgewählt werden können (wird ignoriert bei anderen Typen)',
	},

	// ==============================================
	// ORIGINAL OPERATIONS - Für normale UI Nutzer
	// ==============================================

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

	// Typ für create
	{
		displayName: 'Spalten-Typ',
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
				description: 'Textspalte',
			},
			{
				name: 'Zahl',
				value: 'number',
				description: 'Zahlenspalte',
			},
			{
				name: 'Datum/Zeit',
				value: 'datetime',
				description: 'Datum- und Zeitspalte',
			},
			{
				name: 'Auswahl',
				value: 'selection',
				description: 'Auswahlliste',
			},
			{
				name: 'Benutzer/Gruppe',
				value: 'usergroup',
				description: 'Benutzer- oder Gruppenauswahl',
			},
		],
		default: 'text',
		description: 'Der Typ der Spalte',
	},

	// Mandatory für create
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

	// Text-spezifische Konfiguration für create
	{
		displayName: 'Text-Subtyp',
		name: 'textSubtype',
		type: 'options',
		options: [
			{
				name: 'Line (Einzeilig)',
				value: 'line',
				description: 'Einzeiliges Textfeld',
			},
			{
				name: 'Long Text (Mehrzeilig)',
				value: 'long',
				description: 'Mehrzeiliges Textfeld',
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
		description: 'Der Subtyp der Text-Spalte',
	},

	{
		displayName: 'Standard-Text',
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
		description: 'Standard-Wert für neue Zeilen',
		placeholder: 'Standard-Text...',
	},

	{
		displayName: 'Maximale Länge',
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
		description: 'Maximale Anzahl Zeichen (leer = unbegrenzt)',
	},

	{
		displayName: 'Validierungs-Pattern',
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
		description: 'Regex-Pattern zur Validierung (optional)',
		placeholder: '^[A-Za-z0-9]+$',
	},

	// Number-spezifische Konfiguration für create
	{
		displayName: 'Standard-Zahl',
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
		description: 'Standard-Wert für neue Zeilen',
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
		description: 'Kleinster erlaubter Wert (optional)',
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
		description: 'Größter erlaubter Wert (optional)',
	},

	{
		displayName: 'Dezimalstellen',
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
		description: 'Anzahl der Dezimalstellen',
	},

	{
		displayName: 'Präfix',
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
		default: '',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
				type: ['number'],
			},
		},
		description: 'Text nach der Zahl (z.B. "kg")',
		placeholder: 'kg',
	},

	// Datetime-spezifische Konfiguration für create
	{
		displayName: 'Standard-Datum',
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
		description: 'Standard-Datum/Zeit (ISO 8601 Format oder "today")',
		placeholder: '2024-01-01T12:00:00Z oder "today"',
	},

	// Selection-spezifische Konfiguration für create
	{
		displayName: 'Auswahl-Optionen',
		name: 'selectionOptions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Option hinzufügen',
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
						displayName: 'Wert',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Der Wert der Option',
						placeholder: 'Option eingeben...',
					},
				],
			},
		],
		description: 'Die verfügbaren Auswahl-Optionen',
	},

	{
		displayName: 'Standard-Auswahl',
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
		description: 'Standard-Auswahl (muss in den Optionen enthalten sein)',
		placeholder: 'Option 1',
	},

	{
		displayName: 'Mehrfach-Auswahl',
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
		description: 'Ob mehrere Optionen gleichzeitig ausgewählt werden können',
	},

	// UserGroup-spezifische Konfiguration für create
	{
		displayName: 'Benutzer/Gruppen-Typ',
		name: 'usergroupType',
		type: 'options',
		options: [
			{
				name: 'User (Benutzer)',
				value: 'user',
				description: 'Nur Benutzer auswählbar',
			},
			{
				name: 'Group (Gruppen)',
				value: 'group',
				description: 'Nur Gruppen auswählbar',
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
		description: 'Art der Benutzer/Gruppen-Auswahl',
	},

	{
		displayName: 'Standard-Benutzer/Gruppe',
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
		description: 'Standard-Benutzer/Gruppe',
		placeholder: 'admin',
	},

	{
		displayName: 'Mehrfach-Auswahl',
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
		description: 'Ob mehrere Benutzer/Gruppen gleichzeitig ausgewählt werden können',
	},

	// Felder für update
	{
		displayName: 'Titel',
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
		displayName: 'Beschreibung',
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