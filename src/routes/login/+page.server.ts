import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

		try {
			await pb.collection('users').authWithPassword(email, password);

			// Set httpOnly cookie via server - this is secure and can't be stolen via XSS
			cookies.set('pb_auth', pb.authStore.exportToCookie(), {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		} catch {
			return fail(401, { error: 'Invalid email or password' });
		}

		redirect(303, '/');
	}
};
