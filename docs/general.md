# AI News Digest Bot - GENERAL Design Document

## Summary
This Telegram bot delivers a daily 8:00 AM morning digest of Technology and Science news headlines to subscribed users. It automates news curation using NewsAPI to fetch headlines from reputable sources, formats them into a concise digest, and manages user subscriptions via PostgreSQL. The target audience is professionals and enthusiasts seeking quick access to top tech/science news without customization options.

## Core Entities
- **User** (telegram_id, subscription_status, last_digest_time)
- **NewsArticle** (category, headline, source, url, fetch_time)
- **Subscription** (user_id, created_at, updated_at)

Relationships:
- One-to-many: User → Subscription
- Many-to-one: NewsArticle → Category (Tech/Science)
- Many-to-many: Subscription → NewsArticle (via digest delivery)

## External Dependencies
- **Telegram Bot API**: 
  - Command handling (/subscribe, /unsubscribe)
  - Scheduled message delivery
  - User message sending/receiving
- **NewsAPI**: 
  - Headline fetching with category filters
  - Source diversity within Tech/Science domains
- **PostgreSQL**: 
  - Subscription persistence
  - Digest delivery tracking
- **APScheduler**: Daily 8:00 AM task scheduling
- **Redis**: 24-hour API response caching

## Features
- `/subscribe` command to activate daily digest
- `/unsubscribe` command to cancel subscriptions
- Daily 8:00 AM digest containing:
  - 3-5 Technology category headlines
  - 3-5 Science category headlines
  - Embedded unsubscribe command in digest message
- Automatic NewsAPI headline fetching with 24-hour cache
- Subscription status tracking with opt-in/opt-out
- Digest delivery time enforcement (8:00 AM local time)
- Source attribution for each headline
- Silent error handling for failed deliveries

## Non-Goals
- No user authentication beyond Telegram ID
- No category customization or selection
- No article summarization beyond headlines
- No push notifications outside scheduled digest
- No payment integration for premium features
- No web interface or inline button interactions
- No historical news archive access
- No cross-platform notifications (only Telegram)