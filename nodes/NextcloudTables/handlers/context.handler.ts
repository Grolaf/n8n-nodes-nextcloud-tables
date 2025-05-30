import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Context, Table } from '../interfaces';

export class ContextHandler {
	static async execute(context: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(context, itemIndex);
			case 'get':
				return this.get(context, itemIndex);
			case 'getTables':
				return this.getTables(context, itemIndex);
			case 'getPages':
				return this.getPages(context, itemIndex);
			default:
				throw new Error(`Unbekannte Operation: ${operation}`);
		}
	}

	/**
	 * Alle verfügbaren App-Contexts abrufen
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Context[]> {
		try {
			return await ApiHelper.makeApiRequest<Context[]>(
				context,
				'GET',
				'/contexts',
			);
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Fehler beim Abrufen der Contexts: ${apiError.message}`);
		}
	}

	/**
	 * Einen spezifischen App-Context abrufen
	 */
	private static async get(context: IExecuteFunctions, itemIndex: number): Promise<Context> {
		const contextId = context.getNodeParameter('contextId', itemIndex) as string;

		// Context-ID validieren
		if (!contextId || contextId.trim().length === 0) {
			throw new Error('Context-ID darf nicht leer sein');
		}

		try {
			return await ApiHelper.makeApiRequest<Context>(
				context,
				'GET',
				`/contexts/${contextId.trim()}`,
			);
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Fehler beim Abrufen des Contexts: ${apiError.message}`);
		}
	}

	/**
	 * Alle Tabellen eines Contexts abrufen
	 */
	private static async getTables(context: IExecuteFunctions, itemIndex: number): Promise<Table[]> {
		const contextId = context.getNodeParameter('contextId', itemIndex) as string;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;

		// Context-ID validieren
		if (!contextId || contextId.trim().length === 0) {
			throw new Error('Context-ID darf nicht leer sein');
		}

		// Query-Parameter aufbauen
		const queryParams: string[] = [];

		if (additionalOptions.onlyOwn === true) {
			queryParams.push('onlyOwn=true');
		}

		if (additionalOptions.includeArchived === true) {
			queryParams.push('includeArchived=true');
		}

		// URL mit Query-Parametern erstellen
		let url = `/contexts/${contextId.trim()}/tables`;
		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		try {
			return await ApiHelper.makeApiRequest<Table[]>(
				context,
				'GET',
				url,
			);
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Fehler beim Abrufen der Context-Tabellen: ${apiError.message}`);
		}
	}

	/**
	 * Alle Pages eines Contexts abrufen
	 */
	private static async getPages(context: IExecuteFunctions, itemIndex: number): Promise<any[]> {
		const contextId = context.getNodeParameter('contextId', itemIndex) as string;
		const pageFilter = context.getNodeParameter('pageFilter', itemIndex, {}) as any;

		// Context-ID validieren
		if (!contextId || contextId.trim().length === 0) {
			throw new Error('Context-ID darf nicht leer sein');
		}

		// Query-Parameter aufbauen
		const queryParams: string[] = [];

		if (pageFilter.title && pageFilter.title.trim().length > 0) {
			queryParams.push(`title=${encodeURIComponent(pageFilter.title.trim())}`);
		}

		if (pageFilter.activeOnly === true) {
			queryParams.push('activeOnly=true');
		}

		if (pageFilter.sort && pageFilter.sort !== 'title') {
			queryParams.push(`sort=${pageFilter.sort}`);
		}

		// URL mit Query-Parametern erstellen
		let url = `/contexts/${contextId.trim()}/pages`;
		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		try {
			const pages = await ApiHelper.makeApiRequest<any[]>(
				context,
				'GET',
				url,
			);

			// Falls ein lokaler Filter auf den Titel angewendet werden soll
			if (pageFilter.title && pageFilter.title.trim().length > 0) {
				const filterTitle = pageFilter.title.toLowerCase();
				return pages.filter(page => 
					page.title && page.title.toLowerCase().includes(filterTitle)
				);
			}

			return pages;
		} catch (error) {
			const apiError = error as Error;
			throw new Error(`Fehler beim Abrufen der Context-Pages: ${apiError.message}`);
		}
	}

	/**
	 * Hilfsfunktion: Context-ID validieren
	 */
	private static validateContextId(contextId: string): boolean {
		if (!contextId || contextId.trim().length === 0) {
			return false;
		}

		// Context-IDs sollten numerisch oder alphanumerisch sein
		const contextIdRegex = /^[a-zA-Z0-9_-]+$/;
		return contextIdRegex.test(contextId.trim());
	}

	/**
	 * Hilfsfunktion: Page-Filter validieren
	 */
	private static validatePageFilter(filter: any): string[] {
		const errors: string[] = [];

		if (filter.sort && !['title', 'created', 'modified'].includes(filter.sort)) {
			errors.push('Ungültige Sortierreihenfolge. Erlaubt: title, created, modified');
		}

		return errors;
	}

	/**
	 * Hilfsfunktion: Context-Berechtigungen prüfen (falls verfügbar)
	 */
	private static async checkContextPermissions(context: IExecuteFunctions, contextId: string): Promise<boolean> {
		try {
			// Versuche Context-Informationen abzurufen um Berechtigungen zu prüfen
			await ApiHelper.makeApiRequest<Context>(
				context,
				'GET',
				`/contexts/${contextId}`,
			);
			return true;
		} catch (error) {
			// Wenn Context nicht gefunden wird oder keine Berechtigung
			return false;
		}
	}
} 