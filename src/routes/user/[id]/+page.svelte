<script lang="ts">
    import Icon from "@iconify/svelte";

	import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

    import { page } from "$app/stores";

    interface EquippedItem {
        item_id: number;
        name: string;
        asset_type: string;
        thumbnail_url: string;
        slots: string[];
        variant_index: number;
    }

    interface Profile {
        user_id: number;
        username: string;
        member_since: number;
        networth: number;
        display_name: string;
        status: string;
        bio: string;
        avatar: Record<string, string>;
        accent_color: string;
        banner_url: string;
        background_url: string;
        equipped_items: EquippedItem[];
        badges: unknown[];
        friend_count: number;
        place_count: number;
        item_count: number;
        last_active: number;
        join_policy: string;
        is_owner: boolean;
    }

    let id = $derived($page.params.id);

    let profile = $state<Profile | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function fetchProfile() {
        loading = true;
        error = null;

        try {
            const res = await fetch(`https://api.luduvo.com/users/${id}/profile`);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            profile = await res.json();
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load profile";
        } finally {
            loading = false;
        }
    }

    function formatDate(unixSeconds: number) {
        return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function formatRelative(unixSeconds: number) {
        const diffMs = Date.now() - unixSeconds * 1000;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);

        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);

        return `${diffDays}d ago`;
    }

    fetchProfile();
</script>

<BasePage>
    <Sidebar />

    <Page>
        {#if loading}
            <LoadingSpinner />
        {:else if error}
            <p class="text-red-400">{error}</p>
        {:else if profile}
            {#if profile.banner_url}
                <div
                    class="w-full h-48 rounded-xl bg-zinc-900 border border-zinc-800 bg-cover bg-center"
                    style={profile.banner_url ? `background-image: url(${profile.banner_url})` : ""}
                ></div>
            {/if}
            
            <div class="flex items-start justify-between mt-6">
                <div class="flex items-start gap-4">
                    <img
                        src={`https://api.luduvo.com/users/${id}/avatar/headshot`}
                        alt={`${profile.display_name}'s headshot`}
                        class="w-50 h-50 rounded-xl border border-zinc-800 bg-zinc-900 object-cover"
                    />

                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-white text-4xl font-medium">{profile.display_name}</h1>

                            <a
                                href={`https://luduvo.com/profile/${profile.user_id}`}
                                title="Go to profile"
                                class="inline-flex items-center justify-center bg-zinc-800 hover:bg-primary active:scale-95 transition-all rounded-full w-7 h-7"
                            >
                                <Icon icon="lucide:external-link" width={16} class="text-white" />
                            </a>
                        </div>

                        <p class="text-zinc-400 text-lg">@{profile.username}</p>
                    </div>
                </div>

                <div class="text-right text-zinc-400 text-sm">
                    <p>Member since {formatDate(profile.member_since)}</p>
                    <p>Last active {formatRelative(profile.last_active)}</p>
                </div>
            </div>
            
            {#if profile.bio}
                <p class="text-white mt-4">{profile.bio}</p>
            {/if}
            
            <div class="flex gap-4 mt-6">
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Friends</p>
                    <p class="text-white text-2xl font-semibold">{profile.friend_count}</p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Places</p>
                    <p class="text-white text-2xl font-semibold">{profile.place_count}</p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Items</p>
                    <p class="text-white text-2xl font-semibold">{profile.item_count}</p>
                </div>

                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                    <p class="text-zinc-400 text-sm">Net Worth</p>

                    <p class="text-white text-2xl font-semibold flex gap-1.5">
                        {profile.networth.toLocaleString()}

                        <Icon icon="lucide:moon" width={24} class="text-white mt-1" />
                    </p>
                </div>
            </div>
            
            {#if profile.equipped_items.length > 0}
                <h2 class="text-white text-xl font-medium mt-8 mb-4">Equipped Items</h2>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {#each profile.equipped_items as item}
                        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center">
                            <img src={item.thumbnail_url} alt={item.name} class="w-full aspect-square object-contain rounded-lg bg-zinc-950" />
                            
                            <p class="text-white text-sm mt-2 truncate w-full">{item.name}</p>
                            <p class="text-zinc-500 text-xs">{item.asset_type}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </Page>
</BasePage>