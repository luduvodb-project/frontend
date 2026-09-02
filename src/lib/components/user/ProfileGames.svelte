<script lang="ts">
    import Icon from "@iconify/svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import Game from "$lib/components/shared/Game.svelte";
    import type { Place } from "$lib/places.svelte.ts";

    interface Props {
        places: Place[];
        loading: boolean;
        error: string | null;
        currentPage: number;
        totalPages: number;
        total: number;
        onNext: () => void;
        onPrev: () => void;
        onFirst: () => void;
        onLast: () => void;
    }

    let {
        places,
        loading,
        error,
        currentPage,
        totalPages,
        total,
        onNext,
        onPrev,
        onFirst,
        onLast
    }: Props = $props();

    const numberFormatter = new Intl.NumberFormat();

    let expanded = $state(false);
    let rowHeight = $state(0);

    function measureFirstRow(node: HTMLElement) {
        const update = () => (rowHeight = node.getBoundingClientRect().height);

        update();

        const observer = new ResizeObserver(update);
        observer.observe(node);

        return {
            destroy: () => observer.disconnect()
        };
    }
</script>

<div class="mt-8">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-white text-xl font-medium">Games</h2>

        <div class="flex items-center gap-3">
            {#if total > 0}
                <p class="text-zinc-400 text-sm">{numberFormatter.format(total)} total</p>
            {/if}

            {#if places.length > 0}
                <button
                    onclick={() => (expanded = !expanded)}
                    class="inline-flex items-center gap-1 text-zinc-400 hover:text-white text-sm transition-colors"
                >
                    {expanded ? "Show less" : "Show all"}
                    <Icon icon={expanded ? "lucide:chevron-up" : "lucide:chevron-down"} width={14} />
                </button>
            {/if}
        </div>
    </div>

    {#if loading}
        <LoadingSpinner />
    {:else if error}
        <p class="text-red-400">{error}</p>
    {:else if places.length === 0}
        <p class="text-zinc-400">No games found.</p>
    {:else}
        <div
            class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={`max-height: ${expanded || !rowHeight ? 9999 : rowHeight}px`}
        >
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each places as place, i (place.id)}
                <Game {place} measure={i === 0 ? measureFirstRow : undefined} />
            {/each}
        </div>
        </div>

        {#if expanded && totalPages > 1}
            <div class="flex items-center justify-center gap-2 mt-6">
                <button
                    onclick={onFirst}
                    disabled={currentPage === 0}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon icon="lucide:chevrons-left" width={16} class="text-white" />
                </button>

                <button
                    onclick={onPrev}
                    disabled={currentPage === 0}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon icon="lucide:chevron-left" width={16} class="text-white" />
                </button>

                <span class="text-zinc-400 text-sm px-2">
                    Page {currentPage + 1} of {totalPages}
                </span>

                <button
                    onclick={onNext}
                    disabled={currentPage >= totalPages - 1}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon icon="lucide:chevron-right" width={16} class="text-white" />
                </button>

                <button
                    onclick={onLast}
                    disabled={currentPage >= totalPages - 1}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon icon="lucide:chevrons-right" width={16} class="text-white" />
                </button>
            </div>
        {/if}
    {/if}
</div>