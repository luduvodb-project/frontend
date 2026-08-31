<script lang="ts">
    import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import ProfileHeader from "$lib/components/user/ProfileHeader.svelte";
    import ProfileStats from "$lib/components/user/ProfileStats.svelte";
    import EquippedItems from "$lib/components/user/EquippedItems.svelte";

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
            <ProfileHeader
                userId={profile.user_id}
                displayName={profile.display_name}
                username={profile.username}
                bio={profile.bio}
                bannerUrl={profile.banner_url}
                memberSince={profile.member_since}
                lastActive={profile.last_active}
            />

            <ProfileStats
                friendCount={profile.friend_count}
                placeCount={profile.place_count}
                itemCount={profile.item_count}
                networth={profile.networth}
            />

            <EquippedItems items={profile.equipped_items} />
        {/if}
    </Page>
</BasePage>