import { INodeProperties } from 'n8n-workflow';

export const contextOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['context'],
			},
		},
		options: [
			{
				name: 'Alle Contexts Abrufen',
				value: 'getAll',
				description: 'Alle verfügbaren App-Contexts abrufen',
				action: 'Alle Contexts abrufen',
			},
			{
				name: 'Context Abrufen',
				value: 'get',
				description: 'Einen spezifischen App-Context abrufen',
				action: 'Context abrufen',
			},
			{
				name: 'Context-Tabellen Abrufen',
				value: 'getTables',
				description: 'Alle Tabellen eines Contexts abrufen',
				action: 'Context-Tabellen abrufen',
			},
			{
				name: 'Context-Pages Abrufen',
				value: 'getPages',
				description: 'Alle Pages eines Contexts abrufen',
				action: 'Context-Pages abrufen',
			},
		],
		default: 'getAll',
	},
];

export const contextFields: INodeProperties[] = [
	// Context-ID für get, getTables, getPages
	{
		displayName: 'Context-ID',
		name: 'contextId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['context'],
				operation: ['get', 'getTables', 'getPages'],
			},
		},
		default: '',
		description: 'Die ID des App-Contexts',
		placeholder: 'Context-ID eingeben...',
	},

	// Zusätzliche Optionen für getTables
	{
		displayName: 'Zusätzliche Optionen',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Option hinzufügen',
		displayOptions: {
			show: {
				resource: ['context'],
				operation: ['getTables'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Nur eigene Tabellen',
				name: 'onlyOwn',
				type: 'boolean',
				default: false,
				description: 'Nur Tabellen abrufen, die dem aktuellen Benutzer gehören',
			},
			{
				displayName: 'Archivierte einschließen',
				name: 'includeArchived',
				type: 'boolean',
				default: false,
				description: 'Auch archivierte Tabellen einschließen',
			},
		],
	},

	// Filter für getPages
	{
		displayName: 'Page-Filter',
		name: 'pageFilter',
		type: 'collection',
		placeholder: 'Filter hinzufügen',
		displayOptions: {
			show: {
				resource: ['context'],
				operation: ['getPages'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Seitentitel',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Nach Seitentitel filtern (Teilstring-Suche)',
				placeholder: 'Seitentitel eingeben...',
			},
			{
				displayName: 'Nur aktive Pages',
				name: 'activeOnly',
				type: 'boolean',
				default: false,
				description: 'Nur aktive/verfügbare Pages anzeigen',
			},
			{
				displayName: 'Sortierung',
				name: 'sort',
				type: 'options',
				default: 'title',
				description: 'Sortierung der Ergebnisse',
				options: [
					{
						name: 'Titel',
						value: 'title',
						description: 'Nach Titel sortieren',
					},
					{
						name: 'Erstellungsdatum',
						value: 'created',
						description: 'Nach Erstellungsdatum sortieren',
					},
					{
						name: 'Änderungsdatum',
						value: 'modified',
						description: 'Nach letzter Änderung sortieren',
					},
				],
			},
		],
	},
]; 