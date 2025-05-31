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
				name: 'Alle Zeilen Abrufen',
				value: 'getAll',
				description: 'Alle Zeilen einer Tabelle oder View abrufen',
				action: 'Alle Zeilen abrufen',
			},
			{
				name: 'Zeile Abrufen',
				value: 'get',
				description: 'Eine spezifische Zeile abrufen',
				action: 'Zeile abrufen',
			},
			{
				name: 'Zeile Erstellen',
				value: 'create',
				description: 'Eine neue Zeile erstellen',
				action: 'Zeile erstellen',
			},
			{
				name: 'Zeile Aktualisieren',
				value: 'update',
				description: 'Eine Zeile aktualisieren',
				action: 'Zeile aktualisieren',
			},
			{
				name: 'Zeile Löschen (Experimentell)',
				value: 'delete',
				description: 'Eine Zeile löschen - Testet verschiedene API-Endpunkte',
				action: 'Zeile löschen',
			},
		],
		default: 'getAll',
	},
];

export const rowFields: INodeProperties[] = [
	// Node Collection für getAll, create
	{
		displayName: 'Quelle',
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
				name: 'Tabelle',
				value: 'tables',
				description: 'Zeilen direkt aus einer Tabelle abrufen/erstellen',
			},
			{
				name: 'View',
				value: 'views',
				description: 'Zeilen aus einer View abrufen/erstellen',
			},
		],
		default: 'tables',
		description: 'Wählen Sie aus, ob Sie mit einer Tabelle oder View arbeiten möchten',
	},

	// Tabellen-ID für tables nodeCollection
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
				resource: ['row'],
				operation: ['getAll', 'create'],
				nodeCollection: ['tables'],
			},
		},
	},

	// View-ID für views nodeCollection
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
				resource: ['row'],
				operation: ['getAll', 'create'],
				nodeCollection: ['views'],
			},
		},
	},

	// Daten für create - DIREKT nach Tabellen-Auswahl!
	{
		displayName: 'Zeilen-Daten',
		name: 'data',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Spalte hinzufügen',
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
				displayName: 'Spalte',
				name: 'column',
				values: [
					{
						displayName: 'Spalten-ID',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die ID der Spalte',
					},
					{
						displayName: 'Wert',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Der Wert für diese Spalte',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Die Daten für die neue Zeile',
	},

	// Zeilen-ID für get, update, delete
	{
		displayName: 'Zeilen-ID',
		name: 'rowId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'Die ID der Zeile',
		placeholder: '123',
		typeOptions: {
			canBeExpression: true,
		},
	},

	// Tabellen-ID für get, update, delete (benötigt für API-Pfad)
	{
		displayName: 'Tabelle',
		name: 'tableId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Die Tabelle, die die Zeile enthält',
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
				resource: ['row'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// Daten für update
	{
		displayName: 'Zeilen-Daten Aktualisieren',
		name: 'data',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Spalte hinzufügen',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Spalte',
				name: 'column',
				values: [
					{
						displayName: 'Spalten-ID',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die ID der Spalte',
					},
					{
						displayName: 'Wert',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Der neue Wert für diese Spalte',
						typeOptions: {
							canBeExpression: true,
						},
					},
				],
			},
		],
		description: 'Die zu aktualisierenden Daten',
	},

	// ============ AB HIER: NUR FÜR getAll ============

	// Zusätzliche Optionen für getAll - NUR FÜR getAll!
	{
		displayName: 'Zusätzliche Optionen',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Option hinzufügen',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'], // NUR für getAll!
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
				description: 'Maximale Anzahl der zurückgegebenen Zeilen',
				hint: 'Empfohlen: 50-200 für optimale Performance. Maximum: 1000 Zeilen pro Anfrage.',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Anzahl der zu überspringenden Zeilen (für Pagination)',
				hint: 'Für Seite 2 mit Limit 50: Offset = 50. Für Seite 3: Offset = 100.',
			},
			{
				displayName: 'Filter aktivieren',
				name: 'useFilters',
				type: 'boolean',
				default: false,
				description: 'Ob Filter angewendet werden sollen',
				hint: 'Aktivieren Sie Filter um nur bestimmte Zeilen basierend auf Spalten-Werten abzurufen.',
			},
			{
				displayName: 'Sortierung aktivieren',
				name: 'useSorting',
				type: 'boolean',
				default: false,
				description: 'Ob Sortierung angewendet werden soll',
				hint: 'Sortieren Sie Zeilen nach einer oder mehreren Spalten (erste Regel hat höchste Priorität).',
			},
			{
				displayName: 'Suche aktivieren',
				name: 'useSearch',
				type: 'boolean',
				default: false,
				description: 'Ob Textsuche angewendet werden soll',
				hint: 'Durchsuchen Sie Text-Spalten nach bestimmten Begriffen.',
			},
		],
	},

	// Filter-Konfiguration - NUR FÜR getAll!
	{
		displayName: 'Filter (aktiviert wenn "Filter aktivieren" gesetzt ist)',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Filter hinzufügen',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'], // NUR für getAll!
			},
		},
		options: [
			{
				displayName: 'Filter-Regel',
				name: 'filter',
				values: [
					{
						displayName: 'Spalte',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die zu filternde Spalte',
						hint: 'Wählen Sie die Spalte aus, auf die der Filter angewendet werden soll.',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						default: 'equals',
						description: 'Der Filter-Operator',
						hint: 'Wählen Sie den Vergleichsoperator für den Filter.',
						options: [
							{
								name: 'Gleich (=)',
								value: 'equals',
								description: 'Exakte Übereinstimmung - findet nur genau den angegebenen Wert',
							},
							{
								name: 'Ungleich (!=)',
								value: 'not_equals',
								description: 'Nicht gleich - findet alle Werte außer dem angegebenen',
							},
							{
								name: 'Größer (>)',
								value: 'greater_than',
								description: 'Größer als - für Zahlen und Daten',
							},
							{
								name: 'Größer gleich (>=)',
								value: 'greater_equal',
								description: 'Größer oder gleich - für Zahlen und Daten',
							},
							{
								name: 'Kleiner (<)',
								value: 'less_than',
								description: 'Kleiner als - für Zahlen und Daten',
							},
							{
								name: 'Kleiner gleich (<=)',
								value: 'less_equal',
								description: 'Kleiner oder gleich - für Zahlen und Daten',
							},
							{
								name: 'Enthält (LIKE)',
								value: 'contains',
								description: 'Text enthält den angegebenen Begriff (Groß-/Kleinschreibung wird ignoriert)',
							},
							{
								name: 'Beginnt mit',
								value: 'starts_with',
								description: 'Text beginnt mit dem angegebenen Begriff',
							},
							{
								name: 'Endet mit',
								value: 'ends_with',
								description: 'Text endet mit dem angegebenen Begriff',
							},
							{
								name: 'Ist leer',
								value: 'is_empty',
								description: 'Feld ist leer, null oder nicht gesetzt',
							},
							{
								name: 'Ist nicht leer',
								value: 'is_not_empty',
								description: 'Feld hat einen Wert (nicht leer, null oder nicht gesetzt)',
							},
						],
					},
					{
						displayName: 'Wert',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Der Filter-Wert (leer lassen für Operatoren "ist leer" und "ist nicht leer")',
						hint: 'Für Zahlen: "42", für Daten: "2024-01-01" oder "2024-01-01T10:00:00Z", für Text: beliebiger Text. Bei "ist leer"/"ist nicht leer" dieses Feld leer lassen.',
						placeholder: 'Filter-Wert eingeben...',
					},
				],
			},
		],
		description: 'Filter-Regeln für die Zeilen-Abfrage',
	},

	// Sortierung-Konfiguration - NUR FÜR getAll!
	{
		displayName: 'Sortierung (aktiviert wenn "Sortierung aktivieren" gesetzt ist)',
		name: 'sorting',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Sortierung hinzufügen',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'], // NUR für getAll!
			},
		},
		options: [
			{
				displayName: 'Sortier-Regel',
				name: 'sort',
				values: [
					{
						displayName: 'Spalte',
						name: 'columnId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getColumns',
						},
						default: '',
						description: 'Die zu sortierende Spalte',
						hint: 'Wählen Sie die Spalte für die Sortierung. Bei mehreren Regeln hat die erste höchste Priorität.',
					},
					{
						displayName: 'Richtung',
						name: 'direction',
						type: 'options',
						default: 'ASC',
						description: 'Sortier-Richtung',
						hint: 'ASC = A-Z, 1-9, älteste zuerst. DESC = Z-A, 9-1, neueste zuerst.',
						options: [
							{
								name: 'Aufsteigend (A-Z, 1-9)',
								value: 'ASC',
								description: 'Alphabetisch A-Z, numerisch 1-9, Datum alt zu neu',
							},
							{
								name: 'Absteigend (Z-A, 9-1)',
								value: 'DESC',
								description: 'Alphabetisch Z-A, numerisch 9-1, Datum neu zu alt',
							},
						],
					},
				],
			},
		],
		description: 'Sortier-Regeln für die Zeilen-Abfrage (erste Regel hat höchste Priorität)',
	},

	// Suche-Konfiguration - NUR FÜR getAll!
	{
		displayName: 'Suche (aktiviert wenn "Suche aktivieren" gesetzt ist)',
		name: 'search',
		type: 'collection',
		placeholder: 'Suche konfigurieren',
		default: {},
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'], // NUR für getAll!
			},
		},
		options: [
			{
				displayName: 'Suchbegriff',
				name: 'term',
				type: 'string',
				default: '',
				description: 'Der Suchbegriff (durchsucht alle Text-Spalten)',
				hint: 'Geben Sie einen Begriff ein, der in den Text-Spalten gesucht werden soll.',
				placeholder: 'z.B. "München" oder "projekt"',
			},
			{
				displayName: 'Nur spezifische Spalten durchsuchen',
				name: 'searchColumns',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getColumns',
				},
				default: [],
				description: 'Nur diese Spalten durchsuchen (leer = alle Text-Spalten)',
				hint: 'Lassen Sie dies leer um alle Text-Spalten zu durchsuchen, oder wählen Sie spezifische Spalten.',
			},
			{
				displayName: 'Groß-/Kleinschreibung beachten',
				name: 'caseSensitive',
				type: 'boolean',
				default: false,
				description: 'Ob bei der Suche die Groß-/Kleinschreibung beachtet werden soll',
				hint: 'Deaktiviert: "München" findet auch "münchen". Aktiviert: nur exakte Schreibweise.',
			},
		],
		description: 'Volltext-Suche in den Zeilen-Daten',
	},
]; 