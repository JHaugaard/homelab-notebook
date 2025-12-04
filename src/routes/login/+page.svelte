<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/services/pocketbase';
	import { Button, Input } from '$lib/components/ui';
	import { BookOpen } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			await pb.collection('users').authWithPassword(email, password);

			// Set the auth cookie so the server can read it on subsequent requests
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: true, sameSite: 'Lax' });

			// Use window.location for a full page reload to ensure server reads the new cookie
			window.location.href = '/';
		} catch (err) {
			console.error('Login failed:', err);
			error = 'Invalid email or password';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Homelab Notebook</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[var(--color-background-secondary)] px-4">
	<div class="w-full max-w-sm">
		<!-- Logo / Header -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white mb-4">
				<BookOpen size={24} />
			</div>
			<h1 class="text-xl font-semibold text-[var(--color-text)]">Homelab Notebook</h1>
			<p class="text-sm text-[var(--color-text-muted)] mt-1">Sign in to continue</p>
		</div>

		<!-- Login Form -->
		<div class="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6 shadow-sm">
			<form onsubmit={handleLogin} class="space-y-4">
				{#if error}
					<div class="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
						{error}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
						Email
					</label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">
						Password
					</label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						required
						disabled={loading}
					/>
				</div>

				<Button type="submit" variant="primary" class="w-full" disabled={loading}>
					{#if loading}
						Signing in...
					{:else}
						Sign in
					{/if}
				</Button>
			</form>
		</div>

		<p class="text-center text-xs text-[var(--color-text-muted)] mt-6">
			Single-user access only
		</p>
	</div>
</div>
