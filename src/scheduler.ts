import { scheduleJob } from 'node-schedule';
import type { Bot, Context } from 'grammy';
import { fetchTechScienceHeadlines } from './news';
import type { NewsArticle } from './db/types';

export function formatDigestMessage(articles: NewsArticle[]): string {
  const techArticles = articles.filter((a) => a.category === 'technology');
  const scienceArticles = articles.filter((a) => a.category === 'science');

  const dateStr = new Date().toISOString().split('T')[0];

  let message = `🌅 Morning News Digest - ${dateStr}\n`;

  if (techArticles.length > 0) {
    message += '\n🔧 Tech Headlines:\n';
    techArticles.forEach((a, i) => {
      message += `${i + 1}. ${a.headline} (${a.source})\n`;
    });
  }

  if (scienceArticles.length > 0) {
    message += '\n🧬 Science Headlines:\n';
    scienceArticles.forEach((a, i) => {
      message += `${i + 1}. ${a.headline} (${a.source})\n`;
    });
  }

  message += '\nUse /unsubscribe to stop receiving digests';

  return message;
}

export function scheduleDailyDigest(
  bot: Bot<Context>,
  getSubscribedUserIds: () => Promise<number[]>,
): void {
  scheduleJob('0 8 * * *', async () => {
    try {
      const articles = await fetchTechScienceHeadlines();
      const userIds = await getSubscribedUserIds();

      if (articles.length === 0 || userIds.length === 0) return;

      const message = formatDigestMessage(articles);

      for (const userId of userIds) {
        try {
          await bot.api.sendMessage(userId, message);
        } catch {
          // silent
        }
      }
    } catch {
      // silent
    }
  });
}
