/**
 * POST /api/attachments/delete
 *
 * Deletes a file from Tigris storage.
 * Note: This only deletes from storage - PocketBase entry update is separate.
 *
 * Request body:
 * {
 *   key: string,      // Storage key of the file to delete
 *   entryId: string   // ID of the entry this attachment belongs to (for ownership verification)
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
	const { key, entryId } = body;

	// Validate required fields
	if (!key || !entryId) {
		throw error(400, 'Missing required fields: key, entryId');
	}

	// Validate key format: must start with 'entries/'
	if (!key.startsWith('entries/')) {
		throw error(400, 'Invalid storage key format');
	}

	// Validate entryId format (PocketBase IDs are 15 alphanumeric chars)
	if (!/^[a-zA-Z0-9]{15}$/.test(entryId)) {
		throw error(400, 'Invalid entry ID format');
	}

	// Security: Verify the key belongs to the specified entry
	// Key format is: entries/{entryId}/{timestamp}-{filename}
	const keyParts = key.split('/');
	if (keyParts.length < 3 || keyParts[1] !== entryId) {
		throw error(403, 'Storage key does not match the specified entry');
	}

	// Verify user owns this entry by attempting to fetch it
	// PocketBase will throw if the user doesn't have access
	try {
		await locals.pb.collection('entries').getOne(entryId);
	} catch {
		throw error(403, 'You do not have permission to modify this entry');
	}

	try {
		await deleteFile(key);
		return json({ success: true });
	} catch (err) {
		console.error('Failed to delete file:', err);
		throw error(500, 'Failed to delete file');
	}
};
