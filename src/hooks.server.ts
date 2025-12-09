import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a PocketBase instance for this request
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	// Load auth from cookie using PocketBase's native method
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
	const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

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

	// Set auth cookie on response using PocketBase's native method
	// Note: httpOnly:false is required for PocketBase's client-side auth to work
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false, secure: true, sameSite: 'Lax' })
	);

	// Add security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// Content Security Policy - restrict resource loading
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'", // unsafe-inline needed for Svelte
			"style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Tailwind
			"img-src 'self' data: https://*.tigris.dev https://proposaltracker-api.fly.dev",
			"font-src 'self'",
			"connect-src 'self' https://proposaltracker-api.fly.dev https://*.tigris.dev",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'"
		].join('; ')
	);

	return response;
};
