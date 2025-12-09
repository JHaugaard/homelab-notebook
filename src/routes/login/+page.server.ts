import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		console.log('[Login Debug] Attempting login for:', email);
		console.log('[Login Debug] PocketBase URL:', PUBLIC_POCKETBASE_URL);

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

		try {
			// Test connection first
			console.log('[Login Debug] Testing PocketBase connection...');
			const health = await pb.health.check();
			console.log('[Login Debug] Health check passed:', health);

			console.log('[Login Debug] Authenticating...');
			const authResult = await pb.collection('users').authWithPassword(email, password);
			console.log('[Login Debug] Auth successful for user:', authResult.record.email);

			// Extract just the token value from the auth store
			// exportToCookie() returns the full cookie string "pb_auth=...; Path=/; ..."
			// We need just the encoded value for cookies.set()
			const token = pb.authStore.token;
			const model = pb.authStore.record;
			const cookiePayload = JSON.stringify({ token, record: model });
			const encodedPayload = encodeURIComponent(cookiePayload);

			console.log('[Login Debug] Setting auth cookie');
			cookies.set('pb_auth', encodedPayload, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
			console.log('[Login Debug] Cookie set successfully');
		} catch (error) {
			console.error('[Login Debug] Login failed:', error);
			console.error('[Login Debug] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
			return fail(401, { error: 'Invalid email or password' });
		}

		redirect(303, '/');
	}
};
