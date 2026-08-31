<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-zinc-900 min-h-screen w-full flex">
    {@render children()}
</div>