"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Send,
  Loader2Icon,
  Sun,
  MoonStar,
  ClockPlus,
  Tag,
  UserStar,
  PaintRoller,
  LinkIcon,
} from "lucide-react";
import { getDetails } from "@/app/api/client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DiscordUser, DiscordGuild } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const [discordID, setDiscordID] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();
  const [responseData, setResponseData] = useState<
    DiscordUser | DiscordGuild | null
  >(null);
  const [currentID, setCurrentID] = useState<string>("");

  const isValidID = (idString: string) => {
    const regex = /^\d{17,20}$/;
    return regex.test(idString);
  };

  const snowflakeToDate = (snowflake: string) => {
    const DISCORD_EPOCH = 1420070400000;
    const snowflakeBigInt = BigInt(snowflake);
    const timestampOffset = snowflakeBigInt >> 22n;
    const unixTimestamp = Number(timestampOffset) + DISCORD_EPOCH;
    return new Date(unixTimestamp);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setCurrentID(discordID);
      const response = await getDetails(discordID);
      console.log("Response data:", response);
      setResponseData(response || null);
    } catch {
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  const checkDiscordUserFlags = (publicFlags: number) => {
    const FLAGS = {
      STAFF: 1 << 0,
      PARTNER: 1 << 1,
      HYPESQUAD_EVENTS: 1 << 2,
      BUG_HUNTER_LEVEL_1: 1 << 3,
      HYPESQUAD_HOUSE_BRAVERY: 1 << 6,
      HYPESQUAD_HOUSE_BRILLIANCE: 1 << 7,
      HYPESQUAD_HOUSE_BALANCE: 1 << 8,
      PREMIUM_EARLY_SUPPORTER: 1 << 9,
      TEAM_PSEUDO_USER: 1 << 10,
      BUG_HUNTER_LEVEL_2: 1 << 14,
      VERIFIED_BOT: 1 << 16,
      VERIFIED_DEVELOPER: 1 << 17,
      CERTIFIED_MODERATOR: 1 << 18,
      BOT_HTTP_INTERACTIONS: 1 << 19,
      SPAMMER: 1 << 20,
      ACTIVE_DEVELOPER: 1 << 22,
    };

    const hasFlag = (flag: number): boolean => (publicFlags & flag) === flag;

    let hypeSquadHouse: "Bravery" | "Brilliance" | "Balance" | null = null;
    if (hasFlag(FLAGS.HYPESQUAD_HOUSE_BRAVERY)) hypeSquadHouse = "Bravery";
    else if (hasFlag(FLAGS.HYPESQUAD_HOUSE_BRILLIANCE))
      hypeSquadHouse = "Brilliance";
    else if (hasFlag(FLAGS.HYPESQUAD_HOUSE_BALANCE)) hypeSquadHouse = "Balance";

    return {
      isSpammer: hasFlag(FLAGS.SPAMMER),
      hypeSquadHouse,
      isStaff: hasFlag(FLAGS.STAFF),
      isPartner: hasFlag(FLAGS.PARTNER),
      isHypeSquadEventsMember: hasFlag(FLAGS.HYPESQUAD_EVENTS),
      isBugHunterLevel1: hasFlag(FLAGS.BUG_HUNTER_LEVEL_1),
      isBugHunterLevel2: hasFlag(FLAGS.BUG_HUNTER_LEVEL_2),
      isPremiumEarlySupporter: hasFlag(FLAGS.PREMIUM_EARLY_SUPPORTER),
      isTeamPseudoUser: hasFlag(FLAGS.TEAM_PSEUDO_USER),
      isVerifiedBot: hasFlag(FLAGS.VERIFIED_BOT),
      isVerifiedDeveloper: hasFlag(FLAGS.VERIFIED_DEVELOPER),
      isCertifiedModerator: hasFlag(FLAGS.CERTIFIED_MODERATOR),
      isBotHttpInteractions: hasFlag(FLAGS.BOT_HTTP_INTERACTIONS),
      isActiveDeveloper: hasFlag(FLAGS.ACTIVE_DEVELOPER),
    };
  };

  const userFlags = useMemo(() => {
    if (responseData?.flags === undefined) return null;
    return checkDiscordUserFlags(responseData.flags);
  }, [responseData]);

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex flex-col items-center">
        <main className="flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl font-bold">
              Discord ID Lookup
            </h1>

            <p className="mt-2">Currently only supports users/bots.</p>
          </div>
          <Card className="w-full max-w-md mt-4">
            <CardContent>
              <form onSubmit={handleLookup}>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Discord ID"
                    onChange={(e) => setDiscordID(e.target.value)}
                    value={discordID}
                    className=""
                  />
                  <Button
                    variant="default"
                    size={"icon"}
                    disabled={!isValidID(discordID) || loading}
                    type="submit"
                    aria-label="Submit"
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          {responseData && (
            <Card className="w-full max-w-md mt-4 relative">
              <CardHeader>
                {responseData.banner ? (
                  <Image
                    src={`https://cdn.discordapp.com/${responseData.banner}?size=1024`}
                    alt="Banner"
                    width={1024}
                    height={409}
                    className="rounded w-full h-[155px] object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-[155px] rounded"
                    style={{
                      backgroundColor:
                        responseData.type === "user" && responseData.bannerColor
                          ? responseData.bannerColor
                          : "#1f1f1f",
                    }}
                  >
                    {responseData.type === "user" && !responseData.banner && (
                      <div className="flex items-center justify-center text-white tracking-wide h-full">
                        No Banner
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute top-[170px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:shadow-2xl">
                  <Avatar className="size-25 border-4 border">
                    <AvatarImage
                      src={`https://cdn.discordapp.com/${responseData.avatar}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      <Image
                        src="/discord.svg"
                        alt="Discord"
                        width="50"
                        height="50"
                        className="dark:brightness-100 brightness-0"
                      />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center justify-center">
                  <h2 className="text-2xl font-bold mt-2">
                    {responseData.name}
                  </h2>
                  {responseData.type === "guild" &&
                    responseData.description && (
                      <h3 className="text-center justify-center ml-15 mr-15 tracking-tight text-muted-foreground">
                        {responseData.description}
                      </h3>
                    )}

                  {responseData.type === "guild" && (
                    <>
                    <Badge variant={"secondary"}>
                      {responseData.totalMembers} Members
                    </Badge>

                    <Badge variant={"outline"} className="ml-2">
                      {responseData.onlineMembers} Online
                    </Badge>

                    <Badge
                      variant={responseData.widgetEnabled ? "outline" : "destructive"} className="ml-2">
                     Widget {responseData.widgetEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    </>
                    )}

                  {responseData.type === "user" && responseData.username && (
                    <Badge variant={"secondary"}>
                      @{responseData.username}
                    </Badge>
                  )}

                  {responseData.guildTag && (
                    <Badge className="ml-2" variant={"outline"} asChild>
                      <Link
                        href={`https://discordlookup.com/guild/${responseData.guildID}`}
                        target="_blank"
                      >
                        <Image
                          src={`https://cdn.discordapp.com/guild-tag-badges/${responseData.guildID}/${responseData.guildHash}`}
                          alt="Badge"
                          width={15}
                          height={15}
                        />
                        {responseData.guildTag}
                      </Link>
                    </Badge>
                  )}

                  {responseData.bot && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-600 text-white"
                    >
                      Bot
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex gap-1 items-center text-sm ml-2 tracking-tight">
                  <ClockPlus className="size-5 text-muted-foreground" /> Created
                  at:
                  <Tooltip>
                    <TooltipTrigger className="underline font-mono tracking-tighter">
                      {snowflakeToDate(currentID).toLocaleDateString()}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">
                        {snowflakeToDate(currentID).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {responseData.type === "guild" && responseData.instantInvite && (
                  <div className="mt-4 flex gap-1 items-center text-sm ml-2 tracking-tight">
                    <LinkIcon className="size-5 text-muted-foreground" /> Instant Invite:
                    <Link
                      href={responseData.instantInvite}
                      target="_blank"
                      className="underline"
                    >
                      {responseData.instantInvite}
                    </Link>
                  </div>
                )}

                {userFlags && (
                  <div className="mt-4 flex gap-1 items-center text-sm ml-2 tracking-tight flex-wrap">
                    <Tag className="size-5 text-muted-foreground" />

                    {!responseData.flags && <span>No user tags</span>}

                    {userFlags.isStaff && (
                      <Badge variant="destructive">Staff</Badge>
                    )}

                    {userFlags.isVerifiedBot && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        Verified Bot
                      </Badge>
                    )}

                    {userFlags.isPartner && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        Partnered Server Owner
                      </Badge>
                    )}

                    {userFlags.isCertifiedModerator && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        Moderator
                      </Badge>
                    )}

                    {userFlags.isVerifiedDeveloper && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        Verified Developer
                      </Badge>
                    )}

                    {userFlags.isSpammer && (
                      <Badge variant="destructive">Spammer</Badge>
                    )}

                    {userFlags.isActiveDeveloper && (
                      <Badge variant="outline">Active Developer</Badge>
                    )}

                    {userFlags.isPremiumEarlySupporter && (
                      <Badge variant="outline"> Early Nitro Supporter</Badge>
                    )}

                    {userFlags.hypeSquadHouse && (
                      <Badge
                        variant="default"
                        className={
                          userFlags.hypeSquadHouse === "Bravery"
                            ? "bg-[#9c81f2]"
                            : userFlags.hypeSquadHouse === "Brilliance"
                            ? "bg-[#f67b63]"
                            : "bg-[#3adec0]"
                        }
                      >
                        HypeSquad {userFlags.hypeSquadHouse}
                      </Badge>
                    )}
                  </div>
                )}

                {responseData.type === "user" && (
                  <>
                    <div className="mt-4 flex gap-1 items-center text-sm ml-2 tracking-tight">
                      <UserStar className="size-5 text-muted-foreground" />
                      {!responseData.avatarDecoration ? (
                        <span>No Avatar Decoration</span>
                      ) : (
                        <Link
                          href={`https://cdn.discordapp.com/avatar-decoration-presets/${responseData.avatarDecoration}`}
                          target="_blank"
                          className="underline"
                        >
                          Avatar Decoration
                        </Link>
                      )}
                    </div>

                    <div className="mt-4 flex gap-1 items-center text-sm ml-2 tracking-tight">
                      <PaintRoller className="size-5 text-muted-foreground" />
                      {!responseData.namePlate ? (
                        <span>No Nameplate</span>
                      ) : (
                        <Link
                          href={`https://cdn.discordapp.com/assets/collectibles/${responseData.namePlate}asset.webm`}
                          target="_blank"
                          className="underline"
                        >
                          Nameplate
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </main>

        <footer className="mt-6 text-right flex justify-end gap-2 w-full max-w-md">
          <Link
            target="_blank"
            href="https://discord.com/servers/uncover-it-1298592315694387220"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Image
              src="/discord.svg"
              alt="Discord"
              width="19"
              height="19"
              className="dark:brightness-100 brightness-0"
            />
          </Link>
          <Link
            target="_blank"
            href="https://github.com/WarFiN123/id-lookup"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Image
              src="/github.svg"
              alt="GitHub"
              width="19"
              height="19"
              className="dark:brightness-100 brightness-0"
            />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </div>
    </div>
  );
}
