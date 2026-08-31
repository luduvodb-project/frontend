<script lang="ts">
    let { store } = $props();
</script>

<div class="flex items-center gap-4 mt-8">
    <button
        onclick={store.prevPage}
        disabled={store.currentPage === 0}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        Previous
    </button>

    <p class="text-zinc-400">
        Page {store.currentPage + 1} of {store.totalPages}
    </p>

    <button
        onclick={store.nextPage}
        disabled={store.currentPage >= store.totalPages - 1}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        Next
    </button>
</div>