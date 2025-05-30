import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NextcloudTablesApi implements ICredentialType {
	name = 'nextcloudTablesApi';
	displayName = 'Nextcloud Tables API';
	documentationUrl = 'https://github.com/nextcloud/tables/blob/main/docs/API.md';
	properties: INodeProperties[] = [
		{
			displayName: 'Nextcloud URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://cloud.example.com',
			placeholder: 'https://ihre-nextcloud-instanz.de',
			description: 'Die URL Ihrer Nextcloud-Instanz (ohne /ocs/v2.php/apps/tables/api/)',
		},
		{
			displayName: 'Benutzername',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'max.mustermann',
			description: 'Ihr Nextcloud Benutzername',
		},
		{
			displayName: 'Passwort oder App Passwort',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Ihr Nextcloud Passwort oder ein App-Passwort (empfohlen). Bei 401-Fehlern erstellen Sie ein App-Passwort unter Einstellungen > Sicherheit > App-Passwörter.',
		},
	];
} 