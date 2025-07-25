import { NextRequest, NextResponse } from "next/server";

// comment the next line out if you're not using cloudflare pages
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { discordID } = await req.json();

  const response = await fetch(
    `https://discord.com/api/v9/users/${discordID}`,
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
