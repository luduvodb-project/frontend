<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Place } from "$lib/places.svelte.ts";

    interface Props {
        place: Place;
        measure?: (node: HTMLElement) => { destroy: () => void } | Record<string, never>;
    }

    let { place, measure }: Props = $props();

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

    function measureAction(node: HTMLElement) {
        if (measure) return measure(node);
        return {};
    }
</script>

<a
    use:measureAction
    href={`/game/${place.id}`}
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