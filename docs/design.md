# AI News Digest Bot - UX SPEC Document

## COMMAND TREE
| Command | Description | Access | Response |
|---------|-------------|--------|----------|
| `/start` | Initialize bot interaction | All users | "Welcome! Use /subscribe to start receiving daily Tech & Science news at 8:00 AM" |
| `/subscribe` | Activate daily digest | Unsubscribed users | "You're now subscribed! Get your free daily Tech & Science news digest every morning at 8:00 AM 🚀" |
| `/unsubscribe` | Cancel subscription | Subscribed users | "You've been unsubscribed. Miss the daily digest? Just say /subscribe anytime!" |

## DIALOG STATE MACHINE
**States:**
1. **Initial** (New user interaction)
2. **Subscribed** (Active daily digest recipient)
3. **Unsubscribed** (Inactive user)

**Transitions:**
- `/subscribe` → Initial → Subscribed
- `/unsubscribe` → Subscribed → Unsubscribed
- `/subscribe` → Unsubscribed → Subscribed

## INLINE-KEYBOARD LAYOUT
**No buttons used** (per "commands only" requirement). All interactions use command syntax.

## MESSAGE COPY & TONE
### Subscription Confirmation
```
You're now subscribed! 📰
Get your free daily Tech & Science news digest every morning at 8:00 AM 🚀
Use /unsubscribe anytime to cancel
```

### Daily Digest Format
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

### Error Messages
- Unknown command: "Hmm, I don't recognize that command. Use /subscribe or /unsubscribe to manage your preferences"
- Already subscribed: "You're already receiving daily digests! 🔄"
- Not subscribed: "You're not currently subscribed. Use /subscribe to start"

## EDGE CASES
1. **Invalid Input Handling**
   - Any non-command messages: "I can't process regular messages - use commands like /subscribe or /unsubscribe instead"
   - Malformed commands: "Unknown command format. Try /subscribe or /unsubscribe"

2. **Subscription Management**
   - Double subscription attempt: "You're already subscribed to the news digest"
   - Unsubscribe without subscription: "You're not currently subscribed"

3. **News API Failures**
   - Silent failure with cached content: No visible warning, digest delivery suppressed
   - Complete API outage: No visible warning, digest delivery suppressed

4. **Time Zone Handling**
   - Automatic local time detection: "Your digest will arrive at 8:00 AM [Your Time Zone]"

5. **Database Errors**
   - Subscription persistence failure: No visible warning, digest delivery suppressed

## i18n STRINGS
**Translatable strings (marked with `[[ ]]`):**
- Subscription confirmation: "You're now subscribed! Get your free daily [[Tech]] & [[Science]] news digest..."
- Daily digest header: "🌅 Morning [[News]] Digest - [[Date]]"
- Category labels: "🔧 [[Technology]] Headlines", "🧬 [[Science]] Headlines"
- Error messages: "Hmm, I don't recognize that command. Use /subscribe or /unsubscribe to manage your preferences"
- Unsubscribe prompt: "Use /unsubscribe to stop receiving digests"

**Non-translatable elements:**
- Command syntax (/subscribe, /unsubscribe)
- Time format (8:00 AM)
- Technical terms (Telegram ID, PostgreSQL)
- API-specific content (NewsAPI sources)