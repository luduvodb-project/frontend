<script lang="ts">
    interface EquippedItem {
        item_id: number;
        name: string;
        asset_type: string;
        thumbnail_url: string;
        slots: string[];
        variant_index: number;
    }

    interface Props {
        items: EquippedItem[];
    }

    let { items }: Props = $props();
</script>

{#if items.length > 0}
    <h2 class="text-white text-xl font-medium mt-8 mb-4">Equipped Items</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each items as item}
            <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center">
                <img src={item.thumbnail_url} alt={item.name} class="w-full aspect-square object-contain rounded-lg bg-zinc-950" />

                <p class="text-white text-sm mt-2 truncate w-full">{item.name}</p>
                <p class="text-zinc-500 text-xs">{item.asset_type}</p>
            </div>
        {/each}
    </div>
{/if}