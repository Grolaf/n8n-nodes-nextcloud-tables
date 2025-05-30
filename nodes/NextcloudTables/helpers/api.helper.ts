import { IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { OCSResponse, Column } from '../interfaces';
import { DataFormatter, FormatOptions } from './data.formatter';

export class ApiHelper {
	/**
	 * Führt eine API-Anfrage an die Nextcloud Tables API aus
	 */
	static async makeApiRequest<T>(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: string,
		endpoint: string,
		body?: any,
		headers?: Record<string, string>
	): Promise<T> {
		const credentials = await context.getCredentials('nextcloudTablesApi');
		if (!credentials) {
			throw new Error('Keine Nextcloud Tables API Credentials konfiguriert');
		}

		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
		const username = credentials.username as string;
		const password = credentials.password as string;

		const url = `${serverUrl}/ocs/v2.php/apps/tables/api/2${endpoint}`;

		const requestOptions: any = {
			method: method as IHttpRequestMethods,
			url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'OCS-APIRequest': 'true',
				'User-Agent': 'n8n-nextcloud-tables/2.0.5',
				...headers,
			},
			auth: {
				username,
				password,
			},
			json: true,
			resolveWithFullResponse: true,
		};

		if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
			requestOptions.body = body;
		}

		if (method === 'GET' && body) {
			requestOptions.qs = body;
		}

		try {
			const response = await context.helpers.request(requestOptions);
			
			// Debug-Logging für Troubleshooting
			console.log(`API Request ${method} ${url}:`, {
				status: response.statusCode,
				bodyPreview: JSON.stringify(body).substring(0, 200),
				responseHeaders: response.headers,
			});
			
			// Prüfe auf OCS-Response-Format
			if (response.body && response.body.ocs) {
				const ocsResponse = response.body as OCSResponse<T>;
				if (ocsResponse.ocs.meta.statuscode >= 200 && ocsResponse.ocs.meta.statuscode < 300) {
					return ocsResponse.ocs.data;
				} else {
					throw new Error(`API Fehler (${ocsResponse.ocs.meta.statuscode}): ${ocsResponse.ocs.meta.message || 'Unbekannter Fehler'}`);
				}
			}
			
			return response.body as T;
		} catch (error: any) {
			// Erweiterte Fehlerbehandlung
			let errorMessage = 'Unbekannter API-Fehler';
			
			if (error.response) {
				const status = error.response.statusCode || error.statusCode;
				const responseBody = error.response.body;
				
				// Debug-Logging für detaillierte Fehleranalyse
				console.error(`API Error ${method} ${url}:`, {
					status,
					url,
					requestBody: body,
					responseBody: responseBody,
					headers: error.response.headers,
				});
				
				if (responseBody?.ocs?.meta?.message) {
					errorMessage = `Nextcloud Tables API Fehler (${status}): ${responseBody.ocs.meta.message}`;
				} else if (typeof responseBody === 'string' && responseBody.includes('<message>')) {
					// Parse XML-Error-Message
					const messageMatch = responseBody.match(/<message>(.*?)<\/message>/);
					if (messageMatch) {
						errorMessage = `Nextcloud API Fehler (${status}): ${messageMatch[1]}`;
					}
				} else if (status === 401) {
					errorMessage = 'Authentifizierung fehlgeschlagen. Prüfen Sie Ihre Credentials oder erstellen Sie ein App-Passwort.';
				} else if (status === 403) {
					errorMessage = 'Zugriff verweigert. Sie haben keine Berechtigung für diese Operation.';
				} else if (status === 404) {
					errorMessage = `Ressource nicht gefunden (${status}). Prüfen Sie die URL und ob die Nextcloud Tables App installiert ist.`;
				} else if (status === 998) {
					errorMessage = 'Ungültige API-Syntax. Möglicherweise ist die Nextcloud Tables App nicht installiert oder aktiviert.';
				} else {
					errorMessage = `HTTP ${status}: ${responseBody || error.message}`;
				}
			} else {
				errorMessage = `Netzwerk-Fehler: ${error.message}`;
			}
			
			throw new Error(errorMessage);
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
		if (typeof resourceLocator === 'number') {
			return resourceLocator;
		}
		
		if (typeof resourceLocator === 'string') {
			return parseInt(resourceLocator, 10);
		}
		
		if (resourceLocator && typeof resourceLocator === 'object') {
			if (resourceLocator.mode === 'id' && resourceLocator.value) {
				return parseInt(resourceLocator.value, 10);
			}
			if (resourceLocator.mode === 'list' && resourceLocator.value) {
				return parseInt(resourceLocator.value, 10);
			}
		}
		
		throw new Error('Ungültiger Resource Locator');
	}

	/**
	 * Erweiterte Fehlerbehandlung für API-Requests
	 */
	static async makeApiRequestWithRetry<T>(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: string,
		endpoint: string,
		body?: any,
		headers?: Record<string, string>,
		retries: number = 3
	): Promise<T> {
		let lastError: Error;
		
		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				return await this.makeApiRequest<T>(context, method, endpoint, body, headers);
			} catch (error: any) {
				lastError = error;
				
				// Bestimmte Fehler nicht wiederholen
				if (this.isNonRetryableError(error)) {
					throw error;
				}
				
				// Exponentielles Backoff bei Wiederholung
				if (attempt < retries) {
					const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
					await this.sleep(delay);
				}
			}
		}
		
		throw lastError!;
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
	 * Testet die API-Verbindung und zeigt verfügbare Informationen
	 */
	static async testApiConnection(
		context: IExecuteFunctions | ILoadOptionsFunctions
	): Promise<any> {
		try {
			// Test 1: Basis-Endpunkt
			console.log('Testing API connection...');
			
			// Test mit dem grundlegenden Index-Endpunkt
			const result = await this.makeApiRequest<any>(
				context,
				'GET',
				'',  // Root endpoint
			);
			
			return result;
		} catch (error: any) {
			console.error('API connection test failed:', error);
			
			// Versuche alternative Endpunkte
			try {
				console.log('Trying alternative endpoint...');
				const altResult = await this.makeApiRequest<any>(
					context,
					'GET',
					'/tables',
				);
				return altResult;
			} catch (altError: any) {
				throw new Error(`API-Verbindung fehlgeschlagen: ${error.message}`);
			}
		}
	}
} 