<script lang="ts">
    import BasePage from "$lib/components/BasePage.svelte";
    import Page from "$lib/components/Page.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

    import ProfileHeader from "$lib/components/user/ProfileHeader.svelte";
    import ProfileStats from "$lib/components/user/ProfileStats.svelte";
    import ProfileGames from "$lib/components/user/ProfileGames.svelte";
    import ProfileGroups from "$lib/components/user/ProfileGroups.svelte";

    import { createPlacesStore } from "$lib/places.svelte.ts";
    import { createGroupsStore } from "$lib/groups.svelte.ts";

    import { page } from "$app/state";
 
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
 
    let id = $derived(page.params.id);
 
    let profile = $state<Profile | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
 
    let places = $derived(id ? createPlacesStore(id) : null);
    let groups = $derived(id ? createGroupsStore(id) : null);
 
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
 
    $effect(() => {
        places?.fetchPlaces(0);
    });
 
    $effect(() => {
        places?.fetchTotalVisits();
    });
 
    $effect(() => {
        groups?.fetchGroups(0);
    });
</script>
 
<svelte:head>
    {#if profile?.background_url}
        <style>
            body {
                background-color: #000;
            }
        </style>
    {/if}
</svelte:head>
 
{#if profile?.background_url}
    <div
        class="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={`background-image: url(${profile.background_url})`}
    >
        <div class="absolute inset-0 bg-black/70"></div>
    </div>
{/if}
 
<BasePage transparent={!!profile?.background_url}>
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
                totalVisits={places?.totalVisits ?? 0}
            />
 
            {#if places}
                <ProfileGames
                    places={places.places}
                    loading={places.loading}
                    error={places.error}
                    currentPage={places.currentPage}
                    totalPages={places.totalPages}
                    total={places.total}
                    onNext={places.nextPage}
                    onPrev={places.prevPage}
                    onFirst={places.firstPage}
                    onLast={places.lastPage}
                />
            {/if}
 
            {#if groups}
                <ProfileGroups
                    groups={groups.groups}
                    loading={groups.loading}
                    error={groups.error}
                    currentPage={groups.currentPage}
                    totalPages={groups.totalPages}
                    total={groups.total}
                    onNext={groups.nextPage}
                    onPrev={groups.prevPage}
                    onFirst={groups.firstPage}
                    onLast={groups.lastPage}
                />
            {/if}
        {/if}
    </Page>
</BasePage>