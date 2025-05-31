import { IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods, IRequestOptions, IDataObject } from 'n8n-workflow';
import { OCSResponse, Column } from '../interfaces';
import { DataFormatter, FormatOptions } from './data.formatter';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DebugHelper } from './debug.helper';
import { NodeOperationError } from 'n8n-workflow';

export class ApiHelper {
	/**
	 * API-Request an Nextcloud Tables
	 */
	static async makeApiRequest<T>(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		endpoint: string,
		body?: any,
		useQueryParams: boolean = false,
	): Promise<T> {
		const credentials = await context.getCredentials('nextcloudTablesApi');
		
		// Validiere Credentials
		if (!credentials) {
			throw new Error('Keine Nextcloud Tables API Credentials konfiguriert');
		}
		
		const baseUrl = credentials.serverUrl as string;
		
		// Validiere URL
		if (!baseUrl || typeof baseUrl !== 'string') {
			throw new Error('Nextcloud URL ist nicht konfiguriert oder ungültig');
		}
		
		// API v1 verwenden (nicht v2!)
		const cleanBaseUrl = baseUrl.replace(/\/$/, '');
		let url = `${cleanBaseUrl}/index.php/apps/tables/api/1${endpoint}`;
		
		// Validiere weitere Credentials
		if (!credentials.username || !credentials.password) {
			throw new Error('Benutzername oder Passwort ist nicht konfiguriert');
		}
		
		// Bei Query-Parametern: URL erweitern statt Body verwenden
		if (useQueryParams && body) {
			const queryParams = new URLSearchParams();
			Object.entries(body).forEach(([key, value]) => {
				if (value !== null && value !== undefined && value !== '') {
					queryParams.set(key, String(value));
				}
			});
			url += `?${queryParams.toString()}`;
			body = undefined; // Kein Body bei Query-Parametern
		}

		// 🐛 DEBUG: API Request
		DebugHelper.logApiRequest(method, url, body);
		const startTime = Date.now();

		const options: IRequestOptions = {
			method: method as IHttpRequestMethods,
			url,
			headers: {
				'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'OCS-APIRequest': 'true',
			},
			json: true,
			rejectUnauthorized: false,
		};

		if (body && !useQueryParams) {
			options.body = body;
		}

		// Debug-Logging für Requests
		console.log(`API Request ${method} ${url}:`, {
			status: 'pending',
			bodyPreview: body ? JSON.stringify(body).substring(0, 200) : 'no body',
		});

		try {
			const response = await context.helpers.request(options);
			
			// 🐛 DEBUG: API Response & Performance
			DebugHelper.logApiResponse(method, url, 200, {
				dataSize: response.data ? JSON.stringify(response.data).length : 0,
				headers: response.headers
			});
			DebugHelper.logPerformance(`API ${method} ${endpoint}`, startTime);

			// Debug-Logging für erfolgreiche Responses
			console.log(`API Request ${method} ${url}:`, {
				status: 200,
				bodyPreview: body ? JSON.stringify(body).substring(0, 200) : 'no body',
				responseHeaders: response.headers || 'no headers',
			});

			return response;
		} catch (error: any) {
			// 🐛 DEBUG: API Error
			DebugHelper.logError(`API ${method} ${url}`, error);

			// Debug-Logging für API-Fehler
			console.log(`API Error ${method} ${url}:`, {
				status: error.statusCode || 'unknown',
				url: url,
				requestBody: body ? JSON.stringify(body).substring(0, 200) : '',
				responseBody: error.response?.body,
				headers: error.response?.headers,
			});

			// Erweiterte Fehlerbehandlung
			if (error.statusCode) {
				switch (error.statusCode) {
					case 400:
						throw new Error(`Ungültige Anfrage (400). Prüfen Sie die übermittelten Daten.`);
					case 401:
						throw new Error(`Authentifizierung fehlgeschlagen (401). Prüfen Sie Benutzername und Passwort.`);
					case 403:
						throw new Error(`Zugriff verweigert (403). Prüfen Sie die Berechtigung für diese Aktion.`);
					case 404:
						throw new Error(`Ressource nicht gefunden (404). Prüfen Sie die URL und ob die Nextcloud Tables App installiert ist.`);
					case 409:
						throw new Error(`Konflikt (409). Die Ressource existiert bereits oder ist in Verwendung.`);
					case 422:
						throw new Error(`Daten können nicht verarbeitet werden (422). Prüfen Sie die Eingabevalidierung.`);
					case 429:
						throw new Error(`Zu viele Anfragen (429). Versuchen Sie es später erneut.`);
					case 500:
						throw new Error(`Serverfehler (500). Prüfen Sie die Nextcloud-Logs.`);
					case 502:
						throw new Error(`Bad Gateway (502). Nextcloud-Server nicht erreichbar.`);
					case 503:
						throw new Error(`Service nicht verfügbar (503). Nextcloud ist temporär nicht erreichbar.`);
					case 504:
						throw new Error(`Gateway Timeout (504). Anfrage dauerte zu lange.`);
					default:
						throw new Error(`API-Fehler (${error.statusCode}): ${error.message}`);
				}
			}

			throw new Error(`Unbekannter API-Fehler: ${error.message}`);
		}
	}

