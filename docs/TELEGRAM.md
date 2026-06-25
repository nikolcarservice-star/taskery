# Telegram bots (user + admin)

Taskery uses **two separate Telegram bots**:

| Bot | Env prefix | Who connects | Purpose |
|-----|------------|--------------|---------|
| **User bot** | `TELEGRAM_BOT_*` | Clients & freelancers | Messages, bids, deals |
| **Admin bot** | `TELEGRAM_ADMIN_BOT_*` | Administrators only | Moderation/finance alerts + inline actions |

## 1. Create bots in @BotFather

1. `/newbot` → name e.g. `Taskery` → username e.g. `TaskeryBot`  
   → save `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`

2. `/newbot` → name e.g. `Taskery Admin` → username e.g. `TaskeryAdminBot`  
   → save `TELEGRAM_ADMIN_BOT_TOKEN`, `TELEGRAM_ADMIN_BOT_USERNAME`

Do **not** publish the admin bot username on the public site.

## 2. Environment variables

Add to `.env.local` (dev) or production env:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# User bot
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_BOT_USERNAME=TaskeryBot
TELEGRAM_WEBHOOK_SECRET=random-secret-user

# Admin bot
TELEGRAM_ADMIN_BOT_TOKEN=789012:XYZ...
TELEGRAM_ADMIN_BOT_USERNAME=TaskeryAdminBot
TELEGRAM_ADMIN_WEBHOOK_SECRET=random-secret-admin

# Optional: whitelist Telegram user IDs (comma-separated)
# TELEGRAM_ADMIN_ALLOWED_USER_IDS=123456789
```

Generate secrets: `openssl rand -hex 32` (or any long random string).

### Optional whitelist

To restrict the admin bot to specific Telegram accounts:

1. Message [@userinfobot](https://t.me/userinfobot) → copy your numeric **Id**
2. Set `TELEGRAM_ADMIN_ALLOWED_USER_IDS=your_id,other_admin_id`

If empty, any linked admin account can use the bot.

## 3. Database

After pulling code with schema changes:

```bash
npx prisma db push
```

## 4. Register webhooks

Site must be reachable over HTTPS (production or tunnel).

```bash
node scripts/setup-telegram-webhooks.mjs
```

This registers:

- User bot → `{SITE_URL}/api/telegram/webhook`
- Admin bot → `{SITE_URL}/api/telegram/admin-webhook`

## 5. Connect accounts

### Users (clients / freelancers)

1. Open **Settings** in dashboard (`/dashboard/settings` or `/client/settings`)
2. **Connect Telegram** → open user bot → confirm `/start`

### Admins

1. Open **Admin → Overview** (`/admin/overview`)
2. **Connect admin bot** → open admin bot → confirm `/start`
3. Each admin connects their own Telegram; alerts respect `adminPermissions`

## 6. Admin bot commands

| Command | Permission | Description |
|---------|------------|-------------|
| `/help` | any admin | Command list |
| `/pending` | MODERATION | Projects awaiting moderation |
| `/reports` | MODERATION | Open reports count |
| `/withdrawals` | FINANCE | Pending withdrawal requests |

Notifications include inline buttons:

- **Project moderation** → Approve / Reject
- **Withdrawal request** → Approve / Reject
- **Reports / disputes** → Open in admin panel (link only)

## 7. Local development

Telegram requires HTTPS for webhooks. Options:

1. Deploy to staging and run `setup-telegram-webhooks.mjs` there
2. Use a tunnel (Cloudflare, ngrok) pointing to `localhost:3000`, set `NEXT_PUBLIC_SITE_URL` to tunnel URL, then run setup script

## 8. Verify

```bash
node scripts/prod-check.mjs
```

Test flow:

1. Submit a project for moderation → admin receives Telegram message with buttons
2. Tap **Approve** → project becomes `OPEN`
3. User receives a new message notification in the **user** bot (if connected)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Webhook 403 | `TELEGRAM_*_WEBHOOK_SECRET` must match `secret_token` in `setWebhook` |
| Admin bot “Доступ закрыт” | Connect via `/admin/overview`, check `adminActive` and whitelist |
| No user notifications | User must connect **user** bot, enable toggles in settings |
| Buttons do nothing | Check server logs; admin needs MODERATION or FINANCE permission |
