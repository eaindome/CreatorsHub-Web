<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, toggleTheme, initTheme } from '$lib/stores/themeStore';

	let currentTheme: 'light' | 'dark';

	// Initialize theme on mount
	onMount(() => {
		initTheme();
		theme.subscribe((value) => {
			currentTheme = value;
		});
	});
</script>

<button
	class="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0E0E0] text-[#333333] transition-colors dark:bg-[#2D2D2D] dark:text-[#E6E6E6]"
	on:click={toggleTheme}
	aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
>
	{#if currentTheme === 'light'}
		<!-- Moon icon for dark mode -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{:else}
		<!-- Sun icon for light mode -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	{/if}
</button>
