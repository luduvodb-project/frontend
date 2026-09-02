<script lang="ts">
    import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import Game from "$lib/components/shared/Game.svelte";
    import PaginationControls from "$lib/components/sorting/PaginationControls.svelte";
    import LimitSelector from "$lib/components/shared/LimitSelector.svelte";
    import QuerySelector from "$lib/components/shared/QuerySelector.svelte";
    import type { Place } from "$lib/places.svelte.ts";

    const PRESET_LIMITS = [10, 25, 50, 100];

    let places = $state<Place[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    let currentPage = $state(0);
    let limit = $state(50);
    let total = $state(0);

    let query = $state("");

    let selectedPreset = $state<number | "custom">(50);
    let customLimit = $state(50);

    let totalPages = $derived(Math.max(1, Math.ceil(total / limit)));

    const numberFormatter = new Intl.NumberFormat();

    async function fetchPlaces(pageIndex: number) {
        loading = true;
        error = null;

        try {
            const offset = pageIndex * limit;
            const params = new URLSearchParams({
                offset: String(offset),
                limit: String(limit)
            });

            if (query.trim()) {
                params.set("q", query.trim());
            }

            const res = await fetch(`https://api.luduvo.com/places?${params}`);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            places = data.places;
            total = data.total;
            limit = data.limit;
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load games";
        } finally {
            loading = false;
        }
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage += 1;

            fetchPlaces(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;

            fetchPlaces(currentPage);
        }
    }

    function firstPage() {
        if (currentPage !== 0) {
            currentPage = 0;

            fetchPlaces(currentPage);
        }
    }

    function lastPage() {
        const last = totalPages - 1;

        if (currentPage !== last) {
            currentPage = last;

            fetchPlaces(currentPage);
        }
    }

    function setPage(pageNumber: number) {
        const target = Math.min(Math.max(pageNumber - 1, 0), totalPages - 1);

        if (target !== currentPage && !Number.isNaN(target)) {
            currentPage = target;

            fetchPlaces(currentPage);
        }
    }

    function handlePresetChange(e: Event) {
        const value = (e.target as HTMLSelectElement).value;

        if (value === "custom") {
            selectedPreset = "custom";
            return;
        }

        selectedPreset = Number(value);
        limit = selectedPreset;
        currentPage = 0;

        fetchPlaces(currentPage);
    }

    function handleCustomLimitSubmit(e: SubmitEvent) {
        e.preventDefault();

        if (customLimit < 1 || customLimit > 100) return;

        limit = customLimit;
        currentPage = 0;

        fetchPlaces(currentPage);
    }

    function handleQuerySubmit(e: SubmitEvent) {
        e.preventDefault();

        currentPage = 0;

        fetchPlaces(currentPage);
    }

    const pagination = {
        get currentPage() { return currentPage; },
        get totalPages() { return totalPages; },
        firstPage,
        prevPage,
        nextPage,
        lastPage,
        setPage
    };

    const limitSelector = {
        PRESET_LIMITS,
        get selectedPreset() { return selectedPreset; },
        get customLimit() { return customLimit; },
        set customLimit(value: number) { customLimit = value; },
        handlePresetChange,
        handleCustomLimitSubmit
    };

    const querySelector = {
        get query() { return query; },
        set query(value: string) { query = value; },
        handleQuerySubmit
    };

    fetchPlaces(currentPage);
</script>

<BasePage>
    <Sidebar />

    <Page>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-white text-4xl font-medium">Games</h1>

            {#if total > 0}
                <p class="text-zinc-400 text-sm">{numberFormatter.format(total)} total</p>
            {/if}
        </div>

        <LimitSelector store={limitSelector} text="Games" />
        <QuerySelector store={querySelector} />

        {#if loading}
            <LoadingSpinner />
        {:else if error}
            <p class="text-red-400">{error}</p>
        {:else if places.length === 0}
            <p class="text-zinc-400">No games found.</p>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each places as place (place.id)}
                    <Game {place} />
                {/each}
            </div>

            {#if totalPages > 1}
                <PaginationControls store={pagination} />
            {/if}
        {/if}
    </Page>
</BasePage>