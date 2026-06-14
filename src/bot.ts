import { Bot, Context } from "grammy";
import {
  registerSubscriptionCommands,
  SubscriptionDeps,
} from "./commands/subscription";

export interface BotDependencies extends SubscriptionDeps {}

const noopDeps: BotDependencies = {
  isSubscribed: async () => false,
  subscribe: async () => {},
  unsubscribe: async () => {},
};

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

  registerSubscriptionCommands(bot, deps);

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
