<script lang="ts">
    let { store } = $props();
    let inputValue = $state(String(store.currentPage + 1));
    
    $effect(() => {
        inputValue = String(store.currentPage + 1);
    });

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        store.setPage(Number(inputValue));
    }
</script>

<div class="flex items-center gap-4 mt-8">
    <button
        onclick={store.firstPage}
        disabled={store.currentPage === 0}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        First
    </button>

    <button
        onclick={store.prevPage}
        disabled={store.currentPage === 0}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        Previous
    </button>

    <p class="text-zinc-400">
        Page
    </p>

    <form onsubmit={handleSubmit}>
        <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            id="paginationPage"
            name="paginationPage"
            bind:value={inputValue}
            class="text-left w-16 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
        />
    </form>

    <p class="text-zinc-400">
        of {store.totalPages}
    </p>

    <button
        onclick={store.nextPage}
        disabled={store.currentPage >= store.totalPages - 1}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        Next
    </button>

    <button
        onclick={store.lastPage}
        disabled={store.currentPage >= store.totalPages - 1}
        class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
    >
        Last
    </button>
</div>