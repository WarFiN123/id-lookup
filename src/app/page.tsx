"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2Icon } from "lucide-react";
import { getDetails } from "@/app/api/client";

export default function Page() {
  const [discordID, setDiscordID] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl font-bold">Discord ID Lookup</h1>
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
    </div>
  );
}
