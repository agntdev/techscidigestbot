export type SubscriptionStatus = 'subscribed' | 'unsubscribed';

export type ArticleCategory = 'technology' | 'science';

export interface User {
  telegram_id: number;
  subscription_status: SubscriptionStatus;
  timezone: string;
  last_digest_time: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface NewsArticle {
  id: number;
  category: ArticleCategory;
  headline: string;
  source: string;
  url: string;
  fetch_time: Date;
}

export interface Subscription {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
