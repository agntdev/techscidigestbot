import { Bot, Context } from "grammy";

export interface BotDependencies {
  isSubscribed: (telegramId: number) => Promise<boolean>;
  subscribe: (telegramId: number, timezone: string) => Promise<void>;
  unsubscribe: (telegramId: number) => Promise<void>;
}

const noopDeps: BotDependencies = {
  isSubscribed: async () => false,
  subscribe: async () => {},
  unsubscribe: async () => {},
};

function detectTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function createBot(
  token: string,
  deps: BotDependencies = noopDeps,
): Bot<Context> {
  const bot = new Bot<Context>(token);

  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Welcome! Use /subscribe to start receiving daily Tech & Science news at 8:00 AM",
    );
  });

  bot.command("subscribe", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (telegramId == null) return;

    const subscribed = await deps.isSubscribed(telegramId);
    if (subscribed) {
      await ctx.reply("You're already receiving daily digests! 🔄");
      return;
    }

    const timezone = detectTimezone();
    await deps.subscribe(telegramId, timezone);
    await ctx.reply(
      `You're now subscribed! 📰\n` +
        `Get your free daily Tech & Science news digest every morning at 8:00 AM ${timezone} 🚀\n` +
        `Use /unsubscribe anytime to cancel`,
    );
  });

  bot.command("unsubscribe", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (telegramId == null) return;

    const subscribed = await deps.isSubscribed(telegramId);
    if (!subscribed) {
      await ctx.reply(
        "You're not currently subscribed. Use /subscribe to start",
      );
      return;
    }

    await deps.unsubscribe(telegramId);
    await ctx.reply(
      "You've been unsubscribed. Miss the daily digest? Just say /subscribe anytime!",
    );
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith("/")) {
      await ctx.reply(
        "Hmm, I don't recognize that command. Use /subscribe or /unsubscribe to manage your preferences",
      );
      return;
    }

    await ctx.reply(
      "I can't process regular messages - use commands like /subscribe or /unsubscribe instead",
    );
  });

  return bot;
}

export function startBot(bot: Bot<Context>): void {
  bot.start({
    onStart: (botInfo) => {
      console.log(`Bot @${botInfo.username} is running`);
    },
  });
}
