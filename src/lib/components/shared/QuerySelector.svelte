<script lang="ts">
    let { store } = $props();
</script>

<div class="flex items-center gap-3 mb-3">
    <form onsubmit={store.handleQuerySubmit} class="flex items-center gap-2">
        <input
            id="userQuery"
            bind:value={store.query}
            class="bg-zinc-900 border border-zinc-800 rounded-lg text-white px-3 py-1.5 text-sm w-48"
            placeholder="Query"
        />

        <button
            type="submit"
            class="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm hover:bg-primary hover:text-black active:scale-95 transition-all"
        >
            Apply
        </button>
    </form>
</div>