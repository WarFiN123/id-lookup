"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Send, Loader2Icon, Sun, MoonStar } from "lucide-react";
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

export default function Page() {
  const [discordID, setDiscordID] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  const isValidID = (idString: string) => {
    const regex = /^\d{17,20}$/;
    return regex.test(idString);
  };

  const handleLookup = async () => {
    setLoading(true);
    const response = await getDetails(discordID);
    setLoading(false);
    console.log(response);
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
                  onClick={handleLookup}
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
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
            href="https://github.com/WarFiN123/webhook-multitool"
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
