import { DiscordUser } from "@/lib/types";

export async function getDetails(discordID: string): Promise<DiscordUser> {
  try {
    const userDetails = await tryUserLookup(discordID);
    return userDetails;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw new Error("Failed to fetch user details");
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
    avatar: data.avatar,
    banner: data.banner,
    bannerColor: data.banner_color,
    guildTag: data.primary_guild ? data.primary_guild.tag : undefined,
    guildID: data.primary_guild ? data.primary_guild.identity_guild_id : undefined,
    bot: data.bot,
    flags: data.public_flags
  };
}