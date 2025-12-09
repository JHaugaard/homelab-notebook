import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a PocketBase instance for this request
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	// Load auth from cookie
	const cookie = event.request.headers.get('cookie') || '';
	const hasPbAuth = cookie.includes('pb_auth');

	// Parse the pb_auth cookie value (JSON encoded with token and record)
	if (hasPbAuth) {
		try {
			const cookieMatch = cookie.match(/pb_auth=([^;]+)/);
			if (cookieMatch) {
				const decoded = decodeURIComponent(cookieMatch[1]);
				const authData = JSON.parse(decoded);
				if (authData.token && authData.record) {
					event.locals.pb.authStore.save(authData.token, authData.record);
				}
			}
		} catch (e) {
			console.error('[Hooks Debug] Failed to parse pb_auth cookie:', e);
		}
	}

	// Debug logging (only on main page loads, not static assets)
	if (!event.url.pathname.startsWith('/_app') && !event.url.pathname.startsWith('/favicon')) {
		console.log('[Hooks Debug] Path:', event.url.pathname);
		console.log('[Hooks Debug] PocketBase URL:', PUBLIC_POCKETBASE_URL);
		console.log('[Hooks Debug] Has pb_auth cookie:', hasPbAuth);
		console.log('[Hooks Debug] Auth store valid:', event.locals.pb.authStore.isValid);
	}

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

	// Set auth cookie on response with httpOnly for security
	// httpOnly prevents JavaScript access, protecting against XSS token theft
	if (event.locals.pb.authStore.isValid) {
		const token = event.locals.pb.authStore.token;
		const model = event.locals.pb.authStore.record;
		const cookiePayload = JSON.stringify({ token, record: model });
		const encodedPayload = encodeURIComponent(cookiePayload);
		response.headers.set(
			'set-cookie',
			`pb_auth=${encodedPayload}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
		);
	}

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
