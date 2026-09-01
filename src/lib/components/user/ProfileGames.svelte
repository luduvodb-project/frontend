<script lang="ts">
    import Icon from "@iconify/svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
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

    function accessLabel(access: string) {
        switch (access) {
            case "public":
                return "Public";
            case "private":
                return "Private";
            case "friends":
                return "Friends Only";
            default:
                return access;
        }
    }
</script>

<div class="mt-8">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-white text-xl font-medium">Games</h2>

        {#if total > 0}
            <p class="text-zinc-400 text-sm">{numberFormatter.format(total)} total</p>
        {/if}
    </div>

    {#if loading}
        <LoadingSpinner />
    {:else if error}
        <p class="text-red-400">{error}</p>
    {:else if places.length === 0}
        <p class="text-zinc-400">No games found.</p>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each places as place (place.id)}
                <a
                    href={`https://luduvo.com/games/${place.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
                >
                    <div class="relative w-full aspect-video bg-zinc-800">
                        {#if place.thumbnail_url}
                            <img
                                src={place.thumbnail_url}
                                alt={place.title}
                                class="w-full h-full object-cover"
                                loading="lazy"
                            />
                        {:else}
                            <div class="w-full h-full flex items-center justify-center">
                                <Icon icon="lucide:image-off" width={32} class="text-zinc-600" />
                            </div>
                        {/if}

                        {#if place.active_players > 0}
                            <div
                                class="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span class="text-white text-xs font-medium">
                                    {numberFormatter.format(place.active_players)}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <div class="p-3">
                        <p class="text-white font-medium truncate group-hover:text-primary transition-colors">
                            {place.title}
                        </p>

                        {#if place.description}
                            <p class="text-zinc-400 text-sm line-clamp-2 mt-1">{place.description}</p>
                        {/if}

                        <div class="flex items-center gap-3 mt-3 text-zinc-400 text-xs">
                            <span class="flex items-center gap-1">
                                <Icon icon="lucide:eye" width={14} />
                                {numberFormatter.format(place.visit_count)}
                            </span>

                            <span class="flex items-center gap-1">
                                <Icon icon="lucide:thumbs-up" width={14} />
                                {numberFormatter.format(place.thumbs_up)}
                            </span>

                            <span class="flex items-center gap-1">
                                <Icon icon="lucide:thumbs-down" width={14} />
                                {numberFormatter.format(place.thumbs_down)}
                            </span>

                            <span class="flex items-center gap-1">
                                <Icon icon="lucide:users" width={14} />
                                {place.max_players}
                            </span>
                        </div>

                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                                {accessLabel(place.access)}
                            </span>

                            {#if place.age_rating && place.age_rating !== "unrated"}
                                <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                                    {place.age_rating}
                                </span>
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        </div>

        {#if totalPages > 1}
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