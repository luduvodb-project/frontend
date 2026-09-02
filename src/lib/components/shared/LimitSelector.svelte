<script lang="ts">
    let { store, text } = $props();
</script>

<div class="flex items-center gap-3 mb-3">
    <label for="limit-select" class="text-zinc-400 text-sm">{text} per page:</label>

    <select
        id="limit-select"
        value={store.selectedPreset}
        onchange={store.handlePresetChange}
        class="bg-zinc-900 border border-zinc-800 rounded-lg text-white px-3 py-1.5 text-sm"
    >
        {#each store.PRESET_LIMITS as preset}
            <option value={preset}>{preset}</option>
        {/each}

        <option value="custom">Custom</option>
    </select>

    {#if store.selectedPreset === "custom"}
        <form onsubmit={store.handleCustomLimitSubmit} class="flex items-center gap-2">
            <input
                type="number"
                min="1"
                max="100"
                bind:value={store.customLimit}
                class="bg-zinc-900 border border-zinc-800 rounded-lg text-white px-3 py-1.5 text-sm w-24"
                placeholder="Custom"
            />

            <button
                type="submit"
                class="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm hover:bg-primary hover:text-black active:scale-95 transition-all"
            >
                Apply
            </button>
        </form>

        {#if store.customLimit > 100}
            <p class="text-red-400 text-xs">Max is 100</p>
        {/if}
    {/if}
</div>