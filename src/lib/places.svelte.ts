export interface Place {
    id: number;
    owner_id: number;
    group_id: number | null;
    owner_username: string;
    title: string;
    description: string;
    access: string;
    max_players: number;
    visit_count: number;
    thumbs_up: number;
    thumbs_down: number;
    active_players: number;
    created_at: number;
    updated_at: number;
    thumbnail_url: string | null;
    square_thumbnail_url: string | null;
    age_rating: string;
    content_warnings: string[];
    content_warning: string | null;
}

export function createPlacesStore(userId: number | string) {
    let places = $state<Place[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    let currentPage = $state(0);
    let limit = $state(50);
    let total = $state(0);

    let totalPages = $derived(Math.max(1, Math.ceil(total / limit)));

    async function fetchPlaces(pageIndex: number) {
        loading = true;
        error = null;

        try {
            const offset = pageIndex * limit;
            const res = await fetch(
                `https://api.luduvo.com/users/${userId}/places?offset=${offset}&limit=${limit}`
            );

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

    return {
        get places() { return places; },
        get loading() { return loading; },
        get error() { return error; },
        get currentPage() { return currentPage; },
        get limit() { return limit; },
        get total() { return total; },
        get totalPages() { return totalPages; },
        fetchPlaces,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
    };
}