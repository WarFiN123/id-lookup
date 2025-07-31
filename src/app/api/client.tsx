import { DiscordUser, DiscordGuild } from "@/lib/types";

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
      console.log("Guild details found:", guildDetails);
      return guildDetails;
    }
    throw error;
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
    name: data.name,
    avatar: `icons/${discordID}/${data.icon}`,
    banner: !data.splash ? `discovery-splashes/${discordID}/${data.discovery_splash}` : `splashes/${discordID}/${data.splash}`,
    description: data.description || undefined,
  }
}
