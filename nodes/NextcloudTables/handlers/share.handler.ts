import { IExecuteFunctions } from 'n8n-workflow';
import { ApiHelper } from '../helpers/api.helper';
import { Share } from '../interfaces';

export class ShareHandler {
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(context, itemIndex);
			case 'create':
				return this.create(context, itemIndex);
			case 'update':
				return this.update(context, itemIndex);
			case 'delete':
				return this.delete(context, itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Fetch all shares for a table
	 */
	private static async getAll(context: IExecuteFunctions, itemIndex: number): Promise<Share[]> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));

		return ApiHelper.makeApiRequest<Share[]>(context, 'GET', `/tables/${tableId}/shares`);
	}

	/**
	 * Create a new share
	 */
	private static async create(context: IExecuteFunctions, itemIndex: number): Promise<Share> {
		const tableId = ApiHelper.getResourceId(context.getNodeParameter('tableId', itemIndex));
		const shareType = context.getNodeParameter('shareType', itemIndex) as string;

		// Extract receiver based on share type
		let receiver: string;
		if (shareType === 'user') {
			receiver = context.getNodeParameter('userReceiver', itemIndex) as string;
		} else if (shareType === 'group') {
			receiver = context.getNodeParameter('groupReceiver', itemIndex) as string;
		} else {
			throw new Error(`Unknown share type: ${shareType}`);
		}

		const permissionsCollection = context.getNodeParameter('permissions', itemIndex, {}) as any;
		const additionalOptions = context.getNodeParameter(
			'additionalOptions',
			itemIndex,
			{},
		) as any;

		// Build base request body
		const body: any = {
			receiver,
			receiverType: shareType,
		};

		// Add display name if specified
		if (additionalOptions.displayName) {
			body.receiverDisplayName = additionalOptions.displayName;
		}

		// Extract permissions from fixedCollection
		const permissions = permissionsCollection?.permission?.[0] || null;

		// Add permissions
		if (permissions) {
			body.permissionRead = permissions.read || false;
			body.permissionCreate = permissions.create || false;
			body.permissionUpdate = permissions.update || false;
			body.permissionDelete = permissions.delete || false;
			body.permissionManage = permissions.manage || false;
		} else {
			// Default permission: read-only
			body.permissionRead = true;
			body.permissionCreate = false;
			body.permissionUpdate = false;
			body.permissionDelete = false;
			body.permissionManage = false;
		}

		return ApiHelper.makeApiRequest<Share>(context, 'POST', `/tables/${tableId}/shares`, body);
	}

	/**
	 * Update permissions of a share
	 */
	private static async update(context: IExecuteFunctions, itemIndex: number): Promise<Share> {
		const shareId = context.getNodeParameter('shareId', itemIndex) as string;
		const permissionsCollection = context.getNodeParameter('permissions', itemIndex, {}) as any;

		// Extract permissions from fixedCollection
		const permissions = permissionsCollection?.permission?.[0] || null;

		// Build permissions body
		const body: any = {};

		if (permissions) {
			body.permissionRead = permissions.read || false;
			body.permissionCreate = permissions.create || false;
			body.permissionUpdate = permissions.update || false;
			body.permissionDelete = permissions.delete || false;
			body.permissionManage = permissions.manage || false;
		} else {
			throw new Error('At least one permission must be specified');
		}

		return ApiHelper.makeApiRequest<Share>(context, 'PUT', `/shares/${shareId}`, body);
	}

	/**
	 * Delete a share
	 */
	private static async delete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<{ success: boolean; message?: string }> {
		const shareId = context.getNodeParameter('shareId', itemIndex) as string;

		await ApiHelper.makeApiRequest(context, 'DELETE', `/shares/${shareId}`);

		return { success: true, message: `Share ${shareId} was successfully deleted` };
	}

	/**
	 * Helper function: validate permissions
	 */
	private static validatePermissions(permissions: any): boolean {
		if (!permissions) {
			return false;
		}

		// At least one permission must be true
		return (
			permissions.read ||
			permissions.create ||
			permissions.update ||
			permissions.delete ||
			permissions.manage
		);
	}

	/**
	 * Helper function: validate share type
	 */
	private static validateShareType(shareType: string): boolean {
		const validTypes = ['user', 'group'];
		return validTypes.includes(shareType);
	}

	/**
	 * Helper function: basic receiver validation
	 */
	private static validateReceiver(receiver: string): boolean {
		// Basic validation: not empty and no special characters
		if (!receiver || receiver.trim().length === 0) {
			return false;
		}

		// Simple regex for Nextcloud usernames (letters, numbers, underscore, hyphen)
		const receiverRegex = /^[a-zA-Z0-9_-]+$/;
		return receiverRegex.test(receiver.trim());
	}
}

