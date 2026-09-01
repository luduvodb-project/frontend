<script lang="ts">
    import Icon from "@iconify/svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import type { Group } from "$lib/groups.svelte.ts";

    interface Props {
        groups: Group[];
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
        groups,
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

    function measureFirstRow(node: HTMLElement, isFirst: boolean) {
        if (!isFirst) return {};

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
        <h2 class="text-white text-xl font-medium">Groups</h2>

        <div class="flex items-center gap-3">
            {#if total > 0}
                <p class="text-zinc-400 text-sm">{numberFormatter.format(total)} total</p>
            {/if}

            {#if groups.length > 0}
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
    {:else if groups.length === 0}
        <p class="text-zinc-400">No groups found.</p>
    {:else}
        <div
            class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={`max-height: ${expanded || !rowHeight ? 9999 : rowHeight}px`}
        >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each groups as group, i (group.id)}
                <a
                    use:measureFirstRow={i === 0}
                    href={`https://luduvo.com/groups/${group.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-3 hover:border-zinc-700 transition-colors group"
                >
                    <div
                        class="w-12 h-12 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center"
                    >
                        {#if group.icon_url}
                            <img
                                src={group.icon_url}
                                alt={group.name}
                                class="w-full h-full object-cover"
                                loading="lazy"
                            />
                        {:else}
                            <Icon icon="lucide:users" width={20} class="text-zinc-600" />
                        {/if}
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5">
                            <p class="text-white font-medium truncate group-hover:text-primary transition-colors">
                                {group.name}
                            </p>

                            {#if group.is_owner}
                                <Icon icon="lucide:crown" width={14} class="text-white flex-shrink-0" />
                            {/if}
                        </div>

                        {#if group.description}
                            <p class="text-zinc-400 text-sm line-clamp-2 mt-0.5">{group.description}</p>
                        {/if}

                        <div class="flex items-center gap-1 mt-2 text-zinc-400 text-xs">
                            <Icon icon="lucide:user" width={12} />
                            {numberFormatter.format(group.member_count)}
                            {group.member_count === 1 ? "member" : "members"}
                        </div>
                    </div>
                </a>
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