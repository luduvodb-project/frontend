<script lang="ts">
    import Icon from "@iconify/svelte";
    import { page } from "$app/stores";

	let { name, icon, path } = $props();

    let isActive = $derived($page.url.pathname === path);
</script>

<a
    href={path}
    class="h-12 w-full flex items-center gap-2 px-3 outline-solid outline-2 outline-zinc-800 rounded-xl transition-all active:scale-95 {isActive ? 'bg-white' : 'bg-zinc-900 hover:bg-zinc-800'}"
    title={name}
>
    <Icon class="shrink-0 {isActive ? 'text-black' : 'text-white'}" width={24} icon={icon} />
    <p class="text-lg {isActive ? 'text-black' : 'text-white'} {isActive ? 'font-bold' : 'font-regular'}">{name}</p>
</a>