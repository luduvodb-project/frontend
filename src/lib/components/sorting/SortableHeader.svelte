<script lang="ts">
    import Icon from "@iconify/svelte";

    let { label, column, store, class: className = "" } = $props();
</script>

<th class="text-left text-primary font-medium py-2 px-4 {className}">
    <button
        onclick={() => store.toggleSort(column)}
        class="flex items-center gap-1 hover:text-primary-dark transition-colors"
    >
        {label}
        {#if store.sortColumn === column}
            <Icon
                class="text-primary"
                width={16}
                icon={store.sortDirection === "asc" ? "lucide:chevron-up" : "lucide:chevron-down"}
            />
        {/if}
    </button>
</th>