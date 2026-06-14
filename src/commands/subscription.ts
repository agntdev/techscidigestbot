import { Bot } from "grammy";

export interface SubscriptionDeps {
  isSubscribed: (telegramId: number) => Promise<boolean>;
  subscribe: (telegramId: number) => Promise<void>;
  unsubscribe: (telegramId: number) => Promise<void>;
}

export function registerSubscriptionCommands(
  bot: Bot<any>,
  deps: SubscriptionDeps,
): void {
  bot.command("subscribe", async (ctx) => {
    const telegramId = ctx.from?.id;
    if (telegramId == null) return;

    const subscribed = await deps.isSubscribed(telegramId);
    if (subscribed) {
      await ctx.reply("You're already receiving daily digests! 🔄");
      return;
    }

    await deps.subscribe(telegramId);
    await ctx.reply(
      "You're now subscribed! 📰\n" +
        "Get your free daily Tech & Science news digest every morning at 8:00 AM 🚀\n" +
        "Use /unsubscribe anytime to cancel",
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
}
