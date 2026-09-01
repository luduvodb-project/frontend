<script lang="ts">
	import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    import { page } from "$app/state";
</script>

<BasePage>
    <Sidebar />

    <Page>
        <h1 class="text-white text-4xl mb-8">
            {page.status}: {page.error?.message}
        </h1>
    </Page>
</BasePage>