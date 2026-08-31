<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        userId: number;
        displayName: string;
        username: string;
        bio: string;
        bannerUrl: string;
        memberSince: number;
        lastActive: number;
    }

    let { userId, displayName, username, bio, bannerUrl, memberSince, lastActive }: Props = $props();

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    function formatDate(unixSeconds: number) {
        return dateFormatter.format(unixSeconds * 1000);
    }

    function formatRelative(unixSeconds: number) {
        const diffSeconds = unixSeconds - Date.now() / 1000;

        const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
            ["year", 60 * 60 * 24 * 365],
            ["month", 60 * 60 * 24 * 30],
            ["day", 60 * 60 * 24],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1]
        ];

        for (const [unit, secondsInUnit] of divisions) {
            if (Math.abs(diffSeconds) >= secondsInUnit || unit === "second") {
                return relativeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit);
            }
        }

        return relativeFormatter.format(0, "second");
    }
</script>

{#if bannerUrl}
    <div
        class="w-full h-48 rounded-xl bg-zinc-900 border border-zinc-800 bg-cover bg-center"
        style={`background-image: url(${bannerUrl})`}
    ></div>
{/if}

<div class="flex items-start justify-between mt-6">
    <div class="flex items-start gap-4">
        <img
            src={`https://api.luduvo.com/users/${userId}/avatar/headshot`}
            alt={`${displayName}'s headshot`}
            class="w-50 h-50 rounded-xl border border-zinc-800 bg-zinc-900 object-cover"
        />

        <div>
            <div class="flex items-center gap-2">
                <h1 class="text-white text-4xl font-medium">{displayName}</h1>

                <a
                    href={`https://luduvo.com/profile/${userId}`}
                    title="Go to profile"
                    class="inline-flex items-center justify-center bg-zinc-800 hover:bg-primary active:scale-95 transition-all rounded-full w-7 h-7"
                >
                    <Icon icon="lucide:external-link" width={16} class="text-white" />
                </a>
            </div>

            <p class="text-zinc-400 text-lg">@{username}</p>
        </div>
    </div>

    <div class="text-right text-zinc-400 text-sm">
        <p>Member since {formatDate(memberSince)}</p>
        <p>Last active {formatRelative(lastActive)}</p>
    </div>
</div>

{#if bio}
    <p class="text-white mt-4">{bio}</p>
{/if}