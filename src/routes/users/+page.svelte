<script lang="ts">
    import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LimitSelector from "$lib/components/shared/LimitSelector.svelte";
    import QuerySelector from "$lib/components/shared/QuerySelector.svelte";
    import UserTable from "$lib/components/users/UserTable.svelte";
    import PaginationControls from "$lib/components/sorting/PaginationControls.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

    import { createUsersStore } from "$lib/users.svelte";

    const store = createUsersStore();

    store.fetchUsers(store.currentPage);
</script>

<BasePage>
    <Sidebar />

    <Page>
        <h1 class="text-white text-4xl mb-8 font-medium">Users</h1>

        <LimitSelector {store} text="Users" />
        <QuerySelector {store} />

        {#if store.loading}
            <LoadingSpinner />
        {:else if store.error}
            <p class="text-red-400">{store.error}</p>
        {:else}
            <UserTable {store} />
            <PaginationControls {store} />
        {/if}
    </Page>
</BasePage>