export type DiscordUser = {
  type: "user";
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  bannerColor?: string;
  guildTag?: string;
  guildID?: string;
  guildHash?: string;
  bot?: boolean;
  flags?: number;
  avatarDecoration?: string;
  namePlate?: string;
};