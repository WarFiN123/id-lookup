"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Send, Loader2Icon, Sun, MoonStar, ClockPlus } from "lucide-react";
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
import { DiscordUser } from "@/lib/types";
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
  const [responseData, setResponseData] = useState<DiscordUser | null>(null);
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
      console.log("Response Data:", response);
      setResponseData(response);
    } catch (error) {
      console.error(error);
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex flex-col items-center">
        <main className="flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl font-bold">
              Discord ID Lookup
            </h1>
            <p className="mt-2">
              Enter a Discord user/guild/message ID to get user information
            </p>
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
                {responseData.banner !== null ? (
                  <Image
                    src={`https://cdn.discordapp.com/banners/${currentID}/${responseData.banner}?size=1024`}
                    alt="Banner"
                    width={1024}
                    height={409}
                    className="rounded w-full h-[155px] object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-[155px] rounded"
                    style={{
                      backgroundColor: responseData.bannerColor
                        ? responseData.bannerColor
                        : "#1f1f1f",
                    }}
                  >
                    {responseData.bannerColor === null && (
                      <div className="flex items-center justify-center text-white tracking-wide h-full">
                        No Banner
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute top-[170px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:shadow-2xl">
                  <Avatar className="size-25 border-4 border">
                    <AvatarImage
                      src={`https://cdn.discordapp.com/avatars/${currentID}/${responseData.avatar}`}
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
                  {responseData.username && (
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
                        {responseData.guildTag}
                      </Link>
                    </Badge>
                  )}
                  {responseData.bot && (
                    <Badge variant="outline" className="ml-2 bg-green-600 text-white">
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
