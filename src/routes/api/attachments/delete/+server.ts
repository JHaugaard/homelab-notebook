/**
 * POST /api/attachments/delete
 *
 * Deletes a file from Tigris storage.
 * Note: This only deletes from storage - PocketBase entry update is separate.
 *
 * Request body:
 * {
 *   key: string  // Storage key of the file to delete
 * }
 *
 * Response:
 * { success: true }
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteFile } from '$lib/server/tigris';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Verify user is authenticated
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}

	const body = await request.json();
	const { key } = body;

	// Validate required fields
	if (!key) {
		throw error(400, 'Missing required field: key');
	}

	// Basic security: ensure key starts with 'entries/'
	if (!key.startsWith('entries/')) {
		throw error(400, 'Invalid storage key');
	}

	try {
		await deleteFile(key);
		return json({ success: true });
	} catch (err) {
		console.error('Failed to delete file:', err);
		throw error(500, 'Failed to delete file');
	}
};
