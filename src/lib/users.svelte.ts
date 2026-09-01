export interface User {
    id: number;
    username: string;
    [key: string]: unknown;
}

export type SortColumn = "id" | "username";

export function createUsersStore() {
    let users = $state<User[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    let currentPage = $state(0);
    let limit = $state(25);
    let total = $state(0);

    const PRESET_LIMITS = [5, 10, 25, 50, 100];

    let selectedPreset = $state<number | "custom">(25);
    let customLimit = $state(25);

    let query = $state("");

    let sortColumn = $state<SortColumn>("id");
    let sortDirection = $state<"asc" | "desc">("desc");

    let totalPages = $derived(Math.max(1, Math.ceil(total / limit)));

    let sortedUsers = $derived(
        [...users].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            let cmp: number;

            if (typeof aVal === "number" && typeof bVal === "number") {
                cmp = aVal - bVal;
            } else {
                cmp = String(aVal).localeCompare(String(bVal));
            }

            return sortDirection === "asc" ? cmp : -cmp;
        })
    );

    async function fetchUsers(pageIndex: number) {
        loading = true;
        error = null;

        try {
            const offset = pageIndex * limit;
            const res = await fetch(`https://api.luduvo.com/users?offset=${offset}&limit=${limit}&q=${query}`);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            users = data.users;
            total = data.total;
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load users";
        } finally {
            loading = false;
        }
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage += 1;

            fetchUsers(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;

            fetchUsers(currentPage);
        }
    }

    function firstPage() {
        if (currentPage !== 0) {
            currentPage = 0;

            fetchUsers(currentPage);
        }
    }

    function lastPage() {
        const last = totalPages - 1;

        if (currentPage !== last) {
            currentPage = last;

            fetchUsers(currentPage);
        }
    }

    function setPage(pageNumber: number) {
        const target = Math.min(Math.max(pageNumber - 1, 0), totalPages - 1);

        if (target !== currentPage && !Number.isNaN(target)) {
            currentPage = target;

            fetchUsers(currentPage);
        }
    }

    function applyLimit(newLimit: number) {
        if (newLimit < 1 || newLimit > 100) return;

        limit = newLimit;
        currentPage = 0;

        fetchUsers(currentPage);
    }

    function applyQuery(newQuery: string) {
        query = newQuery;
        currentPage = 0;

        fetchUsers(currentPage);
    }

    function handlePresetChange(e: Event) {
        const value = (e.target as HTMLSelectElement).value;

        if (value === "custom") {
            selectedPreset = "custom";
        } else {
            selectedPreset = Number(value);

            applyLimit(selectedPreset);
        }
    }

    function handleCustomLimitSubmit(e: SubmitEvent) {
        e.preventDefault();

        applyLimit(customLimit);
    }

    function handleQuerySubmit(e: SubmitEvent) {
        e.preventDefault();

        applyQuery(query);
    }

    function toggleSort(column: SortColumn) {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "asc";
        }
    }

    return {
        get users() { return users; },
        get loading() { return loading; },
        get error() { return error; },
        get currentPage() { return currentPage; },
        get limit() { return limit; },
        get total() { return total; },
        get totalPages() { return totalPages; },
        get sortedUsers() { return sortedUsers; },
        get sortColumn() { return sortColumn; },
        get sortDirection() { return sortDirection; },
        get selectedPreset() { return selectedPreset; },
        get customLimit() { return customLimit; },
        set customLimit(v: number) { customLimit = v; },
        get query() { return query; },
        set query(v: string) { query = v; },
        PRESET_LIMITS,
        fetchUsers,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        setPage,
        applyLimit,
        applyQuery,
        handlePresetChange,
        handleCustomLimitSubmit,
        handleQuerySubmit,
        toggleSort,
    };
}