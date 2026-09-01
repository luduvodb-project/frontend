export interface Group {
    id: number;
    name: string;
    description: string | null;
    owner_id: number;
    owner_username: string;
    access: string;
    member_count: number;
    icon_url: string;
    created_at: number;
    updated_at: number;
    is_owner: boolean;
}

export function createGroupsStore(userId: number | string) {
    let groups = $state<Group[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    let currentPage = $state(0);
    let limit = $state(50);
    let total = $state(0);

    let totalPages = $derived(Math.max(1, Math.ceil(total / limit)));

    async function fetchGroups(pageIndex: number) {
        loading = true;
        error = null;

        try {
            const offset = pageIndex * limit;
            const res = await fetch(
                `https://api.luduvo.com/users/${userId}/groups?offset=${offset}&limit=${limit}`
            );

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            groups = data.groups;
            total = data.total;
            limit = data.limit;
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load groups";
        } finally {
            loading = false;
        }
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage += 1;

            fetchGroups(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;

            fetchGroups(currentPage);
        }
    }

    function firstPage() {
        if (currentPage !== 0) {
            currentPage = 0;

            fetchGroups(currentPage);
        }
    }

    function lastPage() {
        const last = totalPages - 1;

        if (currentPage !== last) {
            currentPage = last;

            fetchGroups(currentPage);
        }
    }

    return {
        get groups() { return groups; },
        get loading() { return loading; },
        get error() { return error; },
        get currentPage() { return currentPage; },
        get limit() { return limit; },
        get total() { return total; },
        get totalPages() { return totalPages; },
        fetchGroups,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
    };
}