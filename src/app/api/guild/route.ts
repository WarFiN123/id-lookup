import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { discordID } = await req.json();

  const preview = await fetch(
    `https://discord.com/api/v10/guilds/${discordID}/preview`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );

  if (!preview.ok) {
    return NextResponse.json(
      { error: preview.statusText },
      { status: preview.status }
    );
  }

  const widget = await fetch(
    `https://discord.com/api/v10/guilds/${discordID}/widget.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );

  const previewData = await preview.json();
  const widgetData = await widget.json();

  return NextResponse.json({
    preview: previewData,
    widget: widgetData,
  });
}
