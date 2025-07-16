import {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
  NodeOperationError,
} from 'n8n-workflow';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Column } from '../interfaces';
/**
 * Central logging class for better log labeling and grep-ability
 */
export class NextcloudTablesLogger {
	private static readonly NODE_PREFIX = '[N8N-NEXTCLOUD-TABLES]';

	/**
	 * Debug-level logging (only in development/verbose)
	 */
	static debug(context: string, message: string, data?: any): void {
		const timestamp = new Date().toISOString();
		const logMessage = `${this.NODE_PREFIX} [DEBUG] [${context}] ${message}`;
		console.debug(`${timestamp} ${logMessage}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Info-level logging for important operations
	 */
	static info(context: string, message: string, data?: any): void {
		const timestamp = new Date().toISOString();
		const logMessage = `${this.NODE_PREFIX} [INFO] [${context}] ${message}`;
		console.log(`${timestamp} ${logMessage}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Warning-level logging for potential issues
	 */
	static warn(context: string, message: string, data?: any): void {
		const timestamp = new Date().toISOString();
		const logMessage = `${this.NODE_PREFIX} [WARN] [${context}] ${message}`;
		console.warn(`${timestamp} ${logMessage}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Error-level logging for errors
	 */
	static error(context: string, message: string, error?: any, data?: any): void {
		const timestamp = new Date().toISOString();
		const logMessage = `${this.NODE_PREFIX} [ERROR] [${context}] ${message}`;
		const errorInfo = error
			? {
					message: error.message,
					stack: error.stack,
					statusCode: error.statusCode || error.response?.status,
				}
			: null;

		console.error(`${timestamp} ${logMessage}`, {
			error: errorInfo,
			additionalData: data,
		});
	}

	/**
	 * API request logging for debugging
	 */
	static apiRequest(method: string, endpoint: string, body?: any): void {
		this.debug('API-REQUEST', `${method} ${endpoint}`, {
			method,
			endpoint,
			hasBody: !!body,
			bodySize: body ? JSON.stringify(body).length : 0,
		});
	}

	/**
	 * API response logging for debugging
	 */
	static apiResponse(
		method: string,
		endpoint: string,
		statusCode?: number,
		duration?: number,
	): void {
		this.debug('API-RESPONSE', `${method} ${endpoint} -> ${statusCode || 'unknown'}`, {
			method,
			endpoint,
			statusCode,
			duration: duration ? `${duration}ms` : 'unknown',
		});
	}

	/**
	 * Operation start logging
	 */
	static operationStart(resource: string, operation: string, context?: any): void {
		this.info('OPERATION-START', `${resource}.${operation}`, {
			resource,
			operation,
			context,
		});
	}

	/**
	 * Operation success logging
	 */
	static operationSuccess(
		resource: string,
		operation: string,
		duration?: number,
		result?: any,
	): void {
		this.info('OPERATION-SUCCESS', `${resource}.${operation} completed`, {
			resource,
			operation,
			duration: duration ? `${duration}ms` : 'unknown',
			resultType: result ? typeof result : 'none',
			resultSize: result && typeof result === 'object' ? Object.keys(result).length : 0,
		});
	}

	/**
	 * Operation error logging
	 */
	static operationError(
		resource: string,
		operation: string,
		error: any,
		duration?: number,
	): void {
		this.error('OPERATION-ERROR', `${resource}.${operation} failed`, error, {
			resource,
			operation,
			duration: duration ? `${duration}ms` : 'unknown',
		});
	}

	/**
	 * Validation error logging
	 */
	static validationError(context: string, field: string, value: any, reason: string): void {
		this.warn('VALIDATION-ERROR', `${field} validation failed: ${reason}`, {
			context,
			field,
			value: typeof value === 'string' ? value : JSON.stringify(value),
			reason,
		});
	}
}

export class ApiHelper {
	/**
	 * Makes an API request to the Nextcloud Tables API
	 */
	static async makeApiRequest<T>(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		endpoint: string,
		body?: any,
		useQueryParams: boolean = false,
	): Promise<T> {
		const startTime = Date.now();

		// Log API request
		NextcloudTablesLogger.apiRequest(method, endpoint, body);

		const credentials = await context.getCredentials('nextcloudTablesApi');
		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');

		let url = `${serverUrl}/index.php/apps/tables/api/1${endpoint}`;

		if (useQueryParams && body) {
			const queryParams = new URLSearchParams();
			for (const [key, value] of Object.entries(body)) {
				if (value !== undefined && value !== null) {
					queryParams.append(key, String(value));
				}
			}
			url += `?${queryParams.toString()}`;
			body = undefined;
		}

		const options: IRequestOptions = {
			method: method as IHttpRequestMethods,
			url,
			headers: {
				Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'OCS-APIRequest': 'true',
			},
			json: true,
			rejectUnauthorized: false,
		};

		if (body && !useQueryParams) {
			options.body = body;
		}

		try {
			const response = await context.helpers.request(options);
			const duration = Date.now() - startTime;

			// Log successful response
			NextcloudTablesLogger.apiResponse(method, endpoint, 200, duration);

			return response;
		} catch (error: any) {
			const duration = Date.now() - startTime;
			const statusCode = error.statusCode || error.response?.status;

			// Log error response
			NextcloudTablesLogger.apiResponse(method, endpoint, statusCode, duration);
			NextcloudTablesLogger.error('API-ERROR', `${method} ${endpoint} failed`, error, {
				statusCode,
				duration,
				url: options.url,
			});

			if (error.statusCode) {
				switch (error.statusCode) {
					case 400:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Invalid request (400). Check the submitted data.`,
						);
					case 401:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Authentication failed (401). Check username and password.`,
						);
					case 403:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Access denied (403). Check permission for this action.`,
						);
					case 404:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Resource not found (404). Check the URL and whether the Nextcloud Tables app is installed.`,
						);
					case 409:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Conflict (409). The resource already exists or is in use.`,
						);
					case 422:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Unprocessable entity (422). Check input validation.`,
						);
					case 429:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Too many requests (429). Try again later.`,
						);
					case 500:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Server error (500). Check Nextcloud logs.`,
						);
					case 502:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Bad Gateway (502). Nextcloud server not reachable.`,
						);
					case 503:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Service unavailable (503). Nextcloud is temporarily unavailable.`,
						);
					case 504:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Gateway Timeout (504). Request took too long.`,
						);
					default:
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] API error (${error.statusCode}): ${error.message}`,
						);
				}
			}
			throw new Error(`[N8N-NEXTCLOUD-TABLES] Unknown API error: ${error.message}`);
		}
	}

	/**
	 * Builds the base URL for API endpoints
	 */
	static getBaseUrl(serverUrl: string): string {
		return `${serverUrl.replace(/\/$/, '')}/ocs/v2.php/apps/tables/api/2`;
	}

	/**
	 * Validates a table ID
	 */
	static validateTableId(tableId: any): number {
		const id = parseInt(tableId, 10);
		if (isNaN(id) || id <= 0) {
			NextcloudTablesLogger.validationError(
				'TABLE-ID',
				'tableId',
				tableId,
				'Invalid table ID',
			);
			throw new Error('[N8N-NEXTCLOUD-TABLES] Invalid table ID');
		}
		return id;
	}

	/**
	 * Validates a view ID
	 */
	static validateViewId(viewId: any): number {
		const id = parseInt(viewId, 10);
		if (isNaN(id) || id <= 0) {
			NextcloudTablesLogger.validationError('VIEW-ID', 'viewId', viewId, 'Invalid view ID');
			throw new Error('[N8N-NEXTCLOUD-TABLES] Invalid view ID');
		}
		return id;
	}

	/**
	 * Validates a column ID
	 */
	static validateColumnId(columnId: any): number {
		const id = parseInt(columnId, 10);
		if (isNaN(id) || id <= 0) {
			NextcloudTablesLogger.validationError(
				'COLUMN-ID',
				'columnId',
				columnId,
				'Invalid column ID',
			);
			throw new Error('[N8N-NEXTCLOUD-TABLES] Invalid column ID');
		}
		return id;
	}

	/**
	 * Validates a row ID
	 */
	static validateRowId(rowId: any): number {
		const id = parseInt(rowId, 10);
		if (isNaN(id) || id <= 0) {
			NextcloudTablesLogger.validationError('ROW-ID', 'rowId', rowId, 'Invalid row ID');
			throw new Error('[N8N-NEXTCLOUD-TABLES] Invalid row ID');
		}
		return id;
	}

	/**
	 * Loads column information for a table (helper for formatting)
	 */
	static async getTableColumns(
		context: IExecuteFunctions | ILoadOptionsFunctions,
		tableId: number,
	): Promise<Column[]> {
		try {
			return await this.makeApiRequest<Column[]>(
				context,
				'GET',
				`/tables/${tableId}/columns`,
			);
		} catch (error) {
			return [];
		}
	}

	/**
	 * Converts a Resource Locator to ID - Production Version
	 */
	static getResourceId(resourceLocator: any): number {
		// Log validation attempt
		NextcloudTablesLogger.debug('RESOURCE-VALIDATION', 'Validating resource locator', {
			type: typeof resourceLocator,
			value: resourceLocator,
		});

		// Robust validation - catch all NaN sources
		if (
			resourceLocator === null ||
			resourceLocator === undefined ||
			resourceLocator === 'null' ||
			resourceLocator === 'undefined' ||
			resourceLocator === 'NaN' ||
			(typeof resourceLocator === 'number' && isNaN(resourceLocator))
		) {
			NextcloudTablesLogger.validationError(
				'RESOURCE-LOCATOR',
				'resourceLocator',
				resourceLocator,
				'Resource locator is null, undefined or NaN',
			);
			throw new Error(
				'[N8N-NEXTCLOUD-TABLES] Resource locator is required but not set or invalid',
			);
		}

		if (typeof resourceLocator === 'number') {
			if (resourceLocator <= 0 || isNaN(resourceLocator)) {
				NextcloudTablesLogger.validationError(
					'RESOURCE-LOCATOR',
					'resourceLocator',
					resourceLocator,
					'Number must be positive',
				);
				throw new Error('[N8N-NEXTCLOUD-TABLES] Invalid ID: Must be a positive number');
			}
			NextcloudTablesLogger.debug('RESOURCE-VALIDATION', 'Valid number resource locator', {
				id: resourceLocator,
			});
			return resourceLocator;
		}

		if (typeof resourceLocator === 'string') {
			if (resourceLocator.trim() === '') {
				NextcloudTablesLogger.validationError(
					'RESOURCE-LOCATOR',
					'resourceLocator',
					resourceLocator,
					'String is empty',
				);
				throw new Error(
					'[N8N-NEXTCLOUD-TABLES] Resource locator is empty - ID is required',
				);
			}
			const id = parseInt(resourceLocator, 10);
			if (isNaN(id) || id <= 0) {
				NextcloudTablesLogger.validationError(
					'RESOURCE-LOCATOR',
					'resourceLocator',
					resourceLocator,
					'String cannot be converted to positive number',
				);
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Invalid ID: "${resourceLocator}" is not a valid number`,
				);
			}
			NextcloudTablesLogger.debug(
				'RESOURCE-VALIDATION',
				'Valid string resource locator converted',
				{ original: resourceLocator, converted: id },
			);
			return id;
		}

		if (resourceLocator && typeof resourceLocator === 'object') {
			// Check __rl structure
			if (resourceLocator.__rl === true) {
				const value = resourceLocator.value;
				const mode = resourceLocator.mode;

				NextcloudTablesLogger.debug(
					'RESOURCE-VALIDATION',
					'Processing __rl resource locator',
					{ mode, value },
				);

				if (!value || value === '') {
					NextcloudTablesLogger.validationError(
						'RESOURCE-LOCATOR',
						'resourceLocator.value',
						value,
						`Value is empty for mode: ${mode}`,
					);
					throw new Error(
						`[N8N-NEXTCLOUD-TABLES] Resource Locator value is empty (mode: ${mode}) - An ID is required`,
					);
				}

				if (mode === 'id' || mode === 'list') {
					const id = parseInt(value, 10);
					if (isNaN(id) || id <= 0) {
						NextcloudTablesLogger.validationError(
							'RESOURCE-LOCATOR',
							'resourceLocator.value',
							value,
							`Value cannot be converted to positive number (mode: ${mode})`,
						);
						throw new Error(
							`[N8N-NEXTCLOUD-TABLES] Invalid ID in Resource Locator: "${value}" is not a valid number`,
						);
					}
					NextcloudTablesLogger.debug(
						'RESOURCE-VALIDATION',
						'Valid __rl resource locator',
						{ mode, value, converted: id },
					);
					return id;
				} else {
					NextcloudTablesLogger.validationError(
						'RESOURCE-LOCATOR',
						'resourceLocator.mode',
						mode,
						'Unknown mode',
					);
					throw new Error(
						`[N8N-NEXTCLOUD-TABLES] Unknown Resource Locator mode: ${mode}`,
					);
				}
			}

			// Legacy Format Support
			if (resourceLocator.mode && resourceLocator.value) {
				const value = resourceLocator.value;
				const mode = resourceLocator.mode;

				NextcloudTablesLogger.debug(
					'RESOURCE-VALIDATION',
					'Processing legacy resource locator',
					{ mode, value },
				);

				if (!value || value === '') {
					NextcloudTablesLogger.validationError(
						'RESOURCE-LOCATOR',
						'resourceLocator.value',
						value,
						'Legacy value is empty',
					);
					throw new Error(
						'[N8N-NEXTCLOUD-TABLES] Resource Locator value is empty - An ID is required',
					);
				}
				const id = parseInt(value, 10);
				if (isNaN(id) || id <= 0) {
					NextcloudTablesLogger.validationError(
						'RESOURCE-LOCATOR',
						'resourceLocator.value',
						value,
						'Legacy value cannot be converted to positive number',
					);
					throw new Error(
						`[N8N-NEXTCLOUD-TABLES] Invalid ID: "${value}" is not a valid number`,
					);
				}
				NextcloudTablesLogger.debug(
					'RESOURCE-VALIDATION',
					'Valid legacy resource locator',
					{ mode, value, converted: id },
				);
				return id;
			}
		}

		NextcloudTablesLogger.validationError(
			'RESOURCE-LOCATOR',
			'resourceLocator',
			resourceLocator,
			'Unknown format',
		);
		throw new Error(
			`[N8N-NEXTCLOUD-TABLES] Invalid Resource Locator format: ${JSON.stringify(resourceLocator)}`,
		);
	}

	/**
	 * Checks if an error is non-retryable
	 */
	private static isNonRetryableError(error: any): boolean {
		const statusCode = error.response?.status || error.statusCode;
		if (statusCode >= 400 && statusCode < 500 && statusCode !== 408 && statusCode !== 429) {
			return true;
		}

		const errorMessage = error.message?.toLowerCase() || '';
		if (
			errorMessage.includes('unauthorized') ||
			errorMessage.includes('forbidden') ||
			errorMessage.includes('not found')
		) {
			return true;
		}

		return false;
	}

	/**
	 * Sleep helper function for retry delays
	 */
	private static sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Improved error handling with specific HTTP status codes
	 */
	static handleApiError(error: any): never {
		const statusCode = error.response?.status || error.statusCode;
		const errorMessage = error.response?.body?.ocs?.meta?.message || error.message;

		// Log the error for debugging
		NextcloudTablesLogger.error('API-ERROR-HANDLER', `HTTP ${statusCode} Error`, error, {
			statusCode,
			errorMessage,
		});

		switch (statusCode) {
			case 400:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Invalid request: ${errorMessage || 'Check your input data'}`,
				);
			case 401:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Not authorized: ${errorMessage || 'Check your credentials'}`,
				);
			case 403:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Access denied: ${errorMessage || 'No permission for this operation'}`,
				);
			case 404:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Not found: ${errorMessage || 'The requested resource does not exist'}`,
				);
			case 409:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Conflict: ${errorMessage || 'The resource already exists or is in use'}`,
				);
			case 422:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Validation error: ${errorMessage || 'The input data is invalid'}`,
				);
			case 429:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Too many requests: ${errorMessage || 'Please try again later'}`,
				);
			case 500:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Server error: ${errorMessage || 'An internal error occurred'}`,
				);
			case 502:
			case 503:
			case 504:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] Service unavailable: ${errorMessage || 'The server is temporarily unavailable'}`,
				);
			default:
				throw new Error(
					`[N8N-NEXTCLOUD-TABLES] API error: ${errorMessage || 'An unknown error occurred'}`,
				);
		}
	}
	/**
	 * Loads all available tables
	 */
	static async getTables(context: ILoadOptionsFunctions): Promise<any[]> {
		try {
			const tables = await this.makeApiRequest<any[]>(context, 'GET', '/tables');
			return tables || [];
		} catch (error: any) {
			return [];
		}
	}

	/**
	 * Nextcloud Sharee API Request (for user/group search)
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
				Accept: 'application/json',
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
			const axiosError = error as {
				response?: { status?: number; data?: { ocs?: { meta?: { message?: string } } } };
			};
			NextcloudTablesLogger.error(
				'SHAREE-API-ERROR',
				'Nextcloud Sharee API request failed',
				axiosError,
			);
			throw new NodeOperationError(
				context.getNode(),
				`[N8N-NEXTCLOUD-TABLES] Sharee API error: ${axiosError.response?.data?.ocs?.meta?.message || 'Unknown error'}`,
			);
		}
	}

	/**
	 * Nextcloud OCS Users API Request (for user/group search)
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
				Accept: 'application/json',
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
			const axiosError = error as {
				response?: { status?: number; data?: { ocs?: { meta?: { message?: string } } } };
			};
			NextcloudTablesLogger.error(
				'OCS-USERS-API-ERROR',
				'Nextcloud OCS Users API request failed',
				axiosError,
			);
			throw new NodeOperationError(
				context.getNode(),
				`[N8N-NEXTCLOUD-TABLES] OCS Users API error: ${axiosError.response?.data?.ocs?.meta?.message || 'Unknown error'}`,
			);
		}
	}
}
