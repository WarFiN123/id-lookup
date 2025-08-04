import { checkBotId } from "botid/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { discordID } = await req.json();

  const preview = await fetch(
    `https://discord.com/api/v10/guilds/${discordID}/preview`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      cache: "force-cache",
    }
  );

  const widget = await fetch(
    `https://discord.com/api/v10/guilds/${discordID}/widget.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      cache: "force-cache",
    }
  );

  const previewData = await preview.json();
  const widgetData = await widget.json();

  if (widget.status === 404 && preview.status === 404) {
    return NextResponse.json(
      { error: "Guild Not Found" },
      { status: 404 }
    );
  } else {
    return NextResponse.json({
      preview: previewData,
      widget: widgetData,
    });
  }
}
