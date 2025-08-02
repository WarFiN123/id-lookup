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

export type DiscordGuild = {
  type: "guild";
  name: string;
  avatar: string;
  banner?: string;
  description: string;
  totalMembers: number;
  onlineMembers: number;
  instantInvite?: string;
  widgetEnabled: boolean;
  features?: string[];
  emojis?: {
    id: string;
    name: string;
  }[];
  guildTag?: string;
  guildID?: string;
  guildHash?: string;
  bot?: boolean;
  flags?: number;
};