	/**
	 * Erstellt die Basis-URL für API-Endpunkte
	 */
	static getBaseUrl(serverUrl: string): string {
		return `${serverUrl.replace(/\/$/, '')}/ocs/v2.php/apps/tables/api/2`;
	}

	/**
	 * Validiert eine Tabellen-ID
	 */
	static validateTableId(tableId: any): number {
		const id = parseInt(tableId, 10);
		if (isNaN(id) || id <= 0) {
			throw new Error('Ungültige Tabellen-ID');
		}
		return id;
	}

	/**
	 * Validiert eine View-ID
	 */
	static validateViewId(viewId: any): number {
		const id = parseInt(viewId, 10);
		if (isNaN(id) || id <= 0) {
			throw new Error('Ungültige View-ID');
		}
		return id;
	}

	/**
	 * Validiert eine Spalten-ID
	 */
	static validateColumnId(columnId: any): number {
		const id = parseInt(columnId, 10);
		if (isNaN(id) || id <= 0) {
			throw new Error('Ungültige Spalten-ID');
		}
		return id;
	}

	/**
	 * Validiert eine Zeilen-ID
	 */
	static validateRowId(rowId: any): number {
		const id = parseInt(rowId, 10);
		if (isNaN(id) || id <= 0) {
			throw new Error('Ungültige Zeilen-ID');
		}
		return id;
	}

	/**
	 * Formatiert Zeilendaten für API-Requests
	 */
	static formatRowData(
		data: Record<string, any>, 
		columns?: Column[], 
		options: FormatOptions = {}
	): Record<string, any> {
		// Neue erweiterte Formatierung verwenden
		return DataFormatter.formatRowData(data, columns, options);
	}

