import { DiscordUser, DiscordGuild } from "@/lib/types";
import { toast } from "sonner";

export async function getDetails(
  discordID: string
): Promise<DiscordUser | DiscordGuild | null> {
  try {
    const userDetails = await tryUserLookup(discordID);
    return userDetails;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("API responded with status: 404")
    ) {
      const guildDetails = await tryGuildLookup(discordID);
      return guildDetails;
    }
    toast.error(
      "Error", {
        description: "An error occurred while calling the API.",
      }
    );
    throw null;
  }
}

async function tryUserLookup(discordID: string): Promise<DiscordUser> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordID }),
  });

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  const data = await response.json();

  return {
    type: "user",
    name: data.global_name,
    username: data.username,
    avatar: `avatars/${discordID}/${data.avatar}`,
    banner: data.banner ? `banners/${discordID}/${data.banner}` : undefined,
    bannerColor: data.banner_color,
    guildTag: data.primary_guild ? data.primary_guild.tag : undefined,
    guildID: data.primary_guild
      ? data.primary_guild.identity_guild_id
      : undefined,
    guildHash: data.primary_guild ? data.primary_guild.badge : undefined,
    bot: data.bot,
    flags: data.public_flags,
    avatarDecoration: data.avatar_decoration_data
      ? data.avatar_decoration_data.asset
      : undefined,
    namePlate: data.collectibles
      ? data.collectibles.nameplate.asset
      : undefined,
  };
}

async function tryGuildLookup(discordID: string): Promise<DiscordGuild> {
  const response = await fetch("/api/guild", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordID }),
  });

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  const data = await response.json();

  return {
    type: "guild",
    name: data.preview.name || data.widget.name,
    avatar: `icons/${discordID}/${data.preview.icon}` ,
    banner: !data.preview.splash ? `discovery-splashes/${discordID}/${data.preview.discovery_splash}` : `splashes/${discordID}/${data.preview.splash}`,
    description: data.preview.description || undefined,
    totalMembers: data.preview.approximate_member_count || "Unknown",
    onlineMembers: data.preview.approximate_presence_count || data.widget.presence_count,
    instantInvite: data.widget.instant_invite || undefined,
    widgetEnabled: data.widget.code === 50004 ? false : true,
    previewEnabled: data.widget.code === 10004 ? false : true,
    features: Array.isArray(data.preview.features) ? data.preview.features : [],
    emojis: data.preview.emojis,
    stickers: data.preview.stickers
  }
}
