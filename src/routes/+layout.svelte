<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition || !navigation.from || !navigation.to) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="bg-zinc-900 min-h-screen w-full flex">
	{@render children()}
</div>