	/**
	 * Formatiert Zeilendaten mit einfacher Fallback-Logik (Legacy)
	 */
	static formatRowDataSimple(data: Record<string, any>): Record<string, any> {
		const formattedData: Record<string, any> = {};
		
		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null && value !== '') {
				formattedData[key] = value;
			}
		}
		
		return formattedData;
	}

	/**
	 * Lädt Spalten-Informationen für eine Tabelle (Helper für Formatierung)
	 */
	static async getTableColumns(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		tableId: number
	): Promise<Column[]> {
		try {
			return await this.makeApiRequest<Column[]>(
				context,
				'GET',
				`/tables/${tableId}/columns`,
			);
		} catch (error) {
			// Falls Spalten nicht geladen werden können, Fallback ohne Spalten-Info
			return [];
		}
	}

	/**
	 * Konvertiert Resource Locator zu ID
	 */
	static getResourceId(resourceLocator: any): number {
		// 🐛 DEBUG: Resource Locator Input
		DebugHelper.logResourceLocator('input', {
			type: typeof resourceLocator,
			value: resourceLocator,
			isObject: typeof resourceLocator === 'object',
			keys: typeof resourceLocator === 'object' ? Object.keys(resourceLocator || {}) : [],
		});

		// ULTIMATE FIX: Alle möglichen NaN-Quellen abfangen
		if (resourceLocator === null || resourceLocator === undefined || 
			resourceLocator === 'null' || resourceLocator === 'undefined' ||
			resourceLocator === 'NaN' || 
			(typeof resourceLocator === 'number' && isNaN(resourceLocator))) {
			
			const errorMsg = `Resource Locator ist ungültig: ${JSON.stringify(resourceLocator)} (type: ${typeof resourceLocator})`;
			DebugHelper.logError('getResourceId.invalidInput', new Error(errorMsg));
			throw new Error('Resource Locator ist erforderlich aber nicht gesetzt oder ungültig');
		}

		if (typeof resourceLocator === 'number') {
			if (resourceLocator <= 0 || isNaN(resourceLocator)) {
				throw new Error('Ungültige ID: Muss eine positive Zahl sein');
			}
			DebugHelper.logResourceLocator('number', resourceLocator);
			return resourceLocator;
		}
		
		if (typeof resourceLocator === 'string') {
			if (resourceLocator.trim() === '') {
				throw new Error('Resource Locator ist leer - ID ist erforderlich');
			}
			const id = parseInt(resourceLocator, 10);
			if (isNaN(id) || id <= 0) {
				throw new Error(`Ungültige ID: "${resourceLocator}" ist keine gültige Zahl`);
			}
			DebugHelper.logResourceLocator('string->number', { input: resourceLocator, output: id });
			return id;
		}
		
		if (resourceLocator && typeof resourceLocator === 'object') {
			// Prüfe __rl Struktur
			if (resourceLocator.__rl === true) {
				const value = resourceLocator.value;
				const mode = resourceLocator.mode;
				
				if (!value || value === '') {
					throw new Error(`Resource Locator Value ist leer (mode: ${mode}) - Eine ID ist erforderlich`);
				}
				
				if (mode === 'id' || mode === 'list') {
					const id = parseInt(value, 10);
					if (isNaN(id) || id <= 0) {
						throw new Error(`Ungültige ID in Resource Locator: "${value}" ist keine gültige Zahl`);
					}
					DebugHelper.logResourceLocator(`object.${mode}`, { input: resourceLocator, output: id });
					return id;
				} else {
					throw new Error(`Unbekannter Resource Locator Mode: ${mode}`);
				}
			}
			
			// Legacy Format Support
			if (resourceLocator.mode && resourceLocator.value) {
				const value = resourceLocator.value;
				if (!value || value === '') {
					throw new Error(`Resource Locator Value ist leer - Eine ID ist erforderlich`);
				}
				const id = parseInt(value, 10);
				if (isNaN(id) || id <= 0) {
					throw new Error(`Ungültige ID: "${value}" ist keine gültige Zahl`);
				}
				DebugHelper.logResourceLocator('legacy', { input: resourceLocator, output: id });
				return id;
			}
		}
		
		// 🐛 DEBUG: Invalid Resource Locator
		DebugHelper.logError('getResourceId', new Error(`Ungültiger Resource Locator: ${JSON.stringify(resourceLocator)}`));
		throw new Error(`Ungültiger Resource Locator Format: ${JSON.stringify(resourceLocator)}`);
	}

	/**
	 * Prüft ob ein Fehler wiederholbar ist
	 */
	private static isNonRetryableError(error: any): boolean {
		// 4xx-Fehler (außer 408, 429) nicht wiederholen
		const statusCode = error.response?.status || error.statusCode;
		if (statusCode >= 400 && statusCode < 500 && statusCode !== 408 && statusCode !== 429) {
			return true;
		}
		
		// Spezifische Fehler nicht wiederholen
		const errorMessage = error.message?.toLowerCase() || '';
		if (errorMessage.includes('unauthorized') || 
			errorMessage.includes('forbidden') ||
			errorMessage.includes('not found')) {
			return true;
		}
		
		return false;
	}

	/**
	 * Sleep-Hilfsfunktion für Retry-Delays
	 */
	private static sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Verbesserte Fehlerbehandlung mit spezifischen HTTP-Status-Codes
	 */
	static handleApiError(error: any): never {
		const statusCode = error.response?.status || error.statusCode;
		const errorMessage = error.response?.body?.ocs?.meta?.message || error.message;
		
		switch (statusCode) {
			case 400:
				throw new Error(`Ungültige Anfrage: ${errorMessage || 'Überprüfen Sie Ihre Eingabedaten'}`);
			case 401:
				throw new Error(`Nicht autorisiert: ${errorMessage || 'Überprüfen Sie Ihre Anmeldedaten'}`);
			case 403:
				throw new Error(`Zugriff verweigert: ${errorMessage || 'Keine Berechtigung für diese Operation'}`);
			case 404:
				throw new Error(`Nicht gefunden: ${errorMessage || 'Die angeforderte Ressource existiert nicht'}`);
			case 409:
				throw new Error(`Konflikt: ${errorMessage || 'Die Ressource ist bereits vorhanden oder wird verwendet'}`);
			case 422:
				throw new Error(`Validierungsfehler: ${errorMessage || 'Die Eingabedaten sind ungültig'}`);
			case 429:
				throw new Error(`Zu viele Anfragen: ${errorMessage || 'Versuchen Sie es später erneut'}`);
			case 500:
				throw new Error(`Serverfehler: ${errorMessage || 'Ein interner Fehler ist aufgetreten'}`);
			case 502:
			case 503:
			case 504:
				throw new Error(`Dienst nicht verfügbar: ${errorMessage || 'Der Server ist vorübergehend nicht erreichbar'}`);
			default:
				throw new Error(`API-Fehler: ${errorMessage || 'Ein unbekannter Fehler ist aufgetreten'}`);
		}
	}

	/**
	 * Lädt alle verfügbaren Tabellen
	 */
	static async getTables(context: ILoadOptionsFunctions): Promise<any[]> {
		try {
			const tables = await this.makeApiRequest<any[]>(
				context,
				'GET',
				'/tables',
			);
			return tables || [];
		} catch (error: any) {
			console.error('Fehler beim Laden der Tabellen:', error.message);
			return [];
		}
	}

	/**
	 * Nextcloud Sharee API Request (für Benutzer-/Gruppensuche)
	 */
	static async nextcloudShareeApiRequest(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: string,
		endpoint: string,
		body: IDataObject = {},
	): Promise<IDataObject> {
		const credentials = await context.getCredentials('nextcloudTablesApi');
		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
		const username = credentials.username as string;
		const password = credentials.password as string;

		const url = `${serverUrl}/ocs/v2.php/apps/files_sharing/api/v1${endpoint}`;

		const config: AxiosRequestConfig = {
			method,
			url,
			headers: {
				'OCS-APIRequest': 'true',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			auth: {
				username,
				password,
			},
		};

		if (Object.keys(body).length > 0) {
			config.data = body;
		}

		try {
			const response: AxiosResponse = await axios(config);
			const data = response.data as { ocs?: { data?: IDataObject } };
			return data?.ocs?.data || (response.data as IDataObject);
		} catch (error: unknown) {
			const axiosError = error as { response?: { status?: number; data?: { ocs?: { meta?: { message?: string } } } } };
			DebugHelper.logError('nextcloudShareeApiRequest', axiosError);
			throw new NodeOperationError(
				context.getNode(),
				`Sharee API-Fehler: ${axiosError.response?.data?.ocs?.meta?.message || 'Unbekannter Fehler'}`
			);
		}
	}

	/**
	 * Nextcloud OCS Users API Request (für Benutzer-/Gruppenliste)
	 */
	static async nextcloudOcsUsersApiRequest(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: string,
		endpoint: string,
		body: IDataObject = {},
	): Promise<IDataObject> {
		const credentials = await context.getCredentials('nextcloudTablesApi');
		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
		const username = credentials.username as string;
		const password = credentials.password as string;

		const url = `${serverUrl}/ocs/v2.php/cloud${endpoint}`;

		const config: AxiosRequestConfig = {
			method,
			url,
			headers: {
				'OCS-APIRequest': 'true',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			auth: {
				username,
				password,
			},
		};

		if (Object.keys(body).length > 0) {
			config.data = body;
		}

		try {
			const response: AxiosResponse = await axios(config);
			const data = response.data as { ocs?: { data?: IDataObject } };
			return data?.ocs?.data || (response.data as IDataObject);
		} catch (error: unknown) {
			const axiosError = error as { response?: { status?: number; data?: { ocs?: { meta?: { message?: string } } } } };
			DebugHelper.logError('nextcloudOcsUsersApiRequest', axiosError);
			throw new NodeOperationError(
				context.getNode(),
				`OCS Users API-Fehler: ${axiosError.response?.data?.ocs?.meta?.message || 'Unbekannter Fehler'}`
			);
		}
	}
} 