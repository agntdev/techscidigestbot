import type { NewsArticle } from './db/types';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatHeadlines(articles: NewsArticle[]): string {
  return articles
    .map((a, i) => `${i + 1}. ${a.headline} (${a.source})`)
    .join('\n');
}

export function formatDigestMessage(
  articles: NewsArticle[],
  date?: Date,
): string {
  const digestDate = date ?? new Date();

  const tech = articles.filter((a) => a.category === 'technology');
  const science = articles.filter((a) => a.category === 'science');

  const parts: string[] = [
    `🌅 Morning News Digest - ${formatDate(digestDate)}`,
  ];

  if (tech.length > 0) {
    parts.push('', '🔧 Tech Headlines:', formatHeadlines(tech));
  }

  if (science.length > 0) {
    parts.push('', '🧬 Science Headlines:', formatHeadlines(science));
  }

  parts.push('', 'Use /unsubscribe to stop receiving digests');

  return parts.join('\n');
}
