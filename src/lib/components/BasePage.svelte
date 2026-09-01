<script lang="ts">
	interface Props {
		transparent?: boolean;
		children: import("svelte").Snippet;
	}

	let { transparent = false, children }: Props = $props();
</script>

<div class={`min-h-screen w-full flex ${transparent ? "" : "bg-zinc-900"}`}>
    {@render children()}
</div>