<script lang="ts">
	interface Props {
		class?: string;
		variant?: 'text' | 'circular' | 'rectangular';
		width?: string;
		height?: string;
	}

	let {
		class: className = '',
		variant = 'text',
		width,
		height
	}: Props = $props();

	const variantClasses = {
		text: 'h-4 rounded',
		circular: 'rounded-full',
		rectangular: 'rounded-md'
	};
</script>

<div
	class="animate-pulse bg-[var(--color-surface-hover)] {variantClasses[variant]} {className}"
	style:width={width}
	style:height={height}
></div>
