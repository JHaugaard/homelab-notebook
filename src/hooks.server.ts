import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a PocketBase instance for this request
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	// Load auth from cookie
	const cookie = event.request.headers.get('cookie') || '';
	event.locals.pb.authStore.loadFromCookie(cookie);

	// Verify the auth token is still valid
	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = event.locals.pb.authStore.model;
		}
	} catch {
		// Token is invalid, clear it
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}

	// Public routes that don't require authentication
	const publicRoutes = ['/login'];
	const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route));

	// Redirect to login if not authenticated and trying to access protected route
	if (!event.locals.pb.authStore.isValid && !isPublicRoute) {
		return new Response(null, {
			status: 303,
			headers: { Location: '/login' }
		});
	}

	// Redirect to home if authenticated and trying to access login
	if (event.locals.pb.authStore.isValid && event.url.pathname === '/login') {
		return new Response(null, {
			status: 303,
			headers: { Location: '/' }
		});
	}

	const response = await resolve(event);

	// Set auth cookie on response
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false, secure: true, sameSite: 'Lax' })
	);

	return response;
};
