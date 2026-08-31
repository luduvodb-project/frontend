<script lang="ts">
    import SortableHeader from "$lib/components/sorting/SortableHeader.svelte";

    let { store } = $props();
</script>

<div class="rounded-xl border border-zinc-800 overflow-hidden">
    <table class="w-full border-separate border-spacing-0">
        <thead>
            <tr>
                <SortableHeader label="ID" column="id" {store} class="w-24" />
                <SortableHeader label="Display Name" column="display_name" {store} class="border-l border-zinc-800" />
                <SortableHeader label="Username" column="username" {store} class="border-l border-zinc-800" />
            </tr>
        </thead>

        <tbody>
            {#each store.sortedUsers as user}
                <tr class="hover:bg-zinc-900 transition-colors">
                    <td class="text-white py-3 px-4 border-t border-zinc-800">
                        <a
                            href={`https://luduvo.com/profile/${user.id}`}
                            class="text-white hover:underline"
                        >
                            {user.id}
                        </a>
                    </td>

                    <td class="text-white text-sm py-3 px-4 border-t border-l border-zinc-800">{user.display_name}</td>
                    <td class="text-white text-sm py-3 px-4 border-t border-l border-zinc-800">{user.username}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>