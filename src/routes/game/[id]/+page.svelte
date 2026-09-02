<script lang="ts">
    import Icon from "@iconify/svelte";
    import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import type { Place } from "$lib/places.svelte.ts";

    import { page } from "$app/state";

    let id = $derived(page.params.id);

    let place = $state<Place | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    const numberFormatter = new Intl.NumberFormat();

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    function formatDate(unixSeconds: number) {
        return dateFormatter.format(unixSeconds * 1000);
    }

    function formatRelative(unixSeconds: number) {
        const diffSeconds = unixSeconds - Date.now() / 1000;

        const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
            ["year", 60 * 60 * 24 * 365],
            ["month", 60 * 60 * 24 * 30],
            ["day", 60 * 60 * 24],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1]
        ];

        for (const [unit, secondsInUnit] of divisions) {
            if (Math.abs(diffSeconds) >= secondsInUnit || unit === "second") {
                return relativeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit);
            }
        }

        return relativeFormatter.format(0, "second");
    }

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

    async function fetchPlace() {
        loading = true;
        error = null;

        try {
            const res = await fetch(`https://api.luduvo.com/places/${id}`);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            place = await res.json();
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load game";
        } finally {
            loading = false;
        }
    }

    fetchPlace();
</script>

<BasePage>
    <Sidebar />

    <Page>
        {#if loading}
            <LoadingSpinner />
        {:else if error}
            <p class="text-red-400">{error}</p>
        {:else if place}
            <div class="w-full h-64 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                {#if place.thumbnail_url}
                    <img
                        src={place.thumbnail_url}
                        alt={place.title}
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <div class="w-full h-full flex items-center justify-center">
                        <Icon icon="lucide:image-off" width={48} class="text-zinc-600" />
                    </div>
                {/if}
            </div>

            <div class="flex items-start justify-between mt-6">
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-white text-4xl font-medium">{place.title}</h1>

                        <a
                            href={`https://luduvo.com/games/${place.id}`}
                            title="Play"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center justify-center bg-zinc-800 hover:bg-primary active:scale-95 transition-all rounded-full w-7 h-7"
                        >
                            <Icon icon="lucide:external-link" width={16} class="text-white" />
                        </a>

                        {#if place.active_players > 0}
                            <span class="inline-flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span class="text-white text-xs font-medium">
                                    {numberFormatter.format(place.active_players)} playing
                                </span>
                            </span>
                        {/if}
                    </div>

                    <a
                        href={`https://luduvo.com/profile/${place.owner_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-zinc-400 hover:text-white text-lg transition-colors"
                    >
                        @{place.owner_username}
                    </a>
                </div>

                <div class="text-right text-zinc-400 text-sm">
                    <p>Created {formatDate(place.created_at)}</p>
                    <p>Updated {formatRelative(place.updated_at)}</p>
                </div>
            </div>

            {#if place.description}
                <p class="text-white mt-4">{place.description}</p>
            {/if}

            <div class="flex items-center gap-2 mt-4">
                <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {accessLabel(place.access)}
                </span>

                {#if place.age_rating && place.age_rating !== "unrated"}
                    <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {place.age_rating}
                    </span>
                {/if}

                {#each place.content_warnings as warning}
                    <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {warning}
                    </span>
                {/each}
            </div>

            <div class="flex gap-4 mt-6">
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Visits</p>
                    <p class="text-white text-2xl font-semibold">
                        {numberFormatter.format(place.visit_count)}
                    </p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Thumbs Up</p>
                    <p class="text-white text-2xl font-semibold">
                        {numberFormatter.format(place.thumbs_up)}
                    </p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Thumbs Down</p>
                    <p class="text-white text-2xl font-semibold">
                        {numberFormatter.format(place.thumbs_down)}
                    </p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Max Players</p>
                    <p class="text-white text-2xl font-semibold">{place.max_players}</p>
                </div>
            </div>
        {/if}
    </Page>
</BasePage>