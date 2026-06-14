import type { NewsArticle, ArticleCategory } from './db/types';

const NEWSAPI_BASE = 'https://newsapi.org/v2/top-headlines';

function apiKey(): string | undefined {
  return process.env.NEWSAPI_KEY;
}

interface NewsApiSource {
  id: string | null;
  name: string;
}

interface NewsApiArticle {
  source: NewsApiSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

async function fetchCategory(category: ArticleCategory, key: string): Promise<NewsArticle[]> {
  const url = `${NEWSAPI_BASE}?category=${category}&pageSize=5&apiKey=${key}`;

  let data: NewsApiResponse;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    data = (await res.json()) as NewsApiResponse;
  } catch {
    return [];
  }

  if (data.status !== 'ok') return [];

  const now = new Date();
  return data.articles.slice(0, 5).map((article) => ({
    id: 0,
    category,
    headline: article.title,
    source: article.source.name,
    url: article.url,
    fetch_time: now,
  }));
}

export async function fetchTechScienceHeadlines(
  key?: string,
): Promise<NewsArticle[]> {
  const effectiveKey = key ?? apiKey();
  if (!effectiveKey) return [];

  const [tech, science] = await Promise.all([
    fetchCategory('technology', effectiveKey),
    fetchCategory('science', effectiveKey),
  ]);

  return [...tech, ...science];
}
