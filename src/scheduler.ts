import { scheduleJob } from 'node-schedule';
import type { Bot, Context } from 'grammy';
import { fetchTechScienceHeadlines } from './news';
import { formatDigestMessage } from './digest';

interface SubscribedUser {
  telegramId: number;
  timezone: string;
}

function getLocalHourMinute(timezone: string): { hour: number; minute: number } | null {
  try {
    const parts = new Date()
      .toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false })
      .split(':');
    return { hour: parseInt(parts[0], 10), minute: parseInt(parts[1], 10) };
  } catch {
    return null;
  }
}

export function scheduleDailyDigest(
  bot: Bot<Context>,
  getSubscribedUsers: () => Promise<SubscribedUser[]>,
): void {
  const sentDigests = new Map<string, Set<number>>();

  scheduleJob('*/1 * * * *', async () => {
    try {
      const users = await getSubscribedUsers();
      if (users.length === 0) return;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      for (const [date, _set] of sentDigests) {
        if (date !== todayStr) sentDigests.delete(date);
      }

      if (!sentDigests.has(todayStr)) sentDigests.set(todayStr, new Set());
      const todaySet = sentDigests.get(todayStr)!;

      const eligible: number[] = [];
      for (const user of users) {
        if (todaySet.has(user.telegramId)) continue;

        const hm = getLocalHourMinute(user.timezone);
        if (hm && hm.hour === 8 && hm.minute === 0) {
          eligible.push(user.telegramId);
        }
      }

      if (eligible.length === 0) return;

      const articles = await fetchTechScienceHeadlines();
      if (articles.length === 0) return;

      const message = formatDigestMessage(articles);

      for (const userId of eligible) {
        try {
          await bot.api.sendMessage(userId, message, { parse_mode: 'HTML' });
          todaySet.add(userId);
        } catch {
          // silent
        }
      }
    } catch {
      // silent
    }
  });
}
