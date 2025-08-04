# Discord User/Guild Lookup

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Get started
First, clone the repository:

```bash
git clone https://github.com/WarFiN123/id-lookup && cd id-lookup
```

Then, install all dependencies:

```bash
pnpm install
```

Create a `.env.local` file in the root directory with the value:
```
BOT_TOKEN=<BOT_TOKEN_HERE>
```

Finally, run the development environment by running:
```bash
pnpm run dev
```

# Self-Hosting
## Vercel (Recommended)
### Step 1
Visit `https://vercel.com/new/git/third-party`, paste in `https://github.com/WarFiN123/id-lookup/` and press `Continue`
<img width="719" height="295" alt="image" src="https://github.com/user-attachments/assets/15cbe4e7-4cbe-466e-b0a0-d96bf846f6e1" />

### Step 2
Add your `BOT_TOKEN` as an environmental variable and hit `Deploy`
<img width="705" height="909" alt="image" src="https://github.com/user-attachments/assets/fdcbddf7-309a-4f70-ad9a-0685c964bf70" />

### Recommended settings
Go to the `Firewall` tab and enable `Bot Protection`
<img width="1312" height="258" alt="image" src="https://github.com/user-attachments/assets/8c5c597b-1d71-48bd-9607-4a4b701d111f" />
You can even set a [custom domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

## Cloudflare Pages (More complex)
### Step 1: Fork this repo.
### Step 2: Run `pnpm uninstall botid`
### Step 3: Delete `/src/instrumentation-client.ts`
### Step 4: Edit `next.config.ts`
Replace all the contents of `next.config.ts` with this:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;
```
### Step 5: Edit `src/app/api/user/route.ts` and `src/app/api/guild/route.ts`
1. Delete the ```import { checkBotId } from "botid/server";``` import on top of the page and delete
```ts
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
```

2. Define edge runtime below the imports
```ts
import { NextRequest, NextResponse } from "next/server";

const runtime = "edge"; // cloudflare pages only supports edge runtime for dynamic routes
```


### Step 6: Head over to ```https://dash.cloudflare.com``` and the `Workers & Pages` tab under `Compute (Workers)`
<img width="254" height="252" alt="image" src="https://github.com/user-attachments/assets/1f90d6ea-535c-4457-9409-dabd6f76988f" />

### Step 7: Create a new page
<img width="664" height="512" alt="image" src="https://github.com/user-attachments/assets/f21d1b77-5db0-49cf-9879-17288bfd70b6" />

### Step 8: Choose your GitHub/GitLab repo with the modified code above
<img width="1031" height="884" alt="image" src="https://github.com/user-attachments/assets/7d351aa0-1c05-4fe9-b47f-6ef385a08c92" />

### Step 9: Select `Next.js` as your framework and declare environmental variables
<img width="975" height="841" alt="image" src="https://github.com/user-attachments/assets/4110d2b8-e076-412f-b730-621556628fa1" />

### Step 10: Add the `nodejs_compat` Compatibility flag under the pages settings
<img width="1136" height="343" alt="image" src="https://github.com/user-attachments/assets/020269e6-0cc3-494d-aca0-3b37eaafa2b9" />

## Similar Projects
- [DiscordLookup](https://discordlookup.com/) (recommended) by [Felix](https://github.com/fbrettnich)
- [discord.id](https://discord.id/) by [Nerrix](https://nerrix.ovh/)
