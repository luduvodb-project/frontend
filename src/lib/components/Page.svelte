<script lang="ts">
	let { children } = $props();
</script>

<div class="flex flex-col flex-1">
    <div class="p-8">
        {@render children()}
    </div>
</div>