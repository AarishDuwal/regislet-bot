# Regislet Bot — Setup & Railway Deployment Guide

---

## 🐛 Token Error Fix (Most Important!)

Your original `.env` had:
```
TOKEN=your_bot_token_here
```
But your code was reading `process.env.DISCORD_TOKEN`.
**They didn't match** — that's why Railway kept failing.

The fixed `.env` now uses:
```
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_server_id_here
```

---

## 📦 What Was Improved

| Area | Before | After |
|------|--------|-------|
| Token bug | `TOKEN=` in `.env` but code reads `DISCORD_TOKEN` | Fixed — both use `DISCORD_TOKEN` |
| Startup validation | Silent failure | Exits with clear error message if token is missing |
| Embed style | Basic fields | Better layout with spacers, quoted description, bullet points |
| Error embeds | Basic red embed | Shows helpful tip about autocomplete |
| Pagination cache | `client._paginationCache` (messy) | Proper `Map` with 10-min TTL |
| Pagination buttons | No page indicator | Shows current page number on the button |
| Button IDs | Could conflict between commands | Prefixed (`loc_`, `list_`) to avoid collisions |
| Help command | None | New `/regislet_help` command |
| Bot status | None | Shows "Watching X regislets" status |
| Global error handling | None | `unhandledRejection` handler added |
| Login error | Silent | Clear message with fix hint |

---

## ⚡ Quick Local Setup (VS Code)

### Step 1 — Install prerequisites

1. Install **Node.js 18+** from https://nodejs.org (LTS version)
2. Install **VS Code** from https://code.visualstudio.com
3. Open VS Code

### Step 2 — Open the project

1. In VS Code, go to **File → Open Folder**
2. Select the `regislet-bot` folder

### Step 3 — Open the terminal

Press `` Ctrl+` `` (backtick) to open the integrated terminal.

### Step 4 — Install dependencies

```bash
npm install
```

### Step 5 — Create your `.env` file

In the VS Code file explorer (left sidebar), right-click and create a new file named `.env`.

Paste this into it:

```
DISCORD_TOKEN=your_actual_token_here
GUILD_ID=your_server_id_here
```

**How to get your bot token:**
1. Go to https://discord.com/developers/applications
2. Select your app (or create a new one)
3. Click **Bot** in the left menu
4. Click **Reset Token** → Copy it
5. Paste it after `DISCORD_TOKEN=`

**How to get your Guild (Server) ID:**
1. In Discord, go to **Settings → Advanced → Enable Developer Mode**
2. Right-click your server icon → **Copy Server ID**
3. Paste it after `GUILD_ID=`

### Step 6 — Run the bot locally

```bash
npm start
```

You should see:
```
✅ Logged in as YourBot#0000 (123456789)
📦 Loaded 150 regislets
✅ Slash commands registered (guild-specific — instant).
```

If you see `❌ DISCORD_TOKEN is missing` — double-check your `.env` file has no spaces around `=`.

---

## 🚀 Deploy to Railway

### Step 1 — Push your code to GitHub

If you haven't already:

```bash
cd regislet-bot
git init
git add .
git commit -m "Initial commit"
```

Then create a new repository on https://github.com/new and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/regislet-bot.git
git branch -M main
git push -u origin main
```

> ⚠️ Make sure `.gitignore` contains `node_modules/` and `.env` — never push your token to GitHub!

### Step 2 — Create a Railway account

Go to https://railway.app and sign up (free with GitHub login).

### Step 3 — Create a new project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your `regislet-bot` repository
4. Railway will automatically detect it's a Node.js app

### Step 4 — Set environment variables (THE FIX)

This is where the token error was happening before — Railway needs the variables set in its dashboard, **not** from your `.env` file (`.env` is only for local development).

1. In your Railway project, click on the **service** (the box with your bot's name)
2. Click the **Variables** tab
3. Click **New Variable** and add:

| Variable Name | Value |
|--------------|-------|
| `DISCORD_TOKEN` | Your full bot token |
| `GUILD_ID` | Your server ID |

> ✅ **This is why it was failing before** — the old code used `TOKEN` but you need to set `DISCORD_TOKEN` in Railway's Variables tab.

### Step 5 — Deploy

1. Click the **Deploy** button (or it may deploy automatically after you set variables)
2. Click **View Logs** to watch the startup output
3. You should see:
   ```
   ✅ Logged in as YourBot#0000
   ✅ Slash commands registered (guild-specific — instant).
   ```

### Step 6 — Keep the bot alive (optional)

Railway's free tier sleeps services after inactivity. To prevent this:
- Upgrade to a paid plan, OR
- The bot uses persistent WebSocket to Discord, so it should stay awake as long as it's running.

---

## ❓ Troubleshooting

### "❌ DISCORD_TOKEN is missing"
- Local: Check your `.env` file — it must say `DISCORD_TOKEN=` (not `TOKEN=`)
- Railway: Go to your project → Variables tab → add `DISCORD_TOKEN`

### "❌ Failed to log in: An invalid token was provided"
- Your token is wrong or expired
- Go to Discord Developer Portal → Bot → Reset Token → copy the new one
- Update it in Railway's Variables tab

### "Failed to register commands"
- Make sure your bot has the `applications.commands` scope when you invite it
- Re-invite the bot using the OAuth2 URL Generator with `bot` + `applications.commands` scopes

### Slash commands not appearing in Discord
- If `GUILD_ID` is set: commands appear instantly after restart
- If `GUILD_ID` is not set: commands are global and take up to 1 hour

---

## 🔑 Bot Invite URL

In the Discord Developer Portal:
1. Go to **OAuth2 → URL Generator**
2. Check **bot** and **applications.commands**
3. Under Bot Permissions check: **Send Messages**, **Use Slash Commands**, **Embed Links**
4. Copy the generated URL and open it to invite the bot to your server
