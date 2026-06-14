import type { NewsArticle } from './db/types';

export function formatDigestMessage(articles: NewsArticle[]): string {
  const techArticles = articles.filter((a) => a.category === 'technology');
  const scienceArticles = articles.filter((a) => a.category === 'science');

  const dateStr = new Date().toISOString().split('T')[0];
  const [year, month, day] = dateStr.split('-');
  const dateLabel = `${day}.${month}.${year}`;

  let message = `🌅 <b>Morning News Digest</b> — ${dateLabel}\n`;

  if (techArticles.length > 0) {
    message += `\n🔧 <b>Tech Headlines</b> (${techArticles.length}):\n`;
    techArticles.forEach((article, i) => {
      message += `\n${i + 1}. <a href="${escapeHtml(article.url)}">${escapeHtml(article.headline)}</a>\n`;
      message += `   📰 <i>${escapeHtml(article.source)}</i>`;
    });
    message += '\n';
  }

  if (scienceArticles.length > 0) {
    message += `\n🧬 <b>Science Headlines</b> (${scienceArticles.length}):\n`;
    scienceArticles.forEach((article, i) => {
      message += `\n${i + 1}. <a href="${escapeHtml(article.url)}">${escapeHtml(article.headline)}</a>\n`;
      message += `   📰 <i>${escapeHtml(article.source)}</i>`;
    });
    message += '\n';
  }

  message += '\nUse /unsubscribe to stop receiving digests';

  return message;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}