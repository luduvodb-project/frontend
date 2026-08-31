<script lang="ts">
    import SidebarButton from "$lib/components/SidebarButton.svelte";

	import logo from '$lib/assets/logo.png';

    let BUTTONS: { name: string; icon: string, path: string }[] = [
        { name: "Home", icon: "lucide:home", path: "/" },
        { name: "Users", icon: "lucide:user", path: "/users" },
        { name: "Games", icon: "lucide:gamepad-2", path: "/games" },
        { name: "Groups", icon: "lucide:users", path: "/groups" }
    ];
</script>

<div class="bg-zinc-900 min-h-screen w-sm border-r-2 border-zinc-800">
	<a href="/" class="inline-block w-fit">
        <img src={logo} alt="LuduvoDB Logo" class="p-4 aspect-square w-24" />
    </a>

    <div class="w-85 mx-auto flex flex-col gap-3.5">
        {#each BUTTONS as button}
            <SidebarButton name={button.name} icon={button.icon} path={button.path} />
        {/each}
    </div>
</div>