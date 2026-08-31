<script lang="ts">
	import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import UserLimitSelector from "$lib/components/users/UserLimitSelector.svelte";
    import UserTable from "$lib/components/users/UserTable.svelte";
    import PaginationControls from "$lib/components/sorting/PaginationControls.svelte";

    import { createUsersStore } from "$lib/users.svelte";

    const store = createUsersStore();

    store.fetchUsers(store.currentPage);
</script>

<BasePage>
    <Sidebar />

    <Page>
        <h1 class="text-white text-4xl mb-8 font-medium">Users</h1>

        <UserLimitSelector {store} />

        {#if store.loading}
            <div class="flex items-center justify-center py-12">
                <div class="w-8 h-8 border-4 border-zinc-700 border-t-primary rounded-full animate-spin"></div>
            </div>
        {:else if store.error}
            <p class="text-red-400">{store.error}</p>
        {:else}
            <UserTable {store} />
            <PaginationControls {store} />
        {/if}
    </Page>
</BasePage>