/**
 * POST /api/attachments/upload-url
 *
 * Generates a presigned URL for uploading a file directly to Tigris storage.
 * The browser can then PUT the file directly to this URL.
 *
 * Request body:
 * {
 *   entryId: string,      // The entry this file belongs to
 *   filename: string,     // Original filename
 *   contentType: string,  // MIME type
 *   size: number          // File size in bytes
 * }
 *
 * Response:
 * {
 *   uploadUrl: string,    // Presigned PUT URL (expires in 5 min)
 *   key: string,          // Storage key to save in PocketBase
 *   publicUrl: string     // Public URL for accessing the file
 * }
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getPresignedUploadUrl,
	isAllowedFileType,
	isAllowedFileSize
} from '$lib/server/tigris';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Verify user is authenticated
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}

	const body = await request.json();
	const { entryId, filename, contentType, size } = body;

	// Validate required fields
	if (!entryId || !filename || !contentType || size === undefined) {
		throw error(400, 'Missing required fields: entryId, filename, contentType, size');
	}

	// Validate entryId format (PocketBase IDs are 15 alphanumeric chars)
	if (!/^[a-zA-Z0-9]{15}$/.test(entryId)) {
		throw error(400, 'Invalid entry ID format');
	}

	// Verify user owns this entry by attempting to fetch it
	// PocketBase will throw if the user doesn't have access
	try {
		await locals.pb.collection('entries').getOne(entryId);
	} catch {
		throw error(403, 'You do not have permission to modify this entry');
	}

	// Validate file type
	if (!isAllowedFileType(contentType)) {
		console.error(`[upload-url] File type rejected: ${contentType} for file: ${filename}`);
		throw error(400, `File type not allowed: ${contentType}`);
	}

	// Validate file size (10MB max)
	if (!isAllowedFileSize(size)) {
		throw error(400, 'File size exceeds 10MB limit');
	}

	try {
		const result = await getPresignedUploadUrl(entryId, filename, contentType);
		return json(result);
	} catch (err) {
		console.error('Failed to generate presigned URL:', err);
		throw error(500, 'Failed to generate upload URL');
	}
};
