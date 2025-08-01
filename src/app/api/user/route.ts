import { checkBotId } from "botid/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { discordID } = await req.json();

  const response = await fetch(
    `https://discord.com/api/v10/users/${discordID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: response.statusText },
      { status: response.status }
    );
  }
  const data = await response.json();
  return NextResponse.json(data);
}
