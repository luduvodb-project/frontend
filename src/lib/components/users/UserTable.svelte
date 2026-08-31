<script lang="ts">
    import Icon from "@iconify/svelte";
    import SortableHeader from "$lib/components/sorting/SortableHeader.svelte";

    let { store } = $props();
</script>

<div class="rounded-xl border border-zinc-800 overflow-hidden">
    <table class="w-full border-separate border-spacing-0">
        <thead>
            <tr>
                <SortableHeader label="Link" column="link" {store} class="w-12" canSort={false} />
                <SortableHeader label="ID" column="id" {store} class="w-24 border-l border-zinc-800" />
                <SortableHeader label="Display Name" column="display_name" {store} class="border-l border-zinc-800" />
                <SortableHeader label="Username" column="username" {store} class="border-l border-zinc-800" />
            </tr>
        </thead>

        <tbody>
            {#each store.sortedUsers as user}
                <tr class="hover:bg-zinc-900 transition-colors">
                    <td class="py-3 px-4 border-t border-zinc-800">
                        <a
                            href={`/user/${user.id}`}
                            title="View User Page"
                            class="text-primary hover:underline"
                        >
                            <Icon icon="lucide:external-link" width={16} />
                        </a>
                    </td>

                    <td class="text-white text-sm py-3 px-4 border-t border-l border-zinc-800">{user.id}</td>
                    <td class="text-white text-sm py-3 px-4 border-t border-l border-zinc-800">{user.display_name}</td>
                    <td class="text-white text-sm py-3 px-4 border-t border-l border-zinc-800">{user.username}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>