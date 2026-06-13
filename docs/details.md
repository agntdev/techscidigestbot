# AI News Digest Bot - DETAILS Design Document

## SCREENS

### 1. Initial State Screen
**Trigger**: `/start` command from new user  
**Message**:  
```
Welcome! Use /subscribe to start receiving daily Tech & Science news at 8:00 AM
```  
**Transitions**:  
- `/subscribe` → Subscribed State Screen  

---

### 2. Subscribed State Screen
**Trigger**:  
- `/subscribe` command from unsubscribed user  
- Daily 8:00 AM digest delivery  

**Message**:  
**Subscription Confirmation**:  
```
You're now subscribed! 📰
Get your free daily Tech & Science news digest every morning at 8:00 AM 🚀
Use /unsubscribe anytime to cancel
```

**Daily Digest Format**:  
```
🌅 Morning News Digest - [[Date]]

🔧 Tech Headlines:
1. [Headline 1] (Source)
2. [Headline 2] (Source)
...

🧬 Science Headlines:
1. [Headline 1] (Source)
2. [Headline 2] (Source)
...

Use /unsubscribe to stop receiving digests
```

**Transitions**:  
- `/unsubscribe` → Unsubscribed State Screen  
- Any other command → Error Screen  

---

### 3. Unsubscribed State Screen
**Trigger**: `/unsubscribe` command from subscribed user  
**Message**:  
```
You've been unsubscribed. Miss the daily digest? Just say /subscribe anytime!
```  
**Transitions**:  
- `/subscribe` → Subscribed State Screen  

---

### 4. Error Screen
**Triggers**:  
- Unknown command  
- Invalid input  
- Subscription state conflicts  

**Messages**:  
- **Unknown Command**:  
  ```
  Hmm, I don't recognize that command. Use /subscribe or /unsubscribe to manage your preferences
  ```
- **Already Subscribed**:  
  ```
  You're already receiving daily digests! 🔄
  ```
- **Not Subscribed**:  
  ```
  You're not currently subscribed. Use /subscribe to start
  ```
- **Malformed Command**:  
  ```
  Unknown command format. Try /subscribe or /unsubscribe
  ```

---

## COMPONENTS

### 1. Daily Digest Message Component
**Template**:  
```
🌅 Morning News Digest - {formatted_date}

🔧 Tech Headlines:
{tech_headlines_list}

🧬 Science Headlines:
{science_headlines_list}

Use /unsubscribe to stop receiving digests
```

**Requirements**:  
- 3-5 headlines per category  
- Source attribution in parentheses  
- Date formatted as "YYYY-MM-DD"  
- Headlines ordered by NewsAPI relevance  

---

### 2. Error Message Component
**Predefined Templates**:  
- "I can't process regular messages - use commands like /subscribe or /unsubscribe instead"  
- "Hmm, I don't recognize that command. Use /subscribe or /unsubscribe to manage your preferences"  
- "Unknown command format. Try /subscribe or /unsubscribe"  

---

## TRANSITIONS

| Current State | Input/Event | Next State | Side Effects |
|---------------|-------------|------------|--------------|
| Initial | `/subscribe` | Subscribed | Insert user into PostgreSQL subscriptions table |
| Subscribed | `/unsubscribe` | Unsubscribed | Delete user from subscriptions table |
| Unsubscribed | `/subscribe` | Subscribed | Reinsert user into subscriptions table |
| Subscribed | Daily 8:00 AM (local time) | Subscribed | Fetch and send digest message |
| Any State | Unknown command | Same state | Display appropriate error message |
| Any State | Non-command message | Same state | Display "I can't process regular messages..." error |

---

## DATA MODEL

### Entities
1. **User**  
   - `telegram_id` (Primary Key)  
   - `subscription_status` (ENUM: 'subscribed', 'unsubscribed')  
   - `last_digest_time` (TIMESTAMP)  

2. **NewsArticle**  
   - `category` (ENUM: 'technology', 'science')  
   - `headline` (TEXT)  
   - `source` (TEXT)  
   - `url` (URL)  
   - `fetch_time` (TIMESTAMP)  

3. **Subscription**  
   - `user_id` (Foreign Key to User)  
   - `created_at` (TIMESTAMP)  
   - `updated_at` (TIMESTAMP)  

**Persistence Rules**:  
- Subscription status persisted in PostgreSQL  
- News articles cached in Redis for 24 hours  
- Digest delivery time tracked per user  

---

## ACCEPTANCE NOTES

1. **Subscription Management**  
   - `/subscribe` must transition user to "subscribed" state and store in PostgreSQL  
   - `/unsubscribe` must transition user to "unsubscribed" state and remove from PostgreSQL  
   - Double subscription attempts must return "You're already receiving daily digests!"  

2. **Digest Delivery**  
   - Daily 8:00 AM message must include exactly 3-5 headlines per category  
   - Digest must include source attribution for each headline  
   - Unsubscribe command must be present in every digest message  

3. **Error Handling**  
   - Non-command messages must trigger "I can't process regular messages..."  
   - API failures during headline fetching must suppress digest without user notification  
   - Database errors during subscription updates must suppress errors and fail silently  

4. **Caching Behavior**  
   - NewsAPI responses must be cached for 24 hours  
   - Cache must be invalidated at 8:00 AM daily before digest generation  

5. **Time Zone Handling**  
   - Digest delivery must use user's local 8:00 AM time  
   - Time zone must be dynamically detected from Telegram user profile