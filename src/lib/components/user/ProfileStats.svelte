<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        friendCount: number;
        placeCount: number;
        itemCount: number;
        networth: number;
    }

    let { friendCount, placeCount, itemCount, networth }: Props = $props();
</script>

<div class="flex gap-4 mt-6">
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
        <p class="text-zinc-400 text-sm">Friends</p>
        <p class="text-white text-2xl font-semibold">{friendCount}</p>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
        <p class="text-zinc-400 text-sm">Places</p>
        <p class="text-white text-2xl font-semibold">{placeCount}</p>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
        <p class="text-zinc-400 text-sm">Items</p>
        <p class="text-white text-2xl font-semibold">{itemCount}</p>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
        <p class="text-zinc-400 text-sm">Net Worth</p>

        <p class="text-white text-2xl font-semibold flex gap-1.5">
            {networth.toLocaleString()}
            <Icon icon="lucide:moon" width={24} class="text-white mt-1" />
        </p>
    </div>
</div>