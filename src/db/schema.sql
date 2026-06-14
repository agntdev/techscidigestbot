-- PostgreSQL schema for AI News Digest Bot

CREATE TYPE subscription_status AS ENUM ('subscribed', 'unsubscribed');

CREATE TYPE article_category AS ENUM ('technology', 'science');

CREATE TABLE users (
    telegram_id BIGINT PRIMARY KEY,
    subscription_status subscription_status NOT NULL DEFAULT 'unsubscribed',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    last_digest_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    category article_category NOT NULL,
    headline TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    fetch_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_fetch_time ON news_articles(fetch_time);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
