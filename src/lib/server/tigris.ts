/**
 * Tigris (S3-compatible) storage service for file attachments
 *
 * This service runs server-side only and provides:
 * - Presigned URLs for direct browser uploads
 * - Public URLs for downloads (bucket is public-read)
 * - File deletion
 *
 * Files are stored with the pattern: entries/{entryId}/{filename}
 */

import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

// Get environment variables (set by Fly.io when creating Tigris bucket)
const AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY || '';
const AWS_ENDPOINT_URL_S3 = env.AWS_ENDPOINT_URL_S3 || 'https://fly.storage.tigris.dev';
const AWS_REGION = env.AWS_REGION || 'auto';
const BUCKET_NAME = env.BUCKET_NAME || 'homelab-notebook-files';

// Initialize S3 client for Tigris
const s3Client = new S3Client({
	region: AWS_REGION || 'auto',
	endpoint: AWS_ENDPOINT_URL_S3,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});

// Export bucket name for URL construction
export const bucketName = BUCKET_NAME;
export const endpoint = AWS_ENDPOINT_URL_S3;

/**
 * Generate a unique storage key for a file
 * Format: entries/{entryId}/{timestamp}-{sanitizedFilename}
 */
export function generateStorageKey(entryId: string, filename: string): string {
	const timestamp = Date.now();
	// Sanitize filename: remove special chars, keep extension
	const sanitized = filename
		.replace(/[^a-zA-Z0-9.-]/g, '_')
		.replace(/_+/g, '_')
		.toLowerCase();
	return `entries/${entryId}/${timestamp}-${sanitized}`;
}

/**
 * Extract the original filename from a storage key
 */
export function getFilenameFromKey(key: string): string {
	const parts = key.split('/');
	const filename = parts[parts.length - 1];
	// Remove timestamp prefix (everything before first dash after numbers)
	const match = filename.match(/^\d+-(.+)$/);
	return match ? match[1] : filename;
}

/**
 * Get the public URL for a file
 * Since the bucket is public-read, we can construct direct URLs
 */
export function getPublicUrl(key: string): string {
	return `${AWS_ENDPOINT_URL_S3}/${BUCKET_NAME}/${key}`;
}

/**
 * Generate a presigned URL for uploading a file directly from the browser
 *
 * @param entryId - The entry this file belongs to
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration in seconds (default 5 minutes)
 * @returns Object with uploadUrl and the storage key
 */
export async function getPresignedUploadUrl(
	entryId: string,
	filename: string,
	contentType: string,
	expiresIn = 300
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
	const key = generateStorageKey(entryId, filename);

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		ContentType: contentType
	});

	const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
	const publicUrl = getPublicUrl(key);

	return { uploadUrl, key, publicUrl };
}

/**
 * Check if a file exists in storage
 */
export async function fileExists(key: string): Promise<boolean> {
	try {
		await s3Client.send(
			new HeadObjectCommand({
				Bucket: BUCKET_NAME,
				Key: key
			})
		);
		return true;
	} catch {
		return false;
	}
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string): Promise<void> {
	await s3Client.send(
		new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key
		})
	);
}

/**
 * Delete all files for an entry
 * Note: This requires listing objects, which we avoid by tracking keys in PocketBase
 */
export async function deleteEntryFiles(keys: string[]): Promise<void> {
	await Promise.all(keys.map((key) => deleteFile(key)));
}

/**
 * Validate file type against allowed types
 */
export function isAllowedFileType(contentType: string): boolean {
	const allowedTypes = [
		// Images
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'image/svg+xml',
		// Documents
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		// Text/Code
		'text/plain',
		'text/markdown',
		'text/csv',
		'application/json',
		'application/xml',
		// Archives
		'application/zip',
		'application/gzip',
		// Generic binary (fallback when browser can't determine MIME type)
		'application/octet-stream'
	];
	return allowedTypes.includes(contentType);
}

/**
 * Validate file size (max 10MB by default)
 */
export function isAllowedFileSize(sizeBytes: number, maxMB = 10): boolean {
	return sizeBytes <= maxMB * 1024 * 1024;
}
