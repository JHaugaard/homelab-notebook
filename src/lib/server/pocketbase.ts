import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

// Server-side PocketBase instance
// Use this for server-side operations (load functions, API routes)
export function createServerPB() {
	return new PocketBase(PUBLIC_POCKETBASE_URL);
}

// Initialize PocketBase with auth from cookie
export function createAuthenticatedPB(cookie: string | null) {
	const pb = createServerPB();
	if (cookie) {
		pb.authStore.loadFromCookie(cookie);
	}
	return pb;
}
