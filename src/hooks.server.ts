import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a PocketBase instance for this request
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	// Load auth from cookie
	const cookie = event.request.headers.get('cookie') || '';
	event.locals.pb.authStore.loadFromCookie(cookie);

	// Check if auth token is valid (without making a network call on every request)
	// The token itself contains expiry info that PocketBase checks
	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.record;
	} else {
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
